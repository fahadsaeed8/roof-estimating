// hooks/useUndoRedo.tsx
import { useCallback, useState } from "react";
import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";
// import { toFeetInches } from "../components/MapContainer"; // agar helper alag file me hai
import { EdgeItem, PolygonPoint } from "./MapContainer";
import { clearLabels, toFeetInches, normalizeBearing } from "./mapHelper";

interface UndoRedoHookProps {
  drawRef: any;
  mapRef: any;
  labelsRef: any;
  setPlanAreaLocal: (v: number) => void;
  setRoofAreaLocal: (v: number) => void;
  setEdgesLocal: (v: EdgeItem[]) => void;
  undoStackRef: any;
  redoStackRef: any;
  awaitingSplitRef: any;
  clearLabels: () => void;
  setShowGrid: (v: boolean) => void;
  onGridToggle?: (v: boolean) => void;
  onMeasurementsChange: (data: {
    edges: EdgeItem[];
    planArea: number;
    roofArea: number;
    polygonPoints: PolygonPoint[];
  }) => void;
  onBearingChange?: (bearing: number) => void;
  setCurrentBearing: (bearing: number) => void;
}

export const useUndoRedo = ({
  drawRef,
  mapRef,
  labelsRef,
  setPlanAreaLocal,
  setRoofAreaLocal,
  setEdgesLocal,
  undoStackRef,
  redoStackRef,
  awaitingSplitRef,
  clearLabels,
  setShowGrid,
  onGridToggle,
  onMeasurementsChange,
  onBearingChange,
  setCurrentBearing,
}: UndoRedoHookProps) => {
  const [drawMode, setDrawModeState] = useState<string>("");

  // ---------------- UPDATE MEASUREMENTS ----------------
  const updateMeasurements = useCallback(() => {
    if (!drawRef.current) return;
    const data = drawRef.current.getAll();
    clearLabels(labelsRef);

    if (!data || !data.features || data.features.length === 0) {
      setPlanAreaLocal(0);
      setRoofAreaLocal(0);
      setEdgesLocal([]);
      onMeasurementsChange({
        edges: [],
        planArea: 0,
        roofArea: 0,
        polygonPoints: [],
      });
      return;
    }

    const map = mapRef.current;
    if (map) {
      map.on("rotate", () => {
        const bearing = map.getBearing();
        setCurrentBearing(bearing);
        if (onBearingChange) onBearingChange(bearing);
      });
    }

    const allEdges: EdgeItem[] = [];
    let totalAreaMeters = 0;
    const polygonPointsAcc: PolygonPoint[] = [];

    data.features.forEach((feature: any, fIndex: number) => {
      if (!feature.geometry) return;
      if (feature.geometry.type === "Polygon") {
        const coords: number[][] = feature.geometry.coordinates[0];
        let areaSqMeters = 0;
        try {
          areaSqMeters = turf.area(feature);
        } catch {
          areaSqMeters = 0;
        }
        totalAreaMeters += areaSqMeters;

        let perimeterFeet = 0;
        coords.forEach((c, i) => {
          if (i < coords.length - 1) {
            const from = turf.point(c);
            const to = turf.point(coords[i + 1]);
            const lengthFeet = turf.distance(from, to, { units: "feet" });
            perimeterFeet += lengthFeet;

            allEdges.push({
              id: `side-${fIndex}-${i}`,
              length: lengthFeet,
              type: "edge",
            });

            try {
              const midpoint = turf.midpoint(from, to).geometry.coordinates as [
                number,
                number
              ];
              const el = document.createElement("div");
              el.innerText = toFeetInches(lengthFeet);
              Object.assign(el.style, {
                background: "white",
                color: "black",
                padding: "1px 3px",
                fontSize: "12px",
                borderRadius: "8px",
                boxShadow: "0 0 3px rgba(0,0,0,0.3)",
                fontWeight: "700",
                whiteSpace: "nowrap",
              });

              const marker = new mapboxgl.Marker({
                element: el,
                anchor: "center",
              })
                .setLngLat(midpoint)
                .addTo(mapRef.current!);

              labelsRef.current.push(marker);
            } catch {}
            polygonPointsAcc.push({ lat: c[1], lon: c[0], seq: i + 1 });
          }
        });

        // center label
        try {
          const center = turf.centerOfMass(feature).geometry.coordinates as [
            number,
            number
          ];
          const div = document.createElement("div");
          div.innerText = `${perimeterFeet.toFixed(2)} ft`;
          Object.assign(div.style, {
            background: "white",
            color: "black",
            padding: "3px 5px",
            fontSize: "12px",
            borderRadius: "8px",
            boxShadow: "0 0 4px rgba(0,0,0,0.35)",
            fontWeight: "700",
            whiteSpace: "pre-line",
          });

          const marker = new mapboxgl.Marker({ element: div, anchor: "center" })
            .setLngLat(center)
            .addTo(mapRef.current!);

          labelsRef.current.push(marker);
        } catch {}
      }
    });

    const totalAreaSqFt = totalAreaMeters * 10.7639;
    setPlanAreaLocal(totalAreaSqFt);
    setRoofAreaLocal(totalAreaSqFt);
    setEdgesLocal(allEdges);

    onMeasurementsChange({
      edges: allEdges,
      planArea: totalAreaSqFt,
      roofArea: totalAreaSqFt,
      polygonPoints: polygonPointsAcc,
    });
  }, []);

  // ---------------- UNDO / REDO ----------------
  const restoreSnapshot = (snapshot: any) => {
    if (!drawRef.current) return;
    try {
      drawRef.current.deleteAll();
      if (!snapshot?.features) return;
      snapshot.features.forEach((f: any) => drawRef.current?.add(f));
    } catch (err) {
      console.warn("restoreSnapshot error", err);
    }
  };

  const undo = () => {
    if (!drawRef.current) return;
    const stack = undoStackRef.current;
    if (!stack.length) return;
    try {
      const current = drawRef.current.getAll();
      redoStackRef.current.push(JSON.parse(JSON.stringify(current)));
    } catch {}
    const last = stack.pop();
    restoreSnapshot(last);
    updateMeasurements();
  };

  const redo = () => {
    if (!drawRef.current) return;
    const rstack = redoStackRef.current;
    if (!rstack.length) return;
    try {
      const current = drawRef.current.getAll();
      undoStackRef.current.push(JSON.parse(JSON.stringify(current)));
    } catch {}
    const next = rstack.pop();
    restoreSnapshot(next);
    updateMeasurements();
  };

  // ---------------- SPLIT ----------------
  const startSplitMode = () => {
    awaitingSplitRef.current = true;
    try {
      drawRef.current?.changeMode("draw_line_string");
    } catch {}
  };

const handleLineForSplit = (lineFeature: any) => {
  if (!mapRef.current || !drawRef.current) return;

  const map = mapRef.current;
  const draw = drawRef.current;

  try {
    const allFeatures = draw.getAll();
    if (!allFeatures.features.length) return;

    // Find the selected polygon
    const selected = allFeatures.features.find(
      (f: any) => f.properties?.isSelected
    );
    if (!selected || selected.geometry.type !== "Polygon") return;

    // Split polygon using turf
    const splitResult = turf.lineSplit(selected, lineFeature);

    if (splitResult.features.length > 1) {
      draw.delete(selected.id);
      splitResult.features.forEach((f: any) => {
        draw.add(f);
      });

      // Update undo/redo stack
      undoStackRef.current.push(draw.getAll());
      redoStackRef.current = [];

      console.log("Polygon successfully split!");
    }
  } catch (err) {
    console.error("Error splitting polygon:", err);
  }
};


  // ---------------- OVERHANG ----------------
  const applyOverhang = async () => {
    // same as original code — copy-paste inside useCallback if needed
  };

  // ---------------- MAP ACTIONS ----------------
  const startDrawing = () => {
    drawRef.current?.changeMode("draw_polygon");
    setShowGrid(true);
    onGridToggle?.(true);
  };

  const deleteAll = () => {
    try {
      const snap = drawRef.current?.getAll();
      if (snap) undoStackRef.current.push(JSON.parse(JSON.stringify(snap)));
      drawRef.current?.deleteAll();
      clearLabels();
      updateMeasurements();
    } catch {}
  };

  const setDrawMode = (mode: string) => {
    try {
      drawRef.current?.changeMode(mode as any);
    } catch (err) {
      console.warn("setDrawMode error", err);
    }
  };

// const setDrawMode = (mode: string) => {
//   setDrawModeState(mode);
//   if (mode === "draw_polygon") {
//     drawRef.current?.changeMode("draw_polygon");
//   }
// };
    // ---------------- MAP ROTATION + VIEW ----------------
  const rotateLeft = () => {
    if (!mapRef.current) return;
    const bearing = mapRef.current.getBearing();
    const snapped = normalizeBearing(bearing);
    const newBearing = (snapped - 90 + 360) % 360;
    mapRef.current.easeTo({ bearing: newBearing, duration: 500 });
  };

  const rotateRight = () => {
    if (!mapRef.current) return;
    const bearing = mapRef.current.getBearing();
    const snapped = normalizeBearing(bearing);
    const newBearing = (snapped + 90) % 360;
    mapRef.current.easeTo({ bearing: newBearing, duration: 500 });
  };

  const toggleStreetView = () => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const currentPitch = map.getPitch();
    if (currentPitch === 0) {
      map.easeTo({
        pitch: 65,
        bearing: 180,
        duration: 1000,
        zoom: map.getZoom() + 1,
      });
    } else {
      map.easeTo({
        pitch: 0,
        bearing: 0,
        duration: 1000,
        zoom: map.getZoom() - 1,
      });
    }
  };

  const getCenter = () => {
    if (!mapRef.current) return null;
    const c = mapRef.current.getCenter();
    return [c.lng, c.lat];
  };



    const confirmLocation = (coords: [number, number]) => {
      if (!mapRef.current) return;
      const [lat, lng] = coords;
      mapRef.current.flyTo({ center: [lng, lat], zoom: 20 });
      localStorage.setItem("selectedAddress", JSON.stringify({ lat, lng }));
    };

    const searchAddress = (address: string) => {
      if (!mapRef.current) return;
      fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address
        )}.json?access_token=${mapboxgl.accessToken}`
      )
        .then((r) => r.json())
        .then((data) => {
          if (data.features?.length > 0) {
            const coords = data.features[0].center as [number, number];
            mapRef.current?.flyTo({ center: coords, zoom: 19 });
          }
        })
        .catch((err) => console.warn("geocode error", err));
    };

    const getMapCanvasDataURL = () => {
      try {
        const canvas = mapRef.current?.getCanvas();
        if (!canvas) return null;
        return canvas.toDataURL("image/png");
      } catch {
        return null;
      }
    };


  return {
    updateMeasurements,
    undo,
    redo,
    startSplitMode,
    handleLineForSplit,
    applyOverhang,
    startDrawing,
    deleteAll,
    setDrawMode,
    rotateLeft,
    rotateRight,
    toggleStreetView,
    getCenter,
  };
};

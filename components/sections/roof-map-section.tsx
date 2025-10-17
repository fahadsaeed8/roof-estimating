// roof-map-section.tsx
"use client";

import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as turf from "@turf/turf";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import html2canvas from "html2canvas";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import jsPDF from "jspdf";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface RoofEstimatorProps {
  setPlanArea: (area: number) => void;
  setRoofArea: (area: number) => void;
  setEdges: (edges: { id: string; length: number; type: string }[]) => void;
  setPolygonPoints: (
    points: { lat: number; lon: number; seq: number }[]
  ) => void;
  onMapLoad?: (map: mapboxgl.Map) => void;
  projectData?: any;
}

export interface MapSectionHandle {
  confirmLocation: (coords: [number, number]) => void;
  startDrawing: () => void;
  deleteAll: () => void;
  setDrawMode: (mode: string) => void;
  searchAddress: (address: string) => void;
  undo: () => void;
  redo: () => void;
  startSplitMode: () => void;
  applyOverhang: () => void;
}

const RoofMapSection = forwardRef<MapSectionHandle, RoofEstimatorProps>(
  (
    {
      setPlanArea,
      setRoofArea,
      setEdges,
      setPolygonPoints,
      onMapLoad,
      projectData,
    }: RoofEstimatorProps,
    ref
  ) => {
    // ===== STATE HOOKS =====
    const [roofArea, setRoofAreaLocal] = useState(0);
    const [planArea, setPlanAreaLocal] = useState(0);
    const [edgesLocal, setEdgesLocal] = useState<
      { id: string; length: number; type: string }[]
    >([]);

    // ===== REFS =====
    const undoStackRef = useRef<any[]>([]);
    const redoStackRef = useRef<any[]>([]);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const drawRef = useRef<MapboxDraw | null>(null);
    const labelsRef = useRef<mapboxgl.Marker[]>([]);
    const awaitingSplitRef = useRef<boolean>(false);

    const [lng] = useState(-118.2437);
    const [lat] = useState(34.0522);
    const [zoom] = useState(18);

    // ... baaki map logic aur functions yahan

    // expose methods for parent
    useImperativeHandle(ref, () => ({
      confirmLocation: (coords: [number, number]) => confirmLocation(coords),
      startDrawing: () => startDrawing(),
      deleteAll: () => deleteAll(),
      setDrawMode: (mode: string) => setDrawMode(mode),
      searchAddress: (address: string) => searchAddress(address),
      undo: () => undo(),
      redo: () => redo(),
      startSplitMode: () => startSplitMode(),
      applyOverhang: () => applyOverhang(),
    }));

    useEffect(() => {
      if (!mapContainerRef.current) return;

      // Initialize map
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/satellite-streets-v12",
        center: [lng, lat],
        zoom,
        maxZoom: 22,
      });

      // Add navigation (zoom + rotate compass) top-right
      mapRef.current.addControl(
        new mapboxgl.NavigationControl({ showCompass: true }),
        "top-right"
      );

      mapRef.current.on("load", () => {
        // add geocoder control if you want (optional)
        if (onMapLoad) onMapLoad(mapRef.current!);
      });

      // Initialize Mapbox Draw with polygon and line drawing support
      drawRef.current = new MapboxDraw({
        displayControlsDefault: false,
        controls: { polygon: true, trash: true, line_string: true },
      });

      mapRef.current.addControl(drawRef.current);

      // capture operations to maintain undo stack
      const pushSnapshot = () => {
        try {
          const snapshot = drawRef.current?.getAll();
          if (snapshot) {
            // push copy
            undoStackRef.current.push(JSON.parse(JSON.stringify(snapshot)));
            // clear redo on new action
            redoStackRef.current = [];
            // limit stack size
            if (undoStackRef.current.length > 50) undoStackRef.current.shift();
          }
        } catch (e) {
          // ignore
        }
      };

      // event handlers
      mapRef.current.on("draw.create", (e) => {
        // when drawing a line for split, handle split flow
        if (awaitingSplitRef.current) {
          handleLineForSplit(e.features[0]);
          return;
        }

        pushSnapshot();
        updateMeasurements();
      });

      mapRef.current.on("draw.update", (e) => {
        pushSnapshot();
        updateMeasurements();
      });

      mapRef.current.on("draw.delete", (e) => {
        pushSnapshot();
        updateMeasurements();
      });

      // cleanup
      return () => mapRef.current?.remove();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // helpers to remove previous labels
    const clearLabels = () => {
      labelsRef.current.forEach((m) => m.remove());
      labelsRef.current = [];
    };

    // feet to feet'inches"
    const toFeetInches = (feetValue: number) => {
      if (!isFinite(feetValue) || feetValue < 0) return `0'0"`;
      const feet = Math.floor(feetValue);
      const inches = Math.round((feetValue - feet) * 12);
      return `${feet}'${inches}"`;
    };

    // update labels & edges & area — called after create/update/delete/undo/redo/split
    const updateMeasurements = () => {
      if (!drawRef.current) return;
      const data = drawRef.current.getAll();
      clearLabels();

      if (!data || !data.features || data.features.length === 0) {
        setPlanArea(0);
        setRoofArea(0);
        setEdges([]);
        setPolygonPoints([]);
        return;
      }

      const allEdges: { id: string; length: number; type: string }[] = [];
      let totalAreaMeters = 0;
      const polygonPointsAcc: { lat: number; lon: number; seq: number }[] = [];
      setEdges(allEdges);
      setEdgesLocal(allEdges); // add this line

      data.features.forEach((feature: any, fIndex: number) => {
        if (!feature.geometry) return;

        if (feature.geometry.type === "Polygon") {
          const coords: number[][] = feature.geometry.coordinates[0];

          // area
          let areaSqMeters = 0;
          try {
            areaSqMeters = turf.area(feature);
          } catch (err) {
            areaSqMeters = 0;
          }
          totalAreaMeters += areaSqMeters;

          // edges
          let perimeterFeet = 0;
          coords.forEach((c: number[], i: number) => {
            if (i < coords.length - 1) {
              const from = turf.point(c as any);
              const to = turf.point(coords[i + 1] as any);
              const lengthFeet = turf.distance(from, to, { units: "feet" });
              perimeterFeet += lengthFeet;

              allEdges.push({
                id: `side-${fIndex}-${i}`,
                length: lengthFeet,
                type: "edge",
              });

              // midpoint label
              const midpoint = turf.midpoint(from, to).geometry.coordinates as [
                number,
                number
              ];
              const el = document.createElement("div");
              el.innerText = toFeetInches(lengthFeet);
              el.style.background = "white";
              el.style.color = "black";
              el.style.padding = "3px 6px";
              el.style.fontSize = "9px";
              el.style.borderRadius = "8px";
              el.style.boxShadow = "0 0 3px rgba(0,0,0,0.3)";
              el.style.fontWeight = "700";
              el.style.whiteSpace = "nowrap";

              const marker = new mapboxgl.Marker({
                element: el,
                anchor: "center",
              })
                .setLngLat(midpoint)
                .addTo(mapRef.current!);

              labelsRef.current.push(marker);

              polygonPointsAcc.push({ lat: c[1], lon: c[0], seq: i + 1 });
            }
          });

          // center label with perimeter + area
          try {
            const center = turf.centerOfMass(feature).geometry.coordinates as [
              number,
              number
            ];
            const areaSqFeet = areaSqMeters * 10.76391041671; // meters² -> sq ft
            const centerDiv = document.createElement("div");
            centerDiv.innerText = `Total: ${perimeterFeet.toFixed(2)} sqft`;
            centerDiv.style.background = "white";
            centerDiv.style.color = "black";
            centerDiv.style.padding = "6px 8px";
            centerDiv.style.fontSize = "10px";
            centerDiv.style.borderRadius = "8px";
            centerDiv.style.boxShadow = "0 0 4px rgba(0,0,0,0.35)";
            centerDiv.style.fontWeight = "700";
            centerDiv.style.whiteSpace = "pre-line";

            const centerMarker = new mapboxgl.Marker({
              element: centerDiv,
              anchor: "center",
            })
              .setLngLat(center)
              .addTo(mapRef.current!);

            labelsRef.current.push(centerMarker);
          } catch (err) {
            console.warn("Center label error", err);
          }
        }
      });

      const totalAreaSqFtLocal = totalAreaMeters * 10.76391041671;
      setPlanArea(totalAreaSqFtLocal);
      setRoofArea(totalAreaSqFtLocal);
      // local state for PDF
      setPlanAreaLocal(totalAreaSqFtLocal);
      setRoofAreaLocal(totalAreaSqFtLocal);

      setEdges(allEdges);
      setPolygonPoints(polygonPointsAcc);
    };

    // ========== UNDO / REDO ==========
    const undo = () => {
      if (!drawRef.current) return;
      const stack = undoStackRef.current;
      if (stack.length === 0) return;
      // current snapshot -> push to redo
      try {
        const current = drawRef.current.getAll();
        redoStackRef.current.push(JSON.parse(JSON.stringify(current)));
      } catch (err) {}
      // pop last snapshot and restore
      const last = stack.pop();
      restoreSnapshot(last);
      updateMeasurements();
    };

    const redo = () => {
      if (!drawRef.current) return;
      const rstack = redoStackRef.current;
      if (rstack.length === 0) return;
      // push current to undo
      try {
        const current = drawRef.current.getAll();
        undoStackRef.current.push(JSON.parse(JSON.stringify(current)));
      } catch (err) {}
      const next = rstack.pop();
      restoreSnapshot(next);
      updateMeasurements();
    };

    const restoreSnapshot = (snapshot: any) => {
      if (!drawRef.current) return;
      try {
        drawRef.current.deleteAll();
        if (!snapshot || !snapshot.features) return;
        // add features
        snapshot.features.forEach((f: any) => {
          // MapboxDraw expects features without id/ with proper geometry - add returns id
          drawRef.current?.add(f);
        });
      } catch (err) {
        console.warn("restoreSnapshot error", err);
      }
    };

    // ========== SPLIT FLOW ==========
    const startSplitMode = () => {
      // user must draw a line to split polygon(s)
      awaitingSplitRef.current = true;
      drawRef.current?.changeMode("draw_line_string");
      // optionally show a toast / instruction to user (outside scope)
    };

    const handleLineForSplit = (lineFeature: any) => {
      // run split on all polygons that intersect the drawn line
      if (!lineFeature || lineFeature.geometry.type !== "LineString") {
        awaitingSplitRef.current = false;
        updateMeasurements();
        return;
      }
      const all = drawRef.current?.getAll();
      if (!all) {
        awaitingSplitRef.current = false;
        updateMeasurements();
        return;
      }
      // push snapshot so we can undo split as one operation
      undoStackRef.current.push(JSON.parse(JSON.stringify(all)));
      redoStackRef.current = [];

      const polygons = all.features.filter(
        (f: any) => f.geometry?.type === "Polygon"
      );
      let anyChange = false;

      polygons.forEach((poly) => {
        try {
          // turf.lineSplit returns features (polygons?) when splitting a polygon with a line
          const splitResult = turf.lineSplit(poly, lineFeature);
          // lineSplit returns collection of lines where it intersects polygon boundaries; if not intersect returns original poly?
          // Alternative approach: use turf.polygonize? Better approach: use turf.difference?
          // Practical approach: intersection check and if intersects, use turf.cut with line -> for polygons use turf.split
          // We'll attempt use of turf.lineSplit on polygon's boundary then polygonize pieces:
          if (
            splitResult &&
            splitResult.features &&
            splitResult.features.length > 0
          ) {
            // Use turf.lineSplit with boundary then polygonize
            const boundary = turf.polygonToLine(poly);
            const splitBoundary = turf.lineSplit(boundary, lineFeature);
            // polygonize the split boundary to polygons
            const polygonized = turf.polygonize(splitBoundary);
            if (
              polygonized &&
              polygonized.features &&
              polygonized.features.length > 0
            ) {
              // remove original polygon and add new pieces
              drawRef.current?.delete(poly.id);
              polygonized.features.forEach((piece: any) => {
                drawRef.current?.add(piece);
              });
              anyChange = true;
            }
          } else {
            // fallback: if drawn line intersects polygon, use turf.split (turf.split exists in newer turf)
            if (
              turf.booleanCrosses(lineFeature, poly) ||
              turf.booleanIntersects(lineFeature, poly)
            ) {
              const res = (turf as any).split
                ? (turf as any).split(poly, lineFeature)
                : null;
              if (res && res.features && res.features.length > 0) {
                drawRef.current?.delete(poly.id);
                res.features.forEach((piece: any) =>
                  drawRef.current?.add(piece)
                );
                anyChange = true;
              }
            }
          }
        } catch (err) {
          console.warn("split operation failed for polygon", err);
        }
      });

      // remove the line used for splitting (cleanup)
      try {
        drawRef.current?.delete(lineFeature.id);
      } catch (e) {}

      awaitingSplitRef.current = false;
      if (anyChange) updateMeasurements();
      else updateMeasurements();
    };

    // ========== OVERHANG (BUFFER) ==========
    const applyOverhang = async () => {
      // basic UI: prompt for overhang distance in feet
      const distStr = window.prompt(
        "Enter overhang distance (feet). e.g. 1.5",
        "1"
      );
      if (!distStr) return;
      const feet = Number(distStr);
      if (!isFinite(feet) || feet <= 0) {
        alert("Invalid number");
        return;
      }
      // convert feet -> meters for turf (1 ft = 0.3048 m)
      const meters = feet * 0.3048;
      try {
        const all = drawRef.current?.getAll();
        if (!all) return;
        const polygons = all.features.filter(
          (f: any) => f.geometry?.type === "Polygon"
        );
        if (polygons.length === 0) {
          alert("No polygon selected/drawn to apply overhang");
          return;
        }
        // create a GeoJSON featurecollection of buffered polygons
        const bufferedFeatures: any[] = [];
        polygons.forEach((poly) => {
          try {
            const buf = turf.buffer(poly, meters, { units: "meters" });
            bufferedFeatures.push(buf);
          } catch (err) {
            console.warn("buffer error", err);
          }
        });

        // add as a map layer for visualization (non-destructive)
        const id = "overhang-layer";
        // remove previous overhang layer if exists
        try {
          if (mapRef.current?.getLayer(id)) {
            mapRef.current?.removeLayer(id);
          }
          if (mapRef.current?.getSource(id)) {
            mapRef.current?.removeSource(id);
          }
        } catch (e) {}

        mapRef.current?.addSource(id, {
          type: "geojson",
          data: turf.featureCollection(bufferedFeatures as any),
        });

        mapRef.current?.addLayer({
          id,
          type: "fill",
          source: id,
          paint: {
            "fill-color": "#f1c40f",
            "fill-opacity": 0.35,
            "fill-outline-color": "#d68910",
          },
        });

        // optionally zoom to overhang
        const bbox = turf.bbox(turf.featureCollection(bufferedFeatures as any));
        if (bbox) {
          const [[minX, minY], [maxX, maxY]] = [
            [bbox[0], bbox[1]],
            [bbox[2], bbox[3]],
          ];
          try {
            mapRef.current?.fitBounds(
              [
                [minX, minY],
                [maxX, maxY],
              ],
              { padding: 40, maxZoom: 20 }
            );
          } catch (e) {}
        }
      } catch (err) {
        console.warn("overhang error", err);
      }
    };

    // ========== MAP ACTIONS ==========
    const confirmLocation = (coords: [number, number]) => {
      mapRef.current?.flyTo({ center: coords, zoom: 20 });
    };

    const startDrawing = () => {
      drawRef.current?.changeMode("draw_polygon");
    };

    const deleteAll = () => {
      try {
        // push snapshot for undo
        const snap = drawRef.current?.getAll();
        if (snap) undoStackRef.current.push(JSON.parse(JSON.stringify(snap)));
        drawRef.current?.deleteAll();
        clearLabels();
        updateMeasurements();
      } catch (err) {}
    };

    const setDrawMode = (mode: string) => {
      try {
        drawRef.current?.changeMode(mode as any);
      } catch (err) {
        console.warn("setDrawMode error", err);
      }
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

const generateRoofPDF = async () => {
  if (!mapRef.current) return;

  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ orientation: "landscape", unit: "px" });

  // ===== HEADER =====
  pdf.setFontSize(20);
  pdf.setFont("helvetica", "bold");
  pdf.text("Roof Measurement Report", pdf.internal.pageSize.getWidth() / 2, 30, { align: "center" });

  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Project: ${projectData?.name || "N/A"}`, pdf.internal.pageSize.getWidth() / 2, 50, { align: "center" });

  // ===== MAP IMAGE =====
  await new Promise((resolve) => setTimeout(resolve, 200));
  const mapCanvas = mapRef.current.getCanvas();
  const mapImgData = mapCanvas.toDataURL("image/png");
  pdf.addImage(mapImgData, "PNG", 20, 60, 600, 400);

  // ===== EDGES INFO =====
  let startY = 480;
  const allEdges = edgesLocal; // use current state or keep local copy from updateMeasurements()
  if (allEdges.length > 0) {
    pdf.text("Polygon Sides:", 20, startY);
    startY += 20;

    allEdges.forEach((edge, i) => {
      pdf.text(`Side ${i + 1} (${edge.type}): ${edge.length.toFixed(2)} ft`, 30, startY);
      startY += 15;
    });
  }

  // ===== FOOTER =====
  const pageWidth = pdf.internal.pageSize.getWidth();
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text(
    `Total Roof Area: ${roofArea.toFixed(2)} sqft | Plan Area: ${planArea.toFixed(2)} sqft`,
    pageWidth / 2,
    startY + 20,
    { align: "center" }
  );

  pdf.save("roof-measurement.pdf");
};



    return (
      <div className="relative w-full h-[calc(100vh-60px)]">
        <div ref={mapContainerRef} className="w-full h-full" />

        <button
          onClick={generateRoofPDF}
          className="absolute top-4 right-4 z-50 bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          Download PDF
        </button>
      </div>
    );
  }
);

RoofMapSection.displayName = "RoofMapSection";
export default RoofMapSection;

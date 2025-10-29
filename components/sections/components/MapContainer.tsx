"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { useUndoRedo } from "../components/useUndoRedo";
import LeftSidebar from "@/components/common/left-sidebar";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export interface MapSectionHandle {
  startDrawing: () => void;
  deleteAll: () => void;
  setDrawMode: (mode: string) => void;
  undo: () => void;
  redo: () => void;
  startSplitMode: () => void;
  applyOverhang: () => void;
  confirmLocation: (coords: [number, number]) => void;
  searchAddress: (address: string) => void;
  getMapCanvasDataURL: () => string | undefined;
  rotateLeft: () => void;
  rotateRight: () => void;
  toggleStreetView: () => void;
  getCenter?: () => [number, number] | null;
}

interface EdgeItem {
  id: string;
  length: number;
  type: string;
}

interface PolygonPoint {
  lat: number;
  lon: number;
  seq: number;
}

interface MapContainerProps {
  initialCenter?: [number, number];
  initialZoom?: number;
  onMeasurementsChange: (payload: {
    edges: EdgeItem[];
    planArea: number;
    roofArea: number;
    polygonPoints: PolygonPoint[];
  }) => void;
  onGridToggle?: (visible: boolean) => void;
  onBearingChange?: (bearing: number) => void;
  onMapLoad?: (map: mapboxgl.Map) => void;
  className?: string;
}

const MapContainer = forwardRef<MapSectionHandle, MapContainerProps>(
  (
    {
      initialCenter = [-118.2437, 34.0522],
      initialZoom = 18,
      onMeasurementsChange,
      onMapLoad,
      onGridToggle,
      onBearingChange,
    },
    ref
  ) => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const drawRef = useRef<MapboxDraw | null>(null);
    const labelsRef = useRef<mapboxgl.Marker[]>([]);
    const awaitingSplitRef = useRef<boolean>(false);
    const undoStackRef = useRef<any[]>([]);
    const redoStackRef = useRef<any[]>([]);

    const [edgesLocal, setEdgesLocal] = useState<EdgeItem[]>([]);
    const [planAreaLocal, setPlanAreaLocal] = useState<number>(0);
    const [roofAreaLocal, setRoofAreaLocal] = useState<number>(0);
    const [polygonEdges, setPolygonEdges] = useState<
      { id: string; coords: [number, number][] }[]
    >([]);
    const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

    const [polygonEdgesMap, setPolygonEdgesMap] = useState<
      Record<string, { id: string; coords: [number, number][] }[]>
    >({});

    const [selectedPolygonId, setSelectedPolygonId] = useState<string | null>(
      null
    );

    const edgeLabels: Record<string, string> = {
      Ridge: "#e74c3c",
      Hip: "#f39c12",
      Valley: "#8e44ad",
      Rake: "#2980b9",
      Eave: "#27ae60",
      Flashing: "#16a085",
      "Step Flashing": "#d35400",
      Transition: "#2c3e50",
    };

    const clearLabels = () => {
      labelsRef.current.forEach((m) => m.remove());
      labelsRef.current = [];
    };

    const {
      updateMeasurements,
      undo,
      redo,
      startSplitMode,
      applyOverhang,
      startDrawing,
      deleteAll,
      setDrawMode,
      rotateLeft,
      rotateRight,
      toggleStreetView,
      getCenter,
    } = useUndoRedo({
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
      setShowGrid: () => {},
      onGridToggle,
      onMeasurementsChange,
      onBearingChange,
      setCurrentBearing: () => {},
    });

    // ====================== USEEFFECT =========================
    useEffect(() => {
  if (!mapContainerRef.current) return;

  // ✅ Default center fallback
  let defaultCenter: [number, number] = [74.3587, 31.5204]; // Lahore
  let defaultZoom = 15;

  // ✅ Check localStorage for saved project location
  const savedProject = localStorage.getItem("projectLocation");
  if (savedProject) {
    try {
      const parsed = JSON.parse(savedProject);
      const { lat, lng } = parsed;
      if (lat && lng) {
        defaultCenter = [lng, lat];
        defaultZoom = 18;
      }
    } catch (err) {
      console.error("Error parsing project location:", err);
    }
  }

  // ✅ Initialize Mapbox
  const mapInstance = new mapboxgl.Map({
    container: mapContainerRef.current,
    style: "mapbox://styles/mapbox/satellite-streets-v12",
    center: defaultCenter,
    zoom: defaultZoom,
    maxZoom: 22,
    pitch: 0,
    bearing: 0,
  });

  mapRef.current = mapInstance;

  // ✅ Optional: Add marker for saved project location
  if (savedProject) {
    try {
      const parsed = JSON.parse(savedProject);
      const { lat, lng } = parsed;
      if (lat && lng) {
        new mapboxgl.Marker({ color: "#FF0000" })
          .setLngLat([lng, lat])
          .addTo(mapInstance);
      }
    } catch (err) {
      console.error("Error adding marker:", err);
    }
  }

  // ✅ Mapbox Draw setup
  const drawInstance = new MapboxDraw({
    displayControlsDefault: true,
    controls: { polygon: true, trash: true, line_string: true },
    styles: [
      {
        id: "gl-draw-polygon-stroke",
        type: "line",
        filter: [
          "all",
          ["==", "$type", "Polygon"],
          ["!=", "mode", "static"],
        ],
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": "yellow", "line-width": 3 },
      },
      {
        id: "gl-draw-line",
        type: "line",
        filter: [
          "all",
          ["==", "$type", "LineString"],
          ["!=", "mode", "static"],
        ],
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": "yellow", "line-width": 3 },
      },
      {
        id: "gl-draw-polygon-midpoint",
        type: "circle",
        filter: [
          "all",
          ["==", "$type", "Point"],
          ["==", "meta", "midpoint"],
        ],
        paint: {
          "circle-radius": 5,
          "circle-color": "#FFD700",
          "circle-opacity": 1,
        },
      },
      {
        id: "gl-draw-polygon-vertex-active",
        type: "circle",
        filter: ["all", ["==", "$type", "Point"], ["==", "meta", "vertex"]],
        paint: {
          "circle-radius": 5,
          "circle-color": "#FFFFFF",
          "circle-stroke-color": "#000000",
          "circle-stroke-width": 1,
        },
      },
    ],
  });

  drawRef.current = drawInstance;
  mapInstance.addControl(drawInstance);

  // ✅ Draw Create Event (track polygon edges)
  mapInstance.on("draw.create", (e: any) => {
    const feature = e.features[0];
    if (!feature || feature.geometry.type !== "Polygon") return;

    // ✅ Hide grid after drawing complete
    onGridToggle?.(false);

    const coords = feature.geometry.coordinates[0];
    const edges: { id: string; coords: [number, number][] }[] = [];

    for (let i = 0; i < coords.length - 1; i++) {
      const id = `${feature.id}-edge-${i}`;
      edges.push({ id, coords: [coords[i], coords[i + 1]] });

      if (mapInstance.getLayer(id)) mapInstance.removeLayer(id);
      if (mapInstance.getSource(id)) mapInstance.removeSource(id);

      mapInstance.addSource(id, {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [coords[i], coords[i + 1]],
          },
        },
      });

      mapInstance.addLayer({
        id,
        type: "line",
        source: id,
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": "yellow", "line-width": 3 },
      });
    }

    // ✅ Save edges in React state
    setPolygonEdgesMap((prev) => ({
      ...prev,
      [feature.id as string]: edges,
    }));

    updateMeasurements(e);
  });

  // ✅ Draw Delete Event (remove edges + state cleanup)
  mapInstance.on("draw.delete", (e: any) => {
    const deleted = e.features;
    deleted.forEach((feature: any) => {
      const featureId = feature.id;
      const edges = polygonEdgesMap[featureId];

      if (edges) {
        edges.forEach((edge: any) => {
          if (mapInstance.getLayer(edge.id)) mapInstance.removeLayer(edge.id);
          if (mapInstance.getSource(edge.id)) mapInstance.removeSource(edge.id);
        });

        // ✅ Remove from React state
        setPolygonEdgesMap((prev) => {
          const updated = { ...prev };
          delete updated[featureId];
          return updated;
        });
      }
    });
  });

  // ✅ Polygon Selection Change
  mapInstance.on("draw.selectionchange", (e: any) => {
    const selected = e?.features?.[0];
    if (selected && selected.id) {
      setSelectedPolygonId(selected.id as string);
    } else {
      setSelectedPolygonId(null);
    }
  });

  mapInstance.on("draw.update", updateMeasurements);

  mapInstance.on("rotate", () => {
    onBearingChange?.(mapInstance.getBearing());
  });

  return () => {
    mapInstance.remove();
  };
}, []);


    // ====================== LABEL HANDLER =========================
    const handleLabelSelect = (label: { name: string; color: string }) => {
      if (!selectedPolygonId) return;

      setSelectedLabel(label.name);

      const edges = polygonEdgesMap[selectedPolygonId];
      if (!edges) return;

      edges.forEach((edge) => {
        if (mapRef.current?.getLayer(edge.id)) {
          // ✅ Apply selected label color to each polygon edge
          mapRef.current.setPaintProperty(edge.id, "line-color", label.color);
        }
      });
    };

    // ====================== HELPERS =========================
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

    useImperativeHandle(ref, () => ({
      confirmLocation,
      startDrawing,
      deleteAll,
      setDrawMode,
      searchAddress,
      undo,
      redo,
      startSplitMode,
      applyOverhang,
      getMapCanvasDataURL,
      rotateLeft,
      rotateRight,
      toggleStreetView,
      getCenter,
    }));

    return (
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
        <LeftSidebar onSelectLabel={handleLabelSelect} />
      </div>
    );
  }
);

MapContainer.displayName = "MapContainer";
export default MapContainer;

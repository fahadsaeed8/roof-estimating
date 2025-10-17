// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import mapboxgl from "mapbox-gl";
// import MapboxDraw from "@mapbox/mapbox-gl-draw";
// import * as turf from "@turf/turf";

// import "mapbox-gl/dist/mapbox-gl.css";
// import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

// import RightSidebar from "../common/right-sidebar/index"; 

// mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

// interface MapboxCanvasProps {
//   onMeasurementsUpdate: (data: {
//     edges: { id: string; length: number; type: string }[];
//     totalArea: number;
//     polygonPoints: { lat: number; lon: number; seq: number }[];
//   }) => void;
//   defaultCenter?: [number, number];
//   defaultZoom?: number;
// }

// const MapboxCanvas: React.FC<MapboxCanvasProps> = ({
//   onMeasurementsUpdate,
//   defaultCenter = [-118.2437, 34.0522],
//   defaultZoom = 18,
// }) => {
//   const mapContainerRef = useRef<HTMLDivElement | null>(null);
//   const mapRef = useRef<mapboxgl.Map | null>(null);
//   const drawRef = useRef<MapboxDraw | null>(null);
//   const labelsRef = useRef<mapboxgl.Marker[]>([]);
//   const [history, setHistory] = useState<any[]>([]);
//   const [redoStack, setRedoStack] = useState<any[]>([]);

//   // 🧮 Convert decimal feet to feet'inches"
//   const toFeetInches = (feetValue: number) => {
//     if (!isFinite(feetValue) || feetValue <= 0) return `0'0"`;
//     const feet = Math.floor(feetValue);
//     const inches = Math.round((feetValue - feet) * 12);
//     return `${feet}'${inches}"`;
//   };

//   // 🧹 Remove old labels
//   const clearLabels = () => {
//     labelsRef.current.forEach((m) => m.remove());
//     labelsRef.current = [];
//   };

//   // 📏 Update measurements + labels
//   const updateMeasurements = () => {
//     if (!drawRef.current) return;
//     const data = drawRef.current.getAll();
//     clearLabels();

//     if (!data.features.length) {
//       onMeasurementsUpdate({ edges: [], totalArea: 0, polygonPoints: [] });
//       return;
//     }

//     const allEdges: { id: string; length: number; type: string }[] = [];
//     const polygonPointsAcc: { lat: number; lon: number; seq: number }[] = [];
//     let totalAreaMeters = 0;

//     data.features.forEach((feature: any, fIndex: number) => {
//       if (feature.geometry.type === "Polygon") {
//         const coords: number[][] = feature.geometry.coordinates[0];
//         const areaSqMeters = turf.area(feature);
//         totalAreaMeters += areaSqMeters;

//         coords.forEach((c, i) => {
//           if (i < coords.length - 1) {
//             const from = turf.point(c);
//             const to = turf.point(coords[i + 1]);
//             const lengthFeet = turf.distance(from, to, { units: "feet" });
//             allEdges.push({ id: `side-${fIndex}-${i}`, length: lengthFeet, type: "edge" });

//             const midpoint = turf.midpoint(from, to).geometry.coordinates as [number, number];
//             const el = document.createElement("div");
//             el.innerText = toFeetInches(lengthFeet);
//             el.style.background = "white";
//             el.style.color = "black";
//             el.style.padding = "3px 6px";
//             el.style.fontSize = "9px";
//             el.style.borderRadius = "8px";
//             el.style.boxShadow = "0 0 3px rgba(0,0,0,0.3)";
//             el.style.fontWeight = "700";

//             const marker = new mapboxgl.Marker({ element: el }).setLngLat(midpoint).addTo(mapRef.current!);
//             labelsRef.current.push(marker);

//             polygonPointsAcc.push({ lat: c[1], lon: c[0], seq: i });
//           }
//         });
//       }
//     });

//     const totalAreaSqFt = totalAreaMeters * 10.7639;
//     onMeasurementsUpdate({ edges: allEdges, totalArea: totalAreaSqFt, polygonPoints: polygonPointsAcc });
//   };

//   // 🗺️ Initialize Map + Draw
//   useEffect(() => {
//     if (!mapContainerRef.current) return;
//     const map = new mapboxgl.Map({
//       container: mapContainerRef.current,
//       style: "mapbox://styles/mapbox/satellite-streets-v12",
//       center: defaultCenter,
//       zoom: defaultZoom,
//       maxZoom: 22,
//     });

//     mapRef.current = map;
//     drawRef.current = new MapboxDraw({ displayControlsDefault: false });
//     map.addControl(drawRef.current);

//     map.on("draw.create", () => {
//       setHistory((prev) => [...prev, drawRef.current?.getAll()]);
//       updateMeasurements();
//     });
//     map.on("draw.update", updateMeasurements);
//     map.on("draw.delete", () => {
//       onMeasurementsUpdate({ edges: [], totalArea: 0, polygonPoints: [] });
//     });

//     return () => map.remove();
//   }, []);

//   // 🧭 Sidebar Action Handlers
//   const handleStartDrawing = () => drawRef.current?.changeMode("draw_polygon");
//   const handleDeleteAll = () => {
//     drawRef.current?.deleteAll();
//     onMeasurementsUpdate({ edges: [], totalArea: 0, polygonPoints: [] });
//   };
//   const handleSetDrawMode = (mode: string) => drawRef.current?.changeMode(mode);

//   const handleUndo = () => {
//     if (history.length > 1) {
//       const prevState = history[history.length - 2];
//       drawRef.current?.set(prevState);
//       setRedoStack((r) => [history[history.length - 1], ...r]);
//       setHistory((h) => h.slice(0, -1));
//     }
//   };

//   const handleRedo = () => {
//     if (redoStack.length > 0) {
//       const nextState = redoStack[0];
//       drawRef.current?.set(nextState);
//       setHistory((h) => [...h, nextState]);
//       setRedoStack((r) => r.slice(1));
//     }
//   };

//   // ✂️ Split polygon into halves (example)
//   const handleSplit = () => {
//     const data = drawRef.current?.getAll();
//     if (!data || !data.features.length) return;

//     const polygon = data.features[0];
//     const bbox = turf.bbox(polygon);
//     const centerX = (bbox[0] + bbox[2]) / 2;

//     const verticalLine = turf.lineString([
//       [centerX, bbox[1]],
//       [centerX, bbox[3]],
//     ]);

//     const clipped = turf.lineSplit(Polygon  , verticalLine);
//     if (clipped.features.length > 1) {
//       drawRef.current?.deleteAll();
//       clipped.features.forEach((f: any) => drawRef.current?.add(f));
//     }
//   };

//   // 🧱 Overhang (offset polygon outward)
//   const handleOverhang = () => {
//     const data = drawRef.current?.getAll();
//     if (!data || !data.features.length) return;
//     const polygon = data.features[0];
//     const buffered = turf.buffer(polygon, 2, { units: "feet" }); // outward by 2ft
//     drawRef.current?.add(buffered);
//   };

//   return (
//     <div className="relative w-full h-full">
//       <div ref={mapContainerRef} className="w-full h-full" />
//       <RightSidebar
//         onStartDrawing={handleStartDrawing}
//         onDeleteAll={handleDeleteAll}
//         onSetDrawMode={handleSetDrawMode}
//         onUndo={handleUndo}
//         onRedo={handleRedo}
//         onSplit={handleSplit}
//         onOverhang={handleOverhang}
//       />
//     </div>
//   );
// };

// export default MapboxCanvas;

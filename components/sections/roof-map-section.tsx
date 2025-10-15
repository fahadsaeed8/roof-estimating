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
import { jsPDF } from "jspdf";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

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
    },
    ref
  ) => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const drawRef = useRef<MapboxDraw | null>(null);
    const labelsRef = useRef<mapboxgl.Marker[]>([]);

    const [edgesData, setEdgesData] = useState<
      { id: string; length: number; type: string }[]
    >([]);
    const [totalAreaSqFt, setTotalAreaSqFt] = useState<number>(0);

    const [lng] = useState(-118.2437);
    const [lat] = useState(34.0522);
    const [zoom] = useState(18);

    useImperativeHandle(ref, () => ({
      confirmLocation: (coords: [number, number]) => confirmLocation(coords),
      startDrawing: () => startDrawing(),
      deleteAll: () => deleteAll(),
      setDrawMode: (mode: string) => setDrawMode(mode),
      searchAddress: (address: string) => searchAddress(address),
    }));

    useEffect(() => {
      if (!mapContainerRef.current) return;

      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/satellite-streets-v12",
        center: [lng, lat],
        zoom,
        maxZoom: 22,
      });

      mapRef.current.on("load", () => {
        if (onMapLoad) onMapLoad(mapRef.current!);
      });

      drawRef.current = new MapboxDraw({
        displayControlsDefault: false,
        controls: { polygon: true, trash: true, line_string: true },
      });

      mapRef.current.addControl(drawRef.current);

      mapRef.current.on("draw.create", () => {
        updateMeasurements();
      });
      mapRef.current.on("draw.update", () => {
        updateMeasurements();
      });
      mapRef.current.on("draw.delete", () => {
        clearAll();
      });

      return () => {
        mapRef.current?.remove();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // remove markers (edges & center)
    const clearLabels = () => {
      labelsRef.current.forEach((m) => m.remove());
      labelsRef.current = [];
    };

    const clearAll = () => {
      clearLabels();
      drawRef.current?.deleteAll();
      setEdgesData([]);
      setTotalAreaSqFt(0);
      setPlanArea(0);
      setRoofArea(0);
      setEdges([]);
      setPolygonPoints([]);
    };

    // convert decimal feet to feet'inches"
    const toFeetInches = (feetValue: number) => {
      if (!isFinite(feetValue) || feetValue <= 0) return `0'0"`;
      const feet = Math.floor(feetValue);
      const inches = Math.round((feetValue - feet) * 12);
      return `${feet}'${inches}"`;
    };

    // main measurement function - FIXED: now computes per-polygon perimeter & area and displays per-polygon center labels
    const updateMeasurements = () => {
      if (!drawRef.current) return;
      const data = drawRef.current.getAll();
      clearLabels();

      if (!data || !data.features || data.features.length === 0) {
        setEdgesData([]);
        setEdges([]);
        setTotalAreaSqFt(0);
        setPlanArea(0);
        setRoofArea(0);
        return;
      }

      const allEdges: { id: string; length: number; type: string }[] = [];
      const polygonPointsAcc: { lat: number; lon: number; seq: number }[] = [];
      let totalAreaMeters = 0;

      // iterate features and handle each polygon separately
      data.features.forEach((feature: any, fIndex: number) => {
        if (!feature.geometry) return;

        if (feature.geometry.type === "Polygon") {
          const coords: number[][] = feature.geometry.coordinates[0];

          // calculate this polygon's area
          let areaSqMeters = 0;
          try {
            areaSqMeters = turf.area(feature);
          } catch (err) {
            console.warn("area calc failed for feature", fIndex, err);
            areaSqMeters = 0;
          }
          totalAreaMeters += areaSqMeters;
          const areaSqFeet = areaSqMeters * 10.76391041671;

          // compute perimeter for this polygon
          let perimeterFeet = 0;
          coords.forEach((c: number[], i: number) => {
            if (i < coords.length - 1) {
              const from = turf.point(c as any);
              const to = turf.point(coords[i + 1] as any);
              const lengthFeet = turf.distance(from, to, { units: "feet" }); // feet
              perimeterFeet += lengthFeet;

              const edgeId = `side-${fIndex}-${i}`;
              allEdges.push({ id: edgeId, length: lengthFeet, type: "edge" });

              // midpoint label for the edge
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

              // accumulate polygon points (for parent)
              polygonPointsAcc.push({ lat: c[1], lon: c[0], seq: i });
            }
          });

          // place center label for THIS polygon showing its perimeter & area
          try {
            const center = turf.centerOfMass(feature).geometry.coordinates as [
              number,
              number
            ];
            const centerDiv = document.createElement("div");
            centerDiv.innerText = `${perimeterFeet.toFixed(2)}`;
            centerDiv.style.background = "white";
            centerDiv.style.color = "black";
            centerDiv.style.padding = "6px 10px";
            centerDiv.style.fontSize = "11px";
            centerDiv.style.borderRadius = "10px";
            centerDiv.style.boxShadow = "0 0 4px rgba(0,0,0,0.35)";
            centerDiv.style.fontWeight = "700";
            centerDiv.style.whiteSpace = "nowrap";

            const centerMarker = new mapboxgl.Marker({
              element: centerDiv,
              anchor: "center",
            })
              .setLngLat(center)
              .addTo(mapRef.current!);

            labelsRef.current.push(centerMarker);
          } catch (err) {
            console.warn(
              "failed to add center marker for polygon",
              fIndex,
              err
            );
          }
        }

        // if feature is LineString: optionally add labels or include in edges if you want
        if (feature.geometry.type === "LineString") {
          // we won't treat line strings as polygon edges in total perimeter,
          // but you can choose to include them separately if required.
          // (Leaving as-is.)
        }
      });

      // set edges and polygon points in parent & local state
      setEdgesData(allEdges);
      setEdges(
        allEdges.map((e) => ({ id: e.id, length: e.length, type: e.type }))
      );
      setPolygonPoints(polygonPointsAcc);

      // compute total area in square feet (sum of polygons)
      const totalAreaSqFtLocal = totalAreaMeters * 10.76391041671;
      setTotalAreaSqFt(totalAreaSqFtLocal);
      setPlanArea(totalAreaSqFtLocal);
      setRoofArea(totalAreaSqFtLocal);
    };

    // Generate PDF with edges list & map snapshot & total area
    const generatePDF = async () => {
      const doc = new jsPDF({ unit: "pt", format: "a4" });

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 40;
      const logoUrl = ""; // apni logo image ka path yahan daal do (public folder me)
      const today = new Date().toLocaleString();

      // ===============================
      // 🟥 HEADER SECTION
      // ===============================
      try {
        const logoImg = await fetch(logoUrl)
          .then((res) => res.blob())
          .then((blob) => URL.createObjectURL(blob));
        doc.addImage(logoImg, "PNG", margin, 30, 80, 40);
      } catch {
        console.warn("Logo missing or failed to load");
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("Roof Measurement Report", margin + 100, 50);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Generated: ${today}`, margin + 100, 65);

      doc.setDrawColor(200);
      doc.line(margin, 80, pageWidth - margin, 80);

      // ===============================
      // 🟦 PROJECT DETAILS
      // ===============================
      let y = 100;
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text("Project Details", margin, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      y += 20;

      const projectDetails = [
        ["Address", projectData?.address || "N/A"],
        [
          "Coordinates",
          `${projectData?.lat || "34.0522"}, ${
            projectData?.lon || "-118.2437"
          }`,
        ],
        ["Surveyed By", "Asad Sabri"],
        ["Report ID", "RM-" + Math.floor(Math.random() * 10000)],
      ];

      projectDetails.forEach(([label, value]) => {
        doc.text(`${label}:`, margin, y);
        doc.text(value, margin + 120, y);
        y += 16;
      });

      doc.line(margin, y + 5, pageWidth - margin, y + 5);
      y += 30;

      // ===============================
      // 🟩 EDGE MEASUREMENTS
      // ===============================
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Edges Detail", margin, y);
      y += 20;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);

      if (edgesData.length === 0) {
        doc.text("No edges found. Draw polygon to measure.", margin, y);
        y += 20;
      } else {
        edgesData.forEach((edge, idx) => {
          const label = `Side ${idx + 1}`;
          const feetLabel = `${toFeetInches(
            edge.length
          )} (${edge.length.toFixed(2)} ft)`;
          doc.text(label, margin + 10, y);
          doc.text(feetLabel, pageWidth - margin - 200, y);
          y += 16;
        });
      }

      const totalPerimeterFeet = edgesData.reduce(
        (acc, e) => acc + e.length,
        0
      );
      const features = drawRef.current?.getAll().features;
      const totalAreaSqFt =
        features && features.length > 0
          ? turf.area(features[0]) * 10.7639
          : 0; // convert m² → ft²

      y += 10;
      doc.setDrawColor(180);
      doc.line(margin, y, pageWidth - margin, y);
      y += 20;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(
        `Total Perimeter: ${toFeetInches(
          totalPerimeterFeet
        )} (${totalPerimeterFeet.toFixed(2)} ft)`,
        margin,
        y
      );
      y += 16;
      // doc.text(`Total Area: ${totalAreaSqFt.toFixed(2)} sq ft`, margin, y);
      y += 40;

      // ===============================
      // 🟨 MAP SNAPSHOT PAGE
      // ===============================
      // try {
      //   const mapCanvas = mapRef.current?.getCanvas();
      //   if (mapCanvas) {
      //     const imgData = mapCanvas.toDataURL("image/png");
      //     doc.addPage();
      //     doc.setFont("helvetica", "bold");
      //     doc.setFontSize(16);
      //     doc.text("Roof Measurement Diagram", margin, 50);

      //     const imgWidth = pageWidth - margin * 2;
      //     const imgHeight =
      //       (mapCanvas.height / mapCanvas.width) * imgWidth * 0.6;
      //     doc.addImage(imgData, "PNG", margin, 70, imgWidth, imgHeight);
      //   }
      // } catch (err) {
      //   console.warn("snapshot error", err);
      // }

      // ===============================
      // 🟫 FOOTER
      // ===============================
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const footerY = doc.internal.pageSize.height - 40;
        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text(
          "© 2025 Axora Roofing Tool | Auto-generated report",
          margin,
          footerY
        );
        doc.text(
          "For estimation purposes only",
          pageWidth - margin - 180,
          footerY
        );
      }

      // Save
      doc.save("Roof_Measurement_Report.pdf");
    };

    const confirmLocation = (coords: [number, number]) => {
      mapRef.current?.flyTo({ center: coords, zoom: 20 });
    };

    const startDrawing = () => {
      drawRef.current?.changeMode("draw_polygon");
    };

    const deleteAll = () => {
      clearAll();
    };

    const setDrawMode = (mode: string) => {
      drawRef.current?.changeMode(mode as any);
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

    return (
      <div className="w-full h-[calc(100vh-100px)] border border-gray-300 relative">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Download PDF Button */}
        <button
          onClick={generatePDF}
          className="absolute top-4 right-5 bg-blue-600 mx-5 hover:bg-blue-700 text-white text-xs px-5 py-2 rounded shadow-md z-30"
        >
          Download Report PDF
        </button>

        {/* Top-center shows global total area (sum of polygons) */}
        {/* <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-[#0a1f44]/80 text-white px-4 py-2 rounded-xl shadow-md z-30">
          {totalAreaSqFt ? `${totalAreaSqFt.toFixed(2)} sq ft` : "0.00 sq ft"}
        </div> */}
      </div>
    );
  }
);

RoofMapSection.displayName = "RoofMapSection";
export default RoofMapSection;

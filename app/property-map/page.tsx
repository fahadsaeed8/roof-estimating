"use client";

import { useState, useRef, useEffect } from "react";
// import mapboxgl from "mapboxgl";
import RightSidebar from "@/components/common/right-sidebar";
import TopToolbar from "@/components/common/top-tool-bar";
import RoofMapSection, { MapSectionHandle } from "@/components/sections/roof-map-section";

export default function RoofEstimatorPage() {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [planArea, setPlanArea] = useState(0);
  const [roofArea, setRoofArea] = useState(0);
  const [edges, setEdges] = useState<
    { id: string; length: number; type: string }[]
  >([]);
  const [polygonPoints, setPolygonPoints] = useState<
    { lat: number; lon: number; seq: number }[]
  >([]);

  // ✅ State for project data
  const [projectData, setProjectData] = useState<any>(null);
  const mapRef = useRef<MapSectionHandle | null>(null);
  // ✅ Ref for MapSection functions
  const mapSectionRef = useRef<{
    confirmLocation: (coords: [number, number]) => void;
    startDrawing: () => void;
    deleteAll: () => void;
    setDrawMode: (mode: string) => void;
    searchAddress: (address: string) => void;
  }>(null);

  // ✅ Load project data from localStorage on component mount
  useEffect(() => {
    const savedProjectData = localStorage.getItem("projectData");
    if (savedProjectData) {
      const data = JSON.parse(savedProjectData);
      setProjectData(data);
      console.log("Loaded project data:", data);
    }
  }, []);

  // ✅ Auto-search address when map loads and project data exists
  useEffect(() => {
    if (map && projectData) {
      // Wait a bit for map to fully initialize
      const timer = setTimeout(() => {
        const fullAddress = `${projectData.street}, ${projectData.city}, ${projectData.state} ${projectData.zip}`;
        console.log("Auto-searching address:", fullAddress);

        if (mapSectionRef.current) {
          mapSectionRef.current.searchAddress(fullAddress);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [map, projectData]);

  // Handle map load
  const handleMapLoad = (mapInstance: mapboxgl.Map) => {
    setMap(mapInstance);
  };

  // ✅ Handle location selection from search - FIXED
  const handleLocationConfirm = (coords: [number, number]) => {
    console.log("Location selected:", coords);

    // Call MapSection's confirmLocation function
    if (mapSectionRef.current) {
      mapSectionRef.current.confirmLocation(coords);
    }
  };

  // ✅ Handle drawing actions from sidebar
  const handleStartDrawing = () => {
    if (mapSectionRef.current) {
      mapSectionRef.current.startDrawing();
    }
  };

  const handleDeleteAll = () => {
    if (mapSectionRef.current) {
      mapSectionRef.current.deleteAll();
    }
  };

  const handleSetDrawMode = (mode: string) => {
    if (mapSectionRef.current) {
      mapSectionRef.current.setDrawMode(mode);
    }
  };

  // Handle save roof
  const handleSaveRoof = () => {
    console.log("Saving roof data...");
  };

  // Handle thickness change
  const handleThicknessChange = (value: number) => {
    console.log("Thickness changed to:", value);
  };

  // Handle snap toggle
  const handleSnapToggle = (enabled: boolean) => {
    console.log("Snap enabled:", enabled);
  };

  return (
   <div className="relative w-full h-screen pt-14">
      <TopToolbar
        map={map}
        onSaveRoof={handleSaveRoof}
        onThicknessChange={handleThicknessChange}
        onSnapToggle={handleSnapToggle}
        onLocationConfirm={handleLocationConfirm}
      />
       <RightSidebar
        onStartDrawing={() => mapRef.current?.startDrawing()}
        onDeleteAll={() => mapRef.current?.deleteAll()}
        onSetDrawMode={(mode) => mapRef.current?.setDrawMode(mode)}
        onUndo={() => mapRef.current?.undo()}
        onRedo={() => mapRef.current?.redo()}
        onSplit={() => mapRef.current?.startSplitMode()}
        onOverhang={() => mapRef.current?.applyOverhang()}
      />
      <RoofMapSection
        ref={mapRef}
        setPlanArea={() => {}}
        setRoofArea={() => {}}
        setEdges={() => {}}
        setPolygonPoints={() => {}}
      />
    </div>
  );
}

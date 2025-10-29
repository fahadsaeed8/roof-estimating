"use client";

import React, { useRef, useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import LeftSidebar from "@/components/common/left-sidebar";
import TopToolbar from "@/components/common/top-tool-bar";
import RightSidebar from "@/components/common/right-sidebar";
import RoofMapSection, {
  MapSectionHandle,
} from "@/components/sections/roof-map-section";

export default function RoofEstimatorPage() {
  const roofMapRef = useRef<MapSectionHandle | null>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  const [planArea, setPlanArea] = useState(0);
  const [roofArea, setRoofArea] = useState(0);
  const [edges, setEdges] = useState<any[]>([]);
  const [polygonPoints, setPolygonPoints] = useState<any[]>([]);

  // selectedLabel state mostly for UI / later use (optional)
  const [selectedLabel, setSelectedLabel] = useState<{
    name: string;
    color: string;
  } | null>(null);

  // called by LeftSidebar
  const handleSelectLabel = (label: { name: string; color: string }) => {
    setSelectedLabel(label);
    // direct call to MapContainer method exposed through RoofMapSection
    roofMapRef.current?.startDrawingWithLabel?.(label);
  };
const handleMapLoad = (map: any) => {
  console.log("Map loaded ✅", map);
};
  // example callback from MapSection when map instance available
  // const handleMapLoad = (mapInst: mapboxgl.Map) => setMap(mapInst);

  return (
    <div className="relative w-full h-screen pt-14">
      <LeftSidebar onSelectLabel={handleSelectLabel} />

      <TopToolbar
        map={map}
        onSaveRoof={() => console.log("save")}
        onThicknessChange={() => {}}
        onSnapToggle={() => {}}
        onLocationConfirm={() => {}}
        onDownloadPDF={() => roofMapRef.current?.downloadPDF?.()}
      />

      <div className="absolute inset-0">
        <RoofMapSection
          ref={roofMapRef}
          onMapLoad={handleMapLoad}
          setPlanArea={setPlanArea}
          setRoofArea={setRoofArea}
          setEdges={setEdges}
          setPolygonPoints={setPolygonPoints}
          selectedLabel={selectedLabel} // ✅ add this
        />
      </div>

      <RightSidebar
        onSetDrawMode={(m) => roofMapRef.current?.setDrawMode?.(m)}
        onStartDrawing={() => roofMapRef.current?.startDrawing?.()}
        onDeleteAll={() => roofMapRef.current?.deleteAll?.()}
        onUndo={() => roofMapRef.current?.undo?.()}
        onRedo={() => roofMapRef.current?.redo?.()}
        onSplit={() => roofMapRef.current?.startSplitMode?.()}
        onOverhang={() => roofMapRef.current?.applyOverhang?.()}
        onRotateLeft={() => roofMapRef.current?.rotateLeft?.()}
        onRotateRight={() => roofMapRef.current?.rotateRight?.()}
        onToggleStreetView={() => roofMapRef.current?.toggleStreetView?.()}
      />
    </div>
  );
}

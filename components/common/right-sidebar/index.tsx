"use client";

import {
  RotateCw,
  RotateCcw,
  Trash2,
  Scissors,
  Layers,
  Move,
  Square,
  Pencil,
} from "lucide-react";

interface RightSidebarProps {
  onStartDrawing?: () => void;
  onDeleteAll?: () => void;
  onSetDrawMode?: (mode: string) => void;
}

export default function RightSidebar({
  onStartDrawing,
  onDeleteAll,
  onSetDrawMode,
}: RightSidebarProps) {
  const handleDrawPolygon = () => {
    if (onStartDrawing) {
      onStartDrawing();
    }
    if (onSetDrawMode) {
      onSetDrawMode("draw_polygon");
    }
  };

  const handleDirectSelect = () => {
    if (onSetDrawMode) {
      onSetDrawMode("direct_select");
    }
  };

  const handleSimpleSelect = () => {
    if (onSetDrawMode) {
      onSetDrawMode("simple_select");
    }
  };

  const handleDelete = () => {
    if (onDeleteAll) {
      onDeleteAll();
    }
    if (onSetDrawMode) {
      onSetDrawMode("simple_select");
    }
  };

  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 bg-[#0a1f44]/80 p-3 rounded-2xl shadow-lg z-20">
      {/* Draw Polygon Button */}
      <button
        onClick={handleDrawPolygon}
        className="flex flex-col items-center text-white hover:text-blue-400 transition-colors"
        title="Draw Polygon"
      >
        <Pencil className="w-5 h-5" />
        <span className="text-xs mt-1">Draw</span>
      </button>

      {/* Select Mode Button */}
      <button
        onClick={handleSimpleSelect}
        className="flex flex-col items-center text-white hover:text-green-400 transition-colors"
        title="Select Mode"
      >
        <Square className="w-5 h-5" />
        <span className="text-xs mt-1">Select</span>
      </button>

      {/* Direct Select Button */}
      <button
        onClick={handleDirectSelect}
        className="flex flex-col items-center text-white hover:text-yellow-400 transition-colors"
        title="Edit Points"
      >
        <Move className="w-5 h-5" />
        <span className="text-xs mt-1">Edit</span>
      </button>

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="flex flex-col items-center text-white hover:text-red-400 transition-colors"
        title="Delete All"
      >
        <Trash2 className="w-5 h-5" />
        <span className="text-xs mt-1">Delete</span>
      </button>

      {/* Divider */}
      <div className="h-px bg-gray-600 my-1"></div>

      {/* Additional Tools */}
      <button className="flex flex-col items-center text-white hover:text-purple-400 transition-colors opacity-50 ">
        <RotateCcw className="w-5 h-5" />
        <span className="text-xs mt-1">Undo</span>
      </button>

      <button className="flex flex-col items-center text-white hover:text-purple-400 transition-colors  opacity-50">
        <RotateCw className="w-5 h-5" />
        <span className="text-xs mt-1">Redo</span>
      </button>

      <button className="flex flex-col items-center text-white hover:text-purple-400 transition-colors  opacity-50">
        <Scissors className="w-5 h-5" />
        <span className="text-xs mt-1">Split</span>
      </button>

      <button className="flex flex-col items-center text-white hover:text-purple-400 transition-colors  opacity-50">
        <Layers className="w-5 h-5" />
        <span className="text-xs mt-1">Overhang</span>
      </button>
    </div>
  );
}

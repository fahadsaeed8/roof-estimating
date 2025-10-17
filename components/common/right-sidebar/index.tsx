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
  onUndo?: () => void;
  onRedo?: () => void;
  onSplit?: () => void;
  onOverhang?: () => void;
}

export default function RightSidebar({
  onStartDrawing,
  onDeleteAll,
  onSetDrawMode,
  onUndo,
  onRedo,
  onSplit,
  onOverhang,
}: RightSidebarProps) {
  // ✅ Polygon draw start
  const handleDrawPolygon = () => {
    onStartDrawing?.();
    onSetDrawMode?.("draw_polygon");
  };

  // ✅ Simple select
  const handleSimpleSelect = () => {
    onSetDrawMode?.("simple_select");
  };

  // ✅ Direct select / Edit
  const handleDirectSelect = () => {
    onSetDrawMode?.("direct_select");
  };

  // ✅ Delete all
  const handleDelete = () => {
    onDeleteAll?.();
    onSetDrawMode?.("simple_select");
  };

  // ✅ Undo/Redo/Split/Overhang
  const handleUndo = () => onUndo?.();
  const handleRedo = () => onRedo?.();
  const handleSplit = () => onSplit?.();
  const handleOverhang = () => onOverhang?.();

  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 bg-[#0a1f44]/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white/10 z-30">
      {/* Draw Polygon */}
      <button
        onClick={handleDrawPolygon}
        className="flex flex-col items-center text-white hover:text-blue-400 transition-colors"
        title="Draw Polygon"
      >
        <Pencil className="w-5 h-5" />
        <span className="text-xs mt-1">Draw</span>
      </button>

      {/* Select */}
      <button
        onClick={handleSimpleSelect}
        className="flex flex-col items-center text-white hover:text-green-400 transition-colors"
        title="Select Mode"
      >
        <Square className="w-5 h-5" />
        <span className="text-xs mt-1">Select</span>
      </button>

      {/* Edit */}
      <button
        onClick={handleDirectSelect}
        className="flex flex-col items-center text-white hover:text-yellow-400 transition-colors"
        title="Edit Points"
      >
        <Move className="w-5 h-5" />
        <span className="text-xs mt-1">Edit</span>
      </button>

      {/* Delete */}
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

      {/* Undo */}
      <button
        onClick={handleUndo}
        className="flex flex-col items-center text-white hover:text-purple-400 transition-colors"
        title="Undo"
      >
        <RotateCcw className="w-5 h-5" />
        <span className="text-xs mt-1">Undo</span>
      </button>

      {/* Redo */}
      <button
        onClick={handleRedo}
        className="flex flex-col items-center text-white hover:text-purple-400 transition-colors"
        title="Redo"
      >
        <RotateCw className="w-5 h-5" />
        <span className="text-xs mt-1">Redo</span>
      </button>

      {/* Split */}
      <button
        onClick={handleSplit}
        className="flex flex-col items-center text-white hover:text-purple-400 transition-colors"
        title="Split Polygon"
      >
        <Scissors className="w-5 h-5" />
        <span className="text-xs mt-1">Split</span>
      </button>

      {/* Overhang */}
      <button
        onClick={handleOverhang}
        className="flex flex-col items-center text-white hover:text-purple-400 transition-colors"
        title="Overhang Tool"
      >
        <Layers className="w-5 h-5" />
        <span className="text-xs mt-1">Overhang</span>
      </button>
    </div>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as Esri from "esri-leaflet";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";

export default function RoofEstimator() {
  const mapRef = useRef<L.Map | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showMap, setShowMap] = useState(false);

  // Areas
  const [planArea, setPlanArea] = useState<number | null>(null);
  const [roofArea, setRoofArea] = useState<number | null>(null);

  // Pitch input
  const [rise, setRise] = useState<number>(4);
  const [run, setRun] = useState<number>(12);

  // Edge classifications
  const [edges, setEdges] = useState<
    { id: string; length: number; type: string }[]
  >([]);

  // slope multiplier
  const getSlopeMultiplier = () => {
    if (run === 0) return 1;
    const ratio = rise / run;
    return Math.sqrt(1 + ratio * ratio);
  };

  useEffect(() => {
    if (showMap && !mapRef.current) {
      mapRef.current = L.map("map", {
        center: [37.7749, -122.4194],
        zoom: 10,
        minZoom: 2,
        maxZoom: 23,
      });

      // Satellite
      Esri.basemapLayer("Imagery", { maxZoom: 23 }).addTo(mapRef.current);
      Esri.basemapLayer("ImageryLabels", { maxZoom: 23 }).addTo(mapRef.current);

      // Draw tools
      drawnItemsRef.current = new L.FeatureGroup();
      mapRef.current.addLayer(drawnItemsRef.current);

      const drawControl = new L.Control.Draw({
        edit: { featureGroup: drawnItemsRef.current },
        draw: {
          polygon: {},
          rectangle: {},
          circle: false,
          marker: false,
          polyline: false,
          circlemarker: false,
        },
      });
      mapRef.current.addControl(drawControl);

      // When polygon created
      mapRef.current.on(L.Draw.Event.CREATED, (e: any) => {
        const layer = e.layer;
        drawnItemsRef.current?.addLayer(layer);

        if (e.layerType === "polygon" || e.layerType === "rectangle") {
          const latlngs = layer.getLatLngs()[0];

          // --- Area ---
          const area = L.GeometryUtil.geodesicArea(latlngs);
          const planSqM = area;
          const planSqFt = area * 10.7639;
          const multiplier = getSlopeMultiplier();
          const roofSqM = planSqM * multiplier;
          const roofSqFt = planSqFt * multiplier;
          setPlanArea(planSqM);
          setRoofArea(roofSqM);

          // --- Edges ---
          const edgeData: { id: string; length: number; type: string }[] = [];
          for (let i = 0; i < latlngs.length; i++) {
            const p1 = latlngs[i];
            const p2 = latlngs[(i + 1) % latlngs.length];
            const dist = mapRef.current?.distance(p1, p2) || 0;

            const id = `${p1.lat}-${p1.lng}-${p2.lat}-${p2.lng}`;
            edgeData.push({ id, length: dist, type: "unclassified" });

            // Create edge polyline
            const edgeLine = L.polyline([p1, p2], { color: "orange" }).addTo(
              mapRef.current!
            );

            // Dropdown popup
            const popupDiv = document.createElement("div");
            const select = document.createElement("select");
            [
              "unclassified",
              "ridge",
              "hip",
              "valley",
              "eave",
              "rake",
              "flashing",
            ].forEach((opt) => {
              const option = document.createElement("option");
              option.value = opt;
              option.textContent = opt;
              select.appendChild(option);
            });

            select.onchange = () => {
              setEdges((prev) =>
                prev.map((ed) =>
                  ed.id === id ? { ...ed, type: select.value } : ed
                )
              );
            };

            popupDiv.appendChild(select);
            edgeLine.bindPopup(popupDiv);
          }

          setEdges(edgeData);
        }
      });
    }
  }, [showMap]);

  // Address autocomplete
  const fetchSuggestions = async (text: string) => {
    if (!text) {
      setSuggestions([]);
      return;
    }
    const url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?f=json&text=${encodeURIComponent(
      text
    )}`;
    const res = await fetch(url);
    const data = await res.json();
    setSuggestions(data.suggestions || []);
  };

  const handleSelect = async (magicKey: string, text: string) => {
    setQuery(text);
    setSuggestions([]);
    setShowMap(true);

    const url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&magicKey=${magicKey}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.candidates?.length > 0) {
      const { location } = data.candidates[0];
      if (mapRef.current) {
        mapRef.current.setView([location.y, location.x], 20);
        L.marker([location.y, location.x]).addTo(mapRef.current);
      }
    }
  };

  const handleEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && suggestions.length > 0) {
      const first = suggestions[0];
      handleSelect(first.magicKey, first.text);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Search */}
      <div className="w-full">
        <label className="mb-1 block">Enter the address of the property</label>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            fetchSuggestions(e.target.value);
          }}
          onKeyDown={handleEnter}
          placeholder="Search for a place..."
          className="w-full p-2 rounded-lg border bg-white outline-none border-gray-300 text-black"
        />
        {suggestions.length > 0 && (
          <ul className="bg-white shadow rounded-lg mt-1 max-h-60 overflow-auto">
            {suggestions.map((s) => (
              <li
                key={s.magicKey}
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleSelect(s.magicKey, s.text)}
              >
                {s.text}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Pitch Input */}
      <div className="flex gap-4">
        <div>
          <label>Rise</label>
          <input
            type="number"
            value={rise}
            onChange={(e) => setRise(Number(e.target.value))}
            className="p-2 border rounded w-20"
          />
        </div>
        <div>
          <label>Run</label>
          <input
            type="number"
            value={run}
            onChange={(e) => setRun(Number(e.target.value))}
            className="p-2 border rounded w-20"
          />
        </div>
      </div>

      {/* Results */}
      {planArea && roofArea && (
        <div className="p-4 border rounded bg-gray-50">
          <p>
            <strong>Plan Area:</strong> {planArea.toFixed(2)} m² (
            {(planArea * 10.7639).toFixed(2)} ft²)
          </p>
          <p>
            <strong>Roof Area (with pitch):</strong> {roofArea.toFixed(2)} m² (
            {(roofArea * 10.7639).toFixed(2)} ft²)
          </p>
        </div>
      )}

      {/* Edges */}
      {edges.length > 0 && (
        <div className="p-4 border rounded bg-gray-50">
          <h3 className="font-bold mb-2">Edges Classification</h3>
          <ul>
            {edges.map((edge) => (
              <li key={edge.id}>
                {edge.type} → {edge.length.toFixed(2)} m
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Map */}
      {showMap && <div id="map" className="h-[600px] w-full" />}
    </div>
  );
}

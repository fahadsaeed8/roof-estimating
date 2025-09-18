"use client";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as Esri from "esri-leaflet";
import "leaflet-draw"; // drawing tools
import "leaflet-draw/dist/leaflet.draw.css";

export default function RoofEstimator() {
  const mapRef = useRef<L.Map | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showMap, setShowMap] = useState(false); // 👈 map visibility control

  useEffect(() => {
    if (showMap && !mapRef.current) {
      // 👇 Initialize Map
      mapRef.current = L.map("map", {
        center: [37.7749, -122.4194],
        zoom: 13,
        minZoom: 2,
        maxZoom: 23,
      });

      // Satellite layers
      Esri.basemapLayer("Imagery", { maxZoom: 23 }).addTo(mapRef.current);
      Esri.basemapLayer("ImageryLabels", { maxZoom: 23 }).addTo(mapRef.current);

      // Draw tools
      drawnItemsRef.current = new L.FeatureGroup();
      mapRef.current.addLayer(drawnItemsRef.current);

      const drawControl = new L.Control.Draw({
        edit: { featureGroup: drawnItemsRef.current },
        draw: {
          polygon: {}, // ✅ OK
          rectangle: {}, // ✅ OK
          circle: false,
          marker: false,
          polyline: false,
          circlemarker: false,
        },
      });

      mapRef.current.addControl(drawControl);

      // Polygon/rectangle event
      mapRef.current.on(L.Draw.Event.CREATED, (e: any) => {
        const layer = e.layer;
        drawnItemsRef.current?.addLayer(layer);

        if (e.layerType === "polygon" || e.layerType === "rectangle") {
          const area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
          const areaInSqMeters = area.toFixed(2);
          const areaInSqFeet = (area * 10.7639).toFixed(2);

          alert(`Roof Area: ${areaInSqMeters} m² (${areaInSqFeet} ft²)`);
        }
      });
    }
  }, [showMap]);

  // Fetch suggestions
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

  // Handle select
  const handleSelect = async (magicKey: string, text: string) => {
    setQuery(text);
    setSuggestions([]);
    setShowMap(true); // 👈 Show map when location selected

    const url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&magicKey=${magicKey}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.candidates?.length > 0) {
      const { location } = data.candidates[0];
      if (mapRef.current) {
        mapRef.current.setView([location.y, location.x], 22);
        L.marker([location.y, location.x]).addTo(mapRef.current);
      }
    }
  };

  // Handle Enter press
  const handleEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && suggestions.length > 0) {
      const first = suggestions[0];
      handleSelect(first.magicKey, first.text);
    }
  };

  return (
    <div className="w-full flex flex-col">
      {/* Search Bar */}
      <div className="w-full mb-10">
        <label className="mb-1" htmlFor="">
          Enter the address of the property
        </label>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            fetchSuggestions(e.target.value);
          }}
          onKeyDown={handleEnter}
          placeholder="Search for a place..."
          className=" w-full max-w-full p-2 rounded-lg border bg-white outline-none border-gray-300 text-black"
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

      {/* Map (only render when location selected) */}
      {showMap && <div id="map" className="h-[600px] w-full" />}
    </div>
  );
}

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

  useEffect(() => {
    if (!mapRef.current) {
      // 👇 Map with full zoom up to 23
      mapRef.current = L.map("map", {
        center: [37.7749, -122.4194], // Default USA (San Francisco)
        zoom: 13,
        minZoom: 2,
        maxZoom: 23, // ✅ allow max zoom
      });

      // Satellite basemap with maxZoom
      Esri.basemapLayer("Imagery", { maxZoom: 23 }).addTo(mapRef.current);
      Esri.basemapLayer("ImageryLabels", { maxZoom: 23 }).addTo(mapRef.current);

      // Polygon drawing
      drawnItemsRef.current = new L.FeatureGroup();
      mapRef.current.addLayer(drawnItemsRef.current);

      const drawControl = new L.Control.Draw({
        edit: { featureGroup: drawnItemsRef.current },
        draw: {
          polygon: true,
          rectangle: true,
          circle: false,
          marker: false,
          polyline: false,
          circlemarker: false,
        },
      });

      mapRef.current.addControl(drawControl);

      // Event when polygon is created
      mapRef.current.on(L.Draw.Event.CREATED, (e: any) => {
        const layer = e.layer;
        drawnItemsRef.current?.addLayer(layer);

        if (e.layerType === "polygon" || e.layerType === "rectangle") {
          const area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
          const areaInSqMeters = area.toFixed(2);
          const areaInSqFeet = (area * 10.7639).toFixed(2);

          // Show measurement
          alert(`Roof Area: ${areaInSqMeters} m² (${areaInSqFeet} ft²)`);
        }
      });
    }
  }, []);

  // Fetch search suggestions
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

  // Handle suggestion select
  const handleSelect = async (magicKey: string, text: string) => {
    setQuery(text);
    setSuggestions([]);

    const url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&magicKey=${magicKey}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.candidates?.length > 0) {
      const { location } = data.candidates[0];
      if (mapRef.current) {
        // 👇 zoom level set to 22 (max detail for roofs)
        mapRef.current.setView([location.y, location.x], 22);
        L.marker([location.y, location.x]).addTo(mapRef.current);
      }
    }
  };

  return (
    <div className="relative h-screen w-full">
      {/* Custom Search */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-[400px]">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            fetchSuggestions(e.target.value);
          }}
          placeholder="Search for a place..."
          className="w-full p-2 rounded-lg border shadow bg-white text-black"
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

      {/* Map */}
      <div id="map" className="h-full w-full" />
    </div>
  );
}

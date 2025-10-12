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
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

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
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const drawRef = useRef<MapboxDraw | null>(null);
    const geocoderRef = useRef<MapboxGeocoder | null>(null);

    const [lng] = useState(-118.2437);
    const [lat] = useState(34.0522);
    const [zoom] = useState(18);
    const [maxZoom] = useState(22);

    // ✅ Popup + marker state
    const markerRef = useRef<mapboxgl.Marker | null>(null);
    const popupRef = useRef<mapboxgl.Popup | null>(null);
    const [confirmed, setConfirmed] = useState(false);
    const [isHighRes, setIsHighRes] = useState(false);

    // ✅ Real-time measurement state
    const [currentDistance, setCurrentDistance] = useState<number | null>(null);
    const [totalDistance, setTotalDistance] = useState<number>(0);
    const [currentLineLength, setCurrentLineLength] = useState<number>(0);
    const [currentMode, setCurrentMode] = useState<string>("simple_select");

    // ✅ Expose functions to parent component via ref
    useImperativeHandle(ref, () => ({
      confirmLocation: (coords: [number, number]) => {
        confirmLocation(coords);
      },
      startDrawing: () => {
        startDrawing();
      },
      deleteAll: () => {
        deleteAll();
      },
      setDrawMode: (mode: string) => {
        setDrawMode(mode);
      },
      searchAddress: (address: string) => {
        searchAddress(address);
      },
    }));

    // ✅ Initialize Map
    useEffect(() => {
      if (!mapContainerRef.current) return;

      // Init Map with high-resolution settings
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/satellite-streets-v12",
        center: [lng, lat],
        zoom: zoom,
        maxZoom: maxZoom,
        minZoom: 10,
        maxPitch: 60,
        antialias: true,
        preserveDrawingBuffer: true,
      });

      // ✅ Wait for map to load then enhance tiles
      mapRef.current.on("load", () => {
        if (!mapRef.current) return;

        // Force high DPI rendering for sharper images
        mapRef.current.getCanvas().style.imageRendering = "auto";

        // Add event listener for zoom changes
        mapRef.current.on("zoom", () => {
          if (mapRef.current && mapRef.current.getZoom() >= 19) {
            setIsHighRes(true);
          } else {
            setIsHighRes(false);
          }
        });

        // Force a rerender to ensure high resolution tiles
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.triggerRepaint();
          }
        }, 1000);

        // Notify parent that map is loaded
        if (onMapLoad) {
          onMapLoad(mapRef.current);
        }

        // ✅ Initialize Geocoder for programmatic search
        geocoderRef.current = new MapboxGeocoder({
          accessToken: mapboxgl.accessToken,
          mapboxgl: mapboxgl,
          marker: false,
          zoom: 19,
        });

        // ✅ Auto-search if project data exists
        if (projectData) {
          const fullAddress = `${projectData.street}, ${projectData.city}, ${projectData.state} ${projectData.zip}`;
          setTimeout(() => {
            searchAddress(fullAddress);
          }, 1500);
        }
      });

      // ✅ Handle tile loading events for better image quality
      mapRef.current.on("sourcedata", (e) => {
        if (e.sourceId && e.isSourceLoaded) {
          setTimeout(() => {
            mapRef.current?.triggerRepaint();
          }, 100);
        }
      });

      // Controls
      mapRef.current.addControl(new mapboxgl.NavigationControl());

      // ✅ Draw Tools with custom modes for real-time measurement
      drawRef.current = new MapboxDraw({
        displayControlsDefault: false, // Hide default controls
        controls: {
          polygon: true,
          trash: true,
          line_string: false,
          point: false,
          combine_features: false,
          uncombine_features: false,
        },
        defaultMode: "simple_select",
        modes: {
          ...MapboxDraw.modes,
          draw_polygon: {
            ...MapboxDraw.modes.draw_polygon,
            // Override to add real-time measurement
            onMouseMove: function (state: any, e: any) {
              const mainState = MapboxDraw.modes.draw_polygon.onMouseMove.call(
                this,
                state,
                e
              );

              // Calculate real-time distance
              if (state.polygon.coordinates.length > 0) {
                const currentCoord = e.lngLat;
                const lastCoord =
                  state.polygon.coordinates[0][
                    state.polygon.coordinates[0].length - 2
                  ];

                if (lastCoord) {
                  const from = turf.point([lastCoord[0], lastCoord[1]]);
                  const to = turf.point([currentCoord.lng, currentCoord.lat]);
                  const distance = turf.distance(from, to, { units: "feet" });
                  setCurrentDistance(distance);
                  setCurrentLineLength(distance);
                }
              }

              return mainState;
            },
            onClick: function (state: any, e: any) {
              const mainState = MapboxDraw.modes.draw_polygon.onClick.call(
                this,
                state,
                e
              );

              // Update total distance when point is clicked
              if (
                state.polygon.coordinates.length > 0 &&
                state.polygon.coordinates[0].length > 2
              ) {
                const coords = state.polygon.coordinates[0];
                let total = 0;
                for (let i = 0; i < coords.length - 1; i++) {
                  const from = turf.point(coords[i]);
                  const to = turf.point(coords[i + 1]);
                  total += turf.distance(from, to, { units: "feet" });
                }
                setTotalDistance(total);
              }

              setCurrentDistance(null);
              return mainState;
            },
          },
        },
      });

      mapRef.current.addControl(drawRef.current);

      // ✅ Draw event listeners
      mapRef.current.on("draw.create", updateMeasurements);
      mapRef.current.on("draw.update", updateMeasurements);
      mapRef.current.on("draw.delete", () => {
        setPlanArea(0);
        setRoofArea(0);
        setEdges([]);
        setPolygonPoints([]);
        setCurrentDistance(null);
        setTotalDistance(0);
        setCurrentLineLength(0);
      });

      // ✅ Track current mode
      mapRef.current.on("draw.modechange", (e: any) => {
        setCurrentMode(e.mode);
      });

      return () => {
        mapRef.current?.remove();
      };
    }, []);

    // ✅ Function to search address programmatically
    const searchAddress = (address: string) => {
      if (!mapRef.current || !geocoderRef.current) return;

      console.log("Searching for address:", address);

      // Use Mapbox Geocoding API directly
      fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address
        )}.json?access_token=${mapboxgl.accessToken}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.features && data.features.length > 0) {
            const firstResult = data.features[0];
            const coords = firstResult.center as [number, number];

            console.log("Found location:", firstResult.place_name, coords);

            // Fly to the location
            mapRef.current?.flyTo({
              center: coords,
              zoom: 20,
              essential: true,
            });

            // Show marker and confirmation popup
            confirmLocation(coords);
          } else {
            console.log("No results found for address:", address);
          }
        })
        .catch((error) => {
          console.error("Error searching address:", error);
        });
    };

    // ✅ Function to handle location confirmation from external source (toolbar search)
    const confirmLocation = (coords: [number, number]) => {
      // Clear old marker/popup
      markerRef.current?.remove();
      popupRef.current?.remove();

      // Add marker
      markerRef.current = new mapboxgl.Marker({ color: "orange" })
        .setLngLat(coords)
        .addTo(mapRef.current!);

      // Add popup with confirm button
      const popupNode = document.createElement("div");
      popupNode.innerHTML = `
        <div style="text-align:center; max-width:220px;">
          <p class="font-semibold mb-2">Is this the right property?</p>
          <p class="text-xs text-gray-600 mb-2">If not, move the map around to find the right one.</p>
          <button id="confirm-btn" class="px-3 py-1 cursor-pointer bg-blue-600 text-white rounded">Confirm Location</button>
        </div>
      `;

      popupRef.current = new mapboxgl.Popup({ closeOnClick: false })
        .setDOMContent(popupNode)
        .setLngLat(coords)
        .addTo(mapRef.current!);

      // Attach listener
      popupNode.querySelector("#confirm-btn")?.addEventListener("click", () => {
        setConfirmed(true);
        popupRef.current?.remove();
        // Zoom in further after confirmation
        mapRef.current?.flyTo({
          center: coords,
          zoom: 21,
          duration: 1500,
        });
      });
    };

    // ✅ Start drawing polygon
    const startDrawing = () => {
      if (drawRef.current) {
        drawRef.current.changeMode("draw_polygon");
        setCurrentMode("draw_polygon");
      }
    };

    // ✅ Delete all drawings
    const deleteAll = () => {
      if (drawRef.current) {
        drawRef.current.deleteAll();
        setPlanArea(0);
        setRoofArea(0);
        setEdges([]);
        setPolygonPoints([]);
        setCurrentDistance(null);
        setTotalDistance(0);
        setCurrentLineLength(0);
      }
    };

    // ✅ Set draw mode
    const setDrawMode = (mode: string) => {
      if (drawRef.current) {
        drawRef.current.changeMode(mode);
        setCurrentMode(mode);
      }
    };

    // ✅ Measurement update
    const updateMeasurements = () => {
      if (!drawRef.current) return;
      const data = drawRef.current.getAll();
      if (data.features.length > 0) {
        data.features.forEach((polygon) => {
          if (polygon.geometry.type === "Polygon") {
            const areaSqMeters = turf.area(polygon);
            const areaSqFeet = areaSqMeters * 10.7639;
            setPlanArea(areaSqFeet);
            setRoofArea(areaSqFeet * 1.05);

            const edges: { id: string; length: number; type: string }[] = [];
            const coords = polygon.geometry.coordinates[0];
            let totalPerimeter = 0;

            coords.forEach((c, i) => {
              if (i < coords.length - 1) {
                const from = turf.point(c);
                const to = turf.point(coords[i + 1]);
                const length = turf.distance(from, to, { units: "feet" });
                totalPerimeter += length;
                edges.push({ id: `edge-${i}`, length, type: "edge" });
              }
            });

            setEdges(edges);
            setTotalDistance(totalPerimeter);

            const points = coords.map((c, i) => ({
              lat: c[1],
              lon: c[0],
              seq: i + 1,
            }));
            setPolygonPoints(points);
          }
        });
      }
    };

    // ✅ Format distance for display
    const formatDistance = (distance: number): string => {
      if (distance < 1) {
        return `${(distance * 12).toFixed(1)} inches`; // Convert to inches if less than 1 foot
      }
      return `${distance.toFixed(2)} ft`;
    };

    // ✅ Helper view buttons
    const setTopView = () =>
      mapRef.current?.easeTo({
        pitch: 0,
        bearing: 0,
        duration: 1000,
        zoom: Math.max(19, mapRef.current?.getZoom() || 19),
      });

    const set3DView = () =>
      mapRef.current?.easeTo({
        pitch: 60,
        bearing: -17.6,
        duration: 1000,
        zoom: Math.max(19, mapRef.current?.getZoom() || 19),
      });

    const openStreetView = () => {
      if (!mapRef.current) return;
      const center = mapRef.current.getCenter();
      const url = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${center.lat},${center.lng}`;
      window.open(url, "_blank");
    };

    // ✅ Force high resolution refresh
    const forceHighRes = () => {
      if (mapRef.current) {
        mapRef.current.triggerRepaint();
        const currentZoom = mapRef.current.getZoom();
        mapRef.current.zoomTo(currentZoom + 0.001, { duration: 100 });
        setTimeout(() => {
          mapRef.current?.zoomTo(currentZoom, { duration: 100 });
        }, 150);
      }
    };

    return (
      <div className="w-full">
        <div className="w-full h-[calc(100vh-100px)] overflow-hidden border border-gray-300 relative">
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* ✅ Real-time Measurement Display */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-black/80 text-white rounded-lg p-3 shadow-lg min-w-[300px]">
            <div className="text-center">
              <h3 className="font-bold text-sm mb-2">
                📏 Real-time Measurements
              </h3>

              {/* Current Mode Indicator */}
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-yellow-300">Mode:</span>
                <span className="font-mono capitalize">
                  {currentMode.replace("_", " ")}
                </span>
              </div>

              {/* Current Line Distance */}
              {currentDistance !== null && (
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-green-300">Current Line:</span>
                  <span className="font-mono">
                    {formatDistance(currentDistance)}
                  </span>
                </div>
              )}

              {/* Total Perimeter */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-blue-300">Total Perimeter:</span>
                <span className="font-mono">
                  {formatDistance(totalDistance)}
                </span>
              </div>

              {/* Auto-search Indicator */}
              {projectData && (
                <div className="text-xs text-green-300 mt-1">
                  ✅ Auto-searched: {projectData.street}
                </div>
              )}

              {/* Drawing Instructions */}
              <div className="text-xs text-gray-300 mt-2">
                {currentMode === "draw_polygon"
                  ? "💡 Click to place points, double-click to complete polygon"
                  : currentMode === "direct_select"
                  ? "💡 Drag points to edit, click on line to add points"
                  : "💡 Click on polygon to select"}
              </div>
            </div>
          </div>

          {/* ✅ Bottom Control Bar */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white shadow-md rounded-lg flex gap-2 p-2">
            <button
              onClick={setTopView}
              className="px-3 py-1 cursor-pointer bg-gray-200 rounded hover:bg-gray-300"
            >
              Top View
            </button>
            <button
              onClick={set3DView}
              className="px-3 py-1 cursor-pointer bg-gray-200 rounded hover:bg-gray-300"
            >
              3D View
            </button>
            <button
              onClick={openStreetView}
              className="px-3 py-1 cursor-pointer bg-gray-200 rounded hover:bg-gray-300"
            >
              Street View
            </button>
            <button
              onClick={forceHighRes}
              className="px-3 py-1 cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Enhance Resolution
            </button>
          </div>

          {/* ✅ Confirmed Banner */}
          {confirmed && (
            <div className="absolute top-2 right-2 bg-green-600 text-white px-3 py-1 rounded shadow">
              ✅ Location Confirmed
            </div>
          )}

          {/* ✅ High Resolution Indicator */}
          {isHighRes && (
            <div className="absolute top-12 left-2 bg-blue-500 text-white px-3 py-1 rounded shadow text-sm">
              🔍 High Resolution View
            </div>
          )}
        </div>
      </div>
    );
  }
);

RoofMapSection.displayName = "RoofMapSection";
export default RoofMapSection;

"use client";
import { useState } from "react";
import CustomerPanelNavbar from "@/components/customerpabelnavbar";
import RoofEstimator from "@/app/roof-map/page";
import { FaHome, FaBuilding, FaCity, FaCheckCircle } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { orderRoofAPI } from "@/services/api";
import { generateOrderRoofPDFAPI } from "@/services/api"; // import your pdf api
import { Home } from "lucide-react";

export default function DashboardLayout() {
  const [propertyType, setPropertyType] = useState<
    "single" | "multi" | "commercial" | ""
  >("");
  const [isGafTakeoff] = useState(false); // always false
  const [primaryEmail, setPrimaryEmail] = useState("");
  const [reportEmails, setReportEmails] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [structureOption, setStructureOption] = useState<
    "primary" | "all" | "exclude-primary"
  >("primary");
  const [additionalInfo, setAdditionalInfo] = useState(
    "Please include only the primary structure in my report."
  );

  const [planArea, setPlanArea] = useState<number | null>(null);
  const [roofArea, setRoofArea] = useState<number | null>(null);
  const [edges, setEdges] = useState<
    { id: string; length: number; type: string }[]
  >([]);
  const [polygonPoints, setPolygonPoints] = useState<
    { lat: number; lon: number; seq: number }[]
  >([]);

  const structureMessages: Record<typeof structureOption, string> = {
    primary: "Please include only the primary structure in my report.",
    all: "Please include all structures on the parcel in my report.",
    "exclude-primary":
      "Please include all structures except the primary one in my report.",
  };

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const handleStructureSelect = (option: typeof structureOption) => {
    setStructureOption(option);
    setAdditionalInfo(structureMessages[option]);
  };

  const handleReportEmailClick = () => {
    setReportEmails(primaryEmail);
  };

  // --- Post API Mutation ---
  const mutation = useMutation({
    mutationFn: orderRoofAPI,
    onSuccess: async (data: any) => {
      console.log("email", data);
      toast.success("Roof report ordered successfully!");

      // extract email from response
      const email = data?.cc_emails[0];
      if (email) {
        try {
          // call generate PDF API
          const response = await generateOrderRoofPDFAPI(email);

          // automatic PDF download
          const blob = new Blob([response], { type: "application/pdf" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "roof-report.pdf";
          link.click();
          URL.revokeObjectURL(link.href);
        } catch (err: any) {
          toast.error("Failed to generate PDF report!");
        }
      }
    },
    onError: (err: any) => {
      toast.error(err?.message || "Something went wrong!");
    },
  });

  // const handleSubmit = () => {
  //   if (!propertyType || !primaryEmail) {
  //     toast.error("⚠️ Please fill required fields (property type & email).");
  //     return;
  //   }

  //   const body = {
  //     property_type:
  //       propertyType === "single"
  //         ? "single_family"
  //         : propertyType === "multi"
  //         ? "multi_family"
  //         : "commercial",
  //     is_gaf_takeoff: false,
  //     address_line: "123 Main St, Los Angeles, CA", // TODO: bind from RoofEstimator
  //     plan_area_sqft: planArea ? planArea * 10.7639 : 2000,
  //     roof_area_sqft: roofArea ? roofArea * 10.7639 : 2100,
  //     pitch: "4:12",
  //     include_structures:
  //       structureOption === "primary"
  //         ? "primary_only"
  //         : structureOption === "all"
  //         ? "all_structures"
  //         : "exclude_primary",
  //     additional_info: additionalInfo,
  //     primary_email: primaryEmail,
  //     cc_emails: reportEmails
  //       ? reportEmails.split(",").map((e) => e.trim())
  //       : [],
  //     map_image_url: null,
  //     total_cost: 0.0,
  //     edges: edges.map((e) => ({
  //       classification: e.type,
  //       length_ft: e.length * 3.28084,
  //     })),
  //     polygon_points: polygonPoints,
  //     services: selectedServices.map((s) =>
  //       s === "roof" ? "roof_estimate" : "scope_connect"
  //     ),
  //   };

  //   mutation.mutate(body);
  // };

  const handleSubmit = () => {
    if (!propertyType || !primaryEmail) {
      toast.error("⚠️ Please fill required fields (property type & email).");
      return;
    }

    // 🔹 Static demo body
    const body = {
      property_type: "single_family",
      is_gaf_takeoff: false,
      address_line: "123 Main St, Los Angeles, CA",
      plan_area_sqft: 2000,
      roof_area_sqft: 2100,
      pitch: "4:12",
      include_structures: "primary_only",
      additional_info: "Please include skylight details",
      primary_email: primaryEmail,
      cc_emails: reportEmails
        ? reportEmails.split(",").map((e) => e.trim())
        : [],
      map_image_url: null,
      total_cost: 0.0,
      edges: [
        { classification: "ridge", length_ft: 25.2 },
        { classification: "hip", length_ft: 15.0 },
      ],
      polygon_points: [
        { lat: 34.0522, lon: -118.2437, seq: 1 },
        { lat: 34.0525, lon: -118.2432, seq: 2 },
      ],
      services: ["roof_estimate", "scope_connect"],
    };

    mutation.mutate(body);
  };

  return (
    <div className="flex text-gray-900 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <div className="flex-1 flex flex-col w-full">
        <CustomerPanelNavbar />
        <main className="min-h-screen flex justify-center px-3 max-w-6xl mx-auto w-full">
          <div className="my-10 w-full bg-white shadow-lg rounded-2xl p-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-center flex items-center justify-center gap-3 mb-10 text-gray-800">
              <Home className="w-8 h-8" /> Order a Roof Report
            </h1>

            {/* Property Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { type: "single", icon: <FaHome />, label: "Single Family" },
                { type: "multi", icon: <FaBuilding />, label: "Multi Family" },
                { type: "commercial", icon: <FaCity />, label: "Commercial" },
              ].map((opt) => (
                <button
                  key={opt.type}
                  onClick={() =>
                    setPropertyType(opt.type as typeof propertyType)
                  }
                  className={`cursor-pointer flex flex-col items-center p-6 rounded-xl border-2 shadow-sm transition transform hover:-translate-y-1 ${
                    propertyType === opt.type
                      ? "border-red-600 bg-red-50 shadow-md"
                      : "border-gray-300 hover:border-red-400 bg-white"
                  }`}
                >
                  <div className="text-4xl mb-3 text-red-600">{opt.icon}</div>
                  <span className="font-semibold text-gray-800">
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>

            {/* RoofEstimator */}
            {!isGafTakeoff && (
              <div className="my-10">
                <RoofEstimator
                  setPlanArea={setPlanArea}
                  setRoofArea={setRoofArea}
                  setEdges={setEdges}
                  setPolygonPoints={setPolygonPoints}
                />
              </div>
            )}

            {/* Email + Services + Structure Options */}
            {(propertyType === "single" ||
              propertyType === "multi" ||
              propertyType === "commercial") && (
              <div className="mt-12 w-full">
                {/* Services */}
                {!isGafTakeoff && (
                  <div className="mb-12">
                    <p className="text-sm text-gray-700 mb-4 text-center">
                      <strong>Select One or More Services</strong>{" "}
                      <span className="text-gray-500">
                        | Discounts apply for multiple services
                      </span>
                    </p>

                    <div className="flex flex-wrap gap-6 justify-center">
                      <button
                        onClick={() => toggleService("roof")}
                        className={`flex-1 min-w-[220px] p-5 rounded-xl border-2 text-center shadow-sm transition ${
                          selectedServices.includes("roof")
                            ? "border-red-600 bg-red-50 shadow-md"
                            : "border-gray-300 hover:border-red-400 bg-white"
                        }`}
                      >
                        <FaCheckCircle className="text-2xl mb-2 text-red-600 mx-auto" />
                        <span className="font-medium">
                          Roof Measurement Report
                        </span>
                      </button>

                      <button
                        onClick={() => toggleService("scope")}
                        className={`flex-1 min-w-[220px] p-5 rounded-xl border-2 text-center shadow-sm transition ${
                          selectedServices.includes("scope")
                            ? "border-red-600 bg-red-50 shadow-md"
                            : "border-gray-300 hover:border-red-400 bg-white"
                        }`}
                      >
                        <FaCheckCircle className="text-2xl mb-2 text-red-600 mx-auto" />
                        <span className="font-medium">
                          Scope Connect Report
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Emails */}
                <div className="mb-12">
                  <label className="block mb-2 font-semibold text-gray-700">
                    Primary Report Email
                  </label>
                  <input
                    type="email"
                    value={primaryEmail}
                    onChange={(e) => setPrimaryEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-red-400 outline-none"
                  />

                  <label className="block mt-6 mb-2 font-semibold text-gray-700">
                    Additional Report Emails (Optional)
                  </label>
                  <input
                    type="text"
                    value={reportEmails}
                    onChange={(e) => setReportEmails(e.target.value)}
                    placeholder="Separate multiple emails with commas"
                    className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-red-400 outline-none"
                  />
                  <button
                    onClick={handleReportEmailClick}
                    className="mt-2 text-sm text-red-600 hover:underline"
                  >
                    Use Primary Email
                  </button>
                </div>

                {/* Structure Option */}
                <div className="mb-12">
                  <label className="block mb-4 font-semibold text-gray-700">
                    Structure Selection
                  </label>
                  <div className="flex flex-col gap-4 bg-gray-50 rounded-lg p-4 shadow-inner">
                    {(["primary", "all", "exclude-primary"] as const).map(
                      (option) => (
                        <label
                          key={option}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <input
                            type="radio"
                            checked={structureOption === option}
                            onChange={() => handleStructureSelect(option)}
                            className="w-5 h-5 text-red-600"
                          />
                          <span className="text-gray-700">
                            {structureMessages[option]}
                          </span>
                        </label>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="text-center">
              <button
                onClick={handleSubmit}
                disabled={mutation.isPending}
                className="cursor-pointer px-8 py-4 bg-red-600 text-white rounded-xl font-semibold shadow-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {mutation.isPending ? "Submitting..." : "Submit Order"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

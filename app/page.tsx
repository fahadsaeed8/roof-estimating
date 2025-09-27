"use client";
import { useState } from "react";
import CustomerPanelNavbar from "@/components/customerpabelnavbar";
import RoofEstimator from "@/app/roof-map/page";
import {
  FaHome,
  FaBuilding,
  FaCity,
  FaCheckCircle,
  FaEnvelope,
  FaCopy,
  FaDownload,
} from "react-icons/fa";
import {
  MdApartment,
  MdOutlineRoofing,
  MdDesignServices,
} from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { orderRoofAPI, generateOrderRoofPDFAPI } from "@/services/api";
import {
  Home,
  Mail,
  Building,
  ChevronRight,
  Star,
  Shield,
  Clock,
} from "lucide-react";

export default function DashboardLayout() {
  const [propertyType, setPropertyType] = useState<
    "single" | "multi" | "commercial" | ""
  >("");
  const [isGafTakeoff] = useState(false);
  const [primaryEmail, setPrimaryEmail] = useState("");
  const [reportEmails, setReportEmails] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [structureOption, setStructureOption] = useState<
    "primary" | "all" | "exclude-primary"
  >("primary");
  const [additionalInfo, setAdditionalInfo] = useState(
    "Please include only the primary structure in my report."
  );
  const [activeStep, setActiveStep] = useState(1);

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
    toast.success("Primary email copied to additional emails!");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const mutation = useMutation({
    mutationFn: orderRoofAPI,
    onSuccess: async (data: any) => {
      toast.success("🎉 Roof report ordered successfully!");

      const email = data?.cc_emails[0];
      if (email) {
        try {
          const response = await generateOrderRoofPDFAPI(email);
          const blob = new Blob([response], { type: "application/pdf" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "roof-report.pdf";
          link.click();
          URL.revokeObjectURL(link.href);
          toast.success("📄 PDF report downloaded successfully!");
        } catch (err: any) {
          toast.error("Failed to generate PDF report!");
        }
      }
    },
    onError: (err: any) => {
      toast.error(err?.message || "Something went wrong!");
    },
  });

  const handleSubmit = () => {
    if (!propertyType || !primaryEmail) {
      toast.error("⚠️ Please fill required fields (property type & email).");
      return;
    }

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

  // Steps for better UX
  const steps = [
    {
      number: 1,
      title: "Property Type",
      icon: <Building className="w-5 h-5" />,
    },
    {
      number: 2,
      title: "Roof Details",
      icon: <MdOutlineRoofing className="w-5 h-5" />,
    },
    {
      number: 3,
      title: "Services",
      icon: <MdDesignServices className="w-5 h-5" />,
    },
    { number: 4, title: "Contact Info", icon: <Mail className="w-5 h-5" /> },
  ];

  return (
    <div className="flex text-gray-900 bg-gradient-to-br from-slate-50 via-blue-50 to-gray-100 min-h-screen">
      <div className="flex-1 flex flex-col w-full">
        <CustomerPanelNavbar />

        <main className="min-h-screen flex justify-center px-3 max-w-7xl mx-auto w-full">
          <div className="my-8 w-full bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 border border-white/20">
            {/* Header with Steps */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-center gap-3 mb-4">
                <Home className="w-10 h-10 text-blue-600" /> Order a Roof Report
              </h1>
              <p className="text-gray-600 text-lg mb-8">
                Complete your roof estimation in 4 simple steps
              </p>

              {/* Progress Steps */}
              <div className="flex justify-center mb-2">
                <div className="flex items-center space-x-8">
                  {steps.map((step, index) => (
                    <div key={step.number} className="flex items-center">
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                          activeStep >= step.number
                            ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                            : "border-gray-300 text-gray-400"
                        }`}
                      >
                        {step.icon}
                      </div>
                      {index < steps.length - 1 && (
                        <ChevronRight
                          className={`w-6 h-6 mx-4 ${
                            activeStep > step.number
                              ? "text-blue-600"
                              : "text-gray-300"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center space-x-16">
                {steps.map((step) => (
                  <span
                    key={step.number}
                    className={`text-sm font-medium ${
                      activeStep >= step.number
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </span>
                ))}
              </div>
            </div>

            {/* Property Type Selection - Step 1 */}
            <div
              className={`transition-all duration-500 ${
                activeStep >= 1 ? "block" : "hidden"
              }`}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Select Property Type
                </h2>
                <p className="text-gray-600">
                  Choose the type of property for your roof report
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {[
                  {
                    type: "single",
                    icon: <FaHome className="text-3xl" />,
                    label: "Single Family",
                    desc: "Individual residential homes",
                  },
                  {
                    type: "multi",
                    icon: <MdApartment className="text-3xl" />,
                    label: "Multi Family",
                    desc: "Apartments, duplexes, etc.",
                  },
                  {
                    type: "commercial",
                    icon: <FaCity className="text-3xl" />,
                    label: "Commercial",
                    desc: "Business buildings & complexes",
                  },
                ].map((opt) => (
                  <button
                    key={opt.type}
                    onClick={() => {
                      setPropertyType(opt.type as typeof propertyType);
                      setActiveStep(2);
                    }}
                    className={`cursor-pointer flex flex-col items-center p-8 rounded-2xl border-3 shadow-lg transition-all duration-300 transform hover:scale-105 ${
                      propertyType === opt.type
                        ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-blue-200"
                        : "border-gray-200 hover:border-blue-300 bg-white hover:shadow-xl"
                    }`}
                  >
                    <div className="mb-4 p-3 rounded-full bg-blue-100 text-blue-600">
                      {opt.icon}
                    </div>
                    <span className="font-bold text-lg text-gray-800 mb-2">
                      {opt.label}
                    </span>
                    <span className="text-sm text-gray-600 text-center">
                      {opt.desc}
                    </span>
                    {propertyType === opt.type && (
                      <div className="mt-3 flex items-center text-green-600 text-sm">
                        <FaCheckCircle className="mr-1" /> Selected
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* RoofEstimator - Step 2 */}
            {propertyType && (
              <div
                className={`transition-all duration-500 ${
                  activeStep >= 2 ? "block" : "hidden"
                }`}
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Roof Details & Mapping
                  </h2>
                  <p className="text-gray-600">
                    Provide accurate measurements for your roof estimation
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-blue-800 flex items-center">
                      <MdOutlineRoofing className="mr-2" /> Roof Mapping Tool
                    </h3>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      Step 2/4
                    </span>
                  </div>
                  {!isGafTakeoff && (
                    <RoofEstimator
                      setPlanArea={setPlanArea}
                      setRoofArea={setRoofArea}
                      setEdges={setEdges}
                      setPolygonPoints={setPolygonPoints}
                    />
                  )}
                  <button
                    onClick={() => setActiveStep(3)}
                    className="mt-4 w-full bg-blue-600 cursor-pointer text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg"
                  >
                    Continue to Services
                  </button>
                </div>
              </div>
            )}

            {/* Services - Step 3 */}
            {propertyType && (
              <div
                className={`transition-all duration-500 ${
                  activeStep >= 3 ? "block" : "hidden"
                }`}
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Select Services
                  </h2>
                  <p className="text-gray-600">
                    Choose the services you need - discounts for multiple
                    services!
                  </p>
                </div>

                {!isGafTakeoff && (
                  <div className="mb-12">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-green-800 flex items-center">
                          <MdDesignServices className="mr-2" /> Available
                          Services
                        </h3>
                        {selectedServices.length > 0 && (
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                            {selectedServices.length} selected
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {[
                          {
                            id: "roof",
                            icon: <FaCheckCircle className="text-2xl" />,
                            label: "Roof Measurement Report",
                            desc: "Detailed roof measurements and analysis",
                            features: [
                              "Accurate area calculation",
                              "Pitch analysis",
                              "Material estimation",
                            ],
                            popular: true,
                          },
                          {
                            id: "scope",
                            icon: <FaCheckCircle className="text-2xl" />,
                            label: "Scope Connect Report",
                            desc: "Comprehensive scope documentation",
                            features: [
                              "Project scope",
                              "Timeline estimation",
                              "Cost breakdown",
                            ],
                            popular: false,
                          },
                        ].map((service) => (
                          <div
                            key={service.id}
                            onClick={() => toggleService(service.id)}
                            className={`cursor-pointer p-6 rounded-xl border-3 transition-all duration-300 transform hover:scale-102 ${
                              selectedServices.includes(service.id)
                                ? "border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg"
                                : "border-gray-200 hover:border-green-300 bg-white"
                            } relative`}
                          >
                            {service.popular && (
                              <div className="absolute -top-2 -right-2 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                POPULAR
                              </div>
                            )}
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <div className="flex items-center mb-2">
                                  <div
                                    className={`mr-3 ${
                                      selectedServices.includes(service.id)
                                        ? "text-green-600"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    {service.icon}
                                  </div>
                                  <span className="font-bold text-lg text-gray-800">
                                    {service.label}
                                  </span>
                                </div>
                                <p className="text-gray-600 text-sm ml-9">
                                  {service.desc}
                                </p>
                              </div>
                            </div>
                            <ul className="ml-9 text-sm text-gray-600 space-y-1">
                              {service.features.map((feature, idx) => (
                                <li key={idx} className="flex items-center">
                                  <Star className="w-3 h-3 text-green-500 mr-2" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => setActiveStep(4)}
                        className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition shadow-lg"
                      >
                        Continue to Contact Information
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Contact Information - Step 4 */}
            {propertyType && (
              <div
                className={`transition-all duration-500 ${
                  activeStep >= 4 ? "block" : "hidden"
                }`}
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Contact Information
                  </h2>
                  <p className="text-gray-600">
                    Where should we send your roof report?
                  </p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100 mb-8">
                  {/* Email Section */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold text-purple-800 flex items-center">
                        <Mail className="mr-2" /> Email Configuration
                      </h3>
                      <Shield className="w-5 h-5 text-green-500" />
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block mb-3 font-semibold text-gray-700 flex items-center">
                          <FaEnvelope className="mr-2 text-blue-500" /> Primary
                          Report Email *
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            value={primaryEmail}
                            onChange={(e) => setPrimaryEmail(e.target.value)}
                            placeholder="your.email@example.com"
                            className="w-full px-4 py-3 pl-11 border-2 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
                          />
                          <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        </div>
                      </div>

                      <div>
                        <label className="block mb-3 font-semibold text-gray-700">
                          Additional Report Emails (Optional)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={reportEmails}
                            onChange={(e) => setReportEmails(e.target.value)}
                            placeholder="Separate multiple emails with commas"
                            className="w-full px-4 py-3 pl-11 border-2 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
                          />
                          <FaEnvelope className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                          <button
                            onClick={handleReportEmailClick}
                            className="absolute right-3 top-3.5 text-blue-600 hover:text-blue-800 transition"
                            title="Use primary email"
                          >
                            <FaCopy className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={handleReportEmailClick}
                          className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium transition flex items-center"
                        >
                          <FaCopy className="mr-1" /> Use Primary Email
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Structure Option */}
                  <div className="mb-8">
                    <label className="block mb-4 font-semibold text-gray-700 flex items-center">
                      <Building className="mr-2" /> Structure Selection
                    </label>
                    <div className="space-y-3 bg-white/50 rounded-xl p-4">
                      {(["primary", "all", "exclude-primary"] as const).map(
                        (option) => (
                          <label
                            key={option}
                            className="flex items-center gap-4 cursor-pointer p-3 rounded-lg hover:bg-white transition"
                          >
                            <input
                              type="radio"
                              checked={structureOption === option}
                              onChange={() => handleStructureSelect(option)}
                              className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-700 flex-1">
                              {structureMessages[option]}
                            </span>
                          </label>
                        )
                      )}
                    </div>
                  </div>

                  {/* Final Submit */}
                  <div className="text-center pt-4">
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <Clock className="w-5 h-5 text-gray-600" />
                      <span className="text-sm text-gray-600">
                        Estimated processing time: 2-4 hours
                      </span>
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={mutation.isPending || !primaryEmail}
                      className="cursor-pointer px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center mx-auto min-w-[200px]"
                    >
                      {mutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <FaDownload className="mr-2" /> Submit Order
                        </>
                      )}
                    </button>

                    <p className="text-xs text-gray-500 mt-3">
                      By submitting, you agree to our terms of service
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {propertyType && (
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
                  className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-blue-400 transition"
                  disabled={activeStep === 1}
                >
                  Previous
                </button>

                {activeStep < 4 && (
                  <button
                    onClick={() =>
                      setActiveStep((prev) => Math.min(4, prev + 1))
                    }
                    className="px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                  >
                    Next Step
                  </button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

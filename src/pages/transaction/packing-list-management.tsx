import { useState } from "react";
import { PackingListDetails } from "./generate-packing-list-details";
import { useLocation } from "react-router-dom";

export default function PackingListManagement() {

  const location = useLocation();
  const defaultTab = location.state?.tab || "domestic";
  const [activeTab, setActiveTab] = useState(defaultTab);
  // const [activeTab, setActiveTab] = useState("domestic");

  return (
    <div className="p-6 pt-16">
      <h1 className="text-2xl font-semibold mb-4">Packing List Management</h1>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-6">
        <button
          className={`pb-2 px-4 ${activeTab === "domestic" ? "border-b-2 border-blue-500 text-blue-500 font-semibold" : "text-gray-600"}`}
          onClick={() => setActiveTab("domestic")}
        >
          Generate Packing List Domestic
        </button>
        <button
          className={`pb-2 px-4 ${activeTab === "export" ? "border-b-2 border-blue-500 text-blue-500 font-semibold" : "text-gray-600"}`}
          onClick={() => setActiveTab("export")}
        >
          Generate Packing List Export
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "domestic" && (
          <div>
            {/* Replace this with your Domestic Order component */}
            <PackingListDetails />
          </div>
        )}
        {activeTab === "export" && (
          <div>
            {/* Replace this with your Export Order component */}
            <PackingListDetails />
          </div>
        )}
      </div>
    </div>
  );
}

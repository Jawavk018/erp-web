import { useState } from "react";
import { SalesOrderDetails } from "./sales-order-details";
import { SalesOrderExportDetails } from "./sales-order-export-details";
import { useLocation } from "react-router-dom";

export default function SalesOrderManagement() {

  const location = useLocation();
  const defaultTab = location.state?.tab || "domestic";
  const [activeTab, setActiveTab] = useState(defaultTab);

  // const [activeTab, setActiveTab] = useState("domestic");

  return (
    <div className="p-6 pt-16">
      <h1 className="text-2xl font-semibold mb-4">Sales Order Management</h1>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-6">
        <button
          className={`pb-2 px-4 ${activeTab === "domestic" ? "border-b-2 border-blue-500 text-blue-500 font-semibold" : "text-gray-600"}`}
          onClick={() => setActiveTab("domestic")}
        >
          Sales Order Domestic
        </button>
        <button
          className={`pb-2 px-4 ${activeTab === "export" ? "border-b-2 border-blue-500 text-blue-500 font-semibold" : "text-gray-600"}`}
          onClick={() => setActiveTab("export")}
        >
          Sales Order Export
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "domestic" && (
          <div>
            {/* Replace this with your Domestic Order component */}
            <SalesOrderDetails />
          </div>
        )}
        {activeTab === "export" && (
          <div>
            {/* Replace this with your Export Order component */}
            <SalesOrderExportDetails />
          </div>
        )}
      </div>
    </div>
  );
}

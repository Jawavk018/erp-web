import { useState } from "react";
import { SalesOrderDetails } from "../transaction/sales-order-details";
import { SalesOrderExportDetails } from "../transaction/sales-order-export-details";
import { CountryMaster } from "../location-masters/country-master";
import { StateMaster } from "../location-masters/state-master";
import { CityMaster } from "../location-masters/city-master";

export default function LocationManagement() {
  const [activeTab, setActiveTab] = useState("countryMaster");

  return (
    <div className="p-6 pt-16">
      <h1 className="text-2xl font-semibold mb-4">Location Management</h1>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-6">
        <button
          className={`pb-2 px-4 ${activeTab === "countryMaster" ? "border-b-2 border-blue-500 text-blue-500 font-semibold" : "text-gray-600"}`}
          onClick={() => setActiveTab("countryMaster")}
        >
          Country Master
        </button>
        <button
          className={`pb-2 px-4 ${activeTab === "stateMaster" ? "border-b-2 border-blue-500 text-blue-500 font-semibold" : "text-gray-600"}`}
          onClick={() => setActiveTab("stateMaster")}
        >
          State Master
        </button>
        <button
          className={`pb-2 px-4 ${activeTab === "cityMaster" ? "border-b-2 border-blue-500 text-blue-500 font-semibold" : "text-gray-600"}`}
          onClick={() => setActiveTab("cityMaster")}
        >
          City Master
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "countryMaster" && (
          <div>
            <CountryMaster />
          </div>
        )}
        {activeTab === "stateMaster" && (
          <div>
            <StateMaster />
          </div>
        )}
         {activeTab === "cityMaster" && (
          <div>
            <CityMaster />
          </div>
        )}
      </div>
    </div>
  );
}

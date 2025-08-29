import { useState } from "react";
import { SalesOrderDetails } from "../transaction/sales-order-details";
import { SalesOrderExportDetails } from "../transaction/sales-order-export-details";
import { CountryMaster } from "../location-masters/country-master";
import { StateMaster } from "../location-masters/state-master";
import { CityMaster } from "../location-masters/city-master";
import WovenFabricMaster from "./fabric-master";
import KnittedFabricMaster from "./knitted-fabric-master";

export default function FabricManagement() {

  const [activeTab, setActiveTab] = useState("wovenFabricMaster");

  return (
    <div className="p-6 pt-16">
      <h1 className="text-2xl font-semibold mb-4">Fabric Management</h1>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-6">
        <button
          className={`pb-2 px-4 ${activeTab === "wovenFabricMaster" ? "border-b-2 border-blue-500 text-blue-500 font-semibold" : "text-gray-600"}`}
          onClick={() => setActiveTab("wovenFabricMaster")}
        >
          Woven Fabric Master
        </button>
        <button
          className={`pb-2 px-4 ${activeTab === "knittedFabricMaster" ? "border-b-2 border-blue-500 text-blue-500 font-semibold" : "text-gray-600"}`}
          onClick={() => setActiveTab("knittedFabricMaster")}
        >
          Knitted Fabric Master
        </button>
        {/* <button
          className={`pb-2 px-4 ${activeTab === "cityMaster" ? "border-b-2 border-blue-500 text-blue-500 font-semibold" : "text-gray-600"}`}
          onClick={() => setActiveTab("cityMaster")}
        >
          City Master
        </button> */}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "wovenFabricMaster" && (
          <div>
            <WovenFabricMaster />
          </div>
        )}
        {activeTab === "knittedFabricMaster" && (
          <div>
            <KnittedFabricMaster />
          </div>
        )}
         {/* {activeTab === "cityMaster" && (
          <div>
            <CityMaster />
          </div>
        )} */}
      </div>
    </div>
  );
}

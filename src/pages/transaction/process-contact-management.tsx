import { useState } from "react";
import { ProcessContractDetails } from "./process-contract-details";
import { ProcessContractYarnDetails } from "./process-contract-yarn-details";
import { useLocation } from "react-router-dom";


export default function ProcessContactManagement() {

  const location = useLocation();
  const defaultTab = location.state?.tab || "processContactFabric";
  const [activeTab, setActiveTab] = useState(defaultTab);
  // const [activeTab, setActiveTab] = useState("processContactFabric");

  return (
    <div className="p-6 pt-16">
      <h1 className="text-2xl font-semibold mb-4">Process Contract Management</h1>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-6">
        <button
          className={`pb-2 px-4 ${activeTab === "processContactFabric" ? "border-b-2 border-blue-500 text-blue-500 font-semibold" : "text-gray-600"}`}
          onClick={() => setActiveTab("processContactFabric")}
        >
          Process Contract Fabric
        </button>
        <button
          className={`pb-2 px-4 ${activeTab === "processContactYarn" ? "border-b-2 border-blue-500 text-blue-500 font-semibold" : "text-gray-600"}`}
          onClick={() => setActiveTab("processContactYarn")}
        >
          Process Contract Yarn
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "processContactFabric" && (
          <div>
            <ProcessContractDetails />
          </div>
        )}
        {activeTab === "processContactYarn" && (
          <div>
            <ProcessContractYarnDetails />
          </div>
        )}
      </div>
    </div>
  );
}

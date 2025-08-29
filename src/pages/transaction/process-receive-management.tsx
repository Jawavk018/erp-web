import { useState } from "react";
import { FinishFabricReceiveDetails } from "./finish-fabric-receive-details";


export default function ProcessingReceiveManagement() {

  const [activeTab, setActiveTab] = useState("processingReceiveFabric");

  return (
    <div className="p-6 pt-16">
      <h1 className="text-2xl font-semibold mb-4">Processing Receive Management</h1>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-6">
        <button
          className={`pb-2 px-4 ${activeTab === "processingReceiveFabric" ? "border-b-2 border-blue-500 text-blue-500 font-semibold" : "text-gray-600"}`}
          onClick={() => setActiveTab("processingReceiveFabric")}
        >
          Processing Receive Fabric
        </button>
        <button
          className={`pb-2 px-4 ${activeTab === "processingReceiveYarn" ? "border-b-2 border-blue-500 text-blue-500 font-semibold" : "text-gray-600"}`}
          onClick={() => setActiveTab("processingReceiveYarn")}
        >
          Processing Receive Yarn
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "processingReceiveFabric" && (
          <div>
            <FinishFabricReceiveDetails />
          </div>
        )}
        {activeTab === "processingReceiveYarn" && (
          <div>
            <FinishFabricReceiveDetails />
          </div>
        )}
      </div>
    </div>
  );
}

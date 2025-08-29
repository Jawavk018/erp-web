import { useState } from "react";
import { ProcessContractDetails } from "./process-contract-details";
import { ProcessingIssueDetails } from "./processing-issue-details";


export default function ProcessingIssueManagement() {

  const [activeTab, setActiveTab] = useState("processIssueFabric");

  return (
    <div className="p-6 pt-16">
      <h1 className="text-2xl font-semibold mb-4">Processing Issue Management</h1>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-6">
        <button
          className={`pb-2 px-4 ${activeTab === "processIssueFabric" ? "border-b-2 border-blue-500 text-blue-500 font-semibold" : "text-gray-600"}`}
          onClick={() => setActiveTab("processIssueFabric")}
        >
          Processing Issue Fabric
        </button>
        <button
          className={`pb-2 px-4 ${activeTab === "processIssueYarn" ? "border-b-2 border-blue-500 text-blue-500 font-semibold" : "text-gray-600"}`}
          onClick={() => setActiveTab("processIssueYarn")}
        >
          Processing Issue Yarn
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "processIssueFabric" && (
          <div>
            <ProcessingIssueDetails />
          </div>
        )}
        {activeTab === "processIssueYarn" && (
          <div>
            <ProcessingIssueDetails />
          </div>
        )}
      </div>
    </div>
  );
}

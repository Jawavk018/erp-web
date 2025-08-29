import { useState } from "react";
import { SizingPlanDetails } from "./sizing-plan-details";
import { SizingYarnIssueDetails } from "./sizing-yarn-issue-details";
import { useLocation } from "react-router-dom";


export default function SizingManagement() {

  const location = useLocation();
  const defaultTab = location.state?.tab || "sizingPlan";
  const [activeTab, setActiveTab] = useState(defaultTab);


  // const [activeTab, setActiveTab] = useState("sizingPlan");

  return (
    <div className="p-6 pt-16">
      <h1 className="text-2xl font-semibold mb-4">Sizing Management</h1>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-6">
        <button
          className={`pb-2 px-4 ${activeTab === "sizingPlan" ? "border-b-2 border-blue-500 text-blue-500 font-semibold" : "text-gray-600"}`}
          onClick={() => setActiveTab("sizingPlan")}
        >
          Sizing Plan
        </button>
        <button
          className={`pb-2 px-4 ${activeTab === "sizingYarnIssue" ? "border-b-2 border-blue-500 text-blue-500 font-semibold" : "text-gray-600"}`}
          onClick={() => setActiveTab("sizingYarnIssue")}
        >
          Sizing Yarn Issue
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "sizingPlan" && (
          <div>
            <SizingPlanDetails />
          </div>
        )}
        {activeTab === "sizingYarnIssue" && (
          <div>
            <SizingYarnIssueDetails />
          </div>
        )}
      </div>
    </div>
  );
}

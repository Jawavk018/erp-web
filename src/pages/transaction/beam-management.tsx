import { useState } from "react";
import { EmptyBeamIssueDetails } from "./empty-beam-issue-details";
import BeamInwardEntry from "./beam-inward-entry";
import { BeamInwardDetails } from "./beam-inward-details";
import { useLocation } from "react-router-dom";


export default function BeamManagement() {

  const location = useLocation();
  const defaultTab = location.state?.tab || "emptyBeam";
  const [activeTab, setActiveTab] = useState(defaultTab);
  // const [activeTab, setActiveTab] = useState("emptyBeam");

  return (
    <div className="p-6 pt-16">
      <h1 className="text-2xl font-semibold mb-4">Beam Management</h1>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-6">
        <button
          className={`pb-2 px-4 ${activeTab === "emptyBeam" ? "border-b-2 border-blue-500 text-blue-500 font-semibold" : "text-gray-600"}`}
          onClick={() => setActiveTab("emptyBeam")}
        >
          Empty Beam Issue
        </button>
        <button
          className={`pb-2 px-4 ${activeTab === "beamInward" ? "border-b-2 border-blue-500 text-blue-500 font-semibold" : "text-gray-600"}`}
          onClick={() => setActiveTab("beamInward")}
        >
          Beam Inward
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "emptyBeam" && (
          <div>
            <EmptyBeamIssueDetails />
          </div>
        )}
        {activeTab === "beamInward" && (
          <div>
            <BeamInwardDetails />
          </div>
        )}
      </div>
    </div>
  );
}

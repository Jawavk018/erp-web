import { useState } from "react";
import { CustomerMaster } from "./customer";
import { InternationalCustomerMaster } from "./International-customer";

export default function CustomerManagement() {
  const [activeTab, setActiveTab] = useState("customerMaster");

  return (
    <div className="p-6 pt-16">
      <h1 className="text-2xl font-semibold mb-4">Customer Management</h1>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-6">
        <button
          className={`pb-2 px-4 ${activeTab === "customerMaster" ? "border-b-2 border-blue-500 text-blue-500 font-semibold" : "text-gray-600"}`}
          onClick={() => setActiveTab("customerMaster")}
        >
          Customer Master Domestic
        </button>
        <button
          className={`pb-2 px-4 ${activeTab === "interCustomerMaster" ? "border-b-2 border-blue-500 text-blue-500 font-semibold" : "text-gray-600"}`}
          onClick={() => setActiveTab("interCustomerMaster")}
        >
          Customer Master International
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "customerMaster" && (
          <div>
            <CustomerMaster />
          </div>
        )}
        {activeTab === "interCustomerMaster" && (
          <div>
            <InternationalCustomerMaster />
          </div>
        )}
      </div>
    </div>
  );
}

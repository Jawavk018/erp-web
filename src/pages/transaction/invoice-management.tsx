import { useState } from "react";
import { InvoiceDetails } from "./invoice-details";
import { useLocation } from "react-router-dom";

export default function InvoiceManagement() {

  const location = useLocation();
  const defaultTab = location.state?.tab || "invoiceDomestic";
  const [activeTab, setActiveTab] = useState(defaultTab);
  // const [activeTab, setActiveTab] = useState("invoiceDomestic");

  return (
    <div className="p-6 pt-16">
      <h1 className="text-2xl font-semibold mb-4">Invoice Management</h1>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-6">
        <button
          className={`pb-2 px-4 ${activeTab === "invoiceDomestic" ? "border-b-2 border-blue-500 text-blue-500 font-semibold" : "text-gray-600"}`}
          onClick={() => setActiveTab("invoiceDomestic")}
        >
          Invoice Domestic
        </button>
        <button
          className={`pb-2 px-4 ${activeTab === "invoiceExport" ? "border-b-2 border-blue-500 text-blue-500 font-semibold" : "text-gray-600"}`}
          onClick={() => setActiveTab("invoiceExport")}
        >
          Invoice Export
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "invoiceDomestic" && (
          <div>
            <InvoiceDetails />
          </div>
        )}
        {activeTab === "invoiceExport" && (
          <div>
            <InvoiceDetails />
          </div>
        )}
      </div>
    </div>
  );
}

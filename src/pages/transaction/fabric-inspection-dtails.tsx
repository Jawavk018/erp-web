import { DataTable } from "@/components/data/DataTable";
import { Modal } from "@/components/ui/Modal";
import { getAllFabricInspection } from "@/state/fabricInspectionsSlice";
import { getAllPurchaseInwards } from "@/state/purchaseInwardSlice";
import { AppDispatch, RootState } from "@/state/store";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Eye, FileSearch, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FabricInspectionDetails() {
  const { fabricInspectionList } = useSelector((state: RootState) => state.fabricInspections);
  const { purchaseInwardList } = useSelector((state: RootState) => state.purchaseInward);
  const [inspectionList, setInspectionList] = useState<any[]>(fabricInspectionList);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentInspection, setCurrentInspection] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [inspectionStatus, setInspectionStatus] = useState<'pending' | 'completed'>('pending');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllFabricInspection({}));
    dispatch(getAllPurchaseInwards({}));
    console.log("Fetching fabric inspection data...", fabricInspectionList);
  }, [dispatch]);

  // Columns for pending tab (purchase inwards)
  const pendingColumns = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'rowIndex',
        Cell: ({ row }: { row: { index: number } }) => row.index + 1
      },
      {
        Header: "Inward Date",
        accessor: "inwardDate",
        Cell: ({ value }: { value: string }) => new Date(value).toLocaleDateString()
      },
      {
        Header: "Purchase Order ID",
        accessor: "purchaseOrderId"
      },
      {
        Header: "Total Quantity",
        accessor: "totalQuantity",
        Cell: ({ row }: { row: { original: any } }) =>
          row.original.items.reduce((sum: number, item: any) => sum + item.quantityReceived, 0)
      },
      {
        Header: "Total Lots",
        accessor: "totalLots",
        Cell: ({ row }: { row: { original: any } }) =>
          row.original.items.reduce((sum: number, item: any) => sum + (item.lotEntries?.length || 0), 0)
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }: { row: { original: any } }) => (
          <span
            className={`px-2 py-1 rounded-full text-xs ${row.original.activeFlag
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
              }`}
          >
            {row.original.activeFlag ? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }: { row: { original: any } }) => (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleView(row.original)}
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => handleInspect(row.original)}
              title="Inspect"
            >
              <ClipboardCheck className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const completedColumns = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'rowIndex',
        Cell: ({ row }: { row: { index: number } }) => row.index + 1
      },
      {
        Header: "Inspection Date",
        accessor: "inspectionDate"
      },
      {
        Header: "Loom No",
        accessor: "loomNo"
      },
      {
        Header: "Vendor ID",
        accessor: "vendorId"
      },
      {
        Header: "Fabric Quality",
        accessor: "fabricQuality"
      },
      {
        Header: "Doff Meters",
        accessor: "doffMeters"
      },
      {
        Header: "Doff Weight",
        accessor: "doffWeight"
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }: { row: { original: any } }) => (
          <span
            className={`px-2 py-1 rounded-full text-xs ${row.original.activeFlag
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
              }`}
          >
            {row.original.activeFlag ? "Active" : "Inactive"}
          </span>
        ),
      },
    ],
    []
  );

  // Filter inspections based on toggle status
  const filteredData = useMemo(() => {
    if (inspectionStatus === 'pending') {
      return purchaseInwardList.filter((inward: any) => {
        // Check if there's no inspection for this inward
        return !fabricInspectionList.some(
          (inspection: any) => inspection.purchaseInwardId === inward.id
        );
      });
    } else {
      return fabricInspectionList.filter((inspection: any) => {
        return inspection.status === 'inspected' || inspection.inspectionDetails;
      });
    }
  }, [fabricInspectionList, purchaseInwardList, inspectionStatus]);

  const handleView = (row: any) => {
    setCurrentInspection(row);
    setIsViewModalOpen(true);
  };

  const handleAdd = () => {
    setModalMode('add');
    setCurrentInspection(null);
    navigate("/transaction/fabric-inspection");
  };

  const handleInspect = (inward: any) => {
    navigate("/transaction/fabric-inspection", {
      state: {
        purchaseInward: inward,
        mode: 'add'
      }
    });
  };

  const handleEdit = (fabricInspDtl: any) => {
    setModalMode('edit');
    setCurrentInspection(fabricInspDtl);
    setIsModalOpen(true);
    navigate("/transaction/fabric-inspection", {
      state: {
        fabricInspDtl,
        mode: 'edit'
      }
    });
  };

  const handleDelete = (row: any) => {
    setCurrentInspection(row);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setInspectionList(inspectionList.filter((c: { id: any; }) => c.id !== currentInspection.id));
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="p-4 mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Fabric Inspection Management</h1>
        <div className="flex items-center gap-2 bg-blue-50 p-1 rounded-md">
          <button
            className={`px-4 py-1 text-sm rounded-md transition-colors ${inspectionStatus === 'pending'
              ? 'bg-blue-500 text-white shadow-sm'
              : 'text-blue-600 hover:bg-blue-100'
              }`}
            onClick={() => setInspectionStatus('pending')}
          >
            Pending
          </button>
          <button
            className={`px-4 py-1 text-sm rounded-md transition-colors ${inspectionStatus === 'completed'
              ? 'bg-blue-500 text-white shadow-sm'
              : 'text-blue-600 hover:bg-blue-100'
              }`}
            onClick={() => setInspectionStatus('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      <DataTable
        columns={inspectionStatus === 'pending' ? pendingColumns : completedColumns}
        data={filteredData}
        title={inspectionStatus === 'pending' ? "Pending Inspections" : "Completed Inspections"}
        onAdd={inspectionStatus === 'pending' ? handleAdd : undefined}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        showActions={inspectionStatus === 'pending' ? false : true}
        showAddActions={false}
        filterPlaceholder="Search..."
      />

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={inspectionStatus === 'pending' ? "Purchase Inward Details" : "Fabric Inspection Details"}
        className="w-full max-w-4xl"
      >
        {currentInspection && (
          <div className="space-y-4">
            {inspectionStatus === 'pending' ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">ID</p>
                    <p className="font-medium">{currentInspection.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Inward Date</p>
                    <p className="font-medium">
                      {new Date(currentInspection.inwardDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Purchase Order ID</p>
                    <p className="font-medium">{currentInspection.purchaseOrderId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${currentInspection.activeFlag
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                    >
                      {currentInspection.activeFlag ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Remarks</p>
                    <p className="font-medium">{currentInspection.remarks || "-"}</p>
                  </div>
                </div>

                {/* Items Details */}
                <div>
                  <h2 className="text-lg font-semibold mt-4 mb-2">Items Details</h2>
                  {currentInspection.items?.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border p-2">Item ID</th>
                            <th className="border p-2">Quantity Received</th>
                            <th className="border p-2">Price</th>
                            <th className="border p-2">Lots</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentInspection.items.map((item: any) => (
                            <tr key={item.id}>
                              <td className="border p-2 text-center">{item.id}</td>
                              <td className="border p-2 text-center">{item.quantityReceived}</td>
                              <td className="border p-2 text-center">{item.price}</td>
                              <td className="border p-2 text-center">{item.lotEntries?.length || 0}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500">No items details available.</p>
                  )}
                </div>

                {/* Lot Entries */}
                <div>
                  <h2 className="text-lg font-semibold mt-4 mb-2">Lot Entries</h2>
                  {currentInspection.items?.some((item: any) => item.lotEntries?.length > 0) ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border p-2">Lot Number</th>
                            <th className="border p-2">Quantity</th>
                            <th className="border p-2">Rejected Quantity</th>
                            <th className="border p-2">Cost</th>
                            <th className="border p-2">Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentInspection.items.flatMap((item: any) =>
                            item.lotEntries?.map((lot: any) => (
                              <tr key={lot.id}>
                                <td className="border p-2 text-center">{lot.lotNumber}</td>
                                <td className="border p-2 text-center">{lot.quantity}</td>
                                <td className="border p-2 text-center">{lot.rejectedQuantity}</td>
                                <td className="border p-2 text-center">{lot.cost}</td>
                                <td className="border p-2 text-center">{lot.remarks || "-"}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500">No lot entries available.</p>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">ID</p>
                    <p className="font-medium">{currentInspection.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Inspection Date</p>
                    <p className="font-medium">{currentInspection.inspectionDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Loom No</p>
                    <p className="font-medium">{currentInspection.loomNo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Vendor ID</p>
                    <p className="font-medium">{currentInspection.vendorId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fabric Quality</p>
                    <p className="font-medium">{currentInspection.fabricQuality}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Doff Meters</p>
                    <p className="font-medium">{currentInspection.doffMeters}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Doff Weight</p>
                    <p className="font-medium">{currentInspection.doffWeight}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${currentInspection.activeFlag
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                    >
                      {currentInspection.activeFlag ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* Inspection Details */}
                <div>
                  <h2 className="text-lg font-semibold mt-4 mb-2">Inspection Details</h2>
                  {currentInspection.inspectionDetails?.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border p-2">Roll No</th>
                            <th className="border p-2">Doff Meters</th>
                            <th className="border p-2">Inspected Meters</th>
                            <th className="border p-2">Weight</th>
                            <th className="border p-2">Total Defect Points</th>
                            <th className="border p-2">Defect Counts</th>
                            <th className="border p-2">Grade</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentInspection.inspectionDetails.map((detail: any) => (
                            <tr key={detail.id}>
                              <td className="border p-2 text-center">{detail.rollNo || "-"}</td>
                              <td className="border p-2 text-center">{detail.doffMeters || "-"}</td>
                              <td className="border p-2 text-center">{detail.inspectedMeters || "-"}</td>
                              <td className="border p-2 text-center">{detail.weight || "-"}</td>
                              <td className="border p-2 text-center">{detail.totalDefectPoints || "-"}</td>
                              <td className="border p-2 text-center">{detail.defectCounts || "-"}</td>
                              <td className="border p-2 text-center">{detail.grade || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500">No inspection details available.</p>
                  )}
                </div>

                {/* Inspection Entries */}
                <div>
                  <h2 className="text-lg font-semibold mt-4 mb-2">Inspection Entries</h2>
                  {currentInspection.inspectionEntries?.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border p-2">Defected Meters</th>
                            <th className="border p-2">From Meters</th>
                            <th className="border p-2">To Meters</th>
                            <th className="border p-2">Defect Type ID</th>
                            <th className="border p-2">Defect Points</th>
                            <th className="border p-2">Inspection Id</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentInspection.inspectionEntries.map((entry: any) => (
                            <tr key={entry.id}>
                              <td className="border p-2 text-center">{entry.defectedMeters || "-"}</td>
                              <td className="border p-2 text-center">{entry.fromMeters || "-"}</td>
                              <td className="border p-2 text-center">{entry.toMeters || "-"}</td>
                              <td className="border p-2 text-center">{entry.defectTypeId || "-"}</td>
                              <td className="border p-2 text-center">{entry.defectPoints || "-"}</td>
                              <td className="border p-2 text-center">{entry.inspectionId || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500">No inspection entries available.</p>
                  )}
                </div>
              </>
            )}
            <div className="flex justify-end pt-4">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
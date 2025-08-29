import { DataTable } from "@/components/data/DataTable";
import { Modal } from "@/components/ui/Modal";
import { deleteJobworkFabricReceive, getAllJobworkFabricReceive } from "@/state/jobFabricReceiveSlice";
import { AppDispatch, RootState } from "@/state/store";
import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export function JobworkFabricReceiveDetails() {
  const { jobworkFabricReceiveList } = useSelector((state: RootState) => state.JobworkFabricReceive);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllJobworkFabricReceive({}));
  }, [dispatch]);

  const columns = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        Cell: ({ row }: { row: { index: number } }) => row.index + 1
      },
      {
        Header: 'Contract ID',
        accessor: 'weavingContractId',
      },
      {
        Header: 'Vendor ID',
        accessor: 'vendorId',
      },
      {
        Header: 'Receive Date',
        accessor: 'jobFabricReceiveDate',
        Cell: ({ value }: { value: string }) => new Date(value).toLocaleDateString(),
      },
      {
        Header: 'Items',
        accessor: 'items',
        Cell: ({ value }: { value: any[] }) => value?.length || 0,
      },
      {
        Header: 'Pieces',
        accessor: (row: any) => row.items.reduce((sum: any, item: any) => sum + (item.pieceEntries?.length || 0), 0),
      },
      {
        Header: "Status",
        accessor: "activeFlag",
        Cell: ({ value }: { value: boolean }) => (
          <span
            className={`px-2 py-1 rounded-full text-xs ${value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            {value ? "Active" : "Inactive"}
          </span>
        ),
      },
    ],
    []
  );

  const handleAdd = () => {
    navigate("/transaction/jobwork-fabric-receive");
  };

  const handleEdit = (record: any) => {
    navigate("/transaction/jobwork-fabric-receive", { state: { record } });
  };

  const handleDelete = (record: any) => {
    setCurrentRecord(record);
    setIsDeleteModalOpen(true);
  };

  const handleView = (record: any) => {
    setCurrentRecord(record);
    setIsViewModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!currentRecord) return;
    try {
      await dispatch(deleteJobworkFabricReceive(currentRecord.id)).unwrap();
      await dispatch(getAllJobworkFabricReceive({}));
    } catch (error) {
      console.error("Error deleting JobworkFabricReceive:", error);
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Jobwork Fabric Receive Management</h1>

      <DataTable
        columns={columns}
        data={jobworkFabricReceiveList?.data || []}
        title="Jobwork Fabric Receive Details"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        showActions={true}
        filterPlaceholder="Search receives..."
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete receive record (ID: {currentRecord?.id})?</p>
          <p className="text-red-600 text-sm">This action cannot be undone.</p>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button onClick={confirmDelete} className="btn btn-danger">
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* View Modal - Enhanced to show all details */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={`Fabric Receive Details`}
        className="max-w-4xl"
      >
        {currentRecord && (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">ID</p>
                <p className="font-medium">{currentRecord.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contract ID</p>
                <p className="font-medium">{currentRecord.weavingContractId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Vendor ID</p>
                <p className="font-medium">{currentRecord.vendorId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Receive Date</p>
                <p className="font-medium">{new Date(currentRecord.jobFabricReceiveDate).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Remarks</p>
                <p className="font-medium">{currentRecord.remarks || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p>
                  <span className={`px-2 py-1 rounded-full text-xs ${currentRecord.activeFlag ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {currentRecord.activeFlag ? 'Active' : 'Inactive'}
                  </span>
                </p>
              </div>
            </div>

            {/* Items Section */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Received Items</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty Received</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Contract Item ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Pieces</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentRecord.items?.map((item: any) => (
                      <tr key={item.id}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">{item.id}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">{item.quantityReceived}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">{item.price}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">{item.weavingContractItemId}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">{item.pieceEntries?.length || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Piece Entries Section */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Piece Details</h3>
              {currentRecord.items?.some((item: any) => item.pieceEntries?.length > 0) ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Piece No</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Weight</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentRecord.items?.flatMap((item: any) =>
                        item.pieceEntries?.map((piece: any) => (
                          <tr key={piece.id}>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{piece.pieceNumber}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{piece.quantity}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{piece.weight}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{piece.cost}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{piece.remarks || 'N/A'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No piece details available</p>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="btn btn-secondary"
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
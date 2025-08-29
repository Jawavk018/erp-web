import { DataTable } from "@/components/data/DataTable";
import { Modal } from "@/components/ui/Modal";
import { deletePurchaseInward, getAllPurchaseInwards } from "@/state/purchaseInwardSlice";
import { AppDispatch, RootState } from "@/state/store";
import { get } from "http";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface LotEntry {
  id: number;
  lotNumber: string | null;
  quantity: number;
  rejectedQuantity: number;
  cost: number;
  remarks: string | null;
  activeFlag: boolean;
}

interface InwardItem {
  id: number;
  quantityReceived: number;
  price: number;
  activeFlag: boolean;
  purchaseOrderItemId: number;
  lotEntries: LotEntry[];
}

interface InwardDetail {
  id: number;
  inwardDate: string;
  remarks: string | null;
  activeFlag: boolean;
  items: InwardItem[];
  purchaseOrderId: number;
}

export function PurchaseInwardDetails() {

  const { purchaseInwardList } = useSelector((state: RootState) => state.purchaseInward);
  const { purchaseOrderList } = useSelector((state: RootState) => state.purchaseOrder);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentInward, setCurrentInward] = useState<InwardDetail | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllPurchaseInwards({}));
  }, [dispatch]);

  const columns = useMemo(
    () => [
      {
        Header: '#',
        Cell: ({ row }: { row: { index: number } }) => row.index + 1,
        width: 50
      },
      {
        Header: 'Inward Date',
        accessor: 'inwardDate',
        Cell: ({ value }: { value: string }) => new Date(value).toLocaleDateString()
      },
      {
        Header: 'PO No',
        accessor: 'purchaseOrderId',
        Cell: ({ value }: { value: number }) => {
          const po = purchaseOrderList.find((po: any) => po.id === value);
          return po ? po.poNo : value;
        }
      },
      {
        Header: 'Remarks',
        accessor: 'remarks',
        Cell: ({ value }: { value: string | null }) => value || 'N/A'
      },
      {
        Header: 'Items Count',
        accessor: 'items',
        Cell: ({ value }: { value: InwardItem[] }) => value.length
      },
      {
        Header: 'Status',
        accessor: 'activeFlag',
        Cell: ({ value }: { value: boolean }) => (
          <span className={`px-2 py-1 rounded-full text-xs ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {value ? "Active" : "Inactive"}
          </span>
        ),
      }
    ],
    []
  );

  const handleAdd = () => {
    navigate("/transaction/purchase-inward");
  };

  const handleEdit = (inward: InwardDetail) => {
    navigate("/transaction/purchase-inward", { state: { purchaseInwardDtl: inward } });
  };

  const handleView = (inward: InwardDetail) => {
    setCurrentInward(inward);
    setIsViewModalOpen(true);
  };

  const handleDelete = (inward: InwardDetail) => {
    setCurrentInward(inward);
    setIsDeleteModalOpen(true);

    // Implement delete functionality here
  };

  const confirmDelete = async () => {
    if (!currentInward) return;

    try {
      await dispatch(deletePurchaseInward(currentInward.id)).unwrap();
      await dispatch(getAllPurchaseInwards({}));
    } catch (error) {
      console.error("Error deleting Fabric:", error);
    }

    setIsDeleteModalOpen(false);
  };


  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Purchase Inward Details</h1>

      <DataTable
        columns={columns}
        data={purchaseInwardList}
        title="Purchase Inward Details"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        showActions={true}
        filterPlaceholder="Search purchase inwards..."
      />

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={`Inward Details - #${currentInward?.id || ''}`}
        className="max-w-6xl"
      >
        {currentInward && (
          <div className="space-y-6">
            {/* Header Information */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Inward ID</p>
                <p className="font-medium">{currentInward.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Inward Date</p>
                <p className="font-medium">
                  {new Date(currentInward.inwardDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">PO ID</p>
                <p className="font-medium">{currentInward.purchaseOrderId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Remarks</p>
                <p className="font-medium">{currentInward.remarks || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`px-2 py-1 rounded-full text-xs ${currentInward.activeFlag ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {currentInward.activeFlag ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            {/* Items Section */}
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-3">Inward Items</h3>
              {currentInward.items?.length > 0 ? (
                <div className="space-y-4">
                  {currentInward.items.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="grid grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-500">Item ID</p>
                          <p className="font-medium">{item.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Quantity Received</p>
                          <p className="font-medium">{item.quantityReceived}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Price</p>
                          <p className="font-medium">{item.price}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">PO Item ID</p>
                          <p className="font-medium">{item.purchaseOrderItemId}</p>
                        </div>
                      </div>

                      {/* Lot Entries */}
                      <div>
                        <h4 className="font-medium mb-2">Lot Entries:</h4>
                        {item.lotEntries?.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Lot #</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rejected</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {item.lotEntries.map((lot) => (
                                  <tr key={lot.id}>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                                      {lot.lotNumber || 'N/A'}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm">{lot.quantity}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm">{lot.rejectedQuantity}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm">{lot.cost}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                                      {lot.remarks || 'N/A'}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-gray-500">No lot entries for this item</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No items found for this inward</p>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete Fabric?</p>

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

    </div>
  );
}
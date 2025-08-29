import { DataTable } from "@/components/data/DataTable";
import { Modal } from "@/components/ui/Modal";
import { deletePurchaseOrder, getAllPurchaseOrders } from "@/state/purchaseOrderSlice";
import { AppDispatch, RootState } from "@/state/store";
import { getAllVendors } from "@/state/vendorSlice";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface PurchaseOrderItem {
  id: number;
  productCategoryId: number;
  quantity: number;
  unit: string;
  price: number;
  netAmount: number;
  deliveryDate: string;
  remarks: string;
  activeFlag: boolean | null;
}

interface PurchaseOrder {
  id: number;
  poNo: string;
  poTypeId: number;
  poDate: string;
  vendorId: number;
  taxId: number;
  activeFlag: boolean;
  purchaseOrderItemsDtl: PurchaseOrderItem[];
}

export function PurchaseOrderDetails() {

  const { purchaseOrderList } = useSelector((state: RootState) => state.purchaseOrder);
  const { vendorList } = useSelector((state: RootState) => state.vendor);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPurchaseOrder, setCurrentPurchaseOrder] = useState<PurchaseOrder | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllPurchaseOrders({}));
    dispatch(getAllVendors({}));
  }, [dispatch]);

  const vendorMap = vendorList?.reduce((acc: Record<number, string>, vendor: { id: number; vendorName: string }) => {
    acc[vendor.id] = vendor.vendorName;
    return acc;
  }, {});

  const columns = useMemo(
    () => [
      {
        Header: '#',
        Cell: ({ row }: { row: { index: number } }) => row.index + 1,
        width: 50
      },
      { Header: 'PO No', accessor: 'poNo' },
      { Header: 'PO Date', accessor: 'poDate' },
      {
        Header: 'Vendor',
        accessor: 'vendorId',
        Cell: ({ value }: { value: number }) => (
          <span>{vendorMap[value] || `Vendor #${value}`}</span>
        )
      },
      { Header: 'Items Count', accessor: 'purchaseOrderItemsDtl', Cell: ({ value }: { value: PurchaseOrderItem[] }) => value?.length || 0 },
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
    navigate("/transaction/purchase-order");
  };

  const handleEdit = (order: PurchaseOrder) => {
    console.log("Edit clicked:", order);
    navigate("/transaction/purchase-order", { state: { order } });
  };

  const handleDelete = (order: PurchaseOrder) => {
    setCurrentPurchaseOrder(order);
    setIsDeleteModalOpen(true);
  };

  const handleView = (order: PurchaseOrder) => {
    setCurrentPurchaseOrder(order);
    setIsViewModalOpen(true);
  };

  // const confirmDelete = () => {
  //   // TODO: Implement actual delete functionality
  //   setIsDeleteModalOpen(false);
  // };
  const confirmDelete = async () => {
    if (!currentPurchaseOrder) return;
    try {
      await dispatch(deletePurchaseOrder(currentPurchaseOrder.id)).unwrap();
      await dispatch(getAllPurchaseOrders({}));
    } catch (error) {
      console.error("Error deleting Purchase Order:", error);
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Purchase Order Management</h1>

      <DataTable
        columns={columns}
        data={purchaseOrderList}
        title="Purchase Order Details"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        showActions={true}
        filterPlaceholder="Search purchase orders..."
      />

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={`Purchase Order: ${currentPurchaseOrder?.poNo || ''}`}
        className="max-w-4xl"
      >
        {currentPurchaseOrder && (
          <div className="space-y-6">
            {/* Order Header Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">PO No</p>
                <p className="font-medium">{currentPurchaseOrder.poNo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">PO Date</p>
                <p className="font-medium">{currentPurchaseOrder.poDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Vendor ID</p>
                <p className="font-medium">{currentPurchaseOrder.vendorId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">PO Type ID</p>
                <p className="font-medium">{currentPurchaseOrder.poTypeId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tax ID</p>
                <p className="font-medium">{currentPurchaseOrder.taxId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`px-2 py-1 rounded-full text-xs ${currentPurchaseOrder.activeFlag ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                  {currentPurchaseOrder.activeFlag ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            {/* Items Table */}
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-3">Order Items</h3>
              {currentPurchaseOrder.purchaseOrderItemsDtl?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product Category</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Net Amount</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Delivery Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentPurchaseOrder.purchaseOrderItemsDtl.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">{item.productCategoryId}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">{item.quantity}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">{item.unit}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">{item.price}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">{item.netAmount}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">
                            {new Date(item.deliveryDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">{item.remarks || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No items found for this purchase order</p>
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete purchase order {currentPurchaseOrder?.poNo}?</p>
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
    </div>
  );
}
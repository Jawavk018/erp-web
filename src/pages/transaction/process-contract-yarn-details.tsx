import { DataTable } from "@/components/data/DataTable";
import { Modal } from "@/components/ui/Modal";
import { deleteDyeingWorkOrder, getAllDyeingWorkOrders } from "@/state/processContractSlice";
import { getAllPoTypes, getAllPurchaseOrders } from "@/state/purchaseOrderSlice";
import { AppDispatch, RootState } from "@/state/store";
import { getAllVendors } from "@/state/vendorSlice";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface DyeingWorkOrderItem {
  id: number;
  dyeingWorkOrderId: number | null;
  finishedFabricCodeId: number;
  finishedFabricName: string;
  greigeFabricCodeId: number;
  greigeFabricName: string;
  quantity: number;
  costPerPound: number;
  totalAmount: number;
  colorId: number;
  pantone: string;
  finishedWeight: number;
  greigeWidth: number;
  reqFinishedWidth: number;
  uomId: number;
  remarks: string;
  activeFlag: boolean;
}

interface DyeingWorkOrder {
  id: number;
  dyeingWorkOrderNo: string;
  processContactDate: string;
  deliveryDate: string;
  vendorId: number;
  salesOrderNo: number;
  consigneeId: number;
  lapDipStatusId: number;
  firstYardageId: number;
  totalAmount: number;
  remarks: string;
  activeFlag: boolean;
  items: DyeingWorkOrderItem[];
}

export function ProcessContractYarnDetails() {

  const { processContractList } = useSelector((state: RootState) => state.dyeingWorkOrde);
  const { vendorList } = useSelector((state: RootState) => state.vendor);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<DyeingWorkOrder | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // For demonstration, you should replace this with your API data
  const [dyeingWorkOrders, setDyeingWorkOrders] = useState<DyeingWorkOrder[]>([]);

  useEffect(() => {
    dispatch(getAllDyeingWorkOrders({}));
    dispatch(getAllVendors({}));
    console.log(processContractList)
    // Simulate API data
    // setDyeingWorkOrders((processContractList as DyeingWorkOrder[]) || []);
  }, [dispatch]);

  const columns = useMemo(
    () => [
      {
        Header: '#',
        Cell: ({ row }: { row: { index: number } }) => row.index + 1,
        width: 50
      },
      { Header: 'Work Order No', accessor: 'dyeingWorkOrderNo' },
      { Header: 'Process Contact Date', accessor: 'processContactDate' },
      { Header: 'Delivery Date', accessor: 'deliveryDate' },
      { Header: 'Vendor ID', accessor: 'vendorId' },
      { Header: 'Total Amount', accessor: 'totalAmount' },
      {
        Header: 'Status',
        accessor: 'activeFlag',
        Cell: ({ value }: { value: boolean }) => (
          <span className={`px-2 py-1 rounded-full text-xs ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
            {value ? "Active" : "Inactive"}
          </span>
        ),
      }
    ],
    []
  );

  const handleAdd = () => {
    setModalMode('add');
    setCurrentOrder(null);
    reset();
    navigate("/transaction/process-contract-yarn-entry");
  };

  const handleEdit = (order: DyeingWorkOrder) => {
    setModalMode('edit');
    setCurrentOrder(order);
    reset(order);
    setIsModalOpen(true);
    navigate("/transaction/process-contract-yarn-entry", { state: { order } });
  };

  const handleDelete = (order: DyeingWorkOrder) => {
    setCurrentOrder(order);
    setIsDeleteModalOpen(true);
  };

  const handleView = (order: DyeingWorkOrder) => {
    setCurrentOrder(order);
    setIsViewModalOpen(true);
  };

  // const confirmDelete = () => {
  //   setDyeingWorkOrders(dyeingWorkOrders.filter((o) => o.id !== currentOrder?.id));
  //   setIsDeleteModalOpen(false);
  // };
  const confirmDelete = async () => {
    if (!currentOrder) return;

    try {
      await dispatch(deleteDyeingWorkOrder(currentOrder.id)).unwrap();
      await dispatch(getAllDyeingWorkOrders({}));
    } catch (error) {
      console.error("Error deleting DyeingWorkOrders:", error);
    }

    setIsDeleteModalOpen(false);
  };

  return (
    <div>
      {/* <h1 className="text-2xl font-bold mb-6">Dyeing Work Order Management</h1> */}
      <DataTable
        columns={columns}
        data={processContractList}
        title="Dyeing Work Order Details (YARN)"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        showActions={true}
        filterPlaceholder="Search Dyeing Work Order..."
      />

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Dyeing Work Order Details (YARN)"
        className="max-w-4xl"
      >
        {currentOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-secondary-500">Work Order No</p>
                <p className="font-medium">{currentOrder.dyeingWorkOrderNo}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Process Contact Date</p>
                <p className="font-medium">{currentOrder.processContactDate}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Delivery Date</p>
                <p className="font-medium">{currentOrder.deliveryDate}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Vendor ID</p>
                <p className="font-medium">{currentOrder.vendorId}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Sales Order No</p>
                <p className="font-medium">{currentOrder.salesOrderNo}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Consignee Id</p>
                <p className="font-medium">{currentOrder.consigneeId}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Lap Dip Status Id</p>
                <p className="font-medium">{currentOrder.lapDipStatusId}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">First Yardage Id</p>
                <p className="font-medium">{currentOrder.firstYardageId}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Total Amount</p>
                <p className="font-medium">{currentOrder.totalAmount}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Remarks</p>
                <p className="font-medium">{currentOrder.remarks}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Status</p>
                <span className={`px-2 py-1 rounded-full text-xs ${currentOrder.activeFlag ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                  {currentOrder.activeFlag ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            {/* Show Items Table */}
            <div>
              <h2 className="font-semibold text-lg mt-2 mb-1">Work Order Items</h2>
              <table className="w-full border-collapse border border-gray-300 text-center">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">#</th>
                    <th className="border p-2">Finished Fabric</th>
                    <th className="border p-2">Greige Fabric</th>
                    <th className="border p-2">Quantity</th>
                    <th className="border p-2">Cost Per Pound</th>
                    <th className="border p-2">Total Amount</th>
                    <th className="border p-2">Pantone</th>
                    <th className="border p-2">Finished Weight</th>
                    <th className="border p-2">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {(currentOrder.items || []).map((item, idx) => (
                    <tr key={item.id}>
                      <td className="border p-2">{idx + 1}</td>
                      <td className="border p-2">{item.finishedFabricName}</td>
                      <td className="border p-2">{item.greigeFabricName}</td>
                      <td className="border p-2">{item.quantity}</td>
                      <td className="border p-2">{item.costPerPound}</td>
                      <td className="border p-2">{item.totalAmount}</td>
                      <td className="border p-2">{item.pantone}</td>
                      <td className="border p-2">{item.finishedWeight}</td>
                      <td className="border p-2">{item.remarks}</td>
                    </tr>
                  ))}
                  {(!currentOrder.items || currentOrder.items.length === 0) && (
                    <tr>
                      <td colSpan={9} className="border p-2 text-center text-gray-500">
                        No items found for this work order.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete this DyeingWork Orders?</p>
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
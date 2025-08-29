
import { DataTable } from "@/components/data/DataTable";
import { Modal } from "@/components/ui/Modal";
import { getAllPoTypes, getAllPurchaseOrders } from "@/state/purchaseOrderSlice";
import { AppDispatch, RootState } from "@/state/store";
import { getAllVendors } from "@/state/vendorSlice";
import { deleteContract, getAllWeavingContract } from "@/state/weavingContractSlice";
import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

interface wcFormData {
  id?: number;
  name: string;
  status: string;
}

export function WeavingContractDetails() {

  const { weavingContractList } = useSelector((state: RootState) => state.weavingContracts)
  const { vendorList } = useSelector((state: RootState) => state.vendor)
  const { salesOrderList } = useSelector((state: RootState) => state.salesOrder)
  const { purchaseOrderList } = useSelector((state: RootState) => state.purchaseOrder);
  const [weavingContract, setWeavingContract]: any = useState(weavingContractList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentWeavingContract, setCurrentWeavingContract] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [isEditing, setIsEditing] = React.useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<wcFormData>();

  useEffect(() => {
    dispatch(getAllWeavingContract({}));
    dispatch(getAllVendors({}));
    console.log(weavingContractList)
  }, [dispatch]);

  const vendorMap = vendorList?.reduce((acc: Record<number, string>, vendor: { id: number; vendorName: string }) => {
    acc[vendor.id] = vendor.vendorName;
    return acc;
  }, {});

  const columns = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        Cell: ({ row }: { row: { index: number } }) => row.index + 1
      },
      {
        Header: 'Weaving Contract No',
        accessor: 'weavingContractNo',
      },
      {
        Header: 'Vendor',
        accessor: 'vendorId',
        Cell: ({ value }: { value: number }) => (
          <span>{vendorMap[value] || `Vendor #${value}`}</span>
        )
      },
      {
        Header: "Status",
        accessor: "activeFlag",
        Cell: ({ value }: { value: boolean }) => (
          <span
            className={`px-2 py-1 rounded-full text-xs ${value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
          >
            {value ? "Active" : "Inactive"}
          </span>
        ),
      },
    ],
    []
  );

  const handleAdd = () => {
    setModalMode('add');
    setCurrentWeavingContract(null);
    reset({
      name: '',
      status: 'Active',
    });
    // setIsModalOpen(true);
    navigate("/transaction/weaving-contract-entry");
  };

  // const handleEdit = (wc: any) => {
  //   setModalMode('edit');
  //   setCurrentWeavingContract(wc);
  //   reset({
  //     id: wc.id,
  //     name: wc.name,
  //     status: wc.status,
  //   });
  //   setIsModalOpen(true);
  // };

  const handleEdit = (weavingContractDtl: any) => {
    setModalMode('edit');
    setCurrentWeavingContract(weavingContractDtl);
    setIsModalOpen(true);
    navigate("/transaction/weaving-contract-entry", { state: { weavingContractDtl } });

  };

  const handleDelete = (wc: any) => {
    setCurrentWeavingContract(wc);
    setIsDeleteModalOpen(true);
  };

  const handleView = (wc: any) => {
    setCurrentWeavingContract(wc);
    setIsViewModalOpen(true);
  };

  // const confirmDelete = () => {
  //   setWeavingContract(weavingContract.filter((c: { id: any; }) => c.id !== currentWeavingContract.id));
  //   setIsDeleteModalOpen(false);
  // };

  const confirmDelete = async () => {
    if (!currentWeavingContract) return;
    try {
      await dispatch(deleteContract(currentWeavingContract.id)).unwrap();
      await dispatch(getAllWeavingContract({}));
    } catch (error) {
      console.error("Error deleting WeavingContract:", error);
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">wc Management</h1>

      <DataTable
        columns={columns}
        data={weavingContractList}
        title="Weaving Contract Details"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        showActions={true}
        filterPlaceholder="Search Weaving Contract..."
      />
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete WeavingContract"?</p>
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

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Weaving Contract Details"
        className="w-full max-w-4xl"
      >

        {currentWeavingContract && (
          <div className="space-y-6">
            {/* Basic Contract Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-secondary-500">Contract No</p>
                <p className="font-medium">{currentWeavingContract.weavingContractNo}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Sales Order No</p>
                <p className="font-medium">{salesOrderList.find((v: any) => v.id === currentWeavingContract.salesOrderId)?.salesOrderNo || currentWeavingContract.salesOrderId}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Vendor ID</p>
                <p className="font-medium">{vendorList.find((v: any) => v.id === currentWeavingContract.vendorId)?.vendorName || currentWeavingContract.vendorId}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Status</p>
                <p>
                  <span className={`px-2 py-1 rounded-full text-xs ${currentWeavingContract.activeFlag
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {currentWeavingContract.activeFlag ? 'Active' : 'Inactive'}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Remarks</p>
                <p className="font-medium">{currentWeavingContract.remarks}</p>
              </div>
            </div>

            {/* Items Section */}
            <div className="mt-6">
              <h3 className="font-medium mb-2">Items</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border">Fabric Code</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border">Quantity</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border">Pick Cost</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border">Start Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border">End Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentWeavingContract.items?.map((item: any) => (
                      <tr key={item.id} className="border">
                        <td className="px-4 py-2 border">{item.fabricCodeId}</td>
                        <td className="px-4 py-2 border">{item.quantity}</td>
                        <td className="px-4 py-2 border">{item.pickCost}</td>
                        <td className="px-4 py-2 border">{item.plannedStartDate}</td>
                        <td className="px-4 py-2 border">{item.plannedEndDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Yarn Requirements Section */}
            <div className="mt-6">
              <h3 className="font-medium mb-2">Yarn Requirements</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border">Yarn Type</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border">Yarn Count</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border">Grams/Meter</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border">Required Qty</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border">Available Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentWeavingContract.yarnRequirements?.map((yarn: any) => (
                      <tr key={yarn.id} className="border">
                        <td className="px-4 py-2 border">{yarn.yarnType}</td>
                        <td className="px-4 py-2 border">{yarn.yarnCount}</td>
                        <td className="px-4 py-2 border">{yarn.gramsPerMeter}</td>
                        <td className="px-4 py-2 border">{yarn.totalRequiredQty}</td>
                        <td className="px-4 py-2 border">{yarn.totalAvailableQty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
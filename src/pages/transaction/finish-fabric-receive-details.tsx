import { DataTable } from "@/components/data/DataTable";
import { Modal } from "@/components/ui/Modal";
import { deleteFinishFabricReceive, getAllFinishFabricReceive } from "@/state/finishFabricReceiveSlice";
import { AppDispatch, RootState } from "@/state/store";
import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export function FinishFabricReceiveDetails() {

    const { finishFabricReceiveList } = useSelector((state: RootState) => state.finishFabricReceive);
    const { vendorList } = useSelector((state: RootState) => state.vendor);
    const { salesOrderList } = useSelector((state: RootState) => state.salesOrder);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [currentFinishFabricReceive, setCurrentFinishFabricReceive] = useState<any>(null);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getAllFinishFabricReceive({}));
    }, [dispatch]);

    const columns = useMemo(
        () => [
            {
                Header: '#',
                accessor: 'id',
                Cell: ({ row }: { row: { index: number } }) => row.index + 1
            },
            {
                Header: 'Receive Date',
                accessor: 'fabricReceiveDate',
                Cell: ({ value }: { value: string }) => new Date(value).toLocaleDateString()
            },
            {
                Header: 'Vendor',
                accessor: 'vendorId',
                Cell: ({ value }: { value: number }) =>
                    vendorList.find((v: any) => v.id === value)?.vendorName || value
            },
            {
                Header: 'Sales Order',
                accessor: 'salesOrderId',
                Cell: ({ value }: { value: number }) =>
                    salesOrderList.find((so: any) => so.id === value)?.salesOrderNo || value
            },
            {
                Header: 'Received Qty',
                accessor: 'receivedQuantity',
            },
            {
                Header: 'Total Amount',
                accessor: 'totalAmount',
                Cell: ({ value }: { value: number }) => `$${value.toFixed(2)}`
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
        [vendorList, salesOrderList]
    );

    const handleAdd = () => {
        navigate("/transaction/processing-receive");
    };

    const handleEdit = (finishFabricReceive: any) => {
        navigate("/transaction/processing-receive", { state: { finishFabricReceive } });
    };

    const handleDelete = (finishFabricReceive: any) => {
        setCurrentFinishFabricReceive(finishFabricReceive);
        setIsDeleteModalOpen(true);
    };

    const handleView = (finishFabricReceive: any) => {
        setCurrentFinishFabricReceive(finishFabricReceive);
        setIsViewModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!currentFinishFabricReceive) return;
        try {
            await dispatch(deleteFinishFabricReceive(currentFinishFabricReceive.id)).unwrap();
            await dispatch(getAllFinishFabricReceive({}));
        } catch (error) {
            console.error("Error deleting Finish Fabric Receive:", error);
        }
        setIsDeleteModalOpen(false);
    };

    return (
        <div>
            {/* <h1 className="text-2xl font-bold mb-6">Finish Fabric Receive Details</h1> */}

            <DataTable
                columns={columns}
                data={finishFabricReceiveList}
                title="Finish Fabric Receives"
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                showActions={true}
                filterPlaceholder="Search Finish Fabric Receives..."
            />

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirm Delete"
            >
                <div className="space-y-4">
                    <p>Are you sure you want to delete this Finish Fabric Receive?</p>
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

            {/* View Details Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="Finish Fabric Receive Details"
                className="w-full max-w-4xl"
            >
                {currentFinishFabricReceive && (
                    <div className="space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-secondary-500">Receive Date</p>
                                <p className="font-medium">
                                    {new Date(currentFinishFabricReceive.fabricReceiveDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-secondary-500">Vendor</p>
                                <p className="font-medium">
                                    {vendorList.find((v: any) => v.id === currentFinishFabricReceive.vendorId)?.vendorName ||
                                        currentFinishFabricReceive.vendorId}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-secondary-500">Sales Order</p>
                                <p className="font-medium">
                                    {salesOrderList.find((so: any) => so.id === currentFinishFabricReceive.salesOrderId)?.salesOrderNo ||
                                        currentFinishFabricReceive.salesOrderId}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-secondary-500">Dyeing Work Order</p>
                                <p className="font-medium">{currentFinishFabricReceive.dyeingWorkOrderId}</p>
                            </div>
                            <div>
                                <p className="text-sm text-secondary-500">Order Quantity</p>
                                <p className="font-medium">{currentFinishFabricReceive.orderQuantity}</p>
                            </div>
                            <div>
                                <p className="text-sm text-secondary-500">Received Quantity</p>
                                <p className="font-medium">{currentFinishFabricReceive.receivedQuantity}</p>
                            </div>
                            <div>
                                <p className="text-sm text-secondary-500">Balance Quantity</p>
                                <p className="font-medium">{currentFinishFabricReceive.balanceQuantity}</p>
                            </div>
                            <div>
                                <p className="text-sm text-secondary-500">Cost Per Pound</p>
                                <p className="font-medium">${currentFinishFabricReceive.costPerPound?.toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-secondary-500">Total Amount</p>
                                <p className="font-medium">${currentFinishFabricReceive.totalAmount?.toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-secondary-500">Color</p>
                                <p className="font-medium">{currentFinishFabricReceive.colorId}</p>
                            </div>
                            <div>
                                <p className="text-sm text-secondary-500">Pantone</p>
                                <p className="font-medium">{currentFinishFabricReceive.pantone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-secondary-500">Status</p>
                                <p>
                                    <span className={`px-2 py-1 rounded-full text-xs ${currentFinishFabricReceive.activeFlag
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {currentFinishFabricReceive.activeFlag ? 'Active' : 'Inactive'}
                                    </span>
                                </p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-sm text-secondary-500">Remarks</p>
                                <p className="font-medium">{currentFinishFabricReceive.remarks}</p>
                            </div>
                        </div>

                        {/* Items Section */}
                        <div className="mt-6">
                            <h3 className="font-medium mb-2">Received Items</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full border">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border">Fabric Code</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border">Roll No</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border">Roll Yards</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border">Weight</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border">Grade</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border">Warehouse</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentFinishFabricReceive.items?.map((item: any) => (
                                            <tr key={item.id} className="border">
                                                <td className="px-4 py-2 border">{item.finishedFabricCode}</td>
                                                <td className="px-4 py-2 border">{item.rollNo}</td>
                                                <td className="px-4 py-2 border">{item.rollYards}</td>
                                                <td className="px-4 py-2 border">{item.weight}</td>
                                                <td className="px-4 py-2 border">{item.gradeId}</td>
                                                <td className="px-4 py-2 border">{item.warehouseId}</td>
                                                <td className="px-4 py-2 border">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${item.activeFlag ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {item.activeFlag ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
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
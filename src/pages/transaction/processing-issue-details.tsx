import { DataTable } from "@/components/data/DataTable";
import { Modal } from "@/components/ui/Modal";
import { deleteFabricDispatch, getAllFabricDispatch } from "@/state/processIssueSlice";
import { AppDispatch, RootState } from "@/state/store";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface FabricDispatch {
    id: number;
    fabricDispatchDate: string;
    vendorId: number;
    dyeingWorkOrderId: number;
    orderQuantity: number;
    dispatchedQuantity: number;
    receivedQuantity: number;
    balanceQuantity: number;
    costPerPound: number;
    totalAmount: number;
    colorId: number;
    pantone: string;
    finishingId: number;
    salesOrderId: number;
    shipmentModeId: number;
    lotId: number;
    remarks: string;
    activeFlag: boolean;
}

export function ProcessingIssueDetails() {
    const { fabricDispatchDyingList } = useSelector((state: RootState) => state.fabricDispatchDyeing);
    const [currentDispatch, setCurrentDispatch] = useState<any>(null);
    const [isViewModalOpen, setIsViewModalOpen] = React.useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getAllFabricDispatch({}));
    }, [dispatch]);

    useEffect(() => {
        if (!currentDispatch) return;
        console.log("fabricDispatchDyingList:", fabricDispatchDyingList);
    })
    const columns = useMemo(
        () => [
            {
                Header: '#',
                Cell: ({ row }: { row: { index: number } }) => row.index + 1,
                width: 50
            },
            { Header: 'Dispatch Date', accessor: 'fabricDispatchDate' },
            { Header: 'Vendor ID', accessor: 'vendorId' },
            { Header: 'Work Order ID', accessor: 'dyeingWorkOrderId' },
            { Header: 'Order Qty', accessor: 'orderQuantity' },
            { Header: 'Dispatched Qty', accessor: 'dispatchedQuantity' },
            { Header: 'Balance Qty', accessor: 'balanceQuantity' },
            { Header: 'Total Amount', accessor: 'totalAmount' },
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
        navigate("/transaction/processing-issue");
    };

    const handleView = (dispatch: FabricDispatch) => {
        setCurrentDispatch(dispatch);
        setIsViewModalOpen(true);
    };

    const handleEdit = (processingIssueDtl: any) => {
        console.log(processingIssueDtl);
        navigate("/transaction/processing-issue", { state: { processingIssueDtl } });
    };

    const handleDelete = (item: any) => {
        setCurrentDispatch(item);
        setIsDeleteModalOpen(true);
    };

    // const confirmDelete = () => {
    //     // TODO: Implement actual delete functionality
    //     setIsDeleteModalOpen(false);
    // };

    const confirmDelete = async () => {
        if (!currentDispatch) return;

        try {
            await dispatch(deleteFabricDispatch(currentDispatch.id)).unwrap();
            await dispatch(getAllFabricDispatch({}));
        } catch (error) {
            console.error("Error deleting FabricDispatch:", error);
        }

        setIsDeleteModalOpen(false);
    };

    return (
        <div>
            {/* <h1 className="text-2xl font-bold mb-6">Fabric Dispatch Management</h1> */}

            {/* Main DataTable */}
            <DataTable
                columns={columns}
                data={fabricDispatchDyingList}
                title="Fabric Dispatch Details"
                onAdd={handleAdd}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                showActions={true}
                filterPlaceholder="Search fabric dispatches..."
            />

            {/* View Modal */}
            {/* View Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title={`Fabric Dispatch Details`}
                className="max-w-4xl"
            >
                {currentDispatch && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">ID</p>
                                <p className="font-medium">{currentDispatch.id}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Dispatch Date</p>
                                <p className="font-medium">{currentDispatch.fabricDispatchDate}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Vendor ID</p>
                                <p className="font-medium">{currentDispatch.vendorId}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Work Order ID</p>
                                <p className="font-medium">{currentDispatch.dyeingWorkOrderId}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Order Quantity</p>
                                <p className="font-medium">{currentDispatch.orderQuantity}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Dispatched Quantity</p>
                                <p className="font-medium">{currentDispatch.dispatchedQuantity}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Received Quantity</p>
                                <p className="font-medium">{currentDispatch.receivedQuantity}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Balance Quantity</p>
                                <p className="font-medium">{currentDispatch.balanceQuantity}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Cost Per Pound</p>
                                <p className="font-medium">{currentDispatch.costPerPound}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Amount</p>
                                <p className="font-medium">{currentDispatch.totalAmount}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Color ID</p>
                                <p className="font-medium">{currentDispatch.colorId}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Pantone</p>
                                <p className="font-medium">{currentDispatch.pantone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Finishing ID</p>
                                <p className="font-medium">{currentDispatch.finishingId}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Sales Order ID</p>
                                <p className="font-medium">{currentDispatch.salesOrderId}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Shipment Mode ID</p>
                                <p className="font-medium">{currentDispatch.shipmentModeId}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Lot ID</p>
                                <p className="font-medium">{currentDispatch.lotId}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Remarks</p>
                                <p className="font-medium">{currentDispatch.remarks || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <span className={`px-2 py-1 rounded-full text-xs ${currentDispatch.activeFlag ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {currentDispatch.activeFlag ? "Active" : "Inactive"}
                                </span>
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

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirm Delete"
            >
                <div className="space-y-4">
                    <p>Are you sure you want to delete this Fabric Dispatch?</p>
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
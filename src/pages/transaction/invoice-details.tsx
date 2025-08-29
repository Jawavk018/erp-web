import { DataTable } from "@/components/data/DataTable";
import { Modal } from "@/components/ui/Modal";
import { getAllInvoices } from "@/state/invoiceSlice";
import { AppDispatch, RootState } from "@/state/store";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface Invoice {
    id: number;
    manufactureId: number;
    invoiceDate: string;
    invoiceNo: string | null;
    salesOrderId: number;
    companyBankId: number;
    termsConditionsId: number;
    paymentTermsId: number;
    shipToId: number;
    shipmentMode: number;
    customerId: number;
    consgineeId: number;
    taxAmount: number;
    totalAmount: number;
    comments: string;
    activeFlag: boolean;
}

export function InvoiceDetails() {

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
    const { invoiceList } = useSelector((state: RootState) => state.invoice);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(getAllInvoices({}));
        console.log("Fetching fabric inspection data...", invoiceList);

    }, [dispatch]);

    const columns = useMemo(
        () => [
            {
                Header: '#',
                accessor: 'id',
                Cell: ({ row }: { row: { index: number } }) => row.index + 1
            },
            {
                Header: 'Invoice No',
                accessor: 'invoiceNo',
                Cell: ({ value }: { value: string | null }) => value || 'N/A'
            },
            {
                Header: 'Invoice Date',
                accessor: 'invoiceDate',
                Cell: ({ value }: { value: string }) => new Date(value).toLocaleDateString()
            },
            {
                Header: 'Sales Order',
                accessor: 'salesOrderId',
            },
            {
                Header: 'Customer',
                accessor: 'customerId',
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
        navigate("/transaction/invoice");
    };

    const handleEdit = (invoice: Invoice) => {
        navigate("/transaction/invoice", { state: { invoice } });
    };

    const handleDelete = (invoice: Invoice) => {
        setCurrentInvoice(invoice);
        setIsDeleteModalOpen(true);
    };

    const handleView = (invoice: Invoice) => {
        setCurrentInvoice(invoice);
        setIsViewModalOpen(true);
    };

    const confirmDelete = async () => {
        // if (!currentInvoice) return;
        // try {
        //     // Add your delete API call here
        //     // await dispatch(deleteInvoice(currentInvoice.id)).unwrap();
        //     setInvoiceList(invoiceList.filter(inv => inv.id !== currentInvoice.id));
        // } catch (error) {
        //     console.error("Error deleting invoice:", error);
        // }
        // setIsDeleteModalOpen(false);
    };

    return (
        <div>
            {/* <h1 className="text-2xl font-bold mb-6">Invoice Details</h1> */}

            <DataTable
                columns={columns}
                data={invoiceList}
                title="Invoice Details"
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                showActions={true}
                filterPlaceholder="Search invoices..."
            />

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirm Delete"
            >
                <div className="space-y-4">
                    <p>Are you sure you want to delete this invoice?</p>
                    <p className="text-red-600 text-sm">This action cannot be undone.</p>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>

            {/* View Invoice Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="Invoice Details"
                className="w-full max-w-4xl"
            >
                {currentInvoice && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Invoice No</p>
                                <p className="font-medium">{currentInvoice.invoiceNo || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Invoice Date</p>
                                <p className="font-medium">
                                    {new Date(currentInvoice.invoiceDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Sales Order</p>
                                <p className="font-medium">{currentInvoice.salesOrderId}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Customer</p>
                                <p className="font-medium">{currentInvoice.customerId}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Amount</p>
                                <p className="font-medium">${currentInvoice.totalAmount.toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Tax Amount</p>
                                <p className="font-medium">${currentInvoice.taxAmount.toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs ${currentInvoice.activeFlag
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}
                                >
                                    {currentInvoice.activeFlag ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Comments</p>
                                <p className="font-medium">{currentInvoice.comments || 'N/A'}</p>
                            </div>
                        </div>

                        {/* Additional sections can be added here for line items, etc. */}

                        <div className="flex justify-end pt-4">
                            <button
                                onClick={() => setIsViewModalOpen(false)}
                                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
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
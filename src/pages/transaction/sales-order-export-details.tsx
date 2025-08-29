import { DataTable } from "@/components/data/DataTable";
import { Modal } from "@/components/ui/Modal";
import { getAllSalesOrders } from "@/state/salesOrderSlice";
import { AppDispatch, RootState } from "@/state/store";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface categoryFormData {
  id?: number;
  name: string;
  status: string;
}

export function SalesOrderExportDetails() {

  const { salesOrderList } = useSelector((state: RootState) => state.salesOrder);
  const [salesOrder, setSalesOrder]: any = useState(salesOrderList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentSalesOrder, setCurrentSalesOrder] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();


  // const { register, handleSubmit, reset, formState: { errors } } = useForm<categoryFormData>();

  useEffect(() => {
    dispatch(getAllSalesOrders({}));
  }, [dispatch]);

  const flattenedData = salesOrderList.flatMap((order: any) =>
    order.items.map((item: any) => ({
      id: order.id,
      orderDate: order.orderDate.split('T')[0],
      salesOrderNo: order.salesOrderNo,
      internalOrderNo: order.internalOrderNo,
      customer: order.buyerCustomerName,
      customerPoNo: order.buyerPoNo,
      fabricQuality: item.fabricTypeId,
      quantity: item.orderQty,
      unitPrice: item.pricePerUnit,
      totalAmount: item.totalAmount,
      status: item.activeFlag ? 'Active' : 'Inactive'
    }))
  );

  console.log("Flattened Data:", flattenedData);

  const columns = useMemo(
    () => [
      { Header: "#", accessor: "id", Cell: ({ row }: { row: { index: number } }) => row.index + 1 },

      { Header: 'So Date', accessor: 'orderDate' },
      { Header: 'Sales Order No', accessor: 'salesOrderNo' },
      { Header: 'Internal Order No', accessor: 'internalOrderNo' },
      // { Header: 'Customer', accessor: 'customer' },
      // { Header: 'Customer PoNo', accessor: 'buyerPoNo' },
      // { Header: 'Fabric Quality', accessor: 'fabricQuality' },
      // { Header: 'Quantity', accessor: 'quantity' },
      // { Header: 'Unit Price', accessor: 'unitPrice' },
      // { Header: 'Total Amount', accessor: 'totalAmount' },
    ],
    []
  );


  const handleAdd = () => {
    setModalMode('add');
    setCurrentSalesOrder(null);
    navigate("/transaction/sales-order");
  };

  const handleEdit = (salesOrderdetail: any) => {
    setModalMode('edit');
    setCurrentSalesOrder(salesOrder);
    setIsModalOpen(true);
    navigate("/transaction/sales-order", { state: { salesOrderdetail } });
  };

  const handleDelete = (category: any) => {
    setCurrentSalesOrder(category);
    setIsDeleteModalOpen(true);
  };

  const handleView = (category: any) => {
    setCurrentSalesOrder(category);
    setIsViewModalOpen(true);
  };

  const confirmDelete = () => {
    setSalesOrder(salesOrder.filter((c: { id: any; }) => c.id !== currentSalesOrder.id));
    setIsDeleteModalOpen(false);
  };

  return (
    <div>
      <DataTable
        columns={columns}
        data={salesOrderList}
        title="Sales Order Details (Export)"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        showActions={true}
        filterPlaceholder="Search Sales Order..."
      />

      {/* Add/Edit Modal */}

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Sales Order Details"
      >
        {currentSalesOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-secondary-500">ID</p>
                <p className="font-medium">{currentSalesOrder.id}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">So Date</p>
                <p className="font-medium">{currentSalesOrder.soDate}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">SO No</p>
                <p className="font-medium">{currentSalesOrder.soNo}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Customer</p>
                <p className="font-medium">{currentSalesOrder.customer}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Customer Po No</p>
                <p className="font-medium">{currentSalesOrder.customerPoNo}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Fabric Quality</p>
                <p className="font-medium">{currentSalesOrder.fabricQuality}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Quantity</p>
                <p className="font-medium">{currentSalesOrder.quantity}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Unit Price</p>
                <p className="font-medium">{currentSalesOrder.unitPrice}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">UOM</p>
                <p className="font-medium">{currentSalesOrder.uom}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Total Amount</p>
                <p className="font-medium">{currentSalesOrder.totalAmount}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Delivery Date</p>
                <p className="font-medium">{currentSalesOrder.deliveryDate}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Dispatched Qty</p>
                <p className="font-medium">{currentSalesOrder.dispatchedQty}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Ready For Dispatch</p>
                <p className="font-medium">{currentSalesOrder.readyForDispatch}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Balance Qty</p>
                <p className="font-medium">{currentSalesOrder.readyForDispatch}</p>
              </div>

              <div>
                <p className="text-sm text-secondary-500">Status</p>
                <p>
                  <span className={`px-2 py-1 rounded-full text-xs ${currentSalesOrder.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {currentSalesOrder.status}
                  </span>
                </p>
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

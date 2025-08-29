import { DataTable } from "@/components/data/DataTable";
import { Modal } from "@/components/ui/Modal";
import { deleteSalesOrder, getAllSalesOrders } from "@/state/salesOrderSlice";
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

export function SalesOrderDetails() {

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
      // // { Header: 'Customer PoNo', accessor: 'buyerPoNo' },
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

  // const confirmDelete = () => {
  //   setSalesOrder(salesOrder.filter((c: { id: any; }) => c.id !== currentSalesOrder.id));
  //   setIsDeleteModalOpen(false);
  // };
  const confirmDelete = async () => {
    if (!currentSalesOrder) return;

    try {
      await dispatch(deleteSalesOrder(currentSalesOrder.id)).unwrap();
      await dispatch(getAllSalesOrders({}));
    } catch (error) {
      console.error("Error deleting SalesOrder:", error);
    }

    setIsDeleteModalOpen(false);
  };

  return (
    <div>
      <DataTable
        columns={columns}
        data={salesOrderList}
        title="Sales Order Details (Domestic)"
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
        title={`Sales Order: ${currentSalesOrder?.salesOrderNo || ''}`}
        className="max-w-4xl"
      >
        {currentSalesOrder && (
          <div className="space-y-6">
            {/* Order Header Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Sales Order No</p>
                <p className="font-medium">{currentSalesOrder.salesOrderNo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium">
                  {new Date(currentSalesOrder.orderDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-medium">{currentSalesOrder.buyerCustomerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer PO No</p>
                <p className="font-medium">{currentSalesOrder.buyerPoNo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`px-2 py-1 rounded-full text-xs ${currentSalesOrder.activeFlag ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                  {currentSalesOrder.activeFlag ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            {/* Items Table */}
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-3">Order Items</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fabric Quality</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Buyer Product</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Delivery Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentSalesOrder.items?.map((item: any, index: any) => (
                      <tr key={index}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">{item.quality}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">{item.buyerProduct}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">{item.orderQty}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">{item.pricePerUnit}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">{item.totalAmount}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                          {new Date(item.deliveryDate).toLocaleDateString()}
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

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Delete">
        <div className="space-y-4">
          <p>Are you sure you want to delete SalesOrder?</p>
          {/* <p className="text-red-600 text-sm">This action cannot be undone.</p> */}
          <div className="flex justify-end space-x-3 pt-4">
            <button onClick={() => setIsDeleteModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button onClick={confirmDelete} className="btn btn-danger">Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}





// import { DataTable } from "@/components/data/DataTable";
// import { Modal } from "@/components/ui/Modal";
// import { getAllSalesOrders } from "@/state/salesOrderSlice";
// import { AppDispatch, RootState } from "@/state/store";
// import { useEffect, useMemo, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// interface SalesOrderItem {
//   fabricTypeId: number;
//   quality: string;
//   buyerProduct: string;
//   orderQty: number;
//   pricePerUnit: number;
//   uomId: number;
//   totalAmount: number;
//   gstPercent: number;
//   gstAmount: number;
//   finalAmount: number;
//   deliveryDate: string;
//   remarks: string;
//   activeFlag: boolean;
// }

// interface SalesOrder {
//   id: number;
//   salesOrderNo: string;
//   orderDate: string;
//   buyerCustomerId: number;
//   buyerPoNo: string;
//   deliverToId: number;
//   currencyId: number;
//   exchangeRate: number;
//   modeOfShipmentId: number;
//   shipmentTermsId: number;
//   paymentTermsId: number | null;
//   termsConditionsId: number;
//   activeFlag: boolean;
//   buyerCustomerName: string;
//   internalOrderNo: string | null;
//   items: SalesOrderItem[];
// }

// export function SalesOrderDetails() {
//   const { salesOrderList } = useSelector((state: RootState) => state.salesOrder);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [currentSalesOrder, setCurrentSalesOrder] = useState<SalesOrder | null>(null);
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();

//   useEffect(() => {
//     dispatch(getAllSalesOrders({}));
//   }, [dispatch]);

//   // Flatten the data for the table
//   const flattenedData = useMemo(() => {
//     return salesOrderList.flatMap((order: SalesOrder) =>
//       order.items.map((item: SalesOrderItem) => ({
//         id: order.id,
//         orderDate: order.orderDate.split('T')[0],
//         salesOrderNo: order.salesOrderNo,
//         internalOrderNo: order.internalOrderNo || 'N/A',
//         customer: order.buyerCustomerName,
//         customerPoNo: order.buyerPoNo,
//         fabricQuality: item.quality,
//         quantity: item.orderQty,
//         unitPrice: item.pricePerUnit,
//         totalAmount: item.totalAmount,
//         status: order.activeFlag ? 'Active' : 'Inactive',
//         // Include the full item for modal view
//         _originalItem: item,
//         _originalOrder: order
//       }))
//     );
//   }, [salesOrderList]);

//   const columns = useMemo(
//     () => [
//       {
//         Header: '#',
//         Cell: ({ row }: { row: { index: number } }) => row.index + 1,
//         width: 50
//       },
//       { Header: 'SO Date', accessor: 'orderDate' },
//       { Header: 'Sales Order No', accessor: 'salesOrderNo' },
//       { Header: 'Internal Order No', accessor: 'internalOrderNo' },
//       { Header: 'Customer', accessor: 'customer' },
//       { Header: 'Customer PoNo', accessor: 'customerPoNo' },
//       { Header: 'Fabric Quality', accessor: 'fabricQuality' },
//       { Header: 'Quantity', accessor: 'quantity' },
//       { Header: 'Unit Price', accessor: 'unitPrice' },
//       { Header: 'Total Amount', accessor: 'totalAmount' },
//       {
//         Header: 'Status',
//         accessor: 'status',
//         Cell: ({ value }: { value: string }) => (
//           <span className={`px-2 py-1 rounded-full text-xs ${value === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//             }`}>
//             {value}
//           </span>
//         ),
//       }
//     ],
//     []
//   );

//   const handleAdd = () => {
//     navigate("/transaction/sales-order");
//   };

//   // const handleEdit = (rowData: any) => {
//   //   navigate("/transaction/sales-order", {
//   //     state: {
//   //       salesOrder: rowData._originalOrder,
//   //       item: rowData._originalItem
//   //     }
//   //   });
//   // };

//   const handleEdit = (salesOrderdetail: any) => {
//     console.log("Current Sales Order Detail:", salesOrderdetail);
//     // setModalMode('edit');
//     setCurrentSalesOrder(salesOrderdetail);
//     // setIsModalOpen(true);
//     navigate("/transaction/sales-order", { state: { salesOrderdetail } });
//   };

//   const handleDelete = (rowData: any) => {
//     setCurrentSalesOrder(rowData._originalOrder);
//     setIsDeleteModalOpen(true);
//   };

//   const handleView = (rowData: any) => {
//     setCurrentSalesOrder(rowData._originalOrder);
//     setIsViewModalOpen(true);
//   };

//   const confirmDelete = () => {
//     // TODO: Implement actual delete functionality
//     setIsDeleteModalOpen(false);
//   };

//   return (
//     <div className="p-4">
//       <DataTable
//         columns={columns}
//         data={flattenedData}
//         title="Sales Order Details (Domestic)"
//         onAdd={handleAdd}
//         onEdit={handleEdit}
//         onDelete={handleDelete}
//         onView={handleView}
//         filterPlaceholder="Search Sales Order..."
//       />

//       {/* View Modal */}
// <Modal
//   isOpen={isViewModalOpen}
//   onClose={() => setIsViewModalOpen(false)}
//   title={`Sales Order: ${currentSalesOrder?.salesOrderNo || ''}`}
//   className="max-w-4xl"
// >
//   {currentSalesOrder && (
//     <div className="space-y-6">
//       {/* Order Header Information */}
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <p className="text-sm text-gray-500">Sales Order No</p>
//           <p className="font-medium">{currentSalesOrder.salesOrderNo}</p>
//         </div>
//         <div>
//           <p className="text-sm text-gray-500">Order Date</p>
//           <p className="font-medium">
//             {new Date(currentSalesOrder.orderDate).toLocaleDateString()}
//           </p>
//         </div>
//         <div>
//           <p className="text-sm text-gray-500">Customer</p>
//           <p className="font-medium">{currentSalesOrder.buyerCustomerName}</p>
//         </div>
//         <div>
//           <p className="text-sm text-gray-500">Customer PO No</p>
//           <p className="font-medium">{currentSalesOrder.buyerPoNo}</p>
//         </div>
//         <div>
//           <p className="text-sm text-gray-500">Status</p>
//           <span className={`px-2 py-1 rounded-full text-xs ${currentSalesOrder.activeFlag ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//             }`}>
//             {currentSalesOrder.activeFlag ? "Active" : "Inactive"}
//           </span>
//         </div>
//       </div>

//       {/* Items Table */}
//       <div className="mt-6">
//         <h3 className="font-semibold text-lg mb-3">Order Items</h3>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fabric Quality</th>
//                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Buyer Product</th>
//                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
//                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
//                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
//                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Delivery Date</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {currentSalesOrder.items?.map((item, index) => (
//                 <tr key={index}>
//                   <td className="px-4 py-2 whitespace-nowrap text-sm">{item.quality}</td>
//                   <td className="px-4 py-2 whitespace-nowrap text-sm">{item.buyerProduct}</td>
//                   <td className="px-4 py-2 whitespace-nowrap text-sm">{item.orderQty}</td>
//                   <td className="px-4 py-2 whitespace-nowrap text-sm">{item.pricePerUnit}</td>
//                   <td className="px-4 py-2 whitespace-nowrap text-sm">{item.totalAmount}</td>
//                   <td className="px-4 py-2 whitespace-nowrap text-sm">
//                     {new Date(item.deliveryDate).toLocaleDateString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <div className="flex justify-end pt-4">
//         <button
//           onClick={() => setIsViewModalOpen(false)}
//           className="btn btn-secondary"
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   )}
// </Modal>

//       {/* Delete Confirmation Modal */}
//       <Modal
//         isOpen={isDeleteModalOpen}
//         onClose={() => setIsDeleteModalOpen(false)}
//         title="Confirm Delete"
//       >
//         <div className="space-y-4">
//           <p>Are you sure you want to delete sales order {currentSalesOrder?.salesOrderNo}?</p>
//           <p className="text-red-600 text-sm">This action cannot be undone.</p>
//           <div className="flex justify-end space-x-3 pt-4">
//             <button
//               onClick={() => setIsDeleteModalOpen(false)}
//               className="btn btn-secondary"
//             >
//               Cancel
//             </button>
//             <button onClick={confirmDelete} className="btn btn-danger">
//               Delete
//             </button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// }
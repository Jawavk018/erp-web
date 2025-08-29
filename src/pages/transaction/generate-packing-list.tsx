// import React, { useEffect, useState } from "react";
// import { FileText, ShoppingCart, ClipboardList, Plus, Edit, Trash2, Save } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useForm } from "react-hook-form";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/state/store";
// import { getAllCustomers } from "@/state/customerSlice";
// import { getAllSalesOrders, getSalesOrderByCustomerId } from "@/state/salesOrderSlice";
// import { getAllWarehouse } from "@/state/warehouseSlice";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { getAllLotEntries } from "@/state/weavingContractSlice";
// import { toast } from "react-toastify";
// import { createGeneratePacking, updateGeneratePacking } from "@/state/generatePackingSlice";
// import { useLocation, useNavigate } from "react-router-dom";
// import { getAllUomMaster } from "@/state/uomMasterSlice";

// interface PackingItem {
//   id?: number;
//   rollNo: string;
//   length: string;
//   uomId: string;
//   pounds: string;
//   lotId: string;
//   remarks: string;
// }

// interface PackingFormData {
//   id?: number;
//   packingDate: string;
//   buyerId: string;
//   salesOrderId: string;
//   warehouseId: string;
//   tareWeight: string;
//   grossWeight: string;
//   packingSlipNo: string;
//   lotId: number[];
//   items: PackingItem[];
// }

// interface LotDetail {
//   id: number;
//   yarnName: string;
//   lotNumber: string;
//   availableQty: number;
// }

// const PackingList = () => {
//   const [items, setItems] = useState<PackingItem[]>([]);
//   const [newItem, setNewItem] = useState<PackingItem>({
//     rollNo: "",
//     length: "",
//     uomId: "",
//     lotId: "",
//     pounds: "",
//     remarks: ""
//   });
//   const [editingIndex, setEditingIndex] = useState<number | null>(null);
//   const [showLotDialog, setShowLotDialog] = useState(false);
//   const [selectedLots, setSelectedLots] = useState<number[]>([]);
//   const [availableLots, setAvailableLots] = useState<LotDetail[]>([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const { customerList } = useSelector((state: RootState) => state.customer);
//   const { uomList } = useSelector((state: RootState) => state.uom);
//   const { salesOrderList } = useSelector((state: RootState) => state.salesOrder);
//   const { warehouseList } = useSelector((state: RootState) => state.warehouse);
//   const dispatch = useDispatch<AppDispatch>();
//   const location = useLocation();
//   const generatedPackingList = location.state?.packing;
//   const navigate = useNavigate();
//   console.log("salesOrderdetail from location state:", generatedPackingList);

//   const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<PackingFormData>();

//   useEffect(() => {
//     dispatch(getAllCustomers({}));
//     dispatch(getAllSalesOrders({}));
//     dispatch(getAllWarehouse({}));
//     dispatch(getAllUomMaster({}));
//     dispatch(getSalesOrderByCustomerId(1));
//   }, [dispatch]);

//   useEffect(() => {
//     if (generatedPackingList) {
//       // Set form values
//       setValue("id", generatedPackingList.id);
//       setValue("packingDate", generatedPackingList.packingDate.split('T')[0]);
//       setValue("buyerId", generatedPackingList.buyerId.toString());
//       setValue("salesOrderId", generatedPackingList.salesOrderId.toString());
//       setValue("warehouseId", generatedPackingList.warehouseId.toString());
//       setValue("tareWeight", generatedPackingList.tareWeight);
//       setValue("grossWeight", generatedPackingList.grossWeight);
//       setValue("packingSlipNo", generatedPackingList.packingSlipNo);

//       // Set items
//       if (generatedPackingList.items && generatedPackingList.items.length > 0) {
//         const formattedItems = generatedPackingList.items.map((item: any) => ({
//           id: item.id,
//           rollNo: item.rollNo,
//           length: item.length.toString(),
//           uomId: item.uomId.toString(),
//           pounds: item.pounds.toString(),
//           lotId: item.lotId ? item.lotId.toString() : "",
//           remarks: item.remarks || ""
//         }));
//         setItems(formattedItems);

//         // Set selected lots if available
//         const lotIds = generatedPackingList.items
//           .map((item: any) => item.lotId)
//           .filter((lotId: any) => lotId !== null) as number[];
//         setSelectedLots(lotIds);
//       }
//     }
//   }, [generatedPackingList, setValue]);

//   // const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   //   setNewItem({ ...newItem, [e.target.name]: e.target.value });
//   // };

//   const handleItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setNewItem({ ...newItem, [e.target.name]: e.target.value });
//   };

//   const addOrUpdateItem = () => {
//     if (!newItem.rollNo || !newItem.length || !newItem.uomId || !newItem.pounds) {
//       toast.error("Please fill all required item fields");
//       return;
//     }

//     if (editingIndex !== null) {
//       const updatedItems = [...items];
//       updatedItems[editingIndex] = newItem;
//       setItems(updatedItems);
//     } else {
//       setItems([...items, newItem]);
//     }

//     setNewItem({
//       rollNo: "",
//       length: "",
//       uomId: "",
//       lotId: "",
//       pounds: "",
//       remarks: ""
//     });
//     setEditingIndex(null);
//   };

//   const editItem = (index: number) => {
//     setNewItem(items[index]);
//     setEditingIndex(index);
//   };

//   const deleteItem = (index: number) => {
//     setItems(items.filter((_, i) => i !== index));
//   };

//   const handleLotSelection = async () => {
//     setShowLotDialog(true);
//     try {
//       const result = await dispatch(getAllLotEntries({}));
//       if (result.payload) {
//         const lots = result.payload.map((lot: any) => ({
//           id: lot.id,
//           yarnName: lot.yarnType?.name || "Unknown Yarn",
//           lotNumber: lot.lotNumber,
//           availableQty: lot.quantity - (lot.rejectedQuantity || 0)
//         }));
//         setAvailableLots(lots);
//       }
//     } catch (error) {
//       toast.error("Failed to load lot entries");
//       console.error(error);
//     }
//   };

//   const toggleLotSelection = (lotId: number) => {
//     setSelectedLots(prev =>
//       prev.includes(lotId)
//         ? prev.filter(id => id !== lotId)
//         : [...prev, lotId]
//     );
//   };

//   const onSubmit = async (data: PackingFormData) => {
//     if (!data.packingDate || !data.buyerId || !data.salesOrderId || !data.warehouseId) {
//       toast.error("Please fill all required fields");
//       return;
//     }

//     if (items.length === 0) {
//       toast.error("Please add at least one packing item");
//       return;
//     }

//     const invalidItems = items.filter(item =>
//       !item.rollNo || !item.length || !item.uomId || !item.pounds
//     );

//     if (invalidItems.length > 0) {
//       toast.error("Please fill all required fields for packing items");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const payload = {
//         id: data.id || 0,
//         packingDate: data.packingDate,
//         buyerId: parseInt(data.buyerId),
//         salesOrderId: parseInt(data.salesOrderId),
//         warehouseId: parseInt(data.warehouseId),
//         tareWeight: data.tareWeight,
//         grossWeight: data.grossWeight,
//         packingSlipNo: data.packingSlipNo,
//         items: items.map(item => ({
//           id: item.id || 0,
//           rollNo: item.rollNo,
//           length: parseFloat(item.length),
//           uomId: parseInt(item.uomId),
//           pounds: parseFloat(item.pounds),
//           lotId: item.lotId ? parseInt(item.lotId) : null,
//           remarks: item.remarks
//         }))
//       };

//       if (data.id) {
//         await dispatch(updateGeneratePacking(payload));
//         // toast.success("Packing list updated successfully");
//         navigate("/transaction/generate-packing-list-details", { state: { tab: "domestic" } }); // Go back after update
//       } else {
//         const result = await dispatch(createGeneratePacking(payload));
//         if (result.payload) {
//           // toast.success("Packing list created successfully");
//           reset();
//           setItems([]);
//           setSelectedLots([]);
//           navigate("/transaction/generate-packing-list-details", { state: { tab: "domestic" } });
//         }
//       }
//     } catch (error) {
//       toast.error("Failed to save packing list");
//       console.error("Packing list submission error:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="mt-10 p-6 bg-white shadow-md rounded-lg">
//       {/* <div className="flex justify-between items-center border-b pb-4">
//         <h2 className="text-2xl font-semibold">Packing List</h2>
//         <Button
//           onClick={handleSubmit(onSubmit)}
//           className="bg-green-600 hover:bg-green-700 text-white px-6 flex items-center"
//           disabled={isSubmitting}
//         >
//           <Save size={18} className="mr-2" />
//           {isSubmitting ? "Saving..." : "Save Packing List"}
//         </Button>
//       </div> */}
//       <div className="flex justify-between items-center border-b pb-4">
//         <h2 className="text-2xl font-semibold">
//           {generatedPackingList ? "Edit Packing List" : "Create Packing List"}
//         </h2>
//         <Button
//           onClick={handleSubmit(onSubmit)}
//           className="bg-green-600 hover:bg-green-700 text-white px-6 flex items-center"
//           disabled={isSubmitting}
//         >
//           <Save size={18} className="mr-2" />
//           {isSubmitting ? "Saving..." : generatedPackingList ? "Update Packing List" : "Save Packing List"}
//         </Button>
//       </div>

//       <div className="space-y-6 mt-4">
//         {/* Packing Details */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <ShoppingCart size={20} /> Packing Details
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-secondary-700 mb-1">
//                   Packing Date <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="date"
//                   {...register("packingDate", { required: true })}
//                   className={`input mt-1 ${errors.packingDate ? "border-red-500" : ""}`}
//                 />
//                 {errors.packingDate && (
//                   <p className="text-red-500 text-xs mt-1">Packing date is required</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-secondary-700 mb-1">
//                   Buyer <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   {...register("buyerId", { required: true })}
//                   className={`input mt-1 ${errors.buyerId ? "border-red-500" : ""}`}
//                 >
//                   <option value="">Select Buyer</option>
//                   {customerList?.map((customer: any) => (
//                     <option key={customer.id} value={customer.id}>
//                       {customer.customerName}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.buyerId && (
//                   <p className="text-red-500 text-xs mt-1">Buyer is required</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-secondary-700 mb-1">
//                   Sales Order <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   {...register("salesOrderId", { required: true })}
//                   className={`input mt-1 ${errors.salesOrderId ? "border-red-500" : ""}`}
//                 >
//                   <option value="">Select Sales Order</option>
//                   {salesOrderList?.map((so: any) => (
//                     <option key={so.id} value={so.id}>
//                       {so.salesOrderNo}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.salesOrderId && (
//                   <p className="text-red-500 text-xs mt-1">Sales order is required</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-secondary-700">
//                   Tare Weight
//                 </label>
//                 <input
//                   type="text"
//                   {...register("tareWeight")}
//                   className="input mt-1"
//                   placeholder="Enter tare weight"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-secondary-700">
//                   Gross Weight
//                 </label>
//                 <input
//                   type="text"
//                   {...register("grossWeight")}
//                   className="input mt-1"
//                   placeholder="Enter gross weight"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-secondary-700 mb-1">
//                   Warehouse <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   {...register("warehouseId", { required: true })}
//                   className={`input mt-1 ${errors.warehouseId ? "border-red-500" : ""}`}
//                 >
//                   <option value="">Select Warehouse</option>
//                   {warehouseList?.map((warehouse: any) => (
//                     <option key={warehouse.id} value={warehouse.id}>
//                       {warehouse.warehouseName}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.warehouseId && (
//                   <p className="text-red-500 text-xs mt-1">Warehouse is required</p>
//                 )}
//               </div>

//               {/* <div>
//                 <label className="block text-sm font-medium text-secondary-700">
//                   Packing Slip No
//                 </label>
//                 <input
//                   type="text"
//                   {...register("packingSlipNo")}
//                   className="input mt-1"
//                   placeholder="Enter packing slip number"
//                 />
//               </div> */}

//               <div className="flex items-end">
//                 <Button
//                   type="button"
//                   onClick={handleLotSelection}
//                   className="bg-blue-600 hover:bg-blue-700 text-white"
//                 >
//                   Select Lots ({selectedLots.length})
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Packing Items */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <ClipboardList size={20} /> Packing Items
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
//               <div>
//                 <label className="block text-sm font-medium text-secondary-700">
//                   Roll No <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="rollNo"
//                   value={newItem.rollNo}
//                   onChange={handleItemChange}
//                   className="input mt-1"
//                   placeholder="Enter roll number"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-secondary-700">
//                   Length <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="length"
//                   value={newItem.length}
//                   onChange={handleItemChange}
//                   className="input mt-1"
//                   placeholder="Enter length"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-secondary-700">
//                   UOM <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="uomId"
//                   value={newItem.uomId}
//                   onChange={handleItemChange}
//                   className="input mt-1"
//                 >
//                   <option value="">Select UOM</option>
//                   {uomList.map((uom: any) => (
//                     <option key={uom.id} value={uom.id.toString()}>
//                       {uom.uomName}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-secondary-700">
//                   Pounds <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="pounds"
//                   value={newItem.pounds}
//                   onChange={handleItemChange}
//                   className="input mt-1"
//                   placeholder="Enter pounds"
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-secondary-700">
//                   Remarks
//                 </label>
//                 <input
//                   type="text"
//                   name="remarks"
//                   value={newItem.remarks}
//                   onChange={handleItemChange}
//                   className="input mt-1 w-full"
//                   placeholder="Enter remarks"
//                 />
//               </div>

//               <div className="flex items-end">
//                 <Button
//                   onClick={addOrUpdateItem}
//                   className="bg-blue-600 hover:bg-blue-700 text-white"
//                 >
//                   <Plus size={18} className="mr-2" />
//                   {editingIndex !== null ? "Update Item" : "Add Item"}
//                 </Button>
//               </div>
//             </div>

//             {items.length > 0 && (
//               <div className="overflow-x-auto">
//                 <table className="w-full border-collapse border border-gray-300">
//                   <thead className="bg-gray-100">
//                     <tr>
//                       <th className="border p-2">Roll No</th>
//                       <th className="border p-2">Length</th>
//                       <th className="border p-2">UOM</th>
//                       <th className="border p-2">Pounds</th>
//                       <th className="border p-2">Remarks</th>
//                       <th className="border p-2">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {items.map((item, index) => (
//                       <tr key={index} className="border hover:bg-gray-50">
//                         <td className="border p-2">{item.rollNo}</td>
//                         <td className="border p-2">{item.length}</td>
//                         <td className="border p-2">{item.uomId}</td>
//                         <td className="border p-2">{item.pounds}</td>
//                         <td className="border p-2">{item.remarks}</td>
//                         <td className="border p-2 text-center">
//                           <button
//                             onClick={() => editItem(index)}
//                             className="mr-2 text-blue-500 hover:text-blue-700"
//                           >
//                             <Edit size={18} />
//                           </button>
//                           <button
//                             onClick={() => deleteItem(index)}
//                             className="text-red-500 hover:text-red-700"
//                           >
//                             <Trash2 size={18} />
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Lot Selection Dialog */}
//         <Dialog open={showLotDialog} onOpenChange={setShowLotDialog}>
//           <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
//             <DialogHeader>
//               <DialogTitle>Select Lots</DialogTitle>
//             </DialogHeader>
//             <div className="max-h-[60vh] overflow-y-auto">
//               <table className="w-full border-collapse">
//                 <thead className="sticky top-0 bg-gray-100">
//                   <tr>
//                     <th className="border p-2">Select</th>
//                     <th className="border p-2">Yarn Name</th>
//                     <th className="border p-2">Lot Number</th>
//                     <th className="border p-2">Available Qty</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {availableLots.map((lot) => (
//                     <tr key={lot.id} className="border hover:bg-gray-50">
//                       <td className="border p-2 text-center">
//                         <Checkbox
//                           checked={selectedLots.includes(lot.id)}
//                           onCheckedChange={() => toggleLotSelection(lot.id)}
//                         />
//                       </td>
//                       <td className="border p-2">{lot.yarnName}</td>
//                       <td className="border p-2">{lot.lotNumber}</td>
//                       <td className="border p-2">{lot.availableQty}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             <div className="flex justify-end gap-2 mt-4">
//               <Button variant="outline" onClick={() => setShowLotDialog(false)}>
//                 Cancel
//               </Button>
//               <Button onClick={() => setShowLotDialog(false)}>
//                 Confirm Selection ({selectedLots.length})
//               </Button>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </div>
//   );
// };

// export default PackingList;




import React, { useEffect, useState } from "react";
import { FileText, ShoppingCart, ClipboardList, Plus, Edit, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { getAllCustomers } from "@/state/customerSlice";
import { getAllSalesOrders, getSalesOrderByCustomerId } from "@/state/salesOrderSlice";
import { getAllWarehouse } from "@/state/warehouseSlice";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getAllLotEntries } from "@/state/weavingContractSlice";
import { toast } from "react-toastify";
import { createGeneratePacking, updateGeneratePacking } from "@/state/generatePackingSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllUomMaster } from "@/state/uomMasterSlice";

interface PackingItem {
  id?: number;
  rollNo: string;
  length: string;
  uomId: string;
  pounds: string;
  lotId: string;
  remarks: string;
}

interface PackingFormData {
  id?: number;
  packingDate: string;
  buyerId: string;
  salesOrderId: string;
  warehouseId: string;
  tareWeight: string;
  grossWeight: string;
  packingSlipNo: string;
  lotId: number[];
  items: PackingItem[];
}

interface LotDetail {
  id: number;
  yarnName: string;
  lotNumber: string;
  availableQty: number;
}

const PackingList = () => {
  const [items, setItems] = useState<PackingItem[]>([]);
  const [newItem, setNewItem] = useState<PackingItem>({
    rollNo: "",
    length: "",
    uomId: "",
    lotId: "",
    pounds: "",
    remarks: ""
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showLotDialog, setShowLotDialog] = useState(false);
  const [selectedLots, setSelectedLots] = useState<number[]>([]);
  const [availableLots, setAvailableLots] = useState<LotDetail[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { customerList } = useSelector((state: RootState) => state.customer);
  const { uomList } = useSelector((state: RootState) => state.uom);
  const { salesOrderList } = useSelector((state: RootState) => state.salesOrder);
  const { warehouseList } = useSelector((state: RootState) => state.warehouse);
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const generatedPackingList = location.state?.packing;
  const navigate = useNavigate();

  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm<PackingFormData>();

  useEffect(() => {
    dispatch(getAllCustomers({}));
    dispatch(getAllWarehouse({}));
    dispatch(getAllUomMaster({}));
  }, [dispatch]);

  useEffect(() => {
    if (generatedPackingList) {
      // Set form values
      setValue("id", generatedPackingList.id);
      setValue("packingDate", generatedPackingList.packingDate.split('T')[0]);
      setValue("buyerId", generatedPackingList.buyerId.toString());
      setValue("salesOrderId", generatedPackingList.salesOrderId.toString());
      setValue("warehouseId", generatedPackingList.warehouseId.toString());
      setValue("tareWeight", generatedPackingList.tareWeight);
      setValue("grossWeight", generatedPackingList.grossWeight);
      setValue("packingSlipNo", generatedPackingList.packingSlipNo);

      // Set items
      if (generatedPackingList.items && generatedPackingList.items.length > 0) {
        const formattedItems = generatedPackingList.items.map((item: any) => ({
          id: item.id,
          rollNo: item.rollNo,
          length: item.length.toString(),
          uomId: item.uomId.toString(),
          pounds: item.pounds.toString(),
          lotId: item.lotId ? item.lotId.toString() : "",
          remarks: item.remarks || ""
        }));
        setItems(formattedItems);

        // Set selected lots if available
        const lotIds = generatedPackingList.items
          .map((item: any) => item.lotId)
          .filter((lotId: any) => lotId !== null) as number[];
        setSelectedLots(lotIds);
      }
    }
  }, [generatedPackingList, setValue]);

  const handleBuyerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const buyerId = e.target.value;
    setValue("buyerId", buyerId);

    if (buyerId) {
      dispatch(getSalesOrderByCustomerId(parseInt(buyerId)));
    }
  };

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const addOrUpdateItem = () => {
    if (!newItem.rollNo || !newItem.length || !newItem.uomId || !newItem.pounds) {
      toast.error("Please fill all required item fields");
      return;
    }

    if (editingIndex !== null) {
      const updatedItems = [...items];
      updatedItems[editingIndex] = newItem;
      setItems(updatedItems);
    } else {
      setItems([...items, newItem]);
    }

    setNewItem({
      rollNo: "",
      length: "",
      uomId: "",
      lotId: "",
      pounds: "",
      remarks: ""
    });
    setEditingIndex(null);
  };

  const editItem = (index: number) => {
    setNewItem(items[index]);
    setEditingIndex(index);
  };

  const deleteItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleLotSelection = async () => {
    setShowLotDialog(true);
    try {
      const result = await dispatch(getAllLotEntries({}));
      if (result.payload) {
        const lots = result.payload.map((lot: any) => ({
          id: lot.id,
          yarnName: lot.yarnType?.name || "Unknown Yarn",
          lotNumber: lot.lotNumber,
          availableQty: lot.quantity - (lot.rejectedQuantity || 0)
        }));
        setAvailableLots(lots);
      }
    } catch (error) {
      toast.error("Failed to load lot entries");
      console.error(error);
    }
  };

  const toggleLotSelection = (lotId: number) => {
    setSelectedLots(prev =>
      prev.includes(lotId)
        ? prev.filter(id => id !== lotId)
        : [...prev, lotId]
    );
  };

  const onSubmit = async (data: PackingFormData) => {
    if (!data.packingDate || !data.buyerId || !data.salesOrderId || !data.warehouseId) {
      toast.error("Please fill all required fields");
      return;
    }

    if (items.length === 0) {
      toast.error("Please add at least one packing item");
      return;
    }

    const invalidItems = items.filter(item =>
      !item.rollNo || !item.length || !item.uomId || !item.pounds
    );

    if (invalidItems.length > 0) {
      toast.error("Please fill all required fields for packing items");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        id: data.id || 0,
        packingDate: data.packingDate,
        buyerId: parseInt(data.buyerId),
        salesOrderId: parseInt(data.salesOrderId),
        warehouseId: parseInt(data.warehouseId),
        tareWeight: data.tareWeight,
        grossWeight: data.grossWeight,
        packingSlipNo: data.packingSlipNo,
        items: items.map(item => ({
          id: item.id || 0,
          rollNo: item.rollNo,
          length: parseFloat(item.length),
          uomId: parseInt(item.uomId),
          pounds: parseFloat(item.pounds),
          lotId: item.lotId ? parseInt(item.lotId) : null,
          remarks: item.remarks
        }))
      };

      if (data.id) {
        await dispatch(updateGeneratePacking(payload));
        // toast.success("Packing list updated successfully");
        navigate("/transaction/generate-packing-list-details", { state: { tab: "domestic" } }); // Go back after update
      } else {
        const result = await dispatch(createGeneratePacking(payload));
        if (result.payload) {
          // toast.success("Packing list created successfully");
          reset();
          setItems([]);
          setSelectedLots([]);
          navigate("/transaction/generate-packing-list-details", { state: { tab: "domestic" } });
        }
      }
    } catch (error) {
      toast.error("Failed to save packing list");
      console.error("Packing list submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-10 p-6 bg-white shadow-md rounded-lg">
      {/* ... other JSX remains the same */}

      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-semibold">
          {generatedPackingList ? "Edit Packing List" : "Create Packing List"}
        </h2>
        <Button
          onClick={handleSubmit(onSubmit)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 flex items-center"
          disabled={isSubmitting}
        >
          <Save size={18} className="mr-2" />
          {isSubmitting ? "Saving..." : generatedPackingList ? "Update Packing List" : "Save Packing List"}
        </Button>
      </div>

      <div className="space-y-6 mt-4">
        {/* Packing Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart size={20} /> Packing Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Packing Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register("packingDate", { required: true })}
                  className={`input mt-1 ${errors.packingDate ? "border-red-500" : ""}`}
                />
                {errors.packingDate && (
                  <p className="text-red-500 text-xs mt-1">Packing date is required</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Buyer <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("buyerId", { required: true })}
                  onChange={handleBuyerChange}
                  className={`input mt-1 ${errors.buyerId ? "border-red-500" : ""}`}
                >
                  <option value="">Select Buyer</option>
                  {customerList?.map((customer: any) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.customerName}
                    </option>
                  ))}
                </select>
                {errors.buyerId && (
                  <p className="text-red-500 text-xs mt-1">Buyer is required</p>
                )}
              </div>

              {/* Sales Order Select Field */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Sales Order <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("salesOrderId", { required: true })}
                  className={`input mt-1 ${errors.salesOrderId ? "border-red-500" : ""}`}
                >
                  <option value="">Select Sales Order</option>
                  {salesOrderList
                    ?.filter((so: any) => so.buyerCustomerId === parseInt(watch("buyerId") || "0"))
                    .map((so: any) => (
                      <option key={so.id} value={so.id}>
                        {so.salesOrderNo}
                      </option>
                    ))
                  }
                </select>
                {errors.salesOrderId && (
                  <p className="text-red-500 text-xs mt-1">Sales order is required</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700">
                  Tare Weight
                </label>
                <input
                  type="text"
                  {...register("tareWeight")}
                  className="input mt-1"
                  placeholder="Enter tare weight"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700">
                  Gross Weight
                </label>
                <input
                  type="text"
                  {...register("grossWeight")}
                  className="input mt-1"
                  placeholder="Enter gross weight"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Warehouse <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("warehouseId", { required: true })}
                  className={`input mt-1 ${errors.warehouseId ? "border-red-500" : ""}`}
                >
                  <option value="">Select Warehouse</option>
                  {warehouseList?.map((warehouse: any) => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.warehouseName}
                    </option>
                  ))}
                </select>
                {errors.warehouseId && (
                  <p className="text-red-500 text-xs mt-1">Warehouse is required</p>
                )}
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-secondary-700">
                  Packing Slip No
                </label>
                <input
                  type="text"
                  {...register("packingSlipNo")}
                  className="input mt-1"
                  placeholder="Enter packing slip number"
                />
              </div> */}

              <div className="flex items-end">
                <Button
                  type="button"
                  onClick={handleLotSelection}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Select Lots ({selectedLots.length})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Packing Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList size={20} /> Packing Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700">
                  Roll No <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="rollNo"
                  value={newItem.rollNo}
                  onChange={handleItemChange}
                  className="input mt-1"
                  placeholder="Enter roll number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700">
                  Length <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="length"
                  value={newItem.length}
                  onChange={handleItemChange}
                  className="input mt-1"
                  placeholder="Enter length"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700">
                  UOM <span className="text-red-500">*</span>
                </label>
                <select
                  name="uomId"
                  value={newItem.uomId}
                  onChange={handleItemChange}
                  className="input mt-1"
                >
                  <option value="">Select UOM</option>
                  {uomList.map((uom: any) => (
                    <option key={uom.id} value={uom.id.toString()}>
                      {uom.uomName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700">
                  Pounds <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="pounds"
                  value={newItem.pounds}
                  onChange={handleItemChange}
                  className="input mt-1"
                  placeholder="Enter pounds"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary-700">
                  Remarks
                </label>
                <input
                  type="text"
                  name="remarks"
                  value={newItem.remarks}
                  onChange={handleItemChange}
                  className="input mt-1 w-full"
                  placeholder="Enter remarks"
                />
              </div>

              <div className="flex items-end">
                <Button
                  onClick={addOrUpdateItem}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus size={18} className="mr-2" />
                  {editingIndex !== null ? "Update Item" : "Add Item"}
                </Button>
              </div>
            </div>

            {items.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-2">Roll No</th>
                      <th className="border p-2">Length</th>
                      <th className="border p-2">UOM</th>
                      <th className="border p-2">Pounds</th>
                      <th className="border p-2">Remarks</th>
                      <th className="border p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index} className="border hover:bg-gray-50">
                        <td className="border p-2">{item.rollNo}</td>
                        <td className="border p-2">{item.length}</td>
                        <td className="border p-2">{item.uomId}</td>
                        <td className="border p-2">{item.pounds}</td>
                        <td className="border p-2">{item.remarks}</td>
                        <td className="border p-2 text-center">
                          <button
                            onClick={() => editItem(index)}
                            className="mr-2 text-blue-500 hover:text-blue-700"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => deleteItem(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lot Selection Dialog */}
        <Dialog open={showLotDialog} onOpenChange={setShowLotDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Select Lots</DialogTitle>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-gray-100">
                  <tr>
                    <th className="border p-2">Select</th>
                    <th className="border p-2">Yarn Name</th>
                    <th className="border p-2">Lot Number</th>
                    <th className="border p-2">Available Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {availableLots.map((lot) => (
                    <tr key={lot.id} className="border hover:bg-gray-50">
                      <td className="border p-2 text-center">
                        <Checkbox
                          checked={selectedLots.includes(lot.id)}
                          onCheckedChange={() => toggleLotSelection(lot.id)}
                        />
                      </td>
                      <td className="border p-2">{lot.yarnName}</td>
                      <td className="border p-2">{lot.lotNumber}</td>
                      <td className="border p-2">{lot.availableQty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowLotDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowLotDialog(false)}>
                Confirm Selection ({selectedLots.length})
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PackingList;
// import React, { useEffect, useState } from "react";
// import { FileText, ShoppingCart, ClipboardList, Edit, Trash2, Save, Plus } from "lucide-react";
// import { Button } from "@/components/ui/button"; // Assuming shadcn/ui
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useForm } from "react-hook-form";
// import { Checkbox } from "@/components/ui/checkbox";
// import { createPurchaseOrder, getAllPoTypes, getAllPurchaseOrders, updatePurchaseOrder } from "@/state/purchaseOrderSlice";
// import { AppDispatch, RootState } from "@/state/store";
// import { useDispatch, useSelector } from "react-redux";
// import { getAllCustomers } from "@/state/customerSlice";
// import { getAllProductCategory } from "@/state/productCategorySlice";
// import { getAllVendors } from "@/state/vendorSlice";
// import { useLocation, useNavigate } from "react-router-dom";
// import { getAllUomMaster } from "@/state/uomMasterSlice";
// import { getAllGstMaster } from "@/state/gstMasterSlice";

// interface PurchaseOrderFormData {
//   id?: number | null;
//   poTypeId: string;
//   poDate: string;
//   vendorId: string;
//   taxId: string;
//   activeFlag: boolean;
//   purchaseOrderItemsDtl: purchaseOrderItemsDtl[];
// }

// interface purchaseOrderItemsDtl {
//   id?: number;
//   productCategoryId: string;
//   quantity: string;
//   unit: string;
//   price: string;
//   netAmount: string;
//   deliveryDate: string;
//   remarks: string;
//   activeFlag: boolean;
// }

// export function PurchaseOrderEntry() {

//   const { purchaseOrderList } = useSelector((state: RootState) => state.purchaseOrder);
//   const { purchaseOrderTypeList } = useSelector((state: RootState) => state.purchaseOrder);
//   const { productCategoryList } = useSelector((state: RootState) => state.productCategory);
//   const { vendorList } = useSelector((state: RootState) => state.vendor);
//   const { uomList } = useSelector((state: RootState) => state.uom);
//   const { gstList } = useSelector((state: RootState) => state.gst);
//   const [purchaseOrderItemsDtl, setPurchaseOrderItemsDtl]: any = useState([]);
//   const [newItem, setNewItem]: any = useState({});
//   const [editingIndex, setEditingIndex]: any = useState(null);
//   const [activeTab, setActiveTab] = useState("orderDetails");
//   const [taxType, setTaxType] = useState("IGST"); // IGST or SGST/CGST
//   const [isEditing, setIsEditing] = React.useState(false);
//   const [selectedPoTypeId, setSelectedPoTypeId] = useState<number | null>(null);
//   const [filteredProductCategories, setFilteredProductCategories] = useState<any[]>([]);
//   const [selectedProductCategory, setSelectedProductCategory] = useState<any[]>([]);
//   const [productCategories, setProductCategories] = useState([]); // from your API
//   const [selectedCategory, setSelectedCategory] = useState<string>(''); // productCategoryName
//   const [fabricCodes, setFabricCodes] = useState<any[]>([]);
//   const [selectedFabricCode, setSelectedFabricCode] = useState<string>('');
//   const [fabricQuality, setFabricQuality] = useState<string>('');
//   const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
//   const dispatch = useDispatch<AppDispatch>();
//   const { register, handleSubmit, reset, formState: { errors } } = useForm<PurchaseOrderFormData>();
//   const location = useLocation();
//   const purchaseOrderdetail = location.state?.purchaseOrderdetail;
//   const navigate = useNavigate();


//   console.log("purchaseOrderdetail from location state:", purchaseOrderdetail);

//   useEffect(() => {
//     dispatch(getAllPurchaseOrders({}));
//     dispatch(getAllPoTypes({}));
//     dispatch(getAllVendors({}));
//     dispatch(getAllProductCategory({}));
//     dispatch(getAllUomMaster({}));
//     dispatch(getAllGstMaster({}));
//     console.log(productCategoryList)
//   }, [dispatch]);

//   useEffect(() => {
//     if (purchaseOrderdetail) {
//       reset({
//         id: purchaseOrderdetail.id ?? null,
//         poTypeId: purchaseOrderdetail.poTypeId ? String(purchaseOrderdetail.poTypeId) : "",
//         poDate: purchaseOrderdetail.poDate ? purchaseOrderdetail.poDate.slice(0, 10) : "",
//         vendorId: purchaseOrderdetail.vendorId ? String(purchaseOrderdetail.vendorId) : "",
//         taxId: purchaseOrderdetail.taxId ? String(purchaseOrderdetail.taxId) : "",
//         activeFlag: purchaseOrderdetail.activeFlag ?? true,
//         purchaseOrderItemsDtl: []
//       });
//       setSelectedPoTypeId(purchaseOrderdetail.poTypeId || null);
//       setPurchaseOrderItemsDtl(
//         (purchaseOrderdetail.purchaseOrderItemsDtl || []).map((item: any) => ({
//           ...item,
//           productCategoryId: String(item.productCategoryId ?? ""),
//           quantity: String(item.quantity ?? ""),
//           unit: String(item.unit ?? ""),
//           price: String(item.price ?? ""),
//           netAmount: String(item.netAmount ?? ""),
//           deliveryDate: item.deliveryDate ? item.deliveryDate.slice(0, 10) : "",
//           remarks: String(item.remarks ?? ""),
//           activeFlag: item.activeFlag ?? true,
//         }))
//       );
//       if (purchaseOrderdetail.purchaseOrderItemsDtl?.length > 0) {
//         setSelectedCategoryId(purchaseOrderdetail.purchaseOrderItemsDtl[0].productCategoryId);
//       }
//     }
//     // eslint-disable-next-line
//   }, [purchaseOrderdetail, reset]);

//   const handleChange = (e: any) => {
//     setNewItem({ ...newItem, [e.target.name]: e.target.value });
//   };

//   const calculateSummary = () => {
//     const netAmount = purchaseOrderItemsDtl.reduce((sum: number, item: { pricePerUnit: number; orderQty: number; }) => sum + item.pricePerUnit * item.orderQty, 0);
//     const gstAmount = purchaseOrderItemsDtl.reduce((sum: number, item: { pricePerUnit: number; orderQty: number; gst: number; }) => sum + (item.pricePerUnit * item.orderQty * item.gst) / 100, 0);
//     return { netAmount, gstAmount, finalAmount: netAmount + gstAmount };
//   };

//   const { netAmount } = calculateSummary();

//   const taxList = [
//     {
//       "id": 1,
//       "taxTypeName": "CGST/SGST",
//       "activeFlag": true
//     },
//     {
//       "id": 2,
//       "taxTypeName": "IGST",
//       "activeFlag": true
//     }
//   ]

//   const unitList = [
//     {
//       "id": 1,
//       "unitTypeName": "Nos",
//       "activeFlag": true
//     },
//     {
//       "id": 2,
//       "unitTypeName": "Meters",
//       "activeFlag": true
//     },
//     {
//       "id": 3,
//       "unitTypeName": "Kgs",
//       "activeFlag": true
//     }
//   ]

//   const addItem = () => {
//     if (editingIndex !== null) {
//       const updatedItems = [...purchaseOrderItemsDtl];
//       updatedItems[editingIndex] = newItem;
//       setPurchaseOrderItemsDtl(updatedItems);
//       setEditingIndex(null);
//     } else {
//       setPurchaseOrderItemsDtl([...purchaseOrderItemsDtl, newItem]);
//     }
//     setNewItem({
//       productCategoryId: '',
//       quantity: '',
//       unit: '',
//       price: '',
//       netAmount: '',
//       deliveryDate: '',
//       remarks: '',
//       activeFlag: true,
//     });
//   };

//   const editItem = (index: number) => {
//     setNewItem(purchaseOrderItemsDtl[index]);
//     setEditingIndex(index);
//   };

//   const deleteItem = (index: number) => {
//     setPurchaseOrderItemsDtl(purchaseOrderItemsDtl.filter((_: any, i: number) => i !== index));
//   };


//   const onSubmit = async (data: PurchaseOrderFormData) => {
//     const payload = {
//       ...data,
//       poTypeId: parseInt(data.poTypeId),
//       vendorId: parseInt(data.vendorId),
//       taxId: parseInt(data.taxId),
//       activeFlag: true,
//       purchaseOrderItemsDtl: purchaseOrderItemsDtl.map((item: { productCategoryId: string; quantity: string; price: string; netAmount: string; deliveryDate: string | number | Date; }) => ({
//         ...item,
//         productCategoryId: parseInt(item.productCategoryId),
//         quantity: parseFloat(item.quantity),
//         price: parseFloat(item.price),
//         netAmount: parseFloat(item.netAmount),
//         deliveryDate: new Date(item.deliveryDate).toISOString(),
//       })),
//     };
//     try {
//       if (purchaseOrderdetail?.id) {
//         // Edit mode - update
//         await dispatch(updatePurchaseOrder({ id: purchaseOrderdetail.id, data: payload })).unwrap();
//         // toast.success("Sales Order updated successfully!");
//       } else {
//         // Create mode - save
//         await dispatch(createPurchaseOrder(payload)).unwrap();
//         // toast.success("Sales Order saved successfully!");
//       }
//       navigate("/transaction/purchase-order-details");
//     } catch (err) {
//       // toast.error("Failed to save/update Sales Order");
//     }
//   };

//   const handlePoTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedId = parseInt(e.target.value);
//     setSelectedPoTypeId(selectedId);

//     const filtered = productCategoryList.filter((cat: any) => cat.poTypeId === selectedId);
//     console.log(filtered)
//     setFilteredProductCategories(filtered);
//     setSelectedProductCategory([]);
//   };


//   return (
//     <div className="mt-10 p-6 bg-white shadow-md rounded-lg mt-16">
//       {/* Title & Save Button */}
//       <div className="flex justify-between items-center border-b pb-4">
//         <h2 className="text-2xl font-semibold">Purchase Order</h2>
//         <Button
//           onClick={handleSubmit(onSubmit)}
//           className={`bg-green-600 hover:bg-green-700 text-white px-6 flex items-center`}
//         >
//           <Save size={18} className="mr-2" />
//           {purchaseOrderdetail?.id ? "Update Purchase Order" : "Save Purchase Order"}
//         </Button>
//       </div>
//       <div className="space-y-6">
//         {/* Tab Navigation */}
//         <div className="mb-8">
//           <div className="border-b border-gray-200">
//             <nav className="flex -mb-px">
//               <button
//                 onClick={() => setActiveTab('orderDetails')}
//                 className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm ${activeTab === 'orderDetails'
//                   ? 'border-red-500 text-red-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 Inward Ordershover:border-gray-300'
//                   }`}
//               >
//                 <FileText className="w-4 h-4" />
//                 Order Details
//               </button>
//               <button
//                 onClick={() => setActiveTab('itemDetails')}
//                 className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm ${activeTab === 'itemDetails'
//                   ? 'border-red-500 text-red-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                   }`}
//               >
//                 <ShoppingCart className="w-4 h-4" />
//                 Item Details
//               </button>
//             </nav>
//           </div>
//         </div>

//         {/* Order Details */}
//         {activeTab === "orderDetails" && (
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <FileText size={20} /> Order Details
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="grid grid-cols-3 gap-8">
//               <div>
//                 <label className="block text-sm font-medium">Select PoType</label>
//                 <select {...register("poTypeId", { required: "Po Type is required" })} className="input mt-1" onChange={handlePoTypeChange}>
//                   <option value="">Select a PoType</option>
//                   {purchaseOrderTypeList?.map((poType: any) => (
//                     <option key={poType.id} value={poType.id}>{poType.poTypeName}</option>
//                   ))}
//                 </select>
//                 {errors.poTypeId && <p className="mt-1 text-sm text-red-600">{errors.poTypeId.message}</p>}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-secondary-700">PO Date</label>
//                 <input
//                   {...register('poDate', { required: 'Date is required' })}
//                   className="input mt-1" type="date"
//                 />
//                 {errors.poDate && (
//                   <p className="mt-1 text-sm text-red-600">{errors.poDate.message}</p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-secondary-700">Select a Vendor </label>
//                 <select {...register("vendorId", { required: "Vendor is required" })} className="input mt-1">
//                   <option value="">Select a Vendor</option>
//                   {vendorList?.map((vendor: any) => (
//                     <option key={vendor.id} value={vendor.id}>{vendor.vendorName}</option>
//                   ))}
//                 </select>
//                 {errors.vendorId && (
//                   <p className="mt-1 text-sm text-red-600">{errors.vendorId.message}</p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-secondary-700">Tax</label>
//                 <select {...register("taxId", { required: "Tax is required" })} className="input mt-1">
//                   <option value="">Select a Tax</option>
//                   {taxList?.map((tax: any) => (
//                     <option key={tax.id} value={tax.id}>{tax.taxTypeName}</option>
//                   ))}
//                 </select>
//                 {errors.taxId && (
//                   <p className="mt-1 text-sm text-red-600">{errors.taxId.message}</p>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* Item Details */}
//         {activeTab === "itemDetails" && (
//           <>
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <ShoppingCart size={20} /> Item Details
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-3 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-secondary-700">Product Category</label>
//                     <select
//                       className="input mt-1"
//                       value={selectedCategoryId || ''}
//                       onChange={(e) => {
//                         const selectedId = Number(e.target.value);
//                         const selectedItem = productCategoryList.find(
//                           (item: any) => item.id === selectedId
//                         );

//                         if (selectedItem) {
//                           setSelectedCategory(selectedItem.productCategoryName);
//                           setSelectedCategoryId(selectedItem.id);

//                           const filteredCodes = productCategoryList.filter(
//                             (item: any) => item.productCategoryName === selectedItem.productCategoryName
//                           );
//                           setFabricCodes(filteredCodes);
//                           setSelectedFabricCode('');
//                           setFabricQuality('');

//                           setNewItem((prev: any) => ({
//                             ...prev,
//                             productCategoryId: selectedId,
//                             productCategoryName: selectedItem.productCategoryName,
//                           }));
//                         }
//                       }}
//                     >
//                       <option value="">Select Product Category</option>
//                       {[...new Map(productCategoryList.map((item: any) => [item.productCategoryName, item])).values()].map((item: any) => (
//                         <option key={item.id} value={item.id}>
//                           {item.productCategoryName}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-secondary-700">Fabric Code</label>
//                     <select
//                       className="input mt-1"
//                       value={selectedFabricCode}
//                       onChange={(e) => {
//                         const code = e.target.value;
//                         setSelectedFabricCode(code);
//                         const matched = fabricCodes.find((item) => item.fabricCode === code);
//                         setFabricQuality(matched?.fabricQuality || '');
//                       }}
//                     >
//                       <option value="">Select Fabric Code</option>
//                       {fabricCodes.map((item) => (
//                         <option key={item.fabricCode} value={item.fabricCode}>
//                           {item.fabricCode}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-secondary-700">Fabric Quality</label>
//                     <input className="input mt-1" value={fabricQuality} readOnly />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-secondary-700">Quantity</label>
//                     <input placeholder="Quantity"
//                       value={newItem.quantity}
//                       onChange={e => setNewItem({ ...newItem, quantity: e.target.value })} className="input  mt-1" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-secondary-700">Unit</label>
//                     <select value={newItem.unit} onChange={e => setNewItem({ ...newItem, unit: e.target.value })} className="input mt-1">
//                       <option value="">Select Unit</option>
//                       {uomList?.map((unit: any) => (
//                         <option key={unit.id} value={unit.id}>{unit.uomName}</option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-secondary-700">Price</label>
//                     <input placeholder="Price" value={newItem.price}
//                       onChange={e => setNewItem({ ...newItem, price: e.target.value })} className="input mt-1" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-secondary-700">Net Amount</label>
//                     <input placeholder="Net Amount" value={newItem.netAmount}
//                       onChange={e => setNewItem({ ...newItem, netAmount: e.target.value })} className="input mt-1" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-secondary-700">Delivery Date</label>
//                     <input type="date" value={newItem.deliveryDate}
//                       onChange={e => setNewItem({ ...newItem, deliveryDate: e.target.value })} className="input mt-1" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-secondary-700">Remarks</label>
//                     <input placeholder="Remarks" value={newItem.remarks}
//                       onChange={e => setNewItem({ ...newItem, remarks: e.target.value })} className="input" />
//                   </div>

//                 </div>
//                 <Button onClick={addItem} className="mt-4 ml-auto flex items-center">
//                   <Plus size={18} className="mr-2" />
//                   {editingIndex !== null ? "Update Item" : "Add Item"}
//                 </Button>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <ClipboardList size={20} /> Item Summary
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <table className="w-full border-collapse border border-gray-300 text-center">
//                   <thead className="bg-gray-100">
//                     <tr>
//                       <th className="border p-2">Sl.No</th>
//                       <th className="border p-2">Product</th>
//                       <th className="border p-2">Quantity</th>
//                       <th className="border p-2">Unit</th>
//                       <th className="border p-2">Price</th>
//                       <th className="border p-2">Net Amount</th>
//                       <th className="border p-2">Delivery Date</th>
//                       <th className="border p-2">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {purchaseOrderItemsDtl?.map((item: any, index: any) => (
//                       <tr key={index} className="border">
//                         <td className="border p-2">{index + 1}</td>
//                         <td className="border p-2">{item.productCategoryId}</td>
//                         <td className="border p-2">{item.quantity}</td>
//                         <td className="border p-2">{item.unit}</td>
//                         <td className="border p-2">{item.price}</td>
//                         <td className="border p-2">{item.netAmount}</td>
//                         <td className="border p-2">{item.deliveryDate}</td>
//                         <td className="border p-2">
//                           <Button size="sm" onClick={() => editItem(index)}><Edit size={14} /></Button>
//                           <Button size="sm" onClick={() => deleteItem(index)} variant="destructive"><Trash2 size={14} /></Button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </CardContent>
//             </Card>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };








// import React, { useEffect, useState } from "react";
// import { FileText, ShoppingCart, ClipboardList, Edit, Trash2, Save, Plus } from "lucide-react";
// import { Button } from "@/components/ui/button"; // Assuming shadcn/ui
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useForm } from "react-hook-form";
// import { Checkbox } from "@/components/ui/checkbox";
// import { createPurchaseOrder, getAllPoTypes, getAllPurchaseOrders, updatePurchaseOrder } from "@/state/purchaseOrderSlice";
// import { AppDispatch, RootState } from "@/state/store";
// import { useDispatch, useSelector } from "react-redux";
// import { getAllCustomers } from "@/state/customerSlice";
// import { getAllProductCategory } from "@/state/productCategorySlice";
// import { getAllVendors } from "@/state/vendorSlice";
// import { useLocation, useNavigate } from "react-router-dom";
// import { getAllUomMaster } from "@/state/uomMasterSlice";
// import { getAllGstMaster } from "@/state/gstMasterSlice";

// interface PurchaseOrderFormData {
//   id?: number | null;
//   poTypeId: string;
//   poDate: string;
//   vendorId: string;
//   taxId: string;
//   activeFlag: boolean;
//   purchaseOrderItemsDtl: purchaseOrderItemsDtl[];
// }

// interface purchaseOrderItemsDtl {
//   id?: number;
//   productCategoryId: string;
//   quantity: string;
//   unit: string;
//   price: string;
//   netAmount: string;
//   deliveryDate: string;
//   remarks: string;
//   activeFlag: boolean;
// }

// export function PurchaseOrderEntry() {

//   const { purchaseOrderList } = useSelector((state: RootState) => state.purchaseOrder);
//   const { purchaseOrderTypeList } = useSelector((state: RootState) => state.purchaseOrder);
//   const { productCategoryList } = useSelector((state: RootState) => state.productCategory);
//   const { vendorList } = useSelector((state: RootState) => state.vendor);
//   const { uomList } = useSelector((state: RootState) => state.uom);
//   const { gstList } = useSelector((state: RootState) => state.gst);
//   const [purchaseOrderItemsDtl, setPurchaseOrderItemsDtl]: any = useState([]);
//   const [newItem, setNewItem]: any = useState({});
//   const [editingIndex, setEditingIndex]: any = useState(null);
//   const [activeTab, setActiveTab] = useState("orderDetails");
//   const [taxType, setTaxType] = useState("IGST"); // IGST or SGST/CGST
//   const [isEditing, setIsEditing] = React.useState(false);
//   const [selectedPoTypeId, setSelectedPoTypeId] = useState<number | null>(null);
//   const [filteredProductCategories, setFilteredProductCategories] = useState<any[]>([]);
//   const [selectedProductCategory, setSelectedProductCategory] = useState<any[]>([]);
//   const [productCategories, setProductCategories] = useState([]); // from your API
//   const [selectedCategory, setSelectedCategory] = useState<string>(''); // productCategoryName
//   const [fabricCodes, setFabricCodes] = useState<any[]>([]);
//   const [selectedFabricCode, setSelectedFabricCode] = useState<string>('');
//   const [fabricQuality, setFabricQuality] = useState<string>('');
//   const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
//   const dispatch = useDispatch<AppDispatch>();
//   const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<PurchaseOrderFormData>();
//   const location = useLocation();
//   const purchaseOrderdetail = location.state?.purchaseOrderdetail;
//   const navigate = useNavigate();
//   console.log("purchaseOrderdetail from location state:", purchaseOrderdetail);
//   const [isDetailsValid, setIsDetailsValid] = useState(false);
//   const [isItemsValid, setIsItemsValid] = useState(false);
//   const selectedPoType = purchaseOrderTypeList.find(
//     (type: any) => type.id === selectedPoTypeId
//   );


//   useEffect(() => {
//     dispatch(getAllPurchaseOrders({}));
//     dispatch(getAllPoTypes({}));
//     dispatch(getAllVendors({}));
//     dispatch(getAllProductCategory({}));
//     dispatch(getAllUomMaster({}));
//     dispatch(getAllGstMaster({}));
//     console.log(productCategoryList)
//   }, [dispatch]);

//   useEffect(() => {
//     if (purchaseOrderdetail) {
//       reset({
//         id: purchaseOrderdetail.id ?? null,
//         poTypeId: purchaseOrderdetail.poTypeId ? String(purchaseOrderdetail.poTypeId) : "",
//         poDate: purchaseOrderdetail.poDate ? purchaseOrderdetail.poDate.slice(0, 10) : "",
//         vendorId: purchaseOrderdetail.vendorId ? String(purchaseOrderdetail.vendorId) : "",
//         taxId: purchaseOrderdetail.taxId ? String(purchaseOrderdetail.taxId) : "",
//         activeFlag: purchaseOrderdetail.activeFlag ?? true,
//         purchaseOrderItemsDtl: []
//       });
//       setSelectedPoTypeId(purchaseOrderdetail.poTypeId || null);
//       setPurchaseOrderItemsDtl(
//         (purchaseOrderdetail.purchaseOrderItemsDtl || []).map((item: any) => ({
//           ...item,
//           productCategoryId: String(item.productCategoryId ?? ""),
//           quantity: String(item.quantity ?? ""),
//           unit: String(item.unit ?? ""),
//           price: String(item.price ?? ""),
//           netAmount: String(item.netAmount ?? ""),
//           deliveryDate: item.deliveryDate ? item.deliveryDate.slice(0, 10) : "",
//           remarks: String(item.remarks ?? ""),
//           activeFlag: item.activeFlag ?? true,
//         }))
//       );
//       if (purchaseOrderdetail.purchaseOrderItemsDtl?.length > 0) {
//         setSelectedCategoryId(purchaseOrderdetail.purchaseOrderItemsDtl[0].productCategoryId);
//       }
//     }
//     // eslint-disable-next-line
//   }, [purchaseOrderdetail, reset]);

//   const handleChange = (e: any) => {
//     setNewItem({ ...newItem, [e.target.name]: e.target.value });
//   };

//   const calculateSummary = () => {
//     const netAmount = purchaseOrderItemsDtl.reduce((sum: number, item: { pricePerUnit: number; orderQty: number; }) => sum + item.pricePerUnit * item.orderQty, 0);
//     const gstAmount = purchaseOrderItemsDtl.reduce((sum: number, item: { pricePerUnit: number; orderQty: number; gst: number; }) => sum + (item.pricePerUnit * item.orderQty * item.gst) / 100, 0);
//     return { netAmount, gstAmount, finalAmount: netAmount + gstAmount };
//   };

//   const { netAmount } = calculateSummary();

//   const taxList = [
//     {
//       "id": 1,
//       "taxTypeName": "CGST/SGST",
//       "activeFlag": true
//     },
//     {
//       "id": 2,
//       "taxTypeName": "IGST",
//       "activeFlag": true
//     }
//   ]

//   const unitList = [
//     {
//       "id": 1,
//       "unitTypeName": "Nos",
//       "activeFlag": true
//     },
//     {
//       "id": 2,
//       "unitTypeName": "Meters",
//       "activeFlag": true
//     },
//     {
//       "id": 3,
//       "unitTypeName": "Kgs",
//       "activeFlag": true
//     }
//   ]

//   // const addItem = () => {
//   //   if (editingIndex !== null) {
//   //     const updatedItems = [...purchaseOrderItemsDtl];
//   //     updatedItems[editingIndex] = newItem;
//   //     setPurchaseOrderItemsDtl(updatedItems);
//   //     setEditingIndex(null);
//   //   } else {
//   //     setPurchaseOrderItemsDtl([...purchaseOrderItemsDtl, newItem]);
//   //   }
//   //   setNewItem({
//   //     productCategoryId: '',
//   //     quantity: '',
//   //     unit: '',
//   //     price: '',
//   //     netAmount: '',
//   //     deliveryDate: '',
//   //     remarks: '',
//   //     activeFlag: true,
//   //   });
//   // };

//   const editItem = (index: number) => {
//     setNewItem(purchaseOrderItemsDtl[index]);
//     setEditingIndex(index);
//   };

//   const deleteItem = (index: number) => {
//     setPurchaseOrderItemsDtl(purchaseOrderItemsDtl.filter((_: any, i: number) => i !== index));
//   };


//   const onSubmit = async (data: PurchaseOrderFormData) => {
//     const payload = {
//       ...data,
//       poTypeId: parseInt(data.poTypeId),
//       vendorId: parseInt(data.vendorId),
//       taxId: parseInt(data.taxId),
//       activeFlag: true,
//       purchaseOrderItemsDtl: purchaseOrderItemsDtl.map((item: { productCategoryId: string; quantity: string; price: string; netAmount: string; deliveryDate: string | number | Date; }) => ({
//         ...item,
//         productCategoryId: parseInt(item.productCategoryId),
//         quantity: parseFloat(item.quantity),
//         price: parseFloat(item.price),
//         netAmount: parseFloat(item.netAmount),
//         deliveryDate: new Date(item.deliveryDate).toISOString(),
//       })),
//     };
//     try {
//       if (purchaseOrderdetail?.id) {
//         // Edit mode - update
//         await dispatch(updatePurchaseOrder({ id: purchaseOrderdetail.id, data: payload })).unwrap();
//         // toast.success("Sales Order updated successfully!");
//       } else {
//         // Create mode - save
//         await dispatch(createPurchaseOrder(payload)).unwrap();
//         // toast.success("Sales Order saved successfully!");
//       }
//       navigate("/transaction/purchase-order-details");
//     } catch (err) {
//       // toast.error("Failed to save/update Sales Order");
//     }
//   };

//   // const handlePoTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//   //   const selectedId = parseInt(e.target.value);
//   //   setSelectedPoTypeId(selectedId);

//   //   const filtered = productCategoryList.filter((cat: any) => cat.poTypeId === selectedId);
//   //   console.log(filtered)
//   //   setFilteredProductCategories(filtered);
//   //   setSelectedProductCategory([]);
//   // };


//   // Check if mandatory fields are filled for Details tab
//   useEffect(() => {
//     if (activeTab === "orderDetails") {
//       const isValid = !!(
//         watch("poTypeId") &&
//         watch("poDate") &&
//         watch("vendorId") &&
//         watch("taxId")
//       );
//       setIsDetailsValid(isValid);
//     }
//   }, [activeTab, watch]);

//   // Check if items are valid
//   useEffect(() => {
//     const isValid = purchaseOrderItemsDtl.length > 0 &&
//       purchaseOrderItemsDtl.every((item: any) =>
//         item.productCategoryId &&
//         item.quantity &&
//         item.unit &&
//         item.price &&
//         item.netAmount
//       );
//     setIsItemsValid(isValid);
//   }, [purchaseOrderItemsDtl]);

//   // Update your handlePoTypeChange to reset fields when PO type changes
//   const handlePoTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedId = parseInt(e.target.value);
//     setSelectedPoTypeId(selectedId);
//     setSelectedCategoryId(null);
//     setSelectedCategory('');
//     setFabricCodes([]);
//     setSelectedFabricCode('');
//     setFabricQuality('');

//     // Reset new item when PO type changes
//     setNewItem({
//       productCategoryId: '',
//       quantity: '',
//       unit: '',
//       price: '',
//       netAmount: '',
//       deliveryDate: '',
//       remarks: '',
//       activeFlag: true,
//     });

//     const filtered = productCategoryList.filter((cat: any) => cat.poTypeId === selectedId);
//     setFilteredProductCategories(filtered);
//   };

//   // Render fields based on PO type
//   const renderProductFields = () => {
//     if (!selectedPoTypeId) return null;

//     const poType = purchaseOrderTypeList.find((type: any) => type.id === selectedPoTypeId)?.poTypeName;

//     switch (poType) {
//       case 'Yarn':
//         return (
//           <>
//             <div>
//               <label className="block text-sm font-medium text-secondary-700">Yarn Name</label>
//               <select
//                 name="productCategoryId"
//                 value={newItem.productCategoryId || ''}
//                 onChange={(e) => {
//                   const selectedId = e.target.value;
//                   const selectedItem = productCategoryList.find(
//                     (item: any) => item.id === Number(selectedId)
//                   );
//                   setNewItem({
//                     ...newItem,
//                     productCategoryId: selectedId,
//                     productCategoryName: selectedItem?.productCategoryName || ''
//                   });
//                 }}
//                 className="input mt-1"
//                 required
//               >
//                 <option value="">Select Yarn</option>
//                 {filteredProductCategories.map((item: any) => (
//                   <option key={item.id} value={item.id}>
//                     {item.productCategoryName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </>
//         );

//       case 'Woven Fabric':
//       case 'Knitted Fabric':
//         return (
//           <>
//             <div>
//               <label className="block text-sm font-medium text-secondary-700">Fabric Type</label>
//               <select
//                 name="fabricType"
//                 value={newItem.fabricType || ''}
//                 onChange={(e) => setNewItem({ ...newItem, fabricType: e.target.value })}
//                 className="input mt-1"
//                 required
//               >
//                 <option value="">Select Fabric Type</option>
//                 <option value="Greige">Greige</option>
//                 <option value="Finished">Finished</option>
//                 <option value="Finished Shade">Finished Shade</option>
//               </select>
//             </div>

//             {newItem.fabricType === 'Finished' && (
//               <div>
//                 <label className="block text-sm font-medium text-secondary-700">Greige Fabric Type</label>
//                 <input
//                   name="greigeFabricType"
//                   value={newItem.greigeFabricType || ''}
//                   onChange={(e) => setNewItem({ ...newItem, greigeFabricType: e.target.value })}
//                   className="input mt-1"
//                   required
//                 />
//               </div>
//             )}

//             {newItem.fabricType === 'Finished Shade' && (
//               <div>
//                 <label className="block text-sm font-medium text-secondary-700">Finished Fabric Type</label>
//                 <input
//                   name="finishedFabricType"
//                   value={newItem.finishedFabricType || ''}
//                   onChange={(e) => setNewItem({ ...newItem, finishedFabricType: e.target.value })}
//                   className="input mt-1"
//                   required
//                 />
//               </div>
//             )}

//             <div>
//               <label className="block text-sm font-medium text-secondary-700">Fabric Category</label>
//               <select
//                 name="fabricCategory"
//                 value={newItem.fabricCategory || ''}
//                 onChange={(e) => setNewItem({ ...newItem, fabricCategory: e.target.value })}
//                 className="input mt-1"
//                 required
//               >
//                 <option value="">Select Category</option>
//                 {filteredProductCategories.map((item: any) => (
//                   <option key={item.id} value={item.productCategoryName}>
//                     {item.productCategoryName}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-secondary-700">Fabric Name</label>
//               <input
//                 name="fabricName"
//                 value={newItem.fabricName || ''}
//                 onChange={(e) => setNewItem({ ...newItem, fabricName: e.target.value })}
//                 className="input mt-1"
//                 required
//               />
//             </div>
//           </>
//         );

//       default:
//         return (
//           <div>
//             <label className="block text-sm font-medium text-secondary-700">Product</label>
//             <select
//               name="productCategoryId"
//               value={newItem.productCategoryId || ''}
//               onChange={(e) => setNewItem({ ...newItem, productCategoryId: e.target.value })}
//               className="input mt-1"
//               required
//             >
//               <option value="">Select Product</option>
//               {filteredProductCategories.map((item: any) => (
//                 <option key={item.id} value={item.id}>
//                   {item.productCategoryName}
//                 </option>
//               ))}
//             </select>
//           </div>
//         );
//     }
//   };

//   // Update your addItem function to validate based on PO type
//   const addItem = () => {
//     let isValid = true;
//     const poType = purchaseOrderTypeList.find((type: any) => type.id === selectedPoTypeId)?.poTypeName;

//     // Validate based on PO type
//     if (poType === 'Yarn') {
//       isValid = !!newItem.productCategoryId;
//     }
//     else if (poType === 'Woven Fabric' || poType === 'Knitted Fabric') {
//       isValid = !!newItem.fabricType && !!newItem.fabricCategory && !!newItem.fabricName;

//       if (newItem.fabricType === 'Finished') {
//         isValid = isValid && !!newItem.greigeFabricType;
//       }
//       if (newItem.fabricType === 'Finished Shade') {
//         isValid = isValid && !!newItem.finishedFabricType;
//       }
//     }

//     if (!isValid) {
//       alert('Please fill all required fields');
//       return;
//     }

//     // Rest of your addItem logic...
//     if (editingIndex !== null) {
//       const updatedItems = [...purchaseOrderItemsDtl];
//       updatedItems[editingIndex] = newItem;
//       setPurchaseOrderItemsDtl(updatedItems);
//       setEditingIndex(null);
//     } else {
//       setPurchaseOrderItemsDtl([...purchaseOrderItemsDtl, newItem]);
//     }

//     // Reset form based on PO type
//     const resetItem: any = {
//       quantity: '',
//       unit: '',
//       price: '',
//       netAmount: '',
//       deliveryDate: '',
//       remarks: '',
//       activeFlag: true,
//     };

//     // Preserve the product reference if it's a dropdown
//     if (poType !== 'Yarn' && poType !== 'Woven Fabric' && poType !== 'Knitted Fabric') {
//       resetItem.productCategoryId = '';
//     }

//     setNewItem(resetItem);
//   };

//   // Update your Item Summary table to show appropriate columns
//   const renderItemSummaryColumns = () => {
//     if (!selectedPoTypeId) return null;

//     const poType = purchaseOrderTypeList.find((type: any) => type.id === selectedPoTypeId)?.poTypeName;

//     switch (poType) {
//       case 'Yarn':
//         return (
//           <>
//             <th className="border p-2">Yarn Name</th>
//             <th className="border p-2">Quantity</th>
//             <th className="border p-2">Unit</th>
//             <th className="border p-2">Price</th>
//             <th className="border p-2">Net Amount</th>
//           </>
//         );

//       case 'Woven Fabric':
//       case 'Knitted Fabric':
//         return (
//           <>
//             <th className="border p-2">Fabric Type</th>
//             <th className="border p-2">Fabric Category</th>
//             <th className="border p-2">Fabric Name</th>
//             <th className="border p-2">Quantity</th>
//             <th className="border p-2">Unit</th>
//             <th className="border p-2">Price</th>
//           </>
//         );

//       default:
//         return (
//           <>
//             <th className="border p-2">Product</th>
//             <th className="border p-2">Quantity</th>
//             <th className="border p-2">Unit</th>
//             <th className="border p-2">Price</th>
//           </>
//         );
//     }
//   };

//   // Update your Item Summary rows to show appropriate data
//   const renderItemSummaryRows = () => {
//     const selectedPoType = purchaseOrderTypeList.find(
//       (type: any) => type.id === selectedPoTypeId
//     );

//     return purchaseOrderItemsDtl?.map((item: any, index: any) => (
//       <tr key={index} className="border">
//         <td className="border p-2">{index + 1}</td>
//         {selectedPoType?.poTypeName === 'Yarn' && (
//           <td className="border p-2">
//             {productCategoryList.find((cat: any) => cat.id === Number(item.productCategoryId))?.productCategoryName}
//           </td>
//         )}
//         {selectedPoType?.poTypeName === 'Woven Fabric' && (
//           <>
//             <td className="border p-2">{item.fabricType}</td>
//             <td className="border p-2">{item.fabricCategory}</td>
//             <td className="border p-2">{item.fabricName}</td>
//           </>
//         )}
//         <td className="border p-2">{item.quantity}</td>
//         <td className="border p-2">
//           {uomList.find((uom: any) => uom.id === Number(item.unit))?.uomName}
//         </td>
//         <td className="border p-2">{item.price}</td>
//         {selectedPoType?.poTypeName === 'Yarn' && (
//           <td className="border p-2">{item.netAmount}</td>
//         )}

//         <td className="border p-2">{item.deliveryDate}</td>
//         <td className="border p-2">
//           <Button size="sm" onClick={() => editItem(index)}><Edit size={14} /></Button>
//           <Button size="sm" onClick={() => deleteItem(index)} variant="destructive"><Trash2 size={14} /></Button>
//         </td>
//       </tr>
//     ));
//   };


//   return (
//     <div className="mt-10 p-6 bg-white shadow-md rounded-lg mt-16">
//       {/* Title & Save Button */}
//       <div className="flex justify-between items-center border-b pb-4">
//         <h2 className="text-2xl font-semibold">Purchase Order</h2>
//         {activeTab === "itemDetails" && (
//           <Button
//             onClick={handleSubmit(onSubmit)}
//             className={`bg-green-600 hover:bg-green-700 text-white px-6 flex items-center`}
//             disabled={!isItemsValid}
//           >
//             <Save size={18} className="mr-2" />
//             {purchaseOrderdetail?.id ? "Update Purchase Order" : "Save Purchase Order"}
//           </Button>
//         )}
//       </div>

//       <div className="space-y-6">
//         {/* Tab Navigation */}
//         <div className="mb-8">
//           <div className="border-b border-gray-200">
//             <nav className="flex -mb-px">
//               <button
//                 onClick={() => setActiveTab('orderDetails')}
//                 className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm ${activeTab === 'orderDetails'
//                   ? 'border-red-500 text-red-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                   }`}
//               >
//                 <FileText className="w-4 h-4" />
//                 Order Details
//               </button>
//               <button
//                 onClick={() => {
//                   if (isDetailsValid) {
//                     setActiveTab('itemDetails');
//                   } else {
//                     alert('Please fill all required fields in Order Details');
//                   }
//                 }}
//                 className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm ${activeTab === 'itemDetails'
//                   ? 'border-red-500 text-red-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                   }`}
//               >
//                 <ShoppingCart className="w-4 h-4" />
//                 Item Details
//               </button>
//             </nav>
//           </div>
//         </div>

//         {/* Order Details */}
//         {activeTab === "orderDetails" && (
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <FileText size={20} /> Order Details
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="grid grid-cols-3 gap-8">
//               <div>
//                 <label className="block text-sm font-medium">Select PoType</label>
//                 <select {...register("poTypeId", { required: "Po Type is required" })} className="input mt-1" onChange={handlePoTypeChange}>
//                   <option value="">Select a PoType</option>
//                   {purchaseOrderTypeList?.map((poType: any) => (
//                     <option key={poType.id} value={poType.id}>{poType.poTypeName}</option>
//                   ))}
//                 </select>
//                 {errors.poTypeId && <p className="mt-1 text-sm text-red-600">{errors.poTypeId.message}</p>}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-secondary-700">PO Date</label>
//                 <input
//                   {...register('poDate', { required: 'Date is required' })}
//                   className="input mt-1" type="date"
//                 />
//                 {errors.poDate && (
//                   <p className="mt-1 text-sm text-red-600">{errors.poDate.message}</p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-secondary-700">Select a Vendor </label>
//                 <select {...register("vendorId", { required: "Vendor is required" })} className="input mt-1">
//                   <option value="">Select a Vendor</option>
//                   {vendorList?.map((vendor: any) => (
//                     <option key={vendor.id} value={vendor.id}>{vendor.vendorName}</option>
//                   ))}
//                 </select>
//                 {errors.vendorId && (
//                   <p className="mt-1 text-sm text-red-600">{errors.vendorId.message}</p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-secondary-700">Tax</label>
//                 <select {...register("taxId", { required: "Tax is required" })} className="input mt-1">
//                   <option value="">Select a Tax</option>
//                   {taxList?.map((tax: any) => (
//                     <option key={tax.id} value={tax.id}>{tax.taxTypeName}</option>
//                   ))}
//                 </select>
//                 {errors.taxId && (
//                   <p className="mt-1 text-sm text-red-600">{errors.taxId.message}</p>
//                 )}
//               </div>
//             </CardContent>
//             <div className="p-4 flex justify-end">
//               <Button
//                 onClick={() => {
//                   if (isDetailsValid) {
//                     setActiveTab("itemDetails");
//                   } else {
//                     alert('Please fill all required fields');
//                   }
//                 }}
//                 className="bg-blue-600 hover:bg-blue-700"
//               >
//                 Next
//               </Button>
//             </div>
//           </Card>
//         )}

//         {/* Item Details */}
//         {activeTab === "itemDetails" && (
//           <>
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <ShoppingCart size={20} /> Item Details
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-3 gap-6">
//                   {renderProductFields()}

//                   {/* Common fields for all PO types */}
//                   <div>
//                     <label className="block text-sm font-medium text-secondary-700">Quantity</label>
//                     <input
//                       placeholder="Quantity"
//                       value={newItem.quantity}
//                       onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
//                       className="input mt-1"
//                       type="number"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-secondary-700">Unit</label>
//                     <select
//                       value={newItem.unit}
//                       onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
//                       className="input mt-1"
//                       required
//                     >
//                       <option value="">Select Unit</option>
//                       {uomList?.map((unit: any) => (
//                         <option key={unit.id} value={unit.id}>{unit.uomName}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-secondary-700">Price</label>
//                     <input
//                       placeholder="Price"
//                       value={newItem.price}
//                       onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
//                       className="input mt-1"
//                       type="number"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-secondary-700">Net Amount</label>
//                     <input
//                       placeholder="Net Amount"
//                       value={newItem.netAmount}
//                       onChange={(e) => setNewItem({ ...newItem, netAmount: e.target.value })}
//                       className="input mt-1"
//                       type="number"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-secondary-700">Delivery Date</label>
//                     <input
//                       type="date"
//                       value={newItem.deliveryDate}
//                       onChange={(e) => setNewItem({ ...newItem, deliveryDate: e.target.value })}
//                       className="input mt-1"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-secondary-700">Remarks</label>
//                     <input
//                       placeholder="Remarks"
//                       value={newItem.remarks}
//                       onChange={(e) => setNewItem({ ...newItem, remarks: e.target.value })}
//                       className="input mt-1"
//                     />
//                   </div>
//                 </div>

//                 <Button
//                   onClick={addItem}
//                   className="mt-4 ml-auto flex items-center"
//                 >
//                   <Plus size={18} className="mr-2" />
//                   {editingIndex !== null ? "Update Item" : "Add Item"}
//                 </Button>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <ClipboardList size={20} /> Item Summary
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <table className="w-full border-collapse border border-gray-300 text-center">
//                   <thead className="bg-gray-100">
//                     <tr>
//                       <th className="border p-2">Sl.No</th>
//                       {renderItemSummaryColumns()}
//                       <th className="border p-2">Delivery Date</th>
//                       <th className="border p-2">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {renderItemSummaryRows()}
//                   </tbody>
//                 </table>
//               </CardContent>
//             </Card>
//           </>
//         )}
//       </div>
//     </div>
//   );

// };





// import React, { useEffect, useState } from "react";
// import { FileText, ShoppingCart, ClipboardList, Edit, Trash2, Save, Plus } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useForm } from "react-hook-form";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/state/store";
// import { useLocation, useNavigate } from "react-router-dom";
// import { createPurchaseOrder, getAllPoTypes, updatePurchaseOrder } from "@/state/purchaseOrderSlice";
// import { getAllVendors } from "@/state/vendorSlice";
// import { getAllUomMaster } from "@/state/uomMasterSlice";

// interface PurchaseOrderFormData {
//   id?: number | null;
//   poTypeId: string;
//   poDate: string;
//   vendorId: string;
//   taxId: string;
//   activeFlag: boolean;
//   purchaseOrderItemsDtl: PurchaseOrderItem[];
// }

// interface PurchaseOrderItem {
//   id?: number;
//   productName: string;
//   quantity: string;
//   unit: string;
//   price: string;
//   netAmount: string;
//   deliveryDate: string;
//   remarks: string;
//   activeFlag: boolean;
// }

// export function PurchaseOrderEntry() {
//   const { purchaseOrderTypeList } = useSelector((state: RootState) => state.purchaseOrder);
//   const { vendorList } = useSelector((state: RootState) => state.vendor);
//   const { uomList } = useSelector((state: RootState) => state.uom);
//   const [purchaseOrderItemsDtl, setPurchaseOrderItemsDtl] = useState<PurchaseOrderItem[]>([]);
//   const [newItem, setNewItem] = useState<Omit<PurchaseOrderItem, 'id'>>({
//     productName: '',
//     quantity: '',
//     unit: '',
//     price: '',
//     netAmount: '',
//     deliveryDate: '',
//     remarks: '',
//     activeFlag: true,
//   });
//   const [editingIndex, setEditingIndex] = useState<number | null>(null);
//   const [activeTab, setActiveTab] = useState("orderDetails");
//   const dispatch = useDispatch<AppDispatch>();
//   const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<PurchaseOrderFormData>();
//   const location = useLocation();
//   const purchaseOrderdetail = location.state?.purchaseOrderdetail;
//   const navigate = useNavigate();
//   const [isDetailsValid, setIsDetailsValid] = useState(false);
//   const [isItemsValid, setIsItemsValid] = useState(false);

//   useEffect(() => {
//     dispatch(getAllPoTypes({}));
//     dispatch(getAllVendors({}));
//     dispatch(getAllUomMaster({}));
//   }, [dispatch]);

//   useEffect(() => {
//     if (purchaseOrderdetail) {
//       reset({
//         id: purchaseOrderdetail.id ?? null,
//         poTypeId: purchaseOrderdetail.poTypeId ? String(purchaseOrderdetail.poTypeId) : "",
//         poDate: purchaseOrderdetail.poDate ? purchaseOrderdetail.poDate.slice(0, 10) : "",
//         vendorId: purchaseOrderdetail.vendorId ? String(purchaseOrderdetail.vendorId) : "",
//         taxId: purchaseOrderdetail.taxId ? String(purchaseOrderdetail.taxId) : "",
//         activeFlag: purchaseOrderdetail.activeFlag ?? true,
//       });
//       setPurchaseOrderItemsDtl(purchaseOrderdetail.purchaseOrderItemsDtl || []);
//     }
//   }, [purchaseOrderdetail, reset]);

//   // Validate order details tab
//   useEffect(() => {
//     const subscription = watch((value) => {
//       setIsDetailsValid(!!(
//         value.poTypeId &&
//         value.poDate &&
//         value.vendorId &&
//         value.taxId
//       ));
//     });
//     return () => subscription.unsubscribe();
//   }, [watch]);

//   // Validate items details tab
//   useEffect(() => {
//     setIsItemsValid(purchaseOrderItemsDtl.length > 0);
//   }, [purchaseOrderItemsDtl]);

//   const handleNextClick = () => {
//     if (isDetailsValid) {
//       setActiveTab("itemDetails");
//     } else {
//       alert("Please fill all required fields in Order Details");
//     }
//   };

//   const addItem = () => {
//     if (!newItem.productName || !newItem.quantity || !newItem.unit || !newItem.price) {
//       alert("Please fill all required item fields");
//       return;
//     }

//     if (editingIndex !== null) {
//       const updatedItems = [...purchaseOrderItemsDtl];
//       updatedItems[editingIndex] = newItem as PurchaseOrderItem;
//       setPurchaseOrderItemsDtl(updatedItems);
//       setEditingIndex(null);
//     } else {
//       setPurchaseOrderItemsDtl([...purchaseOrderItemsDtl, newItem as PurchaseOrderItem]);
//     }

//     setNewItem({
//       productName: '',
//       quantity: '',
//       unit: '',
//       price: '',
//       netAmount: '',
//       deliveryDate: '',
//       remarks: '',
//       activeFlag: true,
//     });
//   };

//   const editItem = (index: number) => {
//     setNewItem(purchaseOrderItemsDtl[index]);
//     setEditingIndex(index);
//   };

//   const deleteItem = (index: number) => {
//     setPurchaseOrderItemsDtl(purchaseOrderItemsDtl.filter((_, i) => i !== index));
//   };

//   const onSubmit = async (data: PurchaseOrderFormData) => {
//     const payload = {
//       ...data,
//       poTypeId: parseInt(data.poTypeId),
//       vendorId: parseInt(data.vendorId),
//       taxId: parseInt(data.taxId),
//       activeFlag: true,
//       purchaseOrderItemsDtl: purchaseOrderItemsDtl.map(item => ({
//         ...item,
//         quantity: parseFloat(item.quantity),
//         price: parseFloat(item.price),
//         netAmount: parseFloat(item.netAmount),
//         deliveryDate: item.deliveryDate ? new Date(item.deliveryDate).toISOString() : '',
//       })),
//     };

//     try {
//       if (purchaseOrderdetail?.id) {
//         await dispatch(updatePurchaseOrder({ id: purchaseOrderdetail.id, data: payload })).unwrap();
//       } else {
//         await dispatch(createPurchaseOrder(payload)).unwrap();
//       }
//       navigate("/transaction/purchase-order-details");
//     } catch (err) {
//       console.error("Failed to save purchase order:", err);
//     }
//   };

//   return (
//     <div className="mt-10 p-6 bg-white shadow-md rounded-lg">
//       <div className="flex justify-between items-center border-b pb-4">
//         <h2 className="text-2xl font-semibold">Purchase Order</h2>
//         {activeTab === "itemDetails" && (
//           <Button
//             onClick={handleSubmit(onSubmit)}
//             className="bg-green-600 hover:bg-green-700 text-white px-6 flex items-center"
//             disabled={!isItemsValid}
//           >
//             <Save size={18} className="mr-2" />
//             {purchaseOrderdetail?.id ? "Update Purchase Order" : "Save Purchase Order"}
//           </Button>
//         )}
//       </div>

//       <div className="space-y-6">
//         <div className="mb-8">
//           <div className="border-b border-gray-200">
//             <nav className="flex -mb-px">
//               <button
//                 onClick={() => setActiveTab('orderDetails')}
//                 className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm ${activeTab === 'orderDetails'
//                   ? 'border-red-500 text-red-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                   }`}
//               >
//                 <FileText className="w-4 h-4" />
//                 Order Details
//               </button>
//               <button
//                 onClick={handleNextClick}
//                 className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm ${activeTab === 'itemDetails'
//                   ? 'border-red-500 text-red-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                   }`}
//               >
//                 <ShoppingCart className="w-4 h-4" />
//                 Item Details
//               </button>
//             </nav>
//           </div>
//         </div>

//         {activeTab === "orderDetails" && (
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <FileText size={20} /> Order Details
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="grid grid-cols-3 gap-8">
//               <div>
//                 <label className="block text-sm font-medium">PO Type <span className="text-red-500">*</span></label>
//                 <select
//                   {...register("poTypeId", { required: "PO Type is required" })}
//                   className={`input mt-1 ${errors.poTypeId ? 'border-red-500' : ''}`}
//                 >
//                   <option value="">Select a PO Type</option>
//                   {purchaseOrderTypeList?.map((poType: any) => (
//                     <option key={poType.id} value={poType.id}>{poType.poTypeName}</option>
//                   ))}
//                 </select>
//                 {errors.poTypeId && <p className="mt-1 text-sm text-red-600">{errors.poTypeId.message}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium">PO Date <span className="text-red-500">*</span></label>
//                 <input
//                   {...register('poDate', { required: "PO Date is required" })}
//                   type="date"
//                   className={`input mt-1 ${errors.poDate ? 'border-red-500' : ''}`}
//                 />
//                 {errors.poDate && <p className="mt-1 text-sm text-red-600">{errors.poDate.message}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium">Vendor <span className="text-red-500">*</span></label>
//                 <select
//                   {...register("vendorId", { required: "Vendor is required" })}
//                   className={`input mt-1 ${errors.vendorId ? 'border-red-500' : ''}`}
//                 >
//                   <option value="">Select a Vendor</option>
//                   {vendorList?.map((vendor: any) => (
//                     <option key={vendor.id} value={vendor.id}>{vendor.vendorName}</option>
//                   ))}
//                 </select>
//                 {errors.vendorId && <p className="mt-1 text-sm text-red-600">{errors.vendorId.message}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium">Tax <span className="text-red-500">*</span></label>
//                 <select
//                   {...register("taxId", { required: "Tax is required" })}
//                   className={`input mt-1 ${errors.taxId ? 'border-red-500' : ''}`}
//                 >
//                   <option value="">Select Tax</option>
//                   <option value="1">CGST/SGST</option>
//                   <option value="2">IGST</option>
//                 </select>
//                 {errors.taxId && <p className="mt-1 text-sm text-red-600">{errors.taxId.message}</p>}
//               </div>
//             </CardContent>
//             <div className="p-4 flex justify-end">
//               <Button
//                 onClick={handleNextClick}
//                 className="bg-blue-600 hover:bg-blue-700"
//               >
//                 Next
//               </Button>
//             </div>
//           </Card>
//         )}

//         {activeTab === "itemDetails" && (
//           <>
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center justify-between gap-2">
//                   <div className="flex items-center gap-2">
//                     <ShoppingCart size={20} /> Item Details
//                   </div>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-3 gap-6">

//                   <div>
//                     <label className="block text-sm font-medium">Quantity <span className="text-red-500">*</span></label>
//                     <input
//                       type="number"
//                       value={newItem.quantity}
//                       onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
//                       className="input mt-1"
//                       placeholder="Quantity"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium">Unit <span className="text-red-500">*</span></label>
//                     <select
//                       value={newItem.unit}
//                       onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
//                       className="input mt-1"
//                     >
//                       <option value="">Select Unit</option>
//                       {uomList?.map((unit: any) => (
//                         <option key={unit.id} value={unit.id}>{unit.uomName}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium">Price <span className="text-red-500">*</span></label>
//                     <input
//                       type="number"
//                       value={newItem.price}
//                       onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
//                       className="input mt-1"
//                       placeholder="Price"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium">Net Amount</label>
//                     <input
//                       type="number"
//                       value={newItem.netAmount}
//                       onChange={(e) => setNewItem({ ...newItem, netAmount: e.target.value })}
//                       className="input mt-1"
//                       placeholder="Net Amount"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium">Delivery Date</label>
//                     <input
//                       type="date"
//                       value={newItem.deliveryDate}
//                       onChange={(e) => setNewItem({ ...newItem, deliveryDate: e.target.value })}
//                       className="input mt-1"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium">Remarks</label>
//                     <input
//                       value={newItem.remarks}
//                       onChange={(e) => setNewItem({ ...newItem, remarks: e.target.value })}
//                       className="input mt-1"
//                       placeholder="Remarks"
//                     />
//                   </div>
//                 </div>

//                 <Button
//                   onClick={addItem}
//                   className="mt-4 ml-auto flex items-center"
//                 >
//                   <Plus size={18} className="mr-2" />
//                   {editingIndex !== null ? "Update Item" : "Add Item"}
//                 </Button>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <ClipboardList size={20} /> Item Summary
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <table className="w-full border-collapse border border-gray-300 text-center">
//                   <thead className="bg-gray-100">
//                     <tr>
//                       <th className="border p-2">Sl.No</th>
//                       <th className="border p-2">Product Name</th>
//                       <th className="border p-2">Quantity</th>
//                       <th className="border p-2">Unit</th>
//                       <th className="border p-2">Price</th>
//                       <th className="border p-2">Net Amount</th>
//                       <th className="border p-2">Delivery Date</th>
//                       <th className="border p-2">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {purchaseOrderItemsDtl.map((item, index) => (
//                       <tr key={index} className="border">
//                         <td className="border p-2">{index + 1}</td>
//                         <td className="border p-2">{item.productName}</td>
//                         <td className="border p-2">{item.quantity}</td>
//                         <td className="border p-2">
//                           {uomList.find((uom: any) => uom.id === Number(item.unit))?.uomName}
//                         </td>
//                         <td className="border p-2">{item.price}</td>
//                         <td className="border p-2">{item.netAmount}</td>
//                         <td className="border p-2">{item.deliveryDate}</td>
//                         <td className="border p-2">
//                           <Button size="sm" onClick={() => editItem(index)} className="mr-2">
//                             <Edit size={14} />
//                           </Button>
//                           <Button size="sm" onClick={() => deleteItem(index)} variant="destructive">
//                             <Trash2 size={14} />
//                           </Button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </CardContent>
//             </Card>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }



// import React, { useEffect, useState } from "react";
// import { FileText, ShoppingCart, ClipboardList, Edit, Trash2, Save, Plus } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useForm } from "react-hook-form";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/state/store";
// import { useLocation, useNavigate } from "react-router-dom";
// import { createPurchaseOrder, getAllPoTypes, updatePurchaseOrder } from "@/state/purchaseOrderSlice";
// import { getAllVendors } from "@/state/vendorSlice";
// import { getAllUomMaster } from "@/state/uomMasterSlice";
// import { getAllYarnMasters } from "@/state/yarnSlice";
// import { getAllFabricMasters } from "@/state/fabricMasterSlice";
// import { getAllFabricTypes } from "@/state/fabricTypeSlice";

// interface PurchaseOrderFormData {
//   id?: number | null;
//   poTypeId: string;
//   poDate: string;
//   vendorId: string;
//   taxId: string;
//   activeFlag: boolean;
//   purchaseOrderItemsDtl: PurchaseOrderItem[];
// }

// interface PurchaseOrderItem {
//   id?: number;
//   productType?: string; // 'yarn' or 'fabric'
//   yarnId?: string; // for yarn items
//   fabricType?: string; // 'greige', 'finished', 'finished-shade'
//   fabricCategoryId?: string; // for fabric items
//   fabricId?: string; // for fabric items
//   // productName: string;
//   quantity: string;
//   unit: string;
//   price: string;
//   netAmount: string;
//   deliveryDate: string;
//   remarks: string;
//   activeFlag: boolean;
// }

// export function PurchaseOrderEntry() {
//   const { purchaseOrderTypeList } = useSelector((state: RootState) => state.purchaseOrder);
//   const { vendorList } = useSelector((state: RootState) => state.vendor);
//   const { uomList } = useSelector((state: RootState) => state.uom);
//   const { yarnList } = useSelector((state: RootState) => state.yarn);
//   const { fabricTypeList } = useSelector((state: RootState) => state.fabricType);
//   const { fabricCategoryList } = useSelector((state: RootState) => state.fabricCategoty);
//   const { fabricMasterList } = useSelector((state: RootState) => state.fabricMaster);
//   const [purchaseOrderItemsDtl, setPurchaseOrderItemsDtl] = useState<PurchaseOrderItem[]>([]);
//   const [newItem, setNewItem] = useState<Omit<PurchaseOrderItem, 'id'>>({
//     // productName: '',
//     quantity: '',
//     unit: '',
//     price: '',
//     netAmount: '',
//     deliveryDate: '',
//     remarks: '',
//     activeFlag: true,
//   });
//   const [editingIndex, setEditingIndex] = useState<number | null>(null);
//   const [activeTab, setActiveTab] = useState("orderDetails");
//   const dispatch = useDispatch<AppDispatch>();
//   const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<PurchaseOrderFormData>();
//   const location = useLocation();
//   const purchaseOrderdetail = location.state?.order;
//   const navigate = useNavigate();
//   console.log("salesOrderdetail from location state:", purchaseOrderdetail);

//   const [isDetailsValid, setIsDetailsValid] = useState(false);
//   const [isItemsValid, setIsItemsValid] = useState(false);

//   const selectedPoType = watch("poTypeId");
//   // const selectedFabricType = newItem.fabricType;
//   const [selectedFabricType, setSelectedFabricType] = useState<string>('1');



//   useEffect(() => {
//     dispatch(getAllPoTypes({}));
//     dispatch(getAllVendors({}));
//     dispatch(getAllUomMaster({}));
//     dispatch(getAllYarnMasters({}));
//     dispatch(getAllFabricMasters({}));
//     dispatch(getAllFabricTypes({}));
//   }, [dispatch]);

//   useEffect(() => {
//     if (purchaseOrderdetail) {
//       reset({
//         id: purchaseOrderdetail.id ?? null,
//         poTypeId: purchaseOrderdetail.poTypeId ? String(purchaseOrderdetail.poTypeId) : "",
//         poDate: purchaseOrderdetail.poDate ? purchaseOrderdetail.poDate.slice(0, 10) : "",
//         vendorId: purchaseOrderdetail.vendorId ? String(purchaseOrderdetail.vendorId) : "",
//         taxId: purchaseOrderdetail.taxId ? String(purchaseOrderdetail.taxId) : "",
//         activeFlag: purchaseOrderdetail.activeFlag ?? true,
//       });
//       setPurchaseOrderItemsDtl(purchaseOrderdetail.purchaseOrderItemsDtl || []);
//     }
//   }, [purchaseOrderdetail, reset]);

//   // Validate order details tab
//   useEffect(() => {
//     const subscription = watch((value) => {
//       setIsDetailsValid(!!(
//         value.poTypeId &&
//         value.poDate &&
//         value.vendorId &&
//         value.taxId
//       ));
//     });
//     return () => subscription.unsubscribe();
//   }, [watch]);

//   // Validate items details tab
//   useEffect(() => {
//     setIsItemsValid(purchaseOrderItemsDtl.length > 0);
//   }, [purchaseOrderItemsDtl]);

//   // Reset item form when PO type changes
//   useEffect(() => {
//     setNewItem({
//       // productName: '',
//       quantity: '',
//       unit: '',
//       price: '',
//       netAmount: '',
//       deliveryDate: '',
//       remarks: '',
//       activeFlag: true,
//     });
//   }, [selectedPoType]);

//   const handleNextClick = () => {
//     if (isDetailsValid) {
//       setActiveTab("itemDetails");
//     } else {
//       alert("Please fill all required fields in Order Details");
//     }
//   };

//   const addItem = () => {
//     // Common validation for all item types
//     if (!newItem.quantity || !newItem.unit || !newItem.price) {
//       alert("Please fill all required item fields");
//       return;
//     }

//     // Specific validation based on PO type
//     if (selectedPoType === "1") { // Yarn
//       if (!newItem.yarnId) {
//         alert("Please select a Yarn");
//         return;
//       }
//       // Set product name from yarn
//       const selectedYarn = yarnList.find((y: any) => y.id === Number(newItem.yarnId));
//       // newItem.productName = selectedYarn?.yarnName || '';
//       newItem.productType = 'yarn';
//     } else if (selectedPoType === "2") { // Woven Fabric
//       if (!newItem.fabricType || !newItem.fabricCategoryId) {
//         alert("Please fill all fabric fields");
//         return;
//       }
//       // Set product name from fabric
//       const selectedFabric = fabricMasterList.find((f: any) => f.id === Number(newItem.fabricId));
//       // newItem.productName = selectedFabric?.fabricName || '';
//       newItem.productType = 'fabric';
//     }

//     if (editingIndex !== null) {
//       const updatedItems = [...purchaseOrderItemsDtl];
//       updatedItems[editingIndex] = newItem as PurchaseOrderItem;
//       setPurchaseOrderItemsDtl(updatedItems);
//       setEditingIndex(null);
//     } else {
//       setPurchaseOrderItemsDtl([...purchaseOrderItemsDtl, newItem as PurchaseOrderItem]);
//     }

//     // Reset the form
//     setNewItem({
//       // productName: '',
//       quantity: '',
//       unit: '',
//       price: '',
//       netAmount: '',
//       deliveryDate: '',
//       remarks: '',
//       activeFlag: true,
//     });
//   };

//   const editItem = (index: number) => {
//     setNewItem(purchaseOrderItemsDtl[index]);
//     setEditingIndex(index);
//   };

//   const deleteItem = (index: number) => {
//     setPurchaseOrderItemsDtl(purchaseOrderItemsDtl.filter((_, i) => i !== index));
//   };

//   const onSubmit = async (data: PurchaseOrderFormData) => {
//     const payload = {
//       ...data,
//       poTypeId: parseInt(data.poTypeId),
//       vendorId: parseInt(data.vendorId),
//       taxId: parseInt(data.taxId),
//       activeFlag: true,
//       purchaseOrderItemsDtl: purchaseOrderItemsDtl.map(item => ({
//         ...item,
//         productCategoryId: 1,
//         quantity: parseFloat(item.quantity),
//         price: parseFloat(item.price),
//         netAmount: parseFloat(item.netAmount),
//         deliveryDate: item.deliveryDate ? new Date(item.deliveryDate).toISOString() : '',
//       })),
//     };

//     try {
//       if (purchaseOrderdetail?.id) {
//         await dispatch(updatePurchaseOrder({ id: purchaseOrderdetail.id, data: payload })).unwrap();
//       } else {
//         await dispatch(createPurchaseOrder(payload)).unwrap();
//       }
//       navigate("/transaction/purchase-order-details");
//     } catch (err) {
//       console.error("Failed to save purchase order:", err);
//     }
//   };

//   // Filter fabrics based on type
//   // const getFilteredFabrics = () => {
//   //   if (!selectedFabricType) return [];

//   //   if (selectedFabricType === 'greige') {
//   //     return fabricMasterList.filter((fabric: any) => fabric.fabricType === 'greige');
//   //   } else if (selectedFabricType === 'finished') {
//   //     return fabricMasterList.filter((fabric: any) => fabric.fabricType === 'finished');
//   //   } else if (selectedFabricType === 'finished-shade') {
//   //     return fabricMasterList.filter((fabric: any) => fabric.fabricType === 'finished-shade');
//   //   }
//   //   return [];
//   // };

//   const getFilteredFabrics = () => {
//     if (!selectedFabricType) return [];

//     if (selectedFabricType === 'greige') {
//       // Don't show fabrics for greige selection
//       return [];
//     } else if (selectedFabricType === 'finished') {
//       // Show greige fabrics for finished selection
//       return fabricMasterList.filter((fabric: any) => fabric.fabricTypeId === 1);
//     } else if (selectedFabricType === 'finished-shade') {
//       // Show finished fabrics for finished-shade selection
//       return fabricMasterList.filter((fabric: any) => fabric.fabricTypeId === 2);
//     }
//     return [];
//   };

//   const [selectedGreige, setSelectedGreige] = useState<string>('');
//   const [selectedFinished, setSelectedFinished] = useState<string>('');

//   const handleFabricTypeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     // alert(e.target.value);
//     const value = e.target.value;
//     setSelectedFabricType(value);
//     // setValue('fabricType', value);
//     setSelectedGreige('');
//     setSelectedFinished('');

//     // Convert to number if needed
//     const numericValue = parseInt(value, 10);

//     if (numericValue === 1 || numericValue === 2 || numericValue === 3) {
//       await dispatch(getAllFabricMasters({ id: numericValue }));
//     }
//   };


//   return (
//     <div className="mt-10 p-6 bg-white shadow-md rounded-lg">
//       <div className="flex justify-between items-center border-b pb-4">
//         <h2 className="text-2xl font-semibold">Purchase Order</h2>
//         {activeTab === "itemDetails" && (
//           <Button
//             onClick={handleSubmit(onSubmit)}
//             className="bg-green-600 hover:bg-green-700 text-white px-6 flex items-center"
//             disabled={!isItemsValid}
//           >
//             <Save size={18} className="mr-2" />
//             {purchaseOrderdetail?.id ? "Update Purchase Order" : "Save Purchase Order"}
//           </Button>
//         )}
//       </div>

//       <div className="space-y-6">
//         <div className="mb-8">
//           <div className="border-b border-gray-200">
//             <nav className="flex -mb-px">
//               <button
//                 onClick={() => setActiveTab('orderDetails')}
//                 className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm ${activeTab === 'orderDetails'
//                   ? 'border-red-500 text-red-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                   }`}
//               >
//                 <FileText className="w-4 h-4" />
//                 Order Details
//               </button>
//               <button
//                 onClick={handleNextClick}
//                 className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm ${activeTab === 'itemDetails'
//                   ? 'border-red-500 text-red-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                   }`}
//               >
//                 <ShoppingCart className="w-4 h-4" />
//                 Item Details
//               </button>
//             </nav>
//           </div>
//         </div>

//         {activeTab === "orderDetails" && (
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <FileText size={20} /> Order Details
//               </CardTitle>
//             </CardHeader>
// <CardContent className="grid grid-cols-3 gap-8">
//   <div>
//     <label className="block text-sm font-medium">PO Type <span className="text-red-500">*</span></label>
//     <select
//       {...register("poTypeId", { required: "PO Type is required" })}
//       className={`input mt-1 ${errors.poTypeId ? 'border-red-500' : ''}`}
//     >
//       <option value="">Select a PO Type</option>
//       {purchaseOrderTypeList?.map((poType: any) => (
//         <option key={poType.id} value={poType.id}>{poType.poTypeName}</option>
//       ))}
//     </select>
//     {errors.poTypeId && <p className="mt-1 text-sm text-red-600">{errors.poTypeId.message}</p>}
//   </div>

//   <div>
//     <label className="block text-sm font-medium">PO Date <span className="text-red-500">*</span></label>
//     <input
//       {...register('poDate', { required: "PO Date is required" })}
//       type="date"
//       className={`input mt-1 ${errors.poDate ? 'border-red-500' : ''}`}
//     />
//     {errors.poDate && <p className="mt-1 text-sm text-red-600">{errors.poDate.message}</p>}
//   </div>

//   <div>
//     <label className="block text-sm font-medium">Vendor <span className="text-red-500">*</span></label>
//     <select
//       {...register("vendorId", { required: "Vendor is required" })}
//       className={`input mt-1 ${errors.vendorId ? 'border-red-500' : ''}`}
//     >
//       <option value="">Select a Vendor</option>
//       {vendorList?.map((vendor: any) => (
//         <option key={vendor.id} value={vendor.id}>{vendor.vendorName}</option>
//       ))}
//     </select>
//     {errors.vendorId && <p className="mt-1 text-sm text-red-600">{errors.vendorId.message}</p>}
//   </div>

//   <div>
//     <label className="block text-sm font-medium">Tax <span className="text-red-500">*</span></label>
//     <select
//       {...register("taxId", { required: "Tax is required" })}
//       className={`input mt-1 ${errors.taxId ? 'border-red-500' : ''}`}
//     >
//       <option value="">Select Tax</option>
//       <option value="1">CGST/SGST</option>
//       <option value="2">IGST</option>
//     </select>
//     {errors.taxId && <p className="mt-1 text-sm text-red-600">{errors.taxId.message}</p>}
//   </div>
// </CardContent>
//             <div className="p-4 flex justify-end">
//               <Button
//                 onClick={handleNextClick}
//                 className="bg-blue-600 hover:bg-blue-700"
//               >
//                 Next
//               </Button>
//             </div>
//           </Card>
//         )}

//         {activeTab === "itemDetails" && (
//           <>
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center justify-between gap-2">
//                   <div className="flex items-center gap-2">
//                     <ShoppingCart size={20} /> Item Details
//                   </div>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-3 gap-6">
//                   {/* Dynamic fields based on PO Type */}
//                   {selectedPoType === "1" && ( // Yarn
//                     <div>
//                       <label className="block text-sm font-medium">Yarn Name <span className="text-red-500">*</span></label>
//                       <select
//                         value={newItem.yarnId || ''}
//                         onChange={(e) => setNewItem({ ...newItem, yarnId: e.target.value })}
//                         className="input mt-1"
//                       >
//                         <option value="">Select Yarn</option>
//                         {yarnList?.map((yarn: any) => (
//                           <option key={yarn.id} value={yarn.id}>{yarn.yarnName}</option>
//                         ))}
//                       </select>
//                     </div>
//                   )}

//                   {selectedPoType === "2" && ( // Woven Fabric
//                     <>
//                       <div>
//                         <label className="block">Fabric Type <span className="text-red-600">*</span>
//                         </label>
//                         <select
//                           // value={newItem.fabricType || ''}
//                           onChange={(e: any) => {
//                             const selectedValue = e.target.value;
//                             handleFabricTypeChange(e); // Call your fabric type change handler
//                             setNewItem({
//                               ...newItem,
//                               fabricType: selectedValue,
//                               fabricId: '' // Reset fabric selection when type changes
//                             });
//                           }}
//                           className="input mt-1"
//                         >
//                           <option value="">Select a Fabric Type</option>
//                           {fabricTypeList?.map((fabricType: any) => (
//                             <option key={fabricType.id} value={fabricType.id}>
//                               {fabricType.fabricTypeName}
//                             </option>
//                           ))}
//                         </select>
//                         {/* {errors.fabricType && <p className="text-red-500 text-sm">{errors.fabricType.message}</p>} */}
//                       </div>

//                       {selectedFabricType === '2' && (
//                         <div>
//                           <label className="block">Select Greige</label>
//                           <select
//                             // value={selectedGreige}
//                             onChange={(e) => setNewItem({ ...newItem, fabricId: e.target.value })}
//                             className="input mt-1"
//                           >
//                             <option value="">Select Greige</option>
//                             {fabricMasterList?.map((item: any) => (
//                               <option key={item.id} value={item.id}> {item.fabricName} ({item.fabricCode})</option>
//                             ))}
//                           </select>
//                         </div>
//                       )}

//                       {selectedFabricType === '3' && (
//                         <div>
//                           <label className="block">Select Finished</label>
//                           <select
//                             // value={selectedFinished}
//                             onChange={(e) => setNewItem({ ...newItem, fabricId: e.target.value })}
//                             className="input mt-1"
//                           >
//                             <option value="">Select Finished</option>
//                             {fabricMasterList?.map((item: any) => (
//                               <option key={item.id} value={item.id}> {item.fabricName} ({item.fabricCode})</option>
//                             ))}
//                           </select>
//                         </div>
//                       )}

//                       {/* {selectedFabricType && ( */}
//                       <div>
//                         <label className="block text-sm font-medium">Fabric Category <span className="text-red-500">*</span></label>
//                         <select
//                           value={newItem.fabricCategoryId || ''}
//                           onChange={(e) => setNewItem({
//                             ...newItem,
//                             fabricCategoryId: e.target.value,
//                             fabricId: '' // Reset fabric selection when category changes
//                           })}
//                           className="input mt-1"
//                         >
//                           <option value="">Select Category</option>
//                           {fabricCategoryList?.map((item: any) => (
//                             <option key={item.id} value={item.id}> {item.fabricCategoryName}</option>
//                           ))}
//                         </select>
//                       </div>
//                     </>
//                   )}

//                   {/* Common fields for all item types */}
//                   <div>
//                     <label className="block text-sm font-medium">Quantity <span className="text-red-500">*</span></label>
//                     <input
//                       type="number"
//                       value={newItem.quantity}
//                       onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
//                       className="input mt-1"
//                       placeholder="Quantity"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium">Unit <span className="text-red-500">*</span></label>
//                     <select
//                       value={newItem.unit}
//                       onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
//                       className="input mt-1"
//                     >
//                       <option value="">Select Unit</option>
//                       {uomList?.map((unit: any) => (
//                         <option key={unit.id} value={unit.id}>{unit.uomName}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium">Price <span className="text-red-500">*</span></label>
//                     <input
//                       type="number"
//                       value={newItem.price}
//                       onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
//                       className="input mt-1"
//                       placeholder="Price"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium">Net Amount</label>
//                     <input
//                       type="number"
//                       value={newItem.netAmount}
//                       onChange={(e) => setNewItem({ ...newItem, netAmount: e.target.value })}
//                       className="input mt-1"
//                       placeholder="Net Amount"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium">Delivery Date</label>
//                     <input
//                       type="date"
//                       value={newItem.deliveryDate}
//                       onChange={(e) => setNewItem({ ...newItem, deliveryDate: e.target.value })}
//                       className="input mt-1"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium">Remarks</label>
//                     <input
//                       value={newItem.remarks}
//                       onChange={(e) => setNewItem({ ...newItem, remarks: e.target.value })}
//                       className="input mt-1"
//                       placeholder="Remarks"
//                     />
//                   </div>
//                 </div>

//                 <Button
//                   onClick={addItem}
//                   className="mt-4 ml-auto flex items-center"
//                 >
//                   <Plus size={18} className="mr-2" />
//                   {editingIndex !== null ? "Update Item" : "Add Item"}
//                 </Button>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <ClipboardList size={20} /> Item Summary
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <table className="w-full border-collapse border border-gray-300 text-center">
//                   <thead className="bg-gray-100">
//                     <tr>
//                       <th className="border p-2">Sl.No</th>
//                       <th className="border p-2">Product Type</th>
//                       {/* <th className="border p-2">Product Name</th> */}
//                       <th className="border p-2">Quantity</th>
//                       <th className="border p-2">Unit</th>
//                       <th className="border p-2">Price</th>
//                       <th className="border p-2">Net Amount</th>
//                       <th className="border p-2">Delivery Date</th>
//                       <th className="border p-2">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {purchaseOrderItemsDtl.map((item, index) => (
//                       <tr key={index} className="border">
//                         <td className="border p-2">{index + 1}</td>
//                         <td className="border p-2">
//                           {item.productType === 'yarn' ? 'Yarn' :
//                             item.fabricType === 'greige' ? 'Greige Fabric' :
//                               item.fabricType === 'finished' ? 'Finished Fabric' : 'Finished Shade Fabric'}
//                         </td>
//                         {/* <td className="border p-2">{item.productName}</td> */}
//                         <td className="border p-2">{item.quantity}</td>
//                         <td className="border p-2">
//                           {uomList.find((uom: any) => uom.id === Number(item.unit))?.uomName}
//                         </td>
//                         <td className="border p-2">{item.price}</td>
//                         <td className="border p-2">{item.netAmount}</td>
//                         <td className="border p-2">{item.deliveryDate}</td>
//                         <td className="border p-2">
//                           <Button size="sm" onClick={() => editItem(index)} className="mr-2">
//                             <Edit size={14} />
//                           </Button>
//                           <Button size="sm" onClick={() => deleteItem(index)} variant="destructive">
//                             <Trash2 size={14} />
//                           </Button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </CardContent>
//             </Card>
//           </>
//         )}
//       </div>
//     </div >
//   );
// }





import React, { useEffect, useState } from "react";
import { FileText, ShoppingCart, ClipboardList, Edit, Trash2, Save, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { useLocation, useNavigate } from "react-router-dom";
import { createPurchaseOrder, getAllPoTypes, updatePurchaseOrder } from "@/state/purchaseOrderSlice";
import { getAllVendors } from "@/state/vendorSlice";
import { getAllUomMaster } from "@/state/uomMasterSlice";
import { getAllYarnMasters } from "@/state/yarnSlice";
import { getAllFabricMasters } from "@/state/fabricMasterSlice";
import { getAllFabricTypes } from "@/state/fabricTypeSlice";

interface PurchaseOrderFormData {
  id?: number | null;
  poTypeId: string;
  poDate: string;
  vendorId: string;
  taxId: string;
  activeFlag: boolean;
  purchaseOrderItemsDtl: PurchaseOrderItem[];
}

interface PurchaseOrderItem {
  id?: number;
  productType?: string;
  yarnId?: string;
  fabricType?: string;
  fabricCategoryId?: string;
  fabricId?: string;
  quantity: string;
  unit: string;
  price: string;
  netAmount: string;
  deliveryDate: string;
  remarks: string;
  activeFlag: boolean;
}

export function PurchaseOrderEntry() {
  const { purchaseOrderTypeList } = useSelector((state: RootState) => state.purchaseOrder);
  const { vendorList } = useSelector((state: RootState) => state.vendor);
  const { uomList } = useSelector((state: RootState) => state.uom);
  const { yarnList } = useSelector((state: RootState) => state.yarn);
  const { fabricTypeList } = useSelector((state: RootState) => state.fabricType);
  const { fabricCategoryList } = useSelector((state: RootState) => state.fabricCategoty);
  const { fabricMasterList } = useSelector((state: RootState) => state.fabricMaster);

  const [purchaseOrderItemsDtl, setPurchaseOrderItemsDtl] = useState<PurchaseOrderItem[]>([]);
  const [newItem, setNewItem] = useState<Omit<PurchaseOrderItem, 'id'>>({
    quantity: '',
    unit: '',
    price: '',
    netAmount: '',
    deliveryDate: '',
    remarks: '',
    activeFlag: true,
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("orderDetails");
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailsValid, setIsDetailsValid] = useState(false);
  const [isItemsValid, setIsItemsValid] = useState(false);
  const [selectedFabricType, setSelectedFabricType] = useState<string>('');

  const dispatch = useDispatch<AppDispatch>();
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<PurchaseOrderFormData>();
  const location = useLocation();
  const purchaseOrderdetail = location.state?.order;
  const navigate = useNavigate();

  const selectedPoType = watch("poTypeId");

  useEffect(() => {
    dispatch(getAllPoTypes({}));
    dispatch(getAllVendors({}));
    dispatch(getAllUomMaster({}));
    dispatch(getAllYarnMasters({}));
    dispatch(getAllFabricMasters({}));
    dispatch(getAllFabricTypes({}));
  }, [dispatch]);

  useEffect(() => {
    if (purchaseOrderdetail) {
      reset({
        id: purchaseOrderdetail.id ?? null,
        poTypeId: purchaseOrderdetail.poTypeId ? String(purchaseOrderdetail.poTypeId) : "",
        poDate: purchaseOrderdetail.poDate ? purchaseOrderdetail.poDate.slice(0, 10) : "",
        vendorId: purchaseOrderdetail.vendorId ? String(purchaseOrderdetail.vendorId) : "",
        taxId: purchaseOrderdetail.taxId ? String(purchaseOrderdetail.taxId) : "",
        activeFlag: purchaseOrderdetail.activeFlag ?? true,
      });
      setPurchaseOrderItemsDtl(purchaseOrderdetail.purchaseOrderItemsDtl || []);

      // Immediately validate for edit case
      const initialIsValid = !!(
        purchaseOrderdetail.poTypeId &&
        purchaseOrderdetail.poDate &&
        purchaseOrderdetail.vendorId &&
        purchaseOrderdetail.taxId
      );
      setIsDetailsValid(initialIsValid);
    }
    setIsLoading(false);
  }, [purchaseOrderdetail, reset]);

  useEffect(() => {
    const subscription = watch((value) => {
      setIsDetailsValid(!!(
        value.poTypeId &&
        value.poDate &&
        value.vendorId &&
        value.taxId
      ));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    setIsItemsValid(purchaseOrderItemsDtl.length > 0);
  }, [purchaseOrderItemsDtl]);

  const handleNextClick = () => {
    if (isLoading) return;

    // Double-check validation in case state wasn't updated
    const values = watch();
    const currentIsValid = !!(
      values.poTypeId &&
      values.poDate &&
      values.vendorId &&
      values.taxId
    );

    if (currentIsValid) {
      setActiveTab("itemDetails");
    } else {
      alert("Please fill all required fields in Order Details");
    }
  };

  const addItem = () => {
    if (!newItem.quantity || !newItem.unit || !newItem.price) {
      alert("Please fill all required item fields");
      return;
    }

    if (selectedPoType === "1" && !newItem.yarnId) {
      alert("Please select a Yarn");
      return;
    }

    if (selectedPoType === "2" && (!newItem.fabricType || !newItem.fabricCategoryId)) {
      alert("Please fill all fabric fields");
      return;
    }

    const itemToAdd = {
      ...newItem,
      productType: selectedPoType === "1" ? 'yarn' : 'fabric'
    };

    if (editingIndex !== null) {
      const updatedItems = [...purchaseOrderItemsDtl];
      updatedItems[editingIndex] = itemToAdd as PurchaseOrderItem;
      setPurchaseOrderItemsDtl(updatedItems);
      setEditingIndex(null);
    } else {
      setPurchaseOrderItemsDtl([...purchaseOrderItemsDtl, itemToAdd as PurchaseOrderItem]);
    }

    setNewItem({
      quantity: '',
      unit: '',
      price: '',
      netAmount: '',
      deliveryDate: '',
      remarks: '',
      activeFlag: true,
    });
  };

  const editItem = (index: number) => {
    setNewItem(purchaseOrderItemsDtl[index]);
    setEditingIndex(index);
  };

  const deleteItem = (index: number) => {
    setPurchaseOrderItemsDtl(purchaseOrderItemsDtl.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: PurchaseOrderFormData) => {
    const payload = {
      ...data,
      poTypeId: parseInt(data.poTypeId),
      vendorId: parseInt(data.vendorId),
      taxId: parseInt(data.taxId),
      activeFlag: true,
      purchaseOrderItemsDtl: purchaseOrderItemsDtl.map(item => ({
        ...item,
        productCategoryId: 1,
        quantity: parseFloat(item.quantity),
        price: parseFloat(item.price),
        netAmount: parseFloat(item.netAmount),
        deliveryDate: item.deliveryDate ? new Date(item.deliveryDate).toISOString() : '',
      })),
    };

    try {
      if (purchaseOrderdetail?.id) {
        await dispatch(updatePurchaseOrder({ id: purchaseOrderdetail.id, data: payload })).unwrap();
      } else {
        await dispatch(createPurchaseOrder(payload)).unwrap();
      }
      navigate("/transaction/purchase-order-details");
    } catch (err) {
      console.error("Failed to save purchase order:", err);
    }
  };

  const handleFabricTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedFabricType(value);
    setNewItem({
      ...newItem,
      fabricType: value,
      fabricId: ''
    });
  };

  return (
    <div className="mt-10 p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-semibold">Purchase Order</h2>
        {activeTab === "itemDetails" && (
          <Button
            onClick={handleSubmit(onSubmit)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 flex items-center"
            disabled={!isItemsValid}
          >
            <Save size={18} className="mr-2" />
            {purchaseOrderdetail?.id ? "Update Purchase Order" : "Save Purchase Order"}
          </Button>
        )}
      </div>

      <div className="space-y-6">
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('orderDetails')}
                className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm ${activeTab === 'orderDetails'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <FileText className="w-4 h-4" />
                Order Details
              </button>
              <button
                onClick={handleNextClick}
                className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm ${activeTab === 'itemDetails'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                disabled={isLoading}
              >
                <ShoppingCart className="w-4 h-4" />
                {isLoading ? "Loading..." : "Item Details"}
              </button>
            </nav>
          </div>
        </div>

        {activeTab === "orderDetails" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText size={20} /> Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-8">
              <div>
                <label className="block text-sm font-medium">PO Type <span className="text-red-500">*</span></label>
                <select
                  {...register("poTypeId", { required: "PO Type is required" })}
                  className={`input mt-1 ${errors.poTypeId ? 'border-red-500' : ''}`}
                >
                  <option value="">Select a PO Type</option>
                  {purchaseOrderTypeList?.map((poType: any) => (
                    <option key={poType.id} value={poType.id}>{poType.poTypeName}</option>
                  ))}
                </select>
                {errors.poTypeId && <p className="mt-1 text-sm text-red-600">{errors.poTypeId.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium">PO Date <span className="text-red-500">*</span></label>
                <input
                  {...register('poDate', { required: "PO Date is required" })}
                  type="date"
                  className={`input mt-1 ${errors.poDate ? 'border-red-500' : ''}`}
                />
                {errors.poDate && <p className="mt-1 text-sm text-red-600">{errors.poDate.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium">Vendor <span className="text-red-500">*</span></label>
                <select
                  {...register("vendorId", { required: "Vendor is required" })}
                  className={`input mt-1 ${errors.vendorId ? 'border-red-500' : ''}`}
                >
                  <option value="">Select a Vendor</option>
                  {vendorList?.map((vendor: any) => (
                    <option key={vendor.id} value={vendor.id}>{vendor.vendorName}</option>
                  ))}
                </select>
                {errors.vendorId && <p className="mt-1 text-sm text-red-600">{errors.vendorId.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium">Tax <span className="text-red-500">*</span></label>
                <select
                  {...register("taxId", { required: "Tax is required" })}
                  className={`input mt-1 ${errors.taxId ? 'border-red-500' : ''}`}
                >
                  <option value="">Select Tax</option>
                  <option value="1">CGST/SGST</option>
                  <option value="2">IGST</option>
                </select>
                {errors.taxId && <p className="mt-1 text-sm text-red-600">{errors.taxId.message}</p>}
              </div>
            </CardContent>
            <div className="p-4 flex justify-end">
              <Button
                onClick={handleNextClick}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isLoading || !isDetailsValid}
              >
                {isLoading ? "Loading..." : "Next"}
              </Button>
            </div>
          </Card>
        )}

        {activeTab === "itemDetails" && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ShoppingCart size={20} /> Item Details
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6">
                  {/* Dynamic fields based on PO Type */}
                  {selectedPoType === "1" && ( // Yarn
                    <div>
                      <label className="block text-sm font-medium">Yarn Name <span className="text-red-500">*</span></label>
                      <select
                        value={newItem.yarnId || ''}
                        onChange={(e) => setNewItem({ ...newItem, yarnId: e.target.value })}
                        className="input mt-1"
                      >
                        <option value="">Select Yarn</option>
                        {yarnList?.map((yarn: any) => (
                          <option key={yarn.id} value={yarn.id}>{yarn.yarnName}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {(selectedPoType === "2" || selectedPoType === "3") && ( // Woven Fabric
                    <>
                      <div>
                        <label className="block">Fabric Type <span className="text-red-600">*</span>
                        </label>
                        <select
                          // value={newItem.fabricType || ''}
                          onChange={(e: any) => {
                            const selectedValue = e.target.value;
                            handleFabricTypeChange(e); // Call your fabric type change handler
                            setNewItem({
                              ...newItem,
                              fabricType: selectedValue,
                              fabricId: '' // Reset fabric selection when type changes
                            });
                          }}
                          className="input mt-1"
                        >
                          <option value="">Select a Fabric Type</option>
                          {fabricTypeList?.map((fabricType: any) => (
                            <option key={fabricType.id} value={fabricType.id}>
                              {fabricType.fabricTypeName}
                            </option>
                          ))}
                        </select>
                        {/* {errors.fabricType && <p className="text-red-500 text-sm">{errors.fabricType.message}</p>} */}
                      </div>

                      {selectedFabricType === '2' && (
                        <div>
                          <label className="block">Select Greige</label>
                          <select
                            // value={selectedGreige}
                            onChange={(e) => setNewItem({ ...newItem, fabricId: e.target.value })}
                            className="input mt-1"
                          >
                            <option value="">Select Greige</option>
                            {fabricMasterList?.map((item: any) => (
                              <option key={item.id} value={item.id}> {item.fabricName} ({item.fabricCode})</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {selectedFabricType === '3' && (
                        <div>
                          <label className="block">Select Finished</label>
                          <select
                            // value={selectedFinished}
                            onChange={(e) => setNewItem({ ...newItem, fabricId: e.target.value })}
                            className="input mt-1"
                          >
                            <option value="">Select Finished</option>
                            {fabricMasterList?.map((item: any) => (
                              <option key={item.id} value={item.id}> {item.fabricName} ({item.fabricCode})</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* {selectedFabricType && ( */}
                      <div>
                        <label className="block text-sm font-medium">Fabric Category <span className="text-red-500">*</span></label>
                        <select
                          value={newItem.fabricCategoryId || ''}
                          onChange={(e) => setNewItem({
                            ...newItem,
                            fabricCategoryId: e.target.value,
                            fabricId: '' // Reset fabric selection when category changes
                          })}
                          className="input mt-1"
                        >
                          <option value="">Select Category</option>
                          {fabricCategoryList?.map((item: any) => (
                            <option key={item.id} value={item.id}> {item.fabricCategoryName}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  {/* Common fields for all item types */}
                  <div>
                    <label className="block text-sm font-medium">Quantity <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                      className="input mt-1"
                      placeholder="Quantity"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Unit <span className="text-red-500">*</span></label>
                    <select
                      value={newItem.unit}
                      onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                      className="input mt-1"
                    >
                      <option value="">Select Unit</option>
                      {uomList?.map((unit: any) => (
                        <option key={unit.id} value={unit.id}>{unit.uomName}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Price <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                      className="input mt-1"
                      placeholder="Price"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Net Amount</label>
                    <input
                      type="number"
                      value={newItem.netAmount}
                      onChange={(e) => setNewItem({ ...newItem, netAmount: e.target.value })}
                      className="input mt-1"
                      placeholder="Net Amount"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Delivery Date</label>
                    <input
                      type="date"
                      value={newItem.deliveryDate}
                      onChange={(e) => setNewItem({ ...newItem, deliveryDate: e.target.value })}
                      className="input mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Remarks</label>
                    <input
                      value={newItem.remarks}
                      onChange={(e) => setNewItem({ ...newItem, remarks: e.target.value })}
                      className="input mt-1"
                      placeholder="Remarks"
                    />
                  </div>
                </div>

                <Button
                  onClick={addItem}
                  className="mt-4 ml-auto flex items-center"
                >
                  <Plus size={18} className="mr-2" />
                  {editingIndex !== null ? "Update Item" : "Add Item"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList size={20} /> Item Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full border-collapse border border-gray-300 text-center">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-2">Sl.No</th>
                      <th className="border p-2">Product Type</th>
                      {/* <th className="border p-2">Product Name</th> */}
                      <th className="border p-2">Quantity</th>
                      <th className="border p-2">Unit</th>
                      <th className="border p-2">Price</th>
                      <th className="border p-2">Net Amount</th>
                      <th className="border p-2">Delivery Date</th>
                      <th className="border p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseOrderItemsDtl.map((item, index) => (
                      <tr key={index} className="border">
                        <td className="border p-2">{index + 1}</td>
                        <td className="border p-2">
                          {item.productType === 'yarn' ? 'Yarn' :
                            item.fabricType === 'greige' ? 'Greige Fabric' :
                              item.fabricType === 'finished' ? 'Finished Fabric' : 'Finished Shade Fabric'}
                        </td>
                        {/* <td className="border p-2">{item.productName}</td> */}
                        <td className="border p-2">{item.quantity}</td>
                        <td className="border p-2">
                          {uomList.find((uom: any) => uom.id === Number(item.unit))?.uomName}
                        </td>
                        <td className="border p-2">{item.price}</td>
                        <td className="border p-2">{item.netAmount}</td>
                        <td className="border p-2">{item.deliveryDate}</td>
                        <td className="border p-2">
                          <Button size="sm" onClick={() => editItem(index)} className="mr-2">
                            <Edit size={14} />
                          </Button>
                          <Button size="sm" onClick={() => deleteItem(index)} variant="destructive">
                            <Trash2 size={14} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}





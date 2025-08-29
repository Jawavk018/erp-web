// import React, { useEffect, useState } from "react";
// import { FileText, ShoppingCart, ClipboardList, Plus, Edit, Trash2, Save } from "lucide-react";
// import { Button } from "@/components/ui/button"; // Assuming shadcn/ui
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useForm } from "react-hook-form";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/state/store";
// import { getAllConsignee } from "@/state/consigneeSlice";
// import { useLocation, useNavigate } from "react-router-dom";
// import { getAllFabricMasterDetails } from "@/state/fabricMasterSlice";
// import { getAllVendors } from "@/state/vendorSlice";
// import { getAllFlanges } from "@/state/flangeSlice";
// import { createEmptyBeamIssue, getAllEmptyBeamIssue, updateEmptyBeamIssue } from "@/state/emptyBeamIssueSlice";
// import { getAllYarnMasters } from "@/state/yarnSlice";
// import { getAllWeavingContract } from "@/state/weavingContractSlice";
// import { getAllSalesOrders } from "@/state/salesOrderSlice";
// import { getAllPaymentTerms } from "@/state/paymentTermsSlice";
// import { getAllShipmentModes } from "@/state/shipmentModeSlice";
// import { getAllTermsConditions } from "@/state/termsConditions";
// import { createSizingPlan, getAllSizingPlan, updateSizingPlan } from "@/state/sizingPlanSlice";


// interface beamInwardFormData {
//     id?: number;
//     vendorId: string;
//     consigneeId: string;
//     termsConditionsId: string;
//     paymentTermsId: string;
//     sizingRate: string;
//     emptyBeamNo: string;
//     remarks: string;
//     sizingQualityDetails: sizingQualityDetails[];
//     sizingBeamDetails: sizingBeamDetails[];
// }

// interface sizingQualityDetails {
//     quality: string,
//     yarnId: string,
//     sordEnds: string,
//     actualEnds: string,
//     parts: string,
//     endsPerPart: string,
//     warpMeters: string,
// }

// interface sizingBeamDetails {
//     weavingContractId: string;
//     salesOrderId: string;
//     emptyBeamId: string;
//     warpMeters: string;
//     shrinkage: string;
//     expectedFabricMeter: string;
// }

// const BeamInwardEntry = () => {

//     const [items, setItems]: any = useState([]);
//     const [beamItems, setBeamItems]: any = useState([]);
// const [selectedSizingPlan, setSelectedSizingPlan] = useState<any>(null);
// const [newItem, setNewItem] = useState<sizingQualityDetails>({
//     quality: "",
//     yarnId: "",
//     sordEnds: "",
//     actualEnds: "",
//     parts: "",
//     endsPerPart: "",
//     warpMeters: "",
// });
// const [newBeamItem, setNewBeamItem] = useState<sizingBeamDetails>({
//     weavingContractId: "",
//     salesOrderId: "",
//     emptyBeamId: "",
//     warpMeters: "",
//     shrinkage: "",
//     expectedFabricMeter: "",
// });
//     const [editingIndex, setEditingIndex]: any = useState(null);
//     const { consigneeList } = useSelector((state: RootState) => state.consignee);
//     const { sizingPlanList } = useSelector((state: RootState) => state.sizingPlan);
//     const { vendorList } = useSelector((state: RootState) => state.vendor);
//     const { weavingContractList } = useSelector((state: RootState) => state.weavingContracts)
//     const { yarnList } = useSelector((state: RootState) => state.yarn)
//     const { salesOrderList } = useSelector((state: RootState) => state.salesOrder)
//     const { termsContitionsList } = useSelector((state: RootState) => state.termsConditions)
//     const { paymentTermsList } = useSelector((state: RootState) => state.paymentTerms)
//     const { emptyBeamIssueList } = useSelector((state: RootState) => state.emptyBeamIssue)
//     const dispatch = useDispatch<AppDispatch>();
//     const { register, handleSubmit, reset, formState: { errors } } = useForm<beamInwardFormData>();
//     const location = useLocation();
//     const salesOrderdetail = location.state?.salesOrderdetail;
//     const navigate = useNavigate();
//     console.log("salesOrderdetail from location state:", salesOrderdetail);
//     const [activeTab, setActiveTab] = useState("vendorDetails");
//     // const [numberOfLots, setNumberOfLots] = useState<number>(0);
//     const [itemss, setItemss] = useState<any[]>([]);
//     const [numberOfLots, setNumberOfLots] = useState<string>('0');

//     useEffect(() => {
//         dispatch(getAllVendors({}));
//         dispatch(getAllConsignee({}));
//         // dispatch(getAllYarnMasters({}));
//         // dispatch(getAllWeavingContract({}));
//         // dispatch(getAllSalesOrders({}));
//         dispatch(getAllPaymentTerms({}));
//         dispatch(getAllTermsConditions({}));
//         dispatch(getAllEmptyBeamIssue({}));
//         dispatch(getAllSizingPlan({}));

//     }, [dispatch]);


//     useEffect(() => {
//         // if (salesOrderdetail) {
//         //   reset({
//         //     orderDate: salesOrderdetail.orderDate ? salesOrderdetail.orderDate.slice(0, 10) : "",
//         //     vechileNo: salesOrderdetail.vechileNo || "",
//         //     buyerCustomerId: salesOrderdetail.buyerCustomerId ? String(salesOrderdetail.buyerCustomerId) : "",
//         //     vendorId: salesOrderdetail.vendorId ? String(salesOrderdetail.vendorId) : "",
//         //     currencyId: salesOrderdetail.currencyId ? String(salesOrderdetail.currencyId) : "",
//         //     exchangeRate: salesOrderdetail.exchangeRate ? String(salesOrderdetail.exchangeRate) : "",
//         //     modeOfShipmentId: salesOrderdetail.modeOfShipmentId ? String(salesOrderdetail.modeOfShipmentId) : "",
//         //     shipmentTermsId: salesOrderdetail.shipmentTermsId ? String(salesOrderdetail.shipmentTermsId) : "",
//         //     termsConditionsId: salesOrderdetail.termsConditionsId ? String(salesOrderdetail.termsConditionsId) : "",
//         //     gstOption: salesOrderdetail.gstOption ? String(salesOrderdetail.gstOption) : "",
//         //   });

//         //   // Defensive mapping for items keys
//         //   if (Array.isArray(salesOrderdetail.items) && salesOrderdetail.items.length > 0) {
//         //     setItems(salesOrderdetail.items.map((item: any) => ({
//         //       ...item,
//         //       uom: item.uomId ? String(item.uomId) : "", // map uomId to uom
//         //       orderQty: item.orderQty ? String(item.orderQty) : "",
//         //       pricePerUnit: item.pricePerUnit ? String(item.pricePerUnit) : "",
//         //       gstPercent: item.gstPercent ? String(item.gstPercent) : "",
//         //       gstAmount: item.gstAmount ? String(item.gstAmount) : "",
//         //       totalAmount: item.totalAmount ? String(item.totalAmount) : "",
//         //       finalAmount: item.finalAmount ? String(item.finalAmount) : "",
//         //       deliveryDate: item.deliveryDate ? item.deliveryDate.slice(0, 10) : "",
//         //     })));
//         //   }
//         //   else {
//         //     setItems([]);
//         //   }
//         // }
//     }, [salesOrderdetail, reset]);

//     const addItem = () => {
//         if (editingIndex !== null) {
//             const updatedItems = [...items];
//             updatedItems[editingIndex] = newItem;
//             setItems(updatedItems);
//             setEditingIndex(null);
//         } else {
//             setItems([...items, newItem]);
//         }
//         console.log(items)
//         setNewItem({
//             quality: "",
//             yarnId: "",
//             sordEnds: "",
//             actualEnds: "",
//             parts: "",
//             endsPerPart: "",
//             warpMeters: "",
//         });
//     };


//     const addBeamItem = () => {
//         if (editingIndex !== null) {
//             const updatedItems = [...beamItems];
//             updatedItems[editingIndex] = newItem;
//             setBeamItems(updatedItems);
//             setEditingIndex(null);
//         } else {
//             setBeamItems([...items, newItem]);
//         }
//         console.log(items)
//         setNewBeamItem({
//             weavingContractId: "",
//             salesOrderId: "",
//             emptyBeamId: "",
//             warpMeters: "",
//             shrinkage: "",
//             expectedFabricMeter: "",
//         });
//     };

//     const editItem = (index: any) => {
//         setNewItem(items[index]);
//         setEditingIndex(index);
//     };

//     const deleteItem = (index: any) => {
//         setItems(items.filter((_: any, i: any) => i !== index));
//     };


//     const onSubmit = async (data: beamInwardFormData) => {
//         // Prepare payload
//         const payload = {
//             vendorId: parseInt(data.vendorId),
//             consigneeId: parseInt(data.consigneeId),
//             termsConditionsId: parseInt(data.termsConditionsId),
//             paymentTermsId: parseInt(data.paymentTermsId),
//             sizingRate: parseFloat(data.sizingRate),
//             emptyBeamNo: data.emptyBeamNo,
//             remarks: data.remarks,
//             sizingQualityDetails: items.map((item: any) => ({
//                 quality: item.quality,
//                 yarnId: parseInt(item.yarnId),
//                 sordEnds: parseInt(item.sordEnds),
//                 actualEnds: parseInt(item.actualEnds),
//                 parts: parseInt(item.parts),
//                 endsPerPart: parseInt(item.endsPerPart),
//                 wrapMeters: parseFloat(item.warpMeters)
//             })),
//             sizingBeamDetails: itemss.map((item: any) => ({
//                 weavingContractId: parseInt(item.weavingContractId),
//                 salesOrderId: parseInt(item.salesOrderId),
//                 emptyBeamId: parseInt(item.emptyBeamId),
//                 wrapMeters: parseFloat(item.warpMeters),
//                 shrinkage: parseFloat(item.shrinkage),
//                 expectedFabricMeter: parseFloat(item.expectedFabricMeter)
//             }))
//         };

//         try {
//             if (salesOrderdetail?.id) {
//                 // Edit mode - update
//                 await dispatch(updateSizingPlan({
//                     id: salesOrderdetail.id,
//                     data: payload
//                 })).unwrap();
//                 // toast.success("Beam Inward updated successfully!");
//             } else {
//                 // Create mode - save
//                 await dispatch(createSizingPlan(payload)).unwrap();
//                 // toast.success("Beam Inward created successfully!");
//             }
//             navigate("/transaction/sizing-management");
//         } catch (err) {
//             // toast.error("Failed to save/update Beam Inward");
//             console.error("Error submitting Beam Inward:", err);
//         }
//     };


//     const handleAddLot = () => {
//         const newItems = Array.from({ length: Number(numberOfLots) }, () => ({
//             quality: "",
//             yarnId: "",
//             actualEnds: "",
//             parts: "",
//             endsPerPart: "",
//             warpMeters: "",
//         }));
//         setItems(newItems);
//     };

//     const handleSizingPlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         const selectedId = e.target.value;
//         if (!selectedId) {
//             setSelectedSizingPlan(null);
//             reset(); // Reset the form if no plan is selected
//             setItems([]);
//             setBeamItems([]);
//             return;
//         }

//         const plan = sizingPlanList.find((sp: any) => sp.id === parseInt(selectedId));
//         if (plan) {
//             setSelectedSizingPlan(plan);

//             // Reset the form with the selected plan's data
//             reset({
//                 vendorId: String(plan.vendorId),
//                 consigneeId: String(plan.consigneeId),
//                 termsConditionsId: String(plan.termsConditionsId),
//                 paymentTermsId: String(plan.paymentTermsId),
//                 sizingRate: String(plan.sizingRate),
//                 emptyBeamNo: plan.emptyBeamNo || "",
//                 remarks: plan.remarks || "",
//             });

//             // Set quality details
//             if (plan.sizingQualityDetails && plan.sizingQualityDetails.length > 0) {
//                 setItems(plan.sizingQualityDetails.map((item: any) => ({
//                     quality: item.quality,
//                     yarnId: String(item.yarnId),
//                     sordEnds: String(item.sordEnds),
//                     actualEnds: String(item.actualEnds),
//                     parts: String(item.parts),
//                     endsPerPart: String(item.endsPerPart),
//                     warpMeters: String(item.wrapMeters)
//                 })));
//             }

//             // Set beam details
//             if (plan.sizingBeamDetails && plan.sizingBeamDetails.length > 0) {
//                 setBeamItems(plan.sizingBeamDetails.map((item: any) => ({
//                     weavingContractId: String(item.weavingContractId),
//                     salesOrderId: String(item.salesOrderId),
//                     emptyBeamId: String(item.emptyBeamId),
//                     warpMeters: String(item.wrapMeters),
//                     shrinkage: String(item.shrinkage),
//                     expectedFabricMeter: String(item.expectedFabricMeter)
//                 })));
//             }
//         }
//     };


//     return (
//         <div className="mt-10 p-6 bg-white shadow-md rounded-lg mt-16">
//             {/* Title & Save Button */}
//             <div className="flex justify-between items-center border-b pb-4">
//                 <h2 className="text-2xl font-semibold">Beam Inward</h2>
//                 <Button
//                     onClick={handleSubmit(onSubmit)}
//                     className={`bg-green-600 hover:bg-green-700 text-white px-6 flex items-center`}
//                 >
//                     <Save size={18} className="mr-2" />
//                     {salesOrderdetail?.id ? "Update Beam Inward" : "Save Beam Inward"}
//                 </Button>
//             </div>
//             <div className="space-y-6">
//                 {/* Tab Navigation */}
//                 <div className="mb-8">
//                     <div className="border-b border-gray-200">
//                         <nav className="flex -mb-px">
//                             <button
//                                 onClick={() => setActiveTab('vendorDetails')}
//                                 className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm ${activeTab === 'vendorDetails'
//                                     ? 'border-red-500 text-red-600'
//                                     : 'border-transparent text-gray-500 hover:text-gray-700 Inward Ordershover:border-gray-300'
//                                     }`}
//                             >
//                                 <FileText className="w-4 h-4" />
//                                 Vendor Details
//                             </button>
//                         </nav>
//                     </div>
//                 </div>

//                 {/* Vendor Details */}
//                 {activeTab === "vendorDetails" && (
//                     <>
//                         <Card>
//                             <CardHeader>
//                                 <CardTitle className="flex items-center gap-2 ">
//                                     <FileText size={20} /> Vendor Details
//                                 </CardTitle>
//                             </CardHeader>
//                             <CardContent className="grid grid-cols-4 gap-8">
//                                 <div>
//                                     <label className="block text-sm font-medium text-secondary-700">Sizing Plan No</label>
//                                     {/* <select {...register("vendorId", { required: "Vendor is required" })} className="input mt-1">
//                                         <option value="">Select a Sizing Plan</option>
//                                         {sizingPlanList.map((sp: any) => (
//                                             <option key={sp.id} value={sp.id}>{sp.sizingPlanNo}</option>
//                                         ))}
//                                     </select> */}
//                                     {/* Vendor Name - should be populated when sizing plan is selected */}
//                                     {/* Vendor Name - should be populated when sizing plan is selected */}
//                                     <select
//                                         {...register("vendorId")}
//                                         onChange={handleSizingPlanChange}
//                                         className="input mt-1"
//                                     >
//                                         <option value="">Select a Sizing Plan</option>
//                                         {sizingPlanList.map((sp: any) => (
//                                             <option key={sp.id} value={sp.id}>{sp.sizingPlanNo}</option>
//                                         ))}
//                                     </select>
//                                     {errors.vendorId && (
//                                         <p className="mt-1 text-sm text-red-600">{errors.vendorId.message}</p>
//                                     )}
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-secondary-700">Vendor Name</label>
//                                     <select {...register("vendorId", { required: "Vendor is required" })} className="input mt-1">
//                                         <option value="">Select a Vendor</option>
//                                         {vendorList.map((vendor: any) => (
//                                             <option key={vendor.id} value={vendor.id}>{vendor.vendorName}</option>
//                                         ))}
//                                     </select>
//                                     {errors.vendorId && (
//                                         <p className="mt-1 text-sm text-red-600">{errors.vendorId.message}</p>
//                                     )}
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-secondary-700">Delivery Address</label>
//                                     <select {...register("consigneeId", { required: "Delivey Address is required" })} className="input mt-1">
//                                         <option value="">Select a Address</option>
//                                         {consigneeList.map((consignee: any) => (
//                                             <option key={consignee.id} value={consignee.id}>{consignee.consigneeName}</option>
//                                         ))}
//                                     </select>
//                                     {errors.consigneeId && (
//                                         <p className="mt-1 text-sm text-red-600">{errors.consigneeId.message}</p>
//                                     )}
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-secondary-700">Select Terms & Conditions</label>
//                                     <select {...register("termsConditionsId", { required: "TermsConditions is required" })} className="input mt-1">
//                                         <option value="">Select a Terms&Condition</option>
//                                         {termsContitionsList.map((tc: any) => (
//                                             <option key={tc.id} value={tc.id}>{tc.termsConditionsName}</option>
//                                         ))}
//                                     </select>
//                                     {errors.termsConditionsId && (
//                                         <p className="mt-1 text-sm text-red-600">{errors.termsConditionsId.message}</p>
//                                     )}
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-secondary-700">Select Payment Terms</label>
//                                     <select {...register("paymentTermsId", { required: "Payment Terms is required" })} className="input mt-1">
//                                         <option value="">Select a Paymet Terms</option>
//                                         {paymentTermsList.map((pt: any) => (
//                                             <option key={pt.id} value={pt.id}>{pt.termName}</option>
//                                         ))}
//                                     </select>
//                                     {errors.paymentTermsId && (
//                                         <p className="mt-1 text-sm text-red-600">{errors.paymentTermsId.message}</p>
//                                     )}
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-secondary-700">Sizing Rate</label>
//                                     <input
//                                         {...register('sizingRate')}
//                                         className="input mt-1" placeholder="Enter Sizing Rate"
//                                     />
//                                     {/* {errors.vechileNo && (
//                 <p className="mt-1 text-sm text-red-600">{errors.vechileNo.message}</p>
//               )} */}
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-secondary-700">Remarks</label>
//                                     <input
//                                         {...register('remarks')}
//                                         className="input mt-1" placeholder="Enter Remarks"
//                                     />
//                                     {/* {errors.vechileNo && (
//                 <p className="mt-1 text-sm text-red-600">{errors.vechileNo.message}</p>
//               )} */}
//                                 </div>
//                             </CardContent>
//                         </Card>
//                         <Card>
//                             <CardHeader>
//                                 <CardTitle className="flex items-center gap-2">
//                                     <ClipboardList size={20} /> Quality Details
//                                 </CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                                 <table className="w-full border-collapse border border-gray-300 text-center">
//                                     <thead className="bg-gray-100">
//                                         <tr>
//                                             <th className="border p-2">Sl.No</th>
//                                             <th className="border p-2">Quality</th>
//                                             <th className="border p-2">Yarn Name</th>
//                                             <th className="border p-2">Actual Ends</th>
//                                             <th className="border p-2">Parts</th>
//                                             <th className="border p-2">Ends/Part</th>
//                                             <th className="border p-2">Warp Meters</th>
//                                             <th className="border p-2">Actions</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {items.map((item: any, index: any) => (
//                                             <tr key={index} className="border">
//                                                 <td className="border p-2">{index + 1}</td>
//                                                 <td className="border p-2">{item.quality}</td>
//                                                 <td className="border p-2">{item.yarnId}</td>
//                                                 <td className="border p-2">{item.actualEnds}</td>
//                                                 <td className="border p-2">{item.parts}</td>
//                                                 <td className="border p-2">{item.endsPerPart}</td>
//                                                 <td className="border p-2">{item.warpMeters}</td>
//                                                 <td className="border p-2">
//                                                     <button onClick={() => editItem(index)} className="mr-2 text-blue-500">
//                                                         <Edit size={18} />
//                                                     </button>
//                                                     <button onClick={() => deleteItem(index)} className="text-red-500">
//                                                         <Trash2 size={18} />
//                                                     </button>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </CardContent>
//                         </Card>
//                     </>
//                 )}

//                 <div className="flex flex-col sm:flex-row items-center justify-start gap-4 mb-4">
//                     <div className="flex flex-col">
//                         <label className="block text-sm font-medium text-gray-700">No of Beams</label>
//                         <input
//                             type="number"
//                             value={numberOfLots}
//                             onChange={(e) => setNumberOfLots(e.target.value)}
//                             className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
//                         />
//                     </div>
//                     <Button
//                         onClick={handleAddLot}
//                         className="bg-blue-500 hover:bg-green-700 text-white px-6 py-2 rounded-md flex items-center mt-5"
//                     >
//                         <Plus size={18} className="mr-2" /> Add Beams
//                     </Button>
//                 </div>

//                 <Card>
//                     <CardHeader>
//                         <CardTitle className="flex items-center gap-2">
//                             <ClipboardList size={20} /> Beam Details
//                         </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <table className="w-full border-collapse border border-gray-300 text-center">
//                             <thead className="bg-gray-100">
//                                 <tr>
//                                     <th className="border p-2">Sl.No</th>
//                                     <th className="border p-2">Weaving Contract No</th>
//                                     <th className="border p-2">Sales Order No</th>
//                                     <th className="border p-2">Empty Beam No</th>
//                                     <th className="border p-2">Warp Meters</th>
//                                     <th className="border p-2">Shrinkage %</th>
//                                     <th className="border p-2">Expected Fabric Meter</th>
//                                     <th className="border p-2">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {items.map((item: any, index: any) => (
//                                     <tr key={index} className="border">
//                                         <td className="border p-2">{index + 1}</td>
//                                         {/* <td className="border p-2">{item.quality}</td> */}
//                                         <td className="border p-2">
//                                             <select
//                                                 value={newBeamItem.weavingContractId}
//                                                 onChange={(e) =>
//                                                     setNewBeamItem({ ...newBeamItem, weavingContractId: e.target.value })
//                                                 }
//                                                 className="input mt-1"
//                                             >
//                                                 <option value="">Weaving Contract No</option>
//                                                 {weavingContractList?.map((wc: any) => (
//                                                     <option key={wc.id} value={wc.id}>{wc.weavingContractNo}</option>
//                                                 ))}
//                                             </select>
//                                         </td>
//                                         <td className="border p-2">
//                                             <select
//                                                 value={newBeamItem.salesOrderId}
//                                                 onChange={(e) =>
//                                                     setNewBeamItem({ ...newBeamItem, salesOrderId: e.target.value })
//                                                 }
//                                                 className="input mt-1"
//                                             >
//                                                 <option value=""> Sales Order No</option>
//                                                 {salesOrderList?.map((so: any) => (
//                                                     <option key={so.id} value={so.id}>{so.salesOrderNo}</option>
//                                                 ))}
//                                             </select>
//                                         </td>
//                                         <td className="border p-2">
//                                             <select
//                                                 value={newBeamItem.emptyBeamId}
//                                                 onChange={(e) =>
//                                                     setNewBeamItem({ ...newBeamItem, emptyBeamId: e.target.value })
//                                                 }
//                                                 className="input mt-1"
//                                             >
//                                                 <option value="">Empty Beam No</option>
//                                                 {emptyBeamIssueList?.map((ebi: any) => (
//                                                     <option key={ebi.id} value={ebi.id}>{ebi.emptyBeamNo}</option>
//                                                 ))}
//                                             </select>
//                                         </td>
//                                         <td className="border p-2">
//                                             <input placeholder="Enter Warp Meters"
//                                                 value={newBeamItem.warpMeters}
//                                                 onChange={e => setNewBeamItem({ ...newBeamItem, warpMeters: e.target.value })} className="input  mt-1" />
//                                         </td>
//                                         <td className="border p-2">
//                                             <input placeholder="Enter Shrinkage"
//                                                 value={newBeamItem.shrinkage}
//                                                 onChange={e => setNewBeamItem({ ...newBeamItem, shrinkage: e.target.value })} className="input  mt-1" />
//                                         </td>
//                                         <td className="border p-2">
//                                             <input placeholder="Enter ExpectedMeter"
//                                                 value={newBeamItem.expectedFabricMeter}
//                                                 onChange={e => setNewBeamItem({ ...newBeamItem, expectedFabricMeter: e.target.value })} className="input  mt-1" />
//                                         </td>

//                                         <td className="border p-2">
//                                             <button onClick={() => editItem(index)} className="mr-2 text-blue-500">
//                                                 <Edit size={18} />
//                                             </button>
//                                             <button onClick={() => deleteItem(index)} className="text-red-500">
//                                                 <Trash2 size={18} />
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                         <Button onClick={addBeamItem} className="mt-4 ml-auto flex items-center">
//                             <Plus size={18} className="mr-2" />
//                             {editingIndex !== null ? "Update Beam Item" : "Add Beam Item"}
//                         </Button>
//                     </CardContent>
//                 </Card>
//             </div>
//         </div>
//     );
// };

// export default BeamInwardEntry;




import React, { useEffect, useState } from "react";
import { FileText, ShoppingCart, ClipboardList, Plus, Edit, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { getAllConsignee } from "@/state/consigneeSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllVendors } from "@/state/vendorSlice";
import { getAllWeavingContract } from "@/state/weavingContractSlice";
import { getAllSalesOrders } from "@/state/salesOrderSlice";
import { getAllPaymentTerms } from "@/state/paymentTermsSlice";
import { getAllTermsConditions } from "@/state/termsConditions";
import { getAllEmptyBeamIssue } from "@/state/emptyBeamIssueSlice";
import { createSizingPlan, getAllSizingPlan, updateSizingPlan } from "@/state/sizingPlanSlice";
import { createBeamInward, updateBeamInward } from "@/state/beamInwardSlice";

interface BeamInwardFormData {
    id?: number;
    vendorId: string;
    sizingPlanId: string;
    consigneeId: string;
    termsConditionsId: string;
    paymentTermsId: string;
    sizingRate: string;
    emptyBeamNo: string;
    remarks: string;
    beamInwardNo: string;
    beamInwardQualityDetails: BeamInwardQualityDetails[];
    beamInwardBeamDetails: BeamInwardBeamDetails[];
}

interface BeamInwardQualityDetails {
    quality: string;
    yarnId: string;
    sordEnds: string;
    actualEnds: string;
    parts: string;
    endsPerPart: string;
    warpMeters: string;
}

interface BeamInwardBeamDetails {
    weavingContractId: string;
    salesOrderId: string;
    emptyBeamId: string;
    warpMeters: string;
    shrinkage: string;
    expectedFabricMeter: string;
}

const BeamInwardEntry = () => {
    const [items, setItems] = useState<BeamInwardQualityDetails[]>([]);
    const [beamItems, setBeamItems] = useState<BeamInwardBeamDetails[]>([]);
    const [newItem, setNewItem] = useState<BeamInwardQualityDetails>({
        quality: "",
        yarnId: "",
        sordEnds: "",
        actualEnds: "",
        parts: "",
        endsPerPart: "",
        warpMeters: "",
    });
    const [newBeamItem, setNewBeamItem] = useState<BeamInwardBeamDetails>({
        weavingContractId: "",
        salesOrderId: "",
        emptyBeamId: "",
        warpMeters: "",
        shrinkage: "",
        expectedFabricMeter: "",
    });
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [beamEditingIndex, setBeamEditingIndex] = useState<number | null>(null);

    const { consigneeList } = useSelector((state: RootState) => state.consignee);
    const { sizingPlanList } = useSelector((state: RootState) => state.sizingPlan);
    const { vendorList } = useSelector((state: RootState) => state.vendor);
    const { weavingContractList } = useSelector((state: RootState) => state.weavingContracts);
    const { salesOrderList } = useSelector((state: RootState) => state.salesOrder);
    const { termsContitionsList } = useSelector((state: RootState) => state.termsConditions);
    const { paymentTermsList } = useSelector((state: RootState) => state.paymentTerms);
    const { emptyBeamIssueList } = useSelector((state: RootState) => state.emptyBeamIssue);
    const [numberOfLots, setNumberOfLots] = useState<string>('0');

    const dispatch = useDispatch<AppDispatch>();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<BeamInwardFormData>();
    const location = useLocation();
    const beamInwardDtl = location.state?.beamInwardDtl;
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("vendorDetails");
    const [selectedSizingPlan, setSelectedSizingPlan] = useState<any>(null);

    useEffect(() => {
        dispatch(getAllVendors({}));
        dispatch(getAllConsignee({}));
        dispatch(getAllWeavingContract({}));
        dispatch(getAllSalesOrders({}));
        dispatch(getAllPaymentTerms({}));
        dispatch(getAllTermsConditions({}));
        dispatch(getAllEmptyBeamIssue({}));
        dispatch(getAllSizingPlan({}));

    }, [dispatch]);

    useEffect(() => {
        if (beamInwardDtl) {
            reset({
                vendorId: String(beamInwardDtl.vendorId),
                consigneeId: String(beamInwardDtl.consigneeId),
                termsConditionsId: String(beamInwardDtl.termsConditionsId),
                paymentTermsId: String(beamInwardDtl.paymentTermsId),
                sizingRate: String(beamInwardDtl.sizingRate),
                emptyBeamNo: beamInwardDtl.emptyBeamNo || "",
                remarks: beamInwardDtl.remarks || "",
            });

            // Set quality details
            if (beamInwardDtl.beamInwardQualityDetails) {
                setItems(beamInwardDtl.beamInwardQualityDetails.map((item: any) => ({
                    ...item,
                    yarnId: String(item.yarnId),
                    sordEnds: String(item.sordEnds),
                    actualEnds: String(item.actualEnds),
                    parts: String(item.parts),
                    endsPerPart: String(item.endsPerPart),
                    warpMeters: String(item.warpMeters)
                })));
            }

            // Set beam details
            if (beamInwardDtl.beamInwardBeamDetails) {
                setBeamItems(beamInwardDtl.beamInwardBeamDetails.map((beam: any) => ({
                    ...beam,
                    weavingContractId: String(beam.weavingContractId),
                    salesOrderId: String(beam.salesOrderId),
                    emptyBeamId: String(beam.emptyBeamId),
                    warpMeters: String(beam.warpMeters),
                    shrinkage: String(beam.shrinkage),
                    expectedFabricMeter: String(beam.expectedFabricMeter)
                })));
            }
        }
    }, [beamInwardDtl, reset]);

    const addItem = () => {
        if (!newItem.quality || !newItem.yarnId || !newItem.sordEnds) {
            alert("Please fill all required fields");
            return;
        }

        if (editingIndex !== null) {
            const updatedItems = [...items];
            updatedItems[editingIndex] = newItem;
            setItems(updatedItems);
            setEditingIndex(null);
        } else {
            setItems([...items, newItem]);
        }

        setNewItem({
            quality: "",
            yarnId: "",
            sordEnds: "",
            actualEnds: "",
            parts: "",
            endsPerPart: "",
            warpMeters: "",
        });
    };

    const addBeamItem = () => {
        if (!newBeamItem.weavingContractId || !newBeamItem.salesOrderId || !newBeamItem.emptyBeamId) {
            alert("Please fill all required fields");
            return;
        }

        if (beamEditingIndex !== null) {
            const updatedBeamItems = [...beamItems];
            updatedBeamItems[beamEditingIndex] = newBeamItem;
            setBeamItems(updatedBeamItems);
            setBeamEditingIndex(null);
        } else {
            setBeamItems([...beamItems, newBeamItem]);
        }

        setNewBeamItem({
            weavingContractId: "",
            salesOrderId: "",
            emptyBeamId: "",
            warpMeters: "",
            shrinkage: "",
            expectedFabricMeter: "",
        });
    };

    const editItem = (index: number) => {
        setNewItem(items[index]);
        setEditingIndex(index);
    };

    const editBeamItem = (index: number) => {
        setNewBeamItem(beamItems[index]);
        setBeamEditingIndex(index);
    };

    const deleteItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const deleteBeamItem = (index: number) => {
        setBeamItems(beamItems.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: BeamInwardFormData) => {
        const payload = {
            ...data,
            vendorId: parseInt(data.vendorId),
            sizingPlanId: parseInt(data.sizingPlanId),
            consigneeId: parseInt(data.consigneeId),
            termsConditionsId: parseInt(data.termsConditionsId),
            paymentTermsId: parseInt(data.paymentTermsId),
            sizingRate: parseFloat(data.sizingRate),
            beamInwardNo: beamInwardDtl?.beamInwardNo,
            beamInwardQualityDetails: items.map(item => ({
                ...item,
                yarnId: parseInt(item.yarnId),
                sordEnds: parseInt(item.sordEnds),
                actualEnds: parseInt(item.actualEnds),
                parts: parseInt(item.parts),
                endsPerPart: parseInt(item.endsPerPart),
                warpMeters: parseFloat(item.warpMeters)
            })),
            beamInwardBeamDetails: beamItems.map(beam => ({
                ...beam,
                weavingContractId: parseInt(beam.weavingContractId),
                salesOrderId: parseInt(beam.salesOrderId),
                emptyBeamId: parseInt(beam.emptyBeamId),
                warpMeters: parseFloat(beam.warpMeters),
                shrinkage: parseFloat(beam.shrinkage),
                expectedFabricMeter: parseFloat(beam.expectedFabricMeter)
            }))
        };

        try {
            if (beamInwardDtl?.id) {
                await dispatch(updateBeamInward({
                    id: beamInwardDtl.id,
                    data: payload
                })).unwrap();
            } else {
                await dispatch(createBeamInward(payload)).unwrap();
            }
            navigate("/transaction/beam-management", { state: { tab: "beamInward" } });
        } catch (err) {
            console.error("Error submitting Beam Inward:", err);
        }
    };

    const handleAddLot = () => {
        const newItems = Array.from({ length: Number(numberOfLots) }, () => ({
            quality: "",
            yarnId: "",
            actualEnds: "",
            parts: "",
            endsPerPart: "",
            warpMeters: "",
        }));
        // setItems(newItems);
    };

    const handleSizingPlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        if (!selectedId) {
            setSelectedSizingPlan(null);
            reset(); // Reset the form if no plan is selected
            setItems([]);
            setBeamItems([]);
            return;
        }

        const plan = sizingPlanList.find((sp: any) => sp.id === parseInt(selectedId));
        console.log(plan)
        if (plan) {
            setSelectedSizingPlan(plan);

            // Reset the form with the selected plan's data
            reset({
                vendorId: String(plan.vendorId),
                consigneeId: String(plan.consigneeId),
                termsConditionsId: String(plan.termsConditionsId),
                paymentTermsId: String(plan.paymentTermsId),
                sizingRate: String(plan.sizingRate),
                emptyBeamNo: plan.emptyBeamNo || "",
                remarks: plan.remarks || "",
            });

            // Set quality details
            if (plan.sizingQualityDetails && plan.sizingQualityDetails.length > 0) {
                setItems(plan.sizingQualityDetails.map((item: any) => ({
                    quality: item.quality,
                    yarnId: String(item.yarnId),
                    sordEnds: String(item.sordEnds),
                    actualEnds: String(item.actualEnds),
                    parts: String(item.parts),
                    endsPerPart: String(item.endsPerPart),
                    warpMeters: String(item.wrapMeters)
                })));
            }

            // Set beam details
            if (plan.sizingBeamDetails && plan.sizingBeamDetails.length > 0) {
                setBeamItems(plan.sizingBeamDetails.map((item: any) => ({
                    weavingContractId: String(item.weavingContractId),
                    salesOrderId: String(item.salesOrderId),
                    emptyBeamId: String(item.emptyBeamId),
                    warpMeters: String(item.wrapMeters),
                    shrinkage: String(item.shrinkage),
                    expectedFabricMeter: String(item.expectedFabricMeter)
                })));
            }
        }
    };

    return (
        <div className="mt-10 p-6 bg-white shadow-md rounded-lg">
            <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-2xl font-semibold">Beam Inward</h2>
                <Button
                    onClick={handleSubmit(onSubmit)}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 flex items-center"
                >
                    <Save size={18} className="mr-2" />
                    {beamInwardDtl?.id ? "Update Beam Inward" : "Save Beam Inward"}
                </Button>
            </div>

            <div className="space-y-6">
                {/* Tab Navigation */}
                <div className="mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            <button
                                onClick={() => setActiveTab('vendorDetails')}
                                className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm ${activeTab === 'vendorDetails'
                                    ? 'border-red-500 text-red-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 Inward Ordershover:border-gray-300'
                                    }`}
                            >
                                <FileText className="w-4 h-4" />
                                Vendor Details
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Vendor Details */}
                {activeTab === "vendorDetails" && (
                    <>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 ">
                                    <FileText size={20} /> Vendor Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-4 gap-8">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">Sizing Plan No</label>
                                    <select
                                        {...register("sizingPlanId")}
                                        onChange={handleSizingPlanChange}
                                        className="input mt-1"
                                    >
                                        <option value="">Select a Sizing Plan</option>
                                        {sizingPlanList.map((sp: any) => (
                                            <option key={sp.id} value={sp.id}>{sp.sizingPlanNo}</option>
                                        ))}
                                    </select>
                                    {errors.sizingPlanId && (
                                        <p className="mt-1 text-sm text-red-600">{errors.sizingPlanId.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">Vendor Name</label>
                                    <select {...register("vendorId", { required: "Vendor is required" })} className="input mt-1">
                                        <option value="">Select a Vendor</option>
                                        {vendorList.map((vendor: any) => (
                                            <option key={vendor.id} value={vendor.id}>{vendor.vendorName}</option>
                                        ))}
                                    </select>
                                    {errors.vendorId && (
                                        <p className="mt-1 text-sm text-red-600">{errors.vendorId.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">Delivery Address</label>
                                    <select {...register("consigneeId", { required: "Delivey Address is required" })} className="input mt-1">
                                        <option value="">Select a Address</option>
                                        {consigneeList.map((consignee: any) => (
                                            <option key={consignee.id} value={consignee.id}>{consignee.consigneeName}</option>
                                        ))}
                                    </select>
                                    {errors.consigneeId && (
                                        <p className="mt-1 text-sm text-red-600">{errors.consigneeId.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">Select Terms & Conditions</label>
                                    <select {...register("termsConditionsId", { required: "TermsConditions is required" })} className="input mt-1">
                                        <option value="">Select a Terms&Condition</option>
                                        {termsContitionsList.map((tc: any) => (
                                            <option key={tc.id} value={tc.id}>{tc.termsConditionsName}</option>
                                        ))}
                                    </select>
                                    {errors.termsConditionsId && (
                                        <p className="mt-1 text-sm text-red-600">{errors.termsConditionsId.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">Select Payment Terms</label>
                                    <select {...register("paymentTermsId", { required: "Payment Terms is required" })} className="input mt-1">
                                        <option value="">Select a Paymet Terms</option>
                                        {paymentTermsList.map((pt: any) => (
                                            <option key={pt.id} value={pt.id}>{pt.termName}</option>
                                        ))}
                                    </select>
                                    {errors.paymentTermsId && (
                                        <p className="mt-1 text-sm text-red-600">{errors.paymentTermsId.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">Sizing Rate</label>
                                    <input
                                        {...register('sizingRate')}
                                        className="input mt-1" placeholder="Enter Sizing Rate"
                                    />
                                    {/* {errors.vechileNo && (
                <p className="mt-1 text-sm text-red-600">{errors.vechileNo.message}</p>
              )} */}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">Remarks</label>
                                    <input
                                        {...register('remarks')}
                                        className="input mt-1" placeholder="Enter Remarks"
                                    />
                                    {/* {errors.vechileNo && (
                <p className="mt-1 text-sm text-red-600">{errors.vechileNo.message}</p>
              )} */}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ClipboardList size={20} /> Quality Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <table className="w-full border-collapse border border-gray-300 text-center">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="border p-2">Sl.No</th>
                                            <th className="border p-2">Quality</th>
                                            <th className="border p-2">Yarn Name</th>
                                            <th className="border p-2">Actual Ends</th>
                                            <th className="border p-2">Parts</th>
                                            <th className="border p-2">Ends/Part</th>
                                            <th className="border p-2">Warp Meters</th>
                                            <th className="border p-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item: any, index: any) => (
                                            <tr key={index} className="border">
                                                <td className="border p-2">{index + 1}</td>
                                                <td className="border p-2">{item.quality}</td>
                                                <td className="border p-2">{item.yarnId}</td>
                                                <td className="border p-2">{item.actualEnds}</td>
                                                <td className="border p-2">{item.parts}</td>
                                                <td className="border p-2">{item.endsPerPart}</td>
                                                <td className="border p-2">{item.warpMeters}</td>
                                                <td className="border p-2">
                                                    <button onClick={() => editItem(index)} className="mr-2 text-blue-500">
                                                        <Edit size={18} />
                                                    </button>
                                                    <button onClick={() => deleteItem(index)} className="text-red-500">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
                    </>
                )}
                {/* Beam Details Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ClipboardList size={20} /> Beam Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium">Weaving Contract No</label>
                                <select
                                    value={newBeamItem.weavingContractId}
                                    onChange={(e) => setNewBeamItem({ ...newBeamItem, weavingContractId: e.target.value })}
                                    className="input mt-1"
                                >
                                    <option value="">Select Contract</option>
                                    {weavingContractList?.map((wc: any) => (
                                        <option key={wc.id} value={wc.id}>{wc.weavingContractNo}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Sales Order No</label>
                                <select
                                    value={newBeamItem.salesOrderId}
                                    onChange={(e) => setNewBeamItem({ ...newBeamItem, salesOrderId: e.target.value })}
                                    className="input mt-1"
                                >
                                    <option value="">Select Order</option>
                                    {salesOrderList?.map((so: any) => (
                                        <option key={so.id} value={so.id}>{so.salesOrderNo}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Empty Beam No</label>
                                <select
                                    value={newBeamItem.emptyBeamId}
                                    onChange={(e) => setNewBeamItem({ ...newBeamItem, emptyBeamId: e.target.value })}
                                    className="input mt-1"
                                >
                                    <option value="">Select Beam</option>
                                    {emptyBeamIssueList?.map((ebi: any) => (
                                        <option key={ebi.id} value={ebi.id}>{ebi.emptyBeamNo}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Warp Meters</label>
                                <input
                                    type="number"
                                    value={newBeamItem.warpMeters}
                                    onChange={(e) => setNewBeamItem({ ...newBeamItem, warpMeters: e.target.value })}
                                    className="input mt-1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Shrinkage %</label>
                                <input
                                    type="number"
                                    value={newBeamItem.shrinkage}
                                    onChange={(e) => setNewBeamItem({ ...newBeamItem, shrinkage: e.target.value })}
                                    className="input mt-1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Expected Fabric Meter</label>
                                <input
                                    type="number"
                                    value={newBeamItem.expectedFabricMeter}
                                    onChange={(e) => setNewBeamItem({ ...newBeamItem, expectedFabricMeter: e.target.value })}
                                    className="input mt-1"
                                />
                            </div>
                        </div>

                        <Button onClick={addBeamItem} className="mb-4 flex items-center">
                            <Plus size={18} className="mr-2" />
                            {beamEditingIndex !== null ? "Update Beam" : "Add Beam"}
                        </Button>

                        <table className="w-full border-collapse border border-gray-300 text-center">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border p-2">Sl.No</th>
                                    <th className="border p-2">Weaving Contract No</th>
                                    <th className="border p-2">Sales Order No</th>
                                    <th className="border p-2">Empty Beam No</th>
                                    <th className="border p-2">Warp Meters</th>
                                    <th className="border p-2">Shrinkage %</th>
                                    <th className="border p-2">Expected Fabric Meter</th>
                                    <th className="border p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {beamItems.map((item, index) => (
                                    <tr key={index} className="border">
                                        <td className="border p-2">{index + 1}</td>
                                        <td className="border p-2">
                                            {weavingContractList?.find((wc: any) => wc.id === parseInt(item.weavingContractId))?.weavingContractNo || item.weavingContractId}
                                        </td>
                                        <td className="border p-2">
                                            {salesOrderList?.find((so: any) => so.id === parseInt(item.salesOrderId))?.salesOrderNo || item.salesOrderId}
                                        </td>
                                        <td className="border p-2">
                                            {emptyBeamIssueList?.find((ebi: any) => ebi.id === parseInt(item.emptyBeamId))?.emptyBeamNo || item.emptyBeamId}
                                        </td>
                                        <td className="border p-2">{item.warpMeters}</td>
                                        <td className="border p-2">{item.shrinkage}</td>
                                        <td className="border p-2">{item.expectedFabricMeter}</td>
                                        <td className="border p-2">
                                            <button
                                                onClick={() => editBeamItem(index)}
                                                className="mr-2 text-blue-500"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => deleteBeamItem(index)}
                                                className="text-red-500"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default BeamInwardEntry;
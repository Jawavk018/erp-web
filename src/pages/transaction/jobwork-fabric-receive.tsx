// // import React, { useEffect, useState } from "react";
// // import { FileText, ClipboardList, Edit, Trash2, Save } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { useForm } from "react-hook-form";
// // import { useDispatch, useSelector } from "react-redux";
// // import { AppDispatch, RootState } from "@/state/store";
// // import { getAllVendors } from "@/state/vendorSlice";
// // import { getAllProductCategory } from "@/state/productCategorySlice";
// // import { useNavigate } from "react-router-dom";
// // import { getAllWeavingContract, getWeavingContractById } from "@/state/weavingContractSlice";

// // interface WeavingContractFormData {
// //     weavingContractId: string;
// //     vendorId: string;
// //     jobFabricReceiveDate: string;
// //     remarks: string;
// //     activeFlag?: boolean;
// // }

// // const JobworkFabricReceive = () => {
// //     const dispatch = useDispatch<AppDispatch>();
// //     const navigate = useNavigate();
// //     const { register, watch, handleSubmit } = useForm();
// //     const [filteredItems, setFilteredItems]: any = useState([]);
// //     const [selectedItems, setSelectedItems]: any = useState([]);
// //     const { vendorList } = useSelector((state: RootState) => state.vendor);
// //     const { weavingContractList } = useSelector((state: RootState) => state.weavingContracts);
// //     console.log("Weaving Contracts:", weavingContractList);
// //     const { getWeavingContractByIdList } = useSelector((state: RootState) => state.weavingContracts);

// //     const { reset } = useForm();
// //     useEffect(() => {
// //         dispatch(getAllVendors({}));
// //         dispatch(getAllProductCategory({}));
// //         dispatch(getAllWeavingContract({}));
// //     }, [dispatch]);

// //     useEffect(() => {
// //         if (getWeavingContractByIdList && Array.isArray(getWeavingContractByIdList)) {
// //             const items = getWeavingContractByIdList.flatMap((po: any) => {
// //                 if (po.items && Array.isArray(po.items)) {
// //                     return po.items.map((item: any) => ({
// //                         ...item,
// //                         poId: po.id,
// //                         poDate: po.poDate,
// //                         quantityReceived: 0,
// //                         price: item.price || 0
// //                     }));
// //                 }
// //                 return [];
// //             });
// //             console.log("Setting filtered items:", items);
// //             setFilteredItems(items);
// //         } else {
// //             setFilteredItems([]);
// //         }

// //     }, [getWeavingContractByIdList]);

// //     const handleWContactChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
// //         const weavingContractId = parseInt(e.target.value);
// //         console.log("Selected vendor ID:", weavingContractId);
// //         setFilteredItems([]); // Clear items when vendor changes

// //         if (weavingContractId) {
// //             try {
// //                 const result = await dispatch(getWeavingContractById(weavingContractId));
// //                 const weavingContract = result?.payload;

// //                 console.log("API Response:", weavingContract);

// //                 if (weavingContract?.items) {
// //                     setFilteredItems(weavingContract.items);
// //                     console.log("Filtered:", filteredItems);
// //                 } else {
// //                     console.warn("No items found in weaving contract.");
// //                 }
// //             } catch (error) {
// //                 console.error("Error fetching weaving contract:", error);
// //             }
// //         }
// //     };


// //     const handleFilter = () => {
// //         if (!getWeavingContractByIdList || !Array.isArray(getWeavingContractByIdList)) {
// //             console.log("No valid data to filter");
// //             return;
// //         }

// //         const poNo = watch("poNo");
// //         const poDate = watch("poDate");

// //         console.log("Filtering with:", { poNo, poDate });

// //         const filtered = getWeavingContractByIdList
// //             .filter((po: any) =>
// //                 (!poNo || po.id.toString() === poNo) &&
// //                 (!poDate || po.poDate === poDate)
// //             )
// //             .flatMap((po: any) => {
// //                 if (po.items && Array.isArray(po.items)) {
// //                     return po.items.map((item: any) => ({
// //                         ...item,
// //                         poId: po.id,
// //                         poDate: po.poDate,
// //                         quantityReceived: 0,
// //                         price: item.price || 0
// //                     }));
// //                 }
// //                 return [];
// //             });

// //         console.log("Filtered items:", filtered);
// //         setFilteredItems(filtered);
// //     };

// //     const handleItemSelect = (item: any) => {
// //         const formValues = watch(); // Get current form values
// //         setSelectedItems((prevSelected: any[]) => {
// //             const isSelected = prevSelected.some(
// //                 (selected) => selected.id === item.id 
// //             );

// //             if (isSelected) {
// //                 return prevSelected.filter(
// //                     (selected) => !(selected.id === item.id )
// //                 );
// //             } else {
// //                 return [
// //                     ...prevSelected,
// //                     {
// //                         ...item,
// //                         quantityReceived: item.quantityReceived || 0,
// //                         price: item.price || 0,
// //                         weavingContractId: formValues.weavingContractId || 0,
// //                         vendorId: formValues.vendorId || 0,
// //                         // jobFabricReceiveDate: formValues.jobFabricReceiveDate,
// //                         jobFabricReceiveDate: new Date(formValues.jobFabricReceiveDate).toISOString(),
// //                         weavingContractItemId: item.id,
// //                         remarks: formValues.remarks || "",
// //                         activeFlag: true
// //                     }
// //                 ];
// //             }
// //         });
// //     };

// //     const navigateToLotDetails = () => {
// //         if (selectedItems.length === 0) {
// //             return;
// //         }
// //         navigate("/transaction/piece-details", { state: { selectedItems } });
// //     };

// //     const handleInputChange = (index: number, field: string, value: string) => {
// //         // Update the filtered items
// //         const updatedItems = [...filteredItems];
// //         updatedItems[index] = {
// //             ...updatedItems[index],
// //             [field]: value
// //         };
// //         setFilteredItems(updatedItems);

// //         // Also update the selected items if this item is selected
// //         setSelectedItems((prevSelected: any[]) => {
// //             const item = filteredItems[index];
// //             const isSelected = prevSelected.some(
// //                 (selected) => selected.id === item.id 
// //             );

// //             if (isSelected) {
// //                 return prevSelected.map((selected) =>
// //                     selected.id === item.id 
// //                         ? { ...selected, [field]: value }
// //                         : selected
// //                 );
// //             }
// //             return prevSelected;
// //         });
// //     };

// //     return (
// //         <div className="mt-10 p-6 bg-white shadow-md rounded-lg">
// //             <div className="flex justify-between items-center border-b pb-4">
// //                 <h2 className="text-2xl font-semibold">Jobwork Fabric Receive</h2>
// //                 <div className="space-x-2">
// //                     <Button
// //                         onClick={navigateToLotDetails}
// //                         className="bg-blue-600 hover:bg-blue-700 text-white px-6"
// //                     >
// //                         Create Piece
// //                     </Button>
// //                     {/* <Button className="bg-green-600 hover:bg-green-700 text-white px-6 flex items-center">
// //             <Save size={18} className="mr-2" /> Save
// //           </Button> */}
// //                 </div>
// //             </div>
// //             <div className="space-y-6">
// //                 <Card>
// //                     <CardHeader>
// //                         <CardTitle className="flex items-center gap-2">
// //                             <FileText size={20} /> Weaving Contract Details
// //                         </CardTitle>
// //                     </CardHeader>
// //                     <CardContent className="grid grid-cols-4 gap-8">
// //                         <div>
// //                             <label className="block text-sm font-medium">Vendor Name</label>
// //                             <select
// //                                 {...register("vendorId")}
// //                                 className="input mt-1"
// //                             >
// //                                 <option value="">Select a Vendor</option>
// //                                 {vendorList.map((vendor: any) => (
// //                                     <option key={vendor.id} value={vendor.id}>
// //                                         {vendor.vendorName}
// //                                     </option>
// //                                 ))}
// //                             </select>
// //                         </div>
// //                         <div>
// //                             <label className="block text-sm font-medium">Weaving Contract No</label>
// //                             <select {...register("weavingContractId")} className="input mt-1" onChange={handleWContactChange}>
// //                                 <option value="">Select a Weaving Contract No</option>
// //                                 {weavingContractList?.map((wc: any) => (
// //                                     <option key={wc.id} value={wc.id}>{wc.weavingContractNo}</option>
// //                                 ))}
// //                             </select>
// //                         </div>
// //                         {/* <div>
// //                             <label className="block text-sm font-medium">Date</label>
// //                             <input {...register("jobFabricReceiveDate")} type="date" className="input mt-1" onChange={handleFilter} />
// //                         </div> */}
// //                         <div>
// //                             <label className="block text-sm font-medium">Date</label>
// //                             <input {...register("jobFabricReceiveDate")} type="date" className="input mt-1" />
// //                         </div>
// //                         <div>
// //                             <label className="block text-sm font-medium text-secondary-700">Remarks</label>
// //                             <input placeholder="Remarks" {...register("remarks")} className="input mt-1" />
// //                         </div>
// //                     </CardContent>
// //                 </Card>

// //                 <Card>
// //                     <CardHeader>
// //                         <CardTitle className="flex items-center gap-2">
// //                             <ClipboardList size={20} /> Item Details
// //                         </CardTitle>
// //                     </CardHeader>
// //                     <CardContent>
// //                         <div className="mb-4">
// //                             {filteredItems.length === 0 && (
// //                                 <p className="text-gray-500 text-center">No items to display. Please select a vendor.</p>
// //                             )}
// //                         </div>
// //                         {filteredItems.length > 0 && (

// //                             <table className="w-full border-collapse border border-gray-300 text-center">
// //                                 <thead className="bg-gray-100">
// //                                     <tr>
// //                                         <th className="border p-2">Select</th>
// //                                         <th className="border p-2">Line Item No</th>
// //                                         <th className="border p-2">Quality</th>
// //                                         <th className="border p-2">Quantity Received</th>
// //                                         <th className="border p-2">Price</th>
// //                                     </tr>
// //                                 </thead>
// //                                 <tbody>
// //                                     {filteredItems.map((item: any, index: number) => (
// //                                         <tr key={`${item.poId}-${item.id}`} className="border">
// //                                             <td className="border p-2">
// //                                                 <input
// //                                                     type="checkbox"
// //                                                     onChange={() => handleItemSelect(item)}
// //                                                     checked={selectedItems.some(
// //                                                         (selected: any) =>
// //                                                             selected.id === item.id 
// //                                                     )}
// //                                                     className="w-4 h-4"
// //                                                 />
// //                                             </td>
// //                                             <td className="border p-2">{index + 1}</td>
// //                                             <td className="border p-2">{item.quality || item.quantity}</td>
// //                                             <td className="border p-2">
// //                                                 <input
// //                                                     type="number"
// //                                                     min="0"
// //                                                     max={item.quantity}
// //                                                     className="w-30 border p-1"
// //                                                     value={item.quantityReceived || ''}
// //                                                     onChange={(e) =>
// //                                                         handleInputChange(index, "quantityReceived", e.target.value)
// //                                                     }
// //                                                 />
// //                                             </td>
// //                                             <td className="border p-2">
// //                                                 <input
// //                                                     type="number"
// //                                                     min="0"
// //                                                     step="0.01"
// //                                                     className="w-30 border p-1"
// //                                                     value={item.price || ''}
// //                                                     onChange={(e) => handleInputChange(index, "price", e.target.value)}
// //                                                 />
// //                                             </td>
// //                                         </tr>
// //                                     ))}
// //                                 </tbody>
// //                             </table>
// //                         )}
// //                     </CardContent>
// //                 </Card>
// //             </div>
// //         </div>
// //     );
// // };

// // export default JobworkFabricReceive;



// import React, { useEffect, useState } from "react";
// import { FileText, ClipboardList, Edit, Trash2, Save } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useForm } from "react-hook-form";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/state/store";
// import { getAllVendors } from "@/state/vendorSlice";
// import { getAllProductCategory } from "@/state/productCategorySlice";
// import { useNavigate } from "react-router-dom";
// import { getAllWeavingContract, getWeavingContractById } from "@/state/weavingContractSlice";
// import { toast } from "react-toastify";

// interface WeavingContractFormData {
//     weavingContractId: string;
//     vendorId: string;
//     jobFabricReceiveDate: string;
//     remarks: string;
//     activeFlag?: boolean;
// }

// const JobworkFabricReceive = () => {
//     const dispatch = useDispatch<AppDispatch>();
//     const navigate = useNavigate();
//     const {
//         register,
//         watch,
//         handleSubmit,
//         formState: { errors },
//         trigger
//     } = useForm<WeavingContractFormData>({
//         mode: 'onChange'
//     });
//     const [filteredItems, setFilteredItems]: any = useState([]);
//     const [selectedItems, setSelectedItems]: any = useState([]);
//     const { vendorList } = useSelector((state: RootState) => state.vendor);
//     const { weavingContractList } = useSelector((state: RootState) => state.weavingContracts);
//     const { getWeavingContractByIdList } = useSelector((state: RootState) => state.weavingContracts);

//     useEffect(() => {
//         dispatch(getAllVendors({}));
//         dispatch(getAllProductCategory({}));
//         dispatch(getAllWeavingContract({}));
//     }, [dispatch]);

//     useEffect(() => {
//         if (getWeavingContractByIdList && Array.isArray(getWeavingContractByIdList)) {
//             const items = getWeavingContractByIdList.flatMap((po: any) => {
//                 if (po.items && Array.isArray(po.items)) {
//                     return po.items.map((item: any) => ({
//                         ...item,
//                         // poId: po.id,
//                         poDate: po.poDate,
//                         quantityReceived: 0,
//                         price: item.price || 0
//                     }));
//                 }
//                 return [];
//             });
//             setFilteredItems(items);
//         } else {
//             setFilteredItems([]);
//         }
//     }, [getWeavingContractByIdList]);

//     const validateForm = async () => {
//         const isValid = await trigger([
//             'vendorId',
//             'weavingContractId',
//             'jobFabricReceiveDate'
//         ]);
//         return isValid;
//     };

//     const handleWContactChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
//         const weavingContractId = parseInt(e.target.value);
//         setFilteredItems([]);

//         if (weavingContractId) {
//             try {
//                 const result = await dispatch(getWeavingContractById(weavingContractId));
//                 const weavingContract = result?.payload;

//                 if (weavingContract?.items) {
//                     setFilteredItems(weavingContract.items);
//                 } else {
//                     toast.warning("No items found in weaving contract.");
//                 }
//             } catch (error) {
//                 toast.error("Error fetching weaving contract");
//                 console.error("Error fetching weaving contract:", error);
//             }
//         }
//     };

//     const handleItemSelect = (item: any) => {
//         const formValues = watch();

//         // Validate required fields before allowing item selection
//         if (!formValues.vendorId || !formValues.weavingContractId || !formValues.jobFabricReceiveDate) {
//             toast.error("Please fill all required fields before selecting items");
//             return;
//         }

//         setSelectedItems((prevSelected: any[]) => {
//             const isSelected = prevSelected.some(
//                 (selected) => selected.id === item.id
//             );

//             if (isSelected) {
//                 return prevSelected.filter(
//                     (selected) => !(selected.id === item.id)
//                 );
//             } else {
//                 return [
//                     ...prevSelected,
//                     {
//                         ...item,
//                         quantityReceived: item.quantityReceived || 0,
//                         price: item.price || 0,
//                         weavingContractId: formValues.weavingContractId,
//                         vendorId: formValues.vendorId,
//                         jobFabricReceiveDate: new Date(formValues.jobFabricReceiveDate).toISOString(),
//                         weavingContractItemId: item.id,
//                         remarks: formValues.remarks || "",
//                         activeFlag: true
//                     }
//                 ];
//             }
//         });
//     };

//     const navigateToLotDetails = async () => {
//         // Validate form fields first
//         const isFormValid = await validateForm();

//         if (!isFormValid) {
//             toast.error("Please fill all required fields");
//             return;
//         }

//         if (selectedItems.length === 0) {
//             toast.error("Please select at least one item");
//             return;
//         }

//         // Validate each selected item
//         const invalidItems = selectedItems.filter((item: any) => {
//             return !item.quantityReceived ||
//                 Number(item.quantityReceived) <= 0 ||
//                 Number(item.quantityReceived) > Number(item.quantity);
//         });

//         if (invalidItems.length > 0) {
//             toast.error("Please enter valid quantities for all selected items");
//             return;
//         }

//         navigate("/transaction/piece-details", { state: { selectedItems } });
//     };

//     const handleInputChange = (index: number, field: string, value: string) => {
//         // Validate quantity is not greater than available
//         if (field === 'quantityReceived') {
//             const maxQuantity = filteredItems[index].quantity;
//             if (Number(value) > Number(maxQuantity)) {
//                 toast.warning(`Cannot receive more than ${maxQuantity}`);
//                 value = maxQuantity;
//             }
//             if (Number(value) < 0) {
//                 value = '0';
//             }
//         }

//         // Update the filtered items
//         const updatedItems = [...filteredItems];
//         updatedItems[index] = {
//             ...updatedItems[index],
//             [field]: value
//         };
//         setFilteredItems(updatedItems);

//         // Update the selected items if this item is selected
//         setSelectedItems((prevSelected: any[]) => {
//             const item = filteredItems[index];
//             const isSelected = prevSelected.some(
//                 (selected) => selected.id === item.id
//             );

//             if (isSelected) {
//                 return prevSelected.map((selected) =>
//                     selected.id === item.id
//                         ? { ...selected, [field]: value }
//                         : selected
//                 );
//             }
//             return prevSelected;
//         });
//     };

//     return (
//         <div className="mt-10 p-6 bg-white shadow-md rounded-lg">
//             <div className="flex justify-between items-center border-b pb-4">
//                 <h2 className="text-2xl font-semibold">Jobwork Fabric Receive</h2>
//                 <div className="space-x-2">
//                     <Button
//                         onClick={navigateToLotDetails}
//                         className="bg-blue-600 hover:bg-blue-700 text-white px-6"
//                         disabled={selectedItems.length === 0}
//                     >
//                         Create Piece
//                     </Button>
//                 </div>
//             </div>
//             <div className="space-y-6 mt-10">
//                 <Card>
//                     <CardHeader>
//                         <CardTitle className="flex items-center gap-2">
//                             <FileText size={20} /> Weaving Contract Details
//                         </CardTitle>
//                     </CardHeader>
//                     <CardContent className="grid grid-cols-4 gap-8">
//                         <div>
//                             <label className="block text-sm font-medium">
//                                 Vendor Name <span className="text-red-500">*</span>
//                             </label>
//                             <select
//                                 {...register("vendorId", { required: "Vendor is required" })}
//                                 className={`input mt-1 ${errors.vendorId ? 'border-red-500' : ''}`}
//                             >
//                                 <option value="">Select a Vendor</option>
//                                 {vendorList.map((vendor: any) => (
//                                     <option key={vendor.id} value={vendor.id}>
//                                         {vendor.vendorName}
//                                     </option>
//                                 ))}
//                             </select>
//                             {errors.vendorId && (
//                                 <p className="mt-1 text-sm text-red-600">{errors.vendorId.message}</p>
//                             )}
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium">
//                                 Weaving Contract No <span className="text-red-500">*</span>
//                             </label>
//                             <select
//                                 {...register("weavingContractId", { required: "Weaving Contract is required" })}
//                                 className={`input mt-1 ${errors.weavingContractId ? 'border-red-500' : ''}`}
//                                 onChange={handleWContactChange}
//                             >
//                                 <option value="">Select a Weaving Contract No</option>
//                                 {weavingContractList?.map((wc: any) => (
//                                     <option key={wc.id} value={wc.id}>{wc.weavingContractNo}</option>
//                                 ))}
//                             </select>
//                             {errors.weavingContractId && (
//                                 <p className="mt-1 text-sm text-red-600">{errors.weavingContractId.message}</p>
//                             )}
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium">
//                                 Date <span className="text-red-500">*</span>
//                             </label>
//                             <input
//                                 {...register("jobFabricReceiveDate", {
//                                     required: "Date is required",
//                                 })}
//                                 type="date"
//                                 className={`input mt-1 ${errors.jobFabricReceiveDate ? 'border-red-500' : ''}`}
//                             // max={new Date().toISOString().split('T')[0]}
//                             />
//                             {errors.jobFabricReceiveDate && (
//                                 <p className="mt-1 text-sm text-red-600">{errors.jobFabricReceiveDate.message}</p>
//                             )}
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-secondary-700">Remarks</label>
//                             <input
//                                 placeholder="Remarks"
//                                 {...register("remarks")}
//                                 className="input mt-1"
//                                 maxLength={255}
//                             />
//                         </div>
//                     </CardContent>
//                 </Card>

//                 <Card>
//                     <CardHeader>
//                         <CardTitle className="flex items-center gap-2">
//                             <ClipboardList size={20} /> Item Details
//                         </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         {filteredItems.length === 0 ? (
//                             <p className="text-gray-500 text-center py-4">
//                                 {watch("weavingContractId") ?
//                                     "No items found for selected weaving contract" :
//                                     "Please select a weaving contract to view items"}
//                             </p>
//                         ) : (
//                             <div className="overflow-x-auto">
//                                 <table className="w-full border-collapse border border-gray-300 text-center">
//                                     <thead className="bg-gray-100">
//                                         <tr>
//                                             <th className="border p-2">Select</th>
//                                             <th className="border p-2">Line Item No</th>
//                                             <th className="border p-2">Quality</th>
//                                             <th className="border p-2">Available Quantity</th>
//                                             <th className="border p-2">Quantity Received</th>
//                                             <th className="border p-2">Price</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {filteredItems.map((item: any, index: number) => (
//                                             <tr key={`${item.poId}-${item.id}`} className="border">
//                                                 <td className="border p-2">
//                                                     <input
//                                                         type="checkbox"
//                                                         onChange={() => handleItemSelect(item)}
//                                                         checked={selectedItems.some(
//                                                             (selected: any) =>
//                                                                 selected.id === item.id
//                                                         )}
//                                                         className="w-4 h-4"
//                                                         disabled={!watch("vendorId") || !watch("weavingContractId") || !watch("jobFabricReceiveDate")}
//                                                     />
//                                                 </td>
//                                                 <td className="border p-2">{index + 1}</td>
//                                                 <td className="border p-2">{item.quality || item.fabricName || 'N/A'}</td>
//                                                 <td className="border p-2">{item.quantity}</td>
//                                                 <td className="border p-2">
//                                                     <input
//                                                         type="number"
//                                                         min="0"
//                                                         max={item.quantity}
//                                                         className={`w-30 border p-1 ${selectedItems.some((selected: any) =>
//                                                             selected.id === item.id &&
//                                                             (!selected.quantityReceived || Number(selected.quantityReceived) <= 0)
//                                                         ) ? 'border-red-500' : ''}`}
//                                                         value={item.quantityReceived || ''}
//                                                         onChange={(e) =>
//                                                             handleInputChange(index, "quantityReceived", e.target.value)
//                                                         }
//                                                         disabled={!selectedItems.some(
//                                                             (selected: any) =>
//                                                                 selected.id === item.id
//                                                         )}
//                                                     />
//                                                 </td>
//                                                 <td className="border p-2">
//                                                     <input
//                                                         type="number"
//                                                         min="0"
//                                                         step="0.01"
//                                                         className="w-30 border p-1"
//                                                         value={item.price || ''}
//                                                         onChange={(e) => handleInputChange(index, "price", e.target.value)}
//                                                         disabled={!selectedItems.some(
//                                                             (selected: any) =>
//                                                                 selected.id === item.id
//                                                         )}
//                                                     />
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}
//                     </CardContent>
//                 </Card>
//             </div>
//         </div>
//     );
// };

// export default JobworkFabricReceive;





import React, { useEffect, useState } from "react";
import { FileText, ClipboardList, Edit, Trash2, Save, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { getAllVendors } from "@/state/vendorSlice";
import { getAllProductCategory } from "@/state/productCategorySlice";
import { getAllWeavingContract, getWeavingContractById } from "@/state/weavingContractSlice";
import { createJobworkFabricReceive, updateJobworkFabricReceive, getJobworkFabricReceiveById } from '@/state/jobFabricReceiveSlice';
import { toast } from 'react-toastify';
import { useLocation, useNavigate, useParams } from "react-router-dom";

interface WeavingContractFormData {
    weavingContractId: string;
    vendorId: string;
    jobFabricReceiveDate: string;
    remarks: string;
    activeFlag?: boolean;
}

interface PieceEntry {
    id?: number;
    pieceNumber: string;
    quantity: number;
    weight: number;
    remarks: string;
    cost: number;
    activeFlag?: boolean;
}

interface FabricReceiveItem {
    id?: number;
    quantityReceived: number;
    price: number;
    activeFlag?: boolean;
    weavingContractItemId: number;
    pieceEntries: PieceEntry[];
}

interface JobworkFabricReceiveData {
    id?: number;
    weavingContractId: number;
    vendorId: number;
    jobFabricReceiveDate: string;
    remarks: string;
    activeFlag?: boolean;
    jobworkFabricReceiveItemsDtl: FabricReceiveItem[];
}

const JobworkFabricReceive = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
        trigger,
        reset
    } = useForm<WeavingContractFormData>({
        mode: 'onChange'
    });

    const [filteredItems, setFilteredItems] = useState<any[]>([]);
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [showPieceDetails, setShowPieceDetails] = useState(false);
    const [selectedItemForPieces, setSelectedItemForPieces] = useState<any>(null);
    const [pieceEntries, setPieceEntries] = useState<PieceEntry[]>([]);
    const [numberOfPieces, setNumberOfPieces] = useState<string>('0');
    const [pieceEntriesDraft, setPieceEntriesDraft] = useState<Partial<PieceEntry>[]>([]);
    const [editingPieceId, setEditingPieceId] = useState<number | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<JobworkFabricReceiveData>({
        weavingContractId: 0,
        vendorId: 0,
        jobFabricReceiveDate: new Date().toISOString().split('T')[0],
        remarks: '',
        activeFlag: true,
        jobworkFabricReceiveItemsDtl: []
    });

    const { vendorList } = useSelector((state: RootState) => state.vendor);
    const { weavingContractList } = useSelector((state: RootState) => state.weavingContracts);
    const { getWeavingContractByIdList } = useSelector((state: RootState) => state.weavingContracts);
    const location = useLocation();
    const jobworkFabricReceiveDtl = location.state?.record;
    // const { register, handleSubmit, reset, formState: { errors } } = useForm<WeavingContractFormData>();
    console.log("jobworkFabricReceiveDtl", jobworkFabricReceiveDtl)
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getAllVendors({}));
        dispatch(getAllProductCategory({}));
        dispatch(getAllWeavingContract({}));
    }, [dispatch]);


    // Add this useEffect to load data when editing an existing record
    useEffect(() => {
        if (jobworkFabricReceiveDtl) {
            setIsEditMode(true);

            // Set form values
            reset({
                vendorId: jobworkFabricReceiveDtl.vendorId.toString(),
                weavingContractId: jobworkFabricReceiveDtl.weavingContractId.toString(),
                jobFabricReceiveDate: jobworkFabricReceiveDtl.jobFabricReceiveDate.split('T')[0],
                remarks: jobworkFabricReceiveDtl.remarks
            });

            // Set the form data state
            setFormData({
                id: jobworkFabricReceiveDtl.id,
                weavingContractId: jobworkFabricReceiveDtl.weavingContractId,
                vendorId: jobworkFabricReceiveDtl.vendorId,
                jobFabricReceiveDate: jobworkFabricReceiveDtl.jobFabricReceiveDate,
                remarks: jobworkFabricReceiveDtl.remarks,
                activeFlag: jobworkFabricReceiveDtl.activeFlag,
                jobworkFabricReceiveItemsDtl: jobworkFabricReceiveDtl.items
            });

            // If there are items, set them for editing
            if (jobworkFabricReceiveDtl.items && jobworkFabricReceiveDtl.items.length > 0) {
                const firstItem = jobworkFabricReceiveDtl.items[0];
                setSelectedItemForPieces(firstItem);
                setPieceEntries(firstItem.pieceEntries || []);

                // Also set as selected item
                setSelectedItems([{
                    ...firstItem,
                    id: firstItem.weavingContractItemId,
                    quantityReceived: firstItem.quantityReceived,
                    price: firstItem.price,
                    weavingContractId: jobworkFabricReceiveDtl.weavingContractId,
                    vendorId: jobworkFabricReceiveDtl.vendorId,
                    jobFabricReceiveDate: jobworkFabricReceiveDtl.jobFabricReceiveDate,
                    weavingContractItemId: firstItem.weavingContractItemId,
                    remarks: jobworkFabricReceiveDtl.remarks,
                    activeFlag: true
                }]);

                // Load the weaving contract items for display
                dispatch(getWeavingContractById(jobworkFabricReceiveDtl.weavingContractId))
                    .then((result) => {
                        const weavingContract = result?.payload;
                        if (weavingContract?.items) {
                            const items = weavingContract.items.map((item: any) => ({
                                ...item,
                                quantityReceived: firstItem.weavingContractItemId === item.id ? firstItem.quantityReceived : 0,
                                price: firstItem.weavingContractItemId === item.id ? firstItem.price : item.price || 0
                            }));
                            setFilteredItems(items);
                        }
                    });
            }
        }
    }, [jobworkFabricReceiveDtl, reset, dispatch]);

    useEffect(() => {
        if (getWeavingContractByIdList && Array.isArray(getWeavingContractByIdList)) {
            const items = getWeavingContractByIdList.flatMap((po: any) => {
                if (po.items && Array.isArray(po.items)) {
                    return po.items.map((item: any) => ({
                        ...item,
                        poDate: po.poDate,
                        quantityReceived: 0,
                        price: item.price || 0
                    }));
                }
                return [];
            });
            setFilteredItems(items);
        } else {
            setFilteredItems([]);
        }
    }, [getWeavingContractByIdList]);

    const validateForm = async () => {
        const isValid = await trigger([
            'vendorId',
            'weavingContractId',
            'jobFabricReceiveDate'
        ]);
        return isValid;
    };

    const handleWContactChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const weavingContractId = parseInt(e.target.value);
        setFilteredItems([]);

        if (weavingContractId) {
            try {
                const result = await dispatch(getWeavingContractById(weavingContractId));
                const weavingContract = result?.payload;

                if (weavingContract?.items) {
                    setFilteredItems(weavingContract.items);
                } else {
                    toast.warning("No items found in weaving contract.");
                }
            } catch (error) {
                toast.error("Error fetching weaving contract");
                console.error("Error fetching weaving contract:", error);
            }
        }
    };

    const handleItemSelect = (item: any) => {
        const formValues = watch();

        if (!formValues.vendorId || !formValues.weavingContractId || !formValues.jobFabricReceiveDate) {
            toast.error("Please fill all required fields before selecting items");
            return;
        }

        setSelectedItems((prevSelected: any[]) => {
            const isSelected = prevSelected.some(
                (selected) => selected.id === item.id
            );

            if (isSelected) {
                return prevSelected.filter(
                    (selected) => !(selected.id === item.id)
                );
            } else {
                return [
                    ...prevSelected,
                    {
                        ...item,
                        quantityReceived: item.quantityReceived || 0,
                        price: item.price || 0,
                        weavingContractId: formValues.weavingContractId,
                        vendorId: formValues.vendorId,
                        jobFabricReceiveDate: new Date(formValues.jobFabricReceiveDate).toISOString(),
                        weavingContractItemId: item.id,
                        remarks: formValues.remarks || "",
                        activeFlag: true
                    }
                ];
            }
        });
    };

    const showPieceCreation = async () => {
        const isFormValid = await validateForm();

        if (!isFormValid) {
            toast.error("Please fill all required fields");
            return;
        }

        if (selectedItems.length === 0) {
            toast.error("Please select at least one item");
            return;
        }

        const invalidItems = selectedItems.filter((item: any) => {
            return !item.quantityReceived ||
                Number(item.quantityReceived) <= 0 ||
                Number(item.quantityReceived) > Number(item.quantity);
        });

        if (invalidItems.length > 0) {
            toast.error("Please enter valid quantities for all selected items");
            return;
        }

        // Set the first selected item for piece creation
        setSelectedItemForPieces(selectedItems[0]);
        setShowPieceDetails(true);

        // Initialize form data for piece creation
        setFormData({
            weavingContractId: Number(watch("weavingContractId")),
            vendorId: Number(watch("vendorId")),
            jobFabricReceiveDate: watch("jobFabricReceiveDate"),
            remarks: watch("remarks") || '',
            activeFlag: true,
            jobworkFabricReceiveItemsDtl: []
        });
    };

    const handleInputChange = (index: number, field: string, value: string) => {
        if (field === 'quantityReceived') {
            const maxQuantity = filteredItems[index].quantity;
            if (Number(value) > Number(maxQuantity)) {
                toast.warning(`Cannot receive more than ${maxQuantity}`);
                value = maxQuantity;
            }
            if (Number(value) < 0) {
                value = '0';
            }
        }

        const updatedItems = [...filteredItems];
        updatedItems[index] = {
            ...updatedItems[index],
            [field]: value
        };
        setFilteredItems(updatedItems);

        setSelectedItems((prevSelected: any[]) => {
            const item = filteredItems[index];
            const isSelected = prevSelected.some(
                (selected) => selected.id === item.id
            );

            if (isSelected) {
                return prevSelected.map((selected) =>
                    selected.id === item.id
                        ? { ...selected, [field]: value }
                        : selected
                );
            }
            return prevSelected;
        });
    };

    const handleAddPieces = () => {
        const count = parseInt(numberOfPieces || '0', 10);
        if (isNaN(count) || count <= 0) {
            toast.warning("Please enter a valid number of pieces");
            return;
        }

        const newDrafts = Array.from({ length: count }, (_, index) => ({
            id: pieceEntries.length + pieceEntriesDraft.length + index + 1,
            pieceNumber: `P-${pieceEntries.length + pieceEntriesDraft.length + index + 1}`,
            quantity: 0,
            weight: 0,
            cost: 0,
            remarks: ''
        }));

        setPieceEntriesDraft([...pieceEntriesDraft, ...newDrafts]);
        setNumberOfPieces('0');
    };

    const updatePieceEntry = (index: number, key: keyof PieceEntry, value: any) => {
        const updated = [...pieceEntriesDraft];
        updated[index] = { ...updated[index], [key]: value };
        setPieceEntriesDraft(updated);
    };

    const handleAddLot = () => {
        const validEntries = pieceEntriesDraft.filter(e => e.quantity && e.quantity > 0);
        if (!validEntries.length) {
            toast.warning("Please enter valid quantities for all pieces");
            return;
        }

        const entriesToAdd: PieceEntry[] = validEntries.map((entry, i) => ({
            id: editingPieceId || pieceEntries.length + i + 1,
            pieceNumber: entry.pieceNumber || `P-${pieceEntries.length + i + 1}`,
            quantity: entry.quantity || 0,
            weight: entry.weight || 0,
            remarks: entry.remarks || '',
            cost: entry.cost || 0,
            activeFlag: true
        }));

        setPieceEntries([...pieceEntries, ...entriesToAdd]);
        setPieceEntriesDraft([]);
        setEditingPieceId(null);
        setNumberOfPieces('0');
    };

    const handleDeleteLot = (id: number) => {
        setPieceEntries(pieceEntries.filter(entry => entry.id !== id));
    };

    const handleEditLot = (entry: PieceEntry) => {
        setEditingPieceId(entry.id || null);
        setPieceEntriesDraft([{ ...entry }]);
        handleDeleteLot(entry.id || 0);
    };

    // Update the handleSave function to handle both create and update
    const handleSave = async () => {
        if (!selectedItemForPieces) return;

        if (pieceEntries.length === 0) {
            toast.error("Please add at least one piece entry");
            return;
        }

        const totalPieceQuantity = pieceEntries.reduce((sum, entry) => sum + entry.quantity, 0);
        if (totalPieceQuantity > selectedItemForPieces.quantityReceived) {
            toast.error(`Total piece quantity (${totalPieceQuantity}) exceeds received quantity (${selectedItemForPieces.quantityReceived})`);
            return;
        }

        const payload: JobworkFabricReceiveData = {
            ...formData,
            jobworkFabricReceiveItemsDtl: [{
                id: selectedItemForPieces.id, // Include ID if in edit mode
                quantityReceived: selectedItemForPieces.quantityReceived,
                price: selectedItemForPieces.price,
                activeFlag: true,
                weavingContractItemId: selectedItemForPieces.weavingContractItemId,
                pieceEntries: pieceEntries.map(entry => ({
                    ...entry,
                    id: entry.id || undefined // Send undefined for new entries
                }))
            }]
        };

        try {
            setIsLoading(true);
            if (isEditMode && formData.id) {
                await dispatch(updateJobworkFabricReceive({
                    id: formData.id,
                    data: payload
                })).unwrap();
                // toast.success("Record updated successfully");
                navigate("/transaction/jobwork-fabric-details");
            } else {
                await dispatch(createJobworkFabricReceive(payload)).unwrap();
                // toast.success("Record created successfully");
                navigate("/transaction/jobwork-fabric-details");
            }

            // Reset the form after successful save
            setShowPieceDetails(false);
            setPieceEntries([]);
            setSelectedItems([]);
            reset();
        } catch (error) {
            console.error('Failed to save record:', error);
            toast.error("Failed to save record");
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToForm = () => {
        setShowPieceDetails(false);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div>Loading...</div>
            </div>
        );
    }

    if (showPieceDetails) {
        return (
            <div className="mt-10 p-6 bg-white shadow-md rounded-lg">
                <ArrowLeft
                    onClick={handleBackToForm}
                    className="h-6 w-6 text-gray-500 hover:text-gray-600 cursor-pointer"
                />
                <div className="flex justify-between items-center border-b pb-4">
                    <h2 className="text-2xl font-semibold">
                        {isEditMode ? 'Edit' : 'Create'} Piece Details
                    </h2>
                    <div className="space-x-2">
                        {/* <Button
                            onClick={handleBackToForm}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-6"
                        >
                            Back
                        </Button> */}
                        <Button
                            onClick={handleSave}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 flex items-center"
                            disabled={isLoading}
                        >
                            <Save size={18} className="mr-2" />
                            {isEditMode ? 'Edit' : 'Create'} Jobwork Fabric Receive
                        </Button>
                    </div>
                </div>

                <div className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText size={20} /> Contract Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Weaving Contract ID</label>
                                <input
                                    value={formData.weavingContractId}
                                    disabled
                                    className="input mt-1 bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Vendor ID</label>
                                <input
                                    value={formData.vendorId}
                                    disabled
                                    className="input mt-1 bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Receive Date</label>
                                <input
                                    type="date"
                                    value={formData.jobFabricReceiveDate}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        jobFabricReceiveDate: e.target.value
                                    })}
                                    className="input mt-1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Quality</label>
                                <input
                                    value={selectedItemForPieces.quality || selectedItemForPieces.fabricName || 'N/A'}
                                    disabled
                                    className="input mt-1 bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Order Quantity</label>
                                <input
                                    value={selectedItemForPieces.quantity}
                                    disabled
                                    className="input mt-1 bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Received Quantity</label>
                                <input
                                    value={selectedItemForPieces.quantityReceived}
                                    disabled={isEditMode}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        setSelectedItemForPieces({
                                            ...selectedItemForPieces,
                                            quantityReceived: value
                                        });
                                    }}
                                    className="input mt-1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Price</label>
                                <input
                                    type="number"
                                    value={selectedItemForPieces.price}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        setSelectedItemForPieces({
                                            ...selectedItemForPieces,
                                            price: value
                                        });
                                    }}
                                    className="input mt-1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Remarks</label>
                                <input
                                    value={formData.remarks}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        remarks: e.target.value
                                    })}
                                    className="input mt-1"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ClipboardList size={20} /> Piece Entry
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium">Number of Pieces</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={numberOfPieces}
                                            onChange={(e) => setNumberOfPieces(e.target.value)}
                                            className="input mt-1"
                                        />
                                    </div>
                                    <Button
                                        onClick={handleAddPieces}
                                        className="bg-blue-500 hover:bg-blue-600 text-white mt-6"
                                    >
                                        <Plus size={18} className="mr-2" /> Add Pieces
                                    </Button>
                                </div>
                            </div>

                            {pieceEntriesDraft.map((entry, index) => (
                                <div key={index} className="grid grid-cols-5 gap-4 mb-4 p-4 border rounded">
                                    <div>
                                        <label className="block text-sm font-medium">Piece Number</label>
                                        <input
                                            value={entry.pieceNumber}
                                            onChange={(e) => updatePieceEntry(index, 'pieceNumber', e.target.value)}
                                            className="input mt-1"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">Quantity</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={entry.quantity || ''}
                                            onChange={(e) => updatePieceEntry(index, 'quantity', parseInt(e.target.value))}
                                            className="input mt-1"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">Weight</label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={entry.weight || ''}
                                            onChange={(e) => updatePieceEntry(index, 'weight', parseFloat(e.target.value))}
                                            className="input mt-1"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">Cost</label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={entry.cost || ''}
                                            onChange={(e) => updatePieceEntry(index, 'cost', parseFloat(e.target.value))}
                                            className="input mt-1"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">Remarks</label>
                                        <input
                                            value={entry.remarks || ''}
                                            onChange={(e) => updatePieceEntry(index, 'remarks', e.target.value)}
                                            className="input mt-1"
                                        />
                                    </div>
                                </div>
                            ))}

                            <div className="flex justify-end mb-4">
                                <Button
                                    onClick={handleAddLot}
                                    className="bg-green-500 hover:bg-green-600 text-white"
                                    disabled={pieceEntriesDraft.length === 0}
                                >
                                    {editingPieceId ? 'Update Piece' : 'Add to List'}
                                </Button>
                            </div>

                            <div className="border rounded overflow-hidden">
                                <table className="w-full border-collapse">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="border p-2">Sl.No</th>
                                            <th className="border p-2">Piece Number</th>
                                            <th className="border p-2">Quantity</th>
                                            <th className="border p-2">Weight</th>
                                            <th className="border p-2">Cost</th>
                                            <th className="border p-2">Remarks</th>
                                            <th className="border p-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pieceEntries.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="border p-4 text-center text-gray-500">
                                                    No piece entries added yet
                                                </td>
                                            </tr>
                                        ) : (
                                            pieceEntries.map((entry, index) => (
                                                <tr key={entry.id}>
                                                    <td className="border p-2">{index + 1}</td>
                                                    <td className="border p-2">{entry.pieceNumber}</td>
                                                    <td className="border p-2">{entry.quantity}</td>
                                                    <td className="border p-2">{entry.weight}</td>
                                                    <td className="border p-2">{entry.cost}</td>
                                                    <td className="border p-2">{entry.remarks}</td>
                                                    <td className="border p-2">
                                                        <div className="flex justify-center gap-2">
                                                            <Button
                                                                onClick={() => handleEditLot(entry)}
                                                                className="p-1 h-8 w-8"
                                                                variant="outline"
                                                            >
                                                                <Edit size={16} />
                                                            </Button>
                                                            <Button
                                                                onClick={() => handleDeleteLot(entry.id || 0)}
                                                                className="p-1 h-8 w-8 bg-red-600 hover:bg-red-700"
                                                            >
                                                                <Trash2 size={16} />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-10 p-6 bg-white shadow-md rounded-lg">
            <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-2xl font-semibold">Jobwork Fabric Receive</h2>
                <div className="space-x-2">
                    {/* <Button
                        onClick={showPieceCreation}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                        disabled={selectedItems.length === 0}
                    >
                        Create Piece
                    </Button> */}
                    <Button
                        onClick={showPieceCreation}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                        disabled={selectedItems.length === 0}
                    >
                        {isEditMode ? 'Edit Piece' : 'Create Piece'}
                    </Button>
                </div>
            </div>
            <div className="space-y-6 mt-10">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText size={20} /> Weaving Contract Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-4 gap-8">
                        <div>
                            <label className="block text-sm font-medium">
                                Vendor Name <span className="text-red-500">*</span>
                            </label>
                            <select
                                {...register("vendorId", { required: "Vendor is required" })}
                                className={`input mt-1 ${errors.vendorId ? 'border-red-500' : ''}`}
                            >
                                <option value="">Select a Vendor</option>
                                {vendorList.map((vendor: any) => (
                                    <option key={vendor.id} value={vendor.id}>
                                        {vendor.vendorName}
                                    </option>
                                ))}
                            </select>
                            {errors.vendorId && (
                                <p className="mt-1 text-sm text-red-600">{errors.vendorId.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium">
                                Weaving Contract No <span className="text-red-500">*</span>
                            </label>
                            <select
                                {...register("weavingContractId", { required: "Weaving Contract is required" })}
                                className={`input mt-1 ${errors.weavingContractId ? 'border-red-500' : ''}`}
                                onChange={handleWContactChange}
                            >
                                <option value="">Select a Weaving Contract No</option>
                                {weavingContractList?.map((wc: any) => (
                                    <option key={wc.id} value={wc.id}>{wc.weavingContractNo}</option>
                                ))}
                            </select>
                            {errors.weavingContractId && (
                                <p className="mt-1 text-sm text-red-600">{errors.weavingContractId.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium">
                                Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register("jobFabricReceiveDate", {
                                    required: "Date is required",
                                })}
                                type="date"
                                className={`input mt-1 ${errors.jobFabricReceiveDate ? 'border-red-500' : ''}`}
                            />
                            {errors.jobFabricReceiveDate && (
                                <p className="mt-1 text-sm text-red-600">{errors.jobFabricReceiveDate.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-secondary-700">Remarks</label>
                            <input
                                placeholder="Remarks"
                                {...register("remarks")}
                                className="input mt-1"
                                maxLength={255}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ClipboardList size={20} /> Item Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {filteredItems.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">
                                {watch("weavingContractId") ?
                                    "No items found for selected weaving contract" :
                                    "Please select a weaving contract to view items"}
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-300 text-center">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="border p-2">Select</th>
                                            <th className="border p-2">Line Item No</th>
                                            <th className="border p-2">Quality</th>
                                            <th className="border p-2">Available Quantity</th>
                                            <th className="border p-2">Quantity Received</th>
                                            <th className="border p-2">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredItems.map((item: any, index: number) => (
                                            <tr key={`${item.poId}-${item.id}`} className="border">
                                                <td className="border p-2">
                                                    <input
                                                        type="checkbox"
                                                        onChange={() => handleItemSelect(item)}
                                                        checked={selectedItems.some(
                                                            (selected: any) =>
                                                                selected.id === item.id
                                                        )}
                                                        className="w-4 h-4"
                                                    // disabled={!watch("vendorId") || !watch("weavingContractId") || !watch("jobFabricReceiveDate")}
                                                    />
                                                </td>
                                                <td className="border p-2">{index + 1}</td>
                                                <td className="border p-2">{item.quality || item.fabricName || 'N/A'}</td>
                                                <td className="border p-2">{item.quantity}</td>
                                                <td className="border p-2">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max={item.quantity}
                                                        className={`w-30 border p-1 ${selectedItems.some((selected: any) =>
                                                            selected.id === item.id &&
                                                            (!selected.quantityReceived || Number(selected.quantityReceived) <= 0)
                                                        ) ? 'border-red-500' : ''}`}
                                                        value={item.quantityReceived || ''}
                                                        onChange={(e) =>
                                                            handleInputChange(index, "quantityReceived", e.target.value)
                                                        }
                                                        disabled={!selectedItems.some(
                                                            (selected: any) =>
                                                                selected.id === item.id
                                                        )}
                                                    />
                                                </td>
                                                <td className="border p-2">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        className="w-30 border p-1"
                                                        value={item.price || ''}
                                                        onChange={(e) => handleInputChange(index, "price", e.target.value)}
                                                        disabled={!selectedItems.some(
                                                            (selected: any) =>
                                                                selected.id === item.id
                                                        )}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default JobworkFabricReceive;
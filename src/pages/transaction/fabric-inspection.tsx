// import React, { useEffect, useState } from "react";
// import { FileText, ShoppingCart, ClipboardList, Edit, Trash2, Save, Plus } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useForm } from "react-hook-form";
// import { Checkbox } from "@/components/ui/checkbox";
// import { createPurchaseOrder, getAllPoTypes, getAllPurchaseOrders, updatePurchaseOrder } from "@/state/purchaseOrderSlice";
// import { AppDispatch, RootState } from "@/state/store";
// import { useDispatch, useSelector } from "react-redux";
// import { getAllCustomers } from "@/state/customerSlice";
// import { getAllProductCategory } from "@/state/productCategorySlice";
// import { createFabricInspection } from "@/state/fabricInspectionsSlice";
// import { useLocation, useNavigate } from "react-router-dom";

// interface FabricInspectionFormData {
//     id?: number | null;
//     inspectionDate: string;
//     loomNo: string;
//     vendorId: string;
//     fabricQuality: string;
//     doffMeters: string;
//     doffWeight: string;
//     activeFlag: boolean;
//     inspectionDetails: InspectionDetails[];
//     inspectionEntries: InspectionEntries[];
// }

// interface InspectionDetails {
//     id?: number;
//     fabricInspectionId: string;
//     rollNo: string;
//     doffMeters: string;
//     inspectedMeters: string;
//     weight: string;
//     totalDefectPoints: string;
//     defectCounts: string;
//     grade: string;
//     activeFlag: boolean;
// }

// interface InspectionEntries {
//     id?: number;
//     fabricInspectionId: string;
//     defectedMeters: string;
//     fromMeters: string;
//     toMeters: string;
//     defectTypeId: string;
//     defectPoints: string;
//     inspectionId: string;
//     activeFlag: boolean;
// }

// export function FabricInspection() {

//     const { purchaseOrderTypeList } = useSelector((state: RootState) => state.purchaseOrder);
//     const { productCategoryList } = useSelector((state: RootState) => state.productCategory);
//     const { customerList } = useSelector((state: RootState) => state.customer);
//     const [inspectionEntries, setInspectionEntries] = useState<InspectionEntries[]>([]);
//     const [newItem, setNewItem] = useState<Partial<InspectionEntries>>({});
//     const [editingIndex, setEditingIndex] = useState<number | null>(null);
//     const [activeTab, setActiveTab] = useState("orderDetails");
//     const [selectedPoTypeId, setSelectedPoTypeId] = useState<number | null>(null);
//     const [inspectionDetails, setInspectionDetails] = useState<InspectionDetails[]>([]);
//     const dispatch = useDispatch<AppDispatch>();
//     const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<FabricInspectionFormData>();
//     const location = useLocation();
//     const fabricInspDtl = location.state?.fabricInspDtl;
//     const navigate = useNavigate();


//     console.log("salesOrderdetail from location state:", fabricInspDtl);


//     useEffect(() => {
//         dispatch(getAllPurchaseOrders({}));
//         dispatch(getAllPoTypes({}));
//         dispatch(getAllCustomers({}));
//         dispatch(getAllProductCategory({}));
//     }, [dispatch]);

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setNewItem({ ...newItem, [e.target.name]: e.target.value });
//     };

//     const addItem = () => {
//         if (!newItem.defectedMeters || !newItem.fromMeters || !newItem.toMeters) {
//             return; // Don't add incomplete items
//         }

//         if (editingIndex !== null) {
//             const updatedItems = [...inspectionEntries];
//             updatedItems[editingIndex] = { ...newItem, activeFlag: true } as InspectionEntries;
//             setInspectionEntries(updatedItems);
//             setEditingIndex(null);
//         } else {
//             setInspectionEntries([...inspectionEntries, { ...newItem, activeFlag: true } as InspectionEntries]);
//         }

//         setNewItem({});
//     };

//     const editItem = (index: number) => {
//         setNewItem(inspectionEntries[index]);
//         setEditingIndex(index);
//     };

//     const deleteItem = (index: number) => {
//         setInspectionEntries(inspectionEntries.filter((_, i) => i !== index));
//     };

//     const onSubmit = async (data: FabricInspectionFormData) => {
//         const payload = {
//             ...data,
//             activeFlag: true,
//             inspectionDetails: inspectionDetails.map(detail => ({
//                 ...detail,
//                 activeFlag: true
//             })),
//             inspectionEntries: inspectionEntries
//         };

//         console.log("Payload to send:", payload);
//         await dispatch(createFabricInspection(payload)).unwrap();
//         navigate('/transaction/fabric-inspection-details');
//         // Add your API call here
//         reset();
//         setInspectionEntries([]);
//         setInspectionDetails([]);
//     };

//     const addInspectionDetail = () => {
//         setInspectionDetails([...inspectionDetails, {
//             fabricInspectionId: "",
//             rollNo: "",
//             doffMeters: "",
//             inspectedMeters: "",
//             weight: "",
//             totalDefectPoints: "",
//             defectCounts: "",
//             grade: "",
//             activeFlag: true
//         }]);
//     };

//     return (
//         <div className="mt-10 p-6 bg-white shadow-md rounded-lg">
//             {/* Title & Save Button */}
//             <div className="flex justify-between items-center border-b pb-4">
//                 <h2 className="text-2xl font-semibold">Fabric Inspection</h2>
//                 <Button onClick={handleSubmit(onSubmit)} className="bg-green-600 hover:bg-green-700 text-white px-6 flex items-center">
//                     <Save size={18} className="mr-2" /> Save Fabric Inspection
//                 </Button>
//             </div>

//             <div className="space-y-6">
//                 {/* Tab Navigation */}
//                 <div className="mb-8">
//                     <div className="border-b border-gray-200">
//                         <nav className="flex -mb-px">
//                             <button
//                                 onClick={() => setActiveTab('orderDetails')}
//                                 className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm ${activeTab === 'orderDetails'
//                                         ? 'border-red-500 text-red-600'
//                                         : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                                     }`}
//                             >
//                                 <FileText className="w-4 h-4" />
//                                 Details
//                             </button>
//                             <button
//                                 onClick={() => setActiveTab('itemDetails')}
//                                 className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm ${activeTab === 'itemDetails'
//                                         ? 'border-red-500 text-red-600'
//                                         : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                                     }`}
//                             >
//                                 <ShoppingCart className="w-4 h-4" />
//                                 Inspection Details
//                             </button>
//                         </nav>
//                     </div>
//                 </div>

//                 {/* Order Details */}
//                 {activeTab === "orderDetails" && (
//                     <Card>
//                         <CardHeader>
//                             <CardTitle className="flex items-center gap-2">
//                                 <FileText size={20} /> Details
//                             </CardTitle>
//                         </CardHeader>
//                         <CardContent className="grid grid-cols-3 gap-8">
//                             <div>
//                                 <label className="block text-sm font-medium text-secondary-700">Date</label>
//                                 <input
//                                     {...register('inspectionDate')}
//                                     type="date"
//                                     className="input mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-secondary-700">Loom No</label>
//                                 <input
//                                     {...register('loomNo')}
//                                     className="input mt-1"
//                                     placeholder="Loom No"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium">Select Operator</label>
//                                 <select {...register('vendorId')} className="input mt-1">
//                                     <option value="">Select an Operator</option>
//                                     {customerList?.map((customer: any) => (
//                                         <option key={customer.id} value={customer.id}>
//                                             {customer.name}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-secondary-700">Fabric Quality</label>
//                                 <input
//                                     {...register('fabricQuality', { required: 'Fabric Quality is required' })}
//                                     className="input mt-1"
//                                     placeholder="Fabric Quality"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-secondary-700">Doff Meters</label>
//                                 <input
//                                     {...register('doffMeters')}
//                                     className="input mt-1"
//                                     placeholder="Doff Meters"
//                                     type="number"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-secondary-700">Doff Weight</label>
//                                 <input
//                                     {...register('doffWeight')}
//                                     className="input mt-1"
//                                     placeholder="Doff Weight"
//                                     type="number"
//                                 />
//                             </div>
//                         </CardContent>
//                     </Card>
//                 )}

//                 {/* Inspection Details */}
//                 {activeTab === "itemDetails" && (
//                     <>
//                         <Card>
//                             <CardHeader>
//                                 <CardTitle className="flex items-center justify-between gap-2">
//                                     <div className="flex items-center gap-2">
//                                         <ShoppingCart size={20} /> Inspection Details
//                                     </div>
//                                     <Button onClick={addInspectionDetail} size="sm">
//                                         <Plus size={16} className="mr-2" /> Add Inspection
//                                     </Button>
//                                 </CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                                 {inspectionDetails.map((field, index) => (
//                                     <div key={index} className="grid grid-cols-4 gap-6 border p-4 rounded-md mb-4">
//                                         {/* <div>
//                                             <label>Roll No</label>
//                                             <input
//                                                 {...register(`inspectionDetails.${index}.rollNo`)}
//                                                 className="input mt-1"
//                                                 placeholder="Roll No"
//                                             />
//                                         </div> */}
//                                         <div>
//                                             <label>Doff Meters</label>
//                                             <input
//                                                 {...register(`inspectionDetails.${index}.doffMeters`)}
//                                                 className="input mt-1"
//                                                 placeholder="Doff Meters"
//                                                 type="number"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label>Inspected Meters</label>
//                                             <input
//                                                 {...register(`inspectionDetails.${index}.inspectedMeters`)}
//                                                 className="input mt-1"
//                                                 placeholder="Inspected Meters"
//                                                 type="number"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label>Weight</label>
//                                             <input
//                                                 {...register(`inspectionDetails.${index}.weight`)}
//                                                 className="input mt-1"
//                                                 placeholder="Weight"
//                                                 type="number"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label>Total Defect Points</label>
//                                             <input
//                                                 {...register(`inspectionDetails.${index}.totalDefectPoints`)}
//                                                 className="input mt-1"
//                                                 placeholder="Defect Points"
//                                                 type="number"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label>Defect Counts</label>
//                                             <input
//                                                 {...register(`inspectionDetails.${index}.defectCounts`)}
//                                                 className="input mt-1"
//                                                 placeholder="Defect Counts"
//                                                 type="number"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label>Grade</label>
//                                             <input
//                                                 {...register(`inspectionDetails.${index}.grade`)}
//                                                 className="input mt-1"
//                                                 placeholder="Grade"
//                                             />
//                                         </div>
//                                     </div>
//                                 ))}
//                             </CardContent>
//                         </Card>

//                         <Card>
//                             <CardHeader>
//                                 <CardTitle className="flex items-center gap-2">
//                                     <ShoppingCart size={20} /> Inspection Entry
//                                 </CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                                 <div className="grid grid-cols-4 gap-6">
//                                     <div>
//                                         <label className="block text-sm font-medium text-secondary-700">Defected Meters</label>
//                                         <input
//                                             name="defectedMeters"
//                                             value={newItem.defectedMeters || ''}
//                                             onChange={handleChange}
//                                             className="input mt-1"
//                                             type="number"
//                                             placeholder="Defected Meters"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-secondary-700">From Meter</label>
//                                         <input
//                                             name="fromMeters"
//                                             value={newItem.fromMeters || ''}
//                                             onChange={handleChange}
//                                             className="input mt-1"
//                                             type="number"
//                                             placeholder="From Meters"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-secondary-700">To Meter</label>
//                                         <input
//                                             name="toMeters"
//                                             value={newItem.toMeters || ''}
//                                             onChange={handleChange}
//                                             className="input mt-1"
//                                             type="number"
//                                             placeholder="To Meters"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium">Defect Type</label>
//                                         <select
//                                             name="defectTypeId"
//                                             value={newItem.defectTypeId || ''}
//                                             onChange={e => setNewItem({ ...newItem, defectTypeId: e.target.value })}
//                                             className="input mt-1"
//                                         >
//                                             <option value="">Select a Defect Type</option>
//                                             {purchaseOrderTypeList?.map((type: any) => (
//                                                 <option key={type.id} value={type.id}>{type.name}</option>
//                                             ))}
//                                         </select>
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-secondary-700">Defect Points</label>
//                                         <input
//                                             name="defectPoints"
//                                             value={newItem.defectPoints || ''}
//                                             onChange={handleChange}
//                                             className="input mt-1"
//                                             type="number"
//                                             placeholder="Defect Points"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium">Inspector Name</label>
//                                         <select
//                                             name="inspectionId"
//                                             value={newItem.inspectionId || ''}
//                                             onChange={e => setNewItem({ ...newItem, inspectionId: e.target.value })}
//                                             className="input mt-1"
//                                         >
//                                             <option value="">Select an Inspector</option>
//                                             {customerList?.map((customer: any) => (
//                                                 <option key={customer.id} value={customer.id}>{customer.name}</option>
//                                             ))}
//                                         </select>
//                                     </div>
//                                 </div>

//                                 <Button onClick={addItem} className="mt-4 ml-auto flex items-center">
//                                     <Plus size={18} className="mr-2" />
//                                     {editingIndex !== null ? "Update Item" : "Add Item"}
//                                 </Button>
//                             </CardContent>
//                         </Card>

//                         <Card>
//                             <CardHeader>
//                                 <CardTitle className="flex items-center gap-2">
//                                     <ClipboardList size={20} /> Item Summary
//                                 </CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                                 <table className="w-full border-collapse border border-gray-300 text-center">
//                                     <thead className="bg-gray-100">
//                                         <tr>
//                                             <th className="border p-2">Sl.No</th>
//                                             <th className="border p-2">Defected Meters</th>
//                                             <th className="border p-2">From Meters</th>
//                                             <th className="border p-2">To Meters</th>
//                                             <th className="border p-2">Defect Type</th>
//                                             <th className="border p-2">Defect Points</th>
//                                             <th className="border p-2">Inspector Name</th>
//                                             <th className="border p-2">Actions</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {inspectionEntries.map((item, index) => (
//                                             <tr key={index} className="border">
//                                                 <td className="border p-2">{index + 1}</td>
//                                                 <td className="border p-2">{item.defectedMeters}</td>
//                                                 <td className="border p-2">{item.fromMeters}</td>
//                                                 <td className="border p-2">{item.toMeters}</td>
//                                                 <td className="border p-2">{item.defectTypeId}</td>
//                                                 <td className="border p-2">{item.defectPoints}</td>
//                                                 <td className="border p-2">{item.inspectionId}</td>
//                                                 <td className="border p-2">
//                                                     <Button size="sm" onClick={() => editItem(index)} className="mr-2">
//                                                         <Edit size={14} />
//                                                     </Button>
//                                                     <Button size="sm" onClick={() => deleteItem(index)} variant="destructive">
//                                                         <Trash2 size={14} />
//                                                     </Button>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </CardContent>
//                         </Card>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// }




import React, { useEffect, useState } from "react";
import { FileText, ShoppingCart, ClipboardList, Edit, Trash2, Save, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { createFabricInspection, updateFabricInspection } from "@/state/fabricInspectionsSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { getAllCustomers } from "@/state/customerSlice";
import { getAllProductCategory } from "@/state/productCategorySlice";
import { getAllPoTypes, getAllPurchaseOrders } from "@/state/purchaseOrderSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllVendors } from "@/state/vendorSlice";

interface FabricInspectionFormData {
    id?: number | null;
    inspectionDate: string;
    loomNo: string;
    vendorId: string;
    fabricQuality: string;
    doffMeters: string;
    doffWeight: string;
    activeFlag: boolean;
    inspectionDetails: InspectionDetails[];
    inspectionEntries: InspectionEntries[];
}

interface InspectionDetails {
    id?: number;
    fabricInspectionId: string;
    rollNo: string;
    doffMeters: string;
    inspectedMeters: string;
    weight: string;
    totalDefectPoints: string;
    defectCounts: string;
    grade: string;
    activeFlag: boolean;
}

interface InspectionEntries {
    id?: number;
    fabricInspectionId: string;
    defectedMeters: string;
    fromMeters: string;
    toMeters: string;
    defectTypeId: string;
    defectPoints: string;
    inspectionId: string;
    activeFlag: boolean;
}

export function FabricInspection() {

    const { fabricInspectionList } = useSelector((state: RootState) => state.fabricInspections);
    const { purchaseOrderTypeList } = useSelector((state: RootState) => state.purchaseOrder);
    const { customerList } = useSelector((state: RootState) => state.customer);
    const { vendorList } = useSelector((state: RootState) => state.vendor);
    const dispatch = useDispatch<AppDispatch>();
    // const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FabricInspectionFormData>();
    const location = useLocation();
    const navigate = useNavigate();
    // Edit mode logic
    const editData: FabricInspectionFormData | undefined = location.state?.fabricInspDtl;
    const isEdit = !!editData;
    console.log(editData)
    const [inspectionEntries, setInspectionEntries] = useState<InspectionEntries[]>(editData?.inspectionEntries || []);
    const [inspectionDetails, setInspectionDetails] = useState<InspectionDetails[]>(editData?.inspectionDetails || []);
    const [newItem, setNewItem] = useState<Partial<InspectionEntries>>({});
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState("orderDetails");
    const [isDetailsValid, setIsDetailsValid] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
        control  // Add control for complex fields
    } = useForm<FabricInspectionFormData>({
        mode: "onBlur",  // Validate on blur
        reValidateMode: "onChange"  // Re-validate on change
    });

    // Check if inspection details are valid
    const isInspectionValid = inspectionDetails.length > 0 &&
        inspectionDetails.every(detail =>
            detail.doffMeters &&
            detail.inspectedMeters &&
            detail.weight &&
            detail.totalDefectPoints
        );

    useEffect(() => {
        dispatch(getAllPurchaseOrders({}));
        dispatch(getAllPoTypes({}));
        dispatch(getAllCustomers({}));
        dispatch(getAllProductCategory({}));
        dispatch(getAllVendors({}));

        if (isEdit && editData) {
            // Set form fields
            reset({
                id: editData.id,
                inspectionDate: editData.inspectionDate,
                loomNo: editData.loomNo,
                vendorId: editData.vendorId,
                fabricQuality: editData.fabricQuality,
                doffMeters: editData.doffMeters,
                doffWeight: editData.doffWeight,
                activeFlag: editData.activeFlag,
                inspectionDetails: editData.inspectionDetails,
                inspectionEntries: editData.inspectionEntries,
            });
            setInspectionDetails(editData.inspectionDetails || []);
            setInspectionEntries(editData.inspectionEntries || []);
        } else {
            reset({
                activeFlag: true,
                inspectionDetails: [],
                inspectionEntries: [],
            });
        }
        // eslint-disable-next-line
    }, [dispatch, isEdit, editData, reset]);


    // Create a validation function
    const validateDetails = () => {
        const values = watch([
            "inspectionDate",
            "loomNo",
            "vendorId",
            "fabricQuality",
            "doffMeters",
            "doffWeight"
        ]);

        return values.every(value => !!value);
    };

    // Update the validation effect
    useEffect(() => {
        const subscription = watch((_, { name }) => {
            // If we're on orderDetails or any watched field changes
            if (activeTab === "orderDetails" ||
                name && ["inspectionDate", "loomNo", "vendorId", "fabricQuality", "doffMeters", "doffWeight"].includes(name)) {
                setIsDetailsValid(validateDetails());
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, activeTab]);

    // Also add this to force validation when tab changes
    useEffect(() => {
        if (activeTab === "orderDetails") {
            setIsDetailsValid(validateDetails());
        }
    }, [activeTab]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewItem({ ...newItem, [e.target.name]: e.target.value });
    };

    const addItem = () => {
        if (!newItem.defectedMeters || !newItem.fromMeters || !newItem.toMeters) return;

        if (editingIndex !== null) {
            const updated = [...inspectionEntries];
            updated[editingIndex] = { ...newItem, activeFlag: true } as InspectionEntries;
            setInspectionEntries(updated);
            setEditingIndex(null);
        } else {
            setInspectionEntries([...inspectionEntries, { ...newItem, activeFlag: true } as InspectionEntries]);
        }
        setNewItem({});
    };

    const editItem = (index: number) => {
        setNewItem(inspectionEntries[index]);
        setEditingIndex(index);
    };

    const deleteItem = (index: number) => {
        setInspectionEntries(inspectionEntries.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: FabricInspectionFormData) => {
        const payload = {
            ...data,
            inspectionDetails,
            inspectionEntries,
            activeFlag: true,
        };

        if (isEdit && data.id) {
            // await dispatch(updateFabricInspection({ id: data.id, ...payload })).unwrap();
            await dispatch(updateFabricInspection({ id: data.id, data: payload })).unwrap();
        } else {
            await dispatch(createFabricInspection(payload)).unwrap();
        }
        navigate('/transaction/fabric-inspection-details');
        reset();
        setInspectionEntries([]);
        setInspectionDetails([]);
    };

    // const addInspectionDetail = () => {
    //     setInspectionDetails([...inspectionDetails, {
    //         fabricInspectionId: "",
    //         rollNo: "",
    //         doffMeters: "",
    //         inspectedMeters: "",
    //         weight: "",
    //         totalDefectPoints: "",
    //         defectCounts: "",
    //         grade: "",
    //         activeFlag: true
    //     }]);
    // };

    const addInspectionDetail = () => {
        if (!watch("fabricQuality") || !watch("doffMeters")) {
            alert("Please fill in all required fields in Details tab first");
            return;
        }

        setInspectionDetails([...inspectionDetails, {
            fabricInspectionId: "",
            rollNo: "",
            doffMeters: watch("doffMeters"),
            inspectedMeters: "",
            weight: "",
            totalDefectPoints: "",
            defectCounts: "",
            grade: "",
            activeFlag: true
        }]);
    };

    return (
        <div className="mt-10 p-6 bg-white shadow-md rounded-lg">
            {/* Title & Save/Update Button */}
            <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-2xl font-semibold">{isEdit ? "Edit Fabric Inspection" : "Fabric Inspection"}</h2>
                {/* <Button onClick={handleSubmit(onSubmit)} className="bg-green-600 hover:bg-green-700 text-white px-6 flex items-center">
                    <Save size={18} className="mr-2" /> {isEdit ? "Update Fabric Inspect" : "Save Fabric Inspect"}
                </Button> */}
                {activeTab === "itemDetails" && (
                    <div className="flex justify-between items-center border-b pb-4">
                        {/* <h2 className="text-2xl font-semibold">{isEdit ? "Edit Fabric Inspection" : "Fabric Inspection"}</h2> */}
                        <Button
                            onClick={handleSubmit(onSubmit)}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 flex items-center"
                            disabled={!isInspectionValid || inspectionEntries.length === 0}
                        >
                            <Save size={18} className="mr-2" />
                            {isEdit ? "Update Fabric Inspect" : "Save Fabric Inspect"}
                        </Button>
                    </div>
                )}
            </div>

            <div className="space-y-6">
                {/* Tab Navigation */}
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
                                Details
                            </button>
                            {/* <button
                                onClick={() => setActiveTab('itemDetails')}
                                className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm ${activeTab === 'itemDetails'
                                    ? 'border-red-500 text-red-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <ShoppingCart className="w-4 h-4" />
                                Inspection Details
                            </button> */}
                        </nav>
                    </div>
                </div>

                {/* Order Details */}
                {activeTab === "orderDetails" && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText size={20} /> Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-3 gap-8">
                            {/* Add required validation to all fields */}
                            <div>
                                <label className="block text-sm font-medium text-secondary-700">Date <span className="text-red-500">*</span></label>
                                <input
                                    {...register('inspectionDate', { required: true })}
                                    type="date"
                                    className="input mt-1"
                                    required
                                />
                                {errors.inspectionDate && <p className="text-red-500 text-xs mt-1">Date is required</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700">Loom No <span className="text-red-500">*</span></label>
                                <input
                                    {...register('loomNo', { required: true })}
                                    className="input mt-1"
                                    placeholder="Loom No"
                                    type="number"
                                    required
                                />
                                {errors.loomNo && <p className="text-red-500 text-xs mt-1">Loom No is required</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Select Operator <span className="text-red-500">*</span></label>
                                <select
                                    {...register('vendorId', { required: true })}
                                    className="input mt-1"
                                    required
                                >
                                    <option value="">Select an Operator</option>
                                    {vendorList?.map((vendor: any) => (
                                        <option key={vendor.id} value={vendor.id}>
                                            {vendor.vendorName}
                                        </option>
                                    ))}
                                </select>
                                {errors.vendorId && <p className="text-red-500 text-xs mt-1">Operator is required</p>}
                            </div>
                            {/* Add similar required validation to other fields */}
                            <div>
                                <label className="block text-sm font-medium text-secondary-700">Fabric Quality <span className="text-red-500">*</span></label>
                                <input
                                    {...register('fabricQuality', { required: true })}
                                    className="input mt-1"
                                    placeholder="Fabric Quality"
                                    type="number"
                                    required
                                />
                                {errors.fabricQuality && <p className="text-red-500 text-xs mt-1">Fabric Quality is required</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700">Doff Meters <span className="text-red-500">*</span></label>
                                <input
                                    {...register('doffMeters', { required: true })}
                                    className="input mt-1"
                                    placeholder="Doff Meters"
                                    type="number"
                                    required
                                />
                                {errors.doffMeters && <p className="text-red-500 text-xs mt-1">Doff Meters is required</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700">Doff Weight <span className="text-red-500">*</span></label>
                                <input
                                    {...register('doffWeight', { required: true })}
                                    className="input mt-1"
                                    placeholder="Doff Weight"
                                    type="number"
                                    required
                                />
                                {errors.doffWeight && <p className="text-red-500 text-xs mt-1">Doff Weight is required</p>}
                            </div>
                        </CardContent>
                        <div className="p-4 flex justify-end">
                            <Button
                                onClick={() => setActiveTab("itemDetails")}
                                disabled={!isDetailsValid}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Next
                            </Button>
                        </div>
                    </Card>
                )}

                {/* Inspection Details */}
                {/* {activeTab === "itemDetails" && (
                    <> */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <ShoppingCart size={20} /> Inspection Details
                            </div>
                            <Button onClick={addInspectionDetail} size="sm">
                                <Plus size={16} className="mr-2" /> Add Inspection
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {inspectionDetails.map((field, index) => (
                            <div key={index} className="grid grid-cols-4 gap-6 border p-4 rounded-md mb-4">
                                <div>
                                    <label>Doff Meters</label>
                                    <input
                                        value={field.doffMeters}
                                        onChange={e => {
                                            const details = [...inspectionDetails];
                                            details[index].doffMeters = e.target.value;
                                            setInspectionDetails(details);
                                        }}
                                        className="input mt-1"
                                        placeholder="Doff Meters"
                                        type="number"
                                    />
                                </div>
                                <div>
                                    <label>Inspected Meters</label>
                                    <input
                                        value={field.inspectedMeters}
                                        onChange={e => {
                                            const details = [...inspectionDetails];
                                            details[index].inspectedMeters = e.target.value;
                                            setInspectionDetails(details);
                                        }}
                                        className="input mt-1"
                                        placeholder="Inspected Meters"
                                        type="number"
                                    />
                                </div>
                                <div>
                                    <label>Weight</label>
                                    <input
                                        value={field.weight}
                                        onChange={e => {
                                            const details = [...inspectionDetails];
                                            details[index].weight = e.target.value;
                                            setInspectionDetails(details);
                                        }}
                                        className="input mt-1"
                                        placeholder="Weight"
                                        type="number"
                                    />
                                </div>
                                <div>
                                    <label>Total Defect Points</label>
                                    <input
                                        value={field.totalDefectPoints}
                                        onChange={e => {
                                            const details = [...inspectionDetails];
                                            details[index].totalDefectPoints = e.target.value;
                                            setInspectionDetails(details);
                                        }}
                                        className="input mt-1"
                                        placeholder="Defect Points"
                                        type="number"
                                    />
                                </div>
                                <div>
                                    <label>Defect Counts</label>
                                    <input
                                        value={field.defectCounts}
                                        onChange={e => {
                                            const details = [...inspectionDetails];
                                            details[index].defectCounts = e.target.value;
                                            setInspectionDetails(details);
                                        }}
                                        className="input mt-1"
                                        placeholder="Defect Counts"
                                        type="number"
                                    />
                                </div>
                                <div>
                                    <label>Grade</label>
                                    <input
                                        value={field.grade}
                                        onChange={e => {
                                            const details = [...inspectionDetails];
                                            details[index].grade = e.target.value;
                                            setInspectionDetails(details);
                                        }}
                                        className="input mt-1"
                                        placeholder="Grade"
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShoppingCart size={20} /> Inspection Entry
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-4 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-secondary-700">Defected Meters</label>
                                <input
                                    name="defectedMeters"
                                    value={newItem.defectedMeters || ''}
                                    onChange={handleChange}
                                    className="input mt-1"
                                    type="number"
                                    placeholder="Defected Meters"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700">From Meter</label>
                                <input
                                    name="fromMeters"
                                    value={newItem.fromMeters || ''}
                                    onChange={handleChange}
                                    className="input mt-1"
                                    type="number"
                                    placeholder="From Meters"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700">To Meter</label>
                                <input
                                    name="toMeters"
                                    value={newItem.toMeters || ''}
                                    onChange={handleChange}
                                    className="input mt-1"
                                    type="number"
                                    placeholder="To Meters"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Defect Type</label>
                                <select
                                    name="defectTypeId"
                                    value={newItem.defectTypeId || ''}
                                    onChange={e => setNewItem({ ...newItem, defectTypeId: e.target.value })}
                                    className="input mt-1"
                                >
                                    <option value="">Select a Defect Type</option>
                                    {purchaseOrderTypeList?.map((type: any) => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700">Defect Points</label>
                                <input
                                    name="defectPoints"
                                    value={newItem.defectPoints || ''}
                                    onChange={handleChange}
                                    className="input mt-1"
                                    type="number"
                                    placeholder="Defect Points"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Inspector Name</label>
                                <select
                                    name="inspectionId"
                                    value={newItem.inspectionId || ''}
                                    onChange={e => setNewItem({ ...newItem, inspectionId: e.target.value })}
                                    className="input mt-1"
                                >
                                    <option value="">Select an Inspector</option>
                                    {customerList?.map((customer: any) => (
                                        <option key={customer.id} value={customer.id}>{customer.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <Button onClick={addItem} className="mt-4 ml-auto flex items-center">
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
                                    <th className="border p-2">Defected Meters</th>
                                    <th className="border p-2">From Meters</th>
                                    <th className="border p-2">To Meters</th>
                                    <th className="border p-2">Defect Type</th>
                                    <th className="border p-2">Defect Points</th>
                                    <th className="border p-2">Inspector Name</th>
                                    <th className="border p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inspectionEntries.map((item, index) => (
                                    <tr key={index} className="border">
                                        <td className="border p-2">{index + 1}</td>
                                        <td className="border p-2">{item.defectedMeters}</td>
                                        <td className="border p-2">{item.fromMeters}</td>
                                        <td className="border p-2">{item.toMeters}</td>
                                        <td className="border p-2">{item.defectTypeId}</td>
                                        <td className="border p-2">{item.defectPoints}</td>
                                        <td className="border p-2">{item.inspectionId}</td>
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
                {/* </>
                )} */}
            </div>
        </div>
    );
}





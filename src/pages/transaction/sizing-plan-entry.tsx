import React, { useEffect, useState } from "react";
import { FileText, ShoppingCart, ClipboardList, Plus, Edit, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button"; // Assuming shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { getAllConsignee } from "@/state/consigneeSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllFabricMasterDetails, getAllFabricMasters } from "@/state/fabricMasterSlice";
import { getAllVendors } from "@/state/vendorSlice";
import { getAllFlanges } from "@/state/flangeSlice";
import { createEmptyBeamIssue, getAllEmptyBeamIssue, updateEmptyBeamIssue } from "@/state/emptyBeamIssueSlice";
import { getAllYarnMasters } from "@/state/yarnSlice";
import { getAllWeavingContract } from "@/state/weavingContractSlice";
import { getAllSalesOrders } from "@/state/salesOrderSlice";
import { getAllPaymentTerms } from "@/state/paymentTermsSlice";
import { getAllShipmentModes } from "@/state/shipmentModeSlice";
import { getAllTermsConditions } from "@/state/termsConditions";
import { createSizingPlan, updateSizingPlan } from "@/state/sizingPlanSlice";


interface SizingPlanEntryFormData {
    id?: number;
    vendorId: string;
    consigneeId: string;
    termsConditionsId: string;
    paymentTermsId: string;
    sizingRate: string;
    emptyBeamNo: string;
    remarks: string;
    sizingPlanNo: string;
    sizingQualityDetails: sizingQualityDetails[];
    sizingBeamDetails: sizingBeamDetails[];
}

interface sizingQualityDetails {
    quality: string,
    yarnId: string,
    sordEnds: string,
    actualEnds: string,
    parts: string,
    endsPerPart: string,
    warpMeters: string,
}

interface sizingBeamDetails {
    weavingContractId: string;
    salesOrderId: string;
    emptyBeamId: string;
    warpMeters: string;
    shrinkage: string;
    expectedFabricMeter: string;
}

const SizingPlanEntry = () => {
    const [items, setItems]: any = useState([]);
    const [beamItems, setBeamItems]: any = useState([]);
    const [newItem, setNewItem] = useState<sizingQualityDetails>({
        quality: "",
        yarnId: "",
        sordEnds: "",
        actualEnds: "",
        parts: "",
        endsPerPart: "",
        warpMeters: "",
    });
    const [newBeamItem, setNewBeamItem] = useState<sizingBeamDetails>({
        weavingContractId: "",
        salesOrderId: "",
        emptyBeamId: "",
        warpMeters: "",
        shrinkage: "",
        expectedFabricMeter: "",
    });
    const [editingIndex, setEditingIndex]: any = useState(null);
    const { consigneeList } = useSelector((state: RootState) => state.consignee);
    const { flangeList } = useSelector((state: RootState) => state.flange);
    const { vendorList } = useSelector((state: RootState) => state.vendor);
    const { weavingContractList } = useSelector((state: RootState) => state.weavingContracts)
    const { fabricMasterList } = useSelector((state: RootState) => state.fabricMaster)
    const { yarnList } = useSelector((state: RootState) => state.yarn)
    const { salesOrderList } = useSelector((state: RootState) => state.salesOrder)
    const { termsContitionsList } = useSelector((state: RootState) => state.termsConditions)
    const { paymentTermsList } = useSelector((state: RootState) => state.paymentTerms)
    const { emptyBeamIssueList } = useSelector((state: RootState) => state.emptyBeamIssue)
    const dispatch = useDispatch<AppDispatch>();
    // const { register, handleSubmit, reset, formState: { errors } } = useForm<SizingPlanEntryFormData>();
    const location = useLocation();
    const sizingPlanDtl = location.state?.sizingPlanDtl;
    const navigate = useNavigate();
    console.log("sizingPlanDtl from location state:", sizingPlanDtl);
    const [activeTab, setActiveTab] = useState("vendorDetails");
    // const [numberOfLots, setNumberOfLots] = useState<number>(0);
    // const [itemss, setItemss] = useState<any[]>([]);
    const [numberOfLots, setNumberOfLots] = useState<string>('0');
    const [numberOfBeams, setNumberOfBeams] = useState<string>('0');
    const [beamInputs, setBeamInputs] = useState<sizingBeamDetails[]>([]);
    const [isItemsValid, setIsItemsValid] = useState(false);
    const [quantityError, setQuantityError] = useState("");
    const [yarnIdError, setYarnIdError] = useState("");
    const [sordEndsError, setSordEndsError] = useState("");


    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid } // Add isValid here
    } = useForm<SizingPlanEntryFormData>({
        mode: 'onBlur',
        reValidateMode: 'onBlur'
    });

    const isFormValid = isValid &&
        items.length > 0 &&
        items.every((item: sizingQualityDetails) =>
            item.quality && item.yarnId && item.sordEnds
        );

    useEffect(() => {
        dispatch(getAllVendors({}));
        dispatch(getAllConsignee({}));
        dispatch(getAllYarnMasters({}));
        dispatch(getAllWeavingContract({}));
        dispatch(getAllSalesOrders({}));
        dispatch(getAllPaymentTerms({}));
        dispatch(getAllTermsConditions({}));
        dispatch(getAllEmptyBeamIssue({}));
        dispatch(getAllFabricMasters({}));
        dispatch(getAllFlanges({}));
    }, [dispatch]);


    useEffect(() => {
        if (sizingPlanDtl) {
            // Set main form fields
            reset({
                vendorId: sizingPlanDtl.vendorId ? String(sizingPlanDtl.vendorId) : "",
                termsConditionsId: sizingPlanDtl.termsConditionsId ? String(sizingPlanDtl.termsConditionsId) : "",
                consigneeId: sizingPlanDtl.consigneeId ? String(sizingPlanDtl.consigneeId) : "",
                paymentTermsId: sizingPlanDtl.paymentTermsId ? String(sizingPlanDtl.paymentTermsId) : "",
                sizingRate: sizingPlanDtl.sizingRate ? String(sizingPlanDtl.sizingRate) : "",
                emptyBeamNo: sizingPlanDtl.emptyBeamNo || "",
                remarks: sizingPlanDtl.remarks || "",
            });

            // Map sizingQualityDetails to items state
            if (Array.isArray(sizingPlanDtl.sizingQualityDetails)) {
                setItems(sizingPlanDtl.sizingQualityDetails.map((item: any) => ({
                    id: item.id || null,
                    quality: item.quality || "",
                    yarnId: item.yarnId ? String(item.yarnId) : "",
                    sordEnds: item.sordEnds ? String(item.sordEnds) : "",
                    actualEnds: item.actualEnds ? String(item.actualEnds) : "",
                    parts: item.parts ? String(item.parts) : "",
                    endsPerPart: item.endsPerPart ? String(item.endsPerPart) : "",
                    warpMeters: item.wrapMeters ? String(item.wrapMeters) : ""
                })));
            } else {
                setItems([]);
            }

            // Map sizingBeamDetails to beamItems state
            if (Array.isArray(sizingPlanDtl.sizingBeamDetails)) {
                setBeamItems(sizingPlanDtl.sizingBeamDetails.map((beam: any) => ({
                    id: beam.id || null,
                    weavingContractId: beam.weavingContractId ? String(beam.weavingContractId) : "",
                    salesOrderId: beam.salesOrderId ? String(beam.salesOrderId) : "",
                    emptyBeamId: beam.emptyBeamId ? String(beam.emptyBeamId) : "",
                    warpMeters: beam.warpMeters ? String(beam.warpMeters) : "",
                    shrinkage: beam.shrinkage ? String(beam.shrinkage) : "",
                    expectedFabricMeter: beam.expectedFabricMeter ? String(beam.expectedFabricMeter) : ""
                })));
            } else {
                setBeamItems([]);
            }
        }
    }, [sizingPlanDtl, reset]);

    const addItem = () => {
        let isValid = true;

        if (!newItem.quality) {
            setQuantityError("Quality is required");
            isValid = false;
        } else {
            setQuantityError("");
        }

        if (!newItem.yarnId) {
            setYarnIdError("Yarn is required");
            isValid = false;
        } else {
            setYarnIdError("");
        }

        if (!newItem.sordEnds) {
            setSordEndsError("Sort Ends is required");
            isValid = false;
        } else {
            setSordEndsError("");
        }

        // Add other required field validations as needed
        setIsItemsValid(isValid);

        if (!isValid) {
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

        console.log(items);
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


    const handleAddBeams = () => {
        const num = parseInt(numberOfBeams) || 0;
        if (num > 0) {
            const newBeams = Array(num).fill(0).map(() => ({
                weavingContractId: "",
                salesOrderId: "",
                emptyBeamId: "",
                warpMeters: "",
                shrinkage: "",
                expectedFabricMeter: ""
            }));
            setBeamInputs(newBeams);
        }
    };

    const editItem = (index: any) => {
        setNewItem(items[index]);
        setEditingIndex(index);
    };

    const deleteItem = (index: any) => {
        setItems(items.filter((_: any, i: any) => i !== index));
    };

    const handleBeamInputChange = (index: number, field: keyof sizingBeamDetails, value: string) => {
        const updatedBeams = [...beamInputs];
        updatedBeams[index] = {
            ...updatedBeams[index],
            [field]: value
        };
        setBeamInputs(updatedBeams);
    };

    const addBeamItems = () => {
        // Filter out any empty beams (all fields empty)
        const validBeams = beamInputs.filter(beam =>
            beam.weavingContractId ||
            beam.salesOrderId ||
            beam.emptyBeamId ||
            beam.warpMeters ||
            beam.shrinkage ||
            beam.expectedFabricMeter
        );

        if (validBeams.length > 0) {
            setBeamItems([...beamItems, ...validBeams]);
            setBeamInputs([]);
            setNumberOfBeams('0');
        }
    };

    const editBeamItem = (index: number) => {
        setBeamInputs([beamItems[index]]);
        setBeamItems(beamItems.filter((_: any, i: any) => i !== index));
        setEditingIndex(index);
    };

    const deleteBeamItem = (index: number) => {
        setBeamItems(beamItems.filter((_: any, i: any) => i !== index));
    };

    const onSubmit = async (data: SizingPlanEntryFormData) => {
        // Prepare payload
        const payload = {
            vendorId: parseInt(data.vendorId),
            consigneeId: parseInt(data.consigneeId),
            termsConditionsId: parseInt(data.termsConditionsId),
            paymentTermsId: parseInt(data.paymentTermsId),
            sizingRate: parseFloat(data.sizingRate),
            emptyBeamNo: data.emptyBeamNo,
            remarks: data.remarks,
            sizingPlanNo: sizingPlanDtl?.sizingPlanNo,
            sizingQualityDetails: items.map((item: any) => ({
                id: item.id || undefined, // For update, include id if it exists
                quality: item.quality,
                yarnId: parseInt(item.yarnId),
                sordEnds: parseInt(item.sordEnds),
                actualEnds: parseInt(item.actualEnds),
                parts: parseInt(item.parts),
                endsPerPart: parseInt(item.endsPerPart),
                wrapMeters: parseFloat(item.warpMeters)
            })),
            sizingBeamDetails: beamItems.map((beamItem: any) => ({
                id: beamItem.id || undefined, // For update, include id if it exists
                weavingContractId: parseInt(beamItem.weavingContractId),
                salesOrderId: parseInt(beamItem.salesOrderId),
                emptyBeamId: parseInt(beamItem.emptyBeamId),
                wrapMeters: parseFloat(beamItem.warpMeters),
                shrinkage: parseFloat(beamItem.shrinkage),
                expectedFabricMeter: parseFloat(beamItem.expectedFabricMeter)
            }))
        };

        try {
            if (sizingPlanDtl?.id) {
                // Edit mode - update
                await dispatch(updateSizingPlan({
                    id: sizingPlanDtl.id,
                    data: payload
                })).unwrap();
                // toast.success("Sizing Plan updated successfully!");
            } else {
                // Create mode - save
                await dispatch(createSizingPlan(payload)).unwrap();
                // toast.success("Sizing Plan created successfully!");
            }
            navigate("/transaction/sizing-management", { state: { tab: "sizingPlan" } });
        } catch (err) {
            // toast.error("Failed to save/update Sizing Plan");
            console.error("Error submitting sizing plan:", err);
        }
    };

    return (
        <div className="mt-10 p-6 bg-white shadow-md rounded-lg mt-16">
            {/* Title & Save Button */}
            <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-2xl font-semibold">Sizing Plan Entry</h2>
                {/* <Button
                    onClick={handleSubmit(onSubmit)}
                    className={`bg-green-600 hover:bg-green-700 text-white px-6 flex items-center`}
                >
                    <Save size={18} className="mr-2" />
                    {sizingPlanDtl?.id ? "Update Sizing Plan" : "Save Sizing Plan"}
                </Button> */}
                <Button
                    onClick={handleSubmit(onSubmit)}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 flex items-center"
                    disabled={!isFormValid}
                >
                    <Save size={18} className="mr-2" />
                    {sizingPlanDtl?.id ? "Update Sizing Plan" : "Save Sizing Plan"}
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
                            <button
                                onClick={() => setActiveTab('beamDetails')}
                                className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm ${activeTab === 'beamDetails'
                                    ? 'border-red-500 text-red-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <ShoppingCart className="w-4 h-4" />
                                Beam Details
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
                                    <label className="block text-sm font-medium text-secondary-700">Vendor Name <span className="text-red-600">*</span>
                                    </label>
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
                                    <label className="block text-sm font-medium text-secondary-700">Delivery Address <span className="text-red-600">*</span>
                                    </label>
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
                                    <label className="block text-sm font-medium text-secondary-700">Select Terms & Conditions <span className="text-red-600">*</span>
                                    </label>
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
                                    <label className="block text-sm font-medium text-secondary-700">Select Payment Terms <span className="text-red-600">*</span>
                                    </label>
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
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">Remarks</label>
                                    <input
                                        {...register('remarks')}
                                        className="input mt-1" placeholder="Enter Remarks"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ShoppingCart size={20} /> Quality Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-4 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700">Quality <span className="text-red-600">*</span>
                                        </label>
                                        {/* <input placeholder="Quality"
                                            value={newItem.quality}
                                            onChange={e => setNewItem({ ...newItem, quality: e.target.value })} className="input  mt-1" /> */}
                                        <select
                                            value={newItem.quality}
                                            onChange={(e) =>
                                                setNewItem({ ...newItem, quality: e.target.value })
                                            }
                                            className="input mt-1"
                                        >
                                            <option value="">Select Fabric Quality</option>
                                            {fabricMasterList?.map((fabric: any) => (
                                                <option key={fabric.id} value={fabric.id}>{fabric.fabricName}</option>
                                            ))}
                                        </select>
                                        {quantityError && <p className="mt-1 text-sm text-red-600">{quantityError}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700">Select Yarn <span className="text-red-600">*</span>
                                        </label>
                                        <select
                                            value={newItem.yarnId}
                                            onChange={(e) =>
                                                setNewItem({ ...newItem, yarnId: e.target.value })
                                            }
                                            className="input mt-1"
                                        >
                                            <option value="">Select Yarn</option>
                                            {yarnList?.map((yarn: any) => (
                                                <option key={yarn.id} value={yarn.id}>{yarn.yarnName}</option>
                                            ))}
                                        </select>
                                        {yarnIdError && <p className="mt-1 text-sm text-red-600">{yarnIdError}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700">Sord Ends <span className="text-red-600">*</span>
                                        </label>
                                        <input placeholder="Enter Sord Ends"
                                            value={newItem.sordEnds}
                                            onChange={e => setNewItem({ ...newItem, sordEnds: e.target.value })} className="input  mt-1" />
                                        {sordEndsError && <p className="mt-1 text-sm text-red-600">{sordEndsError}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700">Actual Ends</label>
                                        <input placeholder="Enter Actual Ends"
                                            value={newItem.actualEnds}
                                            onChange={e => setNewItem({ ...newItem, actualEnds: e.target.value })} className="input  mt-1" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700">Parts</label>
                                        <input placeholder="Enter Parts"
                                            value={newItem.parts}
                                            onChange={e => setNewItem({ ...newItem, parts: e.target.value })} className="input  mt-1" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700">Ends/Part</label>
                                        <input placeholder="Enter EndsPerPart"
                                            value={newItem.endsPerPart}
                                            onChange={e => setNewItem({ ...newItem, endsPerPart: e.target.value })} className="input  mt-1" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700">Warp Meters</label>
                                        <input placeholder="Enter Warp Meters"
                                            value={newItem.warpMeters}
                                            onChange={e => setNewItem({ ...newItem, warpMeters: e.target.value })} className="input  mt-1" />
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

                {activeTab === "beamDetails" && (
                    <>
                        <div className="flex flex-col sm:flex-row items-center justify-start gap-4 mb-4">
                            <div className="flex flex-col">
                                <label className="block text-sm font-medium text-gray-700">No of Beams</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={numberOfBeams}
                                    onChange={(e) => setNumberOfBeams(e.target.value)}
                                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                                />
                            </div>
                            <Button
                                onClick={handleAddBeams}
                                className="bg-blue-500 hover:bg-blue-700 text-white px-6 py-2 rounded-md flex items-center mt-5"
                            >
                                <Plus size={18} className="mr-2" /> Generate Beams
                            </Button>
                        </div>

                        {beamInputs.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <ClipboardList size={20} /> Add Beam Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <table className="w-full border-collapse border border-gray-300 text-center">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="border p-2">Sl.No</th>
                                                <th className="border p-2">Weaving Contract No</th>
                                                <th className="border p-2">Sales Order No</th>
                                                <th className="border p-2">Flang No</th>
                                                <th className="border p-2">Warp Meters</th>
                                                <th className="border p-2">Shrinkage %</th>
                                                <th className="border p-2">Expected Fabric Meter</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {beamInputs.map((beam, index) => (
                                                <tr key={index} className="border">
                                                    <td className="border p-2">{index + 1}</td>
                                                    <td className="border p-2">
                                                        <select
                                                            value={beam.weavingContractId}
                                                            onChange={(e) => handleBeamInputChange(index, 'weavingContractId', e.target.value)}
                                                            className="input mt-1 w-full"
                                                        >
                                                            <option value="">Select</option>
                                                            {weavingContractList?.map((wc: any) => (
                                                                <option key={wc.id} value={wc.id}>{wc.weavingContractNo}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td className="border p-2">
                                                        <select
                                                            value={beam.salesOrderId}
                                                            onChange={(e) => handleBeamInputChange(index, 'salesOrderId', e.target.value)}
                                                            className="input mt-1 w-full"
                                                        >
                                                            <option value="">Select</option>
                                                            {salesOrderList?.map((so: any) => (
                                                                <option key={so.id} value={so.id}>{so.salesOrderNo}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td className="border p-2">
                                                        <select
                                                            value={beam.emptyBeamId}
                                                            onChange={(e) => handleBeamInputChange(index, 'emptyBeamId', e.target.value)}
                                                            className="input mt-1 w-full"
                                                        >
                                                            <option value="">Select</option>
                                                            {flangeList?.map((ebi: any) => (
                                                                <option key={ebi.id} value={ebi.id}>{ebi.flangeNo}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td className="border p-2">
                                                        <input
                                                            value={beam.warpMeters}
                                                            onChange={(e) => handleBeamInputChange(index, 'warpMeters', e.target.value)}
                                                            className="input mt-1 w-full"
                                                            placeholder="Enter"
                                                        />
                                                    </td>
                                                    <td className="border p-2">
                                                        <input
                                                            value={beam.shrinkage}
                                                            onChange={(e) => handleBeamInputChange(index, 'shrinkage', e.target.value)}
                                                            className="input mt-1 w-full"
                                                            placeholder="Enter"
                                                        />
                                                    </td>
                                                    <td className="border p-2">
                                                        <input
                                                            value={beam.expectedFabricMeter}
                                                            onChange={(e) => handleBeamInputChange(index, 'expectedFabricMeter', e.target.value)}
                                                            className="input mt-1 w-full"
                                                            placeholder="Enter"
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <Button
                                        onClick={addBeamItems}
                                        className="mt-4 ml-auto flex items-center"
                                        disabled={beamInputs.length === 0}
                                    >
                                        <Plus size={18} className="mr-2" />
                                        Add Beam Items
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {beamItems.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <ClipboardList size={20} /> Beam Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <table className="w-full border-collapse border border-gray-300 text-center">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="border p-2">Sl.No</th>
                                                <th className="border p-2">Weaving Contract No</th>
                                                <th className="border p-2">Sales Order No</th>
                                                <th className="border p-2">Flang No</th>
                                                <th className="border p-2">Warp Meters</th>
                                                <th className="border p-2">Shrinkage %</th>
                                                <th className="border p-2">Expected Fabric Meter</th>
                                                <th className="border p-2">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {beamItems.map((item: any, index: any) => (
                                                <tr key={index} className="border">
                                                    <td className="border p-2">{index + 1}</td>
                                                    <td className="border p-2">
                                                        {weavingContractList?.find((wc: any) => wc.id === parseInt(item.weavingContractId))?.weavingContractNo || item.weavingContractId}
                                                    </td>
                                                    <td className="border p-2">
                                                        {salesOrderList?.find((so: any) => so.id === parseInt(item.salesOrderId))?.salesOrderNo || item.salesOrderId}
                                                    </td>
                                                    <td className="border p-2">
                                                        {flangeList?.find((ebi: any) => ebi.id === parseInt(item.emptyBeamId))?.flangNo || item.emptyBeamId}
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
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default SizingPlanEntry;
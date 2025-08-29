import React, { useEffect, useMemo, useState } from "react";
import { FileText, ShoppingCart, ClipboardList, Edit, Trash2, Save, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { createPurchaseOrder, getAllPoTypes, getAllPurchaseOrders, updatePurchaseOrder } from "@/state/purchaseOrderSlice";
import { AppDispatch, RootState } from "@/state/store";
import { useDispatch, useSelector } from "react-redux";
import { getAllCustomers } from "@/state/customerSlice";
import { getAllProductCategory } from "@/state/productCategorySlice";
import { DataTable } from "@/components/data/DataTable";
import { getAllVendors } from "@/state/vendorSlice";
import { getAllTermsConditions } from "@/state/termsConditions";
import { getAllLotEntries, getAllWeavingContract, getWeavingContractById } from "@/state/weavingContractSlice";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CodeSandboxLogoIcon } from "@radix-ui/react-icons";
import { createWeavingYarnIssue } from "@/state/weavingYarnIssueSlice";
import { getAllDyeingWorkOrders } from "@/state/processContractSlice";
import { getSubCategoryByCategory } from "@/state/subCategorySlice";
import { getAllShipmentModes } from "@/state/shipmentModeSlice";
import { createFabricDispatch, updateFabricDispatch } from "@/state/processIssueSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllSalesOrders } from "@/state/salesOrderSlice";

interface YarnIssueDetail {
    id?: number; // Add for updates
    yarnName: string;
    availableReqQty: number;
    issueQty: number;
    lotId: string;
    activeFlag?: boolean;
}

// For Yarn Requirement Details Table
interface YarnRequirementDetail {
    yarnName: string;
    yarnCount: string;
    gramsPerMeter: string;
    totalwarpReq: string;
    totalWarpIssued: string;
    balanceWarpToIssue: string;
    activeFlag: boolean;
}

// For Yarn Issue Details Table
interface FabricDispatchDyeingFormData {
    id?: number; // Add for updates
    fabricDispatchDate: string,
    vendorId: string,
    dyeingWorkOrderId: string,
    orderQuantity: string,
    dispatchedQuantity: string,
    receivedQuantity: string,
    balanceQuantity: string,
    costPerPound: string,
    totalAmount: string,
    colorId: string,
    pantone: string,
    finishingId: string,
    salesOrderId: string,
    shipmentModeId: string,
    lotId: string | null,
    remarks: string,
    activeFlag: true
}

interface LotDetail {
    id?: number; // This should be the primary identifier
    yarnName: string;
    availableQty: number;
    lotNumber?: string; // Optional, for display purposes
    issueQty?: number;
    activeFlag?: boolean;
}

export function ProcessingIssue() {

    const [isFormValid, setIsFormValid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { subCategoryByCategoryList } = useSelector((state: RootState) => state.subCategory);
    const { processContractList } = useSelector((state: RootState) => state.dyeingWorkOrde);
    const { shipmentModesList } = useSelector((state: RootState) => state.shipmentMode);
    const { vendorList } = useSelector((state: RootState) => state.vendor);
    const { salesOrderList } = useSelector((state: RootState) => state.salesOrder);
    const [weavingContractItemDtl, setweavingContractItemDtl]: any = useState([]);
    const [newItem, setNewItem]: any = useState({});
    const [editingIndex, setEditingIndex]: any = useState(null);
    const [activeTab, setActiveTab] = useState("orderDetails");
    const [selectedJobWork, setSelectedJobWork]: any = useState([]);
    const [yarnRequirementDetails, setYarnRequirementDetails]: any = useState<YarnRequirementDetail[]>([]);
    const [showLotDialog, setShowLotDialog] = useState(false);
    const [yarnIssueDetails, setYarnIssueDetails] = useState<YarnIssueDetail[]>([]); const [selectedLot, setSelectedLot]: any = useState<LotDetail[]>([]);
    const dispatch = useDispatch<AppDispatch>();
    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FabricDispatchDyeingFormData>();
    const [selectedDyeingWorkOrder, setSelectedDyeingWorkOrder] = useState<any>(null);
    const [dispatchDetails, setDispatchDetails] = useState({
        finishedFabricCode: "",
        finishedFabricName: "",
        greigeFabricCode: "",
        greigeFabricName: "",
        orderQuantity: "",
        dispatchedQuantity: "",
        receivedQuantity: "",
        balanceQuantity: ""
    });
    const [formErrors, setFormErrors] = useState({
        fabricDispatchDate: false,
        vendorId: false,
        dyeingWorkOrderId: false,
        orderQuantity: false,
        // Add other fields as needed
    });
    const navigate = useNavigate();
    const location = useLocation();
    const processingIssueDtl = location.state?.processingIssueDtl;
    console.log("processingIssueDtl from location state:", processingIssueDtl);

    // Update your validateForm function to return validity state
    const validateForm = () => {
        const formValues = {
            date: watch("fabricDispatchDate"),
            vendor: watch("vendorId"),
            workOrder: watch("dyeingWorkOrderId"),
            quantity: watch("orderQuantity"),
            cost: watch("costPerPound"),
            total: watch("totalAmount")
        };

        const isValid = Object.values(formValues).every(val => Boolean(val)) &&
            !isNaN(Number(formValues.quantity)) &&
            !isNaN(Number(formValues.cost)) &&
            !isNaN(Number(formValues.total));

        setIsFormValid(isValid);
        return isValid;
    };

    // Add this useEffect to validate form on changes
    useEffect(() => {
        const subscription = watch(() => validateForm());
        return () => subscription.unsubscribe();
    }, [watch]);

    // Add this useEffect to calculate total amount
    useEffect(() => {
        const orderQty = Number(watch("orderQuantity")) || 0;
        const costPerPound = Number(watch("costPerPound")) || 0;
        const total = orderQty * costPerPound;
        setValue("totalAmount", total.toFixed(2));
    }, [watch("orderQuantity"), watch("costPerPound")]);

    useEffect(() => {
        if (processingIssueDtl) {
            reset({
                id: processingIssueDtl.id,
                fabricDispatchDate: processingIssueDtl.fabricDispatchDate.slice(0, 10),
                vendorId: String(processingIssueDtl.vendorId),
                dyeingWorkOrderId: String(processingIssueDtl.dyeingWorkOrderId),
                orderQuantity: processingIssueDtl.orderQuantity,
                dispatchedQuantity: processingIssueDtl.dispatchedQuantity,
                receivedQuantity: processingIssueDtl.receivedQuantity,
                balanceQuantity: processingIssueDtl.balanceQuantity,
                costPerPound: processingIssueDtl.costPerPound,
                totalAmount: processingIssueDtl.totalAmount,
                colorId: String(processingIssueDtl.colorId),
                pantone: processingIssueDtl.pantone,
                finishingId: String(processingIssueDtl.finishingId),
                salesOrderId: String(processingIssueDtl.salesOrderId),
                shipmentModeId: String(processingIssueDtl.shipmentModeId),
                lotId: processingIssueDtl.lotId ? String(processingIssueDtl.lotId) : null,
                remarks: processingIssueDtl.remarks || '',
                activeFlag: processingIssueDtl.activeFlag
            });

            // If you need to set any additional details like in your original example
            // you can add those here as needed
        }
    }, [processingIssueDtl, reset]);

    useEffect(() => {
        if (selectedLot.length > 0) {
            const totalPounds = selectedLot.reduce((sum: number, lot: any) => {
                return sum + (lot.issueQty ? Number(lot.issueQty) : 0);
            }, 0);

            setDispatchDetails(prev => ({
                ...prev,
                receivedQuantity: totalPounds.toString(),
                balanceQuantity: (Number(prev.orderQuantity) - totalPounds).toString()
            }));
        }
    }, [selectedLot]);


    useEffect(() => {
        dispatch(getAllPurchaseOrders({}));
        dispatch(getAllSalesOrders({}));
        dispatch(getAllPoTypes({}));
        dispatch(getAllVendors({}));
        dispatch(getAllProductCategory({}));
        dispatch(getAllTermsConditions({}));
        dispatch(getAllWeavingContract({}));
        dispatch(getAllDyeingWorkOrders({}));
        dispatch(getSubCategoryByCategory("Colour"));
        dispatch(getAllShipmentModes({})); // Assuming you have a slice for shipment modes
    }, [dispatch]);


    // const validateForm = () => {
    //     const errors = {
    //         fabricDispatchDate: !watch("fabricDispatchDate"),
    //         vendorId: !watch("vendorId"),
    //         dyeingWorkOrderId: !watch("dyeingWorkOrderId"),
    //         orderQuantity: !watch("orderQuantity") || isNaN(Number(watch("orderQuantity"))),
    //         // Add validation for other required fields
    //     };

    //     setFormErrors(errors);
    //     return !Object.values(errors).some(error => error);
    // };


    const addItem = () => {
        if (editingIndex !== null) {
            const updatedItems = [...weavingContractItemDtl];
            updatedItems[editingIndex] = newItem;
            setweavingContractItemDtl(updatedItems);
            setEditingIndex(null);
        } else {
            setweavingContractItemDtl([...weavingContractItemDtl, newItem]);
        }
        setNewItem({
            productCategoryId: '',
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
        setNewItem(weavingContractItemDtl[index]);
        setEditingIndex(index);
    };

    const deleteItem = (index: number) => {
        setweavingContractItemDtl(weavingContractItemDtl.filter((_: any, i: number) => i !== index));
    };

    const onSubmit = async (data: FabricDispatchDyeingFormData) => {
        if (!validateForm()) {
            alert("Please fill all required fields correctly");
            return;
        }

        // Calculate total pounds from selected lots
        const totalPounds = selectedLot.reduce((sum: number, lot: any) => {
            return sum + (lot.issueQty ? Number(lot.issueQty) : 0);
        }, 0);

        const payload = {
            fabricDispatchDate: data.fabricDispatchDate,
            vendorId: Number(data.vendorId),
            dyeingWorkOrderId: Number(data.dyeingWorkOrderId),
            orderQuantity: Number(data.orderQuantity),
            dispatchedQuantity: Number(data.dispatchedQuantity),
            receivedQuantity: totalPounds, // Use calculated value
            balanceQuantity: Number(data.orderQuantity) - totalPounds,
            costPerPound: Number(data.costPerPound),
            totalAmount: Number(data.totalAmount),
            colorId: Number(data.colorId),
            pantone: data.pantone,
            finishingId: Number(data.finishingId),
            salesOrderId: Number(data.salesOrderId),
            shipmentModeId: Number(data.shipmentModeId),
            lotId: Number(data.lotId),
            remarks: data.remarks,
            activeFlag: true,
            // Include selected lots if needed
            // lots: selectedLot.map((lot: any) => ({
            //     lotId: lot.id,
            //     yarnName: lot.yarnName,
            //     pounds: lot.issueQty || 0
            // }))
        };

        // Additional validation
        // const { isValid, errors } = validatePayload(payload);
        // if (!isValid) {
        //     alert(`Validation errors:\n${errors.join('\n')}`);
        //     return;
        // }

        console.log("Submitting payload:", payload); // Debug log

        // try {
        //     alert('try')
        //     let result;
        //     if (selectedDyeingWorkOrder?.id) {
        //         alert('update')
        //         result = await dispatch(updateFabricDispatch({
        //             id: selectedDyeingWorkOrder.id,
        //             data: payload
        //         })).unwrap();
        //     } else {
        //         alert('create')
        //         result = await dispatch(createFabricDispatch(payload)).unwrap();
        //     }

        //     console.log("API response:", result); // Debug log
        //     alert(selectedDyeingWorkOrder?.id ? "Dispatch updated successfully!" : "Dispatch created successfully!");

        try {
            if (processingIssueDtl?.id) {
                // Edit mode - update
                await dispatch(updateFabricDispatch({ id: processingIssueDtl.id, data: payload })).unwrap();
                // toast.success("Sales Order updated successfully!");
            } else {
                // Create mode - save
                await dispatch(createFabricDispatch(payload)).unwrap();
                // toast.success("Sales Order saved successfully!");
            }
            navigate("/transaction/processing-issue-details");
        } catch (err) {
            // toast.error("Failed to save/update Sales Order");
        }
    };

    const resetForm = () => {
        reset();
        setSelectedLot([]);
        setSelectedDyeingWorkOrder(null);
        setDispatchDetails({
            finishedFabricCode: "",
            finishedFabricName: "",
            greigeFabricCode: "",
            greigeFabricName: "",
            orderQuantity: "",
            dispatchedQuantity: "",
            receivedQuantity: "",
            balanceQuantity: ""
        });
    };

    const handleJobWorkChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = parseInt(e.target.value);
        setSelectedJobWork([]);
        setYarnRequirementDetails([]); // Clear previous details

        if (id) {
            try {
                const result = await dispatch(getWeavingContractById(id));
                console.log(result)
                const yarnRequired = result?.payload;

                if (yarnRequired?.yarnRequirements) {
                    // Map the yarn requirements to the format needed for display
                    const requirements = yarnRequired.yarnRequirements.map((yarn: any) => ({
                        yarnType: yarn.yarnType,
                        yarnCount: yarn.yarnCount,
                        gramsPerMeter: yarn.gramsPerMeter,
                        totalwarpReq: yarn.totalRequiredQty,
                        totalWarpIssued: yarn.totalIssuedQty || 0, // Default to 0 if not provided
                        balanceWarpToIssue: yarn.totalRequiredQty - (yarn.totalIssuedQty || 0)
                    }));

                    setYarnRequirementDetails(requirements);
                    setSelectedJobWork(yarnRequired); // Store the entire job work data if needed
                }
            } catch (error) {
                console.error("Error fetching weaving contract by ID:", error);
            }
        }
    };
    const handleDyeingWorkOrderChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = parseInt(e.target.value);
        if (id) {
            try {
                // Find the selected dyeing work order from the list
                const selectedOrder = processContractList.find((order: any) => order.id === id);
                setSelectedDyeingWorkOrder(selectedOrder);

                if (selectedOrder && selectedOrder.items && selectedOrder.items.length > 0) {
                    const item = selectedOrder.items[0]; // Assuming first item for simplicity

                    // Update dispatch details
                    setDispatchDetails({
                        finishedFabricCode: item.finishedFabricCodeId || "",
                        finishedFabricName: item.finishedFabricName || "",
                        greigeFabricCode: item.greigeFabricCodeId || "",
                        greigeFabricName: item.greigeFabricName || "",
                        orderQuantity: item.quantity || "",
                        dispatchedQuantity: "0", // Initialize to 0
                        receivedQuantity: "0", // Initialize to 0
                        balanceQuantity: item.quantity || "" // Initialize to order quantity
                    });
                }
            } catch (error) {
                console.error("Error fetching dyeing work order details:", error);
            }
        } else {
            setSelectedDyeingWorkOrder(null);
            // Reset dispatch details
            setDispatchDetails({
                finishedFabricCode: "",
                finishedFabricName: "",
                greigeFabricCode: "",
                greigeFabricName: "",
                orderQuantity: "",
                dispatchedQuantity: "",
                receivedQuantity: "",
                balanceQuantity: ""
            });
        }
    };
    const handleLotSelect = (lotDetail: LotDetail) => {
        setSelectedLot((prev: LotDetail[]) => {
            // Check if lot already exists by id
            const exists = prev.some(lot => lot.id === lotDetail.id);
            if (exists) {
                return prev.filter(lot => lot.id !== lotDetail.id);
            }
            return [
                ...prev,
                {
                    ...lotDetail,
                    issueQty: null // Initialize issue quantity
                }
            ];
        });
    };

    const handleYarnIssue = async () => {
        setShowLotDialog(true);
        try {
            // Dispatch the action and wait for the result
            const result = await dispatch(getAllLotEntries({}));
            console.log('result:', result);
            // The payload should contain your data
            if (result.payload && result.payload.length > 0) {
                // Transform the API data to match your frontend structure
                const transformedLots = result.payload
                    .filter((lot: any) => lot.lotNumber) // Filter out entries with null lotNumber
                    .map((lot: any) => ({
                        id: lot.id, // Include the ID for reference
                        yarnName: `Yarn ${lot.id}`, // Customize as needed
                        lotId: lot.lotNumber,
                        availableReqQty: Number(lot.quantity) - Number(lot.rejectedQuantity || 0),
                        cost: Number(lot.cost),
                        remarks: lot.remarks,
                        // location: this.getLocationForLot(lot.id), // Implement this function if you have location data
                        activeFlag: lot.activeFlag !== false // Convert null to true
                    }));

                console.log('Transformed lots:', transformedLots); // Debug log
                setYarnIssueDetails(transformedLots);
            } else {
                console.warn('No valid lot entries found');
                setYarnIssueDetails([]);
            }
        } catch (error) {
            console.error('Error fetching lot entries:', error);
            setYarnIssueDetails([]);
        }
    };

    return (
        <div className="mt-10 p-6 bg-white shadow-md rounded-lg mt-16">
            <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-2xl font-semibold">Fabric Dispatch for Dyeing</h2>
                <Button
                    disabled={!isFormValid || isSubmitting}
                    className={`bg-green-600 hover:bg-green-700 text-white px-6 flex items-center`}
                >
                    {isSubmitting ? (
                        <span className="flex items-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </span>
                    ) : (
                        <>
                            <Save size={18} className="mr-2" />
                            {processingIssueDtl?.id ? "Update Fabric Dispatch" : "Save Fabric Dispatch"}
                        </>
                    )}
                </Button>
            </div>
            <div className="space-y-6">
                <div className="mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            <button
                                onClick={() => setActiveTab('orderDetails')}
                                className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm ${activeTab === 'orderDetails'
                                    ? 'border-red-500 text-red-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 Inward Ordershover:border-gray-300'
                                    }`}
                            >
                                <FileText className="w-4 h-4" />
                                Details
                            </button>
                        </nav>
                    </div>
                </div>

                {activeTab === "orderDetails" && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-4 gap-6">
                                {/* Date Field */}
                                <div>
                                    <label className="block text-sm font-medium">Dispatch Date <span className="text-red-600">*</span></label>
                                    <input
                                        type="date"
                                        {...register("fabricDispatchDate", { required: "Dispatch date is required" })}
                                        className={`input mt-1 ${errors.fabricDispatchDate ? 'border-red-500' : ''}`}
                                        placeholder="Select dispatch date"
                                    />
                                    {errors.fabricDispatchDate && (
                                        <p className="mt-1 text-sm text-red-600">{errors.fabricDispatchDate.message}</p>
                                    )}
                                </div>

                                {/* Vendor Field */}
                                <div>
                                    <label className="block text-sm font-medium">Vendor <span className="text-red-600">*</span></label>
                                    <select
                                        {...register("vendorId", { required: "Vendor is required" })}
                                        className={`input mt-1 ${errors.vendorId ? 'border-red-500' : ''}`}
                                    >
                                        <option value="">Select Vendor</option>
                                        {vendorList?.map((vendor: any) => (
                                            <option key={vendor.id} value={vendor.id}>{vendor.vendorName}</option>
                                        ))}
                                    </select>
                                    {errors.vendorId && (
                                        <p className="mt-1 text-sm text-red-600">{errors.vendorId.message}</p>
                                    )}
                                </div>

                                {/* Dyeing Work Order Field */}
                                <div>
                                    <label className="block text-sm font-medium">Dyeing Work Order <span className="text-red-600">*</span></label>
                                    <select
                                        {...register("dyeingWorkOrderId", { required: "Work order is required" })}
                                        className={`input mt-1 ${errors.dyeingWorkOrderId ? 'border-red-500' : ''}`}
                                        onChange={handleDyeingWorkOrderChange}
                                    >
                                        <option value="">Select Work Order</option>
                                        {processContractList?.map((dyn: any) => (
                                            <option key={dyn.id} value={dyn.id}>{dyn.dyeingWorkOrderNo}</option>
                                        ))}
                                    </select>
                                    {errors.dyeingWorkOrderId && (
                                        <p className="mt-1 text-sm text-red-600">{errors.dyeingWorkOrderId.message}</p>
                                    )}
                                </div>

                                {/* Order Quantity Field */}
                                <div>
                                    <label className="block text-sm font-medium">Order Quantity (lbs) <span className="text-red-600">*</span></label>
                                    <input
                                        type="number"
                                        {...register("orderQuantity", {
                                            required: "Quantity is required",
                                            min: { value: 0.01, message: "Must be greater than 0" }
                                        })}
                                        className={`input mt-1 ${errors.orderQuantity ? 'border-red-500' : ''}`}
                                        placeholder="Enter quantity in pounds"
                                        step="0.01"
                                    />
                                    {errors.orderQuantity && (
                                        <p className="mt-1 text-sm text-red-600">{errors.orderQuantity.message}</p>
                                    )}
                                </div>

                                {/* Cost Per Pound Field */}
                                <div>
                                    <label className="block text-sm font-medium">Cost Per Pound ($) <span className="text-red-600">*</span></label>
                                    <input
                                        type="number"
                                        {...register("costPerPound", {
                                            required: "Cost is required",
                                            min: { value: 0.01, message: "Must be greater than 0" }
                                        })}
                                        className={`input mt-1 ${errors.costPerPound ? 'border-red-500' : ''}`}
                                        placeholder="Enter cost per pound"
                                        step="0.01"
                                    />
                                    {errors.costPerPound && (
                                        <p className="mt-1 text-sm text-red-600">{errors.costPerPound.message}</p>
                                    )}
                                </div>

                                {/* Total Amount Field */}
                                <div>
                                    <label className="block text-sm font-medium">Total Amount ($) <span className="text-red-600">*</span></label>
                                    <input
                                        type="number"
                                        {...register("totalAmount", {
                                            required: "Total amount is required",
                                            min: { value: 0.01, message: "Must be greater than 0" }
                                        })}
                                        className={`input mt-1 ${errors.totalAmount ? 'border-red-500' : ''}`}
                                        placeholder="Calculated total amount"
                                        readOnly
                                    />
                                    {errors.totalAmount && (
                                        <p className="mt-1 text-sm text-red-600">{errors.totalAmount.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">Select Color</label>
                                    <select {...register("colorId")} className="input mt-1">
                                        <option value="">Select Color</option>
                                        {subCategoryByCategoryList?.map((sbc: any) => (
                                            <option key={sbc.id} value={sbc.id}>{sbc.subCategoryName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Pantone</label>
                                    <input {...register("pantone")} className="input mt-1" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Finishing</label>
                                    <select
                                        {...register("finishingId")}
                                        className="input mt-1"
                                    // onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleJobWorkChange(e)}
                                    >
                                        <option value="">Select a Jyeing Work No</option>
                                        {processContractList?.map((jwn: any) => (
                                            <option key={jwn.id} value={jwn.id}>{jwn.dyeingWorkOrderNo}</option>
                                        ))}
                                    </select>
                                </div>
                                {/* <div>
                                    <label className="block text-sm font-medium">Sales Order</label>
                                    <input {...register("salesOrderId", { required: "Sales Order No is required" })} className="input mt-1" />
                                </div> */}
                                <div>
                                    <label className="block text-sm font-medium">Sales Order</label>
                                    <select
                                        {...register("salesOrderId", { required: "Sales Order is required" })}
                                        className="input mt-1"
                                    >
                                        <option value="">Select sales Order</option>
                                        {salesOrderList?.map((sm: any) => (
                                            <option key={sm.id} value={sm.id}>{sm.salesOrderNo}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Ship Via</label>
                                    <select
                                        {...register("shipmentModeId")}
                                        className="input mt-1"
                                    >
                                        <option value="">Select a Ship Via</option>
                                        {shipmentModesList?.map((sm: any) => (
                                            <option key={sm.id} value={sm.id}>{sm.modeName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Instructions</label>
                                    <textarea {...register("remarks")} className="input mt-1"></textarea>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* {selectedDyeingWorkOrder && ( */}
                <>
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Dispatch Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-4 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">Finished Fabric Code</label>
                                    <input
                                        value={dispatchDetails.finishedFabricCode}
                                        className="input mt-1"
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">Finished Fabric Name</label>
                                    <input
                                        value={dispatchDetails.finishedFabricName}
                                        className="input mt-1"
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">Greige Fabric Code</label>
                                    <input
                                        value={dispatchDetails.greigeFabricCode}
                                        className="input mt-1"
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">Greige Fabric Name</label>
                                    <input
                                        value={dispatchDetails.greigeFabricName}
                                        className="input mt-1"
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">Order Quantity</label>
                                    <input
                                        value={dispatchDetails.orderQuantity}
                                        className="input mt-1"
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">Dispatched Quantity</label>
                                    <input
                                        value={dispatchDetails.dispatchedQuantity}
                                        className="input mt-1"
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">Received Quantity</label>
                                    <input
                                        value={dispatchDetails.receivedQuantity}
                                        className="input mt-1"
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">Balance Quantity</label>
                                    <input
                                        value={dispatchDetails.balanceQuantity}
                                        className="input mt-1"
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className="mt-4 text-right">
                                <Button
                                    onClick={handleYarnIssue}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                    disabled={!selectedDyeingWorkOrder}
                                >
                                    <Plus size={18} className="mr-2" />
                                    Roll Dispatch
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>Fabric Issue Details</span>
                                {/* <Button onClick={handleYarnIssue}>Add Lot</Button> */}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border p-2">Fabric Code & Name</th>
                                        <th className="border p-2">Roll no</th>
                                        <th className="border p-2">Pounds</th>
                                        <th className="border p-2">Lot No</th>
                                        <th className="border p-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedLot.length > 0 ? (
                                        selectedLot.map((detail: any, index: any) => (
                                            <tr key={index}>
                                                <td className="border p-2">{detail.yarnName}</td>
                                                <td className="border p-2">{detail.lotId}</td>
                                                <td className="border p-2">{detail.availableQty}</td>
                                                <td className="border p-2">{detail.lotNumber}</td>
                                                {/* <td className="border p-2">
                                                        <Input
                                                            type="number"
                                                            value={detail.issueQty}
                                                            onChange={(e) => {
                                                                const newDetails = [...selectedLot];
                                                                newDetails[index].issueQty = Number(e.target.value);
                                                                setSelectedLot(newDetails);
                                                            }}
                                                        />
                                                    </td> */}
                                                <td className="border p-2">
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedLot(selectedLot.filter((_: any, i: any) => i !== index));
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="border p-2 text-center text-gray-500">
                                                No lots selected. Click "Add Lot" to select yarn lots.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>

                    <Dialog open={showLotDialog} onOpenChange={setShowLotDialog}>
                        <DialogContent className="max-w-4xl">
                            <DialogHeader>
                                <DialogTitle>Select Lots</DialogTitle>
                            </DialogHeader>
                            <div className="max-h-[60vh] overflow-y-auto">
                                <table className="w-full border-collapse">
                                    <thead className="sticky top-0 bg-gray-100">
                                        <tr>
                                            <th className="border p-2">Select</th>
                                            <th className="border p-2">Yarn Name</th>
                                            <th className="border p-2">Lot ID</th>
                                            <th className="border p-2">Lot Number</th>
                                            <th className="border p-2">Available Qty</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {yarnIssueDetails.map((lot: any) => {
                                            const isSelected = selectedLot.some((l: LotDetail) => l.id === lot.id);
                                            return (
                                                <tr key={lot.id} className={isSelected ? "bg-blue-50" : ""}>
                                                    <td className="border p-2 text-center">
                                                        <Checkbox
                                                            checked={isSelected}
                                                            onCheckedChange={() => handleLotSelect({
                                                                id: lot.id,
                                                                yarnName: lot.yarnName,
                                                                availableQty: lot.availableReqQty,
                                                                lotNumber: lot.lotId // For display only
                                                            })}
                                                        />
                                                    </td>
                                                    <td className="border p-2">{lot.yarnName}</td>
                                                    <td className="border p-2">{lot.id}</td>
                                                    <td className="border p-2">{lot.lotId}</td>
                                                    <td className="border p-2">{lot.availableReqQty}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <Button variant="outline" onClick={() => setShowLotDialog(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={() => setShowLotDialog(false)}>
                                    Confirm Selection
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </>
                {/* )} */}
            </div>
        </div>
    );
}








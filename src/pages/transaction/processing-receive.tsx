import React, { useEffect, useMemo, useState } from "react";
import { FileText, ShoppingCart, ClipboardList, Edit, Trash2, Save, Plus } from "lucide-react";
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
import { getAllPurchaseInwards } from "@/state/purchaseInwardSlice";
import { getAllSalesOrders } from "@/state/salesOrderSlice";
import { getSubCategoryByCategory } from "@/state/subCategorySlice";
import { getAllWarehouse } from "@/state/warehouseSlice";
import { createFinishFabricReceive } from "@/state/finishFabricReceiveSlice";
import { getAllGrandMaster } from "@/state/gradeMasterSlice";

// interface FabricReceiveDetail {
//     fabricCode: string;
//     rollNo: string;
//     rollYards: string;
//     weight: string;
//     grade: string;
//     lotNo: string;
// }

// interface FinishFabricReceiveFormData {
//     id?: number;
//     fabricReceiveDate: string;
//     vendorId: string;
//     dyeingWorkOrderId: string;
//     orderQuantity: string;
//     dispatchedQuantity: string;
//     receivedQuantity: string;
//     balanceQuantity: string;
//     costPerPound: string;
//     totalAmount: string;
//     colorId: string;
//     pantone: string;
//     finishingId: string;
//     salesOrderId: string;
//     purchaseInwardId: string;
//     lotId: string | null;
//     remarks: string;
//     activeFlag: true;
// }

interface FabricReceiveItem {
    finishedFabricCode: string;
    rollNo: string;
    rollYards: string;
    weight: string;
    gradeId: number;
    warehouseId: number;
    activeFlag: boolean;
}

interface FinishFabricReceiveFormData {
    fabricReceiveDate: string;
    vendorId: number;
    dyeingWorkOrderId: number;
    orderQuantity: number;
    costPerPound: number;
    totalAmount: number;
    colorId: number;
    pantone: string;
    finishingId: number;
    salesOrderId: number;
    purchaseInwardId: number;
    dispatchedQuantity: number;
    receivedQuantity: number;
    balanceQuantity: number;
    remarks: string;
    activeFlag: boolean;
    items: FabricReceiveItem[];
}


export function ProcessingReceive() {

    const { weavingContractList } = useSelector((state: RootState) => state.weavingContracts);
    const { processContractList } = useSelector((state: RootState) => state.dyeingWorkOrde);
    const { vendorList } = useSelector((state: RootState) => state.vendor);
    const { gradeList } = useSelector((state: RootState) => state.grade);
    const [weavingContractItemDtl, setweavingContractItemDtl]: any = useState([]);
    const [newItem, setNewItem]: any = useState({
        finishedFabricCode: '',
        rollNo: '',
        rollYards: '',
        weight: '',
        gradeId: '',
        lotNo: ''
    });
    const [editingIndex, setEditingIndex]: any = useState(null);
    const [activeTab, setActiveTab] = useState("orderDetails");
    const [isEditing, setIsEditing] = React.useState(false);
    const [filteredProductCategories, setFilteredProductCategories] = useState<any[]>([]);
    const [selectedProductCategory, setSelectedProductCategory] = useState<any>(null);
    const [selectedJobWork, setSelectedJobWork]: any = useState([]);
    const [yarnRequirementDetails, setYarnRequirementDetails]: any = useState([]);
    const [showLotDialog, setShowLotDialog] = useState(false);
    const [yarnIssueDetails, setYarnIssueDetails] = useState([]);
    const [selectedDyeingWorkOrder, setSelectedDyeingWorkOrder] = useState<any>(null);
    const { subCategoryByCategoryList } = useSelector((state: RootState) => state.subCategory);
    const { salesOrderList } = useSelector((state: RootState) => state.salesOrder);
    const { purchaseInwardList } = useSelector((state: RootState) => state.purchaseInward);
    const { warehouseList } = useSelector((state: RootState) => state.warehouse);
    const [fabricReceiveDetails, setFabricReceiveDetails] = useState<FabricReceiveItem[]>([]);
    // const [fabricReceiveItems, setFabricReceiveItems] = useState<FabricReceiveItem[]>([]);

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

    const dispatch = useDispatch<AppDispatch>();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FinishFabricReceiveFormData>();

    useEffect(() => {
        dispatch(getAllVendors({}));
        dispatch(getAllTermsConditions({}));
        dispatch(getAllWeavingContract({}));
        dispatch(getAllPurchaseInwards({}));
        dispatch(getAllSalesOrders({}));
        dispatch(getAllWarehouse({}));
        dispatch(getAllGrandMaster({}));
        dispatch(getSubCategoryByCategory("Colour"));
    }, [dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNewItem({ ...newItem, [e.target.name]: e.target.value });
    };

    const addFabricReceiveDetail = () => {
        if (editingIndex !== null) {
            // Update existing item
            const updatedDetails = [...fabricReceiveDetails];
            updatedDetails[editingIndex] = newItem;
            setFabricReceiveDetails(updatedDetails);
            setEditingIndex(null);
        } else {
            // Add new item
            setFabricReceiveDetails([...fabricReceiveDetails, newItem]);
        }

        // Reset form
        setNewItem({
            fabricCode: '',
            rollNo: '',
            rollYards: '',
            weight: '',
            grade: '',
            lotNo: ''
        });
    };

    const editFabricReceiveDetail = (index: number) => {
        setNewItem(fabricReceiveDetails[index]);
        setEditingIndex(index);
    };

    const deleteFabricReceiveDetail = (index: number) => {
        setFabricReceiveDetails(fabricReceiveDetails.filter((_: any, i: number) => i !== index));
    };

    // const onSubmit = (data: FinishFabricReceiveFormData) => {
    //     // Your existing submit logic
    //     // Make sure to include fabricReceiveDetails in your payload
    //     console.log("Fabric receive details:", fabricReceiveDetails);
    //     // Rest of your submit logic
    // };
    const onSubmit = (data: FinishFabricReceiveFormData) => {
        const payload = {
            ...data,
            items: fabricReceiveDetails,
            dispatchedQuantity: data.orderQuantity, // Assuming dispatched equals ordered
            receivedQuantity: data.orderQuantity,   // Assuming received equals ordered
            balanceQuantity: 0                       // Assuming balance is zero
        };

        dispatch(createFinishFabricReceive(payload))
            .unwrap()
            .then(() => {
                // Reset form on success
                reset();
                setFabricReceiveDetails([]);
                // Show success message or redirect
            })
            .catch(error => {
                console.error("Error creating finish fabric receive:", error);
                // Show error message
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

    // Function to determine grade based on points
    const determineGrade = (minPoint: number, maxPoint: number) => {
        const averagePoint = (minPoint + maxPoint) / 2;
        const matchingGrade = gradeList.find(
            (grade: any) => averagePoint >= grade.minPoint && averagePoint <= grade.maxPoint
        );
        return matchingGrade ? matchingGrade.id : '';
    };

    // Effect to auto-set grade when minPoint or maxPoint changes
    useEffect(() => {
        if (newItem.minPoint && newItem.maxPoint) {
            const min = parseFloat(newItem.minPoint);
            const max = parseFloat(newItem.maxPoint);

            if (!isNaN(min) && !isNaN(max)) {
                const gradeId = determineGrade(min, max);
                if (gradeId) {
                    setNewItem((prev: any) => ({ ...prev, gradeId: gradeId.toString() }));
                }
            }
        }
    }, [newItem.minPoint, newItem.maxPoint]);

    return (
        <div className="mt-10 p-6 bg-white shadow-md rounded-lg mt-16">
            <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-2xl font-semibold">Finished Fabric Receive</h2>
                <Button onClick={handleSubmit(onSubmit)} className="bg-green-600 hover:bg-green-700 text-white px-6 flex items-center">
                    <Save size={18} className="mr-2" /> Save Fabric Receive
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
                                <label className="block text-sm font-medium">Finished Fabric Receive Date <span className="text-red-600">*</span></label>
                                <input
                                    type="date"
                                    {...register("fabricReceiveDate", { required: "Dispatch date is required" })}
                                    className={`input mt-1 ${errors.fabricReceiveDate ? 'border-red-500' : ''}`}
                                    placeholder="Select dispatch date"
                                />
                                {errors.fabricReceiveDate && (
                                    <p className="mt-1 text-sm text-red-600">{errors.fabricReceiveDate.message}</p>
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
                                // readOnly
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
                                    {...register("finishingId", { required: "Po Type is required" })}
                                    className="input mt-1"
                                >
                                    <option value="">Select a JobWork Number</option>
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
                                <label className="block text-sm font-medium">Inward No</label>
                                <select
                                    {...register("purchaseInwardId", { required: "Inward No is required" })}
                                    className="input mt-1"
                                >
                                    <option value="">Select Purchase Inward No</option>
                                    {purchaseInwardList?.map((pi: any) => (
                                        <option key={pi.id} value={pi.id}>{pi.id}</option>
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

            {selectedJobWork && (
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
                        </CardContent>
                    </Card>

                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Inward Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-4 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">Finished Fabric Code</label>
                                    <input
                                        name="finishedFabricCode"
                                        value={newItem.finishedFabricCode}
                                        onChange={handleChange}
                                        className="input mt-1"
                                        placeholder="Fabric Code"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">Roll No</label>
                                    <input
                                        name="rollNo"
                                        value={newItem.rollNo}
                                        onChange={handleChange}
                                        className="input mt-1"
                                        placeholder="Roll No"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">Roll Yards</label>
                                    <input
                                        name="rollYards"
                                        value={newItem.rollYards}
                                        onChange={handleChange}
                                        className="input mt-1"
                                        placeholder="Roll Yards"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">Weight</label>
                                    <input
                                        name="weight"
                                        value={newItem.weight}
                                        onChange={handleChange}
                                        className="input mt-1"
                                        placeholder="Weight"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">Min Point</label>
                                    <input
                                        name="minPoint"
                                        value={newItem.minPoint}
                                        onChange={handleChange}
                                        className="input mt-1"
                                        placeholder="minPoint"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">Max Point</label>
                                    <input
                                        name="maxPoint"
                                        value={newItem.maxPoint}
                                        onChange={handleChange}
                                        className="input mt-1"
                                        placeholder="maxPoint"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">Grade</label>
                                    <select
                                        name="gradeId"
                                        value={newItem.gradeId}
                                        onChange={handleChange}
                                        className="input mt-1"
                                    >
                                        <option value="">Select Grade</option>
                                        {gradeList?.map((grade: any) => (
                                            <option key={grade.id} value={grade.id}>
                                                {grade.gradeName} ({grade.minPoint}-{grade.maxPoint} points)
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">Warehouse</label>
                                    <select
                                        name="warehouseId"
                                        value={newItem.warehouse}
                                        onChange={handleChange}
                                        className="input mt-1"
                                    >
                                        <option value="">Select Warehouse</option>
                                        {warehouseList?.map((wh: any) => (
                                            <option key={wh.id} value={wh.id}>{wh.warehouseName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div></div>
                                <div>
                                    <Button
                                        onClick={addFabricReceiveDetail}
                                        className="mt-4 ml-auto flex justify-end"
                                    >
                                        <Plus size={18} className="mr-2" />
                                        {editingIndex !== null ? "Update Item" : "Add"}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>Fabric Receive Details</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border p-2">Fabric Code</th>
                                        <th className="border p-2">Roll no</th>
                                        <th className="border p-2">Roll yards</th>
                                        <th className="border p-2">Weight</th>
                                        <th className="border p-2">Grade</th>
                                        {/* <th className="border p-2">Lot No</th> */}
                                        <th className="border p-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fabricReceiveDetails.length > 0 ? (
                                        fabricReceiveDetails.map((detail: FabricReceiveItem, index: number) => (
                                            <tr key={index}>
                                                <td className="border p-2">{detail.finishedFabricCode}</td>
                                                <td className="border p-2">{detail.rollNo}</td>
                                                <td className="border p-2">{detail.rollYards}</td>
                                                <td className="border p-2">{detail.weight}</td>
                                                <td className="border p-2">{detail.gradeId}</td>
                                                {/* <td className="border p-2">{detail.lotNo}</td> */}
                                                <td className="border p-2 flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => editFabricReceiveDetail(index)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => deleteFabricReceiveDetail(index)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="border p-2 text-center text-gray-500">
                                                No fabric receive details added yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}




// import React, { useEffect, useMemo, useState } from "react";
// import { FileText, Save, Plus, Edit, Trash2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useForm } from "react-hook-form";
// import { AppDispatch, RootState } from "@/state/store";
// import { useDispatch, useSelector } from "react-redux";
// import { Input } from "@/components/ui/input";
// import { createFinishFabricReceive } from "@/state/finishFabricReceiveSlice";
// import { getAllVendors } from "@/state/vendorSlice";
// import { getAllSalesOrders } from "@/state/salesOrderSlice";
// import { getAllPurchaseInwards } from "@/state/purchaseInwardSlice";
// import { getAllWarehouse } from "@/state/warehouseSlice";
// import { getSubCategoryByCategory } from "@/state/subCategorySlice";
// import { getAllDyeingWorkOrders } from "@/state/processContractSlice";

// interface FabricReceiveItem {
//     finishedFabricCode: string;
//     rollNo: string;
//     rollYards: string;
//     weight: string;
//     gradeId: number;
//     warehouseId: number;
//     activeFlag: boolean;
// }

// interface FinishFabricReceiveFormData {
//     fabricReceiveDate: string;
//     vendorId: number;
//     dyeingWorkOrderId: number;
//     orderQuantity: number;
//     costPerPound: number;
//     totalAmount: number;
//     colorId: number;
//     pantone: string;
//     finishingId: number;
//     salesOrderId: number;
//     purchaseInwardId: number;
//     dispatchedQuantity: number;
//     receivedQuantity: number;
//     balanceQuantity: number;
//     remarks: string;
//     activeFlag: boolean;
//     items: FabricReceiveItem[];
// }

// export function FinishFabricReceive() {

//     const { vendorList } = useSelector((state: RootState) => state.vendor);
//     const { salesOrderList } = useSelector((state: RootState) => state.salesOrder);
//     const { purchaseInwardList } = useSelector((state: RootState) => state.purchaseInward);
//     const { processContractList } = useSelector((state: RootState) => state.dyeingWorkOrde);
//     const { warehouseList } = useSelector((state: RootState) => state.warehouse);
//     const { subCategoryByCategoryList } = useSelector((state: RootState) => state.subCategory);

//     const [fabricReceiveItems, setFabricReceiveItems] = useState<FabricReceiveItem[]>([]);
//     const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
//     const [newItem, setNewItem] = useState<FabricReceiveItem>({
//         finishedFabricCode: '',
//         rollNo: '',
//         rollYards: '',
//         weight: '',
//         gradeId: 0,
//         warehouseId: 0,
//         activeFlag: true
//     });

//     const dispatch = useDispatch<AppDispatch>();

//     const { register, handleSubmit, reset, formState: { errors }, watch, setValue } = useForm<FinishFabricReceiveFormData>({
//         defaultValues: {
//             activeFlag: true,
//             items: []
//         }
//     });

//     // Calculate total amount when quantity or cost changes
//     const orderQuantity = watch("orderQuantity");
//     const costPerPound = watch("costPerPound");

//     useEffect(() => {
//         if (orderQuantity && costPerPound) {
//             const total = Number(orderQuantity) * Number(costPerPound);
//             setValue("totalAmount", total);
//         }
//     }, [orderQuantity, costPerPound, setValue]);

//     useEffect(() => {
//         dispatch(getAllVendors({}));
//         dispatch(getAllSalesOrders({}));
//         dispatch(getAllPurchaseInwards({}));
//         dispatch(getAllDyeingWorkOrders({}));
//         dispatch(getAllWarehouse({}));
//         dispatch(getSubCategoryByCategory("Colour"));
//     }, [dispatch]);

//     const handleItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const { name, value } = e.target;
//         setNewItem(prev => ({
//             ...prev,
//             [name]: name === 'gradeId' || name === 'warehouseId' ? Number(value) : value
//         }));
//     };

//     const addOrUpdateItem = () => {
//         if (editingItemIndex !== null) {
//             // Update existing item
//             const updatedItems = [...fabricReceiveItems];
//             updatedItems[editingItemIndex] = newItem;
//             setFabricReceiveItems(updatedItems);
//             setEditingItemIndex(null);
//         } else {
//             // Add new item
//             setFabricReceiveItems([...fabricReceiveItems, newItem]);
//         }

//         // Reset form
//         setNewItem({
//             finishedFabricCode: '',
//             rollNo: '',
//             rollYards: '',
//             weight: '',
//             gradeId: 0,
//             warehouseId: 0,
//             activeFlag: true
//         });
//     };

//     const editItem = (index: number) => {
//         setNewItem(fabricReceiveItems[index]);
//         setEditingItemIndex(index);
//     };

//     const deleteItem = (index: number) => {
//         setFabricReceiveItems(fabricReceiveItems.filter((_, i) => i !== index));
//     };

// const onSubmit = (data: FinishFabricReceiveFormData) => {
//     const payload = {
//         ...data,
//         items: fabricReceiveItems,
//         dispatchedQuantity: data.orderQuantity, // Assuming dispatched equals ordered
//         receivedQuantity: data.orderQuantity,   // Assuming received equals ordered
//         balanceQuantity: 0                       // Assuming balance is zero
//     };

//     dispatch(createFinishFabricReceive(payload))
//         .unwrap()
//         .then(() => {
//             // Reset form on success
//             reset();
//             setFabricReceiveItems([]);
//             // Show success message or redirect
//         })
//         .catch(error => {
//             console.error("Error creating finish fabric receive:", error);
//             // Show error message
//         });
// };

//     return (
//         <div className="mt-10 p-6 bg-white shadow-md rounded-lg">
//             <div className="flex justify-between items-center border-b pb-4">
//                 <h2 className="text-2xl font-semibold">Finished Fabric Receive</h2>
//                 <Button
//                     onClick={handleSubmit(onSubmit)}
//                     className="bg-green-600 hover:bg-green-700 text-white px-6 flex items-center"
//                 >
//                     <Save size={18} className="mr-2" /> Save Fabric Receive
//                 </Button>
//             </div>

//             <div className="space-y-6 mt-6">
//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Basic Information</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <div className="grid grid-cols-3 gap-6">
//                             {/* Fabric Receive Date */}
//                             <div>
//                                 <label className="block text-sm font-medium mb-1">Receive Date <span className="text-red-600">*</span></label>
//                                 <Input
//                                     type="date"
//                                     {...register("fabricReceiveDate", { required: "Receive date is required" })}
//                                     className={errors.fabricReceiveDate ? "border-red-500" : ""}
//                                 />
//                                 {errors.fabricReceiveDate && (
//                                     <p className="mt-1 text-sm text-red-600">{errors.fabricReceiveDate.message}</p>
//                                 )}
//                             </div>

//                             {/* Vendor */}
//                             <div>
//                                 <label className="block text-sm font-medium mb-1">Vendor <span className="text-red-600">*</span></label>
//                                 <select
//                                     {...register("vendorId", { required: "Vendor is required", valueAsNumber: true })}
//                                     className={`w-full p-2 border rounded ${errors.vendorId ? "border-red-500" : ""}`}
//                                 >
//                                     <option value="">Select Vendor</option>
//                                     {vendorList?.map((vendor: any) => (
//                                         <option key={vendor.id} value={vendor.id}>{vendor.vendorName}</option>
//                                     ))}
//                                 </select>
//                                 {errors.vendorId && (
//                                     <p className="mt-1 text-sm text-red-600">{errors.vendorId.message}</p>
//                                 )}
//                             </div>

//                             {/* Dyeing Work Order */}
//                             <div>
//                                 <label className="block text-sm font-medium mb-1">Dyeing Work Order <span className="text-red-600">*</span></label>
//                                 <select
//                                     {...register("dyeingWorkOrderId", { required: "Work order is required", valueAsNumber: true })}
//                                     className={`w-full p-2 border rounded ${errors.dyeingWorkOrderId ? "border-red-500" : ""}`}
//                                 >
//                                     <option value="">Select Work Order</option>
//                                     {processContractList?.map((order: any) => (
//                                         <option key={order.id} value={order.id}>{order.dyeingWorkOrderNo}</option>
//                                     ))}
//                                 </select>
//                                 {errors.dyeingWorkOrderId && (
//                                     <p className="mt-1 text-sm text-red-600">{errors.dyeingWorkOrderId.message}</p>
//                                 )}
//                             </div>

//                             {/* Order Quantity */}
//                             <div>
//                                 <label className="block text-sm font-medium mb-1">Order Quantity (lbs) <span className="text-red-600">*</span></label>
//                                 <Input
//                                     type="number"
//                                     step="0.01"
//                                     {...register("orderQuantity", {
//                                         required: "Quantity is required",
//                                         min: { value: 0.01, message: "Must be greater than 0" },
//                                         valueAsNumber: true
//                                     })}
//                                     className={errors.orderQuantity ? "border-red-500" : ""}
//                                 />
//                                 {errors.orderQuantity && (
//                                     <p className="mt-1 text-sm text-red-600">{errors.orderQuantity.message}</p>
//                                 )}
//                             </div>

//                             {/* Cost Per Pound */}
//                             <div>
//                                 <label className="block text-sm font-medium mb-1">Cost Per Pound ($) <span className="text-red-600">*</span></label>
//                                 <Input
//                                     type="number"
//                                     step="0.01"
//                                     {...register("costPerPound", {
//                                         required: "Cost is required",
//                                         min: { value: 0.01, message: "Must be greater than 0" },
//                                         valueAsNumber: true
//                                     })}
//                                     className={errors.costPerPound ? "border-red-500" : ""}
//                                 />
//                                 {errors.costPerPound && (
//                                     <p className="mt-1 text-sm text-red-600">{errors.costPerPound.message}</p>
//                                 )}
//                             </div>

//                             {/* Total Amount (readonly) */}
//                             <div>
//                                 <label className="block text-sm font-medium mb-1">Total Amount ($)</label>
//                                 <Input
//                                     type="number"
//                                     readOnly
//                                     {...register("totalAmount", { valueAsNumber: true })}
//                                 />
//                             </div>

//                             {/* Color */}
//                             <div>
//                                 <label className="block text-sm font-medium mb-1">Color</label>
//                                 <select
//                                     {...register("colorId", { valueAsNumber: true })}
//                                     className="w-full p-2 border rounded"
//                                 >
//                                     <option value="">Select Color</option>
//                                     {subCategoryByCategoryList?.map((color: any) => (
//                                         <option key={color.id} value={color.id}>{color.subCategoryName}</option>
//                                     ))}
//                                 </select>
//                             </div>

//                             {/* Pantone */}
//                             <div>
//                                 <label className="block text-sm font-medium mb-1">Pantone</label>
//                                 <Input
//                                     type="text"
//                                     {...register("pantone")}
//                                 />
//                             </div>

//                             {/* Finishing */}
//                             <div>
//                                 <label className="block text-sm font-medium mb-1">Finishing</label>
//                                 <select
//                                     {...register("finishingId", { valueAsNumber: true })}
//                                     className="w-full p-2 border rounded"
//                                 >
//                                     <option value="">Select Finishing</option>
//                                     {processContractList?.map((order: any) => (
//                                         <option key={order.id} value={order.id}>{order.dyeingWorkOrderNo}</option>
//                                     ))}
//                                 </select>
//                             </div>

//                             {/* Sales Order */}
//                             <div>
//                                 <label className="block text-sm font-medium mb-1">Sales Order</label>
//                                 <select
//                                     {...register("salesOrderId", { valueAsNumber: true })}
//                                     className="w-full p-2 border rounded"
//                                 >
//                                     <option value="">Select Sales Order</option>
//                                     {salesOrderList?.map((order: any) => (
//                                         <option key={order.id} value={order.id}>{order.salesOrderNo}</option>
//                                     ))}
//                                 </select>
//                             </div>

//                             {/* Purchase Inward */}
//                             <div>
//                                 <label className="block text-sm font-medium mb-1">Purchase Inward</label>
//                                 <select
//                                     {...register("purchaseInwardId", { valueAsNumber: true })}
//                                     className="w-full p-2 border rounded"
//                                 >
//                                     <option value="">Select Purchase Inward</option>
//                                     {purchaseInwardList?.map(inward => (
//                                         <option key={inward.id} value={inward.id}>{inward.id}</option>
//                                     ))}
//                                 </select>
//                             </div>

//                             {/* Remarks */}
//                             <div className="col-span-3">
//                                 <label className="block text-sm font-medium mb-1">Remarks</label>
//                                 <textarea
//                                     {...register("remarks")}
//                                     className="w-full p-2 border rounded"
//                                     rows={3}
//                                 />
//                             </div>
//                         </div>
//                     </CardContent>
//                 </Card>

//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Fabric Receive Items</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <div className="grid grid-cols-4 gap-6 mb-6">
//                             {/* Finished Fabric Code */}
//                             <div>
//                                 <label className="block text-sm font-medium mb-1">Fabric Code</label>
//                                 <Input
//                                     name="finishedFabricCode"
//                                     value={newItem.finishedFabricCode}
//                                     onChange={handleItemChange}
//                                 />
//                             </div>

//                             {/* Roll No */}
//                             <div>
//                                 <label className="block text-sm font-medium mb-1">Roll No</label>
//                                 <Input
//                                     name="rollNo"
//                                     value={newItem.rollNo}
//                                     onChange={handleItemChange}
//                                 />
//                             </div>

//                             {/* Roll Yards */}
//                             <div>
//                                 <label className="block text-sm font-medium mb-1">Roll Yards</label>
//                                 <Input
//                                     name="rollYards"
//                                     value={newItem.rollYards}
//                                     onChange={handleItemChange}
//                                 />
//                             </div>

//                             {/* Weight */}
//                             <div>
//                                 <label className="block text-sm font-medium mb-1">Weight</label>
//                                 <Input
//                                     name="weight"
//                                     value={newItem.weight}
//                                     onChange={handleItemChange}
//                                 />
//                             </div>

//                             {/* Grade */}
//                             <div>
//                                 <label className="block text-sm font-medium mb-1">Grade</label>
//                                 <select
//                                     name="gradeId"
//                                     value={newItem.gradeId}
//                                     onChange={handleItemChange}
//                                     className="w-full p-2 border rounded"
//                                 >
//                                     <option value="0">Select Grade</option>
//                                     <option value="1">Grade A</option>
//                                     <option value="2">Grade B</option>
//                                     <option value="3">Grade C</option>
//                                 </select>
//                             </div>

//                             {/* Warehouse */}
//                             <div>
//                                 <label className="block text-sm font-medium mb-1">Warehouse</label>
//                                 <select
//                                     name="warehouseId"
//                                     value={newItem.warehouseId}
//                                     onChange={handleItemChange}
//                                     className="w-full p-2 border rounded"
//                                 >
//                                     <option value="0">Select Warehouse</option>
//                                     {warehouseList?.map((warehouse: any) => (
//                                         <option key={warehouse.id} value={warehouse.id}>{warehouse.warehouseName}</option>
//                                     ))}
//                                 </select>
//                             </div>

//                             {/* Add/Update Button */}
//                             <div className="flex items-end">
//                                 <Button
//                                     onClick={addOrUpdateItem}
//                                     className="w-full"
//                                 >
//                                     <Plus size={18} className="mr-2" />
//                                     {editingItemIndex !== null ? "Update Item" : "Add Item"}
//                                 </Button>
//                             </div>
//                         </div>

//                         {/* Items Table */}
//                         <div className="overflow-x-auto">
//                             <table className="w-full border-collapse">
//                                 <thead>
//                                     <tr className="bg-gray-100">
//                                         <th className="border p-2">Fabric Code</th>
//                                         <th className="border p-2">Roll No</th>
//                                         <th className="border p-2">Roll Yards</th>
//                                         <th className="border p-2">Weight</th>
//                                         <th className="border p-2">Grade</th>
//                                         <th className="border p-2">Warehouse</th>
//                                         <th className="border p-2">Actions</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {fabricReceiveItems.length > 0 ? (
//                                         fabricReceiveItems.map((item, index) => (
//                                             <tr key={index}>
//                                                 <td className="border p-2">{item.finishedFabricCode}</td>
//                                                 <td className="border p-2">{item.rollNo}</td>
//                                                 <td className="border p-2">{item.rollYards}</td>
//                                                 <td className="border p-2">{item.weight}</td>
//                                                 <td className="border p-2">{item.gradeId === 1 ? "Grade A" : item.gradeId === 2 ? "Grade B" : "Grade C"}</td>
//                                                 <td className="border p-2">
//                                                     {warehouseList.find((w: any) => w.id === item.warehouseId)?.warehouseName || item.warehouseId}
//                                                 </td>
//                                                 <td className="border p-2 flex gap-2 justify-center">
//                                                     <Button
//                                                         variant="outline"
//                                                         size="sm"
//                                                         onClick={() => editItem(index)}
//                                                     >
//                                                         <Edit className="h-4 w-4" />
//                                                     </Button>
//                                                     <Button
//                                                         variant="destructive"
//                                                         size="sm"
//                                                         onClick={() => deleteItem(index)}
//                                                     >
//                                                         <Trash2 className="h-4 w-4" />
//                                                     </Button>
//                                                 </td>
//                                             </tr>
//                                         ))
//                                     ) : (
//                                         <tr>
//                                             <td colSpan={7} className="border p-2 text-center text-gray-500">
//                                                 No items added yet
//                                             </td>
//                                         </tr>
//                                     )}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </CardContent>
//                 </Card>
//             </div>
//         </div>
//     );
// }






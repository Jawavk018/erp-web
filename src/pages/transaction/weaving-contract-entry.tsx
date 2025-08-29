import React, { useEffect, useMemo, useState } from "react";
import { FileText, ShoppingCart, ClipboardList, Edit, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button"; // Assuming shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { createPurchaseOrder, getAllPoTypes, getAllPurchaseOrders, updatePurchaseOrder } from "@/state/purchaseOrderSlice";
import { AppDispatch, RootState } from "@/state/store";
import { useDispatch, useSelector } from "react-redux";
import { getAllCustomers } from "@/state/customerSlice";
import { getAllProductCategory } from "@/state/productCategorySlice";
import { DataTable } from "@/components/data/DataTable";
import { getAllSalesOrders } from "@/state/salesOrderSlice";
import { getAllFabricMasters } from "@/state/fabricMasterSlice";
import { getAllVendors } from "@/state/vendorSlice";
import { getAllTermsConditions } from "@/state/termsConditions";
import { getAllPaymentTerms } from "@/state/paymentTermsSlice";
import { createWeavingContract, getAllWeavingContract, updateWeavingContract } from "@/state/weavingContractSlice";
import apiService from "@/services/ApiService";
import { useLocation, useNavigate } from "react-router-dom";


interface WeavingContractFormData {
  salesOrderNo: string;
  vendorId: string;
  termsConditionsId: string;
  paymentTermsId: string;
  remarks: string;
  items: WeavingContractItem[];
  yarnRequirements: YarnRequirement[];
}

interface WeavingContractItem {
  fabricCodeId: string;
  fabricQualityId: string;
  quantity: string;
  pickCost: string;
  plannedStartDate: string;
  plannedEndDate: string;
  dailyTarget: string;
  numberOfLooms: string;
  warpLength: string;
  warpCrimpPercentage: string;
  pieceLength: string;
  numberOfPieces: string;
  activeFlag: boolean;
}

interface YarnRequirement {
  yarnType: string;
  yarnCount: string;
  gramsPerMeter: number;
  totalWeavingOrderQty: number;
  totalRequiredQty: number;
  totalAvailableQty: number;
  activeFlag: boolean;
}

interface FabricMaster {
  id: number;
  fabricType: number;
  fabricCode: string;
  fabricName: string;
  weave: number;
  fabricQuality: string;
  uom: string;
  epi: number;
  ppi: number;
  greigeCode: string;
  totalEnds: number;
  gsm: number;
  glm: number;
  igst: number;
  cgst: number;
  sgst: number;
  fabricImageUrl: string;
  warpDetails: YarnDetail[];
  weftDetails: YarnDetail[];
  procuctCategoryId: number | null;
}

interface YarnDetail {
  id: number;
  yarnId: number;
  color: number;
  shrinkagePercent: number;
  gramsPerMeter: number;
}

type Vendor = {
  id: number;
  customerName: string;
  address: {
    id?: number;
    line1: string;
    line2: string;
    countryId: number;
    stateId: number;
    cityId: number;
  };
};

export function WeavingContractEntry() {

  const { purchaseOrderList } = useSelector((state: RootState) => state.purchaseOrder);
  const { termsContitionsList } = useSelector((state: RootState) => state.termsConditions);
  const { salesOrderList } = useSelector((state: RootState) => state.salesOrder);
  const { paymentTermsList } = useSelector((state: RootState) => state.paymentTerms);
  const { productCategoryList } = useSelector((state: RootState) => state.productCategory);
  const { fabricMasterList } = useSelector((state: RootState) => state.fabricMaster);
  const { vendorList } = useSelector((state: RootState) => state.vendor);
  const [weavingContractItemDtl, setweavingContractItemDtl] = useState<WeavingContractItem[]>([]);
  const [yarnRequirements, setYarnRequirements] = useState<YarnRequirement[]>([]);
  const [selectedFabric, setSelectedFabric] = useState<FabricMaster | null>(null);
  const [fabricMasterDetails, setFabricMasterDetails] = useState<any>(null);
  const [newItem, setNewItem]: any = useState<WeavingContractItem>({
    fabricCodeId: '',
    fabricQualityId: '',
    quantity: '',
    pickCost: '',
    plannedStartDate: '',
    plannedEndDate: '',
    dailyTarget: '',
    numberOfLooms: '',
    warpLength: '',
    warpCrimpPercentage: '',
    pieceLength: '',
    numberOfPieces: '',
    activeFlag: true
  });

  const [editingIndex, setEditingIndex]: any = useState(null);
  const [activeTab, setActiveTab] = useState("orderDetails");
  const [isEditing, setIsEditing] = React.useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [selectedPoTypeId, setSelectedPoTypeId] = useState<number | null>(null);
  const [filteredProductCategories, setFilteredProductCategories] = useState<any[]>([]);
  const [selectedProductCategory, setSelectedProductCategory] = useState<any>(null);
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const weavingContractDtl = location.state?.weavingContractDtl;
  // const { register, handleSubmit, reset, formState: { errors } } = useForm<WeavingContractFormData>();
  console.log("weavingContract", weavingContractDtl)
  const navigate = useNavigate();
  const [fabricCodeError, setFabricCodeError] = useState("");
  const [isItemsValid, setIsItemsValid] = useState(false);
  // const isFormValid = isItemsValid && weavingContractItemDtl.length > 0;
  // Replace your current isFormValid with this:

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid } // Add isValid here
  } = useForm<WeavingContractFormData>({
    mode: 'onBlur',
    reValidateMode: 'onBlur'
  });

  const isFormValid = isValid &&
    weavingContractItemDtl?.length > 0 &&
    weavingContractItemDtl?.every(item => item?.fabricCodeId);

  console.log(isFormValid)


  useEffect(() => {
    dispatch(getAllSalesOrders({}));
    dispatch(getAllFabricMasters({}));
    dispatch(getAllVendors({}));
    dispatch(getAllTermsConditions({}));
    dispatch(getAllPaymentTerms({}));
  }, [dispatch]);


  useEffect(() => {
    if (weavingContractDtl) {
      // Set form fields
      reset({
        salesOrderNo: weavingContractDtl.salesOrderNo ? String(weavingContractDtl.salesOrderNo) : "",
        vendorId: weavingContractDtl.vendorId ? String(weavingContractDtl.vendorId) : "",
        termsConditionsId: weavingContractDtl.termsConditionsId ? String(weavingContractDtl.termsConditionsId) : "",
        paymentTermsId: weavingContractDtl.paymentTermsId ? String(weavingContractDtl.paymentTermsId) : "",
        remarks: weavingContractDtl.remarks || "",
        items: [], // handled separately
        yarnRequirements: [] // handled separately
      });

      // Set items table
      setweavingContractItemDtl(
        (weavingContractDtl.items || []).map((item: any) => ({
          ...item,
          fabricCodeId: String(item.fabricCodeId ?? ""),
          fabricQualityId: String(item.fabricQualityId ?? ""),
          quantity: String(item.quantity ?? ""),
          pickCost: String(item.pickCost ?? ""),
          plannedStartDate: item.plannedStartDate ? item.plannedStartDate.slice(0, 10) : "",
          plannedEndDate: item.plannedEndDate ? item.plannedEndDate.slice(0, 10) : "",
          dailyTarget: String(item.dailyTarget ?? ""),
          numberOfLooms: String(item.numberOfLooms ?? ""),
          warpLength: String(item.warpLength ?? ""),
          warpCrimpPercentage: String(item.warpCrimpPercentage ?? ""),
          pieceLength: String(item.pieceLength ?? ""),
          numberOfPieces: String(item.numberOfPieces ?? ""),
          activeFlag: item.activeFlag ?? true,
        }))
      );

      // Set yarn requirements
      setYarnRequirements(
        (weavingContractDtl.yarnRequirements || []).map((yarn: any) => ({
          ...yarn,
          totalWeavingOrderQty: String(yarn.totalWeavingOrderQty ?? ""),
          totalRequiredQty: String(yarn.totalRequiredQty ?? ""),
          totalAvailableQty: String(yarn.totalAvailableQty ?? ""),
          activeFlag: yarn.activeFlag ?? true,
        }))
      );
    }
    // eslint-disable-next-line
  }, [weavingContractDtl, reset]);


  const handleChange = (e: any) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const calculateSummary = () => {
    const netAmount = weavingContractItemDtl.reduce((sum, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const pickCost = parseFloat(item.pickCost) || 0;
      return sum + (quantity * pickCost);
    }, 0);

    return { netAmount };
  };

  const { netAmount } = calculateSummary();

  // const handleFabricCodeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const selectedFabric = fabricMasterList.find((f: { id: { toString: () => string; }; }) => f.id.toString() === e.target.value);
  //   setSelectedFabric(selectedFabric || null);

  //   if (selectedFabric) {
  //     setNewItem({
  //       ...newItem,
  //       fabricCodeId: e.target.value,
  //       fabricQualityId: selectedFabric.fabricQuality
  //     });

  //     // Fetch fabric master details
  //     try {
  //       console.log('try', e.target.value)
  //       const response = await apiService.get(`fabric-master/${e.target.value}`);
  //       console.log(response.data)
  //       setFabricMasterDetails(response);
  //       console.log(response)
  //       const yarnReqs = [
  //         ...response.warp_details.map((detail: any) => {
  //           console.log('Warp detail units:', detail.units);
  //           console.log('Parsed warp units:', parseFloat(detail.units));
  //           return {
  //             yarnType: "Warp",
  //             yarnCount: detail.count_name,
  //             gramsPerMeter: detail.grams_per_meter,
  //             totalWeavingOrderQty: parseFloat(newItem.quantity) || 0,
  //             totalRequiredQty: 0, // This will be input by user
  //             totalAvailableQty: parseFloat(detail.units) || 0,
  //             activeFlag: true
  //           };
  //         }),
  //         ...response.weft_details.map((detail: any) => {
  //           console.log('Weft detail units:', detail.units);
  //           console.log('Parsed weft units:', parseFloat(detail.units));
  //           return {
  //             yarnType: "Weft",
  //             yarnCount: detail.count_name,
  //             gramsPerMeter: detail.grams_per_meter,
  //             totalWeavingOrderQty: parseFloat(newItem.quantity) || 0,
  //             totalRequiredQty: 0, // This will be input by user
  //             totalAvailableQty: parseFloat(detail.units) || 0,
  //             activeFlag: true
  //           };
  //         })
  //       ];
  //       setYarnRequirements(yarnReqs);
  //     } catch (error) {
  //       console.error("Error fetching fabric master details:", error);
  //     }
  //   }
  // };

  const handleFabricCodeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFabric = fabricMasterList.find((f: { id: { toString: () => string; }; }) => f.id.toString() === e.target.value);
    setSelectedFabric(selectedFabric || null);

    if (selectedFabric) {
      setNewItem({
        ...newItem,
        fabricCodeId: e.target.value,
        fabricQualityId: selectedFabric.fabricQuality
      });

      // Fetch fabric master details
      try {
        console.log('Fetching fabric with ID:', e.target.value);
        const response = await apiService.get(`fabric-master/${e.target.value}`);
        console.log('API Response:', response.data);

        setFabricMasterDetails(response.data);

        // Check if details exist before mapping
        const warpDetails = response.data?.warpDetails || [];
        const weftDetails = response.data?.weftDetails || [];

        console.log('Warp Details:', warpDetails);
        console.log('Weft Details:', weftDetails);

        const yarnReqs = [
          ...warpDetails.map((detail: any) => ({
            yarnType: "Warp",
            yarnCount: detail.yarnId, // Changed from count_name to yarnId
            gramsPerMeter: detail.gramsPerMeter,
            totalWeavingOrderQty: parseFloat(newItem.quantity) || 0,
            totalRequiredQty: 0,
            totalAvailableQty: detail.units || 0, // Assuming units is directly available
            activeFlag: true
          })),
          ...weftDetails.map((detail: any) => ({
            yarnType: "Weft",
            yarnCount: detail.yarnId, // Changed from count_name to yarnId
            gramsPerMeter: detail.gramsPerMeter,
            totalWeavingOrderQty: parseFloat(newItem.quantity) || 0,
            totalRequiredQty: 0,
            totalAvailableQty: detail.units || 0, // Assuming units is directly available
            activeFlag: true
          }))
        ];

        console.log('Generated Yarn Requirements:', yarnReqs);
        setYarnRequirements(yarnReqs);
      } catch (error) {
        console.error("Error fetching fabric master details:", error);
      }
    }
  };

  const addItem = () => {
    if (!newItem.fabricCodeId) {
      setFabricCodeError("Fabric Code is required");
      setIsItemsValid(false);
      return;
    }
    // Add other required field validations as needed
    setIsItemsValid(true);
    setFabricCodeError("");

    if (editingIndex !== null) {
      const updatedItems = [...weavingContractItemDtl];
      updatedItems[editingIndex] = newItem;
      setweavingContractItemDtl(updatedItems);
      setEditingIndex(null);
    } else {
      setweavingContractItemDtl([...weavingContractItemDtl, newItem]);
    }
    setNewItem({
      fabricCodeId: '',
      fabricQualityId: '',
      quantity: '',
      pickCost: '',
      plannedStartDate: '',
      plannedEndDate: '',
      dailyTarget: '',
      numberOfLooms: '',
      warpLength: '',
      warpCrimpPercentage: '',
      pieceLength: '',
      numberOfPieces: '',
      activeFlag: true
    });
  };

  const editItem = (index: number) => {
    setNewItem(weavingContractItemDtl[index]);
    setEditingIndex(index);
  };

  const deleteItem = (index: number) => {
    setweavingContractItemDtl(weavingContractItemDtl.filter((_: any, i: number) => i !== index));
  };


  const onSubmit = (data: WeavingContractFormData) => {
    // Calculate updated yarnRequirements with totalWeavingOrderQty
    const updatedYarnRequirements = yarnRequirements.map(req => {
      const totalWeavingOrderQty = weavingContractItemDtl.reduce((total, item) => {
        return total + (Number(item.quantity || 0) * Number(req.gramsPerMeter || 0));
      }, 0);

      return {
        ...req,
        totalWeavingOrderQty,
        activeFlag: true
      };
    });

    const payload = {
      salesOrderNo: data.salesOrderNo,
      vendorId: parseInt(data.vendorId),
      termsConditionsId: parseInt(data.termsConditionsId),
      paymentTermsId: parseInt(data.paymentTermsId),
      remarks: data.remarks,
      items: weavingContractItemDtl.map(item => ({
        fabricCodeId: parseInt(item.fabricCodeId),
        fabricQualityId: parseInt(item.fabricCodeId),
        quantity: parseFloat(item.quantity),
        pickCost: parseFloat(item.pickCost),
        plannedStartDate: item.plannedStartDate,
        plannedEndDate: item.plannedEndDate,
        dailyTarget: parseFloat(item.dailyTarget),
        numberOfLooms: parseInt(item.numberOfLooms),
        warpLength: parseFloat(item.warpLength),
        warpCrimpPercentage: parseFloat(item.warpCrimpPercentage),
        pieceLength: parseFloat(item.pieceLength),
        numberOfPieces: parseInt(item.numberOfPieces),
        activeFlag: true
      })),
      yarnRequirements: updatedYarnRequirements
    };

    // If editing, call update; otherwise, create
    if (weavingContractDtl && weavingContractDtl.id) {
      // alert('update')
      dispatch(updateWeavingContract({ id: weavingContractDtl.id, data: payload }))
        .then(() => {
          reset();
          setweavingContractItemDtl([]);
          setYarnRequirements([]);
          navigate("/transaction/weaving-contract-details");
        });
    } else {
      dispatch(createWeavingContract(payload))
        .then(() => {
          reset();
          setweavingContractItemDtl([]);
          setYarnRequirements([]);
          navigate("/transaction/weaving-contract-details");
        });
    }
  };


  const handleVendorChange = (e: any) => {
    const selectedId = parseInt(e.target.value);
    const vendor = vendorList.find((v: any) => v.id === selectedId);
    setSelectedVendor(vendor);
    console.log(vendor)
  };

  return (
    <div className="mt-10 p-6 bg-white shadow-md rounded-lg mt-16">
      {/* Title & Save Button */}
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-semibold">Weaving Contract Entry</h2>
        {/* <Button
          onClick={handleSubmit(onSubmit)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 flex items-center"
        >
          <Save size={18} className="mr-2" /> {weavingContractDtl ? "Update Weaving Contract" : "Save Weaving Contract"}
        </Button> */}
        <Button
          onClick={handleSubmit(onSubmit)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 flex items-center"
          disabled={!isFormValid}
        >
          <Save size={18} className="mr-2" />
          {weavingContractDtl ? "Update Weaving Contract" : "Save Weaving Contract"}
        </Button>
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
                  : 'border-transparent text-gray-500 hover:text-gray-700 Inward Ordershover:border-gray-300'
                  }`}
              >
                <FileText className="w-4 h-4" />
                Order Details
              </button>
              <button
                onClick={() => setActiveTab('itemDetails')}
                className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm ${activeTab === 'itemDetails'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <ShoppingCart className="w-4 h-4" />
                Item Details
              </button>
            </nav>
          </div>
        </div>

        {/* Order Details */}
        {activeTab === "orderDetails" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText size={20} /> Order Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium">Sales Order No <span className="text-red-600">*</span> </label>
                  <select {...register("salesOrderNo", { required: "Sales Order No is required" })} className="input mt-1" onChange={handleVendorChange}>
                    <option value="">Sales Order No</option>
                    {salesOrderList?.map((sol: any) => (
                      <option key={sol.id} value={sol.id}>{sol.salesOrderNo}</option>
                    ))}
                  </select>
                  {errors.salesOrderNo && (
                    <p className="mt-1 text-sm text-red-600">{errors.salesOrderNo.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700">Select a Vendor <span className="text-red-600">*</span> </label>
                  <select {...register("vendorId", { required: "Vendor is required" })} className="input mt-1" onChange={handleVendorChange}>
                    <option value="">Select a Vendor</option>
                    {vendorList?.map((vendor: any) => (
                      <option key={vendor.id} value={vendor.id}>{vendor.vendorName}</option>
                    ))}
                  </select>
                  {errors.vendorId && (
                    <p className="mt-1 text-sm text-red-600">{errors.vendorId.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">Select Terms & Conditions <span className="text-red-600">*</span> </label>
                  <select {...register("termsConditionsId", { required: "Terms & Conditions is required" })} className="input mt-1">
                    <option value="">Select Terms & Conditions</option>
                    {termsContitionsList?.map((tc: any) => (
                      <option key={tc.id} value={tc.id}>{tc.termsConditionsName}</option>
                    ))}
                  </select>
                  {errors.termsConditionsId && <p className="mt-1 text-sm text-red-600">{errors.termsConditionsId.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium">Select Payment Terms <span className="text-red-600">*</span> </label>
                  <select {...register("paymentTermsId", { required: "Payment Terms is required" })} className="input mt-1">
                    <option value="">Select Payment Terms</option>
                    {paymentTermsList?.map((pt: any) => (
                      <option key={pt.id} value={pt.id}>{pt.termName}</option>
                    ))}
                  </select>
                  {errors.paymentTermsId && <p className="mt-1 text-sm text-red-600">{errors.paymentTermsId.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700">Remarks</label>
                  <input {...register("remarks")} placeholder="Remarks" className="input" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Item Details */}
        {activeTab === "itemDetails" && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart size={20} /> Item Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">Fabric Code <span className="text-red-600">*</span></label>
                    <select
                      value={newItem.fabricCodeId}
                      onChange={handleFabricCodeChange}
                      className="input mt-1"
                    >
                      <option value="">Select Fabric Code</option>
                      {fabricMasterList?.map((fabric: FabricMaster) => (
                        <option key={fabric.id} value={fabric.id}>
                          {fabric.fabricCode}
                        </option>
                      ))}
                    </select>
                    {fabricCodeError && <p className="mt-1 text-sm text-red-600">{fabricCodeError}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">Fabric Quality</label>
                    <input
                      value={selectedFabric?.fabricQuality || ''}
                      onChange={e => setNewItem({ ...newItem, fabricQualityId: e.target.value })}
                      readOnly
                      className="input mt-1 bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">Quantity</label>
                    <input placeholder="Enter Quantity"
                      value={newItem.quantity}
                      onChange={e => setNewItem({ ...newItem, quantity: e.target.value })} className="input  mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">Pick Cost</label>
                    <input placeholder="Enter pick cost" value={newItem.pickCost}
                      onChange={e => setNewItem({ ...newItem, pickCost: e.target.value })} className="input mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">Planned Start Date</label>
                    <input type="date" value={newItem.plannedStartDate}
                      onChange={e => setNewItem({ ...newItem, plannedStartDate: e.target.value })} className="input mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">Planned End Date</label>
                    <input type="date" value={newItem.plannedEndDate}
                      onChange={e => setNewItem({ ...newItem, plannedEndDate: e.target.value })} className="input mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">Daily Target</label>
                    <input placeholder="Enter daily target" value={newItem.dailyTarget}
                      onChange={e => setNewItem({ ...newItem, dailyTarget: e.target.value })} className="input mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">No of Looms</label>
                    <input placeholder="Enter no of looms" value={newItem.numberOfLooms}
                      onChange={e => setNewItem({ ...newItem, numberOfLooms: e.target.value })} className="input mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">Warp Length</label>
                    <input placeholder="Enter wrap length" value={newItem.warpLength}
                      onChange={e => setNewItem({ ...newItem, warpLength: e.target.value })} className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">Warp Crimp%</label>
                    <input placeholder="Enter warp crimp" value={newItem.warpCrimpPercentage}
                      onChange={e => setNewItem({ ...newItem, warpCrimpPercentage: e.target.value })} className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">Piece Length</label>
                    <input placeholder="Enter piece length" value={newItem.pieceLength}
                      onChange={e => setNewItem({ ...newItem, pieceLength: e.target.value })} className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">No of Pieces</label>
                    <input placeholder="Enter no of pieces" value={newItem.numberOfPieces}
                      onChange={e => setNewItem({ ...newItem, numberOfPieces: e.target.value })} className="input" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={addItem} className="bg-blue-500 text-white mt-4">
                    {editingIndex !== null ? 'Update' : 'Add'} Item
                  </Button>
                </div>
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
                      <th className="border p-2">Quality</th>
                      <th className="border p-2">Quantity</th>
                      <th className="border p-2">Pick Cost</th>
                      <th className="border p-2">Planned Start Date</th>
                      <th className="border p-2">Daily Target</th>
                      <th className="border p-2">Planned End Date</th>
                      <th className="border p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weavingContractItemDtl?.map((item: any, index: any) => (
                      <tr key={index} className="border">
                        <td className="border p-2">{index + 1}</td>
                        <td className="border p-2">{item.fabricQualityId}</td>
                        <td className="border p-2">{item.quantity}</td>
                        <td className="border p-2">{item.pickCost}</td>
                        <td className="border p-2">{item.plannedStartDate}</td>
                        <td className="border p-2">{item.dailyTarget}</td>
                        <td className="border p-2">{item.plannedEndDate}</td>
                        <td className="border p-2">
                          <Button size="sm" onClick={() => editItem(index)}><Edit size={14} /></Button>
                          <Button size="sm" onClick={() => deleteItem(index)} variant="destructive"><Trash2 size={14} /></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList size={20} /> Yarn Requirement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <table className="table-auto w-full border border-gray-300 mt-4">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-4 py-2">Sl.No</th>
                      <th className="border px-4 py-2">Warp/Weft</th>
                      <th className="border px-4 py-2">Yarn Count</th>
                      <th className="border px-4 py-2">Grams/Mtr</th>
                      <th className="border px-4 py-2">Total Weaving Order Qty</th>
                      <th className="border px-4 py-2">Total Req Quantity</th>
                      <th className="border px-4 py-2">Total Available Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yarnRequirements.length > 0 ? (
                      yarnRequirements.map((req, index) => (
                        <tr key={index}>
                          <td className="border px-4 py-2 text-center">{index + 1}</td>
                          <td className="border px-4 py-2 text-center">{req.yarnType}</td>
                          <td className="border px-4 py-2 text-center">{req.yarnCount}</td>
                          <td className="border px-4 py-2 text-center">{req.gramsPerMeter}</td>
                          <td className="border px-4 py-2 text-center">
                            {weavingContractItemDtl.reduce((total, item) => {
                              return total + (Number(item.quantity || 0) * Number(req.gramsPerMeter || 0));
                            }, 0)}
                          </td>
                          <td className="border px-4 py-2 text-center">
                            <input
                              type="text"
                              className="border border-gray-300 rounded px-2 py-1 w-full"
                              value={req.totalRequiredQty}
                              onChange={(e) => {
                                const updated = [...yarnRequirements];
                                updated[index].totalRequiredQty = parseFloat(e.target.value) || 0;
                                setYarnRequirements(updated);
                              }}
                            />
                          </td>
                          <td className="border px-4 py-2 text-center">{req.totalAvailableQty}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="border px-4 py-2 text-center text-gray-500">
                          No yarn details found for the selected fabric code
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
    </div>
  );
};







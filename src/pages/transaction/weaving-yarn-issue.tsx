import React, { useEffect, useMemo, useState } from "react";
import { FileText, ShoppingCart, ClipboardList, Edit, Trash2, Save } from "lucide-react";
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
import { createWeavingYarnIssue, updateWeavingYarnIssue } from "@/state/weavingYarnIssueSlice";
import { useLocation, useNavigate } from "react-router-dom";

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
}

// For Yarn Issue Details Table
interface WeavingYarnIssueFormData {
  id?: number;
  vendorId: string;
  weavingContractId: string;
  transportationDetails: string;
  termsConditionsId: number;
  fabricDetails: string;
  yarnIssueDate: string;
  yarnIssueChallanNo: string;
  activeFlag: boolean;
  requirements: YarnRequirementDetail[];
}
interface LotDetail {
  id?: number; // This should be the primary identifier
  yarnName: string;
  availableQty: number;
  lotNumber?: string; // Optional, for display purposes
  issueQty?: number;
  activeFlag?: boolean;
}


export function WeavingYarnIssue() {

  const { weavingContractList } = useSelector((state: RootState) => state.weavingContracts);
  const { vendorList } = useSelector((state: RootState) => state.vendor);
  const [newItem, setNewItem]: any = useState({});
  const [activeTab, setActiveTab] = useState("orderDetails");
  const { termsContitionsList } = useSelector((state: RootState) => state.termsConditions);
  const [selectedJobWork, setSelectedJobWork]: any = useState([]);
  const [yarnRequirementDetails, setYarnRequirementDetails]: any = useState<YarnRequirementDetail[]>([]);
  const [showLotDialog, setShowLotDialog] = useState(false);
  const [yarnIssueDetails, setYarnIssueDetails] = useState<YarnIssueDetail[]>([]);
  const [selectedLot, setSelectedLot]: any = useState<LotDetail[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const [isItemsValid, setIsItemsValid] = useState(false);
  const location = useLocation();
  const weavingYarnIssueDtl = location.state?.weavingYarnIssueDtl;
  console.log("weavingYarnIssueDtl from location state:", weavingYarnIssueDtl);
  const navigate = useNavigate();


  // const { register, handleSubmit, reset, formState: { errors } } = useForm<WeavingYarnIssueFormData>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid } // Add isValid here
  } = useForm<WeavingYarnIssueFormData>({
    mode: 'onBlur',
    reValidateMode: 'onBlur'
  });

  // const isFormValid = isValid &&
  //   items.length > 0 &&
  //   items.every((item: any) => item.flangeId);

  // Replace your current isFormValid with this:
  // const isFormValid = isValid;

  useEffect(() => {
    dispatch(getAllPurchaseOrders({}));
    dispatch(getAllPoTypes({}));
    dispatch(getAllVendors({}));
    dispatch(getAllProductCategory({}));
    dispatch(getAllTermsConditions({}));
    dispatch(getAllWeavingContract({}));
    console.log(weavingContractList)
  }, [dispatch]);


  // Update your form validation to include requirements validation
  const isFormValid = isValid && yarnRequirementDetails.length > 0 && selectedLot.length > 0;

  // Update your useEffect for editing to properly transform the data
  useEffect(() => {
    if (weavingYarnIssueDtl) {
      reset({
        id: weavingYarnIssueDtl.id,
        vendorId: String(weavingYarnIssueDtl.vendorId),
        weavingContractId: String(weavingYarnIssueDtl.weavingContractId),
        transportationDetails: weavingYarnIssueDtl.transportationDetails,
        termsConditionsId: weavingYarnIssueDtl.termsConditionsId,
        fabricDetails: weavingYarnIssueDtl.fabricDetails || '',
        yarnIssueDate: weavingYarnIssueDtl.yarnIssueDate.slice(0, 10),
        yarnIssueChallanNo: weavingYarnIssueDtl.yarnIssueChallanNo || '',
        activeFlag: weavingYarnIssueDtl.activeFlag !== false
      });

      // Transform requirements data
      if (weavingYarnIssueDtl.requirements) {
        setYarnRequirementDetails(weavingYarnIssueDtl.requirements.map((req: any) => ({
          id: req.id,
          yarnType: req.yarnName,
          yarnCount: String(req.yarnCount),
          gramsPerMeter: String(req.gramsPerMeter),
          totalwarpReq: String(req.totalReqQty),
          totalWarpIssued: String(req.totalIssueQty),
          balanceWarpToIssue: String(req.balanceToIssue)
        })));
      }

      // Transform yarn issues data
      if (weavingYarnIssueDtl.requirements && weavingYarnIssueDtl.requirements.length > 0) {
        const allLots = weavingYarnIssueDtl.requirements.flatMap((req: any) =>
          req.yarnIssues.map((issue: any) => ({
            id: issue.id,
            weavingYarnRequirementId: issue.weavingYarnRequirementId,
            yarnName: issue.yarnName,
            availableQty: issue.availableReqQty,
            issueQty: issue.issueQty,
            lotId: issue.lotId,
            activeFlag: issue.activeFlag !== false
          }))
        );
        setSelectedLot(allLots);
      }
    }
  }, [weavingYarnIssueDtl, reset]);


  // const onSubmit = (data: WeavingYarnIssueFormData) => {
  //   // Transform the form data into the payload structure
  //   const payload = {
  //     vendorId: data.vendorId,
  //     weavingContractId: data.weavingContractId,
  //     transportationDetails: data.transportationDetails,
  //     termsConditionsId: data.termsConditionsId,
  //     fabricDetails: data.fabricDetails,
  //     yarnIssueDate: data.yarnIssueDate,
  //     yarnIssueChallanNo: data.yarnIssueChallanNo,
  //     activeFlag: true,
  //     requirements: yarnRequirementDetails.map((req: any) => ({
  //       yarnName: req.yarnType,
  //       yarnCount: req.yarnCount,
  //       gramsPerMeter: req.gramsPerMeter,
  //       totalReqQty: req.totalwarpReq,
  //       totalIssueQty: req.totalWarpIssued || 0,
  //       balanceToIssue: req.balanceWarpToIssue || req.totalwarpReq,
  //       yarnIssues: selectedLot.map((lot: any) => ({
  //         lotId: lot.lotId,
  //         yarnName: lot.yarnName,
  //         availableReqQty: lot.availableQty,
  //         issueQty: lot.issueQty || 0
  //       }))
  //     }))
  //   };

  //   console.log("Payload to send:", payload);
  //   if (weavingYarnIssueDtl && weavingYarnIssueDtl.id) {
  //     dispatch(updateWeavingYarnIssue({ id: weavingYarnIssueDtl.id, data: payload }))
  //       .then(() => {
  //         reset();
  //         setYarnRequirementDetails([]);
  //         setSelectedLot([]);
  //         navigate("/transaction/weaving-issue-details");
  //       });
  //   } else {
  //     dispatch(createWeavingYarnIssue(payload))
  //       .then(() => {
  //         reset();
  //         setSelectedLot([]);
  //         setSelectedLot([]);
  //         navigate("/transaction/weaving-issue-details");
  //       });
  //   }
  // };

  // Update your onSubmit function to match the correct payload structure
  const onSubmit = (data: WeavingYarnIssueFormData) => {
    // Transform the form data into the payload structure
    const payload = {
      id: weavingYarnIssueDtl?.id || 0, // Include ID for updates
      vendorId: Number(data.vendorId),
      weavingContractId: Number(data.weavingContractId),
      transportationDetails: data.transportationDetails,
      termsConditionsId: data.termsConditionsId,
      fabricDetails: data.fabricDetails,
      yarnIssueDate: data.yarnIssueDate,
      // yarnIssueChallanNo: data.yarnIssueChallanNo,
      activeFlag: true,
      requirements: yarnRequirementDetails.map((req: any) => ({
        id: req.id || 0, // Include ID for updates
        yarnName: req.yarnType,
        yarnCount: Number(req.yarnCount),
        gramsPerMeter: Number(req.gramsPerMeter),
        totalReqQty: Number(req.totalwarpReq),
        totalIssueQty: Number(req.totalWarpIssued) || 0,
        balanceToIssue: Number(req.balanceWarpToIssue) || Number(req.totalwarpReq),
        activeFlag: true,
        yarnIssues: selectedLot
          .filter((lot: any) => lot.yarnName === req.yarnType) // Only include lots for this yarn type
          .map((lot: any) => ({
            id: lot.id || 0, // Include ID for updates
            lotId: Number(lot.lotId),
            yarnName: lot.yarnName,
            availableReqQty: Number(lot.availableQty),
            issueQty: Number(lot.issueQty) || 0,
            activeFlag: lot.activeFlag !== false
          }))
      }))
    };

    console.log("Payload to send:", payload);

    if (weavingYarnIssueDtl && weavingYarnIssueDtl.id) {
      dispatch(updateWeavingYarnIssue({ id: weavingYarnIssueDtl.id, data: payload }))
        .then(() => {
          reset();
          setYarnRequirementDetails([]);
          setSelectedLot([]);
          navigate("/transaction/weaving-issue-details");
        });
    } else {
      dispatch(createWeavingYarnIssue(payload))
        .then(() => {
          reset();
          setYarnRequirementDetails([]);
          setSelectedLot([]);
          navigate("/transaction/weaving-issue-details");
        });
    }
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

  return (
    <div className="mt-10 p-6 bg-white shadow-md rounded-lg mt-16">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-semibold">Weaving Yarn Issue</h2>
        {/* <Button onClick={handleSubmit(onSubmit)} className="bg-green-600 hover:bg-green-700 text-white px-6 flex items-center">
          <Save size={18} className="mr-2" /> Save Weaving Yarn Issue
        </Button> */}
        <Button
          onClick={handleSubmit(onSubmit)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 flex items-center"
          disabled={!isFormValid}
        >
          <Save size={18} className="mr-2" />
          {weavingYarnIssueDtl ? "Update Weaving Yarn Issue" : "Save Weaving Yarn Issue"}
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
                Order Details
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
                <div>
                  <label className="block text-sm font-medium">Weaving Yarn Issue Date <span className="text-red-600">*</span></label>
                  <input type="date" {...register("yarnIssueDate", { required: "Weaving Yarn Issue Date is required" })} className="input mt-1" />
                  {errors.yarnIssueDate && <p className="mt-1 text-sm text-red-600">{errors.yarnIssueDate.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700">Supplier Name <span className="text-red-600">*</span></label>
                  <select {...register("vendorId", { required: "Vendor is required" })} className="input mt-1" >
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
                  <label className="block text-sm font-medium">Transportation Details <span className="text-red-600">*</span></label>
                  <input {...register("transportationDetails", { required: "Transportation Dtl is required" })} className="input mt-1" />
                  {errors.transportationDetails && <p className="mt-1 text-sm text-red-600">{errors.transportationDetails.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium">Select Terms & Conditions <span className="text-red-600">*</span></label>
                  <select {...register("termsConditionsId", { required: "Terms & Conditions is required" })} className="input mt-1">
                    <option value="">Select Terms & Conditions</option>
                    {termsContitionsList?.map((tc: any) => (
                      <option key={tc.id} value={tc.id}>{tc.termsConditionsName}</option>
                    ))}
                  </select>
                  {errors.termsConditionsId && <p className="mt-1 text-sm text-red-600">{errors.termsConditionsId.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium">JobWork Number <span className="text-red-600">*</span></label>
                  <select
                    {...register("weavingContractId", { required: "JobWork Number is required" })}
                    className="input mt-1"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleJobWorkChange(e)}
                  >
                    <option value="">Select a JobWork Number</option>
                    {weavingContractList?.map((jwn: any) => (
                      <option key={jwn.id} value={jwn.id}>{jwn.weavingContractNo}</option>
                    ))}
                  </select>
                  {errors.weavingContractId && <p className="mt-1 text-sm text-red-600">{errors.weavingContractId.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700">Fabric Details</label>
                  <textarea placeholder="Fabric Details" value={newItem.remfabricDetailsarks}
                    onChange={e => setNewItem({ ...newItem, fabricDetails: e.target.value })} className="input mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {selectedJobWork && (
          <>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Yarn Requirement Details</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">Yarn Type</th>
                      <th className="border p-2">Yarn Count</th>
                      <th className="border p-2">Grams/Mtr</th>
                      <th className="border p-2">Total Required Qty</th>
                      <th className="border p-2">Total Issued Qty</th>
                      <th className="border p-2">Balance to Issue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yarnRequirementDetails.length > 0 ? (
                      yarnRequirementDetails.map((detail: any, index: any) => (
                        <tr key={index}>
                          <td className="border p-2">{detail.yarnType}</td>
                          <td className="border p-2">{detail.yarnCount}</td>
                          <td className="border p-2">{detail.gramsPerMeter}</td>
                          <td className="border p-2">{detail.totalwarpReq}</td>
                          <td className="border p-2">{detail.totalWarpIssued}</td>
                          <td className="border p-2">{detail.balanceWarpToIssue}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="border p-2 text-center text-gray-500">
                          Select a Job Work Number to view yarn requirements
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Yarn Issue Details</span>
                  <Button onClick={handleYarnIssue}>YARN ISSUE</Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">Yarn Name</th>
                      <th className="border p-2">Lot ID</th>
                      <th className="border p-2">Available Qty</th>
                      <th className="border p-2">Issued Qty</th>
                      <th className="border p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedLot.length > 0 ? (
                      selectedLot.map((detail: LotDetail, index: number) => (
                        <tr key={detail.id}>
                          <td className="border p-2">{detail.yarnName}</td>
                          <td className="border p-2">{detail.id}</td>
                          <td className="border p-2">{detail.availableQty}</td>
                          <td className="border p-2">
                            <Input
                              type="number"
                              value={detail.issueQty ?? ''}
                              onChange={(e) => {
                                const value = e.target.value === '' ? null : Number(e.target.value);
                                const newDetails = [...selectedLot];
                                newDetails[index].issueQty = value;
                                setSelectedLot(newDetails);
                              }}
                              min={0}
                              max={detail.availableQty}
                            />
                          </td>
                          <td className="border p-2">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setSelectedLot(selectedLot.filter((lot: LotDetail) => lot.id !== detail.id));
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
                      {yarnIssueDetails.map((lot) => {
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
        )}
      </div>
    </div>
  );
}








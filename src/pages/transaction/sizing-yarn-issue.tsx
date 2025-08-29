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
import { createWeavingYarnIssue } from "@/state/weavingYarnIssueSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { createSizingYarnIssue } from "@/state/sizingYarnIssueSlice";
import { getAllSizingPlan, getSizingPlanById } from "@/state/sizingPlanSlice";

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
interface SizingYarnIssueFormData {
  id?: number;
  vendorId: string;
  sizingPlanId: string;
  transportationDetails: string;
  termsConditionsId: number;
  fabricDetails: string;
  yarnIssueDate: string;
  yarnIssueChallanNo: string;
  activeFlag: boolean;
  requirements: YarnRequirementDetail[];
  sizingYarnIssue: YarnIssueDetail[];
}
interface LotDetail {
  id?: number; // This should be the primary identifier
  yarnName: string;
  availableQty: number;
  lotNumber?: string; // Optional, for display purposes
  issueQty?: number;
  activeFlag?: boolean;
}


export function SizingYarnIssue() {

  const { weavingContractList } = useSelector((state: RootState) => state.weavingContracts);
  const { vendorList } = useSelector((state: RootState) => state.vendor);
  const { sizingPlanList } = useSelector((state: RootState) => state.sizingPlan);
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
  const sizingYarnIssueDtl = location.state?.sizingYarnIssueDtl;
  console.log("sizingYarnIssueDtl from location state:", sizingYarnIssueDtl);
  const navigate = useNavigate();

  // const { register, handleSubmit, reset, formState: { errors } } = useForm<SizingYarnIssueFormData>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid } // Add isValid here
  } = useForm<SizingYarnIssueFormData>({
    mode: 'onBlur',
    reValidateMode: 'onBlur'
  });

  const isFormValid = isValid

  useEffect(() => {
    dispatch(getAllPurchaseOrders({}));
    dispatch(getAllPoTypes({}));
    dispatch(getAllVendors({}));
    dispatch(getAllProductCategory({}));
    dispatch(getAllTermsConditions({}));
    dispatch(getAllWeavingContract({}));
    dispatch(getAllSizingPlan({}));
    console.log(weavingContractList)
  }, [dispatch]);


  useEffect(() => {
    if (sizingYarnIssueDtl) {
      reset({
        id: sizingYarnIssueDtl.id,
        vendorId: String(sizingYarnIssueDtl.vendorId),
        sizingPlanId: String(sizingYarnIssueDtl.sizingPlanId),
        transportationDetails: sizingYarnIssueDtl.transportationDetails,
        termsConditionsId: sizingYarnIssueDtl.termsConditionsId,
        fabricDetails: sizingYarnIssueDtl.fabricDetails || '',
        yarnIssueDate: sizingYarnIssueDtl.sizingYarnIssueDate.slice(0, 10), // Fixed field name
        yarnIssueChallanNo: sizingYarnIssueDtl.yarnIssueChallanNo || '',
        activeFlag: sizingYarnIssueDtl.activeFlag !== false
      });

      // Set yarn requirement details
      if (sizingYarnIssueDtl.requirements) {
        setYarnRequirementDetails(sizingYarnIssueDtl.requirements.map((req: any) => ({
          yarnType: req.yarnName,
          yarnCount: req.yarnCount,
          gramsPerMeter: req.gramsPerMeter,
          totalwarpReq: req.totalReqQty,
          totalWarpIssued: req.totalIssueQty,
          balanceWarpToIssue: req.balanceToIssue
        })));
      }

      // Set selected lots - using sizingYarnIssue from root level
      if (sizingYarnIssueDtl.sizingYarnIssue) {
        setSelectedLot(sizingYarnIssueDtl.sizingYarnIssue.map((issue: any) => ({
          id: issue.id,
          yarnName: issue.yarnName,
          availableQty: issue.availableReqQty,
          issueQty: issue.issueQty,
          lotId: issue.lotId, // Fixed typo from botId to lotId
          activeFlag: issue.activeFlag !== false
        })));
      }
    }
  }, [sizingYarnIssueDtl, reset]);


  // const onSubmit = (data: SizingYarnIssueFormData) => {
  //   // Transform the form data into the payload structure
  //   const payload = {
  //     vendorId: data.vendorId,
  //     sizingPlanId: data.sizingPlanId,
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
  //         lotId: lot.id,
  //         yarnName: lot.yarnName,
  //         availableReqQty: lot.availableQty,
  //         issueQty: lot.issueQty || 0
  //       }))
  //     }))
  //   };

  //   console.log("Payload to send:", payload);

  //   dispatch(createWeavingYarnIssue(payload))
  //     .unwrap()
  //     .then(() => {
  //       reset();
  //       setYarnRequirementDetails([]);
  //       setSelectedLot([]);
  //     })
  //     .catch((error: any) => {
  //       console.error("Error creating Sizing Yarn Issue:", error);
  //     });
  // };

  const onSubmit = (data: SizingYarnIssueFormData) => {
    // Transform the form data into the payload structure
    const payload = {
      vendorId: data.vendorId,
      sizingPlanId: data.sizingPlanId,
      transportationDetails: data.transportationDetails,
      termsConditionsId: data.termsConditionsId,
      fabricDetails: data.fabricDetails,
      sizingYarnIssueDate: data.yarnIssueDate, // Match API field name
      yarnIssueChallanNo: data.yarnIssueChallanNo,
      activeFlag: true,
      requirements: yarnRequirementDetails.map((req: any) => ({
        yarnName: req.yarnType,
        yarnCount: req.yarnCount,
        gramsPerMeter: req.gramsPerMeter,
        totalReqQty: req.totalwarpReq,
        totalIssueQty: req.totalWarpIssued || 0,
        balanceToIssue: req.balanceWarpToIssue || req.totalwarpReq,
        activeFlag: true
      })),
      sizingYarnIssue: selectedLot.map((lot: any) => ({
        lotId: lot.id,
        yarnName: lot.yarnName,
        availableReqQty: lot.availableQty,
        issueQty: lot.issueQty || 0,
        activeFlag: true
      }))
    };

    console.log("Payload to send:", payload);

    dispatch(createSizingYarnIssue(payload))
      .unwrap()
      .then(() => {
        reset();
        setYarnRequirementDetails([]);
        setSelectedLot([]);
        // navigate("/transaction/sizing-management");
        navigate("/transaction/sizing-management", { state: { tab: "sizingYarnIssue" } });

      })
      .catch((error: any) => {
        console.error("Error creating Sizing Yarn Issue:", error);
      });
  };

  // const handleJobWorkChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const id = parseInt(e.target.value);
  //   setSelectedJobWork([]);
  //   setYarnRequirementDetails([]); // Clear previous details

  //   if (id) {
  //     try {
  //       const result = await dispatch(getWeavingContractById(id));
  //       console.log(result)
  //       const yarnRequired = result?.payload;

  //       if (yarnRequired?.yarnRequirements) {
  //         // Map the yarn requirements to the format needed for display
  //         const requirements = yarnRequired.yarnRequirements.map((yarn: any) => ({
  //           yarnType: yarn.yarnType,
  //           yarnCount: yarn.yarnCount,
  //           gramsPerMeter: yarn.gramsPerMeter,
  //           totalwarpReq: yarn.totalRequiredQty,
  //           totalWarpIssued: yarn.totalIssuedQty || 0, // Default to 0 if not provided
  //           balanceWarpToIssue: yarn.totalRequiredQty - (yarn.totalIssuedQty || 0)
  //         }));

  //         setYarnRequirementDetails(requirements);
  //         setSelectedJobWork(yarnRequired); // Store the entire job work data if needed
  //       }
  //     } catch (error) {
  //       console.error("Error fetching weaving contract by ID:", error);
  //     }
  //   }
  // };

  const handleJobWorkChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value);
    setSelectedJobWork([]);
    setYarnRequirementDetails([]); // Clear previous details

    if (id) {
      try {
        const result = await dispatch(getSizingPlanById(id));
        console.log('API Response:', result);
        const contractData = result?.payload;

        if (contractData) {
          // Store the entire job work data
          setSelectedJobWork(contractData);

          // Create requirements from sizingQualityDetails if available
          if (contractData.sizingQualityDetails && contractData.sizingQualityDetails.length > 0) {
            const requirements = contractData.sizingQualityDetails.map((qualityDetail: any) => ({
              id: qualityDetail.id,
              yarnType: qualityDetail.quality, // Using quality as yarnType
              yarnCount: qualityDetail.yarnId.toString(), // Convert yarnId to string
              gramsPerMeter: "0", // Default value or calculate if possible
              totalwarpReq: qualityDetail.sordEnds?.toString() || "0",
              totalWarpIssued: "0", // Initialize to 0
              balanceWarpToIssue: qualityDetail.sordEnds?.toString() || "0",
              // Additional sizing-specific fields
              parts: qualityDetail.parts,
              endsPerPart: qualityDetail.endsPerPart,
              wrapMeters: qualityDetail.wrapMeters
            }));

            setYarnRequirementDetails(requirements);
          }
          // Fallback to yarnRequirements if sizingQualityDetails not available
          else if (contractData.yarnRequirements) {
            const requirements = contractData.yarnRequirements.map((yarn: any) => ({
              yarnType: yarn.yarnType,
              yarnCount: yarn.yarnCount,
              gramsPerMeter: yarn.gramsPerMeter,
              totalwarpReq: yarn.totalRequiredQty,
              totalWarpIssued: yarn.totalIssuedQty || "0",
              balanceWarpToIssue: (yarn.totalRequiredQty - (yarn.totalIssuedQty || 0)).toString()
            }));
            setYarnRequirementDetails(requirements);
          }
        }
      } catch (error) {
        console.error("Error fetching weaving contract by ID:", error);
        // Optionally show error to user
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

  // const handleLotSelect = (lotDetail: LotDetail) => {
  //   setSelectedLot(lotDetail);
  //   setShowLotDialog(false);
  //   // Update the yarn issue details with the selected lot
  //   setSelectedLot((prev: any) => [
  //     // ...prev,
  //     {
  //       yarnName: lotDetail.yarnName,
  //       availableQty: lotDetail.availableQty,
  //       issueQty: 0,
  //       lotId: lotDetail.lotId
  //     }
  //   ]);
  // };
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
        <h2 className="text-2xl font-semibold">Sizing Yarn Issue</h2>
        {/* <Button onClick={handleSubmit(onSubmit)} className="bg-green-600 hover:bg-green-700 text-white px-6 flex items-center">
          <Save size={18} className="mr-2" /> Save Sizing Yarn Issue
        </Button> */}
        <Button
          onClick={handleSubmit(onSubmit)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 flex items-center"
          disabled={!isFormValid}
        >
          <Save size={18} className="mr-2" />
          {sizingYarnIssueDtl ? "Update Sizing Yarn Issue" : "Save Sizing Yarn Issue"}
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
                  <label className="block text-sm font-medium">Sizing Yarn Issue Date <span className="text-red-600">*</span></label>
                  <input type="date" {...register("yarnIssueDate", { required: "Sizing Yarn Issue Date is required" })} className="input mt-1" />
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
                  <label className="block text-sm font-medium">Sizing Plan Number <span className="text-red-600">*</span></label>
                  <select
                    {...register("sizingPlanId", { required: "Sizing Plan Number is required" })}
                    className="input mt-1"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleJobWorkChange(e)}
                  >
                    <option value="">Select a Sizing Number</option>
                    {sizingPlanList?.map((sp: any) => (
                      <option key={sp.id} value={sp.id}>{sp.sizingPlanNo}</option>
                    ))}
                  </select>
                  {errors.sizingPlanId && <p className="mt-1 text-sm text-red-600">{errors.sizingPlanId.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700">Fabric Details</label>
                  <textarea placeholder="Fabric Details" value={newItem.remarks}
                    onChange={e => setNewItem({ ...newItem, remarks: e.target.value })} className="input mt-1" />
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
                {/* <table className="w-full border-collapse">
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
                </table> */}
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">Quality</th>
                      <th className="border p-2">Yarn ID</th>
                      <th className="border p-2">Sord Ends</th>
                      <th className="border p-2">Actual Ends</th>
                      <th className="border p-2">Parts</th>
                      <th className="border p-2">Ends/Part</th>
                      <th className="border p-2">Wrap Meters</th>
                      <th className="border p-2">Total Issued</th>
                      <th className="border p-2">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yarnRequirementDetails.length > 0 ? (
                      yarnRequirementDetails.map((detail: any, index: number) => (
                        <tr key={index}>
                          <td className="border p-2">{detail.yarnType}</td>
                          <td className="border p-2">{detail.yarnCount}</td>
                          <td className="border p-2">{detail.totalwarpReq}</td>
                          <td className="border p-2">{detail.actualEnds || 'N/A'}</td>
                          <td className="border p-2">{detail.parts || 'N/A'}</td>
                          <td className="border p-2">{detail.endsPerPart || 'N/A'}</td>
                          <td className="border p-2">{detail.wrapMeters || 'N/A'}</td>
                          <td className="border p-2">{detail.totalWarpIssued}</td>
                          <td className="border p-2">{detail.balanceWarpToIssue}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="border p-2 text-center text-gray-500">
                          No quality details available
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




// import React, { useEffect, useState } from "react";
// import { FileText, Save, Trash2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useForm } from "react-hook-form";
// import { Checkbox } from "@/components/ui/checkbox";
// import { AppDispatch, RootState } from "@/state/store";
// import { useDispatch, useSelector } from "react-redux";
// import { Input } from "@/components/ui/input";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { useLocation } from "react-router-dom";
// import { createWeavingYarnIssue } from "@/state/weavingYarnIssueSlice";
// import { getAllVendors } from "@/state/vendorSlice";
// import { getAllTermsConditions } from "@/state/termsConditions";
// import { getAllLotEntries, getAllWeavingContract, getWeavingContractById } from "@/state/weavingContractSlice";

// interface YarnIssueDetail {
//   id?: number;
//   yarnName: string;
//   availableReqQty: number;
//   issueQty: number;
//   lotId: string;
//   activeFlag?: boolean;
// }

// interface YarnRequirementDetail {
//   yarnName: string;
//   yarnCount: string;
//   gramsPerMeter: string;
//   totalwarpReq: string;
//   totalWarpIssued: string;
//   balanceWarpToIssue: string;
// }

// interface SizingYarnIssueFormData {
//   id?: number;
//   vendorId: string;
//   sizingPlanId: string;
//   transportationDetails: string;
//   termsConditionsId: number;
//   fabricDetails: string;
//   yarnIssueDate: string;
//   yarnIssueChallanNo: string;
//   activeFlag: boolean;
// }

// interface LotDetail {
//   id?: number;
//   yarnName: string;
//   availableQty: number;
//   lotNumber?: string;
//   issueQty?: number | null;
//   lotId?: string;
//   activeFlag?: boolean;
// }


// interface FormValidationState {
//   yarnIssueDate: boolean;
//   vendorId: boolean;
//   transportationDetails: boolean;
//   termsConditionsId: boolean;
//   sizingPlanId: boolean;
//   hasValidItems: boolean;
// }

// export function SizingYarnIssue() {
//   const { weavingContractList } = useSelector((state: RootState) => state.weavingContracts);
//   const { vendorList } = useSelector((state: RootState) => state.vendor);
//   const { termsContitionsList } = useSelector((state: RootState) => state.termsConditions);
//   const [activeTab, setActiveTab] = useState("orderDetails");
//   const [selectedJobWork, setSelectedJobWork] = useState<any>(null);
//   const [yarnRequirementDetails, setYarnRequirementDetails] = useState<YarnRequirementDetail[]>([]);
//   const [showLotDialog, setShowLotDialog] = useState(false);
//   const [yarnIssueDetails, setYarnIssueDetails] = useState<YarnIssueDetail[]>([]);
//   const [selectedLot, setSelectedLot] = useState<LotDetail[]>([]);
//   const [formValidation, setFormValidation] = useState<FormValidationState>({
//     yarnIssueDate: false,
//     vendorId: false,
//     transportationDetails: false,
//     termsConditionsId: false,
//     sizingPlanId: false,
//     hasValidItems: false
//   });

//   const dispatch = useDispatch<AppDispatch>();
//   const location = useLocation();
//   const sizingYarnIssueDtl = location.state?.sizingYarnIssueDtl;

//   const {
//     register,
//     handleSubmit,
//     reset,
//     watch,
//     formState: { errors }
//   } = useForm<SizingYarnIssueFormData>({
//     mode: 'onChange',
//     reValidateMode: 'onChange'
//   });

//   useEffect(() => {
//     dispatch(getAllVendors({}));
//     dispatch(getAllTermsConditions({}));
//     dispatch(getAllWeavingContract({}));
//   }, [dispatch]);

//   useEffect(() => {
//     if (sizingYarnIssueDtl) {
//       reset({
//         id: sizingYarnIssueDtl.id,
//         vendorId: String(sizingYarnIssueDtl.vendorId),
//         sizingPlanId: String(sizingYarnIssueDtl.sizingPlanId),
//         transportationDetails: sizingYarnIssueDtl.transportationDetails,
//         termsConditionsId: sizingYarnIssueDtl.termsConditionsId,
//         fabricDetails: sizingYarnIssueDtl.fabricDetails || '',
//         yarnIssueDate: sizingYarnIssueDtl.sizingYarnIssueDate.slice(0, 10),
//         yarnIssueChallanNo: sizingYarnIssueDtl.yarnIssueChallanNo || '',
//         activeFlag: sizingYarnIssueDtl.activeFlag !== false
//       });

//       if (sizingYarnIssueDtl.requirements) {
//         setYarnRequirementDetails(sizingYarnIssueDtl.requirements.map((req: any) => ({
//           yarnName: req.yarnName,
//           yarnCount: String(req.yarnCount),
//           gramsPerMeter: String(req.gramsPerMeter),
//           totalwarpReq: String(req.totalReqQty),
//           totalWarpIssued: String(req.totalIssueQty),
//           balanceWarpToIssue: String(req.balanceToIssue)
//         })));
//       }

//       if (sizingYarnIssueDtl.sizingYarnIssue) {
//         setSelectedLot(sizingYarnIssueDtl.sizingYarnIssue.map((issue: any) => ({
//           id: issue.id,
//           yarnName: issue.yarnName,
//           availableQty: issue.availableReqQty,
//           issueQty: issue.issueQty,
//           lotId: issue.lotId,
//           activeFlag: issue.activeFlag !== false
//         })));
//       }
//     }
//   }, [sizingYarnIssueDtl, reset]);

//   useEffect(() => {
//     const subscription = watch((value, { name }) => {
//       setFormValidation(prev => ({
//         ...prev,
//         yarnIssueDate: !!value.yarnIssueDate,
//         vendorId: !!value.vendorId,
//         transportationDetails: !!value.transportationDetails,
//         termsConditionsId: !!value.termsConditionsId,
//         sizingPlanId: !!value.sizingPlanId,
//         hasValidItems: selectedLot.length > 0 &&
//           selectedLot.every(lot => lot.issueQty !== null && lot.issueQty! > 0)
//       }));
//     });
//     return () => subscription.unsubscribe();
//   }, [watch, selectedLot]);

//   const isFormValid = formValidation.yarnIssueDate &&
//     formValidation.vendorId &&
//     formValidation.transportationDetails &&
//     formValidation.termsConditionsId &&
//     formValidation.sizingPlanId &&
//     formValidation.hasValidItems;

//   const onSubmit = (data: SizingYarnIssueFormData) => {
//     const payload = {
//       vendorId: Number(data.vendorId),
//       sizingPlanId: Number(data.sizingPlanId),
//       transportationDetails: data.transportationDetails,
//       termsConditionsId: data.termsConditionsId,
//       fabricDetails: data.fabricDetails,
//       sizingYarnIssueDate: data.yarnIssueDate,
//       yarnIssueChallanNo: data.yarnIssueChallanNo,
//       activeFlag: true,
//       requirements: yarnRequirementDetails.map((req) => ({
//         yarnName: req.yarnName,
//         yarnCount: Number(req.yarnCount),
//         gramsPerMeter: Number(req.gramsPerMeter),
//         totalReqQty: Number(req.totalwarpReq),
//         totalIssueQty: Number(req.totalWarpIssued) || 0,
//         balanceToIssue: Number(req.balanceWarpToIssue) || Number(req.totalwarpReq),
//         yarnIssues: selectedLot.map((lot) => ({
//           lotId: lot.lotId,
//           yarnName: lot.yarnName,
//           availableReqQty: lot.availableQty,
//           issueQty: lot.issueQty || 0
//         }))
//       }))
//     };

//     dispatch(createWeavingYarnIssue(payload))
//       .unwrap()
//       .then(() => {
//         reset();
//         setYarnRequirementDetails([]);
//         setSelectedLot([]);
//       })
//       .catch((error: any) => {
//         console.error("Error creating Sizing Yarn Issue:", error);
//       });
//   };

//   const handleJobWorkChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const id = parseInt(e.target.value);
//     setSelectedJobWork(null);
//     setYarnRequirementDetails([]);

//     if (id) {
//       try {
//         const result = await dispatch(getWeavingContractById(id));
//         const yarnRequired = result?.payload;

//         if (yarnRequired?.yarnRequirements) {
//           const requirements = yarnRequired.yarnRequirements.map((yarn: any) => ({
//             yarnName: yarn.yarnType,
//             yarnCount: String(yarn.yarnCount),
//             gramsPerMeter: String(yarn.gramsPerMeter),
//             totalwarpReq: String(yarn.totalRequiredQty),
//             totalWarpIssued: String(yarn.totalIssuedQty || 0),
//             balanceWarpToIssue: String(yarn.totalRequiredQty - (yarn.totalIssuedQty || 0))
//           }));

//           setYarnRequirementDetails(requirements);
//           setSelectedJobWork(yarnRequired);
//         }
//       } catch (error) {
//         console.error("Error fetching weaving contract by ID:", error);
//       }
//     }
//   };

//   const handleYarnIssue = async () => {
//     setShowLotDialog(true);
//     try {
//       const result = await dispatch(getAllLotEntries({}));
//       if (result.payload && result.payload.length > 0) {
//         const transformedLots = result.payload
//           .filter((lot: any) => lot.lotNumber)
//           .map((lot: any) => ({
//             id: lot.id,
//             yarnName: `Yarn ${lot.id}`,
//             lotId: lot.lotNumber,
//             availableQty: Number(lot.quantity) - Number(lot.rejectedQuantity || 0),
//             activeFlag: lot.activeFlag !== false
//           }));

//         setYarnIssueDetails(transformedLots);
//       } else {
//         setYarnIssueDetails([]);
//       }
//     } catch (error) {
//       console.error('Error fetching lot entries:', error);
//       setYarnIssueDetails([]);
//     }
//   };

//   const handleLotSelect = (lotDetail: LotDetail) => {
//     setSelectedLot(prev => {
//       const exists = prev.some(lot => lot.id === lotDetail.id);
//       if (exists) {
//         return prev.filter(lot => lot.id !== lotDetail.id);
//       }
//       return [...prev, { ...lotDetail, issueQty: null }];
//     });
//   };

//   return (
//     <div className="mt-10 p-6 bg-white shadow-md rounded-lg">
//       <div className="flex justify-between items-center border-b pb-4">
//         <h2 className="text-2xl font-semibold">Sizing Yarn Issue</h2>
//         <Button
//           onClick={handleSubmit(onSubmit)}
//           className={`bg-green-600 hover:bg-green-700 text-white px-6 flex items-center ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''
//             }`}
//           disabled={!isFormValid}
//         >
//           <Save size={18} className="mr-2" />
//           {sizingYarnIssueDtl?.id ? "Update" : "Save"} Sizing Yarn Issue
//         </Button>
//       </div>

//       <div className="space-y-6 mt-6">
//         <div className="border-b border-gray-200">
//           <nav className="flex -mb-px">
//             <button
//               onClick={() => setActiveTab('orderDetails')}
//               className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm ${activeTab === 'orderDetails'
//                 ? 'border-red-500 text-red-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 }`}
//             >
//               <FileText className="w-4 h-4" />
//               Order Details
//             </button>
//           </nav>
//         </div>

//         {activeTab === "orderDetails" && (
//           <Card>
//             <CardContent className="pt-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Sizing Yarn Issue Date <span className="text-red-600">*</span>
//                   </label>
//                   <input
//                     type="date"
//                     {...register("yarnIssueDate", { required: "Date is required" })}
//                     className={`w-full p-2 border rounded ${errors.yarnIssueDate ? 'border-red-500' : 'border-gray-300'}`}
//                   />
//                   {errors.yarnIssueDate && (
//                     <p className="mt-1 text-sm text-red-600">{errors.yarnIssueDate.message}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Supplier Name <span className="text-red-600">*</span>
//                   </label>
//                   <select
//                     {...register("vendorId", { required: "Supplier is required" })}
//                     className={`w-full p-2 border rounded ${errors.vendorId ? 'border-red-500' : 'border-gray-300'}`}
//                   >
//                     <option value="">Select Supplier</option>
//                     {vendorList?.map((vendor: any) => (
//                       <option key={vendor.id} value={vendor.id}>{vendor.vendorName}</option>
//                     ))}
//                   </select>
//                   {errors.vendorId && (
//                     <p className="mt-1 text-sm text-red-600">{errors.vendorId.message}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Transportation Details <span className="text-red-600">*</span>
//                   </label>
//                   <input
//                     {...register("transportationDetails", { required: "Transportation details are required" })}
//                     className={`w-full p-2 border rounded ${errors.transportationDetails ? 'border-red-500' : 'border-gray-300'}`}
//                     placeholder="Enter transportation details"
//                   />
//                   {errors.transportationDetails && (
//                     <p className="mt-1 text-sm text-red-600">{errors.transportationDetails.message}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Terms & Conditions <span className="text-red-600">*</span>
//                   </label>
//                   <select
//                     {...register("termsConditionsId", { required: "Terms & Conditions are required" })}
//                     className={`w-full p-2 border rounded ${errors.termsConditionsId ? 'border-red-500' : 'border-gray-300'}`}
//                   >
//                     <option value="">Select Terms & Conditions</option>
//                     {termsContitionsList?.map((tc: any) => (
//                       <option key={tc.id} value={tc.id}>{tc.termsConditionsName}</option>
//                     ))}
//                   </select>
//                   {errors.termsConditionsId && (
//                     <p className="mt-1 text-sm text-red-600">{errors.termsConditionsId.message}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Sizing Plan Number <span className="text-red-600">*</span>
//                   </label>
//                   <select
//                     {...register("sizingPlanId", { required: "Sizing plan is required" })}
//                     className={`w-full p-2 border rounded ${errors.sizingPlanId ? 'border-red-500' : 'border-gray-300'}`}
//                     onChange={handleJobWorkChange}
//                   >
//                     <option value="">Select Sizing Plan</option>
//                     {weavingContractList?.map((sp: any) => (
//                       <option key={sp.id} value={sp.id}>{sp.weavingContractNo}</option>
//                     ))}
//                   </select>
//                   {errors.sizingPlanId && (
//                     <p className="mt-1 text-sm text-red-600">{errors.sizingPlanId.message}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">Fabric Details</label>
//                   <textarea
//                     {...register("fabricDetails")}
//                     className="w-full p-2 border border-gray-300 rounded"
//                     placeholder="Enter fabric details"
//                     rows={3}
//                   />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {selectedJobWork && (
//           <>
//             <Card>
//               <CardHeader>
//                 <CardTitle>Yarn Requirement Details</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="overflow-x-auto">
//                   <table className="w-full border-collapse">
//                     <thead>
//                       <tr className="bg-gray-100">
//                         <th className="border p-2">Yarn Type</th>
//                         <th className="border p-2">Yarn Count</th>
//                         <th className="border p-2">Grams/Mtr</th>
//                         <th className="border p-2">Total Required Qty</th>
//                         <th className="border p-2">Total Issued Qty</th>
//                         <th className="border p-2">Balance to Issue</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {yarnRequirementDetails.length > 0 ? (
//                         yarnRequirementDetails.map((detail, index) => (
//                           <tr key={index}>
//                             <td className="border p-2">{detail.yarnName}</td>
//                             <td className="border p-2">{detail.yarnCount}</td>
//                             <td className="border p-2">{detail.gramsPerMeter}</td>
//                             <td className="border p-2">{detail.totalwarpReq}</td>
//                             <td className="border p-2">{detail.totalWarpIssued}</td>
//                             <td className="border p-2">{detail.balanceWarpToIssue}</td>
//                           </tr>
//                         ))
//                       ) : (
//                         <tr>
//                           <td colSpan={6} className="border p-2 text-center text-gray-500">
//                             No yarn requirements found
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex justify-between items-center">
//                   <span>Yarn Issue Details</span>
//                   <Button onClick={handleYarnIssue}>Add Yarn Lots</Button>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="overflow-x-auto">
//                   <table className="w-full border-collapse">
//                     <thead>
//                       <tr className="bg-gray-100">
//                         <th className="border p-2">Yarn Name</th>
//                         <th className="border p-2">Lot ID</th>
//                         <th className="border p-2">Available Qty</th>
//                         <th className="border p-2">Issued Qty</th>
//                         <th className="border p-2">Action</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {selectedLot.length > 0 ? (
//                         selectedLot.map((detail, index) => (
//                           <tr key={index}>
//                             <td className="border p-2">{detail.yarnName}</td>
//                             <td className="border p-2">{detail.lotId}</td>
//                             <td className="border p-2">{detail.availableQty}</td>
//                             <td className="border p-2">
//                               <input
//                                 type="number"
//                                 value={detail.issueQty ?? ''}
//                                 onChange={(e) => {
//                                   const value = e.target.value === '' ? null : Number(e.target.value);
//                                   const newDetails = [...selectedLot];
//                                   newDetails[index].issueQty = value;
//                                   setSelectedLot(newDetails);
//                                 }}
//                                 min={0}
//                                 max={detail.availableQty}
//                                 className={`w-full p-1 border rounded ${detail.issueQty === null || detail.issueQty == 0 ? 'border-red-500' : 'border-gray-300'
//                                   }`}
//                                 placeholder={`Max ${detail.availableQty}`}
//                               />
//                             </td>
//                             <td className="border p-2">
//                               <Button
//                                 variant="destructive"
//                                 size="sm"
//                                 onClick={() => {
//                                   setSelectedLot(selectedLot.filter((_, i) => i !== index));
//                                 }}
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                               </Button>
//                             </td>
//                           </tr>
//                         ))
//                       ) : (
//                         <tr>
//                           <td colSpan={5} className="border p-2 text-center text-gray-500">
//                             No lots selected. Click "Add Yarn Lots" to select yarn lots.
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//                 {!formValidation.hasValidItems && (
//                   <div className="text-red-600 text-sm mt-2">
//                     {selectedLot.length === 0
//                       ? "Please add at least one yarn lot"
//                       : "Please enter valid quantities for all selected lots"}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </>
//         )}

//         <Dialog open={showLotDialog} onOpenChange={setShowLotDialog}>
//           <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
//             <DialogHeader>
//               <DialogTitle>Select Yarn Lots</DialogTitle>
//             </DialogHeader>
//             <div className="overflow-y-auto max-h-[60vh]">
//               <table className="w-full border-collapse">
//                 <thead className="sticky top-0 bg-gray-100">
//                   <tr>
//                     <th className="border p-2">Select</th>
//                     <th className="border p-2">Yarn Name</th>
//                     <th className="border p-2">Lot ID</th>
//                     <th className="border p-2">Available Qty</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {yarnIssueDetails.map((lot) => {
//                     const isSelected = selectedLot.some((l) => l.id === lot.id);
//                     return (
//                       <tr key={lot.id} className={isSelected ? "bg-blue-50" : ""}>
//                         <td className="border p-2 text-center">
//                           <Checkbox
//                             checked={isSelected}
//                             onCheckedChange={() => handleLotSelect({
//                               id: lot.id,
//                               yarnName: lot.yarnName,
//                               availableQty: lot.availableReqQty,
//                               lotId: lot.lotId
//                             })}
//                           />
//                         </td>
//                         <td className="border p-2">{lot.yarnName}</td>
//                         <td className="border p-2">{lot.lotId}</td>
//                         <td className="border p-2">{lot.availableReqQty}</td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//             <div className="flex justify-end gap-2 mt-4">
//               <Button variant="outline" onClick={() => setShowLotDialog(false)}>
//                 Cancel
//               </Button>
//               <Button onClick={() => setShowLotDialog(false)}>
//                 Confirm Selection
//               </Button>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </div>
//   );
// }











import { DataTable } from "@/components/data/DataTable";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { getAllPoTypes, getAllPurchaseOrders } from "@/state/purchaseOrderSlice";
import { deleteSizingPlan, getAllSizingPlan } from "@/state/sizingPlanSlice";
import { AppDispatch, RootState } from "@/state/store";
import { Edit, Trash2 } from "lucide-react";
import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Column } from "react-table";


interface SizingPlan {
  id: number;
  sizingPlanNo: string;
  vendorId: number;
  consigneeId: number;
  termsConditionsId: number;
  paymentTermsId: number;
  sizingRate: number;
  emptyBeamNo: string | null;
  remarks: string;
  sizingQualityDetails: {
    id: number;
    sizingPlanId: number | null;
    quality: string;
    yarnId: number;
    sordEnds: number;
    actualEnds: number;
    parts: number;
    endsPerPart: number;
    wrapMeters: number;
  }[];
  sizingBeamDetails: {
    id: number;
    sizingPlanId: number | null;
    weavingContractId: number;
    salesOrderId: number;
    emptyBeamId: number;
    wrapMeters: number;
    shrinkage: number;
    expectedFabricMeter: number;
  }[];
}

// In your Modal component types file
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl'; // Add this line
  className?: string;
}

export function SizingPlanDetails() {

  const { sizingPlanList } = useSelector((state: RootState) => state.sizingPlan)
  const { vendorList } = useSelector((state: RootState) => state.vendor)
  const { termsContitionsList } = useSelector((state: RootState) => state.termsConditions)
  const { paymentTermsList } = useSelector((state: RootState) => state.paymentTerms)
  const { salesOrderList } = useSelector((state: RootState) => state.salesOrder)
  const { consigneeList } = useSelector((state: RootState) => state.consignee)
  const { yarnList } = useSelector((state: RootState) => state.yarn)
  const { weavingContractList } = useSelector((state: RootState) => state.weavingContracts)
  const { emptyBeamIssueList } = useSelector((state: RootState) => state.emptyBeamIssue)
  const [sizingPlan, setsizingPlan]: any = useState(sizingPlanList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentSizingPlan, setCurrentSizingPlan] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [isEditing, setIsEditing] = React.useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllSizingPlan({}));
  }, [dispatch]);



  const columns: Column<SizingPlan>[] = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        Cell: ({ row }: { row: { index: number } }) => row.index + 1
      },
      {
        Header: 'Sizing Plan No',
        accessor: 'sizingPlanNo',
      },
      {
        Header: 'Vendor',
        accessor: 'vendorId',
        Cell: ({ value }: { value: number }) => {
          const vendor = vendorList.find((v: any) => v.id === value);
          return vendor ? vendor.vendorName : value;
        }
      },
      {
        Header: 'Consignee',
        accessor: 'consigneeId',
        Cell: ({ value }: { value: number }) => {
          const consignee = consigneeList.find((c: any) => c.id === value);
          return consignee ? consignee.consigneeName : value;
        }
      },
      {
        Header: 'Sizing Rate',
        accessor: 'sizingRate',
      },
      {
        Header: 'Remarks',
        accessor: 'remarks',
      },
    ],
    [vendorList, consigneeList, yarnList, weavingContractList, emptyBeamIssueList]
  );

  const handleAdd = () => {
    setModalMode('add');
    setCurrentSizingPlan(null);
    navigate("/transaction/sizing-plan-entry");
  };

  const handleEdit = (sizingPlanDtl: any) => {
    console.log(sizingPlanDtl)
    setModalMode('edit');
    setCurrentSizingPlan(sizingPlanDtl);
    setIsModalOpen(true);
    navigate("/transaction/sizing-plan-entry", { state: { sizingPlanDtl } });

  };

  const handleDelete = (sizingPlan: any) => {
    setCurrentSizingPlan(sizingPlan);
    setIsDeleteModalOpen(true);
  };

  const handleView = (sizingPlan: any) => {
    setCurrentSizingPlan(sizingPlan);
    setIsViewModalOpen(true);
  };

  // const confirmDelete = () => {
  //   setCurrentSizingPlan(sizingPlan.filter((c: { id: any; }) => c.id !== currentSizingPlan.id));
  //   setIsDeleteModalOpen(false);
  // };
  const confirmDelete = async () => {
    if (!currentSizingPlan) return;

    try {
      // Dispatch delete action and wait for it to complete
      const resultAction = await dispatch(deleteSizingPlan(currentSizingPlan.id));
      console.log(resultAction)
      // Check if the deletion was successful
      if (deleteSizingPlan.fulfilled.match(resultAction)) {
        // Force refresh the data with a new timestamp
        await dispatch(getAllSizingPlan({
          refresh: true,
          timestamp: Date.now()
        }));
      }
    } catch (error) {
      console.error("Error deleting SizingPlan:", error);
      // toast.error("Failed to delete Sizing Plan");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };


  return (
    <div>
      <DataTable
        columns={columns}
        data={sizingPlanList}
        title="Sizing Plan Details"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        showActions={true}
        filterPlaceholder="Search sizing plan..."
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete sizingPlan?</p>
          <p className="text-red-600 text-sm">This action cannot be undone.</p>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button onClick={confirmDelete} className="btn btn-danger">
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Sizing Plan Details"
        className="w-full max-w-6xl" // Use className instead of size
      >
        {currentSizingPlan && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {/* Basic Information */}
              <div>
                <p className="text-sm text-secondary-500">Sizing Plan No</p>
                <p className="font-medium">{currentSizingPlan.sizingPlanNo}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Vendor</p>
                <p className="font-medium">
                  {vendorList.find((v: any) => v.id === currentSizingPlan.vendorId)?.vendorName || currentSizingPlan.vendorId}
                </p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Consignee</p>
                <p className="font-medium">
                  {consigneeList.find((c: any) => c.id === currentSizingPlan.consigneeId)?.consigneeName || currentSizingPlan.consigneeId}
                </p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Terms & Conditions</p>
                <p className="font-medium">
                  {termsContitionsList.find((t: any) => t.id === currentSizingPlan.termsConditionsId)?.termsConditionsName || currentSizingPlan.termsConditionsId}
                </p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Payment Terms</p>
                <p className="font-medium">
                  {paymentTermsList.find((p: any) => p.id === currentSizingPlan.paymentTermsId)?.termName || currentSizingPlan.paymentTermsId}
                </p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Sizing Rate</p>
                <p className="font-medium">{currentSizingPlan.sizingRate}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Empty Beam No</p>
                <p className="font-medium">{currentSizingPlan.emptyBeamNo || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-secondary-500">Remarks</p>
                <p className="font-medium">{currentSizingPlan.remarks}</p>
              </div>
            </div>

            {/* Quality Details */}
            <div className="mt-6">
              <h3 className="font-medium text-lg mb-2">Quality Details</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quality</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yarn</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sord Ends</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual Ends</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parts</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ends/Part</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warp Meters</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentSizingPlan.sizingQualityDetails.map((quality: any, index: any) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quality.quality}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {yarnList.find((y: any) => y.id === quality.yarnId)?.yarnName || quality.yarnId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quality.sordEnds}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quality.actualEnds}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quality.parts}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quality.endsPerPart}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quality.wrapMeters}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Beam Details */}
            <div className="mt-6">
              <h3 className="font-medium text-lg mb-2">Beam Details</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weaving Contract</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales Order</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empty Beam</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warp Meters</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shrinkage</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Fabric</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentSizingPlan.sizingBeamDetails.map((beam: any, index: any) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {weavingContractList.find((w: any) => w.id === beam.weavingContractId)?.weavingContractNo || beam.weavingContractId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {salesOrderList.find((s: any) => s.id === beam.salesOrderId)?.salesOrderNo || beam.salesOrderId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {emptyBeamIssueList.find((e: any) => e.id === beam.emptyBeamId)?.emptyBeamId || beam.emptyBeamId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{beam.wrapMeters}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{beam.shrinkage}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{beam.expectedFabricMeter}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
import { DataTable } from "@/components/data/DataTable";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { deleteBeamInward, getAllBeamInward } from "@/state/beamInwardSlice";
import { getAllPoTypes, getAllPurchaseOrders } from "@/state/purchaseOrderSlice";
import { AppDispatch, RootState } from "@/state/store";
import { getAllWeavingContract } from "@/state/weavingContractSlice";
import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

interface BeamInwardData {
  id: number;
  vendorId: number;
  sizingPlanId: number | null;
  termsConditionsId: number;
  consigneeId: number;
  paymentTermsId: number;
  sizingRate: number;
  remarks: string;
  beamInwardNo: string;
  beamInwardQualityDetails: {
    id: number;
    beamInwardId: number | null;
    quality: string;
    yarnId: number;
    sordEnds: number;
    actualEnds: number;
    parts: number;
    endsPerPart: number;
    wrapMeters: number;
  }[];
  beamInwardBeamDetails: {
    id: number;
    beamInwardId: number | null;
    weavingContractId: number;
    salesOrderId: number;
    emptyBeamId: number;
    wrapMeters: number;
    shrinkage: number;
    expectedFabricMeter: number;
  }[];
}

export function BeamInwardDetails() {

  const { weavingContractList } = useSelector((state: RootState) => state.weavingContracts);
  const { purchaseOrderList } = useSelector((state: RootState) => state.purchaseOrder);
  const { beamInwardList } = useSelector((state: RootState) => state.beamInward);
  const [beamInwardData, setBeamInwardData] = useState<BeamInwardData[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentBeamInward, setCurrentBeamInward] = useState<BeamInwardData | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllBeamInward({}));
    // Simulate fetching beam inward data
  }, [dispatch]);

  const columns = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        Cell: ({ row }: { row: { index: number } }) => row.index + 1
      },
      {
        Header: 'Beam Inward No',
        accessor: 'beamInwardNo',
      },
      {
        Header: 'Vendor ID',
        accessor: 'vendorId',
      },
      {
        Header: 'Sizing Rate',
        accessor: 'sizingRate',
      },
      // {
      //   Header: "Status",
      //   accessor: "activeFlag",
      //   Cell: ({ value }: { value: boolean }) => (
      //     <span
      //       className={`px-2 py-1 rounded-full text-xs ${value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
      //     >
      //       {value ? "Active" : "Inactive"}
      //     </span>
      //   ),
      // },
    ],
    []
  );

  const handleAdd = () => {
    navigate("/transaction/beam-inward-entry");
  };

  const handleEdit = (beamInwardDtl: BeamInwardData) => {
    console.log(JSON.stringify(beamInwardDtl));
    navigate("/transaction/beam-inward-entry", { state: { beamInwardDtl } });
  };

  const handleDelete = (beamInward: BeamInwardData) => {
    setCurrentBeamInward(beamInward);
    setIsDeleteModalOpen(true);
  };

  const handleView = (beamInward: BeamInwardData) => {
    setCurrentBeamInward(beamInward);
    setIsViewModalOpen(true);
  };

  // const confirmDelete = () => {
  //   // Implement actual delete logic here
  //   setBeamInwardData(beamInwardData.filter(item => item.id !== currentBeamInward?.id));
  //   setIsDeleteModalOpen(false);
  // };
  const confirmDelete = async () => {
    if (!currentBeamInward) return;
    try {
      await dispatch(deleteBeamInward(currentBeamInward.id)).unwrap();
      await dispatch(getAllBeamInward({}));
    } catch (error) {
      console.error("Error deleting Beam Inward:", error);
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <div>
      <DataTable
        columns={columns}
        data={beamInwardList}
        title="Beam Inward Details"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        showActions={true}
        filterPlaceholder="Search beam inward..."
      />

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Beam Inward Details"
        className="max-w-4xl"
      >
        {currentBeamInward && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-secondary-500">Beam Inward No</p>
                <p className="font-medium">{currentBeamInward.beamInwardNo}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Vendor ID</p>
                <p className="font-medium">{currentBeamInward.vendorId}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Consignee ID</p>
                <p className="font-medium">{currentBeamInward.consigneeId}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Sizing Rate</p>
                <p className="font-medium">{currentBeamInward.sizingRate}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Payment Terms</p>
                <p className="font-medium">{currentBeamInward.paymentTermsId}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Remarks</p>
                <p className="font-medium">{currentBeamInward.remarks}</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium text-lg mb-3">Quality Details</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-2">Quality</th>
                      <th className="border p-2">Yarn ID</th>
                      <th className="border p-2">Sord Ends</th>
                      <th className="border p-2">Actual Ends</th>
                      <th className="border p-2">Parts</th>
                      <th className="border p-2">Ends Per Part</th>
                      <th className="border p-2">Wrap Meters</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentBeamInward.beamInwardQualityDetails.map((quality, index) => (
                      <tr key={index}>
                        <td className="border p-2">{quality.quality}</td>
                        <td className="border p-2">{quality.yarnId}</td>
                        <td className="border p-2">{quality.sordEnds}</td>
                        <td className="border p-2">{quality.actualEnds}</td>
                        <td className="border p-2">{quality.parts}</td>
                        <td className="border p-2">{quality.endsPerPart}</td>
                        <td className="border p-2">{quality.wrapMeters}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium text-lg mb-3">Beam Details</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-2">Weaving Contract ID</th>
                      <th className="border p-2">Sales Order ID</th>
                      <th className="border p-2">Empty Beam ID</th>
                      <th className="border p-2">Wrap Meters</th>
                      <th className="border p-2">Shrinkage</th>
                      <th className="border p-2">Expected Fabric Meter</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentBeamInward.beamInwardBeamDetails.map((beam, index) => (
                      <tr key={index}>
                        <td className="border p-2">{beam.weavingContractId}</td>
                        <td className="border p-2">{beam.salesOrderId}</td>
                        <td className="border p-2">{beam.emptyBeamId}</td>
                        <td className="border p-2">{beam.wrapMeters}</td>
                        <td className="border p-2">{beam.shrinkage}</td>
                        <td className="border p-2">{beam.expectedFabricMeter}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={() => setIsViewModalOpen(false)}
                className="btn btn-secondary"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      {/* <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete beam inward "{currentBeamInward?.beamInwardNo}"?</p>
          <p className="text-red-600 text-sm">This action cannot be undone.</p>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              onClick={() => setIsDeleteModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </Button>
            <Button onClick={confirmDelete} className="btn btn-danger">
              Delete
            </Button>
          </div>
        </div>
      </Modal> */}

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete beam inward"?</p>
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

    </div>
  );
}

// import { DataTable } from "@/components/data/DataTable";
// import { Modal } from "@/components/ui/Modal";
// import { getAllPoTypes, getAllPurchaseOrders } from "@/state/purchaseOrderSlice";
// import { AppDispatch, RootState } from "@/state/store";
// import { getAllWeavingContract } from "@/state/weavingContractSlice";
// import React from "react";
// import { useEffect, useMemo, useState } from "react";
// import { useForm } from "react-hook-form";
// import { useDispatch, useSelector } from "react-redux";
// import { useLocation, useNavigate } from "react-router-dom";

// interface categoryFormData {
//   id?: number;
//   name: string;
//   status: string;
// }

// export function SizingYarnIssueDetails() {

//   const { weavingContractList } = useSelector((state: RootState) => state.weavingContracts)
//   const { purchaseOrderList } = useSelector((state: RootState) => state.purchaseOrder);
//   const [weavingContract, setWeavingContract]: any = useState(weavingContractList);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [currentWeavingContract, setCurrentWeavingContract] = useState<any>(null);
//   const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
//   const [isEditing, setIsEditing] = React.useState(false);
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();
//   const { register, handleSubmit, reset, formState: { errors } } = useForm<categoryFormData>();

//   useEffect(() => {
//     dispatch(getAllWeavingContract({}));
//     console.log(weavingContractList)
//   }, [dispatch]);

//   const columns = useMemo(
//     () => [
//       {
//         Header: 'ID',
//         accessor: 'id',
//         Cell: ({ row }: { row: { index: number } }) => row.index + 1
//       },
//       {
//         Header: 'Weaving Contract No',
//         accessor: 'weavingContractNo',
//       },
//       {
//         Header: 'vendor',
//         accessor: 'vendorId',
//       },
//       {
//         Header: "Status",
//         accessor: "activeFlag",
//         Cell: ({ value }: { value: boolean }) => (
//           <span
//             className={`px-2 py-1 rounded-full text-xs ${value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//               }`}
//           >
//             {value ? "Active" : "Inactive"}
//           </span>
//         ),
//       },
//     ],
//     []
//   );

//   const handleAdd = () => {
//     setModalMode('add');
//     setCurrentWeavingContract(null);
//     reset({
//       name: '',
//       status: 'Active',
//     });
//     // setIsModalOpen(true);
//     navigate("/transaction/sizing-yarn-issue");
//   };

//   // const handleEdit = (category: any) => {
//   //   setModalMode('edit');
//   //   setCurrentWeavingContract(category);
//   //   reset({
//   //     id: category.id,
//   //     name: category.name,
//   //     status: category.status,
//   //   });
//   //   setIsModalOpen(true);
//   // };

//   const handleEdit = (weavingContractDtl: any) => {
//     setModalMode('edit');
//     setCurrentWeavingContract(weavingContractDtl);
//     setIsModalOpen(true);
//     navigate("/transaction/sizing-plan-entry", { state: { weavingContractDtl } });

//   };

//   const handleDelete = (category: any) => {
//     setCurrentWeavingContract(category);
//     setIsDeleteModalOpen(true);
//   };

//   const handleView = (category: any) => {
//     setCurrentWeavingContract(category);
//     setIsViewModalOpen(true);
//   };

//   const confirmDelete = () => {
//     setWeavingContract(weavingContract.filter((c: { id: any; }) => c.id !== currentWeavingContract.id));
//     setIsDeleteModalOpen(false);
//   };

//   return (
//     <div>
//       <DataTable
//         columns={columns}
//         data={weavingContractList}
//         title="Sizing Yarn Issue Details"
//         onAdd={handleAdd}
//         onEdit={handleEdit}
//         onDelete={handleDelete}
//         onView={handleView}
//         filterPlaceholder="Search sizing plan..."
//       />

//       {/* Add/Edit Modal */}
//       {/* <Modal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         title={modalMode === 'add' ? 'Add category' : 'Edit category'}
//       >
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-secondary-700">Name</label>
//             <input
//               {...register('name', { required: 'Name is required' })}
//               className="input mt-1"
//             />
//             {errors.name && (
//               <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
//             )}
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-secondary-700">Status</label>
//             <select
//               {...register('status', { required: 'Status is required' })}
//               className="input mt-1"
//             >
//               <option value="Active">Active</option>
//               <option value="Inactive">Inactive</option>
//             </select>
//             {errors.status && (
//               <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
//             )}
//           </div>

//           <div className="flex justify-end space-x-3 pt-4">
//             <button
//               type="button"
//               onClick={() => setIsModalOpen(false)}
//               className="btn btn-secondary"
//             >
//               Cancel
//             </button>
//             <button type="submit" className="btn btn-primary">
//               {modalMode === 'add' ? 'Add category' : 'Update category'}
//             </button>
//           </div>
//         </form>
//       </Modal> */}

//       {/* Delete Confirmation Modal */}
//       <Modal
//         isOpen={isDeleteModalOpen}
//         onClose={() => setIsDeleteModalOpen(false)}
//         title="Confirm Delete"
//       >
//         <div className="space-y-4">
//           <p>Are you sure you want to delete category "{currentWeavingContract?.name}"?</p>
//           <p className="text-red-600 text-sm">This action cannot be undone.</p>

//           <div className="flex justify-end space-x-3 pt-4">
//             <button
//               onClick={() => setIsDeleteModalOpen(false)}
//               className="btn btn-secondary"
//             >
//               Cancel
//             </button>
//             <button onClick={confirmDelete} className="btn btn-danger">
//               Delete
//             </button>
//           </div>
//         </div>
//       </Modal>

//       {/* View Modal */}
//       <Modal
//         isOpen={isViewModalOpen}
//         onClose={() => setIsViewModalOpen(false)}
//         title="Purchase Order Details"
//       >
//         {currentWeavingContract && (
//           <div className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <p className="text-sm text-secondary-500">ID</p>
//                 <p className="font-medium">{currentWeavingContract.id}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-secondary-500">PO Date</p>
//                 <p className="font-medium">{currentWeavingContract.poDate}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-secondary-500">PO No</p>
//                 <p className="font-medium">{currentWeavingContract.poNo}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-secondary-500">Vendor</p>
//                 <p className="font-medium">{currentWeavingContract.vendor}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-secondary-500">Total Qty</p>
//                 <p className="font-medium">{currentWeavingContract.vendorPoNo}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-secondary-500">Net Amount</p>
//                 <p className="font-medium">{currentWeavingContract.fabricQuality}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-secondary-500">Status</p>
//                 <p className="font-medium">{currentWeavingContract.totalQty}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-secondary-500">Status</p>
//                 <p>
//                   <span className={`px-2 py-1 rounded-full text-xs ${currentWeavingContract.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                     }`}>
//                     {currentWeavingContract.status}
//                   </span>
//                 </p>
//               </div>
//             </div>
//             <div className="flex justify-end pt-4">
//               <button
//                 onClick={() => setIsViewModalOpen(false)}
//                 className="btn btn-secondary"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// }



import { DataTable } from "@/components/data/DataTable";
import { Modal } from "@/components/ui/Modal";
import { getAllWeavingContract } from "@/state/weavingContractSlice";
import { AppDispatch, RootState } from "@/state/store";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllSizingYarnIssue } from "@/state/sizingYarnIssueSlice";

interface SizingYarnIssue {
  id: number;
  vendorId: number;
  sizingPlanId: number;
  transportationDetails: string;
  termsConditionsId: number;
  fabricDetails: string | null;
  sizingYarnIssueDate: string;
  activeFlag: boolean;
  requirements: Requirement[];
  sizingYarnIssue: YarnIssue[];
}

interface Requirement {
  id: number;
  sizingYarnIssueEntryId: number | null;
  yarnName: string;
  yarnCount: number;
  gramsPerMeter: number;
  totalReqQty: number;
  totalIssueQty: number;
  balanceToIssue: number;
  activeFlag: boolean;
}

interface YarnIssue {
  id: number;
  sizingYarnIssueEntryId: number | null;
  lotId: number;
  yarnName: string;
  availableReqQty: number;
  issueQty: number;
  activeFlag: boolean;
}

export function SizingYarnIssueDetails() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const { sizingYarnIssuetList } = useSelector((state: RootState) => state.sizingYarnIssue);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentIssue, setCurrentIssue] = useState<SizingYarnIssue | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    // You'll need to dispatch an action to fetch sizing yarn issues
    dispatch(getAllSizingYarnIssue({}));
  }, [dispatch]);

  const columns = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        Cell: ({ row }: { row: { index: number } }) => row.index + 1
      },
      {
        Header: 'Issue Date',
        accessor: 'sizingYarnIssueDate',
      },
      {
        Header: 'Fabric Details',
        accessor: 'fabricDetails',
        Cell: ({ value }: { value: string | null }) => value || 'N/A',
      },
      {
        Header: 'Transport Details',
        accessor: 'transportationDetails',
      },
      {
        Header: "Status",
        accessor: "activeFlag",
        Cell: ({ value }: { value: boolean }) => (
          <span
            className={`px-2 py-1 rounded-full text-xs ${value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
          >
            {value ? "Active" : "Inactive"}
          </span>
        ),
      },
    ],
    []
  );

  // const handleAdd = () => {
  //   navigate("/transaction/sizing-yarn-issue/create");
  // };

  const handleAdd = () => {
    setModalMode('add');
    setCurrentIssue(null);
    // reset({
    //   name: '',
    //   status: 'Active',
    // });
    // setIsModalOpen(true);
    navigate("/transaction/sizing-yarn-issue");
  };

  // const handleEdit = (issue: SizingYarnIssue) => {
  //   navigate(`/transaction/sizing-yarn-issue/edit/${issue.id}`, { state: { issue } });
  // };

  const handleEdit = (sizingYarnIssueDtl: any) => {
    console.log("Handle Edit:", sizingYarnIssueDtl);
    setModalMode('edit');
    setCurrentIssue(sizingYarnIssueDtl);
    setIsModalOpen(true);
    navigate("/transaction/sizing-yarn-issue", { state: { sizingYarnIssueDtl } });

  };

  const handleDelete = (issue: SizingYarnIssue) => {
    setCurrentIssue(issue);
    setIsDeleteModalOpen(true);
  };

  const handleView = (issue: SizingYarnIssue) => {
    setCurrentIssue(issue);
    setIsViewModalOpen(true);
  };

  const confirmDelete = () => {
    // Dispatch delete action here
    // dispatch(deleteSizingYarnIssue(currentIssue.id));
    setIsDeleteModalOpen(false);
  };

  return (
    <div>
      <DataTable
        columns={columns}
        data={sizingYarnIssuetList}
        title="Sizing Yarn Issue Details"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        showActions={true}
        filterPlaceholder="Search yarn issues..."
      />

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Sizing Yarn Issue Details"
        className="max-w-4xl"
      >
        {currentIssue && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-secondary-500">ID</p>
                <p className="font-medium">{currentIssue.id}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Issue Date</p>
                <p className="font-medium">{currentIssue.sizingYarnIssueDate}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Fabric Details</p>
                <p className="font-medium">{currentIssue.fabricDetails || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Transport Details</p>
                <p className="font-medium">{currentIssue.transportationDetails}</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium text-lg mb-3">Yarn Requirements</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yarn Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yarn Count</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grams/Meter</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required Qty</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issued Qty</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentIssue.requirements.map((req) => (
                      <tr key={req.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{req.yarnName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{req.yarnCount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{req.gramsPerMeter}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{req.totalReqQty}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{req.totalIssueQty}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{req.balanceToIssue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium text-lg mb-3">Yarn Issues</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lot ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yarn Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available Qty</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issued Qty</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentIssue.sizingYarnIssue.map((issue) => (
                      <tr key={issue.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{issue.lotId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{issue.yarnName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{issue.availableReqQty}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{issue.issueQty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete this yarn issue?</p>
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
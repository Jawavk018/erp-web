
// import { DataTable } from "@/components/data/DataTable";
// import { Modal } from "@/components/ui/Modal";
// import { getAllPoTypes, getAllPurchaseOrders } from "@/state/purchaseOrderSlice";
// import { AppDispatch, RootState } from "@/state/store";
// import { getAllWeavingContract } from "@/state/weavingContractSlice";
// import { getAllWeavingYarnIssue } from "@/state/weavingYarnIssueSlice";
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

// export function WeavingIssueDetails() {

//   const { weavingYarnIssuetList } = useSelector((state: RootState) => state.weavingYarnIssue)
//   const { purchaseOrderList } = useSelector((state: RootState) => state.purchaseOrder);
//   const [weavingContract, setWeavingContract]: any = useState(weavingYarnIssuetList);
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
//     dispatch(getAllWeavingYarnIssue({}));
//     console.log(weavingYarnIssuetList)
//   }, [dispatch]);

//   const columns = useMemo(
//     () => [
//       {
//         Header: 'ID',
//         accessor: 'id',
//       },
//       {
//         Header: 'Weaving Contract No',
//         accessor: 'weavingContractId',
//       },
//       {
//         Header: 'Transportation',
//         accessor: 'transportationDetails',
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
//     navigate("/transaction/weaving-contract-entry");
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
//     navigate("/transaction/weaving-contract-entry", { state: { weavingContractDtl } });

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
//       <h1 className="text-2xl font-bold mb-6">Weaving Yarn Issue Management</h1>

//       <DataTable
//         columns={columns}
//         data={weavingYarnIssuetList}
//         title="Weaving Yarn Issue Details"
//         onAdd={handleAdd}
//         onEdit={handleEdit}
//         onDelete={handleDelete}
//         onView={handleView}
//         filterPlaceholder="Search Weaving Yarn Issue Details here..."
//       />
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
import { getAllWeavingYarnIssue } from "@/state/weavingYarnIssueSlice";
import { AppDispatch, RootState } from "@/state/store";
import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export function WeavingIssueDetails() {
  const { weavingYarnIssuetList } = useSelector((state: RootState) => state.weavingYarnIssue);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentWeavingContract, setCurrentWeavingContract] = useState<any>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllWeavingYarnIssue({}));
  }, [dispatch]);

  const columns = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        Cell: ({ row }: { row: { index: number } }) => row.index + 1
      },
      {
        Header: 'Weaving Contract No',
        accessor: 'weavingContractId',
      },
      {
        Header: 'Yarn Issue Date',
        accessor: 'yarnIssueDate',
      },
      {
        Header: 'Challan No',
        accessor: 'yarnIssueChallanNo',
      },
      {
        Header: 'Transportation',
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

  const handleAdd = () => {
    navigate("/transaction/weaving-yarn-issue");
  };

  const handleEdit = (weavingYarnIssueDtl: any) => {
    console.log(weavingYarnIssueDtl)
    navigate("/transaction/weaving-yarn-issue", { state: { weavingYarnIssueDtl } });
  };

  const handleDelete = (item: any) => {
    setCurrentWeavingContract(item);
    setIsDeleteModalOpen(true);
  };

  const handleView = (item: any) => {
    setCurrentWeavingContract(item);
    setIsViewModalOpen(true);
  };

  const confirmDelete = () => {
    // TODO: Implement actual delete functionality
    setIsDeleteModalOpen(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Weaving Yarn Issue Management</h1>

      <DataTable
        columns={columns}
        data={weavingYarnIssuetList}
        title="Weaving Yarn Issue Details"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        showActions={true}
        filterPlaceholder="Search Weaving Yarn Issue Details here..."
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete this yarn issue (ID: {currentWeavingContract?.id})?</p>
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
        title="Weaving Yarn Issue Details"
        className="max-w-4xl"
      >
        {currentWeavingContract && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-secondary-500">ID</p>
                <p className="font-medium">{currentWeavingContract.id}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Weaving Contract ID</p>
                <p className="font-medium">{currentWeavingContract.weavingContractId}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Yarn Issue Date</p>
                <p className="font-medium">{currentWeavingContract.yarnIssueDate}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Challan No</p>
                <p className="font-medium">{currentWeavingContract.yarnIssueChallanNo}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Transportation Details</p>
                <p className="font-medium">{currentWeavingContract.transportationDetails}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Fabric Details</p>
                <p className="font-medium">{currentWeavingContract.fabricDetails || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Status</p>
                <p>
                  <span className={`px-2 py-1 rounded-full text-xs ${currentWeavingContract.activeFlag ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {currentWeavingContract.activeFlag ? 'Active' : 'Inactive'}
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium mb-3">Yarn Requirements</h3>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentWeavingContract.requirements?.map((requirement: any) => (
                      <tr key={requirement.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{requirement.yarnName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{requirement.yarnCount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{requirement.gramsPerMeter}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{requirement.totalReqQty}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{requirement.totalIssueQty}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{requirement.balanceToIssue}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs ${requirement.activeFlag ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {requirement.activeFlag ? 'Active' : 'Inactive'}
                          </span>
                        </td>
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
    </div>
  );
}
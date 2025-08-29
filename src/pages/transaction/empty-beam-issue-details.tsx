import { DataTable } from "@/components/data/DataTable";
import { Modal } from "@/components/ui/Modal";
import { deleteEmptyBeamIssue, getAllEmptyBeamIssue } from "@/state/emptyBeamIssueSlice";
import { AppDispatch, RootState } from "@/state/store";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export function EmptyBeamIssueDetails() {

  const { emptyBeamIssueList } = useSelector((state: RootState) => state.emptyBeamIssue);
  const { vendorList } = useSelector((state: RootState) => state.vendor);
  const { consigneeList } = useSelector((state: RootState) => state.consignee);
  const [emptyBeamIssue, setEmptyBeamIssue]: any = useState(emptyBeamIssueList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentEmptyBeamIssue, setCurrentEmptyBeamIssue] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();


  // const { register, handleSubmit, reset, formState: { errors } } = useForm<categoryFormData>();

  useEffect(() => {
    dispatch(getAllEmptyBeamIssue({}))
  }, [dispatch]);

  const flattenedData = emptyBeamIssueList.flatMap((order: any) =>
    order.items.map((item: any) => ({
      id: order.id,
      emptyBeamIssueDate: order.emptyBeamIssueDate.split('T')[0],
      emptyBeamNo: order.emptyBeamNo,
      vechileNo: order.vechileNo,
      vendorId: order.vendorId,
      consigneeId: order.consigneeId,
    }))
  );

  console.log("Flattened Data:", flattenedData);

  const columns = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        Cell: ({ row }: { row: { index: number } }) => row.index + 1
      },
      { Header: 'Empty Beam No', accessor: 'emptyBeamNo' },
      { Header: 'Empty Beam Issue Date', accessor: 'emptyBeamIssueDate' },
      { Header: 'Vechile No', accessor: 'vechileNo' },
      { Header: 'Vendor Name', accessor: 'vendorId' },
      { Header: 'Consignee Name', accessor: 'consigneeId' },
    ],
    []
  );


  const handleAdd = () => {
    setModalMode('add');
    setCurrentEmptyBeamIssue(null);
    navigate("/transaction/empty-beam-issue");
  };

  const handleEdit = (emptyBeamIssuedetail: any) => {
    console.log(emptyBeamIssuedetail)
    setModalMode('edit');
    setCurrentEmptyBeamIssue(emptyBeamIssue);
    setIsModalOpen(true);
    navigate("/transaction/empty-beam-issue", { state: { emptyBeamIssuedetail } });
  };

  const handleDelete = (category: any) => {
    setCurrentEmptyBeamIssue(category);
    setIsDeleteModalOpen(true);
  };

  const handleView = (category: any) => {
    setCurrentEmptyBeamIssue(category);
    setIsViewModalOpen(true);
  };

  // const confirmDelete = () => {
  //   setEmptyBeamIssue(emptyBeamIssue.filter((c: { id: any; }) => c.id !== currentEmptyBeamIssue.id));
  //   setIsDeleteModalOpen(false);
  // };

  const confirmDelete = async () => {
    if (!currentEmptyBeamIssue) return;
    try {
      await dispatch(deleteEmptyBeamIssue(currentEmptyBeamIssue.id)).unwrap();
      await dispatch(getAllEmptyBeamIssue({}));
    } catch (error) {
      console.error("Error deleting EmptyBeamIssue:", error);
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <div>
      <DataTable
        columns={columns}
        data={emptyBeamIssueList}
        title="Empty Beam Issue Details"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        showActions={true}
        filterPlaceholder="Search Empty Beam Issue..."
      />

      {/* Add/Edit Modal */}

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Empty Beam Issue Details"
      >
        {currentEmptyBeamIssue && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-secondary-500">Empty Beam No</p>
                <p className="font-medium">{currentEmptyBeamIssue.emptyBeamNo}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Empty Beam Issue Date</p>
                <p className="font-medium">{currentEmptyBeamIssue.emptyBeamIssueDate}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Vechile No</p>
                <p className="font-medium">{currentEmptyBeamIssue.vechileNo}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Vendor Name</p>
                <p className="font-medium">{vendorList.find((v: any) => v.id === currentEmptyBeamIssue.vendorId)?.vendorName || currentEmptyBeamIssue.vendorId}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Consignee Name</p>
                <p className="font-medium">{consigneeList.find((v: any) => v.id === currentEmptyBeamIssue.consigneeId)?.consigneeName || currentEmptyBeamIssue.consigneeId}</p>
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
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete EmptyBeamIssue"?</p>
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



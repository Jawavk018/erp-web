import { DataTable } from "@/components/data/DataTable";
import { Modal } from "@/components/ui/Modal";
import { createProcessMaster, deleteProcessMaster, getAllProcessMaster, updateProcessMaster } from "@/state/processMasterSlice";
import { AppDispatch, RootState } from "@/state/store";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

interface ProcessData {
  id: number;
  processName: string;
  description: string;
  activeFlag: boolean;
}

interface ProcessFormData {
  id?: number | null;
  processName: string;
  description: string;
  activeFlag: boolean;
}

export function ProcessMaster() {

  const { processMasterList } = useSelector((state: RootState) => state.process);
  const dispatch = useDispatch<AppDispatch>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentDefect, setCurrentDefect] = useState<ProcessData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // const { register, handleSubmit, reset, formState: { errors } } = useForm<ProcessFormData>();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields, isValid }
  } = useForm<ProcessFormData>({
    mode: 'onBlur', // Validate on blur
    reValidateMode: 'onBlur' // Re-validate on blur
  });

  useEffect(() => {
    dispatch(getAllProcessMaster({}));
  }, [dispatch]);

  const columns = useMemo(() => [
    { Header: "ID", accessor: "id", Cell: ({ row }: { row: { index: number } }) => row.index + 1 },
    { Header: "Process Name", accessor: "processName" },
    { Header: "Description", accessor: "description" },
    {
      Header: "Status",
      accessor: "activeFlag",
      Cell: ({ value }: { value: boolean }) => (
        <span className={`px-2 py-1 rounded-full text-xs ${value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{value ? "Active" : "Inactive"}</span>
      ),
    },
  ], []);

  const handleOpenModal = (editing = false, defectMaster: ProcessData | null = null) => {
    if (editing && defectMaster) {
      reset({ ...defectMaster });
      setCurrentDefect(defectMaster);
    } else {
      reset({ id: null, processName: "", description: "", activeFlag: true });
      setCurrentDefect(null);
    }
    setIsEditing(editing);
    setIsModalOpen(true);
  };

  const handleDelete = (defectMaster: ProcessData) => {
    setCurrentDefect(defectMaster);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!currentDefect) return;
    await dispatch(deleteProcessMaster(currentDefect.id));
    dispatch(getAllProcessMaster({}));
    setIsDeleteModalOpen(false);
  };

  const onSubmit = async (data: ProcessFormData) => {
    if (isEditing) {
      await dispatch(updateProcessMaster(data));
    } else {
      await dispatch(createProcessMaster(data));
    }
    dispatch(getAllProcessMaster({}));
    setIsModalOpen(false);
    reset();
  };

  const handleView = (state: any) => {
    setCurrentDefect(state);
    setIsViewModalOpen(true);
  };

  const handleEdit = (state: any) => {
    setIsEditing(true);
    setCurrentDefect(state);
    reset({
      id: state.id, processName: state.processName,
      description: state.description, activeFlag: state.activeFlag
    });
    setIsModalOpen(true);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Process Management</h1>
      <DataTable
        columns={columns}
        data={processMasterList}
        title="Process Master"
        onAdd={() => handleOpenModal(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        showActions={true}
        filterPlaceholder="Search Process..."
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? "Edit Process" : "Add Process"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Process Name <span className="text-red-600">*</span> </label>
            <input {...register("processName", { required: "Process Name is required" })} className="input mt-1" />
            {errors.processName && <p className="mt-1 text-sm text-red-600">{errors.processName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea {...register("description")} className="input mt-1"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select {...register("activeFlag", { required: "Status is required" })} className="input mt-1">
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button
              type="submit"
              className={`btn 
                        ${!isValid
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed hover: dark:bg-gray-600 dark:text-gray-400'
                  : 'btn-primary hover:bg-blue-700'
                }
                        transition-colors duration-200
                      `}
              disabled={!isValid}
              title={!isValid ? "Please fill all required fields" : ""}
            >
              {isEditing ? "Update Process" : "Add Process"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Delete">
        <div className="space-y-4">
          <p>Are you sure you want to delete Process ?</p>
          <p className="text-red-600 text-sm">This action cannot be undone.</p>
          <div className="flex justify-end space-x-3 pt-4">
            <button onClick={() => setIsDeleteModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button onClick={confirmDelete} className="btn btn-danger">Delete</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Defect Details">
        {currentDefect && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm">Process Name</p>
                <p className="font-medium">{currentDefect.processName}</p>
              </div>
              <div>
                <p className="text-sm">Description</p>
                <p className="font-medium">{currentDefect.description}</p>
              </div>
              <div>
                <p className="text-sm">Status</p>
                <p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${currentDefect.activeFlag ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                  >
                    {currentDefect.activeFlag ? "Active" : "Inactive"}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button onClick={() => setIsViewModalOpen(false)} className="btn btn-secondary">Close</button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}

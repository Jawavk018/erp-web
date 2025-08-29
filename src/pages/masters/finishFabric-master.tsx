import { DataTable } from "@/components/data/DataTable";
import { Modal } from "@/components/ui/Modal";
import { createFinishFabric, deleteFinishFabric, getAllFinishFabric, updateFinishFabric } from "@/state/finishMasterSlice";
import { AppDispatch, RootState } from "@/state/store";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

interface FinishFabricData {
  id: number;
  finishName: string;
  finishCode: string;
  description: string;
  activeFlag: boolean;
}

interface FinishFabricFormData {
  id?: number | null;
  finishName: string;
  finishCode: string;
  description: string;
  activeFlag: boolean;
}

export function FinishFabricMaster() {

  const { finishFabricList } = useSelector((state: RootState) => state.finishFabric);
  const dispatch = useDispatch<AppDispatch>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentFinishFabric, setCurrentFinishFabric] = useState<FinishFabricData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // const { register, handleSubmit, reset, formState: { errors } } = useForm<FinishFabricFormData>();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields, isValid }
  } = useForm<FinishFabricFormData>({
    mode: 'onBlur', // Validate on blur
    reValidateMode: 'onBlur' // Re-validate on blur
  });

  useEffect(() => {
    dispatch(getAllFinishFabric({}));
  }, [dispatch]);

  const columns = useMemo(() => [
    { Header: "ID", accessor: "id", Cell: ({ row }: { row: { index: number } }) => row.index + 1 },
    { Header: "Finish Fabric Name", accessor: "finishName" },
    { Header: "Finish Fabric Code", accessor: "finishCode" },
    { Header: "Description", accessor: "description" },
    {
      Header: "Status",
      accessor: "activeFlag",
      Cell: ({ value }: { value: boolean }) => (
        <span className={`px-2 py-1 rounded-full text-xs ${value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{value ? "Active" : "Inactive"}</span>
      ),
    },
  ], []);

  const handleOpenModal = (editing = false, finishFabric: FinishFabricData | null = null) => {
    if (editing && finishFabric) {
      reset({ ...finishFabric });
      setCurrentFinishFabric(finishFabric);
    } else {
      reset({ id: null, finishName: "", finishCode: "", description: "", activeFlag: true });
      setCurrentFinishFabric(null);
    }
    setIsEditing(editing);
    setIsModalOpen(true);
  };

  const handleDelete = (finishFabric: FinishFabricData) => {
    setCurrentFinishFabric(finishFabric);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!currentFinishFabric) return;
    await dispatch(deleteFinishFabric(currentFinishFabric.id));
    dispatch(getAllFinishFabric({}));
    setIsDeleteModalOpen(false);
  };

  const onSubmit = async (data: FinishFabricFormData) => {
    if (isEditing) {
      await dispatch(updateFinishFabric(data));
    } else {
      await dispatch(createFinishFabric(data));
    }
    dispatch(getAllFinishFabric({}));
    setIsModalOpen(false);
    reset();
  };

  const handleView = (state: any) => {
    setCurrentFinishFabric(state);
    setIsViewModalOpen(true);
  };

  const handleEdit = (state: any) => {
    setIsEditing(true);
    setCurrentFinishFabric(state);
    reset({ id: state.id, finishName: state.finishName, finishCode: state.finishCode, description: state.description, activeFlag: state.activeFlag });
    setIsModalOpen(true);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Finish Fabric Management</h1>
      <DataTable
        columns={columns}
        data={finishFabricList}
        title="Finish Fabric Master"
        onAdd={() => handleOpenModal(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        showActions={true}
        filterPlaceholder="Search Finish Fabric..."
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? "Edit Finish Fabric" : "Add Finish Fabric"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Finish Fabric Name <span className="text-red-600">*</span> </label>
            <input {...register("finishName", { required: "Finish Fabric Name is required" })}
              placeholder="Enter Finish Fabric Name"
              className="input mt-1" />
            {errors.finishName && <p className="mt-1 text-sm text-red-600">{errors.finishName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Finish Fabric Code <span className="text-red-600">*</span> </label>
            <input {...register("finishCode", { required: "Finish Fabric Code is required" })}
              placeholder="Enter Finish Fabric Code"
              className="input mt-1" />
            {errors.finishCode && <p className="mt-1 text-sm text-red-600">{errors.finishCode.message}</p>}
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
            {/* <button type="submit" className="btn btn-primary">{isEditing ? "Edit Finish Fabric" : "Add Finish Fabric"}</button> */}
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
              {isEditing ? "Update Finish Fabric" : "Add Finish Fabric"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Delete">
        <div className="space-y-4">
          <p>Are you sure you want to delete FinishFabric "{currentFinishFabric?.finishName}"?</p>
          <p className="text-red-600 text-sm">This action cannot be undone.</p>
          <div className="flex justify-end space-x-3 pt-4">
            <button onClick={() => setIsDeleteModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button onClick={confirmDelete} className="btn btn-danger">Delete</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="FinishFabric Details">
        {currentFinishFabric && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm">Finish Fabric Name</p>
                <p className="font-medium">{currentFinishFabric.finishName}</p>
              </div>
              <div>
                <p className="text-sm">Finish Fabric Code</p>
                <p className="font-medium">{currentFinishFabric.finishCode}</p>
              </div>
              <div>
                <p className="text-sm">Description</p>
                <p className="font-medium">{currentFinishFabric.description}</p>
              </div>
              <div>
                <p className="text-sm">Status</p>
                <p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${currentFinishFabric.activeFlag ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                  >
                    {currentFinishFabric.activeFlag ? "Active" : "Inactive"}
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

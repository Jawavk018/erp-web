import { DataTable } from "@/components/data/DataTable";
import { Modal } from "@/components/ui/Modal";
import { createDefectMaster, deleteDefectMaster, getAllDefectMaster, updateDefectMaster } from "@/state/defectMasterSlice";
import { AppDispatch, RootState } from "@/state/store";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

interface DefectData {
  id: number;
  defectName: string;
  defectCode: string;
  defectPoint: string;
  description: string;
  activeFlag: boolean;
}

interface DefectFormData {
  id?: number | null;
  defectName: string;
  defectCode: string;
  defectPoint?: string;
  description: string;
  activeFlag: boolean;
}

export function DefectMaster() {

  const { defectMasterList } = useSelector((state: RootState) => state.defect);
  const dispatch = useDispatch<AppDispatch>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentDefect, setCurrentDefect] = useState<DefectData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // const { register, handleSubmit, reset, formState: { errors } } = useForm<DefectFormData>();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields, isValid }
  } = useForm<DefectFormData>({
    mode: 'onBlur', // Validate on blur
    reValidateMode: 'onBlur' // Re-validate on blur
  });

  useEffect(() => {
    dispatch(getAllDefectMaster({}));
  }, [dispatch]);

  const columns = useMemo(() => [
    { Header: "ID", accessor: "id", Cell: ({ row }: { row: { index: number } }) => row.index + 1 },
    { Header: "Defect Name", accessor: "defectName" },
    { Header: "Defect Code", accessor: "defectCode" },
    { Header: "Defect Point", accessor: "defectPoint" },
    { Header: "Description", accessor: "description" },
    {
      Header: "Status",
      accessor: "activeFlag",
      Cell: ({ value }: { value: boolean }) => (
        <span className={`px-2 py-1 rounded-full text-xs ${value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{value ? "Active" : "Inactive"}</span>
      ),
    },
  ], []);

  const handleOpenModal = (editing = false, defectMaster: DefectData | null = null) => {
    if (editing && defectMaster) {
      reset({ ...defectMaster });
      setCurrentDefect(defectMaster);
    } else {
      reset({ id: null, defectName: "", description: "", activeFlag: true });
      setCurrentDefect(null);
    }
    setIsEditing(editing);
    setIsModalOpen(true);
  };

  const handleDelete = (defectMaster: DefectData) => {
    setCurrentDefect(defectMaster);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!currentDefect) return;
    await dispatch(deleteDefectMaster(currentDefect.id));
    dispatch(getAllDefectMaster({}));
    setIsDeleteModalOpen(false);
  };

  const onSubmit = async (data: DefectFormData) => {
    if (isEditing) {
      await dispatch(updateDefectMaster(data));
    } else {
      await dispatch(createDefectMaster(data));
    }
    dispatch(getAllDefectMaster({}));
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
      id: state.id, defectName: state.defectName, defectPoint: state.defectPoint,
      defectCode: state.defectCode, description: state.description, activeFlag: state.activeFlag
    });
    setIsModalOpen(true);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Defect Management</h1>
      <DataTable
        columns={columns}
        data={defectMasterList}
        title="Defect Master"
        onAdd={() => handleOpenModal(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        showActions={true}
        filterPlaceholder="Search Defect..."
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? "Edit Defect" : "Add Defect"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Defect Name <span className="text-red-600">*</span> </label>
            <input {...register("defectName", { required: "Defect Name is required" })} className="input mt-1" />
            {errors.defectName && <p className="mt-1 text-sm text-red-600">{errors.defectName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Defect Code <span className="text-red-600">*</span> </label>
            <input {...register("defectCode", { required: "Defect Code is required" })} className="input mt-1" />
            {errors.defectCode && <p className="mt-1 text-sm text-red-600">{errors.defectCode.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Defect Point <span className="text-red-600">*</span> </label>
            <input {...register("defectPoint", { required: "Defect Point is required" })} className="input mt-1" />
            {errors.defectPoint && <p className="mt-1 text-sm text-red-600">{errors.defectPoint.message}</p>}
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
            {/* <button type="submit" className="btn btn-primary">{isEditing ? "Edit Defect" : "Add Defect"}</button> */}
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
              {isEditing ? "Update Defect" : "Add Defect"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Delete">
        <div className="space-y-4">
          <p>Are you sure you want to delete Defect ?</p>
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
                <p className="text-sm">Defect Name</p>
                <p className="font-medium">{currentDefect.defectName}</p>
              </div>
              <div>
                <p className="text-sm">Defect Code</p>
                <p className="font-medium">{currentDefect.defectCode}</p>
              </div>
              <div>
                <p className="text-sm">Defect Point</p>
                <p className="font-medium">{currentDefect.defectPoint}</p>
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

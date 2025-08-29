import { DataTable } from "@/components/data/DataTable";
import { Modal } from "@/components/ui/Modal";
import { createGrandMaster, deleteGrandMaster, getAllGrandMaster, updateGrandMaster } from "@/state/gradeMasterSlice";
import { AppDispatch, RootState } from "@/state/store";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

interface gradeData {
  id: number;
  gradeName: string;
  gradeCode: string;
  minPoint: string;
  maxPoint: string;
  description: string;
  activeFlag: boolean;
}

interface GradeFormData {
  id?: number | null;
  gradeName: string;
  gradeCode: string;
  minPoint?: string;
  maxPoint?: string;
  description: string;
  activeFlag: boolean;
}

export function GradeMaster() {

  const { gradeList } = useSelector((state: RootState) => state.grade);
  const dispatch = useDispatch<AppDispatch>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentGrade, setCurrentGrade] = useState<gradeData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // const { register, handleSubmit, reset, formState: { errors } } = useForm<GradeFormData>();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields, isValid }
  } = useForm<GradeFormData>({
    mode: 'onBlur', // Validate on blur
    reValidateMode: 'onBlur' // Re-validate on blur
  });

  useEffect(() => {
    dispatch(getAllGrandMaster({}));
    console.log(gradeList);
  }, [dispatch]);

  const columns = useMemo(() => [
    { Header: "ID", accessor: "id", Cell: ({ row }: { row: { index: number } }) => row.index + 1 },
    { Header: "Grade Name", accessor: "gradeName" },
    { Header: "Grade Code", accessor: "gradeCode" },
    { Header: "Min Point", accessor: "minPoint" },
    { Header: "Max Point", accessor: "maxPoint" },
    { Header: "Description", accessor: "description" },
    {
      Header: "Status",
      accessor: "activeFlag",
      Cell: ({ value }: { value: boolean }) => (
        <span className={`px-2 py-1 rounded-full text-xs ${value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{value ? "Active" : "Inactive"}</span>
      ),
    },
  ], []);

  const handleOpenModal = (editing = false, grandMaster: gradeData | null = null) => {
    if (editing && grandMaster) {
      reset({ ...grandMaster });
      setCurrentGrade(grandMaster);
    } else {
      reset({ id: null, gradeName: "", description: "", activeFlag: true });
      setCurrentGrade(null);
    }
    setIsEditing(editing);
    setIsModalOpen(true);
  };

  const handleDelete = (grandMaster: gradeData) => {
    setCurrentGrade(grandMaster);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!currentGrade) return;
    await dispatch(deleteGrandMaster(currentGrade.id));
    dispatch(getAllGrandMaster({}));
    setIsDeleteModalOpen(false);
  };

  const onSubmit = async (data: GradeFormData) => {
    if (isEditing) {
      await dispatch(updateGrandMaster(data));
    } else {
      await dispatch(createGrandMaster(data));
    }
    dispatch(getAllGrandMaster({}));
    setIsModalOpen(false);
    reset();
  };

  // const handleView = (state: any) => {
  //   alert('hiii')
  //   setCurrentGrade(state);
  //   setIsViewModalOpen(true);
  // };

  const handleView = (state: any) => {
    setCurrentGrade(state);
    setIsViewModalOpen(true);
  };

  const handleEdit = (state: any) => {
    setIsEditing(true);
    setCurrentGrade(state);
    reset({
      id: state.id, gradeName: state.gradeName, minPoint: state.minPoint, maxPoint: state.maxPoint,
      gradeCode: state.gradeCode, description: state.description, activeFlag: state.activeFlag
    });
    setIsModalOpen(true);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Grade Management</h1>
      <DataTable
        columns={columns}
        data={gradeList}
        title="Grade Master"
        onAdd={() => handleOpenModal(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        showActions={true}
        filterPlaceholder="Search Grade..."
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? "Edit Grade" : "Add Grade"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Grade Name <span className="text-red-600">*</span> </label>
            <input {...register("gradeName", { required: "Grade Name is required" })} className="input mt-1" />
            {errors.gradeName && <p className="mt-1 text-sm text-red-600">{errors.gradeName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Grade Code <span className="text-red-600">*</span> </label>
            <input {...register("gradeCode", { required: "Grade Code is required" })} className="input mt-1" />
            {errors.gradeCode && <p className="mt-1 text-sm text-red-600">{errors.gradeCode.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Min Point <span className="text-red-600">*</span> </label>
            <input {...register("minPoint", { required: "Min Point is required" })} className="input mt-1" />
            {errors.minPoint && <p className="mt-1 text-sm text-red-600">{errors.minPoint.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Max Point <span className="text-red-600">*</span> </label>
            <input {...register("maxPoint", { required: "Max Point is required" })} className="input mt-1" />
            {errors.maxPoint && <p className="mt-1 text-sm text-red-600">{errors.maxPoint.message}</p>}
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
            {/* <button type="submit" className="btn btn-primary">{isEditing ? "Edit UOM" : "Add UOM"}</button> */}
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
              {isEditing ? "Update Grade" : "Add Grade"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Delete">
        <div className="space-y-4">
          <p>Are you sure you want to delete Grade?</p>
          <p className="text-red-600 text-sm">This action cannot be undone.</p>
          <div className="flex justify-end space-x-3 pt-4">
            <button onClick={() => setIsDeleteModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button onClick={confirmDelete} className="btn btn-danger">Delete</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Grade Details">
        {currentGrade && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm">Grade Name</p>
                <p className="font-medium">{currentGrade.gradeName}</p>
              </div>
              <div>
                <p className="text-sm">Grade Code</p>
                <p className="font-medium">{currentGrade.gradeCode}</p>
              </div>
              <div>
                <p className="text-sm">Min Point</p>
                <p className="font-medium">{currentGrade.minPoint}</p>
              </div>
              <div>
                <p className="text-sm">Max Point</p>
                <p className="font-medium">{currentGrade.maxPoint}</p>
              </div>
              <div>
                <p className="text-sm">Description</p>
                <p className="font-medium">{currentGrade.description}</p>
              </div>
              <div>
                <p className="text-sm">Status</p>
                <p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${currentGrade.activeFlag ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                  >
                    {currentGrade.activeFlag ? "Active" : "Inactive"}
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

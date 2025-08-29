import { DataTable } from "@/components/data/DataTable";
import { Modal } from "@/components/ui/Modal";
import { createFabricCategory, deleteFabricCategory, getAllFabricCategory, updateFabricCategory } from "@/state/fabricCategorySlice";
import { AppDispatch, RootState } from "@/state/store";
import React, { useEffect } from "react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";


interface FabricCategoryDate {
  id: number;
  fabricCategoryName: string;
  activeFlag: boolean;
}

interface FabricCategoryFormDate {
  id?: number | null;
  fabricCategoryName: string;
  activeFlag: boolean;
}

export function FabricCategoryMaster() {

  const dispatch = useDispatch<AppDispatch>();
  const { fabricCategoryList } = useSelector((state: RootState) => state.fabricCategoty);
  const [fabricCategory, setFabricCategory] = useState(fabricCategoryList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<any>(null);
  const [isEditing, setIsEditing] = React.useState(false);

  // const { register, handleSubmit, reset, formState: { errors } } = useForm<FabricCategoryFormDate>();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields, isValid }
  } = useForm<FabricCategoryFormDate>({
    mode: 'onBlur', // Validate on blur
    reValidateMode: 'onBlur' // Re-validate on blur
  });

  useEffect(() => {
    dispatch(getAllFabricCategory({}));
  }, [dispatch]);

  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        Cell: ({ row }: { row: { index: number } }) => row.index + 1
      },
      {
        Header: 'Fabric Category Name',
        accessor: 'fabricCategoryName',
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

  const handleEdit = (state: any) => {
    setIsEditing(true);
    setCurrentCategory(state);
    reset({ id: state.id, fabricCategoryName: state.fabricCategoryName, activeFlag: state.activeFlag });
    setIsModalOpen(true);
  };

  const handleView = (fabric: any) => {
    setCurrentCategory(fabric);
    setIsViewModalOpen(true);
  };

  const handleOpenModal = (editing = false, state: FabricCategoryDate | null = null) => {
    if (editing && state) {
      reset({
        id: state.id,
        fabricCategoryName: state.fabricCategoryName,
        activeFlag: state.activeFlag
      });
      setFabricCategory(state);
    } else {
      reset({
        id: null,
        fabricCategoryName: '',
        activeFlag: true
      });
      setFabricCategory(null);
    }
    setIsEditing(editing);
    setIsModalOpen(true);
  };

  const onSubmit = async (data: FabricCategoryFormDate) => {
    try {
      console.log('Form data submitted:', data); // Add this to debug

      if (isEditing) {
        await dispatch(updateFabricCategory({
          ...data,
        }));
      } else {
        const { id, ...newStateData } = data;
        await dispatch(createFabricCategory({
          ...newStateData,
        }));
      }
      dispatch(getAllFabricCategory({}));
      setIsModalOpen(false);
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleDelete = (state: any) => {
    setCurrentCategory(state);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!currentCategory) return;

    try {
      await dispatch(deleteFabricCategory(currentCategory.id)).unwrap();
      await dispatch(getAllFabricCategory({}));
    } catch (error) {
      console.error("Error deleting country:", error);
    }

    setIsDeleteModalOpen(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Fabric Type Management</h1>

      <DataTable
        columns={columns}
        data={fabricCategoryList}
        title="Fabric Category Master"
        onAdd={() => handleOpenModal(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        showActions={true}
        filterPlaceholder="Search Fabric Category..."
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Fabric Category' : 'Add Fabric Category'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700">Fabric Category Name <span className="text-red-600">*</span> </label>
            <input
              {...register('fabricCategoryName', { required: 'Fabric Category Name is required' })}
              placeholder="Fabric Category Name"
              className="input mt-1"
            />
            {errors.fabricCategoryName && (
              <p className="mt-1 text-sm text-red-600">{errors.fabricCategoryName.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700">Status</label>
            <select
              {...register('activeFlag', { required: 'Status is required' })}
              className="input mt-1"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            {errors.activeFlag && (
              <p className="mt-1 text-sm text-red-600">{errors.activeFlag.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            {/* <button type="submit" className="btn btn-primary">
              {isEditing ? 'Edit Fabric Category' : 'Add Fabric Category'}
            </button> */}
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
              {isEditing ? "Update Fabric Category" : "Add Fabric Category"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Fabric Category Details">
        {currentCategory && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* <div>
                <p className="text-sm">ID</p>
                <p className="font-medium">{currentCategory.id}</p>
              </div> */}
              <div>
                <p className="text-sm">Fabric Category Name</p>
                <p className="font-medium">{currentCategory.fabricCategoryName}</p>
              </div>
              <div>
                <p className="text-sm">Status</p>
                <p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${currentCategory.activeFlag ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                  >
                    {currentCategory.activeFlag ? "Active" : "Inactive"}
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
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Delete">
        <div className="space-y-4">
          <p>Are you sure you want to delete Fabric Category?</p>
          <p className="text-red-600 text-sm">This action cannot be undone.</p>
          <div className="flex justify-end space-x-3 pt-4">
            <button onClick={() => setIsDeleteModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button onClick={confirmDelete} className="btn btn-danger">Delete</button>
          </div>
        </div>
      </Modal>

    </div>
  );
}

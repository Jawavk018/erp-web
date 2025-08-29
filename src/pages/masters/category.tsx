
import { DataTable } from "@/components/data/DataTable";
import { Modal } from "@/components/ui/Modal";
import { createCategory, deleteCategory, getAllCategories, updateCategory } from "@/state/categorySlice";
import { AppDispatch, RootState } from "@/state/store";
import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

interface categoryData {
  id: number;
  categoryName: string;
  activeFlag: boolean;
}

interface categoryFormData {
  id?: number | null;
  categoryName: string;
  activeFlag: boolean;
}

export function CategoryMaster() {

  const { categoryList } = useSelector((state: RootState) => state.category);
  const [category, setCategory] = useState(categoryList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentCategory, setcurrentCategory] = useState<any>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const dispatch = useDispatch<AppDispatch>();

  // const { register, handleSubmit, reset, formState: { errors } } = useForm<categoryFormData>();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields, isValid }
  } = useForm<categoryFormData>({
    mode: 'onBlur', // Validate on blur
    reValidateMode: 'onBlur' // Re-validate on blur
  });

  useEffect(() => {
    dispatch(getAllCategories({}));
  }, [dispatch]);


  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        Cell: ({ row }: { row: { index: number } }) => row.index + 1
      },
      {
        Header: 'Category Name',
        accessor: 'categoryName',
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
    setcurrentCategory(state);
    reset({ id: state.id, categoryName: state.categoryName, activeFlag: state.activeFlag });
    setIsModalOpen(true);
  };

  const handleDelete = (state: any) => {
    setcurrentCategory(state);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!currentCategory) return;

    try {
      await dispatch(deleteCategory(currentCategory.id)).unwrap();
      await dispatch(getAllCategories({}));
    } catch (error) {
      console.error("Error deleting category:", error);
    }

    setIsDeleteModalOpen(false);
  };

  const handleView = (state: any) => {
    setcurrentCategory(state);
    setIsViewModalOpen(true);
  };

  const handleOpenModal = (editing = false, state: categoryData | null = null) => {
    if (editing && state) {
      reset({
        id: state.id,
        categoryName: state.categoryName,
        activeFlag: state.activeFlag
      });
      setCategory(state);
    } else {
      reset({
        id: null,
        categoryName: '',
        activeFlag: true
      });
      setCategory(null);
    }
    setIsEditing(editing);
    setIsModalOpen(true);
  };

  const onSubmit = async (data: categoryFormData) => {
    try {
      console.log('Form data submitted:', data); // Add this to debug

      if (isEditing) {
        await dispatch(updateCategory({
          ...data,
        }));
      } else {
        const { id, ...newStateData } = data;
        await dispatch(createCategory({
          ...newStateData,
        }));
      }
      dispatch(getAllCategories({}));
      setIsModalOpen(false);
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">category Management</h1>

      <DataTable
        columns={columns}
        data={categoryList}
        title="Category Master"
        onAdd={() => handleOpenModal(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        showActions={true}
        filterPlaceholder="Search Category..."
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit category' : 'Add category'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700">Category Name <span className="text-red-600">*</span></label>
            <input
              {...register('categoryName', { required: 'Category Name is required' })}
              placeholder="Enter Category Name"
              className="input mt-1"
            />
            {errors.categoryName && (
              <p className="mt-1 text-sm text-red-600">{errors.categoryName.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700">Status</label>
            <select
              {...register('activeFlag')}
              className="input mt-1"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
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
              {isEditing ? "Update Category" : "Add Category"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete category "{currentCategory?.categoryName}"?</p>
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
        title="Category Details"
      >
        {currentCategory && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-secondary-500">Category Name</p>
                <p className="font-medium">{currentCategory.categoryName}</p>
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
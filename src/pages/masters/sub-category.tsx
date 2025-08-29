
import { DataTable } from "@/components/data/DataTable";
import { Modal } from "@/components/ui/Modal";
import { getAllCategories } from "@/state/categorySlice";
import { AppDispatch, RootState } from "@/state/store";
import { createSubCategory, deleteSubCategory, getAllSubCategories, updateSubCategory } from "@/state/subCategorySlice";
import React, { useEffect } from "react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

interface subcategoryData {
  id?: number;
  categorySno: string;
  categoryName: string;
  subCategoryName: string;
  activeFlag: boolean;
}

interface subcategoryFormData {
  id?: number | null;
  categorySno: string;
  subCategoryName: string;
  activeFlag: boolean;
}

export function SubCategoryMaster() {

  const { subCategoryList } = useSelector((state: RootState) => state.subCategory);
  const { categoryList } = useSelector((state: RootState) => state.category);
  const [subcategory, setSubCategory] = useState(subCategoryList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentSubCategory, setcurrentSubCategory] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [isEditing, setIsEditing] = React.useState(false);
  const dispatch = useDispatch<AppDispatch>();

  // const { register, handleSubmit, reset, formState: { errors } } = useForm<subcategoryFormData>();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields, isValid }
  } = useForm<subcategoryFormData>({
    mode: 'onBlur', // Validate on blur
    reValidateMode: 'onBlur' // Re-validate on blur
  });

  useEffect(() => {
    dispatch(getAllSubCategories({}));
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
        Header: 'SubCatgory Name',
        accessor: 'subCategoryName',
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
    setcurrentSubCategory(state);
    reset({ id: state.id, categorySno: state.categorySno, subCategoryName: state.subCategoryName, activeFlag: state.activeFlag });
    setIsModalOpen(true);
  };

  const handleDelete = (state: any) => {
    setcurrentSubCategory(state);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!currentSubCategory) return;

    try {
      await dispatch(deleteSubCategory(currentSubCategory.id)).unwrap();
      await dispatch(getAllSubCategories({}));
    } catch (error) {
      console.error("Error deleting country:", error);
    }

    setIsDeleteModalOpen(false);
  };

  const handleView = (state: any) => {
    setcurrentSubCategory(state);
    setIsViewModalOpen(true);
  };

  const handleOpenModal = (editing = false, state: subcategoryData | null = null) => {
    if (editing && state) {
      reset({
        id: state.id,
        // categorySno: state.categorySno,
        subCategoryName: state.subCategoryName,
        activeFlag: state.activeFlag
      });
      setSubCategory(state);
    } else {
      reset({
        id: null,
        // categorySno: '',
        subCategoryName: '',
        activeFlag: true
      });
      setSubCategory(null);
    }
    setIsEditing(editing);
    setIsModalOpen(true);
  };

  const onSubmit = async (data: subcategoryFormData) => {
    try {
      console.log('Form data submitted:', data); // Add this to debug

      if (isEditing) {
        await dispatch(updateSubCategory({
          ...data,
        }));
      } else {
        const { id, ...newSubCategoryData } = data;
        await dispatch(createSubCategory({
          ...newSubCategoryData,
        }));
      }
      dispatch(getAllSubCategories({}));
      setIsModalOpen(false);
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">subcategory Management</h1>

      <DataTable
        columns={columns}
        data={subCategoryList}
        title="Subcategory Master"
        onAdd={() => handleOpenModal(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        showActions={true}
        filterPlaceholder="Search subcategory..."
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Subcategory' : 'Add Subcategory'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Select Category <span className="text-red-600">*</span> </label>
            <select {...register("categorySno", { required: "Category is required" })}
              className="input mt-1">
              <option value="">Select a Category</option>
              {categoryList?.map((category: any) => (
                <option key={category.id} value={category.id}>{category.categoryName}</option>
              ))}
            </select>
            {errors.categorySno && <p className="mt-1 text-sm text-red-600">{errors.categorySno.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700">SubCategory Name <span className="text-red-600">*</span> </label>
            <input
              {...register('subCategoryName', { required: 'SubCategory Name is required' })}
              placeholder="Enter SubCategory Name"
              className="input mt-1"
            />
            {errors.subCategoryName && (
              <p className="mt-1 text-sm text-red-600">{errors.subCategoryName.message}</p>
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
            {/* <button type="submit" className="btn btn-primary">
              {isEditing ? 'Update Subcategory' : 'Add Subcategory'}
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
              {isEditing ? "Update Subcategory" : "Add Subcategory"}
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
          <p>Are you sure you want to delete subcategory?</p>

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
        title="Subcategory Details"
      >
        {currentSubCategory && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-secondary-500">Category Name</p>
                <p className="font-medium">{currentSubCategory.categoryName}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">SubCategory Name</p>
                <p className="font-medium">{currentSubCategory.subCategoryName}</p>
              </div>
              <div>
                <p className="text-sm">Status</p>
                <p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${currentSubCategory.activeFlag ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                  >
                    {currentSubCategory.activeFlag ? "Active" : "Inactive"}
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
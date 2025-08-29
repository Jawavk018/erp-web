
import { DataTable } from "@/components/data/DataTable";
import { Modal } from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";
import { AppDispatch, RootState } from "@/state/store";
import { getAllSubCategories, getSubCategoryByCategory } from "@/state/subCategorySlice";
import { getAllUomMaster } from "@/state/uomMasterSlice";
import { createYarnMaster, deleteYarnMaster, getAllYarnMasters, updateYarnMaster } from "@/state/yarnSlice";
import React, { useEffect } from "react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

interface yarnMasterData {
  id?: number | null;
  yarnName: string;
  unitSno: string;
  types: string;
  conversion: string;
  countSno: string;
  content: string;
  activeFlag: boolean;
}

interface yarnFormData {
  id?: number | null;
  yarnName: string;
  unitSno: string;
  types: string;
  conversion: string;
  countSno: string;
  content: string;
  activeFlag: boolean;
}

export function YarnMaster() {

  const { subCategoryByCategoryList } = useSelector((state: RootState) => state.subCategory);
  const { uomList } = useSelector((state: RootState) => state.uom);
  const { yarnList } = useSelector((state: RootState) => state.yarn);
  const [yarn, setYarn] = useState(yarnList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentyarn, setCurrentYarn] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [isEditing, setIsEditing] = React.useState(false);
  const dispatch = useDispatch<AppDispatch>();

  // const { register, handleSubmit, reset, formState: { errors } } = useForm<yarnFormData>();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields, isValid }
  } = useForm<yarnMasterData>({
    mode: 'onBlur', // Validate on blur
    reValidateMode: 'onBlur' // Re-validate on blur
  });

  useEffect(() => {
    dispatch(getAllYarnMasters({}));
    dispatch(getAllUomMaster({}));
    dispatch(getAllSubCategories({}));
    dispatch(getSubCategoryByCategory("Counts"));
  }, [dispatch]);

  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        Cell: ({ row }: { row: { index: number } }) => row.index + 1
      },
      {
        Header: 'Name',
        accessor: 'yarnName',
      },
      {
        Header: 'Units',
        accessor: 'unitSno',
      },
      {
        Header: 'Types',
        accessor: 'types',
      },
      {
        Header: 'Conversion',
        accessor: 'conversion',
      },
      {
        Header: 'Counts',
        accessor: 'countSno',
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
    setCurrentYarn(state);
    reset({
      id: state.id, yarnName: state.yarnName,
      countSno: state.countSno, unitSno: state.unitSno, types: state.types, conversion: state.conversion, content: state.content,
      activeFlag: state.activeFlag
    });
    setIsModalOpen(true);
  };

  const handleDelete = (state: any) => {
    setCurrentYarn(state);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!currentyarn) return;

    try {
      await dispatch(deleteYarnMaster(currentyarn.id)).unwrap();
      await dispatch(getAllYarnMasters({}));
    } catch (error) {
      console.error("Error deleting country:", error);
    }

    setIsDeleteModalOpen(false);
  };

  const handleView = (state: any) => {
    setCurrentYarn(state);
    setIsViewModalOpen(true);
  };

  const handleOpenModal = (editing = false, state: yarnMasterData | null = null) => {
    if (editing && state) {
      reset({
        id: state.id, yarnName: state.yarnName,
        countSno: state.countSno, unitSno: state.unitSno, types: state.types, conversion: state.conversion, content: state.content,
        activeFlag: state.activeFlag
      });
      setYarn(state);
    } else {
      reset({
        id: null,
        yarnName: '',
        countSno: '',
        unitSno: '',
        types: '',
        content: '',
        conversion: '',
        activeFlag: true
      });
      setYarn(null);
    }
    setIsEditing(editing);
    setIsModalOpen(true);
  };

  const onSubmit = async (data: yarnFormData) => {
    try {
      console.log('Form data submitted:', data); // Add this to debug

      if (isEditing) {
        await dispatch(updateYarnMaster({
          ...data,
        }));
      } else {
        const { id, ...newSubCategoryData } = data;
        await dispatch(createYarnMaster({
          ...newSubCategoryData,
        }));
      }
      dispatch(getAllYarnMasters({}));
      setIsModalOpen(false);
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Yarn Management</h1>

      <DataTable
        columns={columns}
        data={yarnList}
        title="Yarn Master"
        onAdd={() => handleOpenModal(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        showActions={true}
        filterPlaceholder="Search yarn..."
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Yarn' : 'Add Yarn'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700">Yarn Name <span className="text-red-600">*</span>
            </label>
            <input
              {...register('yarnName', { required: 'Yarn Name is required' })}
              placeholder="Enter Yarn Name"
              className="input mt-1"
            />
            {errors.yarnName && (
              <p className="mt-1 text-sm text-red-600">{errors.yarnName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Select Count <span className="text-red-600">*</span></label>
            <select {...register("countSno", { required: "Count is required" })} className="input mt-1">
              <option value="">Select a Count</option>
              {subCategoryByCategoryList?.map((category: any) => (
                <option key={category.id} value={category.id}>{category.subCategoryName}</option>
              ))}
            </select>
            {errors.countSno && <p className="mt-1 text-sm text-red-600">{errors.countSno.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Select Unit <span className="text-red-600">*</span></label>
            <select {...register("unitSno", { required: "Unit is required" })} className="input mt-1">
              <option value="">Select a Unit</option>
              {uomList?.map((uom: any) => (
                <option key={uom.id} value={uom.id}>{uom.uomName}</option>
              ))}
            </select>
            {errors.unitSno && <p className="mt-1 text-sm text-red-600">{errors.unitSno.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700">Content <span className="text-red-600">*</span></label>
            <input
              type="content"
              {...register('content', {
                required: 'Content is required'
              })}
              placeholder="Enter Content"
              className="input mt-1"
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700">Types <span className="text-red-600">*</span></label>
            <input
              {...register('types', { required: 'Type is required' })}
              placeholder="Enter Type"
              className="input mt-1"
            />
            {errors.types && (
              <p className="mt-1 text-sm text-red-600">{errors.types.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700">Conversion <span className="text-red-600">*</span></label>
            <input
              {...register('conversion', { required: 'Conversion is required' })}
              placeholder="Enter Conversion"
              className="input mt-1"
            />
            {errors.conversion && (
              <p className="mt-1 text-sm text-red-600">{errors.conversion.message}</p>
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
              {isEditing ? 'Update Yarn' : 'Add Yarn'}
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
              {isEditing ? "Update Yarn" : "Add Yarn"}
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
          <p>Are you sure you want to delete yarn?</p>
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
        title="Yarn Details"
      >
        {currentyarn && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-secondary-500">Name</p>
                <p className="font-medium">{currentyarn.yarnName}</p>
              </div>

              <div>
                <p className="text-sm text-secondary-500">Units</p>
                <p className="font-medium">{currentyarn.units}</p>
              </div>

              <div>
                <p className="text-sm text-secondary-500">Types</p>
                <p className="font-medium">{currentyarn.types}</p>
              </div>

              <div>
                <p className="text-sm text-secondary-500">Conversion</p>
                <p className="font-medium">{currentyarn.conversion}</p>
              </div>

              <div>
                <p className="text-sm text-secondary-500">Counts</p>
                <p className="font-medium">{currentyarn.countSno}</p>
              </div>
              <div>
                <p className="text-sm">Status</p>
                <p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${currentyarn.activeFlag ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                  >
                    {currentyarn.activeFlag ? "Active" : "Inactive"}
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
import { DataTable } from "@/components/data/DataTable";
import { Modal } from "@/components/ui/Modal";
import { AppDispatch, RootState } from "@/state/store";
import { createWarehouse, deleteWarehouse, getAllWarehouse, updateWarehouse } from "@/state/warehouseSlice";
import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';

interface WarehouseFormData {
  id?: number | null;
  warehouseName: string;
  activeFlag: boolean;
}

export function WarehouseMaster() {

  const { warehouseList } = useSelector((state: RootState) => state.warehouse);
  const [selectedWarehouse, setSelectedWarehouse] = React.useState<WarehouseFormData | null>(null);
  const [warehouse, setWarehouse] = useState(warehouseList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentWarehouse, setCurrentWarehouse] = useState<any>(null);
  const [isEditing, setIsEditing] = React.useState(false);

  const dispatch = useDispatch<AppDispatch>();

  // const { register, handleSubmit, reset, formState: { errors } } = useForm<WarehouseFormData>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields, isValid }
  } = useForm<WarehouseFormData>({
    mode: 'onBlur', // Validate on blur
    reValidateMode: 'onBlur' // Re-validate on blur
  });

  useEffect(() => {
    dispatch(getAllWarehouse({}));
  }, [dispatch]);

  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "id", Cell: ({ row }: { row: { index: number } }) => row.index + 1 },
      { Header: "warehouse Name", accessor: "warehouseName" },
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
    setCurrentWarehouse(state);
    reset({ id: state.id, warehouseName: state.warehouseName, activeFlag: state.activeFlag });
    setIsModalOpen(true);
  };

  const handleView = (state: any) => {
    setCurrentWarehouse(state);
    setIsViewModalOpen(true);
  };

  const handleOpenModal = (editing = false, warehouse: WarehouseFormData | null = null) => {
    if (editing && warehouse) {
      reset({
        id: warehouse.id,
        warehouseName: warehouse.warehouseName,
        activeFlag: warehouse.activeFlag
      });
      setWarehouse(warehouse);
    } else {
      reset({
        id: null,
        warehouseName: '',
        activeFlag: true
      });
      setWarehouse(null);
    }
    setIsEditing(editing);
    setIsModalOpen(true);
  };

  const onSubmit = async (data: WarehouseFormData) => {
    try {
      console.log('Form data submitted:', data); // Add this to debug

      if (isEditing) {
        await dispatch(updateWarehouse({
          ...data,
        }));
      } else {
        const { id, ...newwarehouseData } = data;
        await dispatch(createWarehouse({
          ...newwarehouseData,
        }));
      }
      dispatch(getAllWarehouse({}));
      setIsModalOpen(false);
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleDelete = (state: any) => {
    setCurrentWarehouse(state);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!currentWarehouse) return;

    try {
      await dispatch(deleteWarehouse(currentWarehouse.id)).unwrap();
      await dispatch(getAllWarehouse({}));
    } catch (error) {
      console.error("Error deleting warehouse:", error);
    }

    setIsDeleteModalOpen(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Warehouse Management</h1>
      <DataTable
        columns={columns}
        data={warehouseList}
        title="Warehouse Master"
        onAdd={() => handleOpenModal(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        showActions={true}
        filterPlaceholder="Search warehouse..."
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? "Edit Warehouse" : "Add Warehouse"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Warehouse Name <span className="text-red-600">*</span></label>
            <input
              {...register("warehouseName", {
                required: "Warehouse Name is required"
              })}
              placeholder="Enter Warehouse Name"
              className={`input mt-1 ${errors.warehouseName ? 'border-red-500' : ''}`}
            />
            {(touchedFields.warehouseName && errors.warehouseName) && (
              <p className="mt-1 text-sm text-red-600">
                {errors.warehouseName.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select {...register("activeFlag")} className="input mt-1">
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          {/* <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">{isEditing ? "Update warehouse" : "Add warehouse"}</button>
          </div> */}
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
              {isEditing ? "Update Warehouse" : "Add Warehouse"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Delete">
        <div className="space-y-4">
          <p>Are you sure you want to delete warehouse "{currentWarehouse?.warehouseName}"?</p>
          {/* <p className="text-red-600 text-sm">This action cannot be undone.</p> */}
          <div className="flex justify-end space-x-3 pt-4">
            <button onClick={() => setIsDeleteModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button onClick={confirmDelete} className="btn btn-danger">Delete</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="warehouse Details">
        {currentWarehouse && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm">warehouse No</p>
                <p className="font-medium">{currentWarehouse.warehouseName}</p>
              </div>
              <div>
                <p className="text-sm">Status</p>
                <p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${currentWarehouse.activeFlag ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                  >
                    {currentWarehouse.activeFlag ? "Active" : "Inactive"}
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


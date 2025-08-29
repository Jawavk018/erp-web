import { DataTable } from "@/components/data/DataTable";
import { Modal } from "@/components/ui/Modal";
import { createShipmentMode, deleteShipmentMode, getAllShipmentModes, updateShipmentMode } from "@/state/shipmentModeSlice";
import { AppDispatch, RootState } from "@/state/store";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

interface ShipmentModeData {
  id: number;
  modeName: string;
  description: string;
  activeFlag: boolean;
}

interface ShipmentModeFormData {
  id?: number | null;
  modeName: string;
  description: string;
  activeFlag: boolean;
}

export function ShipmentModeMaster() {
  const { shipmentModesList } = useSelector((state: RootState) => state.shipmentMode);
  const dispatch = useDispatch<AppDispatch>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentShipmentMode, setCurrentShipmentMode] = useState<ShipmentModeData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // const { register, handleSubmit, reset, formState: { errors } } = useForm<ShipmentModeFormData>();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields, isValid }
  } = useForm<ShipmentModeFormData>({
    mode: 'onBlur', // Validate on blur
    reValidateMode: 'onBlur' // Re-validate on blur
  });

  useEffect(() => {
    dispatch(getAllShipmentModes({}));
  }, [dispatch]);

  const columns = useMemo(() => [
    { Header: "ID", accessor: "id", Cell: ({ row }: { row: { index: number } }) => row.index + 1 },
    { Header: "Mode Name", accessor: "modeName" },
    { Header: "Description", accessor: "description" },
    {
      Header: "Status",
      accessor: "activeFlag",
      Cell: ({ value }: { value: boolean }) => (
        <span className={`px-2 py-1 rounded-full text-xs ${value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{value ? "Active" : "Inactive"}</span>
      ),
    },
  ], []);

  const handleOpenModal = (editing = false, shipmentMode: ShipmentModeData | null = null) => {
    if (editing && shipmentMode) {
      reset({ ...shipmentMode });
      setCurrentShipmentMode(shipmentMode);
    } else {
      reset({ id: null, modeName: "", description: "", activeFlag: true });
      setCurrentShipmentMode(null);
    }
    setIsEditing(editing);
    setIsModalOpen(true);
  };

  const handleDelete = (shipmentMode: ShipmentModeData) => {
    setCurrentShipmentMode(shipmentMode);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!currentShipmentMode) return;
    await dispatch(deleteShipmentMode(currentShipmentMode.id));
    dispatch(getAllShipmentModes({}));
    setIsDeleteModalOpen(false);
  };

  const onSubmit = async (data: ShipmentModeFormData) => {
    if (isEditing) {
      await dispatch(updateShipmentMode(data));
    } else {
      await dispatch(createShipmentMode(data));
    }
    dispatch(getAllShipmentModes({}));
    setIsModalOpen(false);
    reset();
  };

  const handleView = (state: any) => {
    setCurrentShipmentMode(state);
    // setIsViewModalOpen(true);
  };

  const handleEdit = (state: any) => {
    setIsEditing(true);
    setCurrentShipmentMode(state);
    reset({ id: state.id, modeName: state.modeName, description: state.description, activeFlag: state.activeFlag });
    setIsModalOpen(true);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Shipment Mode Management</h1>
      <DataTable
        columns={columns}
        data={shipmentModesList}
        title="Shipment Mode Master"
        onAdd={() => handleOpenModal(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        showActions={true}
        filterPlaceholder="Search Shipment Mode..."
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? "Edit Shipment Mode" : "Add Shipment Mode"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Shipment Mode Name <span className="text-red-600">*</span> </label>
            <input {...register("modeName", { required: "Shipment Mode Name is required" })}
              placeholder="Enter Shipmnt Mode Name"
              className="input mt-1" />
            {errors.modeName && <p className="mt-1 text-sm text-red-600">{errors.modeName.message}</p>}
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
            {/* <button type="submit" className="btn btn-primary">{isEditing ? "Edit Mode" : "Add Mode"}</button> */}
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
              {isEditing ? "Update Mode" : "Add Mode"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Delete">
        <div className="space-y-4">
          <p>Are you sure you want to delete mode "{currentShipmentMode?.modeName}"?</p>
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

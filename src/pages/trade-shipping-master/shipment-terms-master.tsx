import { DataTable } from "@/components/data/DataTable";
import { Modal } from "@/components/ui/Modal";
import { createShipmentTerm, deleteShipmentTerm, getAllShipmentTerms, updateShipmentTerm } from "@/state/shipmentTermsSlice";
import { AppDispatch, RootState } from "@/state/store";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

interface ShipmentTermData {
  id: number;
  termName: string;
  description: string;
  activeFlag: boolean;
}

interface ShipmentTermFormData {
  id?: number | null;
  termName: string;
  description: string;
  activeFlag: boolean;
}

export function ShipmentTermMaster() {
  const { shipmentTermsList } = useSelector((state: RootState) => state.shipmentTerms);
  const dispatch = useDispatch<AppDispatch>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentShipmentTerm, setCurrentShipmentTerm] = useState<ShipmentTermData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // const { register, handleSubmit, reset, formState: { errors } } = useForm<ShipmentTermFormData>();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields, isValid }
  } = useForm<ShipmentTermFormData>({
    mode: 'onBlur', // Validate on blur
    reValidateMode: 'onBlur' // Re-validate on blur
  });

  useEffect(() => {
    dispatch(getAllShipmentTerms({}));
  }, [dispatch]);

  const columns = useMemo(() => [
    { Header: "ID", accessor: "id", Cell: ({ row }: { row: { index: number } }) => row.index + 1 },
    { Header: "Term Name", accessor: "termName" },
    { Header: "Description", accessor: "description" },
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
  ], []);

  const handleOpenModal = (editing = false, shipmentTerm: ShipmentTermData | null = null) => {
    if (editing && shipmentTerm) {
      reset({ ...shipmentTerm });
      setCurrentShipmentTerm(shipmentTerm);
    } else {
      reset({ id: null, termName: "", description: "", activeFlag: true });
      setCurrentShipmentTerm(null);
    }
    setIsEditing(editing);
    setIsModalOpen(true);
  };

  const handleDelete = (shipmentTerm: ShipmentTermData) => {
    setCurrentShipmentTerm(shipmentTerm);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!currentShipmentTerm) return;
    await dispatch(deleteShipmentTerm(currentShipmentTerm.id));
    dispatch(getAllShipmentTerms({}));
    setIsDeleteModalOpen(false);
  };

  const onSubmit = async (data: ShipmentTermFormData) => {
    if (isEditing) {
      await dispatch(updateShipmentTerm(data));
    } else {
      await dispatch(createShipmentTerm(data));
    }
    dispatch(getAllShipmentTerms({}));
    setIsModalOpen(false);
    reset();
  };

  const handleView = (state: any) => {
    setCurrentShipmentTerm(state);
    // setIsViewModalOpen(true);
  };

  const handleEdit = (state: any) => {
    setIsEditing(true);
    setCurrentShipmentTerm(state);
    reset({ id: state.id, termName: state.termName, description: state.description, activeFlag: state.activeFlag });
    setIsModalOpen(true);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Shipment Terms Management</h1>
      <DataTable
        columns={columns}
        data={shipmentTermsList}
        title="Shipment Term Master"
        onAdd={() => handleOpenModal(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        showActions={true}
        filterPlaceholder="Search Shipment Term..."
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? "Edit Shipment Term" : "Add Shipment Term"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Shipment Term Name <span className="text-red-600">*</span> </label>
            <input {...register("termName", { required: "Shipment Term Name is required" })}
              placeholder="Enter Shipment Term Name"
              className="input mt-1" />
            {errors.termName && <p className="mt-1 text-sm text-red-600">{errors.termName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea {...register("description")} className="input mt-1"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select {...register("activeFlag")} className="input mt-1">
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
            {/* <button type="submit" className="btn btn-primary">{isEditing ? "Edit Term" : "Add Term"}</button> */}
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
              {isEditing ? "Update Term" : "Add Term"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Delete">
        <div className="space-y-4">
          <p>Are you sure you want to delete term "{currentShipmentTerm?.termName}"?</p>
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

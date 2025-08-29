import { DataTable } from "@/components/data/DataTable";
import { Modal } from "@/components/ui/Modal";
import { createGst, deleteGst, getAllGstMaster, updateGst } from "@/state/gstMasterSlice";
import { AppDispatch, RootState } from "@/state/store";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

interface GstData {
  id: number;
  gstName: string;
  cgstRate: string;
  sgstRate: string;
  igstRate: string;
  description: string;
  activeFlag: boolean;
}

interface GstFormData {
  id?: number | null;
  gstName: string;
  cgstRate: string;
  sgstRate: string;
  igstRate: string;
  description: string;
  activeFlag: boolean;
}

export function GstMaster() {
  const { gstList } = useSelector((state: RootState) => state.gst);
  const dispatch = useDispatch<AppDispatch>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentGst, setCurrentGst] = useState<GstData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // const { register, handleSubmit, reset, formState: { errors } } = useForm<GstFormData>();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields, isValid }
  } = useForm<GstFormData>({
    mode: 'onBlur', // Validate on blur
    reValidateMode: 'onBlur' // Re-validate on blur
  });

  useEffect(() => {
    dispatch(getAllGstMaster({}));
  }, [dispatch]);

  const columns = useMemo(() => [
    { Header: "ID", accessor: "id", Cell: ({ row }: { row: { index: number } }) => row.index + 1 },
    { Header: "Gst Name", accessor: "gstName" },
    { Header: "CGST Rate", accessor: "cgstRate" },
    { Header: "SGST Rate", accessor: "sgstRate" },
    { Header: "IGST Rate", accessor: "igstRate" },
    { Header: "Description", accessor: "description" },
    {
      Header: "Status",
      accessor: "activeFlag",
      Cell: ({ value }: { value: boolean }) => (
        <span className={`px-2 py-1 rounded-full text-xs ${value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{value ? "Active" : "Inactive"}</span>
      ),
    },
  ], []);

  const handleOpenModal = (editing = false, shipmentTerm: GstData | null = null) => {
    if (editing && shipmentTerm) {
      reset({ ...shipmentTerm });
      setCurrentGst(shipmentTerm);
    } else {
      reset({ id: null, gstName: "", description: "", activeFlag: true });
      setCurrentGst(null);
    }
    setIsEditing(editing);
    setIsModalOpen(true);
  };

  const handleDelete = (shipmentTerm: GstData) => {
    setCurrentGst(shipmentTerm);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!currentGst) return;
    await dispatch(deleteGst(currentGst.id));
    dispatch(getAllGstMaster({}));
    setIsDeleteModalOpen(false);
  };

  const onSubmit = async (data: GstFormData) => {
    if (isEditing) {
      await dispatch(updateGst(data));
    } else {
      await dispatch(createGst(data));
    }
    dispatch(getAllGstMaster({}));
    setIsModalOpen(false);
    reset();
  };

  // const handleView = (state: any) => {
  //   alert('hiii')
  //   setCurrentGst(state);
  //   setIsViewModalOpen(true);
  // };

  const handleView = (state: any) => {
    setCurrentGst(state);
    setIsViewModalOpen(true);
  };

  const handleEdit = (state: any) => {
    setIsEditing(true);
    setCurrentGst(state);
    reset({ id: state.id, gstName: state.gstName, cgstRate: state.sgstRate, sgstRate: state.igstRate, igstRate: state.cgstRate, description: state.description, activeFlag: state.activeFlag });
    setIsModalOpen(true);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">GST Management</h1>
      <DataTable
        columns={columns}
        data={gstList}
        title="GST Master"
        onAdd={() => handleOpenModal(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        showActions={true}
        filterPlaceholder="Search Gst..."
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? "Edit GST" : "Add GST"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">GST Name <span className="text-red-600">*</span> </label>
            <input {...register("gstName", { required: "Gst Name is required" })}
              placeholder="Enter Gst Name"
              className="input mt-1" />
            {errors.gstName && <p className="mt-1 text-sm text-red-600">{errors.gstName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">CGST Rate <span className="text-red-600">*</span> </label>
            <input {...register("cgstRate", { required: "CGST Rate is required" })}
              placeholder="Enter CGST Rate"
              className="input mt-1" />
            {errors.cgstRate && <p className="mt-1 text-sm text-red-600">{errors.cgstRate.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">SGST Rate <span className="text-red-600">*</span> </label>
            <input {...register("sgstRate", { required: "Gst Rate is required" })}
              placeholder="Enter SGST Rate"
              className="input mt-1" />
            {errors.sgstRate && <p className="mt-1 text-sm text-red-600">{errors.sgstRate.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">IGST Rate <span className="text-red-600">*</span> </label>
            <input {...register("igstRate", { required: "Gst Rate is required" })}
              placeholder="Enter IGST Rate"
              className="input mt-1" />
            {errors.igstRate && <p className="mt-1 text-sm text-red-600">{errors.igstRate.message}</p>}
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
            {/* <button type="submit" className="btn btn-primary">{isEditing ? "Edit GST" : "Add GST"}</button> */}
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
              {isEditing ? "Update GST" : "Add GST"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Delete">
        <div className="space-y-4">
          <p>Are you sure you want to delete UOM "{currentGst?.gstName}"?</p>
          <p className="text-red-600 text-sm">This action cannot be undone.</p>
          <div className="flex justify-end space-x-3 pt-4">
            <button onClick={() => setIsDeleteModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button onClick={confirmDelete} className="btn btn-danger">Delete</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="GST Details">
        {currentGst && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm">Gst Name</p>
                <p className="font-medium">{currentGst.gstName}</p>
              </div>
              <div>
                <p className="text-sm">Gst Rate</p>
                <p className="font-medium">{currentGst.cgstRate}</p>
              </div>
              <div>
                <p className="text-sm">Description</p>
                <p className="font-medium">{currentGst.description}</p>
              </div>
              <div>
                <p className="text-sm">Status</p>
                <p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${currentGst.activeFlag ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                  >
                    {currentGst.activeFlag ? "Active" : "Inactive"}
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

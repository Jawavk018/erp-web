import { DataTable } from "@/components/data/DataTable";
import { Modal } from "@/components/ui/Modal";
import { AppDispatch, RootState } from "@/state/store";
import { createUom, deleteUom, getAllUomMaster, updateUom } from "@/state/uomMasterSlice";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

interface UomData {
  id: number;
  uomName: string;
  uomCode: string;
  description: string;
  activeFlag: boolean;
}

interface UomFormData {
  id?: number | null;
  uomName: string;
  uomCode: string;
  description: string;
  activeFlag: boolean;
}

export function UomMaster() {
  const { uomList } = useSelector((state: RootState) => state.uom);
  const dispatch = useDispatch<AppDispatch>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentUom, setCurrentUom] = useState<UomData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // const { register, handleSubmit, reset, formState: { errors } } = useForm<UomFormData>();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields, isValid }
  } = useForm<UomFormData>({
    mode: 'onBlur', // Validate on blur
    reValidateMode: 'onBlur' // Re-validate on blur
  });

  useEffect(() => {
    dispatch(getAllUomMaster({}));
  }, [dispatch]);

  const columns = useMemo(() => [
    { Header: "ID", accessor: "id", Cell: ({ row }: { row: { index: number } }) => row.index + 1 },
    { Header: "UOM Name", accessor: "uomName" },
    { Header: "UOM Code", accessor: "uomCode" },
    { Header: "Description", accessor: "description" },
    {
      Header: "Status",
      accessor: "activeFlag",
      Cell: ({ value }: { value: boolean }) => (
        <span className={`px-2 py-1 rounded-full text-xs ${value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{value ? "Active" : "Inactive"}</span>
      ),
    },
  ], []);

  const handleOpenModal = (editing = false, shipmentTerm: UomData | null = null) => {
    if (editing && shipmentTerm) {
      reset({ ...shipmentTerm });
      setCurrentUom(shipmentTerm);
    } else {
      reset({ id: null, uomName: "", description: "", activeFlag: true });
      setCurrentUom(null);
    }
    setIsEditing(editing);
    setIsModalOpen(true);
  };

  const handleDelete = (shipmentTerm: UomData) => {
    setCurrentUom(shipmentTerm);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!currentUom) return;
    await dispatch(deleteUom(currentUom.id));
    dispatch(getAllUomMaster({}));
    setIsDeleteModalOpen(false);
  };

  const onSubmit = async (data: UomFormData) => {
    if (isEditing) {
      await dispatch(updateUom(data));
    } else {
      await dispatch(createUom(data));
    }
    dispatch(getAllUomMaster({}));
    setIsModalOpen(false);
    reset();
  };

  // const handleView = (state: any) => {
  //   alert('hiii')
  //   setCurrentUom(state);
  //   setIsViewModalOpen(true);
  // };

  const handleView = (state: any) => {
    setCurrentUom(state);
    setIsViewModalOpen(true);
  };

  const handleEdit = (state: any) => {
    setIsEditing(true);
    setCurrentUom(state);
    reset({ id: state.id, uomName: state.uomName, uomCode: state.uomCode, description: state.description, activeFlag: state.activeFlag });
    setIsModalOpen(true);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">UOM Management</h1>
      <DataTable
        columns={columns}
        data={uomList}
        title="Uom Master"
        onAdd={() => handleOpenModal(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        showActions={true}
        filterPlaceholder="Search Uom..."
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? "Edit UOM" : "Add UOM"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">UOM Name <span className="text-red-600">*</span> </label>
            <input {...register("uomName", { required: "UOM Name is required" })} className="input mt-1" />
            {errors.uomName && <p className="mt-1 text-sm text-red-600">{errors.uomName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">UOM Code <span className="text-red-600">*</span> </label>
            <input {...register("uomCode", { required: "UOM Code is required" })} className="input mt-1" />
            {errors.uomCode && <p className="mt-1 text-sm text-red-600">{errors.uomCode.message}</p>}
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
              {isEditing ? "Update UOM" : "Add UOM"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Delete">
        <div className="space-y-4">
          <p>Are you sure you want to delete UOM "{currentUom?.uomName}"?</p>
          <p className="text-red-600 text-sm">This action cannot be undone.</p>
          <div className="flex justify-end space-x-3 pt-4">
            <button onClick={() => setIsDeleteModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button onClick={confirmDelete} className="btn btn-danger">Delete</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="UOM Details">
        {currentUom && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm">UOM Name</p>
                <p className="font-medium">{currentUom.uomName}</p>
              </div>
              <div>
                <p className="text-sm">UOM Code</p>
                <p className="font-medium">{currentUom.uomCode}</p>
              </div>
              <div>
                <p className="text-sm">Description</p>
                <p className="font-medium">{currentUom.description}</p>
              </div>
              <div>
                <p className="text-sm">Status</p>
                <p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${currentUom.activeFlag ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                  >
                    {currentUom.activeFlag ? "Active" : "Inactive"}
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

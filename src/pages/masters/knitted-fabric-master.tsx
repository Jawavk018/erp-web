import { useEffect, useMemo, useState } from "react";
import { Edit, Trash, Eye, Plus } from 'lucide-react';
import { Modal } from "@/components/ui/Modal";
import { DataTable } from "@/components/data/DataTable";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { getAllFabricTypes } from "@/state/fabricTypeSlice";
import { getAllSubCategories, getSubCategoryByCategory } from "@/state/subCategorySlice";
import { getAllYarnMasters } from "@/state/yarnSlice";
import React from "react";
import { getAllFabricCategory } from "@/state/fabricCategorySlice";
import { createKnittedFabricMasters, deleteKnittedFabricMasters, getAllKnittedFabricMasters, updateKnittedFabricMasters } from "@/state/knittedMasterSlice";

interface fabricFormData {
  id?: number,
  knittedFabricId: string,
  fabricCategoryId: string,
  fabricType: string,
  fabricCode: string,
  fabricName: string,
  gsm: string,
  width: string,
  composition: string,
  shrinkage: string,
  remarks: string,
}

export default function KnittedFabricMaster() {

  const { fabricTypeList } = useSelector((state: RootState) => state.fabricType);
  const { fabricCategoryList } = useSelector((state: RootState) => state.fabricCategoty);
  const { fabricMasterDetailList } = useSelector((state: RootState) => state.fabricMaster);
  const { knittedknittedFabricMasterList } = useSelector((state: RootState) => state.knittedMasters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentfabric, setCurrentfabric] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [fabric, setFabric] = useState(knittedknittedFabricMasterList);
  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = React.useState(false);

  useEffect(() => {
    dispatch(getAllFabricTypes({}));
    dispatch(getAllSubCategories({}));
    dispatch(getAllYarnMasters({}));
    dispatch(getAllKnittedFabricMasters({}))
    dispatch(getAllFabricCategory({}));

  }, [dispatch]);

  useEffect(() => {
    setFabric(knittedknittedFabricMasterList)
  }, [knittedknittedFabricMasterList]);

  // const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<fabricFormData>();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, touchedFields, isValid }
  } = useForm<fabricFormData>({
    mode: 'onBlur', // Validate on blur
    reValidateMode: 'onBlur' // Re-validate on blur
  });

  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        Cell: ({ row }: { row: { index: number } }) => row.index + 1
      },
      {
        Header: 'Fabric Name',
        accessor: 'fabricName',
      },
      {
        Header: 'Fabric Code',
        accessor: 'fabricCode',
      },
      {
        Header: 'Width',
        accessor: 'width',
      },
      {
        Header: 'Composition',
        accessor: 'composition',
      },
      {
        Header: 'Shrinkage',
        accessor: 'shrinkage',
      },
    ],
    []
  );


  const handleAdd = () => {
    setModalMode('add');
    setCurrentfabric(null);
    reset({
      fabricType: '',
      fabricCode: '',
      fabricName: '',
      gsm: '',
      width: '',
      composition: '',
      shrinkage: '',
      remarks: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (fabric: any) => {
    setModalMode('edit');
    setCurrentfabric(fabric);

    // Reset form with all fabric properties
    reset({
      id: fabric.id,
      fabricType: fabric.fabricType,
      knittedFabricId: fabric.knittedFabricId,
      fabricCategoryId: fabric.fabricCategoryId,
      fabricCode: fabric.fabricCode,
      fabricName: fabric.fabricName,
      gsm: fabric.gsm,
      width: fabric.width,
      composition: fabric.composition,
      shrinkage: fabric.shrinkage,
      remarks: fabric.remarks,
    });

    setIsModalOpen(true);
  };

  const handleDelete = (fabric: any) => {
    setCurrentfabric(fabric);
    setIsDeleteModalOpen(true);
  };

  const handleView = (fabric: any) => {
    setCurrentfabric(fabric);
    setIsViewModalOpen(true);
  };

  const onSubmit = async (data: fabricFormData) => {
    try {
      console.log('Form data submitted:', data); // Add this to debug

      if (modalMode === 'edit') {
        await dispatch(updateKnittedFabricMasters({
          ...data,
        }));
      } else {
        const { id, ...newFabricMasterData } = data;
        await dispatch(createKnittedFabricMasters({
          ...newFabricMasterData,
        }));
      }
      await dispatch(getAllKnittedFabricMasters({}));
      setIsModalOpen(false);
      reset();
      setModalMode('add');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // const confirmDelete = () => {
  //   setFabric(fabric.filter((c: any) => c.id !== currentfabric.id));
  //   setIsDeleteModalOpen(false);
  // };
  const confirmDelete = async () => {
    if (!currentfabric) return;

    try {
      await dispatch(deleteKnittedFabricMasters(currentfabric.id)).unwrap();
      await dispatch(getAllKnittedFabricMasters({}));
    } catch (error) {
      console.error("Error deleting fabric:", error);
    }

    setIsDeleteModalOpen(false);
  };


  function closePopup(): void {
    throw new Error("Function not implemented.");
  }

  const handleFilterChange = (filter: number) => {
    // Implement filter logic here
    const filteredData = knittedknittedFabricMasterList.filter((fabric: any) => {
      if (filter === 1) {
        return fabric.fabricType === 1;
      } else if (filter === 2) {
        return fabric.fabricType === 2;
      } else if (filter === 3) {
        return fabric.fabricType === 3;
      }
      return true; // Return all if no filter is applied
    });
    // Update the fabric state with the filtered data
    setFabric(filteredData);
  };

  const [selectedFilter, setSelectedFilter] = useState("all");

  const filterOptions = [
    { label: "All", value: "all" },
    { label: "Greige", value: 1 },
    { label: "Finished", value: 2 },
    { label: "Finished Shade", value: 3 },
  ];

  const handleClick = (value: any) => {
    setSelectedFilter(value);
    handleFilterChange(value);
  };

  const [selectedFabricType, setSelectedFabricType] = useState<string>('1');
  const [selectedGreige, setSelectedGreige] = useState<string>('');
  const [selectedFinished, setSelectedFinished] = useState<string>('');

  const handleFabricTypeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedFabricType(value);
    setValue('fabricType', value);
    setSelectedGreige('');
    setSelectedFinished('');

    // Convert to number if needed
    const numericValue = parseInt(value, 10);

    if (numericValue === 1 || numericValue === 2 || numericValue === 3) {
      await dispatch(getAllKnittedFabricMasters({ id: numericValue }));
    }
  };

  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter Fabric Type
        </label>
        <div className="flex space-x-2 flex-wrap">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleClick(option.value)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition 
              ${selectedFilter === option.value
                  ? "bg-blue-600 text-white border-blue-600 shadow"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <DataTable
        columns={columns}
        data={fabric}
        title="Knitted Fabric Master"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        showActions={true}
        filterPlaceholder="Search fabric..."
      />
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center flex justify-end z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 shadow-lg w-3/4 h-full  max-h-full overflow-y-auto ">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 flex justify-between ">
              {modalMode === 'add' ? "Add Knitted Fabric" : "Update Knitted Fabric"}
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" onClick={() => setIsModalOpen(false)} className="bi bi-x cursor-pointer" viewBox="0 0 16 16">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
              </svg>
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="p-6 bg-white shadow rounded-lg">
                {/* Fabric Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block">Fabric Type <span className="text-red-600">*</span>
                    </label>
                    <select
                      {...register("fabricType", {
                        required: "Fabric Type is required"
                      })}
                      className="input mt-1"
                      onChange={(e: any) => {
                        handleFabricTypeChange(e); // call your function
                      }}
                    >
                      <option value="">Select a Fabric Type</option>
                      {fabricTypeList?.map((fabricType: any) => (
                        <option key={fabricType.id} value={fabricType.id}>
                          {fabricType.fabricTypeName}
                        </option>
                      ))}
                    </select>
                    {errors.fabricType && <p className="text-red-500 text-sm">{errors.fabricType.message}</p>}
                  </div>

                  {selectedFabricType === '2' && (
                    <div>
                      <label className="block">Select Greige</label>
                      <select
                        {...register("knittedFabricId")}
                        value={selectedGreige}
                        onChange={(e) => setSelectedGreige(e.target.value)}
                        className="input mt-1"
                      >
                        <option value="">Select Greige</option>
                        {fabricMasterDetailList?.map((item: any) => (
                          <option key={item.id} value={item.id}> {item.fabric_name} ({item.fabric_code})</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedFabricType === '3' && (
                    <div>
                      <label className="block">Select Finished</label>
                      <select
                        {...register("knittedFabricId")}
                        value={selectedFinished}
                        onChange={(e) => setSelectedFinished(e.target.value)}
                        className="input mt-1"
                      >
                        <option value="">Select Finished</option>
                        {fabricMasterDetailList?.map((item: any) => (
                          <option key={item.id} value={item.id}> {item.fabric_name} ({item.fabric_code})</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block">Fabric Category <span className="text-red-600">*</span>
                    </label>
                    <select {...register("fabricCategoryId", {
                      required: "Fabric Category is required"
                    })} className="input mt-1">
                      <option value="">Select a Fabric Category</option>
                      {fabricCategoryList?.map((fabricCategory: any) => (
                        <option key={fabricCategory.id} value={fabricCategory.id}>{fabricCategory.fabricCategoryName}</option>
                      ))}
                    </select>
                    {errors.fabricCategoryId && <p className="text-red-500 text-sm">{errors.fabricCategoryId.message}</p>}
                  </div>
                  <div>
                    <label className="block">Fabric Code <span className="text-red-600">*</span>
                    </label>
                    <input {...register("fabricCode", { required: "Fabric Code is required" })} className="input mt-1" />
                    {errors.fabricCode && <p className="text-red-500 text-sm">{errors.fabricCode.message}</p>}
                  </div>
                  <div>
                    <label className="block">Fabric Name <span className="text-red-600">*</span>
                    </label>
                    <input {...register("fabricName", { required: "Fabric Name is required" })} className="input mt-1" />
                    {errors.fabricName && <p className="text-red-500 text-sm">{errors.fabricName.message}</p>}
                  </div>
                  <div>
                    <label className="block">GSM <span className="text-red-600">*</span>
                    </label>
                    <input {...register("gsm", { required: "GSM is required" })} className="input mt-1" />
                    {errors.gsm && <p className="text-red-500 text-sm">{errors.gsm.message}</p>}
                  </div>
                  <div>
                    <label className="block">Width <span className="text-red-600">*</span>
                    </label>
                    <input {...register("width", { required: "Width is required" })} className="input mt-1" />
                    {errors.width && <p className="text-red-500 text-sm">{errors.width.message}</p>}
                  </div>
                  <div>
                    <label className="block">Composition <span className="text-red-600">*</span>
                    </label>
                    <input {...register("composition", { required: "Composition is required" })} className="input mt-1" />
                    {errors.composition && <p className="text-red-500 text-sm">{errors.composition.message}</p>}
                  </div>
                  <div>
                    <label className="block">Shrinkage % <span className="text-red-600">*</span>
                    </label>
                    <input {...register("shrinkage", { required: "Shrinkage is required" })} className="input mt-1" />
                    {errors.shrinkage && <p className="text-red-500 text-sm">{errors.shrinkage.message}</p>}
                  </div>
                  <div>
                    <label className="block">Remarks</label>
                    <input {...register("remarks")} className="input mt-1" />
                  </div>
                </div>
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
                  {modalMode === 'add' ? 'Add Knitted Fabric' : 'Update Knitted Fabric'}
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
                  {modalMode === 'edit' ? "Update Knitted Fabric" : "Add Knitted Fabric"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Fabric Details"
      >
        {currentfabric && (
          <div className="space-y-4">
            {/* Image + Name, Mobile, Email Section */}
            <div className="flex gap-6 items-center">
              {/* Left: Image */}
              {currentfabric.imageUrl && (
                <img
                  src={currentfabric.imageUrl}
                  alt={currentfabric.name}
                  className="w-32 h-32 object-cover rounded-lg shadow"
                />
              )}

              {/* Right: Name, Mobile No, Email */}
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-secondary-500 font-medium">
                    Fabric Name: <span className="text-md font-bold text-gray-900">{currentfabric.fabricType}</span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-secondary-500 font-medium">
                    Fabric Code: <span className="text-md font-bold text-gray-900">{currentfabric.fabricCode}</span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-secondary-500 font-medium">
                    Fabric Name: <span className="text-md font-bold text-gray-900">{currentfabric.fabricName}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Other Details */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div>
                <p className="text-sm text-secondary-500">Weave</p>
                <p className="font-medium">{currentfabric.weave}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Fabric Quality</p>
                <p className="font-medium">{currentfabric.quality}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">UOM</p>
                <p className="font-medium">{currentfabric.uom}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">EPI</p>
                <p className="font-medium">{currentfabric.epi}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">PPI</p>
                <p className="font-medium">{currentfabric.ppi}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">PPI</p>
                <p className="font-medium">{currentfabric.ppi}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Greige Code</p>
                <p className="font-medium">{currentfabric.greigeCode}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Total Ends</p>
                <p className="font-medium">{currentfabric.totalEnds}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">GSM</p>
                <p className="font-medium">{currentfabric.gsm}</p>
              </div>

            </div>
            {/* Close Button */}
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
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Delete">
        <div className="space-y-4">
          <p>Are you sure you want to delete Knitted Fabric?</p>
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



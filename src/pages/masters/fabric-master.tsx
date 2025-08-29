import { useEffect, useMemo, useState } from "react";
import { Edit, Trash, Eye, Plus } from 'lucide-react';
import { Modal } from "@/components/ui/Modal";
import { DataTable } from "@/components/data/DataTable";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { createFabricMaster, deleteFabricMaster, getAllFabricMasterDetails, getAllFabricMasters, updateFabricMaster } from "@/state/fabricMasterSlice";
import { getAllProductCategory } from "@/state/productCategorySlice";
import { getAllFabricTypes } from "@/state/fabricTypeSlice";
import { getAllSubCategories, getSubCategoryByCategory } from "@/state/subCategorySlice";
import { getAllYarnMasters } from "@/state/yarnSlice";
import React from "react";
import { getAllUomMaster } from "@/state/uomMasterSlice";
import { getAllFabricCategory } from "@/state/fabricCategorySlice";
import { json } from "stream/consumers";

interface fabricFormData {
  id?: number,
  wovenFabricId: string,
  fabricCategoryId: string,
  fabricType: string,
  fabricCode: string,
  fabricName: string,
  content: string,
  contentName: string,
  weave: string,
  fabricQuality: string,
  uom: string,
  epi: string,
  ppi: string,
  greigeCode: string,
  totalEnds: string,
  gsm: string,
  glm: string,
  igst: string,
  cgst: string,
  sgst: string,
  status: string,
  imageUrl: string,
  stdValue: string,
  warpDetails: WarpDetail[],
  weftDetails: WeftDetail[]
}

interface WarpDetail {
  id: number;
  yarnId: string;
  color: string;
  shrinkagePercent: string;
  gramsPerMeter: string;
}

interface WeftDetail {
  id: number;
  yarnId: string;
  color: string;
  shrinkagePercent: string;
  gramsPerMeter: string;
}

export default function WovenFabricMaster() {

  const { uomList } = useSelector((state: RootState) => state.uom);
  const { productCategoryList } = useSelector((state: RootState) => state.productCategory);
  const { fabricTypeList } = useSelector((state: RootState) => state.fabricType);
  const { fabricCategoryList } = useSelector((state: RootState) => state.fabricCategoty);
  const { fabricMasterDetailList } = useSelector((state: RootState) => state.fabricMaster);
  const { subCategoryList } = useSelector((state: RootState) => state.subCategory);
  const { yarnList } = useSelector((state: RootState) => state.yarn);
  const { fabricMasterList } = useSelector((state: RootState) => state.fabricMaster);
  const [warpDetails, setWarpDetails] = useState<WarpDetail[]>([]);
  const [weftDetails, setWeftDetails] = useState<WeftDetail[]>([]);
  const [fabricImage, setFabricImage]: any = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentfabric, setCurrentfabric] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [fabric, setFabric] = useState(fabricMasterList);
  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = React.useState(false);
  const { subCategoryByCategoryList } = useSelector((state: RootState) => state.subCategory);

  useEffect(() => {
    dispatch(getAllProductCategory({}));
    dispatch(getAllUomMaster({}));
    dispatch(getAllFabricTypes({}));
    dispatch(getAllSubCategories({}));
    dispatch(getAllYarnMasters({}));
    dispatch(getSubCategoryByCategory("Weave"));
    dispatch(getAllFabricMasters({}))
    dispatch(getAllFabricCategory({}));

  }, [dispatch]);

  useEffect(() => {
    setFabric(fabricMasterList)
  }, [fabricMasterList]);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<fabricFormData>();

  const handleAddWarp = () => {
    setWarpDetails([...warpDetails, { id: warpDetails.length + 1, yarnId: "", color: "", shrinkagePercent: "", gramsPerMeter: "" }]);
  };

  const handleAddWeft = () => {
    setWeftDetails([...weftDetails, { id: weftDetails.length + 1, yarnId: "", color: "", shrinkagePercent: "", gramsPerMeter: "" }]);
  };

  const handleDeleteWarp = (id: any) => {
    setWarpDetails(warpDetails.filter((item: any) => item.id !== id));
  };

  const handleDeleteWeft = (id: any) => {
    setWeftDetails(weftDetails.filter((item: any) => item.id !== id));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFabricImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
        Header: 'Greige Code',
        accessor: 'greigeCode',
      },
      {
        Header: 'Quality',
        accessor: 'fabricQuality',
      },
      {
        Header: 'UOM',
        accessor: 'uom',
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
      content: '',
      wovenFabricId: '',
      fabricCategoryId: '',
      weave: '',
      fabricQuality: '',
      uom: '',
      epi: '',
      ppi: '',
      greigeCode: '',
      totalEnds: '',
      gsm: '',
      glm: '',
      igst: '',
      cgst: '',
      sgst: '',
      imageUrl: '',
      warpDetails: [],
      weftDetails: [],
      status: 'Active',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (fabric: any) => {
    console.log('fabricdetails', fabric)
    setModalMode('edit');
    setCurrentfabric(fabric);

    // Set the image URL
    setFabricImage(fabric.imageUrl);

    // Set warp and weft details if they exist
    if (fabric.warpDetails && Array.isArray(fabric.warpDetails)) {
      setWarpDetails([...fabric.warpDetails]);
    } else {
      setWarpDetails([]);
    }

    if (fabric.weftDetails && Array.isArray(fabric.weftDetails)) {
      setWeftDetails([...fabric.weftDetails]);
    } else {
      setWeftDetails([]);
    }

    // Reset form with all fabric properties
    reset({
      id: fabric.id,
      fabricType: fabric.fabricType,
      wovenFabricId: fabric.wovenFabricId,
      fabricCategoryId: fabric.fabricCategoryId,
      fabricCode: fabric.fabricCode,
      fabricName: fabric.fabricName,
      content: fabric.content,
      weave: fabric.weave,
      fabricQuality: fabric.fabricQuality,
      uom: fabric.uom,
      epi: fabric.epi,
      ppi: fabric.ppi,
      greigeCode: fabric.greigeCode,
      totalEnds: fabric.totalEnds,
      gsm: fabric.gsm,
      glm: fabric.glm,
      igst: fabric.igst,
      cgst: fabric.cgst,
      sgst: fabric.sgst,
      status: fabric.status,
      imageUrl: fabric.imageUrl,
      warpDetails: fabric.warpDetails || [],
      weftDetails: fabric.weftDetails || []
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
        await dispatch(updateFabricMaster({
          ...data,
          imageUrl: fabricImage,
          warpDetails: warpDetails,
          weftDetails: weftDetails
        }));
      } else {
        const { id, ...newFabricMasterData } = data;
        await dispatch(createFabricMaster({
          ...newFabricMasterData,
          warpDetails: warpDetails,
          weftDetails: weftDetails
        }));
      }
      await dispatch(getAllFabricMasters({}));
      setIsModalOpen(false);
      reset();
      setWarpDetails([]);
      setWeftDetails([]);
      setFabricImage(null);
      // setCurrentfabric(null);
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
      await dispatch(deleteFabricMaster(currentfabric.id)).unwrap();
      await dispatch(getAllFabricMasters({}));
    } catch (error) {
      console.error("Error deleting Fabric:", error);
    }

    setIsDeleteModalOpen(false);
  };

  function closePopup(): void {
    throw new Error("Function not implemented.");
  }

  const handleFilterChange = (filter: number) => {
    // Implement filter logic here
    const filteredData = fabricMasterList.filter((fabric: any) => {
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
      await dispatch(getAllFabricMasterDetails({ id: numericValue }));
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
        title="Woven Fabric Master"
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
              {modalMode === 'add' ? "Add Woven Fabric" : "Update Woven Fabric"}
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" onClick={() => setIsModalOpen(false)} className="bi bi-x cursor-pointer" viewBox="0 0 16 16">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
              </svg>
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="p-6 bg-white shadow rounded-lg">
                {/* Fabric Details */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block">Fabric Type</label>
                    <select
                      {...register("fabricType")}
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
                  </div>

                  {selectedFabricType === '2' && (
                    <div>
                      <label className="block">Select Greige</label>
                      <select
                        {...register("wovenFabricId")}
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
                        {...register("wovenFabricId")}
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
                    <label className="block">Fabric Category</label>
                    <select {...register("fabricCategoryId")} className="input mt-1">
                      <option value="">Select a Fabric Category</option>
                      {fabricCategoryList?.map((fabricCategory: any) => (
                        <option key={fabricCategory.id} value={fabricCategory.id}>{fabricCategory.fabricCategoryName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block">Fabric Code </label>
                    <input {...register("fabricCode", { required: "Fabric Code is required" })}
                      placeholder="Enter Fabric Code"
                      className="input mt-1" />
                    {errors.fabricCode && <p className="text-red-500 text-sm">{errors.fabricCode.message}</p>}
                  </div>
                  <div>
                    <label className="block">Fabric Name</label>
                    <input {...register("fabricName", { required: "Fabric Name is required" })}
                      placeholder="Enter Fabric Name"
                      className="input mt-1" />
                    {errors.fabricName && <p className="text-red-500 text-sm">{errors.fabricName.message}</p>}
                  </div>
                  <div>
                    <label className="block">Content</label>
                    <input {...register("content")} placeholder="Enter Content" className="input mt-1" />
                  </div>
                  <div>
                    <label className="block">Weave</label>
                    <select {...register("weave", { required: "Weave is required" })} className="input mt-1">
                      <option value="">Select a Weave</option>
                      {subCategoryByCategoryList.map((weaveType: any) => (
                        <option key={weaveType.id} value={weaveType.id}>{weaveType.subCategoryName}</option>
                      ))}
                    </select>
                    {errors.weave && <p className="mt-1 text-sm text-red-600">{errors.weave.message}</p>}
                  </div>
                  <div>
                    <label className="block">Fabric Quality</label>
                    <input {...register("fabricQuality", { required: "Fabric Quality is required" })}
                      placeholder="Enter Fabric Quality"
                      className="input mt-1" />
                    {errors.fabricQuality && <p className="text-red-500 text-sm">{errors.fabricQuality.message}</p>}
                  </div>
                  <div>
                    <label className="block">UOM</label>
                    <select {...register("uom", { required: "Uom is required" })} className="input mt-1">
                      <option value="">Select a Uom Type</option>
                      {uomList?.map((uom: any) => (
                        <option key={uom.id} value={uom.id}>{uom.uomName}</option>
                      ))}
                    </select>
                    {errors.fabricType && <p className="mt-1 text-sm text-red-600">{errors.fabricType.message}</p>}
                  </div>
                  <div>
                    <label className="block">EPI</label>
                    <input {...register("epi", { required: "EPI is required" })}
                      placeholder="Enter EPI"
                      className="input mt-1" />
                    {errors.epi && <p className="text-red-500 text-sm">{errors.epi.message}</p>}
                  </div>
                  <div>
                    <label className="block">PPI</label>
                    <input {...register("ppi", { required: "PPI is required" })}
                      placeholder="Enter PPI"
                      className="input mt-1" />
                    {errors.ppi && <p className="text-red-500 text-sm">{errors.ppi.message}</p>}
                  </div>
                  <div>
                    <label className="block">Greige Code</label>
                    <input {...register("greigeCode", { required: "Greige Code is required" })}
                      placeholder="Enter Greige Code"
                      className="input mt-1" />
                    {errors.greigeCode && <p className="text-red-500 text-sm">{errors.greigeCode.message}</p>}
                  </div>
                  <div>
                    <label className="block">Total Ends</label>
                    <input {...register("totalEnds", { required: "Total Ends is required" })}
                      placeholder="Enter Total Ends"
                      className="input mt-1" />
                    {errors.totalEnds && <p className="text-red-500 text-sm">{errors.totalEnds.message}</p>}
                  </div>
                  <div>
                    <label className="block">GSM</label>
                    <input {...register("gsm", { required: "GSM is required" })}
                      placeholder="Enter Gsm"
                      className="input mt-1" />
                    {errors.gsm && <p className="text-red-500 text-sm">{errors.gsm.message}</p>}
                  </div>
                  <div>
                    <label className="block">GLM</label>
                    <input {...register("glm", { required: "GLM is required" })}
                      placeholder="Enter Glm"
                      className="input mt-1" />
                    {errors.glm && <p className="text-red-500 text-sm">{errors.glm.message}</p>}
                  </div>
                  <div>
                    <label className="block">IGST</label>
                    <input {...register("igst", { required: "IGST is required" })}
                      placeholder="Enter Igst"
                      className="input mt-1" />
                    {errors.igst && <p className="text-red-500 text-sm">{errors.igst.message}</p>}
                  </div>
                  <div>
                    <label className="block">CGST</label>
                    <input {...register("cgst", { required: "CGST is required" })}
                      placeholder="Enter Cgst"
                      className="input mt-1" />
                    {errors.cgst && <p className="text-red-500 text-sm">{errors.cgst.message}</p>}
                  </div>
                  <div>
                    <label className="block">SGST</label>
                    <input {...register("sgst", { required: "SGST is required" })}
                      placeholder="Enter Sgst"
                      className="input mt-1" />
                    {errors.sgst && <p className="text-red-500 text-sm">{errors.sgst.message}</p>}
                  </div>
                  <div>
                    <label className="block">Testing Requirements (STD Value)</label>
                    <input {...register("stdValue")}
                      placeholder="Enter Std Value"
                      className="input mt-1" />
                    {/* {errors.sgst && <p className="text-red-500 text-sm">{errors.sgst.message}</p>} */}
                  </div>
                </div>

                {/* Warp Details */}
                <div className="mt-10">
                  <h3 className="font-semibold">Warp Details
                    <button type="button"
                      onClick={handleAddWarp} className="ml-2 bg-blue-500 text-white px-2 py-1 rounded">
                      + Add Warp
                    </button>
                  </h3>
                  <table className="w-full border mt-4">
                    <thead>
                      <tr className="bg-gray-200">
                        <th>SL.NO</th><th>Yarn</th><th>Color</th><th>Shrinkage %</th><th>Grams/Mtr</th><th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {warpDetails.map((item, index) => (
                        <tr key={item.id} className="border">
                          <td className="p-2">{index + 1}</td>
                          <td className="p-2">
                            <select
                              value={item.yarnId}
                              onChange={e => {
                                const updated = [...warpDetails];
                                updated[index].yarnId = e.target.value;
                                setWarpDetails(updated);
                              }}
                              className="input mt-1"
                            >
                              <option value="">Select a Yarn</option>
                              {yarnList.map((yarn: any) => (
                                <option key={yarn.id} value={yarn.id}>{yarn.yarnName}</option>
                              ))}
                            </select>
                          </td>
                          <td className="p-2">
                            <select
                              value={item.color}
                              onChange={e => {
                                const updated = [...warpDetails];
                                updated[index].color = e.target.value;
                                setWarpDetails(updated);
                              }}
                              className="input mt-1"
                            >
                              <option value="">Select a Color</option>
                              {subCategoryList.map((color: any) => (
                                <option key={color.id} value={color.id}>{color.subCategoryName}</option>
                              ))}
                            </select>
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.shrinkagePercent}
                              onChange={e => {
                                const updated = [...warpDetails];
                                updated[index].shrinkagePercent = e.target.value;
                                setWarpDetails(updated);
                              }}
                              className="border p-1 w-full"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.gramsPerMeter}
                              onChange={e => {
                                const updated = [...warpDetails];
                                updated[index].gramsPerMeter = e.target.value;
                                setWarpDetails(updated);
                              }}
                              className="border p-1 w-full"
                            />
                          </td>
                          <td className="p-2">
                            <Trash className="text-red-500 cursor-pointer" onClick={() => handleDeleteWarp(item.id)} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Weft Details */}
                <div className="mt-10">
                  <h3 className="font-semibold">Weft Details
                    <button type="button"
                      onClick={handleAddWeft} className="ml-2 bg-blue-500 text-white px-2 py-1 rounded">
                      + Add Weft
                    </button>
                  </h3>
                  <table className="w-full border mt-4">
                    <thead>
                      <tr className="bg-gray-200">
                        <th>SL.NO</th><th>Yarn</th><th>Color</th><th>Shrinkage %</th><th>Grams/Mtr</th><th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {weftDetails.map((item, index) => (
                        <tr key={item.id} className="border">
                          <td className="p-2">{index + 1}</td>
                          <td className="p-2">
                            <select
                              value={item.yarnId}
                              onChange={e => {
                                const updated = [...weftDetails];
                                updated[index].yarnId = e.target.value;
                                setWeftDetails(updated);
                              }}
                              className="input mt-1"
                            >
                              <option value="">Select a Yarn</option>
                              {yarnList.map((yarn: any) => (
                                <option key={yarn.id} value={yarn.id}>{yarn.yarnName}</option>
                              ))}
                            </select>
                          </td>
                          <td className="p-2">
                            <select
                              value={item.color}
                              onChange={e => {
                                const updated = [...weftDetails];
                                updated[index].color = e.target.value;
                                setWeftDetails(updated);
                              }}
                              className="input mt-1"
                            >
                              <option value="">Select a Color</option>
                              {subCategoryList.map((color: any) => (
                                <option key={color.id} value={color.id}>{color.subCategoryName}</option>
                              ))}
                            </select>
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.shrinkagePercent}
                              onChange={e => {
                                const updated = [...weftDetails];
                                updated[index].shrinkagePercent = e.target.value;
                                setWeftDetails(updated);
                              }}
                              className="border p-1 w-full"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.gramsPerMeter}
                              onChange={e => {
                                const updated = [...weftDetails];
                                updated[index].gramsPerMeter = e.target.value;
                                setWeftDetails(updated);
                              }}
                              className="border p-1 w-full"
                            />
                          </td>
                          <td className="p-2">
                            <Trash className="text-red-500 cursor-pointer" onClick={() => handleDeleteWarp(item.id)} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                <button type="submit" className="btn btn-primary">
                  {modalMode === 'add' ? 'Add Woven Fabric' : 'Update Woven Fabric'}
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
              <div>
                <p className="text-sm text-secondary-500">GLM</p>
                <p className="font-medium">{currentfabric.glm}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">IGST</p>
                <p className="font-medium">{currentfabric.igst}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">CGST</p>
                <p className="font-medium">{currentfabric.cgst}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">SGST</p>
                <p className="font-medium">{currentfabric.sgst}</p>
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete Fabric?</p>

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
    </div>
  );
}



import React, { useEffect, useState } from "react";
import { FileText, ShoppingCart, ClipboardList, Edit, Trash2, Save, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { getAllProductCategory } from "@/state/productCategorySlice";
import { getAllVendors } from "@/state/vendorSlice";
import { getAllSalesOrders } from "@/state/salesOrderSlice";
import { getAllConsignee } from "@/state/consigneeSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { createDyeingWorkOrder, updateDyeingWorkOrder } from "@/state/processContractSlice";
import { getAllUomMaster } from "@/state/uomMasterSlice";
import { getAllFinishFabric } from "@/state/finishMasterSlice";
import { getAllFabricMasters } from "@/state/fabricMasterSlice";
import { getSubCategoryByCategory } from "@/state/subCategorySlice";
import { toast } from "react-toastify";
import { getAllYarnMasters } from "@/state/yarnSlice";

interface dyeingDtl {
  id?: number;
  finishedFabricCodeId: string;
  finishedFabricName: string;
  greigeFabricCodeId: string;
  greigeFabricName: string;
  quantity: string;
  costPerPound: string;
  totalAmount: string;
  colorId: string;
  pantone: string;
  finishedWeight: string;
  greigeWidth: string;
  reqFinishedWidth: string;
  uomId: string;
  remarks: string;
  activeFlag: boolean;
}

interface PurchaseOrderFormData {
  id?: number | null;
  processContractDate: string;
  vendorId: string;
  totalAmount: string;
  expectedDeliveryDate: string;
  salesOrderId: string;
  consigneeId: string;
  labDipStatusId: string;
  firstYardageId: string;
  instructions: string;
  activeFlag: boolean;
  dyeingDtl: dyeingDtl[];
}

export function ProcessContractYarnEntry() {
  const { productCategoryList } = useSelector((state: RootState) => state.productCategory);
  const { vendorList } = useSelector((state: RootState) => state.vendor);
  const { consigneeList } = useSelector((state: RootState) => state.consignee);
  const { salesOrderList } = useSelector((state: RootState) => state.salesOrder);
  const { uomList } = useSelector((state: RootState) => state.uom);
  const { finishFabricList } = useSelector((state: RootState) => state.finishFabric);
  const { fabricMasterList } = useSelector((state: RootState) => state.fabricMaster);
  const { yarnList } = useSelector((state: RootState) => state.yarn);

  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();
  const dyeingWorkOrderDtl = location.state?.order;
  const isEdit = !!dyeingWorkOrderDtl;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid: isFormValid },
    watch,
    trigger
  } = useForm<PurchaseOrderFormData>({
    mode: 'onChange',
    defaultValues: {
      activeFlag: true
    }
  });

  const [dyeingDtl, setDyeingDtl] = useState<dyeingDtl[]>(dyeingWorkOrderDtl?.items || []);
  const [newItem, setNewItem] = useState<Partial<dyeingDtl>>({});
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("orderDetails");
  const { subCategoryByCategoryList } = useSelector((state: RootState) => state.subCategory);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if form is ready to be submitted
  const isSubmitDisabled = !isFormValid || dyeingDtl.length === 0 || isSubmitting;

  useEffect(() => {
    dispatch(getAllVendors({}));
    dispatch(getAllProductCategory({}));
    dispatch(getAllSalesOrders({}));
    dispatch(getAllConsignee({}));
    dispatch(getAllUomMaster({}));
    dispatch(getAllFinishFabric({}));
    dispatch(getAllFabricMasters({}));
    dispatch(getAllYarnMasters({}));
    dispatch(getSubCategoryByCategory("Colour"));
  }, [dispatch]);

  useEffect(() => {
    if (isEdit && dyeingWorkOrderDtl) {
      reset({
        processContractDate: dyeingWorkOrderDtl.processContactDate,
        expectedDeliveryDate: dyeingWorkOrderDtl.deliveryDate,
        vendorId: dyeingWorkOrderDtl.vendorId?.toString(),
        salesOrderId: dyeingWorkOrderDtl.salesOrderNo?.toString(),
        consigneeId: dyeingWorkOrderDtl.consigneeId?.toString(),
        labDipStatusId: dyeingWorkOrderDtl.lapDipStatusId?.toString(),
        firstYardageId: dyeingWorkOrderDtl.firstYardageId?.toString(),
        totalAmount: dyeingWorkOrderDtl.totalAmount?.toString(),
        instructions: dyeingWorkOrderDtl.remarks,
        activeFlag: dyeingWorkOrderDtl.activeFlag,
      });
      setDyeingDtl(dyeingWorkOrderDtl.items || []);
    }
  }, [isEdit, dyeingWorkOrderDtl, reset]);

  const validateItem = (item: Partial<dyeingDtl>): boolean => {
    return !!(
      item.finishedFabricCodeId &&
      item.greigeFabricCodeId &&
      item.quantity &&
      Number(item.quantity) > 0 &&
      item.costPerPound &&
      Number(item.costPerPound) > 0 &&
      item.colorId
    );
  };

  const addItem = () => {
    if (!validateItem(newItem)) {
      toast.error("Please fill all required item fields with valid values");
      return;
    }

    const itemToAdd = {
      ...newItem,
      totalAmount: (Number(newItem.quantity || 0) * Number(newItem.costPerPound || 0)).toString(),
      activeFlag: true
    } as dyeingDtl;

    if (editingIndex !== null) {
      const updatedItems = [...dyeingDtl];
      updatedItems[editingIndex] = itemToAdd;
      setDyeingDtl(updatedItems);
      setEditingIndex(null);
    } else {
      setDyeingDtl([...dyeingDtl, itemToAdd]);
    }
    setNewItem({});
  };

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let update: any = { ...newItem, [name]: value };

    if (name === "finishedFabricCodeId") {
      const codeObj = yarnList.find((cat: any) => cat.id?.toString() === value);
      update.finishedFabricName = codeObj?.yarnName || "";
    }
    if (name === "greigeFabricCodeId") {
      const codeObj = yarnList.find((cat: any) => cat.id?.toString() === value);
      update.greigeFabricName = codeObj?.yarnName || "";
    }
    if (name === "quantity" || name === "costPerPound") {
      if (value && !/^\d*\.?\d*$/.test(value)) return; // Only allow numbers and decimals
      if (name === "quantity" && value && Number(value) < 0) return;
      if (name === "costPerPound" && value && Number(value) < 0) return;

      // Auto-calculate total amount
      if (name === "quantity" || name === "costPerPound") {
        update.totalAmount = (
          Number(name === "quantity" ? value : newItem.quantity || 0) *
          Number(name === "costPerPound" ? value : newItem.costPerPound || 0)
        ).toString();
      }
    }

    setNewItem(update);
  };

  const editItem = (index: number) => {
    setNewItem(dyeingDtl[index]);
    setEditingIndex(index);
    setActiveTab("itemDetails");
  };

  const deleteItem = (index: number) => {
    setDyeingDtl(dyeingDtl.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: any) => {
    if (isSubmitDisabled) return;

    setIsSubmitting(true);

    try {
      // Map dyeingDtl to match the required payload structure
      const items = dyeingDtl.map((item: any) => ({
        id: item.id ? Number(item.id) : 0,
        dyeingWorkOrderId: item.dyeingWorkOrderId ? Number(item.dyeingWorkOrderId) : 0,
        finishedFabricCodeId: Number(item.finishedFabricCodeId || 0),
        finishedFabricName: item.finishedFabricName || "",
        greigeFabricCodeId: Number(item.greigeFabricCodeId || 0),
        greigeFabricName: item.greigeFabricName || "",
        quantity: Number(item.quantity || 0),
        costPerPound: Number(item.costPerPound || 0),
        totalAmount: Number(item.totalAmount || 0),
        colorId: Number(item.colorId || 0),
        pantone: item.pantone || "",
        finishedWeight: Number(item.finishedWeight || 0),
        greigeWidth: Number(item.greigeWidth || 0),
        reqFinishedWidth: Number(item.reqFinishedWidth || 0),
        uomId: Number(item.uomId || 0),
        remarks: item.remarks || "",
        activeFlag: item.activeFlag !== undefined ? item.activeFlag : true,
      }));

      const payload = {
        id: dyeingWorkOrderDtl?.id,
        dyeingWorkOrderNo: data.dyeingWorkOrderNo || "",
        processContactDate: data.processContractDate,
        deliveryDate: data.expectedDeliveryDate,
        vendorId: Number(data.vendorId || 0),
        salesOrderNo: Number(data.salesOrderId || 0),
        consigneeId: Number(data.consigneeId || 0),
        lapDipStatusId: Number(data.labDipStatusId || 0),
        firstYardageId: Number(data.firstYardageId || 0),
        totalAmount: Number(data.totalAmount || 0),
        remarks: data.instructions || "",
        activeFlag: true,
        items,
      };

      if (isEdit && dyeingWorkOrderDtl?.id) {
        await dispatch(updateDyeingWorkOrder({ id: dyeingWorkOrderDtl.id, data: payload })).unwrap();
        // toast.success("Dyeing work order updated successfully");
      } else {
        await dispatch(createDyeingWorkOrder(payload)).unwrap();
        // toast.success("Dyeing work order created successfully");
      }

      reset();
      setDyeingDtl([]);
      navigate("/transaction/process-contract-details", { state: { tab: "processContactYarn" } });
    } catch (err) {
      toast.error("Failed to save dyeing work order");
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const labDipList = [
    { "id": 1, "name": "Approved" },
    { "id": 2, "name": "Rejected" }
  ];

  return (
    <div className="mt-10 p-6 bg-white shadow-md rounded-lg mt-16">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-semibold">{isEdit ? "Edit Dyeing Work Order" : "Dyeing Work Order"}</h2>
        <Button
          onClick={handleSubmit(onSubmit)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 flex items-center"
          disabled={isSubmitDisabled}
        >
          {isSubmitting ? (
            "Processing..."
          ) : (
            <>
              <Save size={18} className="mr-2" />
              {isEdit ? "Update" : "Save"} Dyeing Work Order
            </>
          )}
        </Button>
      </div>

      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('orderDetails')}
                className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm ${activeTab === 'orderDetails'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <FileText className="w-4 h-4" />
                Details
              </button>
              <button
                onClick={() => setActiveTab('itemDetails')}
                className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm ${activeTab === 'itemDetails'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <ShoppingCart className="w-4 h-4" />
                Dyeing Details
              </button>
            </nav>
          </div>
        </div>

        {activeTab === "orderDetails" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText size={20} /> Dyeing Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-4 gap-8">
              <div>
                <label className="block text-sm font-medium text-secondary-700">Process Contact Date <span className="text-red-600">*</span></label>
                <input
                  {...register('processContractDate', { required: 'Date is required' })}
                  className="input mt-1" type="date"
                />
                {errors.processContractDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.processContractDate.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700">Expected Delivery Date <span className="text-red-600">*</span></label>
                <input
                  {...register('expectedDeliveryDate', { required: 'Expected Date is required' })}
                  className="input mt-1" type="date"
                />
                {errors.expectedDeliveryDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.expectedDeliveryDate.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">Select Vendor <span className="text-red-600">*</span></label>
                <select {...register("vendorId", { required: "Vendor is required" })} className="input mt-1">
                  <option value="">Select a Vendor</option>
                  {vendorList?.map((vendor: any) => (
                    <option key={vendor.id} value={vendor.id}>{vendor.vendorName}</option>
                  ))}
                </select>
                {errors.vendorId && <p className="mt-1 text-sm text-red-600">{errors.vendorId.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700">Sales Order <span className="text-red-600">*</span></label>
                <select {...register("salesOrderId", { required: "Sales Order is required" })} className="input mt-1">
                  <option value="">Select a Sales Order</option>
                  {salesOrderList?.map((so: any) => (
                    <option key={so.id} value={so.id}>{so.salesOrderNo}</option>
                  ))}
                </select>
                {errors.salesOrderId && (
                  <p className="mt-1 text-sm text-red-600">{errors.salesOrderId.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700">Consignee <span className="text-red-600">*</span></label>
                <select {...register("consigneeId", { required: "ConsigneeId is required" })} className="input mt-1">
                  <option value="">Select ConsigneeId</option>
                  {consigneeList?.map((consignee: any) => (
                    <option key={consignee.id} value={consignee.id}>{consignee.consigneeName}</option>
                  ))}
                </select>
                {errors.consigneeId && (
                  <p className="mt-1 text-sm text-red-600">{errors.consigneeId.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700">Lab Dip Status <span className="text-red-600">*</span></label>
                <select {...register("labDipStatusId")} className="input mt-1">
                  <option value="">Select Lab Dip Status</option>
                  {labDipList?.map((lab: any) => (
                    <option key={lab.id} value={lab.id}>{lab.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700">First Yardage <span className="text-red-600">*</span></label>
                <select {...register("firstYardageId")} className="input mt-1">
                  <option value="">Select First Yardage</option>
                  {labDipList?.map((lab: any) => (
                    <option key={lab.id} value={lab.id}>{lab.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700">Total Amount <span className="text-red-600">*</span></label>
                <input {...register("totalAmount")} className="input mt-1" />
              </div>
              <div>
                <label className="block text-sm font-medium">Instructions</label>
                <textarea {...register("instructions")} className="input mt-1"></textarea>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "itemDetails" && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart size={20} /> Item Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">Finished Yarn Name <span className="text-red-600">*</span></label>
                    <select
                      className="input mt-1"
                      name="finishedFabricCodeId"
                      value={newItem.finishedFabricCodeId || ''}
                      onChange={handleItemChange}
                    >
                      <option value="">Select Finished Yarn Name</option>
                      {yarnList?.map((ff: any) => (
                        <option key={ff.id} value={ff.id}>{ff.yarnName}</option>
                      ))}
                    </select>
                  </div>
                  {/* <div>
                    <label className="block text-sm font-medium text-secondary-700">Finished Yarn Name</label>
                    <input className="input mt-1" name="finishedFabricName" value={newItem.finishedFabricName || ''} readOnly />
                  </div> */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">Greige Yarn Name <span className="text-red-600">*</span></label>
                    <select
                      className="input mt-1"
                      name="greigeFabricCodeId"
                      value={newItem.greigeFabricCodeId || ''}
                      onChange={handleItemChange}
                    >
                      <option value="">Select Greige Fabric Code</option>
                      {yarnList?.map((yarn: any) => (
                        <option key={yarn.id} value={yarn.id}>{yarn.yarnName}</option>
                      ))}
                    </select>
                  </div>
                  {/* <div>
                    <label className="block text-sm font-medium text-secondary-700">Greige Yarn Name</label>
                    <input className="input mt-1" name="greigeFabricName" value={newItem.greigeFabricName || ''} readOnly />
                  </div> */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">Quantity <span className="text-red-600">*</span></label>
                    <input placeholder="Quantity" name="quantity"
                      value={newItem.quantity || ''}
                      onChange={handleItemChange} className="input mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">Cost/Pound <span className="text-red-600">*</span></label>
                    <input placeholder="Cost Per Pound" name="costPerPound"
                      value={newItem.costPerPound || ''}
                      onChange={handleItemChange} className="input mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">Total Amount <span className="text-red-600">*</span></label>
                    <input placeholder="Total Amount" name="totalAmount"
                      value={newItem.totalAmount || ''}
                      onChange={handleItemChange} className="input mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">Color <span className="text-red-600">*</span></label>
                    <select name="colorId" value={newItem.colorId || ''} onChange={handleItemChange} className="input mt-1">
                      <option value="">Select Color</option>
                      {subCategoryByCategoryList.map((color: any) => (
                        <option key={color.id} value={color.id}>{color.subCategoryName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">Pantone <span className="text-red-600">*</span></label>
                    <input placeholder="Pantone" name="pantone"
                      value={newItem.pantone || ''}
                      onChange={handleItemChange} className="input mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">Finished Weight <span className="text-red-600">*</span></label>
                    <input placeholder="Finished Weight" name="finishedWeight"
                      value={newItem.finishedWeight || ''}
                      onChange={handleItemChange} className="input mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">Greige Width <span className="text-red-600">*</span></label>
                    <input placeholder="Greige Width" name="greigeWidth"
                      value={newItem.greigeWidth || ''}
                      onChange={handleItemChange} className="input mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">Req. Finished Width <span className="text-red-600">*</span></label>
                    <input placeholder="ReqFinishedWidth" name="reqFinishedWidth"
                      value={newItem.reqFinishedWidth || ''}
                      onChange={handleItemChange} className="input mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">UOM <span className="text-red-600">*</span></label>
                    <select name="uomId" value={newItem.uomId || ''} onChange={handleItemChange} className="input mt-1">
                      <option value="">Select UOM</option>
                      {uomList?.map((unit: any) => (
                        <option key={unit.id} value={unit.id}>{unit.uomName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">Remarks</label>
                    <input placeholder="Remarks" name="remarks"
                      value={newItem.remarks || ''}
                      onChange={handleItemChange} className="input" />
                  </div>
                </div>
                <Button onClick={addItem} className="mt-4 ml-auto flex items-center" type="button">
                  <Plus size={18} className="mr-2" />
                  {editingIndex !== null ? "Update Item" : "Add Item"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList size={20} /> Item Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full border-collapse border border-gray-300 text-center">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-2">Sl.No</th>
                      {/* <th className="border p-2">Fin. Fabric Code</th> */}
                      <th className="border p-2">Finished Yarn Name</th>
                      {/* <th className="border p-2">Greige Fabric Code</th> */}
                      <th className="border p-2">Greige Yarn Name</th>
                      <th className="border p-2">Quantity</th>
                      <th className="border p-2">Cost/Pound</th>
                      <th className="border p-2">Total Amount</th>
                      <th className="border p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dyeingDtl?.map((item: any, index: any) => (
                      <tr key={index} className="border">
                        <td className="border p-2">{index + 1}</td>
                        {/* <td className="border p-2">{item.finishedFabricCodeId}</td> */}
                        <td className="border p-2">{item.finishedFabricName}</td>
                        {/* <td className="border p-2">{item.greigeFabricCodeId}</td> */}
                        <td className="border p-2">{item.greigeFabricName}</td>
                        <td className="border p-2">{item.quantity}</td>
                        <td className="border p-2">{item.costPerPound}</td>
                        <td className="border p-2">{item.totalAmount}</td>
                        <td className="border p-2">
                          <Button size="sm" onClick={() => editItem(index)}><Edit size={14} /></Button>
                          <Button size="sm" onClick={() => deleteItem(index)} variant="destructive"><Trash2 size={14} /></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}







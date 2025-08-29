import React, { useEffect, useState } from "react";
import { FileText, ShoppingCart, ClipboardList, Plus, Edit, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button"; // Assuming shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { getAllConsignee } from "@/state/consigneeSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllFabricMasterDetails } from "@/state/fabricMasterSlice";
import { getAllVendors } from "@/state/vendorSlice";
import { getAllFlanges } from "@/state/flangeSlice";
import { createEmptyBeamIssue, getAllEmptyBeamIssue, updateEmptyBeamIssue } from "@/state/emptyBeamIssueSlice";
import { toast } from "react-toastify";


interface emptyBeamIssueFormData {
  id?: number;
  vendorId: string;
  emptyBeamNo: string;
  consigneeId: string;
  vechileNo: string;
  emptyBeamIssueDate: string;
  EmptyBeamIssueItem: EmptyBeamIssueItem[];
}

interface EmptyBeamIssueItem {
  flangeId: string;
}

const EmptyBeamIssue = () => {
  const [items, setItems]: any = useState([]);
  const [newItem, setNewItem] = useState<EmptyBeamIssueItem>({
    flangeId: ""
  });
  const [editingIndex, setEditingIndex]: any = useState(null);
  const { consigneeList } = useSelector((state: RootState) => state.consignee);
  const { vendorList } = useSelector((state: RootState) => state.vendor);
  const { flangeList } = useSelector((state: RootState) => state.flange)
  const dispatch = useDispatch<AppDispatch>();
  // const { register, handleSubmit, reset, formState: { errors } } = useForm<emptyBeamIssueFormData>();
  const location = useLocation();
  const emptyBeamIssuedetail = location.state?.emptyBeamIssuedetail;
  const navigate = useNavigate();
  console.log("salesOrderdetail from location state:", emptyBeamIssuedetail);
  const [flangeIdError, setFlangeIdError] = useState("");
  const [isItemsValid, setIsItemsValid] = useState(false);


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid } // Add isValid here
  } = useForm<emptyBeamIssueFormData>({
    mode: 'onBlur',
    reValidateMode: 'onBlur'
  });

  const isFormValid = isValid &&
    items.length > 0 &&
    items.every((item: any) => item.flangeId);

  useEffect(() => {
    dispatch(getAllVendors({}));
    dispatch(getAllFlanges({}));
    dispatch(getAllConsignee({}));
  }, [dispatch]);


  useEffect(() => {
    if (emptyBeamIssuedetail) {
      reset({
        // emptyBeamNo: emptyBeamIssuedetail.emptyBeamNo || "",
        emptyBeamIssueDate: emptyBeamIssuedetail.emptyBeamIssueDate
          ? emptyBeamIssuedetail.emptyBeamIssueDate.slice(0, 10)
          : "",
        vendorId: emptyBeamIssuedetail.vendorId
          ? emptyBeamIssuedetail.vendorId
          : "",
        consigneeId: emptyBeamIssuedetail.consigneeId
          ? emptyBeamIssuedetail.consigneeId
          : "",
        vechileNo: emptyBeamIssuedetail.vechileNo || "",
      });

      // Handle items array
      if (Array.isArray(emptyBeamIssuedetail.items) && emptyBeamIssuedetail.items.length > 0) {
        setItems(emptyBeamIssuedetail.items.map((item: any) => ({
          flangeId: item.flangeId ? String(item.flangeId) : "",
        })));
      } else {
        setItems([]);
      }
    }
  }, [emptyBeamIssuedetail, reset]);

  const addItem = () => {
    if (!newItem.flangeId) {
      setFlangeIdError("Flange is required");
      setIsItemsValid(false);
      return;
    }
    // Add other required field validations as needed
    setIsItemsValid(true);
    setFlangeIdError("");

    if (editingIndex !== null) {
      const updatedItems = [...items];
      updatedItems[editingIndex] = newItem;
      setItems(updatedItems);
      setEditingIndex(null);
    } else {
      setItems([...items, newItem]);
    }
    console.log(items)
    setNewItem({
      flangeId: "",
    });
  };

  const editItem = (index: any) => {
    setNewItem(items[index]);
    setEditingIndex(index);
  };

  const deleteItem = (index: any) => {
    setItems(items.filter((_: any, i: any) => i !== index));
  };

  const onSubmit = async (data: emptyBeamIssueFormData) => {
    // Prepare the complete payload including emptyBeamNo
    const payload = {
      id: emptyBeamIssuedetail?.id || 0, // Include ID for update, default to 0 for create
      emptyBeamNo: emptyBeamIssuedetail?.emptyBeamNo, // Use existing or generate new
      emptyBeamIssueDate: new Date(data.emptyBeamIssueDate).toISOString(),
      vechileNo: data.vechileNo,
      vendorId: parseInt(data.vendorId),
      consigneeId: parseInt(data.consigneeId),
      items: items.map((item: any) => ({
        flangeId: parseInt(item.flangeId) // Ensure flangeId is a number
      }))
    };

    try {
      if (emptyBeamIssuedetail?.id) {
        dispatch(updateEmptyBeamIssue(payload))
          .then(() => {
            reset();
            navigate("/transaction/beam-management", { state: { tab: "emptyBeam" } });
          });
      } else {
        // Create mode - save (remove id for create if backend generates it)
        const { id, ...createPayload } = payload;
        await dispatch(createEmptyBeamIssue(createPayload)).unwrap();
        // toast.success("Empty Beam Issue created successfully!");
      }
      navigate("/transaction/beam-management");
    } catch (err) {
      console.error("Operation failed:", err);
      // toast.error(
      //   err instanceof Error
      //     ? err.message
      //     : "Failed to save/update Empty Beam Issue"
      // );
    }
  };


  return (
    <div className="mt-10 p-6 bg-white shadow-md rounded-lg mt-16">
      {/* Title & Save Button */}
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-semibold">Empty Beam Issue</h2>
        {/* <Button
          onClick={handleSubmit(onSubmit)}
          className={`bg-green-600 hover:bg-green-700 text-white px-6 flex items-center`}
        >
          <Save size={18} className="mr-2" />
          {emptyBeamIssuedetail?.id ? "Update Empty Beam Issue" : "Save Empty Beam Issue"}
        </Button> */}
        <Button
          onClick={handleSubmit(onSubmit)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 flex items-center"
          disabled={!isFormValid}
        >
          <Save size={18} className="mr-2" />
          {emptyBeamIssuedetail?.id ? "Update Empty Beam Issue" : "Save Empty Beam Issue"}
        </Button>
      </div>
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="mb-8">
        </div>

        {/* Vendor Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 ">
              <FileText size={20} /> Vendor Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-4 gap-8">
            <div>
              <label className="block text-sm font-medium text-secondary-700">Vendor Name <span className="text-red-600">*</span> </label>
              <select {...register("vendorId", { required: "Vendor is required" })} className="input mt-1">
                <option value="">Select a Vendor</option>
                {vendorList.map((vendor: any) => (
                  <option key={vendor.id} value={vendor.id}>{vendor.vendorName}</option>
                ))}
              </select>
              {errors.vendorId && (
                <p className="mt-1 text-sm text-red-600">{errors.vendorId.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700">Delivery Address <span className="text-red-600">*</span> </label>
              <select {...register("consigneeId", { required: "Delivey Address is required" })} className="input mt-1">
                <option value="">Select a Address</option>
                {consigneeList.map((consignee: any) => (
                  <option key={consignee.id} value={consignee.id}>{consignee.consigneeName}</option>
                ))}
              </select>
              {errors.consigneeId && (
                <p className="mt-1 text-sm text-red-600">{errors.consigneeId.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700">Vechile No <span className="text-red-600">*</span> </label>
              <input
                {...register('vechileNo', { required: 'Vechile No is required' })}
                className="input mt-1" placeholder="Enter Vechile No"
              />
              {errors.vechileNo && (
                <p className="mt-1 text-sm text-red-600">{errors.vechileNo.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700">Date <span className="text-red-600">*</span> </label>
              <input
                {...register('emptyBeamIssueDate', { required: 'Date is required' })}
                className="input mt-1" type="date"
              />
              {errors.emptyBeamIssueDate && (
                <p className="mt-1 text-sm text-red-600">{errors.emptyBeamIssueDate.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart size={20} /> Empty Beam Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700">Select Flange No</label>
                <select
                  value={newItem.flangeId}
                  onChange={(e) =>
                    setNewItem({ ...newItem, flangeId: e.target.value })
                  }
                  className="input mt-1"
                >
                  <option value="">Select Flange No</option>
                  {flangeList?.map((flange: any) => (
                    <option key={flange.id} value={flange.id}>{flange.flangeNo}</option>
                  ))}
                </select>
                {flangeIdError && <p className="mt-1 text-sm text-red-600">{flangeIdError}</p>}
              </div>
            </div>
            <Button onClick={addItem} className="mt-4 ml-auto flex items-center">
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
                  <th className="border p-2">Flange No</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: any, index: any) => (
                  <tr key={index} className="border">
                    <td className="border p-2">{index + 1}</td>
                    {/* <td className="border p-2">{item.flangeId}</td> */}
                    <td className="border p-2">
                      {flangeList.find((flange: any) => flange.id == item.flangeId)?.flangeNo || 'N/A'}
                    </td>
                    <td className="border p-2">
                      <button onClick={() => editItem(index)} className="mr-2 text-blue-500">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => deleteItem(index)} className="text-red-500">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmptyBeamIssue;

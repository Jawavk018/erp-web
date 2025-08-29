import React, { useEffect, useState } from "react";
import { FileText, ClipboardList, Edit, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { getAllVendors } from "@/state/vendorSlice";
import { getAllProductCategory } from "@/state/productCategorySlice";
import { getAllPoTypes, getAllPurchaseOrders, getPurchaseOrderById, getPurchaseOrdersByVendorId, getVendorByPoId } from "@/state/purchaseOrderSlice";
import { useLocation, useNavigate } from "react-router-dom";

interface PurchaseOrderType {
  id: number;
  poTypeName: string;
  description: string | null;
  activeFlag: boolean;
}

interface ItemType {
  id: number | string;
  poId: number | string;
  [key: string]: any; // for other properties
}

const PurchaseInward = () => {

  const dispatch = useDispatch<AppDispatch>();
  const { purchaseOrderTypeList } = useSelector((state: RootState) => state.purchaseOrder);
  const [filteredItems, setFilteredItems]: any = useState([]);
  const [selectedItems, setSelectedItems]: any = useState([]);
  const { vendorList } = useSelector((state: RootState) => state.vendor);
  const { productCategoryList } = useSelector((state: RootState) => state.productCategory);
  const { purchaseOrderListById } = useSelector((state: RootState) => state.purchaseOrder);
  const { purchaseOrderListByVendorId } = useSelector((state: RootState) => state.purchaseOrder);
  // const { vendorByPoTypeList } = useSelector((state: RootState) => state.purchaseOrder);
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const { purchaseOrderList } = useSelector((state: RootState) => state.purchaseOrder);
  const location = useLocation();
  const purchaseInwardDtl = location.state?.purchaseInwardDtl;
  const navigate = useNavigate();
  // const [selectedPoTypeId, setSelectedPoTypeId] = useState<number | string>("");
  const [selectedPoTypeId, setSelectedPoTypeId] = useState<number | null>(null);
  const { vendorByPoTypeList, loading, error } = useSelector((state: RootState) => state.purchaseOrder);

  useEffect(() => {
    dispatch(getAllVendors({}));
    dispatch(getAllProductCategory({}));
    dispatch(getAllPurchaseOrders({}));
    dispatch(getAllPoTypes({}));
  }, [dispatch]);

  // Debug effects
  useEffect(() => {
    console.log("Current vendor list:", vendorByPoTypeList);
  }, [vendorByPoTypeList]);

  // Fetch vendors when PO Type changes
  useEffect(() => {
    if (selectedPoTypeId) {
      console.log("Fetching vendors for PO Type:", selectedPoTypeId);
      dispatch(getVendorByPoId(selectedPoTypeId));
    }
  }, [selectedPoTypeId, dispatch]);

  useEffect(() => {
    if (purchaseInwardDtl) {
      // Set all form fields
      reset({
        id: purchaseInwardDtl.id ?? "",
        // inwardDate: purchaseInwardDtl.inwardDate ? purchaseInwardDtl.inwardDate.slice(0, 10) : "",
        inwardDate: purchaseInwardDtl.inwardDate ? purchaseInwardDtl.inwardDate.slice(0, 10) : "",
        remarks: purchaseInwardDtl.remarks ?? "",
        activeFlag: purchaseInwardDtl.activeFlag ?? true,
        purchaseOrderId: purchaseInwardDtl.purchaseOrderId ? String(purchaseInwardDtl.purchaseOrderId) : "",
        // Add any more fields you want from sample here
      });

      // Set all items including lotEntries
      setFilteredItems(
        (purchaseInwardDtl.items || []).map((item: any) => ({
          id: item.id,
          quantityReceived: String(item.quantityReceived ?? ""),
          price: String(item.price ?? ""),
          activeFlag: item.activeFlag,
          purchaseOrderItemId: item.purchaseOrderItemId,
          lotEntries: Array.isArray(item.lotEntries)
            ? item.lotEntries.map((lot: any) => ({
              id: lot.id,
              lotNumber: lot.lotNumber,
              quantity: lot.quantity,
              rejectedQuantity: lot.rejectedQuantity,
              cost: lot.cost,
              remarks: lot.remarks,
              activeFlag: lot.activeFlag
            }))
            : [],
        }))
      );
    }
  }, [purchaseInwardDtl, reset]);


  const handleVendorChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value);
    console.log("Selected vendor ID:", id);
    setFilteredItems([]); // Clear items when vendor changes
    if (id) {
      try {
        const result = await dispatch(getPurchaseOrdersByVendorId(id));
        console.log("API Response:", result);
        setFilteredItems(result?.payload)
        console.log(filteredItems)
      } catch (error) {
        console.error("Error fetching purchase orders:", error);
      }
    }
  };


  // const handlePoTypeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const id = parseInt(e.target.value);
  //   console.log("Selected vendor ID:", id);
  //   setFilteredItems([]); // Clear items when vendor changes
  //   if (id) {
  //     try {
  //       const result = await dispatch(getVendorByPoId(id));
  //       console.log("API Response:", result);
  //       // setFilteredItems(result?.payload)
  //       // console.log(filteredItems)
  //     } catch (error) {
  //       console.error("Error fetching purchase orders:", error);
  //     }
  //   }
  // };

  const handlePONumberChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const poId = parseInt(e.target.value);
    setFilteredItems([]);
    if (poId) {
      try {
        const result = await dispatch(getPurchaseOrderById(poId));
        // Set filtered items based on this PO
        const po = result?.payload;
        if (po?.purchaseOrderItemsDtl) {
          const items = po.purchaseOrderItemsDtl.map((item: any) => ({
            ...item,
            poId: po.id,
            poDate: po.poDate,
            quantityReceived: 0,
            price: item.price || 0
          }));
          setFilteredItems(items);
        }
      } catch (error) {
        console.error("Error fetching PO by ID:", error);
      }
    }
  };


  const handleFilter = () => {
    if (!purchaseOrderListById?.data || !Array.isArray(purchaseOrderListById.data)) {
      console.log("No valid data to filter");
      return;
    }

    const poNo = watch("poNo");
    const poDate = watch("poDate");

    console.log("Filtering with:", { poNo, poDate });

    const filtered = purchaseOrderListById.data
      .filter((po: any) =>
        (!poNo || po.id.toString() === poNo) &&
        (!poDate || po.poDate === poDate)
      )
      .flatMap((po: any) => {
        if (po.purchaseOrderItemsDtl && Array.isArray(po.purchaseOrderItemsDtl)) {
          return po.purchaseOrderItemsDtl.map((item: any) => ({
            ...item,
            poId: po.id,
            poDate: po.poDate,
            quantityReceived: 0,
            price: item.price || 0
          }));
        }
        return [];
      });

    console.log("Filtered items:", filtered);
    setFilteredItems(filtered);
  };

  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedItems = [...filteredItems];
    updatedItems[index][field] = value;
    setFilteredItems(updatedItems);
  };

  // const handleItemSelect = (item: any) => {
  //   // alert(JSON.stringify(item))
  //   console.log(item)
  //   const isAlreadySelected = selectedItems.some((selected: any) =>
  //     selected.id === item.id && selected.poId === item.poId
  //   );

  //   if (!isAlreadySelected) {
  //     setSelectedItems((prev: any) => [...prev, item]);
  //   }
  // };

  const handleItemSelect = (item: ItemType) => {
    console.log('Selected item:', item);

    // 1. Validate selected PO type
    if (!selectedPoTypeId) {
      console.error('No PO type selected');
      // Consider adding user feedback (e.g., toast.error('Please select a PO type'));
      return;
    }

    // 2. Check if purchaseOrderTypeList exists
    if (!purchaseOrderTypeList?.length) {
      console.error('Purchase order type list not loaded');
      return;
    }

    try {
      // Convert to number if needed (ensure type matching)
      const poTypeId = Number(selectedPoTypeId);
      console.log(`Selected PO type ID: ${poTypeId}`);
      // 3. Find matching PO type
      const selectedPoType = purchaseOrderTypeList.find(
        (poType: any) => Number(poType.id) === poTypeId
      );

      console.debug('Matching PO type:', {
        searchingFor: poTypeId,
        availableIds: purchaseOrderTypeList.map((po: any) => po.id),
        found: selectedPoType
      });

      // 4. Create enhanced item object with both PO type and product name
      const itemWithDetails = {
        ...item,
        poTypeId: poTypeId, // Use the selected PO type ID
        poTypeName: selectedPoType?.poTypeName || `Unknown (ID: ${poTypeId})`,
      };

      // 5. Check for duplicates (now comparing with poTypeId)
      const isAlreadySelected = selectedItems.some((selected: any) =>
        selected.id === item.id && selected.poId === item.poId
      );

      if (!isAlreadySelected) {
        setSelectedItems((prev: any) => [...prev, itemWithDetails]);
        console.log('Item added:', itemWithDetails);
      } else {
        console.warn('Duplicate item not added:', itemWithDetails);
      }
    } catch (error) {
      console.error('Selection error:', error);
      // toast.error('Failed to add item');
    }
  };

  const navigateToLotDetails = () => {
    if (selectedItems.length === 0) {
      return;
    }
    navigate("/transaction/lot-details", { state: { selectedItems } });
  };



  return (
    <div className="mt-10 p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-semibold">Purchase Inward</h2>
        <div className="space-x-2">
          <Button
            onClick={navigateToLotDetails}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6"
          >
            Create Lots
          </Button>
          {/* <Button
            onClick={navigateToLotDetails}
            className={`bg-green-600 hover:bg-green-700 text-white px-6 flex items-center`}
          >
            <Save size={18} className="mr-2" />
            {purchaseInwardDtl?.id ? "Update Lots" : "Create Lots"}
          </Button> */}
          {/* <Button className="bg-green-600 hover:bg-green-700 text-white px-6 flex items-center">
            <Save size={18} className="mr-2" /> Save
          </Button> */}
        </div>
      </div>
      <div className="space-y-6 mt-10">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText size={20} /> Purchase Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-4 gap-8">
            {/* <div>
              <label className="block text-sm font-medium">Product Type <span className="text-red-600">*</span></label>
              <select {...register("productCategory", { required: "Product Type is required" })} className="input mt-1">
                <option value="">Select a Product Type</option>
                {productCategoryList.map((pc: any) => (
                  <option key={pc.id} value={pc.id}>{pc.productCategoryName}</option>
                ))}
              </select>
            </div> */}
            {/* <div>
              <label className="block text-sm font-medium">Purchase Order Type <span className="text-red-500">*</span></label>
              <select
                {...register("poTypeId", { required: "PO Type is required" })}
                className={`input mt-1 ${errors.poTypeId ? 'border-red-500' : ''}`}
                onChange={(e) => {
                  setSelectedPoTypeId(e.target.value);
                }}
              >
                <option value="">Select a PO Type</option>
                {purchaseOrderTypeList?.map((poType: any) => (
                  <option key={poType.id} value={poType.id}>{poType.poTypeName}</option>
                ))}
              </select>
            </div> */}
            <div>
              <label className="block text-sm font-medium">Purchase Order Type <span className="text-red-500">*</span></label>
              <select
                {...register("poTypeId", { required: "PO Type is required" })}
                className={`input mt-1 ${errors.poTypeId ? 'border-red-500' : ''}`}
                onChange={(e) => {
                  const value = e.target.value;
                  register("poTypeId").onChange(e); // For react-hook-form
                  setSelectedPoTypeId(value ? Number(value) : null);
                  // handlePoTypeChange(e);
                }}
              >
                <option value="">Select a PO Type</option>
                {purchaseOrderTypeList?.map((poType: any) => (
                  <option key={poType.id} value={poType.id}>{poType.poTypeName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Vendor <span className="text-red-600">*</span></label>
              <select
                {...register("vendorId", { required: "Vendor is required" })}
                className="input mt-1"
                onChange={handleVendorChange}
              >
                <option value="">Select a Vendor</option>
                {vendorByPoTypeList?.map((vendor: any) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.vendorName}
                  </option>
                ))}
              </select>
            </div>

            {/* <div className="mb-4">
              <label className="block text-sm font-medium">Vendor <span className="text-red-600">*</span></label>
              <select
                {...register("vendorId", { required: "Vendor is required" })}
                className={`input mt-1 ${errors.vendorId ? 'border-red-500' : ''}`}
                disabled={!selectedPoTypeId || loading}
              >
                <option value="">Select Vendor</option>
                {loading && <option value="">Loading...</option>}
                {error && <option value="">Error loading vendors</option>}
                {vendorByPoTypeList?.map((vendor: any) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.vendorName || vendor.name}
                  </option>
                ))}
              </select>
              {!loading && !error && vendorByPoTypeList?.length === 0 && selectedPoTypeId && (
                <p className="mt-1 text-sm text-gray-500">No vendors available for selected PO Type</p>
              )}
            </div> */}
            {/* <div>
              <label className="block text-sm font-medium">Select Purchase Order <span className="text-red-600">*</span></label>
              <select {...register("poNo", { required: "Purchase Order is required" })} className="input mt-1" onChange={handlePONumberChange}>
                <option value="">Select a PO Number</option>
                {purchaseOrderListByVendorId?.map((po: any) => (
                  <option key={po.id} value={po.id}>
                    {po.poNo}
                  </option>
                ))}
              </select>
            </div> */}
            <div>
              <label className="block text-sm font-medium">Select Purchase Order <span className="text-red-600">*</span></label>
              <select
                {...register("poNo", { required: "Purchase Order is required" })}
                className="input mt-1"
                onChange={handlePONumberChange}
              >
                <option value="">Select a PO Number</option>
                {purchaseOrderListByVendorId?.data?.length > 0 ? (
                  purchaseOrderListByVendorId.data
                    .filter((po: any) => po.poNo !== null) // Filter out null poNo values
                    .map((po: any) => (
                      <option key={po.id} value={po.id}>
                        {po.poNo || `Unnamed PO (ID: ${po.id})`}
                      </option>
                    ))
                ) : (
                  <option value="" disabled>
                    {!purchaseOrderListByVendorId ? "Loading..." : "No POs found"}
                  </option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Purchase Date <span className="text-red-600">*</span></label>
              <input {...register("poDate", { required: "Purchase Date is required" })} type="date" className="input mt-1" onChange={handleFilter} />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700">Remarks</label>
              <input placeholder="Remarks" {...register("remarks")} className="input mt-1" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList size={20} /> Item Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              {filteredItems.length === 0 && (
                <p className="text-gray-500 text-center">No items to display. Please select a vendor.</p>
              )}
            </div>
            {filteredItems.length > 0 && (
              <table className="w-full border-collapse border border-gray-300 text-center">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Select</th>
                    <th className="border p-2">Sl.No</th>
                    <th className="border p-2">Product Category</th>
                    <th className="border p-2">Quantity Ordered</th>
                    <th className="border p-2">Unit</th>
                    <th className="border p-2">Quantity Received</th>
                    <th className="border p-2">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item: any, index: number) => (
                    <tr key={`${item.poId}-${item.id}`} className="border">
                      <td className="border p-2">
                        <input
                          type="checkbox"
                          onChange={() => handleItemSelect(item)}
                          checked={selectedItems.some((selected: any) =>
                            selected.id === item.id && selected.poId === item.poId
                          )}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="border p-2">{index + 1}</td>
                      <td className="border p-2">
                        {productCategoryList.find((pc: any) => pc.id === item.productCategoryId)?.productCategoryName}
                      </td>
                      <td className="border p-2">{item.quantity}</td>
                      <td className="border p-2">{item.unit}</td>
                      <td className="border p-2">
                        <input
                          type="number"
                          min="0"
                          max={item.quantity}
                          className="w-30 border p-1"
                          value={item.quantityReceived}
                          onChange={e => handleInputChange(index, "quantityReceived", e.target.value)}
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="w-30 border p-1"
                          value={item.price}
                          onChange={e => handleInputChange(index, "price", e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </div >
  );
};

export default PurchaseInward;
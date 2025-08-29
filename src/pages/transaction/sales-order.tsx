import React, { useEffect, useState } from "react";
import { FileText, ShoppingCart, ClipboardList, Plus, Edit, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button"; // Assuming shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { createSalesOrder, getAllSalesOrders, updateSalesOrder } from "@/state/salesOrderSlice";
import { getAllCustomers } from "@/state/customerSlice";
import { getAllCurrencies } from "@/state/currencySlice";
import { getAllShipmentTerms } from "@/state/shipmentTermsSlice";
import { getAllTermsConditions } from "@/state/termsConditions";
import { getAllShipmentModes } from "@/state/shipmentModeSlice";
import { getAllFabricTypes } from "@/state/fabricTypeSlice";
import { getAllConsignee } from "@/state/consigneeSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllPaymentTerms } from "@/state/paymentTermsSlice";
import { getAllFabricCategory } from "@/state/fabricCategorySlice";
import { getAllFabricMasterDetails } from "@/state/fabricMasterSlice";
import { getAllUomMaster } from "@/state/uomMasterSlice";


interface salesOrderFormData {
  id?: number;
  orderDate: string;
  buyerPoNo: string;
  buyerCustomerId: string;
  deliverToId: string;
  currencyId: string;
  packingTypeId: string;
  exchangeRate: string;
  modeOfShipmentId: string;
  shipmentTermsId: string;
  paymentTermsId: string;
  termsConditionsId: string;
  gstOption: string;
  internalOrderNo: string;
  salesOrderNo: string;
  SalesOrderItem: SalesOrderItem[];
}

interface SalesOrderItem {
  fabricTypeId: string;
  fabricMasterId: string;
  fabricCategoryId: string;
  fabricId: string;
  quality: string;
  buyerProduct: string;
  orderQty: string;
  pricePerUnit: string;
  uom: string;
  gstPercent: string;
  gstAmount: string;
  finalAmount: string;
  deliveryDate: string;
  remarks: string;
  totalAmount: string;
  fabricMasterTypeId: string;
}

const SalesOrderEntry = () => {
  const [items, setItems]: any = useState([]);
  const [newItem, setNewItem] = useState<SalesOrderItem>({
    fabricTypeId: "",
    fabricMasterId: "",
    fabricCategoryId: "",
    fabricId: "",
    quality: "",
    buyerProduct: "",
    orderQty: "",
    pricePerUnit: "",
    uom: "",
    gstPercent: "",
    gstAmount: "",
    finalAmount: "",
    deliveryDate: "",
    remarks: "",
    totalAmount: "",
    fabricMasterTypeId: "",
  });
  const [editingIndex, setEditingIndex]: any = useState(null);
  const [activeTab, setActiveTab] = useState("orderDetails");
  const [taxType, setTaxType] = useState("IGST"); // IGST or SGST/CGST
  const { consigneeList } = useSelector((state: RootState) => state.consignee);
  const { fabricCategoryList } = useSelector((state: RootState) => state.fabricCategoty);
  const { customerList } = useSelector((state: RootState) => state.customer);
  const { currencyList } = useSelector((state: RootState) => state.currency);
  const { shipmentTermsList } = useSelector((state: RootState) => state.shipmentTerms);
  const { paymentTermsList } = useSelector((state: RootState) => state.paymentTerms);
  const { termsContitionsList } = useSelector((state: RootState) => state.termsConditions);
  const { shipmentModesList } = useSelector((state: RootState) => state.shipmentMode);
  const { fabricTypeList } = useSelector((state: RootState) => state.fabricType);
  const { salesOrderList } = useSelector((state: RootState) => state.salesOrder);
  const { uomList } = useSelector((state: RootState) => state.uom);

  const { fabricMasterDetailList } = useSelector((state: RootState) => state.fabricMaster);
  const dispatch = useDispatch<AppDispatch>();
  // const { register, handleSubmit, reset, formState: { errors } } = useForm<salesOrderFormData>();
  const location = useLocation();
  const salesOrderdetail = location.state?.salesOrderdetail;
  const navigate = useNavigate();
  console.log("salesOrderdetail from location state:", salesOrderdetail);
  const [isItemsValid, setIsItemsValid] = useState(false);
  const [fabricTypeIdError, setFabricTypeIdError] = useState("");
  const [fcIdError, setFcIdError] = useState("");
  const [fabricIdError, setFabricIdError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid } // Add isValid here
  } = useForm<salesOrderFormData>({
    mode: 'onBlur',
    reValidateMode: 'onBlur'
  });

  const isFormValid = isValid &&
    items.length > 0 &&
    items.every((item: any) => item.flangeId);


  useEffect(() => {
    dispatch(getAllCustomers({}));
    dispatch(getAllCurrencies({}));
    dispatch(getAllShipmentTerms({}));
    dispatch(getAllTermsConditions({}));
    dispatch(getAllShipmentModes({}));
    dispatch(getAllFabricTypes({}));
    dispatch(getAllConsignee({}));
    dispatch(getAllPaymentTerms({}));
    dispatch(getAllFabricCategory({}));
    dispatch(getAllUomMaster({}));

  }, [dispatch]);


  useEffect(() => {
    if (salesOrderdetail) {
      // Set main form values
      reset({
        orderDate: salesOrderdetail.orderDate ? salesOrderdetail.orderDate.slice(0, 10) : "",
        buyerPoNo: salesOrderdetail.buyerPoNo || "",
        buyerCustomerId: salesOrderdetail.buyerCustomerId ? String(salesOrderdetail.buyerCustomerId) : "",
        deliverToId: salesOrderdetail.deliverToId ? String(salesOrderdetail.deliverToId) : "",
        currencyId: salesOrderdetail.currencyId ? String(salesOrderdetail.currencyId) : "",
        exchangeRate: salesOrderdetail.exchangeRate ? String(salesOrderdetail.exchangeRate) : "",
        modeOfShipmentId: salesOrderdetail.modeOfShipmentId ? String(salesOrderdetail.modeOfShipmentId) : "",
        shipmentTermsId: salesOrderdetail.shipmentTermsId ? String(salesOrderdetail.shipmentTermsId) : "",
        paymentTermsId: salesOrderdetail.paymentTermsId ? String(salesOrderdetail.paymentTermsId) : "",
        termsConditionsId: salesOrderdetail.termsConditionsId ? String(salesOrderdetail.termsConditionsId) : "",
        packingTypeId: salesOrderdetail.packingTypeId ? String(salesOrderdetail.packingTypeId) : "",
        salesOrderNo: salesOrderdetail.salesOrderNo ? String(salesOrderdetail.salesOrderNo) : "",
        internalOrderNo: salesOrderdetail.internalOrderNo ? String(salesOrderdetail.internalOrderNo) : "",
      });

      // Process items array
      if (Array.isArray(salesOrderdetail.items)) {
        const processedItems = salesOrderdetail.items.map((item: any) => ({
          fabricTypeId: item.fabricTypeId ? String(item.fabricTypeId) : "",
          fabricMasterId: item.fabricMasterId ? String(item.fabricMasterId) : "",
          fabricCategoryId: item.fabricCategoryId ? String(item.fabricCategoryId) : "",
          fabricMasterTypeId: item.fabricMasterTypeId ? String(item.fabricMasterTypeId) : "",
          quality: item.quality || "",
          buyerProduct: item.buyerProduct || "",
          orderQty: item.orderQty ? String(item.orderQty) : "0",
          pricePerUnit: item.pricePerUnit ? String(item.pricePerUnit) : "0",
          uomId: item.uomId ? String(item.uomId) : "",
          totalAmount: item.totalAmount ? String(item.totalAmount) : "0",
          gstPercent: item.gstPercent ? String(item.gstPercent) : "0",
          gstAmount: item.gstAmount ? String(item.gstAmount) : "0",
          finalAmount: item.finalAmount ? String(item.finalAmount) : "0",
          deliveryDate: item.deliveryDate ? item.deliveryDate.slice(0, 10) : "",
          remarks: item.remarks || "",
          activeFlag: item.activeFlag || true
        }));
        setItems(processedItems);
      } else {
        setItems([]);
      }
    }
  }, [salesOrderdetail, reset]);


  const handleChange = (e: any) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const addItem = () => {

    let isValid = true;

    if (!newItem.fabricTypeId) {
      setFabricTypeIdError("Fabric Type is required");
      isValid = false;
    } else {
      setFabricTypeIdError("");
    }

    if (!newItem.fabricCategoryId) {
      setFcIdError("Fabric Category is required");
      isValid = false;
    } else {
      setFcIdError("");
    }

    if (!newItem.fabricMasterId) {
      setFabricIdError("Fabric Name is required");
      isValid = false;
    } else {
      setFabricIdError("");
    }
    // Add other required field validations as needed
    setIsItemsValid(isValid);

    if (!isValid) {
      return;
    }
    if (editingIndex !== null) {
      const updatedItems = [...items];
      updatedItems[editingIndex] = newItem;
      setItems(updatedItems);
      setEditingIndex(null);
    } else {
      setItems([...items, newItem]);
    }
    setNewItem({
      fabricTypeId: "",
      fabricMasterId: "",
      fabricCategoryId: "",
      fabricId: "",
      quality: "",
      buyerProduct: "",
      orderQty: "",
      pricePerUnit: "",
      uom: "",
      gstPercent: "",
      gstAmount: "",
      finalAmount: "",
      deliveryDate: "",
      remarks: "",
      totalAmount: "",
      fabricMasterTypeId: "",
    });
  };

  const editItem = (index: any) => {
    setNewItem(items[index]);
    setEditingIndex(index);
  };

  const deleteItem = (index: any) => {
    setItems(items.filter((_: any, i: any) => i !== index));
  };

  const calculateSummary = () => {
    const totalAmount = items.reduce((sum: number, item: { pricePerUnit: number; orderQty: number; }) => sum + item.pricePerUnit * item.orderQty, 0);
    const gstAmount = items.reduce((sum: number, item: { pricePerUnit: number; orderQty: number; gst: number; }) => sum + (item.pricePerUnit * item.orderQty * item.gst) / 100, 0);
    return { totalAmount, gstAmount, finalAmount: totalAmount + gstAmount };
  };

  const onSubmit = async (data: salesOrderFormData) => {
    // Prepare payload as before
    const payload = {
      orderDate: new Date(data.orderDate).toISOString(),
      buyerCustomerId: parseInt(data.buyerCustomerId),
      buyerPoNo: data.buyerPoNo,
      deliverToId: parseInt(data.deliverToId),
      currencyId: parseInt(data.currencyId),
      exchangeRate: parseFloat(data.exchangeRate),
      modeOfShipmentId: parseInt(data.modeOfShipmentId),
      shipmentTermsId: parseInt(data.shipmentTermsId),
      paymentTermsId: parseInt(data.paymentTermsId),
      termsConditionsId: parseInt(data.termsConditionsId),
      packingTypeId: parseInt(data.packingTypeId),
      salesOrderNo: data.salesOrderNo,
      internalOrderNo: data.internalOrderNo,
      activeFlag: true,
      items: items.map((item: any) => ({
        id: item.id, // Include id if editing
        fabricTypeId: parseInt(item.fabricTypeId),
        quality: item.quality,
        buyerProduct: item.buyerProduct,
        orderQty: parseFloat(item.orderQty),
        pricePerUnit: parseFloat(item.pricePerUnit),
        uomId: parseInt(item.uom),
        totalAmount: parseFloat(item.totalAmount),
        gstPercent: parseFloat(item.gstPercent),
        gstAmount: parseFloat(item.gstAmount),
        finalAmount: parseFloat(item.finalAmount),
        deliveryDate: new Date(item.deliveryDate).toISOString(),
        remarks: item.remarks,
        fabricMasterTypeId: parseInt(item.fabricMasterTypeId),
        fabricCategoryId: parseInt(item.fabricCategoryId),
        fabricMasterId: parseInt(item.fabricMasterId),
        activeFlag: true
      }))
    };
    console.log("payload:", payload);
    try {
      if (salesOrderdetail?.id) {
        // Edit mode - update
        await dispatch(updateSalesOrder({ id: salesOrderdetail.id, data: payload })).unwrap();
        // toast.success("Sales Order updated successfully!");
      } else {
        // Create mode - save
        await dispatch(createSalesOrder(payload)).unwrap();
        // toast.success("Sales Order saved successfully!");
      }
      navigate("/transaction/sales-order-management", { state: { tab: "domestic" } });
    } catch (err) {
      // toast.error("Failed to save/update Sales Order");
    }
  };

  const fabricMasterList = [
    { "id": 1, "fabricMasterName": "Woven Fabric" },
    { "id": 2, "fabricMasterName": "Knitted Fabric" }
  ]

  const gstOptionList = [
    { id: 1, name: 0 },
    { id: 2, name: 5 },
    { id: 3, name: 12 },
    { id: 4, name: 18 },
    { id: 5, name: 28 }
  ];
  const [selectedFabricType, setSelectedFabricType] = useState<string>('1');
  const [selectedGreige, setSelectedGreige] = useState<string>('');
  const [selectedFinished, setSelectedFinished] = useState<string>('');

  const handleFabricTypeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // setSelectedFabricType(value);
    // setValue('fabricType', value);
    // setSelectedGreige('');
    // setSelectedFinished('');

    // Convert to number if needed
    const numericValue = parseInt(value, 10);

    if (numericValue === 1 || numericValue === 2 || numericValue === 3) {
      await dispatch(getAllFabricMasterDetails({ id: numericValue }));
    }
  };

  return (
    <div className="mt-10 p-6 bg-white shadow-md rounded-lg mt-16">
      {/* Title & Save Button */}
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-semibold">Sales Order</h2>
        <Button
          onClick={handleSubmit(onSubmit)}
          className={`bg-green-600 hover:bg-green-700 text-white px-6 flex items-center`}
        >
          <Save size={18} className="mr-2" />
          {salesOrderdetail?.id ? "Update Sales Order" : "Save Sales Order"}
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
                  : 'border-transparent text-gray-500 hover:text-gray-700 Inward Ordershover:border-gray-300'
                  }`}
              >
                <FileText className="w-4 h-4" />
                Order Details
              </button>
              <button
                onClick={() => setActiveTab('itemDetails')}
                className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm ${activeTab === 'itemDetails'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <ShoppingCart className="w-4 h-4" />
                Item Details
              </button>
            </nav>
          </div>
        </div>

        {/* Order Details */}
        {activeTab === "orderDetails" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText size={20} /> Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-4 gap-8">
              <div>
                <label className="block text-sm font-medium text-secondary-700">Order Date <span className="text-red-600">*</span>
                </label>
                <input
                  {...register('orderDate', { required: 'Date is required' })}
                  className="input mt-1" type="date"
                />
                {errors.orderDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.orderDate.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700">Buyer PO No <span className="text-red-600">*</span>
                </label>
                <input
                  {...register('buyerPoNo', { required: 'Buyer Po No is required' })}
                  className="input mt-1" placeholder="Buyer PO No"
                />
                {errors.buyerPoNo && (
                  <p className="mt-1 text-sm text-red-600">{errors.buyerPoNo.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700">Buyer / Customer <span className="text-red-600">*</span>
                </label>
                <select {...register("buyerCustomerId", { required: "Customer is required" })} className="input mt-1">
                  <option value="">Select a Customer</option>
                  {customerList.map((customer: any) => (
                    <option key={customer.id} value={customer.id}>{customer.customerName}</option>
                  ))}
                </select>
                {errors.buyerCustomerId && (
                  <p className="mt-1 text-sm text-red-600">{errors.buyerCustomerId.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700">Deliver To <span className="text-red-600">*</span>
                </label>
                <select {...register("deliverToId", { required: "Deliver To is required" })} className="input mt-1">
                  <option value="">Select a Deliver</option>
                  {consigneeList.map((consignee: any) => (
                    <option key={consignee.id} value={consignee.id}>{consignee.consigneeName}</option>
                  ))}
                </select>
                {errors.deliverToId && (
                  <p className="mt-1 text-sm text-red-600">{errors.deliverToId.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700">Packing Type <span className="text-red-600">*</span>
                </label>
                <select {...register("packingTypeId")} className="input mt-1">
                  <option value="">Select Packing Type</option>
                  <option value="Roll">Roll</option>
                  <option value="Bale">Bale</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700">Currency <span className="text-red-600">*</span>
                </label>
                <select {...register("currencyId", { required: "Currency is required" })} className="input mt-1">
                  <option value="">Select a Currency</option>
                  {currencyList.map((currency: any) => (
                    <option key={currency.id} value={currency.id}>{currency.currencyName}</option>
                  ))}
                </select>
                {errors.currencyId && (
                  <p className="mt-1 text-sm text-red-600">{errors.currencyId.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700">Exchange Rate <span className="text-red-600">*</span>
                </label>
                <input
                  {...register('exchangeRate', { required: 'Exchange Rate is required' })}
                  className="input mt-1" placeholder="Exchange Rate"
                />
                {errors.exchangeRate && (
                  <p className="mt-1 text-sm text-red-600">{errors.exchangeRate.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700">Mode Of Shipment <span className="text-red-600">*</span>
                </label>
                <select {...register("modeOfShipmentId", { required: "Mode Of Shipment is required" })} className="input mt-1">
                  <option value="">Select a Mode Of Shipment</option>
                  {shipmentModesList.map((shippingModes: any) => (
                    <option key={shippingModes.id} value={shippingModes.id}>{shippingModes.modeName}</option>
                  ))}
                </select>
                {errors.modeOfShipmentId && (
                  <p className="mt-1 text-sm text-red-600">{errors.modeOfShipmentId.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700">Shipment Terms <span className="text-red-600">*</span>
                </label>
                <select {...register("shipmentTermsId", { required: "Shipment Terms is required" })} className="input mt-1">
                  <option value="">Select a Shipment Terms</option>
                  {shipmentTermsList.map((shipmentTerms: any) => (
                    <option key={shipmentTerms.id} value={shipmentTerms.id}>{shipmentTerms.termName}</option>
                  ))}
                </select>
                {errors.shipmentTermsId && (
                  <p className="mt-1 text-sm text-red-600">{errors.shipmentTermsId.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700">Payment Terms <span className="text-red-600">*</span>
                </label>
                <select {...register("paymentTermsId", { required: "Payment Terms is required" })} className="input mt-1">
                  <option value="">Select a Payment Terms</option>
                  {paymentTermsList.map((paymentTerms: any) => (
                    <option key={paymentTerms.id} value={paymentTerms.id}>{paymentTerms.termName}</option>
                  ))}
                </select>
                {errors.paymentTermsId && (
                  <p className="mt-1 text-sm text-red-600">{errors.paymentTermsId.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700">Terms & Conditions <span className="text-red-600">*</span>
                </label>
                <select {...register("termsConditionsId", { required: "Shipment Terms is required" })} className="input mt-1">
                  <option value="">Select a Shipment Terms</option>
                  {termsContitionsList.map((Conditions: any) => (
                    <option key={Conditions.id} value={Conditions.id}>{Conditions.termsConditionsName}</option>
                  ))}
                </select>
                {errors.termsConditionsId && (
                  <p className="mt-1 text-sm text-red-600">{errors.termsConditionsId.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Item Details */}
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
                    <label className="block text-sm font-medium text-secondary-700">Select Fabric Master <span className="text-red-600">*</span></label>
                    <select
                      value={newItem.fabricMasterTypeId}
                      onChange={(e) =>
                        setNewItem({ ...newItem, fabricMasterTypeId: e.target.value })
                      }
                      className="input mt-1"
                    >
                      <option value="">Select Fabric Master</option>
                      {fabricMasterList?.map((fabric: any) => (
                        <option key={fabric.id} value={fabric.id}>{fabric.fabricMasterName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">Fabric Type <span className="text-red-600">*</span></label>
                    <select
                      value={newItem.fabricTypeId}
                      onChange={(e: any) => {
                        setNewItem({ ...newItem, fabricTypeId: e.target.value });
                        handleFabricTypeChange(e);
                      }}
                      className="input mt-1"
                    >
                      <option value="">Select Fabric Type</option>
                      {fabricTypeList?.map((fabric: any) => (
                        <option key={fabric.id} value={fabric.id}>
                          {fabric.fabricTypeName}
                        </option>
                      ))}
                    </select>
                    {fabricTypeIdError && <p className="mt-1 text-sm text-red-600">{fabricTypeIdError}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">Fabric Category <span className="text-red-600">*</span></label>
                    <select
                      value={newItem.fabricCategoryId}
                      onChange={(e: any) => {
                        setNewItem({ ...newItem, fabricCategoryId: e.target.value });
                        handleFabricTypeChange(e);
                      }}
                      className="input mt-1"
                    >
                      <option value="">Select Fabric Category</option>
                      {fabricCategoryList?.map((fabric: any) => (
                        <option key={fabric.id} value={fabric.id}>{fabric.fabricCategoryName}</option>
                      ))}
                    </select>
                    {fcIdError && <p className="mt-1 text-sm text-red-600">{fcIdError}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">Fabric Name <span className="text-red-600">*</span></label>
                    <select
                      value={newItem.fabricMasterId}
                      onChange={(e: any) => {
                        setNewItem({ ...newItem, fabricMasterId: e.target.value });
                        handleFabricTypeChange(e);
                      }}
                      className="input mt-1"
                    >
                      <option value="">Select Fabric Name</option>
                      {fabricMasterDetailList?.map((item: any) => (
                        <option key={item.id} value={item.id}> {item.fabric_name} ({item.fabric_code})</option>
                      ))}
                    </select>
                    {fabricIdError && <p className="mt-1 text-sm text-red-600">{fabricIdError}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">Quality</label>
                    <input placeholder="Quality"
                      value={newItem.quality}
                      onChange={e => setNewItem({ ...newItem, quality: e.target.value })} className="input  mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">Buyer Product</label>
                    <input placeholder="Buyer Product"
                      value={newItem.buyerProduct}
                      onChange={e => setNewItem({ ...newItem, buyerProduct: e.target.value })} className="input  mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">Order Qty</label>
                    <input placeholder="Order Qty"
                      value={newItem.orderQty}
                      onChange={e => setNewItem({ ...newItem, orderQty: e.target.value })} className="input  mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">Price / Unit</label>
                    <input placeholder="Price / Unit"
                      value={newItem.pricePerUnit}
                      onChange={e => setNewItem({ ...newItem, pricePerUnit: e.target.value })} className="input  mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">UOM</label>
                    <select
                      value={newItem.uom}
                      onChange={(e) =>
                        setNewItem({ ...newItem, uom: e.target.value })
                      }
                      className="input mt-1"
                    >
                      <option value="">Select a UOM</option>
                      {uomList?.map((uom: any) => (
                        <option key={uom.id} value={uom.id}>{uom.uomName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">Total Amount</label>
                    <input placeholder="Total Amount"
                      value={newItem.totalAmount}
                      onChange={e => setNewItem({ ...newItem, totalAmount: e.target.value })} className="input  mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">GST %</label>
                    <select
                      value={newItem.gstPercent}
                      onChange={(e) =>
                        setNewItem({ ...newItem, gstPercent: e.target.value })
                      }
                      className="input mt-1"
                    >
                      <option value="">Select a GST %</option>
                      {gstOptionList.map((gstOption: any) => (
                        <option key={gstOption.id} value={gstOption.id}>{gstOption.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">GST Amount</label>
                    <input placeholder="GST Amount"
                      value={newItem.gstAmount}
                      onChange={e => setNewItem({ ...newItem, gstAmount: e.target.value })} className="input  mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">Final Amount</label>
                    <input placeholder="Final Amount"
                      value={newItem.finalAmount}
                      onChange={e => setNewItem({ ...newItem, finalAmount: e.target.value })} className="input  mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">Delivery Date</label>
                    <input type="date"
                      value={newItem.deliveryDate}
                      onChange={e => setNewItem({ ...newItem, deliveryDate: e.target.value })} className="input  mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700">Remarks</label>
                    <input placeholder="Remarks"
                      value={newItem.remarks}
                      onChange={e => setNewItem({ ...newItem, remarks: e.target.value })} className="input  mt-1" />
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
                      <th className="border p-2">Quality</th>
                      <th className="border p-2">Buyer Product</th>
                      <th className="border p-2">Order Qty</th>
                      <th className="border p-2">Price/Unit</th>
                      <th className="border p-2">GST %</th>
                      <th className="border p-2">Total Amount</th>
                      <th className="border p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item: any, index: any) => (
                      <tr key={index} className="border">
                        <td className="border p-2">{index + 1}</td>
                        <td className="border p-2">{item.quality}</td>
                        <td className="border p-2">{item.buyerProduct}</td>
                        <td className="border p-2">{item.orderQty}</td>
                        <td className="border p-2">{item.pricePerUnit}</td>
                        <td className="border p-2">{item.gstPercent}%</td>
                        <td className="border p-2">₹{(item.pricePerUnit * item.orderQty * (1 + item.gstPercent / 100)).toFixed(2)}</td>
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
          </>
        )}
      </div>
    </div>
  );
};

export default SalesOrderEntry;
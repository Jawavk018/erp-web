// import { useState, useEffect } from 'react';
// import { Calendar, ChevronsUpDown, FileText, DollarSign, Send, Trash2, Save, Printer } from 'lucide-react';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '@/state/store';
// import { getAllSalesOrders } from '@/state/salesOrderSlice';
// import { getAllCustomers } from '@/state/customerSlice';
// import { getAllTermsConditions } from '@/state/termsConditions';
// import { getAllShipmentModes } from '@/state/shipmentModeSlice';
// import { getAllConsignee } from '@/state/consigneeSlice';
// import dynamic from 'next/dynamic';
// import { getAllPaymentTerms } from '@/state/paymentTermsSlice';
// import { createInvoice, getLastInvoiceNumber } from '@/state/invoiceSlice';
// import { toast } from 'react-toastify';

// // Dynamically import html2canvas and jsPDF to avoid SSR issues
// // const html2canvas = dynamic(() => import('html2canvas'), { ssr: false }) as any;
// // const jsPDF = dynamic(() => import('jspdf'), { ssr: false }) as any;

// interface InvoiceItem {
//   id: number;
//   productName: string;
//   productDescription: string;
//   quantity: number;
//   uom: string;
//   rate: number;
//   amount: number;
// }

// interface InvoiceData {
//   date: string;
//   invoiceNo: string;
//   soNo: string;
//   companyBank: string;
//   manufacturer: {
//     name: string;
//     address: string;
//   };
//   termsAndConditions: string;
//   paymentTerms: string;
//   shipTo: string;
//   shipVia: string;
//   buyer: {
//     name: string;
//     address: string;
//   };
//   consignee: {
//     name: string;
//     address: string;
//   };
//   items: InvoiceItem[];
//   additional: number;
//   less: number;
//   taxAmount: number;
//   comments: string;
// }

// export default function GenerateInvoice() {
//   const dispatch = useDispatch<AppDispatch>();
//   const { salesOrderList } = useSelector((state: RootState) => state.salesOrder);
//   const { customerList } = useSelector((state: RootState) => state.customer);
//   const { termsContitionsList } = useSelector((state: RootState) => state.termsConditions);
//   const { shipmentModesList } = useSelector((state: RootState) => state.shipmentMode);
//   const { paymentTermsList } = useSelector((state: RootState) => state.paymentTerms);
//   const { consigneeList } = useSelector((state: RootState) => state.consignee);
//   const { loading, error, lastInvoiceNumber } = useSelector((state: RootState) => state.invoice);
//   console.log(salesOrderList)
//   const [selectedSalesOrder, setSelectedSalesOrder] = useState<string>('');

//   // Function to generate invoice number
//   const generateInvoiceNumber = (lastNumber: string | null) => {
//     if (!lastNumber) {
//       // If no last number, start with current date format
//       const date = new Date();
//       const year = date.getFullYear().toString().slice(-2);
//       const month = (date.getMonth() + 1).toString().padStart(2, '0');
//       return `INV${year}${month}0001`;
//     }

//     // Extract the numeric part and increment
//     const numericPart = lastNumber.match(/\d+$/);
//     if (numericPart) {
//       const nextNumber = (parseInt(numericPart[0]) + 1).toString().padStart(4, '0');
//       return lastNumber.replace(/\d+$/, nextNumber);
//     }

//     // Fallback if format doesn't match
//     return `INV${new Date().getFullYear().toString().slice(-2)}${(new Date().getMonth() + 1).toString().padStart(2, '0')}0001`;
//   };

//   const [invoiceData, setInvoiceData] = useState<InvoiceData>({
//     date: new Date().toISOString().split('T')[0],
//     invoiceNo: '', // Will be set after fetching last invoice number
//     soNo: '',
//     companyBank: '',
//     manufacturer: {
//       name: 'ABC Company',
//       address: 'XXX Street'
//     },
//     termsAndConditions: '',
//     paymentTerms: 'Net 60 Days',
//     shipTo: '',
//     shipVia: '',
//     buyer: {
//       name: '',
//       address: ''
//     },
//     consignee: {
//       name: '',
//       address: ''
//     },
//     items: [],
//     additional: 0,
//     less: 0,
//     taxAmount: 0,
//     comments: '',
//   });

//   const [selectedValues, setSelectedValues] = useState({
//     manufactureId: 1, // Set default or get from form
//     companyBankId: '',
//     termsConditionsId: '',
//     paymentTermsId: '',
//     shipToId: '',
//     shipmentMode: '',
//     customerId: '',
//     consgineeId: ''
//   });

//   useEffect(() => {
//     // Fetch all necessary data
//     dispatch(getAllSalesOrders({}));
//     dispatch(getAllCustomers({}));
//     dispatch(getAllTermsConditions({}));
//     dispatch(getAllShipmentModes({}));
//     dispatch(getAllConsignee({}));
//     dispatch(getAllPaymentTerms({}));
//     dispatch(getLastInvoiceNumber()); // Fetch last invoice number
//   }, [dispatch]);

//   // Set invoice number when lastInvoiceNumber changes
//   useEffect(() => {
//     if (invoiceData.invoiceNo === '') {
//       setInvoiceData(prev => ({
//         ...prev,
//         invoiceNo: generateInvoiceNumber(lastInvoiceNumber)
//       }));
//     }
//   }, [lastInvoiceNumber]);

//   // Handle sales order selection
//   const handleSalesOrderChange = (soId: string) => {
//     const selectedSO = salesOrderList.find((so: any) => so.id === Number(soId));
//     console.log(selectedSO)
//     if (selectedSO) {
//       setSelectedSalesOrder(soId);
//       const updatedInvoiceData: InvoiceData = {
//         ...invoiceData,
//         soNo: selectedSO.salesOrderNo,
//         buyer: {
//           name: selectedSO.buyerCustomer?.customerName || '',
//           address: selectedSO.buyerCustomer?.address || ''
//         },
//         consignee: {
//           name: selectedSO.deliverTo?.consigneeName || '',
//           address: selectedSO.deliverTo?.address || ''
//         },
//         termsAndConditions: selectedSO.termsConditions?.termName || '',
//         shipVia: selectedSO.modeOfShipment?.modeName || '',
//         items: selectedSO.items.map((item: any) => ({
//           id: item.id,
//           productName: item.buyerProduct || '',
//           productDescription: item.quality || '',
//           quantity: item.orderQty || 0,
//           uom: item.uom?.uomName || 'Mtrs',
//           rate: item.pricePerUnit || 0,
//           amount: (item.orderQty * item.pricePerUnit) || 0
//         }))
//       };
//       setInvoiceData(updatedInvoiceData);
//       console.log(invoiceData)
//     }
//   };

//   // Calculate totals
//   const subtotal = invoiceData.items.reduce((sum, item) => sum + item.amount, 0);
//   const totalAmount = subtotal + invoiceData.additional - invoiceData.less + invoiceData.taxAmount;

//   // Handle select changes
//   const handleSelectChange = (field: string, value: string) => {
//     setSelectedValues(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   // Save invoice
//   const saveInvoice = async () => {
//     try {
//       const payload = {
//         id: 0,
//         manufactureId: selectedValues.manufactureId,
//         invoiceDate: invoiceData.date,
//         invoiceNo: invoiceData.invoiceNo,
//         salesOrderId: Number(selectedSalesOrder),
//         companyBankId: Number(selectedValues.companyBankId),
//         termsConditionsId: Number(selectedValues.termsConditionsId),
//         paymentTermsId: Number(selectedValues.paymentTermsId),
//         shipToId: Number(selectedValues.shipToId),
//         shipmentMode: Number(selectedValues.shipmentMode),
//         customerId: Number(selectedValues.customerId),
//         consgineeId: Number(selectedValues.consgineeId),
//         taxAmount: invoiceData.taxAmount,
//         totalAmount: totalAmount,
//         comments: invoiceData.comments,
//         activeFlag: true
//       };

//       const result = await dispatch(createInvoice(payload));
//       if (createInvoice.fulfilled.match(result)) {
//         // toast.success('Invoice created successfully');
//         // Optionally reset form or redirect
//       }
//     }
//     catch (error) {
//       // console.error('Error saving invoice:', error);
//       // toast.error('Failed to save invoice');
//     }
//   };

//   // Download invoice as PDF
//   const downloadInvoice = async () => {
//     const element = document.getElementById('invoice-content');
//     if (!element) return;
//   };

//   const handleItemChange = (id: number, field: keyof InvoiceItem, value: any) => {
//     const updatedInvoiceData: InvoiceData = {
//       ...invoiceData,
//       items: invoiceData.items.map(item => {
//         if (item.id === id) {
//           const updatedItem = { ...item, [field]: value };

//           // Auto-calculate amount if quantity or rate changes
//           if (field === 'quantity' || field === 'rate') {
//             const quantity = field === 'quantity' ? value : item.quantity;
//             const rate = field === 'rate' ? value : item.rate;
//             updatedItem.amount = quantity * rate;
//           }

//           return updatedItem;
//         }
//         return item;
//       })
//     };
//     setInvoiceData(updatedInvoiceData);
//   };

//   const addItem = () => {
//     const newId = invoiceData.items.length > 0
//       ? Math.max(...invoiceData.items.map(item => item.id)) + 1
//       : 1;

//     const newItem: InvoiceItem = {
//       id: newId,
//       productName: '',
//       productDescription: '',
//       quantity: 0,
//       uom: 'Mtrs',
//       rate: 0,
//       amount: 0
//     };

//     const updatedInvoiceData: InvoiceData = {
//       ...invoiceData,
//       items: [...invoiceData.items, newItem]
//     };
//     setInvoiceData(updatedInvoiceData);
//   };

//   const removeItem = (id: number) => {
//     const updatedInvoiceData: InvoiceData = {
//       ...invoiceData,
//       items: invoiceData.items.filter(item => item.id !== id)
//     };
//     setInvoiceData(updatedInvoiceData);
//   };

//   return (
//     <div className="mt-10 p-6 bg-white shadow-md rounded-lg mt-16">
//       {/* <div className="flex flex-col min-h-screen bg-gray-50"> */}
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
//           <div className="flex items-center space-x-3">
//             <FileText className="h-6 w-6 text-blue-600" />
//             <h1 className="text-xl font-semibold text-gray-900">Invoice</h1>
//           </div>
//           <div className="flex space-x-4">
//             <button
//               onClick={saveInvoice}
//               disabled={loading}
//               className={`px-3 py-2 bg-blue-600 text-white rounded-md flex items-center space-x-1 text-sm hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
//             >
//               <Save className="h-4 w-4" />
//               <span>{loading ? 'Saving...' : 'Save'}</span>
//             </button>
//             <button
//               onClick={downloadInvoice}
//               className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md flex items-center space-x-1 text-sm hover:bg-gray-200"
//             >
//               <Printer className="h-4 w-4" />
//               <span>Download PDF</span>
//             </button>
//             <button className="px-3 py-2 bg-red-600 text-white rounded-md flex items-center space-x-1 text-sm hover:bg-red-700">
//               <Trash2 className="h-4 w-4" />
//               <span>Cancel Invoice</span>
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Main content */}
//       {/* <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8"> */}
//       <div className="mt-10">
//         <div className="bg-white shadow rounded-lg overflow-hidden">
//           {/* Invoice header section */}
//           <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-b">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 By <span className="text-red-500">*</span>
//               </label>
//               <div className="flex mb-4">
//                 <select
//                   className="rounded-l-md border border-r-0 border-gray-300 py-2 px-3 text-sm w-full focus:ring-blue-500 focus:border-blue-500"
//                   value="Manufacturer"
//                 >
//                   <option value="Manufacturer">Manufacturer</option>
//                   <option value="Other">Other</option>
//                 </select>
//                 <button className="bg-gray-100 border border-gray-300 rounded-r-md p-2">
//                   <ChevronsUpDown className="h-4 w-4 text-gray-500" />
//                 </button>
//               </div>
//               <textarea
//                 className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
//                 rows={3}
//                 value={`${invoiceData.manufacturer.name}\n${invoiceData.manufacturer.address}`}
//               />

//               {/* Comments section */}
//               {/* <div className="p-6 border-b"> */}
//               <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
//               <textarea
//                 className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
//                 rows={2}
//                 value={invoiceData.comments}
//               />
//               {/* </div> */}

//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
//                 <div className="flex">
//                   <input
//                     type="date"
//                     className="rounded-l-md border border-r-0 border-gray-300 py-2 px-3 text-sm w-full focus:ring-blue-500 focus:border-blue-500"
//                     value={invoiceData.date}
//                   />
//                   <button className="bg-gray-100 border border-gray-300 rounded-r-md p-2">
//                     <Calendar className="h-4 w-4 text-gray-500" />
//                   </button>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Invoice No.</label>
//                 <input
//                   type="text"
//                   className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
//                   value={invoiceData.invoiceNo}
//                   readOnly
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">SO No.</label>
//                 {/* <input
//                   type="text"
//                   className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
//                   value={invoiceData.soNo}
//                 /> */}
//                 <select
//                   className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
//                   onChange={(e) => handleSalesOrderChange(e.target.value)}
//                   value={selectedSalesOrder}  // optional if you're controlling the component
//                 >
//                   <option value="">Select Sales Order</option>
//                   {salesOrderList?.map((tc: any) => (
//                     <option key={tc.id} value={tc.id}>
//                       {tc.salesOrderNo}
//                     </option>
//                   ))}
//                 </select>

//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Company's Bank</label>
//                 <select
//                   className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
//                   value={selectedValues.companyBankId}
//                   onChange={(e) => handleSelectChange('companyBankId', e.target.value)}
//                 >
//                   <option value="">Select Bank</option>
//                   {/* Add your bank options here */}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Terms And Conditions</label>
//                 <select
//                   className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
//                   value={selectedValues.termsConditionsId}
//                   onChange={(e) => handleSelectChange('termsConditionsId', e.target.value)}
//                 >
//                   <option value="">Select Terms and Conditions</option>
//                   {termsContitionsList?.map((tc: any) => (
//                     <option key={tc.id} value={tc.id}>
//                       {tc.termsConditionsName}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Ship To</label>
//                 <select
//                   className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
//                 // value={invoiceData.shipTo}
//                 >
//                   <option value="">Select Terms and Conditions</option>
//                   {termsContitionsList?.map((tc: any) => (
//                     <option key={tc.id} value={tc.id}>
//                       {tc.termsConditionsName}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
//                 <select
//                   className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
//                   value={selectedValues.paymentTermsId}
//                   onChange={(e) => handleSelectChange('paymentTermsId', e.target.value)}
//                 >
//                   <option value="">Select Payment Terms</option>
//                   {paymentTermsList?.map((pt: any) => (
//                     <option key={pt.id} value={pt.id}>
//                       {pt.termName}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Ship Via <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
//                   value={selectedValues.shipmentMode}
//                   onChange={(e) => handleSelectChange('shipmentMode', e.target.value)}
//                 >
//                   <option value="">Select Shipment Mode</option>
//                   {shipmentModesList?.map((sm: any) => (
//                     <option key={sm.id} value={sm.id}>
//                       {sm.modeName}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* Buyer and Consignee section */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-b">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Buyer <span className="text-red-500">*</span>
//               </label>
//               <div className="flex mb-2">
//                 <select
//                   className="rounded-l-md border border-r-0 border-gray-300 py-2 px-3 text-sm w-full focus:ring-blue-500 focus:border-blue-500"
//                   value={selectedValues.customerId}
//                   onChange={(e) => handleSelectChange('customerId', e.target.value)}
//                 >
//                   <option value="">Select an Buyer</option>
//                   {customerList?.map((customer: any) => (
//                     <option key={customer.id} value={customer.id}>
//                       {customer.customerName}
//                     </option>
//                   ))}
//                 </select>
//                 <button className="bg-gray-100 border border-gray-300 rounded-r-md p-2">
//                   <ChevronsUpDown className="h-4 w-4 text-gray-500" />
//                 </button>
//               </div>
//               <textarea
//                 className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
//                 rows={3}
//                 value={invoiceData.buyer.address}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Buyer <span className="text-red-500">*</span>
//               </label>
//               <div className="flex mb-2">
//                 <select
//                   className="rounded-l-md border border-r-0 border-gray-300 py-2 px-3 text-sm w-full focus:ring-blue-500 focus:border-blue-500"
//                   value={selectedValues.consgineeId}
//                   onChange={(e) => handleSelectChange('consgineeId', e.target.value)}
//                 >
//                   <option value="">Select an Consignee</option>
//                   {consigneeList?.map((consignee: any) => (
//                     <option key={consignee.id} value={consignee.id}>
//                       {consignee.consigneeName}
//                     </option>
//                   ))}
//                 </select>
//                 <button className="bg-gray-100 border border-gray-300 rounded-r-md p-2">
//                   <ChevronsUpDown className="h-4 w-4 text-gray-500" />
//                 </button>
//               </div>
//               <textarea
//                 className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
//                 rows={3}
//                 value={invoiceData.buyer.address}
//               />
//             </div>
//             {/* <div >
//             <select
//                   className="rounded-l-md border border-r-0 border-gray-300 py-2 px-3 text-sm w-full focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">Select an Consignee</option>
//                   {consigneeList?.map((consignee: any) => (
//                     <option key={consignee.id} value={consignee.id}>
//                       {consignee.consigneeName}
//                     </option>
//                   ))}
//                 </select>
//               <div className="flex mb-2">
//                 <select
//                   className="rounded-l-md border border-r-0 border-gray-300 py-2 px-3 text-sm w-full focus:ring-blue-500 focus:border-blue-500"
//                   value="AK APPAREL"
//                 >
//                   <option value="AK APPAREL">AK APPAREL</option>
//                   <option value="Other">Other</option>
//                 </select>
//                 <button className="bg-gray-100 border border-gray-300 rounded-r-md p-2">
//                   <ChevronsUpDown className="h-4 w-4 text-gray-500" />
//                 </button>
//               </div>
//               <textarea
//                 className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
//                 rows={3}
//                 value={invoiceData.consignee.address}
//               />
//             </div> */}
//           </div>

//           {/* Invoice items table */}
//           <div className="overflow-x-auto border-b">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
//                     Sl. No.
//                   </th>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Product Name
//                   </th>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Product Description
//                   </th>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
//                     Quantity
//                   </th>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
//                     UOM
//                   </th>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
//                     Rate (USD)
//                   </th>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
//                     Amount
//                   </th>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
//                     <span className="sr-only">Actions</span>
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {invoiceData.items.map((item, index) => (
//                   <tr key={item.id}>
//                     <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
//                       {item.id}
//                     </td>
//                     <td className="px-4 py-2 whitespace-nowrap">
//                       <input
//                         type="text"
//                         className="w-full border border-gray-300 rounded-md py-1 px-2 text-sm focus:ring-blue-500 focus:border-blue-500"
//                         value={item.productName}
//                         onChange={(e) => handleItemChange(item.id, 'productName', e.target.value)}
//                       />
//                     </td>
//                     <td className="px-4 py-2 whitespace-nowrap">
//                       <input
//                         type="text"
//                         className="w-full border border-gray-300 rounded-md py-1 px-2 text-sm focus:ring-blue-500 focus:border-blue-500"
//                         value={item.productDescription}
//                         onChange={(e) => handleItemChange(item.id, 'productDescription', e.target.value)}
//                       />
//                     </td>
//                     <td className="px-4 py-2 whitespace-nowrap">
//                       <input
//                         type="number"
//                         className="w-full border border-gray-300 rounded-md py-1 px-2 text-sm focus:ring-blue-500 focus:border-blue-500"
//                         value={item.quantity}
//                         onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
//                       />
//                     </td>
//                     <td className="px-4 py-2 whitespace-nowrap">
//                       <select
//                         className="w-full border border-gray-300 rounded-md py-1 px-2 text-sm focus:ring-blue-500 focus:border-blue-500"
//                         value={item.uom}
//                         onChange={(e) => handleItemChange(item.id, 'uom', e.target.value)}
//                       >
//                         <option value="Mtrs">Mtrs</option>
//                         <option value="Pcs">Pcs</option>
//                         <option value="Kg">Kg</option>
//                       </select>
//                     </td>
//                     <td className="px-4 py-2 whitespace-nowrap">
//                       <input
//                         type="number"
//                         className="w-full border border-gray-300 rounded-md py-1 px-2 text-sm focus:ring-blue-500 focus:border-blue-500"
//                         value={item.rate}
//                         onChange={(e) => handleItemChange(item.id, 'rate', Number(e.target.value))}
//                       />
//                     </td>
//                     <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
//                       Rs. {item.amount.toLocaleString()}
//                     </td>
//                     <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
//                       <button
//                         onClick={() => removeItem(item.id)}
//                         className="text-red-600 hover:text-red-900"
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Add more items button */}
//           <div className="p-4 border-b">
//             <button
//               onClick={addItem}
//               className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100"
//             >
//               + Add Another Item
//             </button>
//           </div>

//           {/* Additional charges section */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
//             <div className="space-y-4">
//               <div>
//                 <h3 className="py-2 px-4 bg-blue-800 text-white text-sm font-medium rounded-t-md">ADDITIONAL CHARGES</h3>
//                 <div className="p-4 border border-gray-200 rounded-b-md space-y-3">
//                   <div className="flex items-center space-x-3">
//                     <input
//                       type="checkbox"
//                       id="additional-1"
//                       className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
//                     />
//                     <label htmlFor="additional-1" className="text-sm text-gray-700">Additional Charge 1</label>
//                     <input
//                       type="number"
//                       className="ml-auto w-32 border border-gray-300 rounded-md py-1 px-2 text-sm focus:ring-blue-500 focus:border-blue-500"
//                       placeholder="0.00"
//                     />
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <input
//                       type="checkbox"
//                       id="additional-2"
//                       className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
//                     />
//                     <label htmlFor="additional-2" className="text-sm text-gray-700">Additional Charge 2</label>
//                     <input
//                       type="number"
//                       className="ml-auto w-32 border border-gray-300 rounded-md py-1 px-2 text-sm focus:ring-blue-500 focus:border-blue-500"
//                       placeholder="0.00"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <h3 className="py-2 px-4 bg-blue-800 text-white text-sm font-medium rounded-t-md">LESS CHARGES</h3>
//                 <div className="p-4 border border-gray-200 rounded-b-md space-y-3">
//                   <div className="flex items-center space-x-3">
//                     <input
//                       type="checkbox"
//                       id="less-1"
//                       className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
//                     />
//                     <label htmlFor="less-1" className="text-sm text-gray-700">Discount</label>
//                     <input
//                       type="number"
//                       className="ml-auto w-32 border border-gray-300 rounded-md py-1 px-2 text-sm focus:ring-blue-500 focus:border-blue-500"
//                       placeholder="0.00"
//                     />
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <input
//                       type="checkbox"
//                       id="less-2"
//                       className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
//                     />
//                     <label htmlFor="less-2" className="text-sm text-gray-700">Rebate</label>
//                     <input
//                       type="number"
//                       className="ml-auto w-32 border border-gray-300 rounded-md py-1 px-2 text-sm focus:ring-blue-500 focus:border-blue-500"
//                       placeholder="0.00"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-col justify-end">
//               <div className="space-y-3 border-t pt-4 border-gray-200">
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm font-medium text-gray-700">ADD:</span>
//                   <div className="w-48">
//                     <input
//                       type="number"
//                       className="w-full border border-gray-300 rounded-md py-1 px-2 text-sm text-right focus:ring-blue-500 focus:border-blue-500"
//                       value={invoiceData.additional}
//                     />
//                   </div>
//                 </div>

//                 <div className="flex justify-between items-center">
//                   <span className="text-sm font-medium text-gray-700">LESS:</span>
//                   <div className="w-48">
//                     <input
//                       type="number"
//                       className="w-full border border-gray-300 rounded-md py-1 px-2 text-sm text-right focus:ring-blue-500 focus:border-blue-500"
//                       value={invoiceData.less}
//                     />
//                   </div>
//                 </div>

//                 <div className="flex justify-between items-center">
//                   <span className="text-sm font-medium text-gray-700">TAX Amount:</span>
//                   <div className="w-48">
//                     <input
//                       type="number"
//                       className="w-full border border-gray-300 rounded-md py-1 px-2 text-sm text-right focus:ring-blue-500 focus:border-blue-500"
//                       value={invoiceData.taxAmount}
//                     />
//                   </div>
//                 </div>

//                 <div className="flex justify-between items-center border-t border-gray-200 pt-3">
//                   <span className="text-base font-semibold text-gray-900">Total Amount:</span>
//                   <div className="w-48">
//                     <input
//                       type="text"
//                       className="w-full bg-gray-50 border border-gray-300 rounded-md py-2 px-3 text-right text-base font-bold text-gray-900 focus:ring-blue-500 focus:border-blue-500"
//                       value={`Rs. ${totalAmount.toLocaleString()}`}
//                       readOnly
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* </main> */}
//       </div>

//       {/* Footer */}
//       <footer className="bg-white border-t">
//         <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
//           <p className="text-sm text-gray-500">
//             &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
//           </p>
//           <button className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center space-x-1 text-sm hover:bg-green-700">
//             <Send className="h-4 w-4" />
//             <span>Send Invoice</span>
//           </button>
//         </div>
//       </footer>
//     </div>
//   );
// }




import { useState, useEffect } from 'react';
import { Calendar, ChevronsUpDown, FileText, DollarSign, Send, Trash2, Save, Printer } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/state/store';
import { getAllSalesOrders } from '@/state/salesOrderSlice';
import { getAllCustomers } from '@/state/customerSlice';
import { getAllTermsConditions } from '@/state/termsConditions';
import { getAllShipmentModes } from '@/state/shipmentModeSlice';
import { getAllConsignee } from '@/state/consigneeSlice';
import dynamic from 'next/dynamic';
import { getAllPaymentTerms } from '@/state/paymentTermsSlice';
import { createInvoice, getLastInvoiceNumber } from '@/state/invoiceSlice';
import { toast } from 'react-toastify';

// Dynamically import html2canvas and jsPDF to avoid SSR issues
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';

interface InvoiceItem {
  id: number;
  productName: string;
  productDescription: string;
  quantity: number;
  uom: string;
  rate: number;
  amount: number;
}

interface InvoiceData {
  date: string;
  invoiceNo: string;
  soNo: string;
  companyBank: string;
  manufacturer: {
    name: string;
    address: string;
  };
  termsAndConditions: string;
  paymentTerms: string;
  shipTo: string;
  shipVia: string;
  buyer: {
    name: string;
    address: string;
  };
  consignee: {
    name: string;
    address: string;
  };
  items: InvoiceItem[];
  additional: number;
  less: number;
  taxAmount: number;
  comments: string;
}

export default function GenerateInvoice() {
  const dispatch = useDispatch<AppDispatch>();
  const { salesOrderList } = useSelector((state: RootState) => state.salesOrder);
  const { customerList } = useSelector((state: RootState) => state.customer);
  const { termsContitionsList } = useSelector((state: RootState) => state.termsConditions);
  const { shipmentModesList } = useSelector((state: RootState) => state.shipmentMode);
  const { paymentTermsList } = useSelector((state: RootState) => state.paymentTerms);
  const { consigneeList } = useSelector((state: RootState) => state.consignee);
  const { loading, error, lastInvoiceNumber } = useSelector((state: RootState) => state.invoice);

  const [selectedSalesOrder, setSelectedSalesOrder] = useState<string>('');
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  // Function to generate invoice number
  const generateInvoiceNumber = (lastNumber: string | null) => {
    if (!lastNumber) {
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      return `INV${year}${month}0001`;
    }

    const numericPart = lastNumber.match(/\d+$/);
    if (numericPart) {
      const nextNumber = (parseInt(numericPart[0]) + 1).toString().padStart(4, '0');
      return lastNumber.replace(/\d+$/, nextNumber);
    }

    return `INV${new Date().getFullYear().toString().slice(-2)}${(new Date().getMonth() + 1).toString().padStart(2, '0')}0001`;
  };

  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    date: new Date().toISOString().split('T')[0],
    invoiceNo: '',
    soNo: '',
    companyBank: '',
    manufacturer: {
      name: 'ABC Company',
      address: 'XXX Street'
    },
    termsAndConditions: '',
    paymentTerms: 'Net 60 Days',
    shipTo: '',
    shipVia: '',
    buyer: {
      name: '',
      address: ''
    },
    consignee: {
      name: '',
      address: ''
    },
    items: [],
    additional: 0,
    less: 0,
    taxAmount: 0,
    comments: '',
  });

  const [selectedValues, setSelectedValues] = useState({
    manufactureId: 1,
    companyBankId: '',
    termsConditionsId: '',
    paymentTermsId: '',
    shipToId: '',
    shipmentMode: '',
    customerId: '',
    consgineeId: ''
  });

  useEffect(() => {
    dispatch(getAllSalesOrders({}));
    dispatch(getAllCustomers({}));
    dispatch(getAllTermsConditions({}));
    dispatch(getAllShipmentModes({}));
    dispatch(getAllConsignee({}));
    dispatch(getAllPaymentTerms({}));
    // dispatch(getLastInvoiceNumber());
  }, [dispatch]);

  useEffect(() => {
    if (invoiceData.invoiceNo === '') {
      setInvoiceData(prev => ({
        ...prev,
        invoiceNo: generateInvoiceNumber(lastInvoiceNumber)
      }));
    }
  }, [lastInvoiceNumber]);

  // Validate form whenever data changes
  useEffect(() => {
    validateForm();
  }, [invoiceData, selectedValues]);

  const validateForm = () => {
    const requiredFields = [
      selectedValues.customerId,
      selectedValues.consgineeId,
      selectedValues.shipmentMode,
      selectedValues.paymentTermsId,
      selectedValues.termsConditionsId,
      invoiceData.soNo,
      invoiceData.buyer,
      invoiceData.consignee
    ];

    const hasItems = invoiceData.items.length > 0;
    const itemsValid = invoiceData.items.every(item =>
      item.productName && item.quantity > 0 && item.rate > 0
    );

    setIsFormValid(
      requiredFields.every(field => field) &&
      hasItems &&
      itemsValid
    );
  };

  const handleSalesOrderChange = (soId: string) => {
    const selectedSO = salesOrderList.find((so: any) => so.id === Number(soId));
    if (selectedSO) {
      setSelectedSalesOrder(soId);
      const updatedInvoiceData: InvoiceData = {
        ...invoiceData,
        soNo: selectedSO.salesOrderNo,
        buyer: {
          name: selectedSO.buyerCustomer?.customerName || '',
          address: selectedSO.buyerCustomer?.address || ''
        },
        consignee: {
          name: selectedSO.deliverTo?.consigneeName || '',
          address: selectedSO.deliverTo?.address || ''
        },
        termsAndConditions: selectedSO.termsConditions?.termName || '',
        shipVia: selectedSO.modeOfShipment?.modeName || '',
        items: selectedSO.items.map((item: any) => ({
          id: item.id,
          productName: item.buyerProduct || '',
          productDescription: item.quality || '',
          quantity: item.orderQty || 0,
          uom: item.uom?.uomName || 'Mtrs',
          rate: item.pricePerUnit || 0,
          amount: (item.orderQty * item.pricePerUnit) || 0
        }))
      };
      setInvoiceData(updatedInvoiceData);

      // Update selected values
      setSelectedValues(prev => ({
        ...prev,
        customerId: selectedSO.buyerCustomer?.id || '',
        consgineeId: selectedSO.deliverTo?.id || '',
        shipmentMode: selectedSO.modeOfShipment?.id || '',
        paymentTermsId: selectedSO.paymentTerms?.id || '',
        termsConditionsId: selectedSO.termsConditions?.id || ''
      }));
    }
  };

  const subtotal = invoiceData.items.reduce((sum, item) => sum + item.amount, 0);
  const totalAmount = subtotal + invoiceData.additional - invoiceData.less + invoiceData.taxAmount;

  const handleSelectChange = (field: string, value: string) => {
    setSelectedValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveInvoice = async () => {
    if (!isFormValid) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const payload = {
        id: 0,
        manufactureId: selectedValues.manufactureId,
        invoiceDate: invoiceData.date,
        invoiceNo: invoiceData.invoiceNo,
        salesOrderId: Number(selectedSalesOrder),
        companyBankId: Number(selectedValues.companyBankId),
        termsConditionsId: Number(selectedValues.termsConditionsId),
        paymentTermsId: Number(selectedValues.paymentTermsId),
        shipToId: Number(selectedValues.shipToId),
        shipmentMode: Number(selectedValues.shipmentMode),
        customerId: Number(selectedValues.customerId),
        consgineeId: Number(selectedValues.consgineeId),
        taxAmount: invoiceData.taxAmount,
        totalAmount: totalAmount,
        comments: invoiceData.comments,
        activeFlag: true
      };

      const result = await dispatch(createInvoice(payload));
      if (createInvoice.fulfilled.match(result)) {
        // toast.success('Invoice created successfully');
      }
    } catch (error) {
      toast.error('Failed to save invoice');
      console.error('Error saving invoice:', error);
    }
  };


  const downloadInvoice = async () => {
    // const element = document.getElementById('invoice-content');
    // if (!element) return;

    // try {
    //   // @ts-ignore - Temporarily ignore type issues
    //   const html2canvas = (await import('html2canvas')).default;
    //   // @ts-ignore - Temporarily ignore type issues
    //   const { jsPDF } = await import('jspdf');

    //   const canvas = await html2canvas(element);
    //   const pdf = new jsPDF('p', 'mm', 'a4');
    //   pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297); // A4 dimensions
    //   pdf.save(`invoice_${invoiceData.invoiceNo}.pdf`);
    // } catch (error) {
    //   toast.error('Failed to generate PDF');
    //   console.error('Error generating PDF:', error);
    // }
  };


  const handleItemChange = (id: number, field: keyof InvoiceItem, value: any) => {
    const updatedItems = invoiceData.items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };

        if (field === 'quantity' || field === 'rate') {
          const quantity = field === 'quantity' ? value : item.quantity;
          const rate = field === 'rate' ? value : item.rate;
          updatedItem.amount = quantity * rate;
        }

        return updatedItem;
      }
      return item;
    });

    setInvoiceData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const addItem = () => {
    const newId = invoiceData.items.length > 0
      ? Math.max(...invoiceData.items.map(item => item.id)) + 1
      : 1;

    const newItem: InvoiceItem = {
      id: newId,
      productName: '',
      productDescription: '',
      quantity: 0,
      uom: 'Mtrs',
      rate: 0,
      amount: 0
    };

    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (id: number) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  return (
    <div className="mt-10 p-6 bg-white shadow-md rounded-lg mt-16" id="invoice-content">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900">Invoice</h1>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={saveInvoice}
              disabled={loading || !isFormValid}
              className={`px-3 py-2 bg-blue-600 text-white rounded-md flex items-center space-x-1 text-sm hover:bg-blue-700 ${loading || !isFormValid ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : 'Save'}</span>
            </button>
            <button
              onClick={downloadInvoice}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md flex items-center space-x-1 text-sm hover:bg-gray-200"
            >
              <Printer className="h-4 w-4" />
              <span>Download PDF</span>
            </button>
            <button className="px-3 py-2 bg-red-600 text-white rounded-md flex items-center space-x-1 text-sm hover:bg-red-700">
              <Trash2 className="h-4 w-4" />
              <span>Cancel Invoice</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="mt-10">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Invoice header section */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-b">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                By <span className="text-red-500">*</span>
              </label>
              <div className="flex mb-4">
                <select
                  className="rounded-l-md border border-r-0 border-gray-300 py-2 px-3 text-sm w-full focus:ring-blue-500 focus:border-blue-500"
                  value="Manufacturer"
                >
                  <option value="Manufacturer">Manufacturer</option>
                  <option value="Other">Other</option>
                </select>
                <button className="bg-gray-100 border border-gray-300 rounded-r-md p-2">
                  <ChevronsUpDown className="h-4 w-4 text-gray-500" />
                </button>
              </div>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                value={`${invoiceData.manufacturer.name}\n${invoiceData.manufacturer.address}`}
                readOnly
              />

              <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                rows={2}
                value={invoiceData.comments}
                onChange={(e) => setInvoiceData(prev => ({ ...prev, comments: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <div className="flex">
                  <input
                    type="date"
                    className="rounded-l-md border border-r-0 border-gray-300 py-2 px-3 text-sm w-full focus:ring-blue-500 focus:border-blue-500"
                    value={invoiceData.date}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, date: e.target.value }))}
                  />
                  <button className="bg-gray-100 border border-gray-300 rounded-r-md p-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Invoice No.</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                  value={invoiceData.invoiceNo}
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SO No. <span className="text-red-500">*</span></label>
                <select
                  className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => handleSalesOrderChange(e.target.value)}
                  value={selectedSalesOrder}
                  required
                >
                  <option value="">Select Sales Order</option>
                  {salesOrderList?.map((tc: any) => (
                    <option key={tc.id} value={tc.id}>
                      {tc.salesOrderNo}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company's Bank</label>
                <select
                  className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={selectedValues.companyBankId}
                  onChange={(e) => handleSelectChange('companyBankId', e.target.value)}
                >
                  <option value="">Select Bank</option>
                  {/* Add your bank options here */}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Terms And Conditions <span className="text-red-500">*</span></label>
                <select
                  className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={selectedValues.termsConditionsId}
                  onChange={(e) => handleSelectChange('termsConditionsId', e.target.value)}
                  required
                >
                  <option value="">Select Terms and Conditions</option>
                  {termsContitionsList?.map((tc: any) => (
                    <option key={tc.id} value={tc.id}>
                      {tc.termsConditionsName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ship To</label>
                <select
                  className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={selectedValues.shipToId}
                  onChange={(e) => handleSelectChange('shipToId', e.target.value)}
                >
                  <option value="">Select Ship To</option>
                  {consigneeList?.map((consignee: any) => (
                    <option key={consignee.id} value={consignee.id}>
                      {consignee.consigneeName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms <span className="text-red-500">*</span></label>
                <select
                  className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={selectedValues.paymentTermsId}
                  onChange={(e) => handleSelectChange('paymentTermsId', e.target.value)}
                  required
                >
                  <option value="">Select Payment Terms</option>
                  {paymentTermsList?.map((pt: any) => (
                    <option key={pt.id} value={pt.id}>
                      {pt.termName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ship Via <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={selectedValues.shipmentMode}
                  onChange={(e) => handleSelectChange('shipmentMode', e.target.value)}
                  required
                >
                  <option value="">Select Shipment Mode</option>
                  {shipmentModesList?.map((sm: any) => (
                    <option key={sm.id} value={sm.id}>
                      {sm.modeName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Buyer and Consignee section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-b">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buyer <span className="text-red-500">*</span>
              </label>
              <div className="flex mb-2">
                <select
                  className="rounded-l-md border border-r-0 border-gray-300 py-2 px-3 text-sm w-full focus:ring-blue-500 focus:border-blue-500"
                  value={selectedValues.customerId}
                  onChange={(e) => handleSelectChange('customerId', e.target.value)}
                  required
                >
                  <option value="">Select a Buyer</option>
                  {customerList?.map((customer: any) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.customerName}
                    </option>
                  ))}
                </select>
                <button className="bg-gray-100 border border-gray-300 rounded-r-md p-2">
                  <ChevronsUpDown className="h-4 w-4 text-gray-500" />
                </button>
              </div>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                value={invoiceData.buyer.address}
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Consignee <span className="text-red-500">*</span>
              </label>
              <div className="flex mb-2">
                <select
                  className="rounded-l-md border border-r-0 border-gray-300 py-2 px-3 text-sm w-full focus:ring-blue-500 focus:border-blue-500"
                  value={selectedValues.consgineeId}
                  onChange={(e) => handleSelectChange('consgineeId', e.target.value)}
                  required
                >
                  <option value="">Select a Consignee</option>
                  {consigneeList?.map((consignee: any) => (
                    <option key={consignee.id} value={consignee.id}>
                      {consignee.consigneeName}
                    </option>
                  ))}
                </select>
                <button className="bg-gray-100 border border-gray-300 rounded-r-md p-2">
                  <ChevronsUpDown className="h-4 w-4 text-gray-500" />
                </button>
              </div>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                value={invoiceData.consignee.address}
                readOnly
              />
            </div>
          </div>

          {/* Invoice items table */}
          <div className="overflow-x-auto border-b">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                    Sl. No.
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Name <span className="text-red-500">*</span>
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Description
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Quantity <span className="text-red-500">*</span>
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    UOM
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Rate (USD) <span className="text-red-500">*</span>
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Amount
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoiceData.items.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-4 text-center text-sm text-gray-500">
                      No items added. Please add at least one item.
                    </td>
                  </tr>
                ) : (
                  invoiceData.items.map((item, index) => (
                    <tr key={item.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input
                          type="text"
                          className={`w-full border border-gray-300 rounded-md py-1 px-2 text-sm focus:ring-blue-500 focus:border-blue-500 ${!item.productName ? 'border-red-500' : ''
                            }`}
                          value={item.productName}
                          onChange={(e) => handleItemChange(item.id, 'productName', e.target.value)}
                          required
                        />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-md py-1 px-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                          value={item.productDescription}
                          onChange={(e) => handleItemChange(item.id, 'productDescription', e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input
                          type="number"
                          className={`w-full border border-gray-300 rounded-md py-1 px-2 text-sm focus:ring-blue-500 focus:border-blue-500 ${item.quantity <= 0 ? 'border-red-500' : ''
                            }`}
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                          min="0"
                          step="0.01"
                          required
                        />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <select
                          className="w-full border border-gray-300 rounded-md py-1 px-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                          value={item.uom}
                          onChange={(e) => handleItemChange(item.id, 'uom', e.target.value)}
                        >
                          <option value="Mtrs">Mtrs</option>
                          <option value="Pcs">Pcs</option>
                          <option value="Kg">Kg</option>
                        </select>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input
                          type="number"
                          className={`w-full border border-gray-300 rounded-md py-1 px-2 text-sm focus:ring-blue-500 focus:border-blue-500 ${item.rate <= 0 ? 'border-red-500' : ''
                            }`}
                          value={item.rate}
                          onChange={(e) => handleItemChange(item.id, 'rate', Number(e.target.value))}
                          min="0"
                          step="0.01"
                          required
                        />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                        Rs. {item.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Add more items button */}
          <div className="p-4 border-b">
            <button
              onClick={addItem}
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100"
            >
              + Add Another Item
            </button>
          </div>

          {/* Additional charges section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            <div className="space-y-4">
              <div>
                <h3 className="py-2 px-4 bg-blue-800 text-white text-sm font-medium rounded-t-md">ADDITIONAL CHARGES</h3>
                <div className="p-4 border border-gray-200 rounded-b-md space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="additional-1"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                    />
                    <label htmlFor="additional-1" className="text-sm text-gray-700">Additional Charge 1</label>
                    <input
                      type="number"
                      className="ml-auto w-32 border border-gray-300 rounded-md py-1 px-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                      value={invoiceData.additional}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, additional: Number(e.target.value) }))}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="py-2 px-4 bg-blue-800 text-white text-sm font-medium rounded-t-md">LESS CHARGES</h3>
                <div className="p-4 border border-gray-200 rounded-b-md space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="less-1"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                    />
                    <label htmlFor="less-1" className="text-sm text-gray-700">Discount</label>
                    <input
                      type="number"
                      className="ml-auto w-32 border border-gray-300 rounded-md py-1 px-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                      value={invoiceData.less}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, less: Number(e.target.value) }))}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-end">
              <div className="space-y-3 border-t pt-4 border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Subtotal:</span>
                  <div className="w-48">
                    <input
                      type="text"
                      className="w-full bg-gray-50 border border-gray-300 rounded-md py-1 px-2 text-right text-sm font-medium text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      value={`Rs. ${subtotal.toLocaleString()}`}
                      readOnly
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">ADD:</span>
                  <div className="w-48">
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-md py-1 px-2 text-sm text-right focus:ring-blue-500 focus:border-blue-500"
                      value={invoiceData.additional}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, additional: Number(e.target.value) }))}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">LESS:</span>
                  <div className="w-48">
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-md py-1 px-2 text-sm text-right focus:ring-blue-500 focus:border-blue-500"
                      value={invoiceData.less}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, less: Number(e.target.value) }))}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">TAX Amount:</span>
                  <div className="w-48">
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-md py-1 px-2 text-sm text-right focus:ring-blue-500 focus:border-blue-500"
                      value={invoiceData.taxAmount}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, taxAmount: Number(e.target.value) }))}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                  <span className="text-base font-semibold text-gray-900">Total Amount:</span>
                  <div className="w-48">
                    <input
                      type="text"
                      className="w-full bg-gray-50 border border-gray-300 rounded-md py-2 px-3 text-right text-base font-bold text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      value={`Rs. ${totalAmount.toLocaleString()}`}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
          </p>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center space-x-1 text-sm hover:bg-green-700">
            <Send className="h-4 w-4" />
            <span>Send Invoice</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
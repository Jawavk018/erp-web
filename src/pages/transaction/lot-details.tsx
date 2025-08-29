import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ClipboardList, Edit, Trash2, Save, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { createPurchaseInward } from "@/state/purchaseInwardSlice";
import { getAllPoTypes } from '@/state/purchaseOrderSlice';

interface LotEntry {
  id: number;
  // lotNumber: string;
  quantity: number;
  rejectedQuantity: number;
  remarks: string;
  cost: number;
  openDate: string;
  warehouseId: string
}

const LotDetails = () => {
  
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { register, handleSubmit, reset, watch } = useForm();
  const [selectedItem] = useState(location.state?.selectedItems[0] || null);
  console.log('selectedItem Details',selectedItem);
  const [lotEntries, setLotEntries] = useState<LotEntry[]>([]);
  const [numberOfLots, setNumberOfLots] = useState<string>('0');
  const [currentLotEntry, setCurrentLotEntry] = useState<Partial<LotEntry>>({});
  const [lotEntriesDraft, setLotEntriesDraft] = useState<Partial<LotEntry>[]>([]);
  const [lots, setLots] = useState<Array<{ id: number; pieceNumber: string }>>([]);
  const { warehouseList } = useSelector((state: RootState) => state.warehouse);  
  const { purchaseOrderTypeList } = useSelector((state: RootState) => state.purchaseOrder);  


  useEffect(() => {
    if (!selectedItem) {
      navigate('/purchase-inward');
    }
  }, [selectedItem, navigate]);

  if (!selectedItem) {
    return null;
  }

   useEffect(() => {
      dispatch(getAllPoTypes({}));
      console.log('Purchase Order Types:', purchaseOrderTypeList);
      console.log('Selected Item:', selectedItem);
    }, [dispatch]);

  const handleAddLot = () => {
    const validEntries = lotEntriesDraft.filter(e => e.quantity);
    if (!validEntries.length) {
      return;
    }

    const entriesToAdd: LotEntry[] = validEntries.map((entry, i) => ({
      id: lotEntries.length + i + 1,
      // lotNumber: entry.lotNumber || '',
      quantity: entry.quantity || 0,
      rejectedQuantity: entry.rejectedQuantity || 0,
      remarks: entry.remarks || '',
      cost: entry.cost || 0,
      warehouseId: entry.warehouseId || '',
      openDate: new Date().toISOString().split('T')[0]
    }));

    setLotEntries([...lotEntries, ...entriesToAdd]);
    setLotEntriesDraft([]);
    setLots([]);
    setNumberOfLots('0');
  };

  const handleDeleteLot = (id: number) => {
    setLotEntries(lotEntries.filter(entry => entry.id !== id));
  };

  const handleEditLot = (entry: LotEntry) => {
    setCurrentLotEntry(entry);
    handleDeleteLot(entry.id);
  };

  const handleSave = async () => {
    const payload = {
      id: 0,
      inwardDate: new Date().toISOString(),
      remarks: selectedItem.remarks,
      activeFlag: true,
      purchaseOrderId: selectedItem.poId,
      purchaseInwardItemsDtl: [{
        id: 0,
        inwardId: 0,
        poItemId: selectedItem.id,
        quantityReceived: selectedItem.quantityReceived,
        price: selectedItem.price,
        activeFlag: true,
        lotEntries: lotEntries.map(entry => ({
          id: 0,
          warehouseId: entry.warehouseId,
          quantity: entry.quantity,
          rejectedQuantity: entry.rejectedQuantity,
          cost: entry.cost,
          remarks: entry.remarks,
          activeFlag: true
        }))
      }]
    };

    try {
      await dispatch(createPurchaseInward(payload));
      navigate('/transaction/purchase-inward-details');
    } catch (error) {
      console.error('Failed to create purchase inward:', error);
    }
  };

  const handleAddPieces = () => {
    const count = parseInt(numberOfLots || '0', 10);
    if (isNaN(count) || count <= 0) return;

    const newDrafts = Array.from({ length: count }, (_, index) => ({
      id: lots.length + index + 1,
      // lotNumber: `Lot ${pieces.length + index + 1}`,
      lotNumber: '',
      quantity: 0,
      rejectedQuantity: 0,
      cost: 0,
      remarks: ''
    }));

    setLotEntriesDraft([...lotEntriesDraft, ...newDrafts]);
    setLots(prev => [...prev, ...newDrafts.map((_, i) => ({
      id: lots.length + i + 1,
      pieceNumber: `Piece ${lots.length + i + 1}`
    }))]);
  };

  const updateLotEntry = (index: number, key: keyof LotEntry, value: any) => {
    const updated = [...lotEntriesDraft];
    updated[index][key] = value;
    setLotEntriesDraft(updated);
  };

  return (
    <div className="mt-10 p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-semibold">Lot Details</h2>
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white px-6 flex items-center">
          <Save size={18} className="mr-2" /> Save Purchase Inward
        </Button>
      </div>

      <div className="space-y-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText size={20} /> Purchase Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium">Product Code</label>
              <input value={selectedItem.poId} disabled className="input mt-1 bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium">Product Name</label>
              <input value={selectedItem.poTypeName || 'N/A'} disabled className="input mt-1 bg-gray-100" />
            </div>
            {/* <div>
              <label className="block text-sm font-medium">Product Name</label>
              <input 
                value={
                  purchaseOrderTypeList?.find(
                    (type: any) => type.id === selectedItem.poId // or selectedItem.poTypeId
                  )?.poTypeName || 'N/A'
                } 
                disabled 
                className="input mt-1 bg-gray-100" 
              />
            </div> */}
            <div>
              <label className="block text-sm font-medium">Order Quantity</label>
              <input value={selectedItem.quantity} disabled className="input mt-1 bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium">Inward Quantity</label>
              <input value={selectedItem.quantityReceived} disabled className="input mt-1 bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium">Balance to Lot Create</label>
              <input
                value={selectedItem.quantity - selectedItem.quantityReceived}
                disabled
                className="input mt-1 bg-gray-100"
              />
            </div>
            {/* <div>
              <label className="block text-sm font-medium">No of Lots / Pieces</label>
              <input 
                type="number"
                value={numberOfLots}
                onChange={(e) => setNumberOfLots(parseInt(e.target.value))}
                className="input mt-1"
              />
            </div> */}
            <div className="mb-4">
              {/* <label className="block text-sm font-medium text-gray-700">Number of Pieces</label>
                            <input
                                type="number"
                                value={numberOfPieces}
                                onChange={e => setNumberOfPieces(Number(e.target.value))}
                                className="input mt-1"
                            /> */}
              <label className="block text-sm font-medium text-gray-700">No of Lots / Pieces</label>
              <input
                type="number"
                value={numberOfLots}
                onChange={(e) => setNumberOfLots(e.target.value)}
                className="input mt-1"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleAddPieces}
                  className="bg-blue-500 text-white px-2 py-2 rounded mt-5"
                >
                  Add Lots
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList size={20} /> Lot Entry
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lotEntriesDraft.map((entry, index) => (
              <div className="grid grid-cols-5 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium">Warehouse</label>
                  <select
                    value={entry.warehouseId || ''}
                    onChange={(e) => updateLotEntry(index, 'warehouseId', e.target.value)}
                    className="input mt-1 w-full"
                >
                    <option value="">Select</option>
                    {warehouseList?.map((so: any) => (
                        <option key={so.id} value={so.id}>{so.warehouseName}</option>
                    ))}
                </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Quantity</label>
                  <input
                    type="number"
                    value={entry.quantity || ''}
                    onChange={(e) => updateLotEntry(index, 'quantity', e.target.value)}
                    className="input mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Rejected Quantity</label>
                  <input
                    type="number"
                    value={entry.rejectedQuantity || ''}
                    onChange={(e) => updateLotEntry(index, 'rejectedQuantity', e.target.value)}
                    className="input mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Cost</label>
                  <input
                    type="number"
                    value={entry.cost || ''}
                    onChange={(e) => updateLotEntry(index, 'cost', e.target.value)}
                    className="input mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Remarks</label>
                  <div className="flex gap-2">
                    <input
                      value={entry.remarks || ''}
                      onChange={(e) => updateLotEntry(index, 'remarks', e.target.value)}
                      className="input mt-1"
                    />
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-end">
              <Button onClick={handleAddLot} className="bg-blue-500 hover:bg-green-700 text-white px-6 flex items-center">
                <Plus size={18} className="mr-2" /> Add Lots
              </Button>
            </div>
            <table className="w-full border-collapse border border-gray-300 mt-5">
              <thead className="bg-gray-100 mt-5">
                <tr>
                  <th className="border p-2">Sl.No</th>
                  {/* <th className="border p-2">Lot Number</th> */}
                  <th className="border p-2">Quantity</th>
                  <th className="border p-2">Rejected Qty</th>
                  <th className="border p-2">Remarks</th>
                  <th className="border p-2">Open Date</th>
                  <th className="border p-2">Cost</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {lotEntries.map((entry, index) => (
                  <tr key={entry.id}>
                    <td className="border p-2">{index + 1}</td>
                    {/* <td className="border p-2">{entry.lotNumber}</td> */}
                    <td className="border p-2">{entry.quantity}</td>
                    <td className="border p-2">{entry.rejectedQuantity}</td>
                    <td className="border p-2">{entry.remarks}</td>
                    <td className="border p-2">{entry.openDate}</td>
                    <td className="border p-2">{entry.cost}</td>
                    <td className="border p-2">
                      <div className="flex justify-center gap-2">
                        <Button
                          onClick={() => handleEditLot(entry)}
                          className="p-1 h-8 w-8"
                          variant="outline"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          onClick={() => handleDeleteLot(entry.id)}
                          className="p-1 h-8 w-8 bg-red-600 hover:bg-red-700"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
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

export default LotDetails; 




// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { FileText, ClipboardList, Edit, Trash2, Save, Plus } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "@/state/store";
// import { createPurchaseInward } from "@/state/purchaseInwardSlice";
// import { toast } from "react-toastify";

// interface LotEntry {
//   id: number;
//   quantity: number;
//   rejectedQuantity: number;
//   remarks: string;
//   cost: number;
//   openDate: string;
// }

// const LotDetails = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const dispatch = useDispatch<AppDispatch>();
//   const { register, handleSubmit, watch, formState: { errors } } = useForm();

//   const selectedItems = location.state?.selectedItems || [];
//   const [lotEntries, setLotEntries] = useState<LotEntry[]>([]);
//   const [numberOfLots, setNumberOfLots] = useState<string>('0');
//   const [currentLotEntry, setCurrentLotEntry] = useState<Partial<LotEntry>>({});
//   const [lotEntriesDraft, setLotEntriesDraft] = useState<Partial<LotEntry>[]>([]);
//   const [totalQuantity, setTotalQuantity] = useState(0);

//   useEffect(() => {
//     if (selectedItems.length === 0) {
//       navigate('/purchase-inward');
//     }
    
//     // Calculate total quantity to be distributed across lots
//     const total = selectedItems.reduce((sum: number, item: any) => 
//       sum + (item.quantityReceived || 0), 0);
//     setTotalQuantity(total);
//   }, [selectedItems, navigate]);

//   const handleAddPieces = () => {
//     const count = parseInt(numberOfLots);
//     if (isNaN(count) || count <= 0) {
//       toast.error("Please enter a valid number of lots");
//       return;
//     }

//     const newDrafts = Array.from({ length: count }, (_, index) => ({
//       id: lotEntriesDraft.length + index + 1,
//       quantity: 0,
//       rejectedQuantity: 0,
//       cost: 0,
//       remarks: ''
//     }));

//     setLotEntriesDraft([...lotEntriesDraft, ...newDrafts]);
//     setNumberOfLots('0');
//   };

//   const handleAddLot = () => {
//     // Validate draft entries
//     const invalidEntries = lotEntriesDraft.filter(entry => 
//       !entry.quantity || entry.quantity <= 0
//     );
    
//     if (invalidEntries.length > 0) {
//       toast.error("Please enter valid quantities for all lots");
//       return;
//     }

//     const entriesToAdd: LotEntry[] = lotEntriesDraft.map((entry, i) => ({
//       id: lotEntries.length + i + 1,
//       quantity: entry.quantity || 0,
//       rejectedQuantity: entry.rejectedQuantity || 0,
//       remarks: entry.remarks || '',
//       cost: entry.cost || 0,
//       openDate: new Date().toISOString().split('T')[0]
//     }));

//     setLotEntries([...lotEntries, ...entriesToAdd]);
//     setLotEntriesDraft([]);
//   };

//   const validateTotalQuantity = () => {
//     const distributedQuantity = lotEntries.reduce((sum, entry) => sum + entry.quantity, 0);
//     const draftQuantity = lotEntriesDraft.reduce((sum, entry) => sum + (entry.quantity || 0), 0);
//     return distributedQuantity + draftQuantity <= totalQuantity;
//   };

//   const handleSave = async () => {
//     if (!validateTotalQuantity()) {
//       toast.error("Total lot quantities exceed the received quantity");
//       return;
//     }

//     if (lotEntries.length === 0) {
//       toast.error("Please add at least one lot");
//       return;
//     }

//     const payload = {
//       inwardDate: new Date().toISOString(),
//       remarks: watch('remarks'),
//       activeFlag: true,
//       purchaseOrderId: selectedItems[0].poId,
//       purchaseInwardItemsDtl: selectedItems.map((item: any) => ({
//         poItemId: item.id,
//         quantityReceived: item.quantityReceived,
//         price: item.price,
//         activeFlag: true,
//         lotEntries: lotEntries.map(entry => ({
//           quantity: entry.quantity,
//           rejectedQuantity: entry.rejectedQuantity,
//           cost: entry.cost,
//           remarks: entry.remarks,
//           activeFlag: true
//         }))
//       }))
//     };

//     try {
//       await dispatch(createPurchaseInward(payload)).unwrap();
//       toast.success("Purchase inward created successfully");
//       navigate('/transaction/purchase-inward-details');
//     } catch (error) {
//       toast.error("Failed to create purchase inward");
//       console.error('Failed to create purchase inward:', error);
//     }
//   };

//   return (
//     <div className="mt-10 p-6 bg-white shadow-md rounded-lg">
//       {/* ... existing JSX ... */}
      
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <ClipboardList size={20} /> Lot Entry
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="mb-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium">Total Received Quantity</label>
//                 <input 
//                   value={totalQuantity} 
//                   disabled 
//                   className="input mt-1 bg-gray-100" 
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium">Distributed Quantity</label>
//                 <input 
//                   value={lotEntries.reduce((sum, entry) => sum + entry.quantity, 0)} 
//                   disabled 
//                   className="input mt-1 bg-gray-100" 
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Lot entry form */}
//           {lotEntriesDraft.map((entry, index) => (
//             <div key={index} className="grid grid-cols-5 gap-4 mb-4">
//               <div>
//                 <label className="block text-sm font-medium">Quantity*</label>
//                 <input
//                   type="number"
//                   min="0"
//                   max={totalQuantity}
//                   value={entry.quantity || ''}
//                   onChange={(e) => {
//                     const value = parseInt(e.target.value);
//                     // updateLotEntry(index, 'quantity', isNaN(value) ? 0 : value);
//                   }}
//                   className="input mt-1"
//                   required
//                 />
//               </div>
//               {/* Other fields... */}
//             </div>
//           ))}

//           <div className="flex justify-between items-center mt-4">
//             <div className="flex items-center gap-2">
//               <input
//                 type="number"
//                 min="1"
//                 value={numberOfLots}
//                 onChange={(e) => setNumberOfLots(e.target.value)}
//                 className="input w-20"
//                 placeholder="Qty"
//               />
//               <Button onClick={handleAddPieces} className="bg-blue-500">
//                 <Plus size={18} className="mr-2" /> Add Lots
//               </Button>
//             </div>
//             <Button 
//               onClick={handleAddLot} 
//               className="bg-green-600 hover:bg-green-700"
//               disabled={lotEntriesDraft.length === 0}
//             >
//               Save Lots
//             </Button>
//           </div>

//           {/* Lot entries table */}
//           <table className="w-full border-collapse border border-gray-300 mt-5">
//             {/* Table headers and rows... */}
//           </table>

//           <div className="flex justify-end mt-4">
//             <Button 
//               onClick={handleSave}
//               className="bg-green-600 hover:bg-green-700"
//               disabled={lotEntries.length === 0 || !validateTotalQuantity()}
//             >
//               <Save size={18} className="mr-2" /> Save Purchase Inward
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default LotDetails;
// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { FileText, ClipboardList, Edit, Trash2, Save, Plus, Trash } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "@/state/store";
// import { createPurchaseInward } from "@/state/purchaseInwardSlice";
// import { createJobworkFabricReceive } from '@/state/jobFabricReceiveSlice';

// interface PieceEntry {
//     id: number;
//     // pieceNumber: string;
//     quantity: number;
//     weight: number;
//     remarks: string;
//     cost: number;
// }

// const PieceDetails = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const dispatch = useDispatch<AppDispatch>();
//     // const { register, handleSubmit, reset, watch } = useForm();
//     const [selectedItem] = useState(location.state?.selectedItems[0] || null);
//     console.log(selectedItem)
//     const [pieceEntries, setPieceEntries] = useState<PieceEntry[]>([]);
//     const [numberOfLots, setNumberOfLots] = useState<number>(0);
//     const [currentPieceEntry, setCurrentPieceEntry] = useState<Partial<PieceEntry>>({});
//     // const [numberOfPieces, setNumberOfPieces] = useState<number>(0);
//     const [numberOfPieces, setNumberOfPieces] = useState<string>('0');
//     const [pieces, setPieces] = useState<Array<{ id: number; pieceNumber: string }>>([]);
//     const [pieceEntriesDraft, setPieceEntriesDraft] = useState<Partial<PieceEntry>[]>([]);


//     useEffect(() => {
//         if (!selectedItem) {
//             navigate('/purchase-inward');
//         }
//     }, [selectedItem, navigate]);

//     if (!selectedItem) {
//         return null;
//     }

//     const handleAddLot = () => {
//         const validEntries = pieceEntriesDraft.filter(e => e.quantity);
//         if (!validEntries.length) {
//             return;
//         }

//         const entriesToAdd: PieceEntry[] = validEntries.map((entry, i) => ({
//             id: pieceEntries.length + i + 1,
//             // pieceNumber: entry.pieceNumber || '',
//             quantity: entry.quantity || 0,
//             weight: entry.weight || 0,
//             remarks: entry.remarks || '',
//             cost: entry.cost || 0,
//             openDate: new Date().toISOString().split('T')[0]
//         }));

//         setPieceEntries([...pieceEntries, ...entriesToAdd]);
//         setPieceEntriesDraft([]);
//         setPieces([]);
//         setNumberOfPieces('0');
//     };


//     const handleDeleteLot = (id: number) => {
//         setPieceEntries(pieceEntries.filter(entry => entry.id !== id));
//     };

//     const handleEditLot = (entry: PieceEntry) => {
//         setCurrentPieceEntry(entry);
//         handleDeleteLot(entry.id);
//     };

//     const handleSave = async () => {
//         const payload = {
//             id: 0,
//             jobFabricReceiveDate: selectedItem.jobFabricReceiveDate,
//             remarks: selectedItem.remarks,
//             activeFlag: true,
//             weavingContractId: selectedItem.weavingContractId,
//             vendorId: selectedItem.vendorId,
//             jobworkFabricReceiveItemsDtl: [{
//                 id: 0,
//                 jobworkFabricReceiveId: selectedItem.jobworkFabricReceiveId,
//                 weavingContractItemId: selectedItem.weavingContractItemId, // Match to API field
//                 quantityReceived: selectedItem.quantityReceived,
//                 price: selectedItem.price,
//                 activeFlag: true,
//                 pieceEntries: pieceEntries.map(entry => ({
//                     id: 0,
//                     // pieceNumber: entry.pieceNumber,
//                     quantity: entry.quantity,
//                     weight: entry.weight,
//                     cost: entry.cost,
//                     remarks: entry.remarks,
//                     activeFlag: true
//                 }))
//             }]
//         };


//         try {
//             await dispatch(createJobworkFabricReceive(payload)).unwrap();
//             setPieceEntries([]);
//             setPieceEntriesDraft([]);
//             setPieces([]);
//             setNumberOfPieces('0');
//             navigate('/transaction/jobwork-fabric-receive');
//         } catch (error) {
//             console.error('Failed to create purchase inward:', error);
//         }
//     };

//     // const handleAddPieces = () => {
//     //     // Generate new pieces based on the input number
//     //     const newPieces = Array.from({ length: numberOfPieces }, (_, index) => ({
//     //         id: pieces.length + index + 1,
//     //         pieceNumber: `Piece ${pieces.length + index + 1}`,
//     //     }));

//     //     // Update the pieces state with the newly generated pieces
//     //     setPieces([...pieces, ...newPieces]);
//     // };
//     // const handleAddPieces = () => {
//     //     const count = parseInt(numberOfPieces || '0', 10);
//     //     if (isNaN(count) || count <= 0) return;

//     //     const newPieces = Array.from({ length: count }, (_, index) => ({
//     //         id: pieces.length + index + 1,
//     //         pieceNumber: `Piece ${pieces.length + index + 1}`,
//     //     }));

//     //     setPieces([...pieces, ...newPieces]);
//     // };

//     const handleAddPieces = () => {
//         const count = parseInt(numberOfPieces || '0', 10);
//         if (isNaN(count) || count <= 0) return;

//         const newDrafts = Array.from({ length: count }, (_, index) => ({
//             id: pieces.length + index + 1,
//             // pieceNumber: `Lot ${pieces.length + index + 1}`,
//             pieceNumber: '',
//             quantity: 0,
//             weight: 0,
//             cost: 0,
//             remarks: ''
//         }));

//         setPieceEntriesDraft([...pieceEntriesDraft, ...newDrafts]);
//         setPieces(prev => [...prev, ...newDrafts.map((_, i) => ({
//             id: pieces.length + i + 1,
//             pieceNumber: `Piece ${pieces.length + i + 1}`
//         }))]);
//     };

//     const updatePieceEntry = (index: number, key: keyof PieceEntry, value: any) => {
//         const updated = [...pieceEntriesDraft];
//         updated[index][key] = value;
//         setPieceEntriesDraft(updated);
//     };


//     return (
//         <div className="mt-10 p-6 bg-white shadow-md rounded-lg">
//             <div className="flex justify-between items-center border-b pb-4">
//                 <h2 className="text-2xl font-semibold">Piece Details</h2>
//                 <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white px-6 flex items-center">
//                     <Save size={18} className="mr-2" /> Save Jobwork Fabric Receive
//                 </Button>
//             </div>

//             <div className="space-y-6 mt-6">
//                 <Card>
//                     <CardHeader>
//                         <CardTitle className="flex items-center gap-2">
//                             <FileText size={20} /> Contract Details
//                         </CardTitle>
//                     </CardHeader>
//                     <CardContent className="grid grid-cols-3 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium">Product Code</label>
//                             <input value={selectedItem.fabricCodeId} disabled className="input mt-1 bg-gray-100" />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium">Quality</label>
//                             <input value={selectedItem.fabricQualityId || 'N/A'} disabled className="input mt-1 bg-gray-100" />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium">Order Quantity</label>
//                             <input value={selectedItem.quantity} disabled className="input mt-1 bg-gray-100" />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium">Inward Quantity</label>
//                             <input value={selectedItem.quantityReceived} disabled className="input mt-1 bg-gray-100" />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium">Balance to Piece Create</label>
//                             <input
//                                 value={selectedItem.quantity - selectedItem.quantityReceived}
//                                 disabled
//                                 className="input mt-1 bg-gray-100"
//                             />
//                         </div>
//                         <div className="mb-4">
//                             <label className="block text-sm font-medium text-gray-700">Number of Pieces</label>
//                             <input
//                                 type="number"
//                                 value={numberOfPieces}
//                                 onChange={(e) => setNumberOfPieces(e.target.value)}
//                                 className="input mt-1"
//                             />
//                             <div className="flex justify-end">
//                                 <button
//                                     onClick={handleAddPieces}
//                                     className="bg-blue-500 text-white px-2 py-2 rounded mt-5"
//                                 >
//                                     Add Pieces
//                                 </button>
//                             </div>
//                         </div>
//                     </CardContent>
//                 </Card>

//                 <Card>
//                     <CardHeader>
//                         <CardTitle className="flex items-center gap-2">
//                             <ClipboardList size={20} /> Piece Entry
//                         </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         {pieceEntriesDraft.map((entry, index) => (
//                             <div key={entry.id} className="grid grid-cols-5 gap-4 mb-4">
//                                 {/* <div>
//                                     <label className="block text-sm font-medium">Piece Number</label>
//                                     <input value={entry.pieceNumber} onChange={(e) => updatePieceEntry(index, 'pieceNumber', e.target.value)} className="input mt-1" />
//                                 </div> */}
//                                 <div>
//                                     <label className="block text-sm font-medium">Quantity</label>
//                                     <input type="number" value={entry.quantity} onChange={(e) => updatePieceEntry(index, 'quantity', parseInt(e.target.value))} className="input mt-1" />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium">Weight</label>
//                                     <input type="number" value={entry.weight} onChange={(e) => updatePieceEntry(index, 'weight', parseInt(e.target.value))} className="input mt-1" />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium">Cost</label>
//                                     <input type="number" value={entry.cost} onChange={(e) => updatePieceEntry(index, 'cost', parseFloat(e.target.value))} className="input mt-1" />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium">Remarks</label>
//                                     <input value={entry.remarks} onChange={(e) => updatePieceEntry(index, 'remarks', e.target.value)} className="input mt-1" />
//                                 </div>
//                             </div>
//                         ))}

//                         <div className="flex justify-end">
//                             <Button onClick={handleAddLot} className="bg-blue-500 hover:bg-green-700 text-white px-6 flex items-center">
//                                 <Plus size={18} className="mr-2" /> Add
//                             </Button>
//                         </div>
//                         <table className="w-full border-collapse border border-gray-300 mt-5">
//                             <thead className="bg-gray-100 mt-5">
//                                 <tr>
//                                     <th className="border p-2">Sl.No</th>
//                                     {/* <th className="border p-2">Piece Number</th> */}
//                                     <th className="border p-2">Quantity</th>
//                                     <th className="border p-2">Weight</th>
//                                     <th className="border p-2">Remarks</th>
//                                     <th className="border p-2">Cost</th>
//                                     <th className="border p-2">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {pieceEntries.map((entry, index) => (
//                                     <tr key={entry.id}>
//                                         <td className="border p-2">{index + 1}</td>
//                                         {/* <td className="border p-2">{entry.pieceNumber}</td> */}
//                                         <td className="border p-2">{entry.quantity}</td>
//                                         <td className="border p-2">{entry.weight}</td>
//                                         <td className="border p-2">{entry.remarks}</td>
//                                         <td className="border p-2">{entry.cost}</td>
//                                         <td className="border p-2">
//                                             <div className="flex justify-center gap-2">
//                                                 <Button
//                                                     onClick={() => handleEditLot(entry)}
//                                                     className="p-1 h-8 w-8"
//                                                     variant="outline"
//                                                 >
//                                                     <Edit size={16} />
//                                                 </Button>
//                                                 <Button
//                                                     onClick={() => handleDeleteLot(entry.id)}
//                                                     className="p-1 h-8 w-8 bg-red-600 hover:bg-red-700"
//                                                 >
//                                                     <Trash2 size={16} />
//                                                 </Button>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </CardContent>
//                 </Card>
//             </div>
//         </div>
//     );
// };

// export default PieceDetails; 



import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ClipboardList, Edit, Trash2, Save, Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/state/store";
import {
    createJobworkFabricReceive,
    updateJobworkFabricReceive,
    getJobworkFabricReceiveById
} from '@/state/jobFabricReceiveSlice';
import { toast } from 'react-toastify';

interface PieceEntry {
    id?: number;
    pieceNumber: string;
    quantity: number;
    weight: number;
    remarks: string;
    cost: number;
    activeFlag?: boolean;
}

interface FabricReceiveItem {
    id?: number;
    quantityReceived: number;
    price: number;
    activeFlag?: boolean;
    weavingContractItemId: number;
    pieceEntries: PieceEntry[];
}

interface JobworkFabricReceiveData {
    id?: number;
    weavingContractId: number;
    vendorId: number;
    jobFabricReceiveDate: string;
    remarks: string;
    activeFlag?: boolean;
    items: FabricReceiveItem[];
}

const PieceDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const [isEditMode, setIsEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [pieceEntries, setPieceEntries] = useState<PieceEntry[]>([]);
    const [numberOfPieces, setNumberOfPieces] = useState<string>('0');
    const [pieceEntriesDraft, setPieceEntriesDraft] = useState<Partial<PieceEntry>[]>([]);
    const [editingPieceId, setEditingPieceId] = useState<number | null>(null);
    const [formData, setFormData] = useState<JobworkFabricReceiveData>({
        weavingContractId: 0,
        vendorId: 0,
        jobFabricReceiveDate: new Date().toISOString().split('T')[0],
        remarks: '',
        activeFlag: true,
        items: []
    });

    // Load data for edit mode
    useEffect(() => {
        if (id) {
            setIsEditMode(true);
            loadExistingRecord(Number(id));
        } else if (location.state?.selectedItems) {
            setSelectedItem(location.state.selectedItems[0]);
            initializeFormFromSelectedItem(location.state.selectedItems[0]);
        } else {
            navigate('/transaction/jobwork-fabric-receive');
        }
    }, [id, location.state]);

    const loadExistingRecord = async (recordId: number) => {
        try {
            setIsLoading(true);
            const result = await dispatch(getJobworkFabricReceiveById(recordId)).unwrap();
            if (result.data) {
                const record = result.data;
                setFormData({
                    id: record.id,
                    weavingContractId: record.weavingContractId,
                    vendorId: record.vendorId,
                    jobFabricReceiveDate: record.jobFabricReceiveDate.split('T')[0],
                    remarks: record.remarks,
                    activeFlag: record.activeFlag,
                    items: record.items
                });

                if (record.items && record.items.length > 0) {
                    setSelectedItem(record.items[0]);
                    setPieceEntries(record.items[0].pieceEntries || []);
                }
            }
        } catch (error) {
            toast.error("Failed to load record");
            console.error("Error loading record:", error);
            navigate('/transaction/jobwork-fabric-receive');
        } finally {
            setIsLoading(false);
        }
    };

    const initializeFormFromSelectedItem = (item: any) => {
        setFormData({
            weavingContractId: item.weavingContractId,
            vendorId: item.vendorId,
            jobFabricReceiveDate: item.jobFabricReceiveDate.split('T')[0],
            remarks: item.remarks || '',
            activeFlag: true,
            items: [{
                weavingContractItemId: item.weavingContractItemId,
                quantityReceived: item.quantityReceived,
                price: item.price,
                activeFlag: true,
                pieceEntries: []
            }]
        });
    };

    const handleAddPieces = () => {
        const count = parseInt(numberOfPieces || '0', 10);
        if (isNaN(count) || count <= 0) {
            toast.warning("Please enter a valid number of pieces");
            return;
        }

        const newDrafts = Array.from({ length: count }, (_, index) => ({
            id: pieceEntries.length + pieceEntriesDraft.length + index + 1,
            pieceNumber: `P-${pieceEntries.length + pieceEntriesDraft.length + index + 1}`,
            quantity: 0,
            weight: 0,
            cost: 0,
            remarks: ''
        }));

        setPieceEntriesDraft([...pieceEntriesDraft, ...newDrafts]);
        setNumberOfPieces('0');
    };

    const updatePieceEntry = (index: number, key: keyof PieceEntry, value: any) => {
        const updated = [...pieceEntriesDraft];
        updated[index] = { ...updated[index], [key]: value };
        setPieceEntriesDraft(updated);
    };

    const handleAddLot = () => {
        const validEntries = pieceEntriesDraft.filter(e => e.quantity && e.quantity > 0);
        if (!validEntries.length) {
            toast.warning("Please enter valid quantities for all pieces");
            return;
        }

        const entriesToAdd: PieceEntry[] = validEntries.map((entry, i) => ({
            id: editingPieceId || pieceEntries.length + i + 1,
            pieceNumber: entry.pieceNumber || `P-${pieceEntries.length + i + 1}`,
            quantity: entry.quantity || 0,
            weight: entry.weight || 0,
            remarks: entry.remarks || '',
            cost: entry.cost || 0,
            activeFlag: true
        }));

        setPieceEntries([...pieceEntries, ...entriesToAdd]);
        setPieceEntriesDraft([]);
        setEditingPieceId(null);
        setNumberOfPieces('0');
    };

    const handleDeleteLot = (id: number) => {
        setPieceEntries(pieceEntries.filter(entry => entry.id !== id));
    };

    const handleEditLot = (entry: PieceEntry) => {
        setEditingPieceId(entry.id || null);
        setPieceEntriesDraft([{ ...entry }]);
        handleDeleteLot(entry.id || 0);
    };

    const handleSave = async () => {
        if (!selectedItem) return;

        // Validate piece entries
        if (pieceEntries.length === 0) {
            toast.error("Please add at least one piece entry");
            return;
        }

        const totalPieceQuantity = pieceEntries.reduce((sum, entry) => sum + entry.quantity, 0);
        if (totalPieceQuantity > selectedItem.quantityReceived) {
            toast.error(`Total piece quantity (${totalPieceQuantity}) exceeds received quantity (${selectedItem.quantityReceived})`);
            return;
        }

        const payload: JobworkFabricReceiveData = {
            ...formData,
            items: [{
                id: selectedItem.id,
                quantityReceived: selectedItem.quantityReceived,
                price: selectedItem.price,
                activeFlag: true,
                weavingContractItemId: selectedItem.weavingContractItemId,
                pieceEntries: pieceEntries
            }]
        };

        try {
            setIsLoading(true);
            if (isEditMode && formData.id) {
                await dispatch(updateJobworkFabricReceive({
                    id: formData.id,
                    data: payload
                })).unwrap();
                toast.success("Record updated successfully");
            } else {
                await dispatch(createJobworkFabricReceive(payload)).unwrap();
                toast.success("Record created successfully");
            }
            navigate('/transaction/jobwork-fabric-receive');
        } catch (error) {
            console.error('Failed to save record:', error);
            toast.error("Failed to save record");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div>Loading...</div>
            </div>
        );
    }

    if (!selectedItem) {
        return null;
    }

    return (
        <div className="mt-10 p-6 bg-white shadow-md rounded-lg">
            <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-2xl font-semibold">
                    {isEditMode ? 'Edit' : 'Create'} Jobwork Fabric Receive
                </h2>
                <Button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 flex items-center"
                    disabled={isLoading}
                >
                    <Save size={18} className="mr-2" />
                    {isLoading ? 'Saving...' : 'Save'}
                </Button>
            </div>

            <div className="space-y-6 mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText size={20} /> Contract Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Weaving Contract ID</label>
                            <input
                                value={formData.weavingContractId}
                                disabled
                                className="input mt-1 bg-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Vendor ID</label>
                            <input
                                value={formData.vendorId}
                                disabled
                                className="input mt-1 bg-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Receive Date</label>
                            <input
                                type="date"
                                value={formData.jobFabricReceiveDate}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    jobFabricReceiveDate: e.target.value
                                })}
                                className="input mt-1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Quality</label>
                            <input
                                value={selectedItem.fabricQualityId || 'N/A'}
                                disabled
                                className="input mt-1 bg-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Order Quantity</label>
                            <input
                                value={selectedItem.quantity}
                                disabled
                                className="input mt-1 bg-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Received Quantity</label>
                            <input
                                value={selectedItem.quantityReceived}
                                disabled={isEditMode}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    setSelectedItem({
                                        ...selectedItem,
                                        quantityReceived: value
                                    });
                                }}
                                className="input mt-1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Price</label>
                            <input
                                type="number"
                                value={selectedItem.price}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    setSelectedItem({
                                        ...selectedItem,
                                        price: value
                                    });
                                }}
                                className="input mt-1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Remarks</label>
                            <input
                                value={formData.remarks}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    remarks: e.target.value
                                })}
                                className="input mt-1"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ClipboardList size={20} /> Piece Entry
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4">
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium">Number of Pieces</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={numberOfPieces}
                                        onChange={(e) => setNumberOfPieces(e.target.value)}
                                        className="input mt-1"
                                    />
                                </div>
                                <Button
                                    onClick={handleAddPieces}
                                    className="bg-blue-500 hover:bg-blue-600 text-white mt-6"
                                >
                                    <Plus size={18} className="mr-2" /> Add Pieces
                                </Button>
                            </div>
                        </div>

                        {pieceEntriesDraft.map((entry, index) => (
                            <div key={index} className="grid grid-cols-5 gap-4 mb-4 p-4 border rounded">
                                <div>
                                    <label className="block text-sm font-medium">Piece Number</label>
                                    <input
                                        value={entry.pieceNumber}
                                        onChange={(e) => updatePieceEntry(index, 'pieceNumber', e.target.value)}
                                        className="input mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Quantity</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={entry.quantity || ''}
                                        onChange={(e) => updatePieceEntry(index, 'quantity', parseInt(e.target.value))}
                                        className="input mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Weight</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={entry.weight || ''}
                                        onChange={(e) => updatePieceEntry(index, 'weight', parseFloat(e.target.value))}
                                        className="input mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Cost</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={entry.cost || ''}
                                        onChange={(e) => updatePieceEntry(index, 'cost', parseFloat(e.target.value))}
                                        className="input mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Remarks</label>
                                    <input
                                        value={entry.remarks || ''}
                                        onChange={(e) => updatePieceEntry(index, 'remarks', e.target.value)}
                                        className="input mt-1"
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-end mb-4">
                            <Button
                                onClick={handleAddLot}
                                className="bg-green-500 hover:bg-green-600 text-white"
                                disabled={pieceEntriesDraft.length === 0}
                            >
                                {editingPieceId ? 'Update Piece' : 'Add to List'}
                            </Button>
                        </div>

                        <div className="border rounded overflow-hidden">
                            <table className="w-full border-collapse">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border p-2">Sl.No</th>
                                        <th className="border p-2">Piece Number</th>
                                        <th className="border p-2">Quantity</th>
                                        <th className="border p-2">Weight</th>
                                        <th className="border p-2">Cost</th>
                                        <th className="border p-2">Remarks</th>
                                        <th className="border p-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pieceEntries.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="border p-4 text-center text-gray-500">
                                                No piece entries added yet
                                            </td>
                                        </tr>
                                    ) : (
                                        pieceEntries.map((entry, index) => (
                                            <tr key={entry.id}>
                                                <td className="border p-2">{index + 1}</td>
                                                <td className="border p-2">{entry.pieceNumber}</td>
                                                <td className="border p-2">{entry.quantity}</td>
                                                <td className="border p-2">{entry.weight}</td>
                                                <td className="border p-2">{entry.cost}</td>
                                                <td className="border p-2">{entry.remarks}</td>
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
                                                            onClick={() => handleDeleteLot(entry.id || 0)}
                                                            className="p-1 h-8 w-8 bg-red-600 hover:bg-red-700"
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PieceDetails;
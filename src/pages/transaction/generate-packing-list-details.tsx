import { DataTable } from "@/components/data/DataTable";
import { Modal } from "@/components/ui/Modal";
import { deleteGeneratePacking, getAllGeneratePacking } from "@/state/generatePackingSlice";
import { AppDispatch, RootState } from "@/state/store";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

export function PackingListDetails() {

  const { generatePackingList } = useSelector((state: RootState) => state.generatePacking)
  const [packingList, setPackingList] = useState(generatePackingList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentPacking, setCurrentPacking] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();


  useEffect(() => {
    dispatch(getAllGeneratePacking({}));
  }, [dispatch]);

  const columns = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        Cell: ({ row }: { row: { index: number } }) => row.index + 1
      },
      {
        Header: 'Packing Slip No',
        accessor: 'packingSlipNo',
      },
      {
        Header: 'Packing Date',
        accessor: 'packingDate',
        Cell: ({ value }: { value: string }) => formatDate(value),
      },
      {
        Header: 'Buyer ID',
        accessor: 'buyerId',
      },
      {
        Header: 'Sales Order',
        accessor: 'salesOrderId',
      },
      {
        Header: 'Warehouse',
        accessor: 'warehouseId',
      },
      {
        Header: 'Tare Weight',
        accessor: 'tareWeight',
      },
      {
        Header: 'Gross Weight',
        accessor: 'grossWeight',
      },
      {
        Header: 'Items Count',
        accessor: 'items',
        Cell: ({ value }: { value: any[] }) => value.length,
      },
    ],
    []
  );

  const handleAdd = () => {
    setModalMode('add');
    setCurrentPacking(null);
    navigate("/transaction/generate-packing-list");
  };

  const handleEdit = (packing: any) => {
    console.log("packing", packing);
    setModalMode('edit');
    setCurrentPacking(packing);
    setIsModalOpen(true);
    navigate("/transaction/generate-packing-list", { state: { packing } });
  };

  const handleDelete = (packing: any) => {
    setCurrentPacking(packing);
    setIsDeleteModalOpen(true);
  };

  const handleView = (packing: any) => {
    setCurrentPacking(packing);
    setIsViewModalOpen(true);
  };

  // const confirmDelete = () => {
  //   setPackingList(packingList.filter((p: any) => p.id !== currentPacking.id));
  //   setIsDeleteModalOpen(false);
  // };
  const confirmDelete = async () => {
    if (!currentPacking) return;

    try {
      await dispatch(deleteGeneratePacking(currentPacking.id)).unwrap();
      await dispatch(getAllGeneratePacking({}));
    } catch (error) {
      console.error("Error deleting SalesOrder:", error);
    }

    setIsDeleteModalOpen(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6"></h1>

      <DataTable
        columns={columns}
        data={generatePackingList}
        title="Packing List"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        showActions={true}
        filterPlaceholder="Search Packing List..."
      />

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Packing List Details"
        className="w-full max-w-4xl"
      >
        {currentPacking && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">ID</p>
                <p className="font-medium">{currentPacking.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Packing Slip No</p>
                <p className="font-medium">{currentPacking.packingSlipNo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Packing Date</p>
                <p className="font-medium">{formatDate(currentPacking.packingDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Buyer ID</p>
                <p className="font-medium">{currentPacking.buyerId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Sales Order ID</p>
                <p className="font-medium">{currentPacking.salesOrderId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Warehouse ID</p>
                <p className="font-medium">{currentPacking.warehouseId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tare Weight</p>
                <p className="font-medium">{currentPacking.tareWeight}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gross Weight</p>
                <p className="font-medium">{currentPacking.grossWeight}</p>
              </div>
            </div>

            {/* Items Table */}
            {currentPacking.items.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium mb-2">Items</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Length</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">UOM ID</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Pounds</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Lot ID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentPacking.items.map((item: any) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2">{item.rollNo}</td>
                          <td className="px-4 py-2">{item.length}</td>
                          <td className="px-4 py-2">{item.uomId}</td>
                          <td className="px-4 py-2">{item.pounds}</td>
                          <td className="px-4 py-2">{item.lotId}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
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
          <p>Are you sure you want to delete packing list?</p>
          <p className="text-red-600 text-sm">This action cannot be undone.</p>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
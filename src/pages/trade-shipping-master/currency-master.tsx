import { DataTable } from "@/components/data/DataTable";
import { Modal } from "@/components/ui/Modal";
import { createCurrency, deleteCurrency, getAllCurrencies, updateCurrency } from "@/state/currencySlice";
import { AppDispatch, RootState } from "@/state/store";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

interface CurrencyData {
  id: number;
  currencyCode: string;
  currencyName: string;
  symbol: string;
  activeFlag: boolean;
}

interface CurrencyFormData {
  id?: number | null;
  currencyCode: string;
  currencyName: string;
  symbol: string;
  activeFlag: boolean;
}

export function CurrencyMaster() {
  const { currencyList } = useSelector((state: RootState) => state.currency);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // const { register, handleSubmit, reset, formState: { errors } } = useForm<CurrencyFormData>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields, isValid }
  } = useForm<CurrencyFormData>({
    mode: 'onBlur', // Validate on blur
    reValidateMode: 'onBlur' // Re-validate on blur
  });

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getAllCurrencies({}));
  }, [dispatch]);

  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        Cell: ({ row }: { row: { index: number } }) => row.index + 1
      },
      { Header: "Currency Code", accessor: "currencyCode" },
      { Header: "Currency Name", accessor: "currencyName" },
      { Header: "Symbol", accessor: "symbol" },
      {
        Header: "Status",
        accessor: "activeFlag",
        Cell: ({ value }: { value: boolean }) => (
          <span className={`px-2 py-1 rounded-full text-xs ${value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{value ? "Active" : "Inactive"}</span>
        ),
      },
    ],
    []
  );

  const handleOpenModal = (editing = false, currency: CurrencyData | null = null) => {
    if (editing && currency) {
      reset(currency);
      setCurrentCurrency(currency);
    } else {
      reset({ id: null, currencyCode: "", currencyName: "", symbol: "", activeFlag: true });
      setCurrentCurrency(null);
    }
    setIsEditing(editing);
    setIsModalOpen(true);
  };

  const handleDelete = (currency: CurrencyData) => {
    setCurrentCurrency(currency);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!currentCurrency) return;
    try {
      await dispatch(deleteCurrency(currentCurrency.id)).unwrap();
      await dispatch(getAllCurrencies({}));
    } catch (error) {
      console.error("Error deleting currency:", error);
    }
    setIsDeleteModalOpen(false);
  };

  // const onSubmit = async (data: CurrencyFormData) => {
  //   try {
  //     if (isEditing) {
  //       await dispatch(updateCurrency(data)).unwrap();
  //     } else {
  //       const { id, ...newCurrencyData } = data;
  //       await dispatch(createCurrency(newCurrencyData)).unwrap();
  //     }
  //     dispatch(getAllCurrencies({}));
  //     setIsModalOpen(false);
  //     reset();
  //   } catch (error) {
  //     console.error("Error submitting form:", error);
  //   }
  // };
  const onSubmit = async (data: CurrencyFormData) => {
    if (isEditing) {
      await dispatch(updateCurrency(data));
    } else {
      await dispatch(createCurrency(data));
    }
    dispatch(getAllCurrencies({}));
    setIsModalOpen(false);
    reset();
  };

  const handleView = (state: any) => {
    setCurrentCurrency(state);
    // setIsViewModalOpen(true);
  };

  const handleEdit = (state: any) => {
    setIsEditing(true);
    setCurrentCurrency(state);
    reset({
      id: state.id, currencyCode: state.currencyCode,
      currencyName: state.currencyName, symbol: state.symbol, activeFlag: state.activeFlag
    });
    setIsModalOpen(true);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Currency Management</h1>
      <DataTable
        columns={columns}
        data={currencyList}
        title="Currency Master"
        onAdd={() => handleOpenModal(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        showActions={true}
        filterPlaceholder="Search Currency..."
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? "Edit Currency" : "Add Currency"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Currency Code <span className="text-red-600">*</span> </label>
            <input {...register("currencyCode", { required: "Currency Code is required" })}
              placeholder="Enter Currency Code"
              className="input mt-1" />
            {errors.currencyCode && <p className="mt-1 text-sm text-red-600">{errors.currencyCode.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Currency Name <span className="text-red-600">*</span> </label>
            <input {...register("currencyName", { required: "Currency Name is required" })}
              placeholder="Enter Currency Name"
              className="input mt-1" />
            {errors.currencyName && <p className="mt-1 text-sm text-red-600">{errors.currencyName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Symbol <span className="text-red-600">*</span> </label>
            <input {...register("symbol", { required: "Symbol is required" })}
              placeholder="Enter Symbol"
              className="input mt-1" />
            {errors.symbol && <p className="mt-1 text-sm text-red-600">{errors.symbol.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select {...register("activeFlag", { required: "Status is required" })} className="input mt-1">
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            {errors.activeFlag && <p className="mt-1 text-sm text-red-600">{errors.activeFlag.message}</p>}
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
            {/* <button type="submit" className="btn btn-primary">{isEditing ? "Edit Currency" : "Add Currency"}</button> */}
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
              {isEditing ? "Update Currency" : "Add Currency"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Delete">
        <div className="space-y-4">
          <p>Are you sure you want to delete currency "{currentCurrency?.currencyName}"?</p>
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

import { DataTable } from "@/components/data/DataTable";
import { Modal } from "@/components/ui/Modal";
import { createCountry, deleteCountry, getAllCountries, updateCountry } from "@/state/countrySlice";
import { AppDispatch, RootState } from "@/state/store";
import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';

interface CountryFormData {
  id?: number | null;
  countryName: string;
  activeFlag: boolean;
}

export function CountryMaster() {

  const { countryList } = useSelector((state: RootState) => state.country);
  const [selectedCountry, setSelectedCountry] = React.useState<CountryFormData | null>(null);
  const [country, setCountry] = useState(countryList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentCountry, setCurrentCountry] = useState<any>(null);
  const [isEditing, setIsEditing] = React.useState(false);

  const dispatch = useDispatch<AppDispatch>();

  // const { register, handleSubmit, reset, formState: { errors } } = useForm<CountryFormData>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields, isValid }
  } = useForm<CountryFormData>({
    mode: 'onBlur', // Validate on blur
    reValidateMode: 'onBlur' // Re-validate on blur
  });

  useEffect(() => {
    dispatch(getAllCountries({}));
  }, [dispatch]);

  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "id", Cell: ({ row }: { row: { index: number } }) => row.index + 1 },
      { Header: "Country Name", accessor: "countryName" },
      {
        Header: "Status",
        accessor: "activeFlag",
        Cell: ({ value }: { value: boolean }) => (
          <span
            className={`px-2 py-1 rounded-full text-xs ${value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
          >
            {value ? "Active" : "Inactive"}
          </span>
        ),
      },
    ],
    []
  );

  const handleEdit = (state: any) => {
    setIsEditing(true);
    setCurrentCountry(state);
    reset({ id: state.id, countryName: state.countryName, activeFlag: state.activeFlag });
    setIsModalOpen(true);
  };

  const handleView = (state: any) => {
    setCurrentCountry(state);
    setIsViewModalOpen(true);
  };

  const handleOpenModal = (editing = false, country: CountryFormData | null = null) => {
    if (editing && country) {
      reset({
        id: country.id,
        countryName: country.countryName,
        activeFlag: country.activeFlag
      });
      setCountry(country);
    } else {
      reset({
        id: null,
        countryName: '',
        activeFlag: true
      });
      setCountry(null);
    }
    setIsEditing(editing);
    setIsModalOpen(true);
  };

  const onSubmit = async (data: CountryFormData) => {
    try {
      console.log('Form data submitted:', data); // Add this to debug

      if (isEditing) {
        await dispatch(updateCountry({
          ...data,
        }));
      } else {
        const { id, ...newCountryData } = data;
        await dispatch(createCountry({
          ...newCountryData,
        }));
      }
      dispatch(getAllCountries({}));
      setIsModalOpen(false);
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleDelete = (state: any) => {
    setCurrentCountry(state);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!currentCountry) return;

    try {
      await dispatch(deleteCountry(currentCountry.id)).unwrap();
      await dispatch(getAllCountries({}));
    } catch (error) {
      console.error("Error deleting country:", error);
    }

    setIsDeleteModalOpen(false);
  };

  return (
    <div>

      <DataTable
        columns={columns}
        data={countryList}
        title="Country Master"
        onAdd={() => handleOpenModal(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        showActions={true}
        filterPlaceholder="Search Country..."
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? "Edit Country" : "Add Country"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Country Name <span className="text-red-600">*</span></label>
            <input
              {...register("countryName", {
                required: "Country Name is required"
              })}
              placeholder="EnterCountry Name"
              className={`input mt-1 ${errors.countryName ? 'border-red-500' : ''}`}
            />
            {(touchedFields.countryName && errors.countryName) && (
              <p className="mt-1 text-sm text-red-600">
                {errors.countryName.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select {...register("activeFlag")} className="input mt-1">
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          {/* <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">{isEditing ? "Update Country" : "Add Country"}</button>
          </div> */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
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
              {isEditing ? "Update Country" : "Add Country"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Delete">
        <div className="space-y-4">
          <p>Are you sure you want to delete country "{currentCountry?.countryName}"?</p>
          {/* <p className="text-red-600 text-sm">This action cannot be undone.</p> */}
          <div className="flex justify-end space-x-3 pt-4">
            <button onClick={() => setIsDeleteModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button onClick={confirmDelete} className="btn btn-danger">Delete</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Country Details">
        {currentCountry && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm">Country Name</p>
                <p className="font-medium">{currentCountry.countryName}</p>
              </div>
              <div>
                <p className="text-sm">Status</p>
                <p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${currentCountry.activeFlag ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                  >
                    {currentCountry.activeFlag ? "Active" : "Inactive"}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button onClick={() => setIsViewModalOpen(false)} className="btn btn-secondary">Close</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}


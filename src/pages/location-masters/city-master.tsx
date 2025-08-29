import { DataTable } from "@/components/data/DataTable";
import { Modal } from "@/components/ui/Modal";
import { createCity, deleteCity, getAllCities, updateCity } from "@/state/citySlice";
import { getAllCountries } from "@/state/countrySlice";
import { getAllStates } from "@/state/stateSlice";
import { AppDispatch, RootState } from "@/state/store";
import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

interface cityData {
  id: number;
  countryId: string;
  stateId: string;
  countryName: string;
  stateName: string;
  cityName: string;
  activeFlag: boolean;
}

interface CityFormData {
  id?: number | null;
  countryId: string;
  stateId: string;
  countryName: string;
  stateName: string;
  cityName: string;
  activeFlag: boolean;
}

export function CityMaster() {

  const { stateList } = useSelector((state: RootState) => state.state);
  const { countryList } = useSelector((state: RootState) => state.country);
  const { cityList } = useSelector((state: RootState) => state.city);
  const [city, setCity] = useState(cityList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentCity, setCurrentCity] = useState<any>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const dispatch = useDispatch<AppDispatch>();

  // const { register, handleSubmit, reset, formState: { errors } } = useForm<CityFormData>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields, isValid }
  } = useForm<CityFormData>({
    mode: 'onBlur', // Validate on blur
    reValidateMode: 'onBlur' // Re-validate on blur
  });

  useEffect(() => {
    dispatch(getAllCountries({}));
    dispatch(getAllStates({}));
    dispatch(getAllCities({}));
  }, [dispatch]);

  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "id", Cell: ({ row }: { row: { index: number } }) => row.index + 1 },
      { Header: "Country", accessor: "countryName" },
      { Header: "State", accessor: "stateName" },
      { Header: "City", accessor: "cityName" },
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

  const handleEdit = (city: any) => {
    setIsEditing(true);
    setCurrentCity(city);
    reset(city);
    setIsModalOpen(true);
  };

  const handleDelete = (state: any) => {
    setCurrentCity(state);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!currentCity) return;

    try {
      await dispatch(deleteCity(currentCity.id)).unwrap();
      await dispatch(getAllCities({}));
    } catch (error) {
      console.error("Error deleting country:", error);
    }

    setIsDeleteModalOpen(false);
  };

  const handleView = (city: any) => {
    setCurrentCity(city);
    setIsViewModalOpen(true);
  };

  const handleOpenModal = (editing = false, city: cityData | null = null) => {
    if (editing && city) {
      reset({
        id: city.id,
        countryId: city.countryId,
        stateId: city.stateId,
        countryName: city.countryName,
        stateName: city.stateName,
        cityName: city.cityName,
        activeFlag: city.activeFlag
      });
      setCity(city);
    } else {
      reset({
        id: null,
        countryId: '',
        stateId: '',
        countryName: '',
        stateName: '',
        cityName: '',
        activeFlag: true
      });
      setCity(null);
    }
    setIsEditing(editing);
    setIsModalOpen(true);
  };


  const onSubmit = async (data: CityFormData) => {
    try {
      console.log('Form data submitted:', data); // Add this to debug

      if (isEditing) {
        await dispatch(updateCity({
          ...data,
        }));
      } else {
        const { id, ...newCityData } = data;
        await dispatch(createCity({
          ...newCityData,
        }));
      }
      dispatch(getAllCities({}));
      setIsModalOpen(false);
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div>
      <DataTable
        columns={columns}
        data={cityList}
        title="City Master"
        onAdd={() => handleOpenModal(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        showActions={true}
        filterPlaceholder="Search City..."
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? "Edit City" : "Add City"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Select Country <span className="text-red-600">*</span> </label>
            <select {...register("countryId", { required: "Country is required" })} className="input mt-1">
              <option value="">Select a country</option>
              {countryList?.map((country: any) => (
                <option key={country.id} value={country.id}>{country.countryName}</option>
              ))}
            </select>
            {/* {errors.countryId && <p className="mt-1 text-sm text-red-600">{errors.countryId.message}</p>} */}
            {(touchedFields.countryId && errors.countryId) && (
              <p className="mt-1 text-sm text-red-600">
                {errors.countryId.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Select State <span className="text-red-600">*</span> </label>
            <select {...register("stateId", { required: "State is required" })} className="input mt-1">
              <option value="">Select a State</option>
              {stateList?.map((state: any) => (
                <option key={state.id} value={state.id}>{state.stateName}</option>
              ))}
            </select>
            {/* {errors.countryId && <p className="mt-1 text-sm text-red-600">{errors.countryId.message}</p>} */}
            {(touchedFields.stateId && errors.stateId) && (
              <p className="mt-1 text-sm text-red-600">
                {errors.stateId.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">City <span className="text-red-600">*</span> </label>
            <input {...register("cityName", { required: "City Name is required" })}
              placeholder="Enter City Name"
              className="input mt-1" />
            {/* {errors.cityName && <p className="mt-1 text-sm text-red-600">{errors.cityName.message}</p>} */}
            {(touchedFields.cityName && errors.cityName) && (
              <p className="mt-1 text-sm text-red-600">
                {errors.cityName.message}
              </p>
            )}
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
            {/* <button type="submit" className="btn btn-primary">{isEditing ? "Update City" : "Add City"}</button> */}
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
              {isEditing ? "Update City" : "Add City"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Delete">
        <div className="space-y-4">
          <p>Are you sure you want to delete state "{currentCity?.cityName}"?</p>
          <div className="flex justify-end space-x-3 pt-4">
            <button onClick={() => setIsDeleteModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button onClick={confirmDelete} className="btn btn-danger">Delete</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="City Details">
        {currentCity && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm">Country Name</p>
                <p className="font-medium">{currentCity.countryName}</p>
              </div>
              <div>
                <p className="text-sm">State Name</p>
                <p className="font-medium">{currentCity.stateName}</p>
              </div>
              <div>
                <p className="text-sm">City Name</p>
                <p className="font-medium">{currentCity.cityName}</p>
              </div>
              <div>
                <p className="text-sm">Status</p>
                <p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${currentCity.activeFlag ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                  >
                    {currentCity.activeFlag ? "Active" : "Inactive"}
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

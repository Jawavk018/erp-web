import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "@/components/ui/Modal";
import { DataTable } from "@/components/data/DataTable";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { createVendor, deleteVendor, getAllVendors, updateVendor } from "@/state/vendorSlice";
import { getAllStates } from "@/state/stateSlice";
import { getAllCountries } from "@/state/countrySlice";
import { getAllCities } from "@/state/citySlice";
import { Trash } from "lucide-react";

interface vendorData {
    id?: number | null;
    vendorName: string;
    gstno: string;
    pancard: string;
    mobileno: string;
    email: string;
    activeFlag: boolean;
    photoUrl?: string | null;
    address: AddressDetail[]; // always array!
}

interface vendorFormData extends vendorData { }

interface AddressDetail {
    id?: number;
    line1: string;
    line2: string;
    countryId: string;
    stateId: string;
    cityId: string;
    activeFlag: boolean;
}

export function VendorMaster() {
    const { stateList } = useSelector((state: RootState) => state.state);
    const { countryList } = useSelector((state: RootState) => state.country);
    const { cityList } = useSelector((state: RootState) => state.city);
    let { vendorList } = useSelector((state: RootState) => state.vendor);

    // Normalize address to array for all rows
    vendorList = vendorList?.map((v: any) => ({
        ...v,
        address: Array.isArray(v.address) ? v.address : v.address ? [v.address] : [],
    }));
    const [vendor, setVendor]: any = useState(vendorList);


    const [currentVendor, setCurrentVendor]: any = useState<vendorData | null>(null);
    const [addressDetails, setAddressDetails]: any = useState<AddressDetail[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    // const { register, handleSubmit, reset, formState: { errors } } = useForm<vendorFormData>();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, touchedFields, isValid }
    } = useForm<vendorFormData>({
        mode: 'onBlur', // Validate on blur
        reValidateMode: 'onBlur' // Re-validate on blur
    });

    useEffect(() => {
        dispatch(getAllCountries({}));
        dispatch(getAllStates({}));
        dispatch(getAllCities({}));
        dispatch(getAllVendors({}));
    }, [dispatch]);

    const columns = useMemo(
        () => [
            { Header: "ID", accessor: "id" },
            { Header: "Name", accessor: "vendorName" },
            { Header: "Mobile", accessor: "mobileno" },
            { Header: "GST NO", accessor: "gstno" },
            { Header: "pancard", accessor: "pancard" },
            { Header: "Email", accessor: "email" },
        ],
        []
    );

    const handleAddAddress = () => {
        setAddressDetails([...addressDetails, { id: addressDetails.length + 1, line1: "", line2: "", countryId: "", stateId: "", cityId: "", activeFlag: true }]);
    };

    const handleDeleteAddress = (id: any) => {
        setAddressDetails(addressDetails.filter((item: any) => item.id !== id));
    };

    const handleEdit = (vendor: vendorData) => {
        setIsEditing(true);
        setCurrentVendor(vendor);
        // setAddressDetails(vendor.address ?? []);
        setAddressDetails(Array.isArray(vendor.address) ? vendor.address : vendor.address ? [vendor.address] : []);
        reset({
            id: vendor.id,
            vendorName: vendor.vendorName,
            gstno: vendor.gstno,
            pancard: vendor.pancard,
            mobileno: vendor.mobileno,
            email: vendor.email,
            activeFlag: vendor.activeFlag,
            address: Array.isArray(vendor.address) ? vendor.address : vendor.address ? [vendor.address] : [],
            // address: vendor.address ?? [],
        });
        setIsModalOpen(true);
    };

    const handleDelete = (state: any) => {
        setCurrentVendor(state);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!currentVendor) return;

        try {
            await dispatch(deleteVendor(currentVendor.id)).unwrap();
            await dispatch(getAllVendors({}));
        } catch (error) {
            console.error("Error deleting country:", error);
        }

        setIsDeleteModalOpen(false);
    };

    const handleView = (vendor: vendorData) => {
        setCurrentVendor(vendor);
        setIsViewModalOpen(true);
    };

    // const handleOpenModal = (editing = false, vendor: vendorData | null = null) => {
    //     if (editing && vendor) {
    //         reset(vendor);
    //         setCurrentVendor(vendor);
    //         setAddressDetails(vendor.address ?? []);
    //     } else {
    //         reset({});
    //         setCurrentVendor(null);
    //         setAddressDetails([]);
    //     }
    //     setIsEditing(editing);
    //     setIsModalOpen(true);
    // };
    const handleOpenModal = (editing = false, state: vendorData | null = null) => {
        if (editing && state) {
            reset({
            });
            setVendor(state);
        } else {
            reset({
            });
            setVendor(null);
        }
        setIsEditing(editing);
        setIsModalOpen(true);
    };

    const onSubmit = async (data: vendorFormData) => {
        try {
            const payload = {
                ...data,
                address: addressDetails[0] || {}, // send only the first address object
            };
            if (isEditing) {
                await dispatch(updateVendor(payload)).unwrap();
            } else {
                const { id, ...newVendorData } = payload;
                await dispatch(createVendor(newVendorData)).unwrap();
            }
            dispatch(getAllVendors({}));
            setIsModalOpen(false);
            reset();
            setAddressDetails([]);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };


    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Vendor Management</h1>
            <DataTable
                columns={columns}
                data={vendorList}
                title="Vendors"
                onAdd={() => handleOpenModal(false)}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                showActions={true}
                filterPlaceholder="Search Vendor..."
            />

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center flex justify-end z-50 bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-8 shadow-lg w-3/4 h-full  max-h-full overflow-y-auto ">
                        <h2 className="text-xl font-semibold mb-6 text-gray-800 flex justify-between ">
                            {isEditing ? "Update Vendor" : "Add Vendor"}
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" onClick={() => setIsModalOpen(false)} className="bi bi-x cursor-pointer" viewBox="0 0 16 16">
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                            </svg>
                        </h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Vendor Name <span className="text-red-600">*</span> </label>
                                    <input {...register("vendorName", { required: "Vendor Name is required" })}
                                        placeholder="Enter Vendor Name"
                                        className="input mt-1" />
                                    {errors.vendorName && <p className="text-red-500 text-sm">{errors.vendorName.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">GST No <span className="text-red-600">*</span> </label>
                                    <input {...register('gstno', { required: 'GST No is required' })}
                                        placeholder="Enter GST No"
                                        className="input mt-1" />
                                    {errors.gstno && <p className="text-red-600 text-sm">{errors.gstno.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">pancard <span className="text-red-600">*</span> </label>
                                    <input {...register("pancard", { required: "PanCard No is required" })}
                                        placeholder="Enter PanCard No"
                                        className="input mt-1" />
                                    {errors.pancard && <p className="text-red-600 text-sm">{errors.pancard.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">Mobile No <span className="text-red-600">*</span> </label>
                                    <input {...register("mobileno", { required: "Mobile No is required" })}
                                        placeholder="Enter Mobile No"
                                        className="input mt-1" />
                                    {errors.mobileno && <p className="text-red-600 text-sm">{errors.mobileno.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">Email <span className="text-red-600">*</span> </label>
                                    <input {...register("email", { required: "Email is required" })}
                                        placeholder="Enter Email"
                                        className="input mt-1" />
                                    {errors.email && <p className="text-red-600 text-sm">{errors.email.message} </p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">Status</label>
                                    <select {...register("activeFlag", { required: "Status is required" })} className="input mt-1">
                                        <option value="true">Active</option>
                                        <option value="false">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            {/* Address Details */}
                            <div className="h-10"></div>
                            <div className="mt-10">
                                <h3 className="font-semibold">Address Details
                                    <button type="button"
                                        onClick={handleAddAddress} className="ml-2 bg-blue-500 text-white px-2 py-1 rounded">
                                        + Add Address
                                    </button>
                                </h3>
                                <table className="w-full border mt-4">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <th>SL.NO</th><th>Line 1</th><th>Line 2</th><th>Country</th><th>State</th><th>City</th><th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {addressDetails?.map((item: any, index: any) => (
                                            <tr key={item.id} className="border">
                                                <td className="p-2">{index + 1}</td>
                                                <td className="p-2">
                                                    <input
                                                        type="text"
                                                        value={item.line1}
                                                        onChange={e => {
                                                            const updated = [...addressDetails];
                                                            updated[index].line1 = e.target.value;
                                                            setAddressDetails(updated);
                                                        }}
                                                        className="border p-1 w-full"
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <input
                                                        type="text"
                                                        value={item.line2}
                                                        onChange={e => {
                                                            const updated = [...addressDetails];
                                                            updated[index].line2 = e.target.value;
                                                            setAddressDetails(updated);
                                                        }}
                                                        className="border p-1 w-full"
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <select
                                                        value={item.countryId}
                                                        onChange={e => {
                                                            const updated = [...addressDetails];
                                                            updated[index].countryId = e.target.value;
                                                            setAddressDetails(updated);
                                                        }}
                                                        className="input mt-1"
                                                    >
                                                        <option value="">Select a Country</option>
                                                        {countryList?.map((country: any) => (
                                                            <option key={country.id} value={country.id}>{country.countryName}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="p-2">
                                                    <select
                                                        value={item.stateId}
                                                        onChange={e => {
                                                            const updated = [...addressDetails];
                                                            updated[index].stateId = e.target.value;
                                                            setAddressDetails(updated);
                                                        }}
                                                        className="input mt-1"
                                                    >
                                                        <option value="">Select a State</option>
                                                        {stateList?.map((state: any) => (
                                                            <option key={state.id} value={state.id}>{state.stateName}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="p-2">
                                                    <select
                                                        value={item.cityId}
                                                        onChange={e => {
                                                            const updated = [...addressDetails];
                                                            updated[index].cityId = e.target.value;
                                                            setAddressDetails(updated);
                                                        }}
                                                        className="input mt-1"
                                                    >
                                                        <option value="">Select a City</option>
                                                        {cityList?.map((city: any) => (
                                                            <option key={city.id} value={city.id}>{city.cityName}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="p-2">
                                                    <Trash className="text-red-500 cursor-pointer" onClick={() => handleDeleteAddress(item.id)} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="btn btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {isEditing ? 'Update Vendor' : 'Add Vendor'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {/* View Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="Vendor Details"
            >
                {currentVendor && (
                    <div className="space-y-4">
                        <div className="flex gap-6 items-center">
                            {currentVendor.photoUrl && (
                                <img
                                    src={currentVendor.photoUrl}
                                    alt={currentVendor.vendorName}
                                    className="w-32 h-32 object-cover rounded-lg shadow"
                                />
                            )}
                            <div className="space-y-2">
                                <div>
                                    <p className="text-sm text-secondary-500 font-medium">
                                        Vendor Name: <span className="text-md font-bold text-gray-900">{currentVendor.vendorName}</span>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-secondary-500 font-medium">
                                        Mobile: <span className="text-md font-bold text-gray-900">{currentVendor.mobileno}</span>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-secondary-500 font-medium">
                                        Email: <span className="text-md font-bold text-gray-900">{currentVendor.email}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div>
                                <p className="text-sm text-secondary-500">GST NO</p>
                                <p className="font-medium">{currentVendor.gstno}</p>
                            </div>
                            <div>
                                <p className="text-sm text-secondary-500">Status</p>
                                <p>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs ${currentVendor.activeFlag ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {currentVendor.activeFlag ? "Active" : "Inactive"}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-secondary-500">Pancard No</p>
                                <p className="font-medium">{currentVendor.pancard}</p>
                            </div>
                        </div>

                        {/* Address Details Section */}
                        <div className="pt-4 border-t border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Address Details</h3>
                            {currentVendor.address?.map((addr: AddressDetail, index: number) => (
                                <div key={index} className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-secondary-500">Address Line 1</p>
                                        <p className="font-medium">{addr.line1}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-secondary-500">Address Line 2</p>
                                        <p className="font-medium">{addr.line2 || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-secondary-500">City</p>
                                        <p className="font-medium">
                                            {cityList.find((city: any) => city.id === addr.cityId)?.cityName || `City ID: ${addr.cityId}`}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-secondary-500">State</p>
                                        <p className="font-medium">
                                            {stateList.find((state: any) => state.id === addr.stateId)?.stateName || `State ID: ${addr.stateId}`}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-secondary-500">Country</p>
                                        <p className="font-medium">
                                            {countryList.find((country: any) => country.id === addr.countryId)?.countryName || `Country ID: ${addr.countryId}`}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-secondary-500">Status</p>
                                        <p>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs ${addr.activeFlag ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {addr.activeFlag ? "Active" : "Inactive"}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                onClick={() => setIsViewModalOpen(false)}
                                className="btn btn-secondary"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Delete">
                <div className="space-y-4">
                    <p>Are you sure you want to delete Vendor"{currentVendor?.vendorName}"?</p>
                    {/* <p className="text-red-600 text-sm">This action cannot be undone.</p> */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button onClick={() => setIsDeleteModalOpen(false)} className="btn btn-secondary">Cancel</button>
                        <button onClick={confirmDelete} className="btn btn-danger">Delete</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
import { Key, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data/DataTable";
import { Trash } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { getAllCountries } from "@/state/countrySlice";
import { getAllCities } from "@/state/citySlice";
import { getAllStates } from "@/state/stateSlice";
import React from "react";
import { createConsignee, deleteConsignee, getAllConsignee, updateConsignee } from "@/state/consigneeSlice";
import { updateCustomer } from "@/state/customerSlice";

interface consigneeData {
    id?: number;
    consigneeName: string;
    gstNo: string;
    panCard: string;
    mobileNo: string;
    email: string;
    activeFlag: boolean;
    address: AddressDetail[],
}

interface consigneeFormData {
    id?: number;
    consigneeName: string;
    gstNo: string;
    panCard: string;
    mobileNo: string;
    email: string;
    activeFlag: boolean;
    address: AddressDetail[],
}

interface AddressDetail {
    id?: number;
    line1: string;
    line2: string;
    countryId: string;
    stateId: string;
    cityId: string;
    activeFlag: boolean;
}

export function ConsigneeMaster() {

    const { stateList } = useSelector((state: RootState) => state.state);
    const { countryList } = useSelector((state: RootState) => state.country);
    const { cityList } = useSelector((state: RootState) => state.city);
    const { consigneeList } = useSelector((state: RootState) => state.consignee);
    const [addressDetails, setAddressDetails] = useState<AddressDetail[]>([]);
    const [consignee, setConsignee]: any = useState(consigneeList);
    const [currentConsignee, setCurrentConsignee]: any = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditing, setIsEditing] = React.useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [consigneeImage, setConsigneeImage]: any = useState(null);
    const dispatch = useDispatch<AppDispatch>();

    // const { register, handleSubmit, reset, formState: { errors } } = useForm<consigneeFormData>();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, touchedFields, isValid }
    } = useForm<consigneeFormData>({
        mode: 'onBlur', // Validate on blur
        reValidateMode: 'onBlur' // Re-validate on blur
    });

    useEffect(() => {
        dispatch(getAllCountries({}));
        dispatch(getAllStates({}));
        dispatch(getAllCities({}));
        dispatch(getAllConsignee({}));
    }, [dispatch]);

    const columns = useMemo(
        () => [
            { Header: "ID", accessor: "id" },
            { Header: "Consignee Name", accessor: "consigneeName" },
            { Header: "Mobile", accessor: "mobileNo" },
            { Header: "GST NO", accessor: "gstNo" },
            { Header: "PanCard", accessor: "panCard" },
            { Header: "Email", accessor: "email" },
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

    const handleAddAddress = () => {
        setAddressDetails([...addressDetails, { id: addressDetails.length + 1, line1: "", line2: "", countryId: "", stateId: "", cityId: "", activeFlag: true }]);
    };

    const handleDeleteAddress = (id: any) => {
        setAddressDetails(addressDetails.filter((item: any) => item.id !== id));
    };

    const handleEdit = (consignee: consigneeData) => {
        setIsEditing(true);
        setCurrentConsignee(consignee);
        // Defensive: always set as array
        setAddressDetails(Array.isArray(consignee.address) ? consignee.address : consignee.address ? [consignee.address] : []);
        // setCustomerImage(customer.imageUrl || null);
        reset({
            id: consignee.id,
            consigneeName: consignee.consigneeName,
            gstNo: consignee.gstNo,
            panCard: consignee.panCard,
            mobileNo: consignee.mobileNo,
            email: consignee.email,
            activeFlag: consignee.activeFlag,
            address: Array.isArray(consignee.address) ? consignee.address : consignee.address ? [consignee.address] : [],
        });
        setIsModalOpen(true);
    };

    const handleDelete = (state: any) => {
        setCurrentConsignee(state);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!currentConsignee) return;

        try {
            await dispatch(deleteConsignee(currentConsignee.id)).unwrap();
            await dispatch(getAllConsignee({}));
        } catch (error) {
            console.error("Error deleting country:", error);
        }

        setIsDeleteModalOpen(false);
    };

    const handleView = (consignee: consigneeData) => {
        setCurrentConsignee(consignee);
        setIsViewModalOpen(true);
    };

    const handleOpenModal = (editing = false, state: consigneeData | null = null) => {
        if (editing && state) {
            reset({
            });
            setConsignee(state);
        } else {
            reset({
            });
            setConsignee(null);
        }
        setIsEditing(editing);
        setIsModalOpen(true);
    };

    const onSubmit = async (data: consigneeFormData) => {
        try {
            console.log('Form data submitted:', data); // Debug

            const payload = {
                ...data,
                address: addressDetails[0],
            };

            if (isEditing) {
                await dispatch(updateConsignee(payload)).unwrap();
            } else {
                const { id, ...newconsigneeData } = payload;
                await dispatch(createConsignee(newconsigneeData)).unwrap();
            }

            dispatch(getAllConsignee({}));
            setIsModalOpen(false);
            reset();
            setAddressDetails([]);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setConsigneeImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };


    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Consignee Management</h1>
            {/* <Button onClick={handleAddCustomer} className="mb-4">Add Customer</Button> */}
            <DataTable
                columns={columns}
                data={consigneeList}
                title="Consignee"
                onAdd={() => handleOpenModal(false)}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                showActions={true}
                filterPlaceholder="Search Consignee..."
            />

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center flex justify-end z-50 bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-8 shadow-lg w-3/4 h-full  max-h-full overflow-y-auto ">
                        <h2 className="text-xl font-semibold mb-6 text-gray-800 flex justify-between ">
                            {isEditing ? "Update Consignee" : "Add Consignee"}
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" onClick={() => setIsModalOpen(false)} className="bi bi-x cursor-pointer" viewBox="0 0 16 16">
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                            </svg>
                        </h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Consignee Name <span className="text-red-600">*</span> </label>
                                    <input {...register("consigneeName", { required: "Consignee Name is required" })}
                                        placeholder="Enter Consignee Name"
                                        className="input mt-1" />
                                    {errors.consigneeName && <p className="text-red-500 text-sm">{errors.consigneeName.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">GST No <span className="text-red-600">*</span> </label>
                                    <input {...register('gstNo', { required: 'GST No is required' })}
                                        placeholder="Enter GST No"
                                        className="input mt-1" />
                                    {errors.gstNo && <p className="text-red-600 text-sm">{errors.gstNo.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">Pancard <span className="text-red-600">*</span> </label>
                                    <input {...register("panCard", { required: "PanCard No is required" })}
                                        placeholder="Enter PanCard No"
                                        className="input mt-1" />
                                    {errors.panCard && <p className="text-red-600 text-sm">{errors.panCard.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">Mobile No <span className="text-red-600">*</span> </label>
                                    <input {...register("mobileNo", { required: "Mobile No is required" })}
                                        placeholder="Enter Mobile No"
                                        className="input mt-1" />
                                    {errors.mobileNo && <p className="text-red-600 text-sm">{errors.mobileNo.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">Email <span className="text-red-600">*</span> </label>
                                    <input {...register("email", { required: "Email is required" })}
                                        placeholder="Enter Email"
                                        className="input mt-1" />
                                    {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">Status</label>
                                    <select {...register("activeFlag", { required: "Status is required" })} className="input mt-1">
                                        <option value="true">Active</option>
                                        <option value="false">Inactive</option>
                                    </select>
                                </div>
                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-700">Image</label>
                                    <input type="file" onChange={handleImageUpload} className="mt-2" />
                                    {consigneeImage && (
                                        <img
                                            src={consigneeImage}
                                            alt="Uploaded"
                                            className="mt-2 w-24 h-24 border rounded-lg object-cover"
                                        />
                                    )}
                                </div> */}
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
                                        {addressDetails?.map((item, index) => (
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
                                {/* <button type="submit" className="btn btn-primary">
                                    {isEditing ? 'Update Consignee' : 'Add Consignee'}
                                </button> */}
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
                                    {isEditing ? "Update Consignee" : "Add Consignee"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* View Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="Consignee Details"
            >
                {currentConsignee && (
                    <div className="space-y-4">
                        {/* Image + Name, Mobile, Email Section */}
                        <div className="flex gap-6 items-center">
                            {/* Left: Image - Assuming imageUrl might be available */}
                            {currentConsignee.imageUrl && (
                                <img
                                    src={currentConsignee.imageUrl}
                                    alt={currentConsignee.consigneeName}
                                    className="w-32 h-32 object-cover rounded-lg shadow"
                                />
                            )}

                            {/* Right: Name, Mobile No, Email */}
                            <div className="space-y-2">
                                <div>
                                    <p className="text-sm text-secondary-500 font-medium">
                                        Consignee Name: <span className="text-md font-bold text-gray-900">{currentConsignee.consigneeName}</span>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-secondary-500 font-medium">
                                        Mobile: <span className="text-md font-bold text-gray-900">{currentConsignee.mobileNo}</span>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-secondary-500 font-medium">
                                        Email: <span className="text-md font-bold text-gray-900">{currentConsignee.email}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div>
                                <p className="text-sm text-secondary-500">GST NO</p>
                                <p className="font-medium">{currentConsignee.gstNo}</p>
                            </div>
                            <div>
                                <p className="text-sm text-secondary-500">Status</p>
                                <p>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs ${currentConsignee.activeFlag ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {currentConsignee.activeFlag ? "Active" : "Inactive"}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-secondary-500">Pancard No</p>
                                <p className="font-medium">{currentConsignee.panCard}</p>
                            </div>
                            <div>
                                <p className="text-sm text-secondary-500">Address Status</p>
                                <p>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs ${currentConsignee.address.activeFlag ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {currentConsignee.address.activeFlag ? "Active" : "Inactive"}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Address Details Section */}
                        <div className="pt-4 border-t border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Address Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-secondary-500">Address Line 1</p>
                                    <p className="font-medium">{currentConsignee.address.line1}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-secondary-500">Address Line 2</p>
                                    <p className="font-medium">{currentConsignee.address.line2 || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-secondary-500">City</p>
                                    <p className="font-medium">
                                        {cityList.find((city: any) => city.id === currentConsignee.address.cityId)?.cityName || `City ID: ${currentConsignee.address.cityId}`}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-secondary-500">State</p>
                                    <p className="font-medium">
                                        {stateList.find((state: any) => state.id === currentConsignee.address.stateId)?.stateName || `State ID: ${currentConsignee.address.stateId}`}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-secondary-500">Country</p>
                                    <p className="font-medium">
                                        {countryList.find((country: any) => country.id === currentConsignee.address.countryId)?.countryName || `Country ID: ${currentConsignee.address.countryId}`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Close Button */}
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
                    <p>Are you sure you want to delete Consignee "{currentConsignee?.consigneeName}"?</p>
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

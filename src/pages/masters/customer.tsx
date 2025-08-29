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
import { createCustomer, deleteCustomer, getAllCustomers, updateCustomer } from "@/state/customerSlice";
import React from "react";

interface customerData {
    id?: number;
    customerName: string;
    gstNo: string;
    panCard: string;
    mobileNo: string;
    email: string;
    iecCode: string;
    cinNo: string;
    tinNo: string;
    msmeUdyam: string;
    pinCode: string;
    contactPerson: string;
    activeFlag: boolean;
    address: AddressDetail[];
}

interface customerFormData {
    id?: number;
    customerName: string;
    gstNo: string;
    panCard: string;
    mobileNo: string;
    email: string;
    iecCode: string;
    cinNo: string;
    tinNo: string;
    msmeUdyam: string;
    pinCode: string;
    contactPerson: string;
    activeFlag: boolean;
    address: AddressDetail[];
}

interface AddressDetail {
    id?: number;
    line1: string;
    line2: string;
    countryId: string;
    stateId: string;
    cityId: string;
    pinCode: string;
    activeFlag: boolean;
}

export function CustomerMaster() {
    const { stateList } = useSelector((state: RootState) => state.state);
    const { countryList } = useSelector((state: RootState) => state.country);
    const { cityList } = useSelector((state: RootState) => state.city);
    const { customerList } = useSelector((state: RootState) => state.customer);
    const [addressDetails, setAddressDetails] = useState<AddressDetail[]>([]);
    const [customers, setCustomers]: any = useState(customerList);
    const [currentCustomer, setCurrentCustomer]: any = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [isEditing, setIsEditing] = React.useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [customerImage, setCustomerImage]: any = useState(null);
    const dispatch = useDispatch<AppDispatch>();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, touchedFields, isValid }
    } = useForm<customerFormData>({
        mode: 'onBlur',
        reValidateMode: 'onBlur'
    });

    useEffect(() => {
        dispatch(getAllCountries({}));
        dispatch(getAllStates({}));
        dispatch(getAllCities({}));
        dispatch(getAllCustomers({}));
    }, [dispatch]);

    const columns = useMemo(
        () => [
            {
                Header: 'ID',
                accessor: 'id',
                Cell: ({ row }: { row: { index: number } }) => row.index + 1
            },
            { Header: "Customer Name", accessor: "customerName" },
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
        setAddressDetails([...addressDetails, {
            id: addressDetails.length + 1,
            line1: "",
            line2: "",
            countryId: "",
            stateId: "",
            cityId: "",
            pinCode: "",
            activeFlag: true
        }]);
    };

    const handleDeleteAddress = (id: any) => {
        setAddressDetails(addressDetails.filter((item: any) => item.id !== id));
    };

    const handleEdit = (customer: customerData) => {
        setIsEditing(true);
        setCurrentCustomer(customer);
        setAddressDetails(Array.isArray(customer.address) ? customer.address : customer.address ? [customer.address] : []);
        reset({
            id: customer.id,
            customerName: customer.customerName,
            gstNo: customer.gstNo,
            panCard: customer.panCard,
            mobileNo: customer.mobileNo,
            email: customer.email,
            iecCode: customer.iecCode,
            cinNo: customer.cinNo,
            tinNo: customer.tinNo,
            msmeUdyam: customer.msmeUdyam,
            pinCode: customer.pinCode,
            contactPerson: customer.contactPerson,
            activeFlag: customer.activeFlag,
            address: Array.isArray(customer.address) ? customer.address : customer.address ? [customer.address] : [],
        });
        setIsModalOpen(true);
    };

    const handleDelete = (state: any) => {
        setCurrentCustomer(state);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!currentCustomer) return;

        try {
            await dispatch(deleteCustomer(currentCustomer.id)).unwrap();
            await dispatch(getAllCustomers({}));
        } catch (error) {
            console.error("Error deleting country:", error);
        }

        setIsDeleteModalOpen(false);
    };

    const handleView = (customer: customerData) => {
        setCurrentCustomer(customer);
        setIsViewModalOpen(true);
    };

    const handleOpenModal = (editing = false, state: customerData | null = null) => {
        if (editing && state) {
            reset({});
            setCustomers(state);
        } else {
            reset({});
            setCustomers(null);
        }
        setIsEditing(editing);
        setIsModalOpen(true);
    };

    const onSubmit = async (data: customerFormData) => {
        try {
            console.log('Form data submitted:', data);

            const payload = {
                ...data,
                address: addressDetails[0],
            };

            if (isEditing) {
                await dispatch(updateCustomer(payload)).unwrap();
            } else {
                const { id, ...newCustomerData } = payload;
                await dispatch(createCustomer(newCustomerData)).unwrap();
            }

            dispatch(getAllCustomers({}));
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
                setCustomerImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            {/* <h1 className="text-2xl font-bold mb-6">Customer Management</h1> */}
            <DataTable
                columns={columns}
                data={customerList}
                title="Buyers / Customers"
                onAdd={() => handleOpenModal(false)}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                showActions={true}
                filterPlaceholder="Search Customer..."
            />

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center flex justify-end z-50 bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-8 shadow-lg w-3/4 h-full max-h-full overflow-y-auto">
                        <h2 className="text-xl font-semibold mb-6 text-gray-800 flex justify-between">
                            {isEditing ? "Update Customer" : "Add Customer"}
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" onClick={() => setIsModalOpen(false)} className="bi bi-x cursor-pointer" viewBox="0 0 16 16">
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                            </svg>
                        </h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                {/* Basic Information */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Customer Name <span className="text-red-600">*</span></label>
                                    <input {...register("customerName", { required: "Customer Name is required" })}
                                        placeholder="Enter Customer Name"
                                        className="input mt-1" />
                                    {errors.customerName && <p className="text-red-500 text-sm">{errors.customerName.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">Mobile No <span className="text-red-600">*</span></label>
                                    <input {...register("mobileNo", { required: "Mobile No is required" })}
                                        placeholder="Enter Mobile No"
                                        className="input mt-1" />
                                    {errors.mobileNo && <p className="text-red-600 text-sm">{errors.mobileNo.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">Email <span className="text-red-600">*</span></label>
                                    <input {...register("email", { required: "Email is required" })}
                                        placeholder="Enter Email"
                                        className="input mt-1" />
                                    {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
                                </div>

                                {/* Tax Information */}
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">GST No <span className="text-red-600">*</span></label>
                                    <input {...register('gstNo', { required: 'GST No is required' })}
                                        placeholder="Enter GST NO"
                                        className="input mt-1" />
                                    {errors.gstNo && <p className="text-red-600 text-sm">{errors.gstNo.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">PanCard <span className="text-red-600">*</span></label>
                                    <input {...register("panCard", { required: "PanCard No is required" })}
                                        placeholder="Enter PanCard No"
                                        className="input mt-1" />
                                    {errors.panCard && <p className="text-red-600 text-sm">{errors.panCard.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">IEC Code</label>
                                    <input {...register("iecCode")}
                                        placeholder="Enter IEC Code"
                                        className="input mt-1" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">CIN No</label>
                                    <input {...register("cinNo")}
                                        placeholder="Enter CIN No"
                                        className="input mt-1" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">TIN No</label>
                                    <input {...register("tinNo")}
                                        placeholder="Enter TIN No"
                                        className="input mt-1" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">MSME Udyam</label>
                                    <input {...register("msmeUdyam")}
                                        placeholder="Enter MSME Udyam"
                                        className="input mt-1" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">Status</label>
                                    <select {...register("activeFlag", { required: "Status is required" })} className="input mt-1">
                                        <option value="true">Active</option>
                                        <option value="false">Inactive</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Image</label>
                                    <input type="file" onChange={handleImageUpload} className="mt-2" />
                                    {customerImage && (
                                        <img
                                            src={customerImage}
                                            alt="Uploaded"
                                            className="mt-2 w-24 h-24 border rounded-lg object-cover"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Address Details */}
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
                                            <th>SL.NO</th>
                                            <th>Line 1</th>
                                            <th>Line 2</th>
                                            <th>Country</th>
                                            <th>State</th>
                                            <th>City</th>
                                            {/* <th>Pin Code</th> */}
                                            <th>Action</th>
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
                                                        required
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
                                                        required
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
                                                        required
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
                                                        required
                                                    >
                                                        <option value="">Select a City</option>
                                                        {cityList?.map((city: any) => (
                                                            <option key={city.id} value={city.id}>{city.cityName}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                {/* <td className="p-2">
                                                    <input
                                                        type="text"
                                                        value={item.pinCode}
                                                        onChange={e => {
                                                            const updated = [...addressDetails];
                                                            updated[index].pinCode = e.target.value;
                                                            setAddressDetails(updated);
                                                        }}
                                                        className="border p-1 w-full"
                                                        required
                                                    />
                                                </td> */}
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
                                    {isEditing ? "Update Customer" : "Add Customer"}
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
                title="Customer Details"
            >
                {currentCustomer && (
                    <div className="space-y-4">
                        {/* Image + Name, Mobile, Email Section */}
                        <div className="flex gap-6 items-center">
                            {currentCustomer.imageUrl && (
                                <img
                                    src={currentCustomer.imageUrl}
                                    alt={currentCustomer.customerName}
                                    className="w-32 h-32 object-cover rounded-lg shadow"
                                />
                            )}
                            <div className="space-y-2">
                                <div>
                                    <p className="text-sm text-secondary-500 font-medium">
                                        Name: <span className="text-md font-bold text-gray-900">{currentCustomer.customerName}</span>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-secondary-500 font-medium">
                                        Contact Person: <span className="text-md font-bold text-gray-900">{currentCustomer.contactPerson}</span>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-secondary-500 font-medium">
                                        Mobile: <span className="text-md font-bold text-gray-900">{currentCustomer.mobileNo}</span>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-secondary-500 font-medium">
                                        Email: <span className="text-md font-bold text-gray-900">{currentCustomer.email}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Other Details */}
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div>
                                <p className="text-sm text-secondary-500">GST NO</p>
                                <p className="font-medium">{currentCustomer.gstNo}</p>
                            </div>
                            <div>
                                <p className="text-sm text-secondary-500">PAN Card</p>
                                <p className="font-medium">{currentCustomer.panCard}</p>
                            </div>
                            <div>
                                <p className="text-sm text-secondary-500">IEC Code</p>
                                <p className="font-medium">{currentCustomer.iecCode || "-"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-secondary-500">CIN No</p>
                                <p className="font-medium">{currentCustomer.cinNo || "-"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-secondary-500">TIN No</p>
                                <p className="font-medium">{currentCustomer.tinNo || "-"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-secondary-500">MSME Udyam</p>
                                <p className="font-medium">{currentCustomer.msmeUdyam || "-"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-secondary-500">Status</p>
                                <p>
                                    <span className={`px-2 py-1 rounded-full text-xs ${currentCustomer.activeFlag ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                        {currentCustomer.activeFlag ? "Active" : "Inactive"}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Address Details */}
                        <div className="pt-4">
                            <h3 className="text-sm font-medium text-secondary-500 mb-2">Addresses</h3>
                            {Array.isArray(currentCustomer.address) && currentCustomer.address.map((addr: AddressDetail, idx: number) => (
                                <div key={addr.id || idx} className="mb-4 p-3 border rounded-lg">
                                    <p className="font-medium">{addr.line1}, {addr.line2}</p>
                                    <p>{addr.cityId}, {addr.stateId}, {addr.countryId}</p>
                                    <p>Pin Code: {addr.pinCode}</p>
                                </div>
                            ))}
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
                    <p>Are you sure you want to delete Customer "{currentCustomer?.customerName}"?</p>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button onClick={() => setIsDeleteModalOpen(false)} className="btn btn-secondary">Cancel</button>
                        <button onClick={confirmDelete} className="btn btn-danger">Delete</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

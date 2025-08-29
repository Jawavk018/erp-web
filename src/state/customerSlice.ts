import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ApiState {
    loading: boolean;
    error: string | null;
    customerList: any;
    createCustomerResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    customerList: [],
    createCustomerResult: null,
    checking: false,
};

// Thunk for getAllCustomers GET API call
export const getAllCustomers = createAsyncThunk(
    'customer/getAllCustomers',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/customer"); // Adjust API endpoint if needed
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for createCustomer POST API call
export const createCustomer: any = createAsyncThunk(
    'customer/createCustomer',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/customer", params); // Adjust API endpoint if needed
            console.log(response)
            if (response?.status === 'success') {
                toast.success(response?.message);
                return response;
            } else {
                const errorMessage = "Something went wrong";
                // toast.error(errorMessage);
                return thunkAPI.rejectWithValue(errorMessage);
            }
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for updateCustomer PUT API call
export const updateCustomer: any = createAsyncThunk(
    'customer/updateCustomer',
    async (params: any, thunkAPI) => {
        console.log(params);
        try {
            const response = await apiService.put(`/customer/${params.id}`, params); // ✅ Fix: Add ID to the URL
            console.log(response);
            if (response?.status === 'success') {
                toast.success(response?.message);
                return response;
            } else {
                const errorMessage = "Something went wrong";
                // toast.error(errorMessage);
                return thunkAPI.rejectWithValue(errorMessage);
            }
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// export const deleteCustomer: any = createAsyncThunk(
//     'customer/deleteCustomer',
//     async (id: number, thunkAPI) => {
//         try {
//             const response = await apiService.delete(`/customer/${id}`);
//             console.log(response); // Check what the API actually returns
//             if (response?.status === 'success') {
//                 toast.success(response?.message);
//                 return response;
//             } else {
//                 const errorMessage = "Something went wrong";
//                 // toast.error(errorMessage);
//                 return thunkAPI.rejectWithValue(errorMessage);
//             }
//         } catch (error: any) {
//             return thunkAPI.rejectWithValue(error.message);
//         }
//     }
// );
export const deleteCustomer = createAsyncThunk(
    'customer/deleteCustomer',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/customer/${id}`);

            if (response?.status === 'success') {
                toast.success("Successfully deleted");
                return id; // Return the deleted ID for reducer handling
            }

            // Handle API error response
            const errorMessage = response.data.data?.message || 'Failed to delete';
            toast.error(errorMessage);
            return response;

        } catch (error: any) {
            // Handle network errors or unexpected errors
            let errorMessage = 'An error occurred while deleting';

            if (error.response) {
                // Server responded with a status code outside 2xx range
                errorMessage = error.response.data?.message || error.response.statusText || errorMessage;
            } else if (error.request) {
                // Request was made but no response received
                errorMessage = 'No response from server';
            }

            toast.error(errorMessage);
            return errorMessage;
        }
    }
);


// Create Customer Slice
const customerSlice = createSlice({
    name: "state",
    initialState,
    reducers: {}, // No normal reducers for now
    extraReducers: (builder) => {
        builder

            // Handle getAllCustomers (GET request)
            .addCase(getAllCustomers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCustomers.fulfilled, (state: any, action) => {
                state.loading = false;
                state.customerList = action.payload;
            })
            .addCase(getAllCustomers.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createCustomer (POST request)
            .addCase(createCustomer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCustomer.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createCustomerResult = action.payload;
            })
            .addCase(createCustomer.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle updateCustomer (PUT request)
            .addCase(updateCustomer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCustomer.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.customerList = state.customerList.map((table: any) =>
                    table.id === updatedTable.id ? updatedTable : table
                );
            })
            .addCase(updateCustomer.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteCustomer (DELETE request)
            .addCase(deleteCustomer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCustomer.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedCustomer = action.payload;
                state.customerList = state.customerList.filter(
                    (customer: any) => customer.id !== deletedCustomer.id
                );
            })
            .addCase(deleteCustomer.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export reducer
export default customerSlice.reducer;

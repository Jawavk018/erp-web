import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ApiState {
    loading: boolean;
    error: string | null;
    customerInternationalList: any;
    createCustomerInternationalResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    customerInternationalList: [],
    createCustomerInternationalResult: null,
    checking: false,
};

// Thunk for getAllCustomerInternational GET API call
export const getAllCustomerInternational = createAsyncThunk(
    'customer_international/getAllCustomerInternational',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/customer_international"); // Adjust API endpoint if needed
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for createCustomerInternational POST API call
export const createCustomerInternational: any = createAsyncThunk(
    'customer_international/createCustomerInternational',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/customer_international", params); // Adjust API endpoint if needed
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

// Thunk for updateCustomerInternational PUT API call
export const updateCustomerInternational: any = createAsyncThunk(
    'customer_international/updateCustomerInternational',
    async (params: any, thunkAPI) => {
        console.log(params);
        try {
            const response = await apiService.put(`/customer_international/${params.id}`, params); // ✅ Fix: Add ID to the URL
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

// export const deleteCustomerInternational: any = createAsyncThunk(
//     'customer_international/deleteCustomerInternational',
//     async (id: number, thunkAPI) => {
//         try {
//             const response = await apiService.delete(`/customer_international/${id}`);
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
export const deleteCustomerInternational = createAsyncThunk(
    'customer_international/deleteCustomerInternational',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/customer_international/${id}`);

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
const customerInternationalSlice = createSlice({
    name: "state",
    initialState,
    reducers: {}, // No normal reducers for now
    extraReducers: (builder) => {
        builder

            // Handle getAllCustomerInternational (GET request)
            .addCase(getAllCustomerInternational.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCustomerInternational.fulfilled, (state: any, action) => {
                state.loading = false;
                state.customerInternationalList = action.payload;
            })
            .addCase(getAllCustomerInternational.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createCustomerInternational (POST request)
            .addCase(createCustomerInternational.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCustomerInternational.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createCustomerInternationalResult = action.payload;
            })
            .addCase(createCustomerInternational.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle updateCustomerInternational (PUT request)
            .addCase(updateCustomerInternational.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCustomerInternational.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.customerInternationalList = state.customerInternationalList.map((table: any) =>
                    table.id === updatedTable.id ? updatedTable : table
                );
            })
            .addCase(updateCustomerInternational.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteCustomerInternational (DELETE request)
            .addCase(deleteCustomerInternational.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCustomerInternational.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedCustomer = action.payload;
                state.customerInternationalList = state.customerInternationalList.filter(
                    (customer: any) => customer.id !== deletedCustomer.id
                );
            })
            .addCase(deleteCustomerInternational.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export reducer
export default customerInternationalSlice.reducer;

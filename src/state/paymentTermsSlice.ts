import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ApiState {
    loading: boolean;
    error: string | null;
    paymentTermsList: any;
    createPaymentTermResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    paymentTermsList: [],
    createPaymentTermResult: null,
    checking: false,
};

// Thunk for getAllPaymentTerms GET API call
export const getAllPaymentTerms = createAsyncThunk(
    'payment-terms/getAllPaymentTerms',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/payment-terms"); // Adjust API endpoint if needed
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for createPaymentTerms POST API call
export const createPaymentTerms: any = createAsyncThunk(
    'payment-terms/createPaymentTerms',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/payment-terms", params); // Adjust API endpoint if needed
            console.log(response)
            if (response?.status === 'success') {
                toast.success("Saved Successfully");
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

// Thunk for updatePaymentTerms PUT API call
export const updatePaymentTerms: any = createAsyncThunk(
    'payment-terms/updatePaymentTerms',
    async (params: any, thunkAPI) => {
        console.log(params);
        try {
            const response = await apiService.put(`/payment-terms/${params.id}`, params); // ✅ Fix: Add ID to the URL
            console.log(response);
            if (response?.status === 'success') {
                toast.success("Updated Successfully");
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

// export const deletePaymentTerms: any = createAsyncThunk(
//     'payment-terms/deletePaymentTerms',
//     async (id: number, thunkAPI) => {
//         try {
//             const response = await apiService.delete(`/payment-terms/${id}`);
//             console.log(response); // Check what the API actually returns
//             if (response?.isSuccess) {
//                 // toast.success("Successfully deleted");
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
export const deletePaymentTerms = createAsyncThunk(
    'payment-terms/deletePaymentTerms',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/payment-terms/${id}`);

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


// Create PaymentTerm Slice
const paymentTermSlice = createSlice({
    name: "state",
    initialState,
    reducers: {}, // No normal reducers for now
    extraReducers: (builder) => {
        builder

            // Handle getAllPaymentTerms (GET request)
            .addCase(getAllPaymentTerms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllPaymentTerms.fulfilled, (state: any, action) => {
                state.loading = false;
                state.paymentTermsList = action.payload;
            })
            .addCase(getAllPaymentTerms.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createPaymentTerms (POST request)
            .addCase(createPaymentTerms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPaymentTerms.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createPaymentTermResult = action.payload;
            })
            .addCase(createPaymentTerms.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle updatePaymentTerms (PUT request)
            .addCase(updatePaymentTerms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePaymentTerms.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.paymentTermsList = state.paymentTermsList.map((table: any) =>
                    table.id === updatedTable.id ? updatedTable : table
                );
            })
            .addCase(updatePaymentTerms.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deletePaymentTerms (DELETE request)
            .addCase(deletePaymentTerms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePaymentTerms.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedPaymentTerm = action.payload;
                state.paymentTermsList = state.paymentTermsList.filter(
                    (payment: any) => payment.id !== deletedPaymentTerm.id
                );
            })
            .addCase(deletePaymentTerms.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export reducer
export default paymentTermSlice.reducer;

import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ApiState {
    loading: boolean;
    error: string | null;
    purchaseInwardList: any[];
    createPurchaseInwardResult: any;
}

const initialState: ApiState = {
    loading: false,
    error: null,
    purchaseInwardList: [],
    createPurchaseInwardResult: null,
};

// Thunk for getAllPurchaseInwards GET API call
export const getAllPurchaseInwards = createAsyncThunk(
    'purchase-inward/getAllPurchaseInwards',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/purchase-inward");
            console.log(response);
            const data = response;
            console.log(data);
            return data || [];
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for createPurchaseInward POST API call
export const createPurchaseInward = createAsyncThunk(
    'purchase-inward/createPurchaseInward',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/purchase-inward", params);
            console.log(response)
            if (response) {
                toast.success("Purchase Inward Saved Successfully!");
                return response.data;
            } else {
                const errorMessage = "Failed to create purchase inward";
                return thunkAPI.rejectWithValue(errorMessage);
            }
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for updatePurchaseInward PUT API call
export const updatePurchaseInward: any = createAsyncThunk(
    'purchase_inward/updatePurchaseInward',
    async (params: any, thunkAPI) => {
        console.log(params);
        try {
            const response = await apiService.put(`/purchase_inward/${params.id}`, params); // ✅ Fix: Add ID to the URL
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

// export const deletePurchaseInward: any = createAsyncThunk(
//     'purchase_inward/deletePurchaseInward',
//     async (id: number, thunkAPI) => {
//         try {
//             const response = await apiService.delete(`/purchase_inward/${id}`);
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
export const deletePurchaseInward = createAsyncThunk(
    'purchase_inward/deletePurchaseInward',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/purchase-inward/${id}`);

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

// Create purchaseInwardSlice
const purchaseInwardSlice = createSlice({
    name: "purchaseInward",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle getAllPurchaseInwards
            .addCase(getAllPurchaseInwards.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllPurchaseInwards.fulfilled, (state, action) => {
                state.loading = false;
                state.purchaseInwardList = action.payload;
            })
            .addCase(getAllPurchaseInwards.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Handle createPurchaseInward
            .addCase(createPurchaseInward.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPurchaseInward.fulfilled, (state, action) => {
                state.loading = false;
                state.createPurchaseInwardResult = action.payload;
            })
            .addCase(createPurchaseInward.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Handle updatePurchaseInward (PUT request)
            .addCase(updatePurchaseInward.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePurchaseInward.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.purchaseInwardList = state.purchaseInwardList.map((table: any) =>
                    table.id === updatedTable.id ? updatedTable : table
                );
            })
            .addCase(updatePurchaseInward.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deletePurchaseInward (DELETE request)
            .addCase(deletePurchaseInward.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePurchaseInward.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedPurchaseInward = action.payload;
                state.purchaseInwardList = state.purchaseInwardList.filter(
                    (pi: any) => pi.id !== deletedPurchaseInward.id
                );
            })
            .addCase(deletePurchaseInward.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

// Export reducer
export default purchaseInwardSlice.reducer;

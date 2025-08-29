import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ApiState {
    loading: boolean;
    error: string | null;
    purchaseOrderList: any;
    purchaseOrderTypeList: any;
    purchaseOrderListByVendorId: any
    vendorByPoTypeList: any;
    purchaseOrderListById: any
    createPurchaseOrderResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    purchaseOrderList: [],
    purchaseOrderTypeList: [],
    purchaseOrderListById: [],
    vendorByPoTypeList: [],
    purchaseOrderListByVendorId: null,
    createPurchaseOrderResult: null,
    checking: false,
};

// Thunk for getAllPurchaseOrders GET API call
export const getAllPurchaseOrders = createAsyncThunk(
    'purchase-orders/getAllPurchaseOrders',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/purchase-orders"); // Adjust API endpoint if needed
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for getAllPoTypes GET API call
export const getAllPoTypes = createAsyncThunk(
    'purchase-orders/getAllPoTypes',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/po-type-master"); // Adjust API endpoint if needed
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for getPurchaseOrdersByVendorId
export const getPurchaseOrdersByVendorId = createAsyncThunk(
    'purchase-orders/getByVendorId',
    async (vendorId: number, thunkAPI) => {
        try {
            const response = await apiService.get(`/purchase-orders/vendor/${vendorId}`);
            console.log("API Response:", response);
            return response || { data: [], message: "", status: "success" };
        } catch (error: any) {
            console.error("API Error:", error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for getPurchaseOrderById
export const getPurchaseOrderById = createAsyncThunk(
    'purchase-orders/getPurchaseOrderById',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.get(`/purchase-orders/${id}`);
            console.log("API Response:", response);
            return response.data;
        } catch (error: any) {
            console.error("API Error:", error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for getVendorByPoId (renamed for clarity)
export const getVendorByPoId = createAsyncThunk(
    'purchaseOrders/getVendorByPoId',
    async (poTypeId: number, thunkAPI) => {  // Directly accept poTypeId as number
        try {
            const response = await apiService.get(`/purchase-orders/vendors-by-po-type/${poTypeId}`);
            console.log("API Response:", response);
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Thunk for createPurchaseOrder POST API call
export const createPurchaseOrder: any = createAsyncThunk(
    'purchase-orders/createPurchaseOrder',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/purchase-orders", params); // Adjust API endpoint if needed
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

// Thunk for updatePurchaseOrder PUT API call
// export const updatePurchaseOrder: any = createAsyncThunk(
//     'purchase-orders/updatePurchaseOrder',
//     async (params: any, thunkAPI) => {
//         console.log(params);
//         try {
//             const response = await apiService.put(`/purchase-orders/${params.id}`, params); // ✅ Fix: Add ID to the URL
//             console.log(response);
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
export const updatePurchaseOrder: any = createAsyncThunk(
    'purchase-orders/updatePurchaseOrder',
    async ({ id, data }: { id: number, data: any }, thunkAPI) => {
        try {
            // send only the data as body, not the wrapper object
            const response = await apiService.put(`/purchase-orders/${id}`, data);

            // You can adjust this depending on your backend response structure:
            if (response) {
                // You can change this to response.message if your backend returns a message
                toast.success("Purchase Order updated successfully!");
                return response;
            } else {
                const errorMessage = "Something went wrong";
                toast.error(errorMessage);
                return thunkAPI.rejectWithValue(errorMessage);
            }
        } catch (error: any) {
            toast.error(error.message || "Update failed");
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// export const deletePurchaseOrder: any = createAsyncThunk(
//     'purchase-orders/deletePurchaseOrder',
//     async (id: number, thunkAPI) => {
//         try {
//             const response = await apiService.delete(`/purchase-orders/${id}`);
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
export const deletePurchaseOrder = createAsyncThunk(
    'purchase-orders/deletePurchaseOrder',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/purchase-orders/${id}`);

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


// Create purchaseOrderSlice
const purchaseOrderSlice = createSlice({
    name: "state",
    initialState,
    reducers: {}, // No normal reducers for now
    extraReducers: (builder) => {
        builder

            // Handle getAllPurchaseOrders (GET request)
            .addCase(getAllPurchaseOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllPurchaseOrders.fulfilled, (state: any, action) => {
                state.loading = false;
                state.purchaseOrderList = action.payload;
            })
            .addCase(getAllPurchaseOrders.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle getAllPoTypes (GET request)
            .addCase(getAllPoTypes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllPoTypes.fulfilled, (state: any, action) => {
                state.loading = false;
                state.purchaseOrderTypeList = action.payload;
            })
            .addCase(getAllPoTypes.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle getVendorByPoId (GET request)
            .addCase(getVendorByPoId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getVendorByPoId.fulfilled, (state: any, action) => {
                state.loading = false;
                state.vendorByPoTypeList = action.payload;
            })
            .addCase(getVendorByPoId.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle getPurchaseOrderById (GET request)
            .addCase(getPurchaseOrderById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPurchaseOrderById.fulfilled, (state: any, action) => {
                state.loading = false;
                state.purchaseOrderListById = action.payload;
            })
            .addCase(getPurchaseOrderById.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle getPurchaseOrdersByVendorId (GET request)
            .addCase(getPurchaseOrdersByVendorId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPurchaseOrdersByVendorId.fulfilled, (state: any, action) => {
                state.loading = false;
                state.purchaseOrderListByVendorId = action.payload;
            })
            .addCase(getPurchaseOrdersByVendorId.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createPurchaseOrder (POST request)
            .addCase(createPurchaseOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPurchaseOrder.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createPurchaseOrderResult = action.payload;
            })
            .addCase(createPurchaseOrder.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle updatePurchaseOrder (PUT request)
            .addCase(updatePurchaseOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePurchaseOrder.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.purchaseOrderList = state.purchaseOrderList.map((table: any) =>
                    table.id === updatedTable.id ? updatedTable : table
                );
            })
            .addCase(updatePurchaseOrder.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deletePurchaseOrder (DELETE request)
            .addCase(deletePurchaseOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePurchaseOrder.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedPurchaseOrder = action.payload;
                state.purchaseOrderList = state.purchaseOrderList.filter(
                    (po: any) => po.id !== deletedPurchaseOrder.id
                );
            })
            .addCase(deletePurchaseOrder.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export reducer
export default purchaseOrderSlice.reducer;

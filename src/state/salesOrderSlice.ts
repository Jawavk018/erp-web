import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ApiState {
    loading: boolean;
    error: string | null;
    salesOrderList: any;
    purchaseOrderTypeList: any;
    salesOrderByCustomerIdList: any;
    createSalesOrderResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    salesOrderList: [],
    purchaseOrderTypeList: [],
    salesOrderByCustomerIdList: [],
    createSalesOrderResult: null,
    checking: false,
};

// Thunk for getAllSalesOrders GET API call
export const getAllSalesOrders = createAsyncThunk(
    'sales-orders/getAllSalesOrders',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/sales-orders"); // Adjust API endpoint if needed
            console.log(response)
            const data = response;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for getAllPoTypes GET API call
export const getAllPoTypes = createAsyncThunk(
    'sales-orders/getAllPoTypes',
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

// Thunk for getSalesOrderByCustomerId (renamed for clarity)
export const getSalesOrderByCustomerId = createAsyncThunk(
    'purchaseOrders/getSalesOrderByCustomerId',
    async (customerId: number, thunkAPI) => {  // Directly accept customerId as number
        try {
            const response = await apiService.get(`/sales-orders/customer/${customerId}`);
            console.log("API Response:", response);
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Thunk for createSalesOrder POST API call
export const createSalesOrder: any = createAsyncThunk(
    'sales-orders/createSalesOrder',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/sales-orders", params); // Adjust API endpoint if needed
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

export const updateSalesOrder: any = createAsyncThunk(
    'sales-orders/updateSalesOrder',
    async ({ id, data }: { id: number, data: any }, thunkAPI) => {
        try {
            // send only the data as body, not the wrapper object
            const response = await apiService.put(`/sales-orders/${id}`, data);

            // You can adjust this depending on your backend response structure:
            if (response?.status === 'success') {
                toast.success("Updated Successfully");
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

export const deleteSalesOrder = createAsyncThunk(
    'sales-orders/deleteSalesOrder',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/sales-orders/${id}`);

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


// Create sliceOrderSlice
const sliceOrderSlice = createSlice({
    name: "state",
    initialState,
    reducers: {}, // No normal reducers for now
    extraReducers: (builder) => {
        builder

            // Handle getAllSalesOrders (GET request)
            .addCase(getAllSalesOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllSalesOrders.fulfilled, (state: any, action) => {
                state.loading = false;
                state.salesOrderList = action.payload;
            })
            .addCase(getAllSalesOrders.rejected, (state: any, action) => {
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

            // Handle getSalesOrderByCustomerId (GET request)
            .addCase(getSalesOrderByCustomerId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSalesOrderByCustomerId.fulfilled, (state: any, action) => {
                state.loading = false;
                state.salesOrderByCustomerIdList = action.payload;
            })
            .addCase(getSalesOrderByCustomerId.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createSalesOrder (POST request)
            .addCase(createSalesOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createSalesOrder.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createSalesOrderResult = action.payload;
            })
            .addCase(createSalesOrder.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle updateSalesOrder (PUT request)
            .addCase(updateSalesOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSalesOrder.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.salesOrderList = state.salesOrderList.map((table: any) =>
                    table.id === updatedTable.id ? updatedTable : table
                );
            })
            .addCase(updateSalesOrder.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteSalesOrder (DELETE request)
            .addCase(deleteSalesOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteSalesOrder.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedSalesOrder = action.payload;
                state.salesOrderList = state.salesOrderList.filter(
                    (so: any) => so.id !== deletedSalesOrder.id
                );
            })
            .addCase(deleteSalesOrder.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export reducer
export default sliceOrderSlice.reducer;

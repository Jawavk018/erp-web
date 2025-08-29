import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ApiState {
    loading: boolean;
    error: string | null;
    processContractList: any;
    createDyeingWorkOrderResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    processContractList: [],
    createDyeingWorkOrderResult: null,
    checking: false,
};

// Thunk for getAllDyeingWorkOrders GET API call
export const getAllDyeingWorkOrders = createAsyncThunk(
    'dyeing-work-orders/getAllDyeingWorkOrders',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/dyeing-work-orders"); // Adjust API endpoint if needed
            console.log(response)
            const data = response.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for createDyeingWorkOrder POST API call
export const createDyeingWorkOrder: any = createAsyncThunk(
    'dyeing-work-orders/createDyeingWorkOrder',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/dyeing-work-orders", params); // Adjust API endpoint if needed
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


export const updateDyeingWorkOrder: any = createAsyncThunk(
    'dyeing-work-orders/updateDyeingWorkOrder',
    async ({ id, data }: { id: number, data: any }, thunkAPI) => {
        try {
            // send only the data as body, not the wrapper object
            const response = await apiService.put(`/dyeing-work-orders/${id}`, data);

            // You can adjust this depending on your backend response structure:
            if (response?.status === 'success') {
                toast.success(response?.message);
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

export const deleteDyeingWorkOrder: any = createAsyncThunk(
    'dyeing-work-orders/deleteDyeingWorkOrder',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/dyeing-work-orders/${id}`);
            console.log(response); // Check what the API actually returns
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


// Create dyeingWorkOrdeSlice
const dyeingWorkOrdeSlice = createSlice({
    name: "state",
    initialState,
    reducers: {}, // No normal reducers for now
    extraReducers: (builder) => {
        builder

            // Handle getAllDyeingWorkOrders (GET request)
            .addCase(getAllDyeingWorkOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllDyeingWorkOrders.fulfilled, (state: any, action) => {
                state.loading = false;
                state.processContractList = action.payload;
            })
            .addCase(getAllDyeingWorkOrders.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createDyeingWorkOrder (POST request)
            .addCase(createDyeingWorkOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createDyeingWorkOrder.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createDyeingWorkOrderResult = action.payload;
            })
            .addCase(createDyeingWorkOrder.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle updateDyeingWorkOrder (PUT request)
            .addCase(updateDyeingWorkOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateDyeingWorkOrder.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.processContractList = state.processContractList.map((table: any) =>
                    table.id === updatedTable.id ? updatedTable : table
                );
            })
            .addCase(updateDyeingWorkOrder.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteDyeingWorkOrder (DELETE request)
            .addCase(deleteDyeingWorkOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteDyeingWorkOrder.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedSalesOrder = action.payload;
                state.processContractList = state.processContractList.filter(
                    (so: any) => so.id !== deletedSalesOrder.id
                );
            })
            .addCase(deleteDyeingWorkOrder.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export reducer
export default dyeingWorkOrdeSlice.reducer;

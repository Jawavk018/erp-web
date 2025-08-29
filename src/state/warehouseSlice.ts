import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ApiState {
    loading: boolean;
    error: string | null;
    warehouseList: any;
    createWarehouseResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    warehouseList: [],
    createWarehouseResult: null,
    checking: false,
};

// Thunk for getAllWarehouse POST API call
export const getAllWarehouse = createAsyncThunk(
    'warehouse/getAllWarehouse',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/warehouse"); // Adjust API endpoint if needed
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for create_area POST API call
export const createWarehouse: any = createAsyncThunk(
    'warehouse/createWarehouse',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/warehouse", params); // Adjust API endpoint if needed
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

// Thunk for updateWarehouse PUT API call
export const updateWarehouse: any = createAsyncThunk(
    'warehouse/updateWarehouse',
    async (params: any, thunkAPI) => {
        console.log(params);
        try {
            const response = await apiService.put(`/warehouse/${params.id}`, params); // ✅ Fix: Add ID to the URL
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

// export const deleteWarehouse: any = createAsyncThunk(
//     'warehouse/deleteWarehouse',
//     async (id: number, thunkAPI) => {
//         try {
//             const response = await apiService.delete(`/warehouse/${id}`);
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
export const deleteWarehouse = createAsyncThunk(
    'warehouse/deleteWarehouse',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/warehouse/${id}`);

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


// Create warehouseSlice
const warehouseSlice = createSlice({
    name: "warehouse",
    initialState,
    reducers: {}, // No normal reducers for now
    extraReducers: (builder) => {
        builder

            // Handle getAllWarehouse (GET request)
            .addCase(getAllWarehouse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllWarehouse.fulfilled, (state: any, action) => {
                state.loading = false;
                state.warehouseList = action.payload;
            })
            .addCase(getAllWarehouse.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createWarehouse (POST request)
            .addCase(createWarehouse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createWarehouse.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createWarehouseResult = action.payload;
            })
            .addCase(createWarehouse.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle editArea (PUT request)
            .addCase(updateWarehouse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateWarehouse.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.warehouseList = state.warehouseList.map((table: any) =>
                    table.id === updatedTable.id ? updatedTable : table
                );
            })
            .addCase(updateWarehouse.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteWarehouse (DELETE request)
            .addCase(deleteWarehouse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteWarehouse.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedWarehouse = action.payload;
                state.warehouseList = state.warehouseList.filter(
                    (warehouse: any) => warehouse.id !== deletedWarehouse.id
                );
            })
            .addCase(deleteWarehouse.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export reducer
export default warehouseSlice.reducer;

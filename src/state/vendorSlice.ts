import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ApiState {
    loading: boolean;
    error: string | null;
    vendorList: any;
    createVendorResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    vendorList: [],
    createVendorResult: null,
    checking: false,
};

// Thunk for getAllVendors GET API call
export const getAllVendors = createAsyncThunk(
    'vendor/getAllVendors',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/vendor"); // Adjust API endpoint if needed
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for createVendor POST API call
export const createVendor: any = createAsyncThunk(
    'vendor/createVendor',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/vendor", params); // Adjust API endpoint if needed
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

// Thunk for updateVendor PUT API call
export const updateVendor: any = createAsyncThunk(
    'vendor/updateVendor',
    async (params: any, thunkAPI) => {
        console.log(params);
        try {
            const response = await apiService.put(`/vendor/${params.id}`, params); // ✅ Fix: Add ID to the URL
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

// export const deleteVendor: any = createAsyncThunk(
//     'vendor/deleteVendor',
//     async (id: number, thunkAPI) => {
//         try {
//             const response = await apiService.delete(`/vendor/${id}`);
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
export const deleteVendor = createAsyncThunk(
    'vendor/deleteVendor',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/vendor/${id}`);

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


// Create VendorSlice
const vendorSlice = createSlice({
    name: "state",
    initialState,
    reducers: {}, // No normal reducers for now
    extraReducers: (builder) => {
        builder

            // Handle getAllVendors (GET request)
            .addCase(getAllVendors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllVendors.fulfilled, (state: any, action) => {
                state.loading = false;
                state.vendorList = action.payload;
            })
            .addCase(getAllVendors.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createVendor (POST request)
            .addCase(createVendor.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createVendor.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createVendorResult = action.payload;
            })
            .addCase(createVendor.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle updateVendor (PUT request)
            .addCase(updateVendor.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateVendor.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.vendorList = state.vendorList.map((table: any) =>
                    table.id === updatedTable.id ? updatedTable : table
                );
            })
            .addCase(updateVendor.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteVendor (DELETE request)
            .addCase(deleteVendor.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteVendor.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedVendor = action.payload;
                state.vendorList = state.vendorList.filter(
                    (vendor: any) => vendor.id !== deletedVendor.id
                );
            })
            .addCase(deleteVendor.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export reducer
export default vendorSlice.reducer;

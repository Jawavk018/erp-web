import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ApiState {
    loading: boolean;
    error: string | null;
    shipmentTermsList: any;
    createShipmentTermResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    shipmentTermsList: [],
    createShipmentTermResult: null,
    checking: false,
};

// Thunk for getAllShipmentTerms GET API call
export const getAllShipmentTerms = createAsyncThunk(
    'shipment-terms/getAllShipmentTerms',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/shipment-terms"); // Adjust API endpoint if needed
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for createShipmentTerm POST API call
export const createShipmentTerm: any = createAsyncThunk(
    'shipment-terms/createShipmentTerm',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/shipment-terms", params); // Adjust API endpoint if needed
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

// Thunk for updateShipmentTerm PUT API call
export const updateShipmentTerm: any = createAsyncThunk(
    'shipment-terms/updateShipmentTerm',
    async (params: any, thunkAPI) => {
        console.log(params);
        try {
            const response = await apiService.put(`/shipment-terms/${params.id}`, params); // ✅ Fix: Add ID to the URL
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

// export const deleteShipmentTerm: any = createAsyncThunk(
//     'shipment-terms/deleteShipmentTerm',
//     async (id: number, thunkAPI) => {
//         try {
//             const response = await apiService.delete(`/shipment-terms/${id}`);
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
export const deleteShipmentTerm = createAsyncThunk(
    'shipment-terms/deleteShipmentTerm',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/shipment-terms/${id}`);

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


// Create shipmentTerm Slice 
const shipmentTermSlice = createSlice({
    name: "state",
    initialState,
    reducers: {}, // No normal reducers for now
    extraReducers: (builder) => {
        builder

            // Handle getAllShipmentTerms (GET request)
            .addCase(getAllShipmentTerms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllShipmentTerms.fulfilled, (state: any, action) => {
                state.loading = false;
                state.shipmentTermsList = action.payload;
            })
            .addCase(getAllShipmentTerms.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createShipmentTerm (POST request)
            .addCase(createShipmentTerm.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createShipmentTerm.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createShipmentTermResult = action.payload;
            })
            .addCase(createShipmentTerm.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle updateShipmentTerm (PUT request)
            .addCase(updateShipmentTerm.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateShipmentTerm.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.shipmentTermsList = state.shipmentTermsList.map((table: any) =>
                    table.id === updatedTable.id ? updatedTable : table
                );
            })
            .addCase(updateShipmentTerm.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteShipmentTerm (DELETE request)
            .addCase(deleteShipmentTerm.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteShipmentTerm.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedShipmentTerm = action.payload;
                state.shipmentTermsList = state.shipmentTermsList.filter(
                    (terms: any) => terms.id !== deletedShipmentTerm.id
                );
            })
            .addCase(deleteShipmentTerm.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export reducer
export default shipmentTermSlice.reducer;

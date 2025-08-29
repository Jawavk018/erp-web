import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ApiState {
    loading: boolean;
    error: string | null;
    gstList: any;
    createGstMasterResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    gstList: [],
    createGstMasterResult: null,
    checking: false,
};

// Thunk for getAllGstMaster GET API call
export const getAllGstMaster = createAsyncThunk(
    'gst/getAllGstMaster',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/gst"); // Adjust API endpoint if needed
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for createGst POST API call
export const createGst: any = createAsyncThunk(
    'gst/createGst',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/gst", params); // Adjust API endpoint if needed
            console.log(response)
            if (response?.status === 'success') {
                toast.success(response?.message);
                return response;
            } else {
                const errorMessage = "Something went wrong";
                toast.error(errorMessage);
                return thunkAPI.rejectWithValue(errorMessage);
            }
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for updateGst PUT API call
export const updateGst: any = createAsyncThunk(
    'gst/updateGst',
    async (params: any, thunkAPI) => {
        console.log(params);
        try {
            const response = await apiService.put(`/gst/${params.id}`, params); // ✅ Fix: Add ID to the URL
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

// export const deleteGst: any = createAsyncThunk(
//     'gst/deleteGst',
//     async (id: number, thunkAPI) => {
//         try {
//             const response = await apiService.delete(`/gst/${id}`);
//             console.log(response); // Check what the API actually returns
//             if (response?.status === 'success') {
//                 toast.success(response?.message);
//                 return response;
//             } else {
//                 const errorMessage = "Something went wrong";
//                 toast.error(errorMessage);
//                 return thunkAPI.rejectWithValue(errorMessage);
//             }
//         } catch (error: any) {
//             return thunkAPI.rejectWithValue(error.message);
//         }
//     }
// );
export const deleteGst = createAsyncThunk(
    'gst/deleteGst',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/gst/${id}`);

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


// Create uom Slice 
const gstSlice = createSlice({
    name: "state",
    initialState,
    reducers: {}, // No normal reducers for now
    extraReducers: (builder) => {
        builder

            // Handle getAllGstMaster (GET request)
            .addCase(getAllGstMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllGstMaster.fulfilled, (state: any, action) => {
                state.loading = false;
                state.gstList = action.payload;
            })
            .addCase(getAllGstMaster.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createGst (POST request)
            .addCase(createGst.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createGst.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createGstMasterResult = action.payload;
            })
            .addCase(createGst.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle updateGst (PUT request)
            .addCase(updateGst.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateGst.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.gstList = state.gstList.map((table: any) =>
                    table.id === updatedTable.id ? updatedTable : table
                );
            })
            .addCase(updateGst.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteGst (DELETE request)
            .addCase(deleteGst.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteGst.fulfilled, (state: any, action) => {
                state.loading = false;
                const deleteduom = action.payload;
                state.gstList = state.gstList.filter(
                    (terms: any) => terms.id !== deleteduom.id
                );
            })
            .addCase(deleteGst.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export reducer
export default gstSlice.reducer;

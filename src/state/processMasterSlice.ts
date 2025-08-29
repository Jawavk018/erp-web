import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ApiState {
    loading: boolean;
    error: string | null;
    processMasterList: any;
    createProcessMasterResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    processMasterList: [],
    createProcessMasterResult: null,
    checking: false,
};

// Thunk for getAllProcessMaster GET API call
export const getAllProcessMaster = createAsyncThunk(
    'process/getAllProcessMaster',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/process"); // Adjust API endpoint if needed
            console.log(response)
            const data = response;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for createProcessMaster POST API call
export const createProcessMaster: any = createAsyncThunk(
    'process/createProcessMaster',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/process", params); // Adjust API endpoint if needed
            console.log(response)
            if (response?.status === "success") {
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

// Thunk for updateProcessMaster PUT API call
export const updateProcessMaster: any = createAsyncThunk(
    'process/updateProcessMaster',
    async (params: any, thunkAPI) => {
        console.log(params);
        try {
            const response = await apiService.put(`/process/${params.id}`, params); // ✅ Fix: Add ID to the URL
            console.log(response);
            if (response?.status === "success") {
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

// export const deleteProcessMaster: any = createAsyncThunk(
//     'process/deleteProcessMaster',
//     async (id: number, thunkAPI) => {
//         try {
//             const response = await apiService.delete(`/process/${id}`);
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
export const deleteProcessMaster = createAsyncThunk(
    'process/deleteProcessMaster',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/process/${id}`);

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

// Create processSlice 
const processSlice = createSlice({
    name: "process",
    initialState,
    reducers: {}, // No normal reducers for now
    extraReducers: (builder) => {
        builder

            // Handle getAllProcessMaster (GET request)
            .addCase(getAllProcessMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllProcessMaster.fulfilled, (state: any, action) => {
                state.loading = false;
                state.processMasterList = action.payload;
            })
            .addCase(getAllProcessMaster.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createProcessMaster (POST request)
            .addCase(createProcessMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProcessMaster.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createProcessMasterResult = action.payload;
            })
            .addCase(createProcessMaster.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle updateProcessMaster (PUT request)
            .addCase(updateProcessMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProcessMaster.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.processMasterList = state.processMasterList.map((table: any) =>
                    table.id === updatedTable.id ? updatedTable : table
                );
            })
            .addCase(updateProcessMaster.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteProcessMaster (DELETE request)
            .addCase(deleteProcessMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProcessMaster.fulfilled, (state: any, action) => {
                state.loading = false;
                const deleteduom = action.payload;
                state.processMasterList = state.processMasterList.filter(
                    (terms: any) => terms.id !== deleteduom.id
                );
            })
            .addCase(deleteProcessMaster.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export reducer
export default processSlice.reducer;

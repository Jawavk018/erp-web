import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ApiState {
    loading: boolean;
    error: string | null;
    defectMasterList: any;
    createDefectMasterResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    defectMasterList: [],
    createDefectMasterResult: null,
    checking: false,
};

// Thunk for getAllDefectMaster GET API call
export const getAllDefectMaster = createAsyncThunk(
    'defects/getAllDefectMaster',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/defects"); // Adjust API endpoint if needed
            console.log(response)
            const data = response;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for createDefectMaster POST API call
export const createDefectMaster: any = createAsyncThunk(
    'defects/createDefectMaster',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/defects", params); // Adjust API endpoint if needed
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

// Thunk for updateDefectMaster PUT API call
export const updateDefectMaster: any = createAsyncThunk(
    'defects/updateDefectMaster',
    async (params: any, thunkAPI) => {
        console.log(params);
        try {
            const response = await apiService.put(`/defects/${params.id}`, params); // ✅ Fix: Add ID to the URL
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

// export const deleteDefectMaster: any = createAsyncThunk(
//     'defects/deleteDefectMaster',
//     async (id: number, thunkAPI) => {
//         try {
//             const response = await apiService.delete(`/defects/${id}`);
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
export const deleteDefectMaster = createAsyncThunk(
    'defects/deleteDefectMaster',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/defects/${id}`);

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

// Create defectSlice 
const defectSlice = createSlice({
    name: "defect",
    initialState,
    reducers: {}, // No normal reducers for now
    extraReducers: (builder) => {
        builder

            // Handle getAllDefectMaster (GET request)
            .addCase(getAllDefectMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllDefectMaster.fulfilled, (state: any, action) => {
                state.loading = false;
                state.defectMasterList = action.payload;
            })
            .addCase(getAllDefectMaster.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createDefectMaster (POST request)
            .addCase(createDefectMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createDefectMaster.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createDefectMasterResult = action.payload;
            })
            .addCase(createDefectMaster.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle updateDefectMaster (PUT request)
            .addCase(updateDefectMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateDefectMaster.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.defectMasterList = state.defectMasterList.map((table: any) =>
                    table.id === updatedTable.id ? updatedTable : table
                );
            })
            .addCase(updateDefectMaster.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteDefectMaster (DELETE request)
            .addCase(deleteDefectMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteDefectMaster.fulfilled, (state: any, action) => {
                state.loading = false;
                const deleteduom = action.payload;
                state.defectMasterList = state.defectMasterList.filter(
                    (terms: any) => terms.id !== deleteduom.id
                );
            })
            .addCase(deleteDefectMaster.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export reducer
export default defectSlice.reducer;

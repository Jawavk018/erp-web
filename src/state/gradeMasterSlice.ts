import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ApiState {
    loading: boolean;
    error: string | null;
    gradeList: any;
    createGrandMasterResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    gradeList: [],
    createGrandMasterResult: null,
    checking: false,
};

// Thunk for getAllGrandMaster GET API call
export const getAllGrandMaster = createAsyncThunk(
    'grade/getAllGrandMaster',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/grade"); // Adjust API endpoint if needed
            console.log(response)
            const data = response;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for createGrandMaster POST API call
export const createGrandMaster: any = createAsyncThunk(
    'grade/createGrandMaster',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/grade", params); // Adjust API endpoint if needed
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

// Thunk for updateGrandMaster PUT API call
export const updateGrandMaster: any = createAsyncThunk(
    'grade/updateGrandMaster',
    async (params: any, thunkAPI) => {
        console.log(params);
        try {
            const response = await apiService.put(`/grade/${params.id}`, params); // ✅ Fix: Add ID to the URL
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

// export const deleteGrandMaster: any = createAsyncThunk(
//     'grade/deleteGrandMaster',
//     async (id: number, thunkAPI) => {
//         try {
//             const response = await apiService.delete(`/grade/${id}`);
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
export const deleteGrandMaster = createAsyncThunk(
    'grade/deleteGrandMaster',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/grade/${id}`);

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
const gradeMasterSlice = createSlice({
    name: "gradeMaster",
    initialState,
    reducers: {}, // No normal reducers for now
    extraReducers: (builder) => {
        builder

            // Handle getAllGrandMaster (GET request)
            .addCase(getAllGrandMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllGrandMaster.fulfilled, (state: any, action) => {
                state.loading = false;
                state.gradeList = action.payload;
            })
            .addCase(getAllGrandMaster.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createGrandMaster (POST request)
            .addCase(createGrandMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createGrandMaster.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createGrandMasterResult = action.payload;
            })
            .addCase(createGrandMaster.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle updateGrandMaster (PUT request)
            .addCase(updateGrandMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateGrandMaster.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.gradeList = state.gradeList.map((table: any) =>
                    table.id === updatedTable.id ? updatedTable : table
                );
            })
            .addCase(updateGrandMaster.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteGrandMaster (DELETE request)
            .addCase(deleteGrandMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteGrandMaster.fulfilled, (state: any, action) => {
                state.loading = false;
                const deleteduom = action.payload;
                state.gradeList = state.gradeList.filter(
                    (terms: any) => terms.id !== deleteduom.id
                );
            })
            .addCase(deleteGrandMaster.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export reducer
export default gradeMasterSlice.reducer;

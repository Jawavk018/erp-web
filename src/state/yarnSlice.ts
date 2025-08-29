import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ApiState {
    loading: boolean;
    error: string | null;
    yarnList: any;
    createYarnResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    yarnList: [],
    createYarnResult: null,
    checking: false,
};

// Thunk for getAllYarnMasters GET API call
export const getAllYarnMasters = createAsyncThunk(
    'yarn/getAllYarnMasters',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/yarn"); // Adjust API endpoint if needed
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for createYarnMaster POST API call
export const createYarnMaster: any = createAsyncThunk(
    'yarn/createYarnMaster',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/yarn", params); // Adjust API endpoint if needed
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

// Thunk for updateYarnMaster PUT API call
export const updateYarnMaster: any = createAsyncThunk(
    'yarn/updateYarnMaster',
    async (params: any, thunkAPI) => {
        console.log(params);
        try {
            const response = await apiService.put(`/yarn/${params.id}`, params); // ✅ Fix: Add ID to the URL
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

// export const deleteYarnMaster: any = createAsyncThunk(
//     'yarn/deleteYarnMaster',
//     async (id: number, thunkAPI) => {
//         try {
//             const response = await apiService.delete(`/yarn/${id}`);
//             console.log(response); // Check what the API actually returns
//             if (response?.status === 'success') {
//                 toast.success("Successfully deleted");
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
export const deleteYarnMaster = createAsyncThunk(
    'yarn/deleteYarnMaster',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/yarn/${id}`);

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


// Create yarnSlice 
const yarnSlice = createSlice({
    name: "state",
    initialState,
    reducers: {}, // No normal reducers for now
    extraReducers: (builder) => {
        builder

            // Handle getAllYarnMasters (GET request)
            .addCase(getAllYarnMasters.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllYarnMasters.fulfilled, (state: any, action) => {
                state.loading = false;
                state.yarnList = action.payload;
            })
            .addCase(getAllYarnMasters.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createYarnMaster (POST request)
            .addCase(createYarnMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createYarnMaster.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createYarnResult = action.payload;
            })
            .addCase(createYarnMaster.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle updateYarnMaster (PUT request)
            .addCase(updateYarnMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateYarnMaster.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.yarnList = state.yarnList.map((table: any) =>
                    table.id === updatedTable.id ? updatedTable : table
                );
            })
            .addCase(updateYarnMaster.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteYarnMaster (DELETE request)
            .addCase(deleteYarnMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteYarnMaster.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedYarn = action.payload;
                state.yarnList = state.yarnList.filter(
                    (yarn: any) => yarn.id !== deletedYarn.id
                );
            })
            .addCase(deleteYarnMaster.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export reducer
export default yarnSlice.reducer;

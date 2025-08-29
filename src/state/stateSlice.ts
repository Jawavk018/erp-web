import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ApiState {
    loading: boolean;
    error: string | null;
    stateList: any;
    createStateResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    stateList: [],
    createStateResult: null,
    checking: false,
};

// Thunk for getAllStates GET API call
export const getAllStates = createAsyncThunk(
    'state/getAllStates',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/state"); // Adjust API endpoint if needed
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for createState POST API call
export const createState: any = createAsyncThunk(
    'state/createState',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/state", params); // Adjust API endpoint if needed
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

// Thunk for updateState PUT API call
export const updateState: any = createAsyncThunk(
    'state/updateState',
    async (params: any, thunkAPI) => {
        console.log(params);
        try {
            const response = await apiService.put(`/state/${params.id}`, params); // ✅ Fix: Add ID to the URL
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

// export const deleteState: any = createAsyncThunk(
//     'state/deleteState',
//     async (id: number, thunkAPI) => {
//         try {
//             const response = await apiService.delete(`/state/${id}`);
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
export const deleteState = createAsyncThunk(
    'state/deleteState',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/state/${id}`);

            if (response?.status === 'success') {
                toast.success("Successfully deleted");
                return id; // Return the deleted ID for reducer handling
            }

            // Handle API error response
            const errorMessage = response.data.data?.message || 'Failed to delete category';
            toast.error(errorMessage);
            return response;

        } catch (error: any) {
            // Handle network errors or unexpected errors
            let errorMessage = 'An error occurred while deleting the category';

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


// Create State Slice
const stateSlice = createSlice({
    name: "state",
    initialState,
    reducers: {}, // No normal reducers for now
    extraReducers: (builder) => {
        builder

            // Handle getAllStates (GET request)
            .addCase(getAllStates.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllStates.fulfilled, (state: any, action) => {
                state.loading = false;
                state.stateList = action.payload;
            })
            .addCase(getAllStates.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createState (POST request)
            .addCase(createState.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createState.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createStateResult = action.payload;
            })
            .addCase(createState.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle updateState (PUT request)
            .addCase(updateState.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateState.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.stateList = state.stateList.map((table: any) =>
                    table.id === updatedTable.id ? updatedTable : table
                );
            })
            .addCase(updateState.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteState (DELETE request)
            .addCase(deleteState.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteState.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedState = action.payload;
                state.stateList = state.stateList.filter(
                    (state: any) => state.id !== deletedState.id
                );
            })
            .addCase(deleteState.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export reducer
export default stateSlice.reducer;

import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ApiState {
    loading: boolean;
    error: string | null;
    flangeList: any;
    createFlangeResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    flangeList: [],
    createFlangeResult: null,
    checking: false,
};

// Thunk for getAllFlanges POST API call
export const getAllFlanges = createAsyncThunk(
    'flange/getAllFlanges',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/flange"); // Adjust API endpoint if needed
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
export const createFlange: any = createAsyncThunk(
    'flange/createFlange',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/flange", params); // Adjust API endpoint if needed
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

// Thunk for updateFlange PUT API call
export const updateFlange: any = createAsyncThunk(
    'flange/updateFlange',
    async (params: any, thunkAPI) => {
        console.log(params);
        try {
            const response = await apiService.put(`/flange/${params.id}`, params); // ✅ Fix: Add ID to the URL
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

// export const deleteFlange: any = createAsyncThunk(
//     'flange/deleteFlange',
//     async (id: number, thunkAPI) => {
//         try {
//             const response = await apiService.delete(`/flange/${id}`);
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
export const deleteFlange = createAsyncThunk(
    'flange/deleteFlange',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/flange/${id}`);

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


// Create flangeSlice
const flangeSlice = createSlice({
    name: "flange",
    initialState,
    reducers: {}, // No normal reducers for now
    extraReducers: (builder) => {
        builder

            // Handle getAllFlanges (GET request)
            .addCase(getAllFlanges.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllFlanges.fulfilled, (state: any, action) => {
                state.loading = false;
                state.flangeList = action.payload;
            })
            .addCase(getAllFlanges.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createFlange (POST request)
            .addCase(createFlange.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createFlange.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createFlangeResult = action.payload;
            })
            .addCase(createFlange.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle editArea (PUT request)
            .addCase(updateFlange.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateFlange.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.flangeList = state.flangeList.map((table: any) =>
                    table.id === updatedTable.id ? updatedTable : table
                );
            })
            .addCase(updateFlange.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteFlange (DELETE request)
            .addCase(deleteFlange.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteFlange.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedFlange = action.payload;
                state.flangeList = state.flangeList.filter(
                    (flange: any) => flange.id !== deletedFlange.id
                );
            })
            .addCase(deleteFlange.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export reducer
export default flangeSlice.reducer;

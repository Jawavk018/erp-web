import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ApiState {
    loading: boolean;
    error: string | null;
    generatePackingList: any;
    createGeneratePackingResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    generatePackingList: [],
    createGeneratePackingResult: null,
    checking: false,
};

// Thunk for getAllGeneratePacking POST API call
export const getAllGeneratePacking = createAsyncThunk(
    'generate-packing/getAllGeneratePacking',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/generate-packing"); // Adjust API endpoint if needed
            console.log(response)
            const data = response;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for create_area POST API call
export const createGeneratePacking: any = createAsyncThunk(
    'generate-packing/createGeneratePacking',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/generate-packing", params); // Adjust API endpoint if needed
            console.log(response)
            if (response?.status === 'success') {
                toast.success("Save Successfully");
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

// Thunk for updateGeneratePacking PUT API call
export const updateGeneratePacking: any = createAsyncThunk(
    'generate-packing/updateGeneratePacking',
    async (params: any, thunkAPI) => {
        console.log(params);
        try {
            const response = await apiService.put(`/generate-packing/${params.id}`, params); // ✅ Fix: Add ID to the URL
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

// export const deleteGeneratePacking: any = createAsyncThunk(
//     'generate-packing/deleteGeneratePacking',
//     async (id: number, thunkAPI) => {
//         try {
//             const response = await apiService.delete(`/generate-packing/${id}`);
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
export const deleteGeneratePacking = createAsyncThunk(
    'generate-packing/deleteGeneratePacking',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/generate-packing/${id}`);

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


// Create generatePackingSlice
const generatePackingSlice = createSlice({
    name: "flange",
    initialState,
    reducers: {}, // No normal reducers for now
    extraReducers: (builder) => {
        builder

            // Handle getAllGeneratePacking (GET request)
            .addCase(getAllGeneratePacking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllGeneratePacking.fulfilled, (state: any, action) => {
                state.loading = false;
                state.generatePackingList = action.payload;
            })
            .addCase(getAllGeneratePacking.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createGeneratePacking (POST request)
            .addCase(createGeneratePacking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createGeneratePacking.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createGeneratePackingResult = action.payload;
            })
            .addCase(createGeneratePacking.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle editArea (PUT request)
            .addCase(updateGeneratePacking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateGeneratePacking.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.generatePackingList = state.generatePackingList.map((table: any) =>
                    table.id === updatedTable.id ? updatedTable : table
                );
            })
            .addCase(updateGeneratePacking.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteGeneratePacking (DELETE request)
            .addCase(deleteGeneratePacking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteGeneratePacking.fulfilled, (state: any, action) => {
                state.loading = false;
                const deleteGeneratePacking = action.payload;
                state.generatePackingList = state.generatePackingList.filter(
                    (gp: any) => gp.id !== deleteGeneratePacking.id
                );
            })
            .addCase(deleteGeneratePacking.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export reducer
export default generatePackingSlice.reducer;

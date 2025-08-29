import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ApiState {
    loading: boolean;
    error: string | null;
    beamInwardList: any;
    createBeamInwardResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    beamInwardList: [],
    createBeamInwardResult: null,
    checking: false,
};

// Thunk for getAllBeamInward GET API call
export const getAllBeamInward = createAsyncThunk(
    'beam-inward/getAllBeamInward',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/beam-inward"); // Adjust API endpoint if needed
            console.log(response)
            const data = response;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for getAllBeamInwardById
export const getAllBeamInwardById = createAsyncThunk(
    'beam-inward/getAllBeamInwardById',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.get(`/beam-inward/${id}`);
            console.log("API Response:", response);
            return response || { data: [], message: "", status: "success" };
        } catch (error: any) {
            console.error("API Error:", error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for createBeamInward POST API call
export const createBeamInward: any = createAsyncThunk(
    'beam-inward/createBeamInward',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/beam-inward", params); // Adjust API endpoint if needed
            console.log(response)
            if (response) {
                toast.success("Saved Successfully!");
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

export const updateBeamInward: any = createAsyncThunk(
    'beam-inward/updateBeamInward',
    async ({ id, data }: { id: number, data: any }, thunkAPI) => {
        try {
            // send only the data as body, not the wrapper object
            const response = await apiService.put(`/beam-inward/${id}`, data);

            // You can adjust this depending on your backend response structure:
            if (response) {
                // You can change this to response.message if your backend returns a message
                toast.success("Updated successfully!");
                return response;
            } else {
                const errorMessage = "Something went wrong";
                toast.error(errorMessage);
                return thunkAPI.rejectWithValue(errorMessage);
            }
        } catch (error: any) {
            toast.error(error.message || "Update failed");
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// export const deleteBeamInward: any = createAsyncThunk(
//     'beam-inward/deleteBeamInward',
//     async (id: number, thunkAPI) => {
//         try {
//             const response = await apiService.delete(`/beam-inward/${id}`);
//             console.log(response); // Check what the API actually returns
//             if (response) {
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
export const deleteBeamInward = createAsyncThunk(
    'beam-inward/deleteBeamInward',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/beam-inward/${id}`);

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


// Create beamInwardSlice
const beamInwardSlice = createSlice({
    name: "state",
    initialState,
    reducers: {}, // No normal reducers for now
    extraReducers: (builder) => {
        builder

            // Handle getAllBeamInward (GET request)
            .addCase(getAllBeamInward.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllBeamInward.fulfilled, (state: any, action) => {
                state.loading = false;
                state.beamInwardList = action.payload;
            })
            .addCase(getAllBeamInward.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createBeamInward (POST request)
            .addCase(createBeamInward.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBeamInward.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createBeamInwardResult = action.payload;
            })
            .addCase(createBeamInward.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle updateBeamInward (PUT request)
            .addCase(updateBeamInward.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBeamInward.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.beamInwardList = state.beamInwardList.map((table: any) =>
                    table.id === updatedTable.id ? updatedTable : table
                );
            })
            .addCase(updateBeamInward.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteBeamInward (DELETE request)
            .addCase(deleteBeamInward.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteBeamInward.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedSalesOrder = action.payload;
                state.beamInwardList = state.beamInwardList.filter(
                    (so: any) => so.id !== deletedSalesOrder.id
                );
            })
            .addCase(deleteBeamInward.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export reducer
export default beamInwardSlice.reducer;

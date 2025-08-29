import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ApiState {
    loading: boolean;
    error: string | null;
    sizingPlanList: any;
    sizingPlanByIdList: any;
    createSizingPlanResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    sizingPlanList: [],
    sizingPlanByIdList: [],
    createSizingPlanResult: null,
    checking: false,
};

// Thunk for getAllSizingPlan GET API call
export const getAllSizingPlan = createAsyncThunk(
    'sizing-plan/getAllSizingPlan',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/sizing-plan"); // Adjust API endpoint if needed
            console.log(response)
            const data = response;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for getSizingPlanById
export const getSizingPlanById = createAsyncThunk(
    'sizing-plan/getSizingPlanById',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.get(`/sizing-plan/${id}`);
            console.log("API Response:", response);
            return response || { data: [], message: "", status: "success" };
        } catch (error: any) {
            console.error("API Error:", error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for createSizingPlan POST API call
export const createSizingPlan: any = createAsyncThunk(
    'sizing-plan/createSizingPlan',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/sizing-plan", params); // Adjust API endpoint if needed
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

export const updateSizingPlan: any = createAsyncThunk(
    'sizing-plan/updateSizingPlan',
    async ({ id, data }: { id: number, data: any }, thunkAPI) => {
        try {
            // send only the data as body, not the wrapper object
            const response = await apiService.put(`/sizing-plan/${id}`, data);

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

// export const deleteSizingPlan: any = createAsyncThunk(
//     'sizing-plan/deleteSizingPlan',
//     async (id: number, thunkAPI) => {
//         try {
//             const response = await apiService.delete(`/sizing-plan/${id}`);
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
export const deleteSizingPlan = createAsyncThunk(
    'sizing-plan/deleteSizingPlan',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/sizing-plan/${id}`);

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


// Create sizingPlanSlice
const sizingPlanSlice = createSlice({
    name: "state",
    initialState,
    reducers: {}, // No normal reducers for now
    extraReducers: (builder) => {
        builder

            // Handle getAllSizingPlan (GET request)
            .addCase(getAllSizingPlan.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllSizingPlan.fulfilled, (state: any, action) => {
                state.loading = false;
                state.sizingPlanList = action.payload;
            })
            .addCase(getAllSizingPlan.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle getSizingPlanById (GET request)
            .addCase(getSizingPlanById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSizingPlanById.fulfilled, (state: any, action) => {
                state.loading = false;
                state.sizingPlanByIdList = action.payload;
            })
            .addCase(getSizingPlanById.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createSizingPlan (POST request)
            .addCase(createSizingPlan.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createSizingPlan.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createSizingPlanResult = action.payload;
            })
            .addCase(createSizingPlan.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle updateSizingPlan (PUT request)
            .addCase(updateSizingPlan.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSizingPlan.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.sizingPlanList = state.sizingPlanList.map((table: any) =>
                    table.id === updatedTable.id ? updatedTable : table
                );
            })
            .addCase(updateSizingPlan.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteSizingPlan (DELETE request)
            .addCase(deleteSizingPlan.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteSizingPlan.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedSalesOrder = action.payload;
                state.sizingPlanList = state.sizingPlanList.filter(
                    (so: any) => so.id !== deletedSalesOrder.id
                );
            })
            .addCase(deleteSizingPlan.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export reducer
export default sizingPlanSlice.reducer;

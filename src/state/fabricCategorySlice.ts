import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ApiState {
    loading: boolean;
    error: string | null;
    fabricCategoryList: any;
    creatFabricCategoryResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    fabricCategoryList: [],
    creatFabricCategoryResult: null,
    checking: false,
};

// Thunk for getAllFabricCategory GET API call
export const getAllFabricCategory = createAsyncThunk(
    'fabric-category/getAllFabricCategory',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/fabric-category"); // Adjust API endpoint if needed
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for createFabricCategory POST API call
export const createFabricCategory: any = createAsyncThunk(
    'fabric-category/createFabricCategory',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/fabric-category", params); // Adjust API endpoint if needed
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

// Thunk for updateFabricCategory PUT API call
export const updateFabricCategory: any = createAsyncThunk(
    'fabric-category/updateFabricCategory',
    async (params: any, thunkAPI) => {
        console.log(params);
        try {
            const response = await apiService.put(`/fabric-category/${params.id}`, params); // ✅ Fix: Add ID to the URL
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

// export const deleteFabricCategory: any = createAsyncThunk(
//     'fabric-category/deleteFabricCategory',
//     async (id: number, thunkAPI) => {
//         try {
//             const response = await apiService.delete(`/fabric-category/${id}`);
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
export const deleteFabricCategory = createAsyncThunk(
    'fabric-category/deleteFabricCategory',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/fabric-category/${id}`);

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

// Create FabricCategory Slice
const fabricCategorySlice = createSlice({
    name: "state",
    initialState,
    reducers: {}, // No normal reducers for now
    extraReducers: (builder) => {
        builder

            // Handle getAllFabricCategory (GET request)
            .addCase(getAllFabricCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllFabricCategory.fulfilled, (state: any, action) => {
                state.loading = false;
                state.fabricCategoryList = action.payload;
            })
            .addCase(getAllFabricCategory.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createFabricCategory (POST request)
            .addCase(createFabricCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createFabricCategory.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.creatFabricCategoryResult = action.payload;
            })
            .addCase(createFabricCategory.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle updateFabricCategory (PUT request)
            .addCase(updateFabricCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateFabricCategory.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.fabricCategoryList = state.fabricCategoryList.map((table: any) =>
                    table.id === updatedTable.id ? updatedTable : table
                );
            })
            .addCase(updateFabricCategory.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteFabricCategory (DELETE request)
            .addCase(deleteFabricCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteFabricCategory.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedFabricType = action.payload;
                state.fabricCategoryList = state.fabricCategoryList.filter(
                    (ftype: any) => ftype.id !== deletedFabricType.id
                );
            })
            .addCase(deleteFabricCategory.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export reducer
export default fabricCategorySlice.reducer;

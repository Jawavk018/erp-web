import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ApiState {
    loading: boolean;
    error: string | null;
    categoryList: any;
    createCategoryResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    categoryList: [],
    createCategoryResult: null,
    checking: false,
};

// Thunk for getAllCategories GET API call
export const getAllCategories = createAsyncThunk(
    'category/getAllCategories',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/category"); // Adjust API endpoint if needed
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for createCategory POST API call
export const createCategory: any = createAsyncThunk(
    'category/createCategory',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/category", params); // Adjust API endpoint if needed
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

// Thunk for updateCategory PUT API call
export const updateCategory: any = createAsyncThunk(
    'category/updateCategory',
    async (params: any, thunkAPI) => {
        console.log(params);
        try {
            const response = await apiService.put(`/category/${params.id}`, params); // ✅ Fix: Add ID to the URL
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

// export const deleteCategory: any = createAsyncThunk(
//     'category/deleteCategory',
//     async (id: number, thunkAPI) => {
//         try {
//             const response = await apiService.delete(`/category/${id}`);
//             console.log(response); // Check what the API actually returns
//             if (response?.status === 'success') {
//                 toast.success("Successfully deleted");
//                 return response;
//             } if (response?.status === 'error') {
//                 toast.error(response?.data?.message);
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
export const deleteCategory = createAsyncThunk(
    'category/deleteCategory',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/category/${id}`);

            if (response?.status === 'success') {
                toast.success('Category deleted successfully');
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


// Create Category Slice
const categorySlice = createSlice({
    name: "state",
    initialState,
    reducers: {}, // No normal reducers for now
    extraReducers: (builder) => {
        builder

            // Handle getAllCategories (GET request)
            .addCase(getAllCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCategories.fulfilled, (state: any, action) => {
                state.loading = false;
                state.categoryList = action.payload;
            })
            .addCase(getAllCategories.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createCategory (POST request)
            .addCase(createCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCategory.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createCategoryResult = action.payload;
            })
            .addCase(createCategory.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle updateCategory (PUT request)
            .addCase(updateCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCategory.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.categoryList = state.categoryList.map((table: any) =>
                    table.id === updatedTable.id ? updatedTable : table
                );
            })
            .addCase(updateCategory.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteCategory (DELETE request)
            .addCase(deleteCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCategory.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedCategory = action.payload;
                state.categoryList = state.categoryList.filter(
                    (category: any) => category.id !== deletedCategory.id
                );
            })
            .addCase(deleteCategory.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export reducer
export default categorySlice.reducer;

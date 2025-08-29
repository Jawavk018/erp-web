import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ApiState {
    loading: boolean;
    error: string | null;
    subCategoryList: any;
    createSubCategoryResult: any;
    subCategoryByCategoryList: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    subCategoryList: [],
    subCategoryByCategoryList: [],
    createSubCategoryResult: null,
    checking: false,
};

// Thunk for getAllSubCategories GET API call
export const getAllSubCategories = createAsyncThunk(
    'sub-category/getAllSubCategories',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/sub-category"); // Adjust API endpoint if needed
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const getSubCategoryByCategory = createAsyncThunk(
    "sub-category/getSubCategoryByCategory",
    async (categoryName: string, thunkAPI) => {
      try {
        const response = await apiService.get('/sub-category/by-category', { categoryName });
        console.log(response)
        return response || [];
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );
  
// Thunk for createSubCategory POST API call
export const createSubCategory: any = createAsyncThunk(
    'sub-category/createSubCategory',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/sub-category", params); // Adjust API endpoint if needed
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

// Thunk for updateSubCategory PUT API call
export const updateSubCategory: any = createAsyncThunk(
    'sub-category/updateSubCategory',
    async (params: any, thunkAPI) => {
        console.log(params);
        try {
            const response = await apiService.put(`/sub-category/${params.id}`, params); // ✅ Fix: Add ID to the URL
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

export const deleteSubCategory: any = createAsyncThunk(
    'sub-category/deleteSubCategory',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/sub-category/${id}`);
            console.log(response); // Check what the API actually returns
            if (response?.status === 'success') {
                toast.success("Successfully deleted");
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


// Create SubCategory Slice
const subCategorySlice = createSlice({
    name: "state",
    initialState,
    reducers: {}, // No normal reducers for now
    extraReducers: (builder) => {
        builder

            // Handle getAllSubCategories (GET request)
            .addCase(getAllSubCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllSubCategories.fulfilled, (state: any, action) => {
                state.loading = false;
                state.subCategoryList = action.payload;
            })
            .addCase(getAllSubCategories.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

             // Handle getSubCategoryByCategory (GET request)
             .addCase(getSubCategoryByCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSubCategoryByCategory.fulfilled, (state: any, action) => {
                state.loading = false;
                state.subCategoryByCategoryList = action.payload;
            })
            .addCase(getSubCategoryByCategory.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createSubCategory (POST request)
            .addCase(createSubCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createSubCategory.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createSubCategoryResult = action.payload;
            })
            .addCase(createSubCategory.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle updateSubCategory (PUT request)
            .addCase(updateSubCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSubCategory.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.subCategoryList = state.subCategoryList.map((table: any) =>
                    table.id === updatedTable.id ? updatedTable : table
                );
            })
            .addCase(updateSubCategory.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteSubCategory (DELETE request)
            .addCase(deleteSubCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteSubCategory.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedSubCategory = action.payload;
                state.subCategoryList = state.subCategoryList.filter(
                    (subCategory: any) => subCategory.id !== deletedSubCategory.id
                );
            })
            .addCase(deleteSubCategory.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export reducer
export default subCategorySlice.reducer;

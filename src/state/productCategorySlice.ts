import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface ApiState {
    loading: boolean;
    error: string | null;
    productCategoryList: any;
    createProductCategoryResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    productCategoryList: [],
    createProductCategoryResult: null,
    checking: false,
};

// Thunk for getAllProductCategory GET API call
export const getAllProductCategory = createAsyncThunk(
    'product-category/getAllProductCategory',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/product-category"); // Adjust API endpoint if needed
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for createProductCategory POST API call
export const createProductCategory: any = createAsyncThunk(
    'product-category/createProductCategory',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/product-category", params); // Adjust API endpoint if needed
            console.log(response)
            if (response?.isSuccess) {
                // toast.success("Saved Successfully");
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

// Thunk for updateProductCategory PUT API call
export const updateProductCategory: any = createAsyncThunk(
    'product-category/updateProductCategory',
    async (params: any, thunkAPI) => {
        console.log(params);
        try {
            const response = await apiService.put(`/product-category/${params.id}`, params); // ✅ Fix: Add ID to the URL
            console.log(response);
            if (response?.isSuccess) {
                // toast.success("Updated Successfully");
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

export const deleteProductCategory: any = createAsyncThunk(
    'product-category/deleteProductCategory',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/product-category/${id}`);
            console.log(response); // Check what the API actually returns
            if (response?.isSuccess) {
                // toast.success("Successfully deleted");
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


// Create productCategorySliced
const productCategorySlice = createSlice({
    name: "state",
    initialState,
    reducers: {}, // No normal reducers for now
    extraReducers: (builder) => {
        builder

            // Handle getAllProductCategory (GET request)
            .addCase(getAllProductCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllProductCategory.fulfilled, (state: any, action) => {
                state.loading = false;
                state.productCategoryList = action.payload;
            })
            .addCase(getAllProductCategory.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createProductCategory (POST request)
            .addCase(createProductCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProductCategory.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createProductCategoryResult = action.payload;
            })
            .addCase(createProductCategory.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle updateProductCategory (PUT request)
            .addCase(updateProductCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProductCategory.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.productCategoryList = state.productCategoryList.map((table: any) =>
                    table.id === updatedTable.id ? updatedTable : table
                );
            })
            .addCase(updateProductCategory.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteProductCategory (DELETE request)
            .addCase(deleteProductCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProductCategory.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedPurchaseOrder = action.payload;
                state.productCategoryList = state.productCategoryList.filter(
                    (po: any) => po.id !== deletedPurchaseOrder.id
                );
            })
            .addCase(deleteProductCategory.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export reducer
export default productCategorySlice.reducer;

import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface ApiState {
    loading: boolean;
    error: string | null;
    termsContitionsList: any;
    createTermsContitionsResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    termsContitionsList: [],
    createTermsContitionsResult: null,
    checking: false,
};

// Thunk for getAllTermsConditions GET API call
export const getAllTermsConditions = createAsyncThunk(
    'terms-conditions/getAllTermsConditions',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/terms-conditions"); // Adjust API endpoint if needed
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for createTermsCondition POST API call
export const createTermsCondition: any = createAsyncThunk(
    'terms-conditions/createTermsCondition',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/terms-conditions", params); // Adjust API endpoint if needed
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

// Thunk for updateTermsCondition PUT API call
export const updateTermsCondition: any = createAsyncThunk(
    'terms-conditions/updateTermsCondition',
    async (params: any, thunkAPI) => {
        console.log(params);
        try {
            const response = await apiService.put(`/terms-conditions/${params.id}`, params); // ✅ Fix: Add ID to the URL
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

export const deleteTermsCondition: any = createAsyncThunk(
    'terms-conditions/deleteTermsCondition',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/terms-conditions/${id}`);
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


// Create termsConditionsSlice
const termsConditionsSlice = createSlice({
    name: "state",
    initialState,
    reducers: {}, // No normal reducers for now
    extraReducers: (builder) => {
        builder

            // Handle getAllTermsConditions (GET request)
            .addCase(getAllTermsConditions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllTermsConditions.fulfilled, (state: any, action) => {
                state.loading = false;
                state.termsContitionsList = action.payload;
            })
            .addCase(getAllTermsConditions.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createTermsCondition (POST request)
            .addCase(createTermsCondition.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTermsCondition.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createTermsContitionsResult = action.payload;
            })
            .addCase(createTermsCondition.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle updateTermsCondition (PUT request)
            .addCase(updateTermsCondition.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTermsCondition.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.termsContitionsList = state.termsContitionsList.map((table: any) =>
                    table.id === updatedTable.id ? updatedTable : table
                );
            })
            .addCase(updateTermsCondition.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteTermsCondition (DELETE request)
            .addCase(deleteTermsCondition.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTermsCondition.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedShipmentTerm = action.payload;
                state.termsContitionsList = state.termsContitionsList.filter(
                    (terms: any) => terms.id !== deletedShipmentTerm.id
                );
            })
            .addCase(deleteTermsCondition.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export reducer
export default termsConditionsSlice.reducer;

import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ApiState {
    loading: boolean;
    error: string | null;
    currencyList: any;
    createCurrencyResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    currencyList: [],
    createCurrencyResult: null,
    checking: false,
};

// Thunk for getAllCurrencies GET API call
export const getAllCurrencies = createAsyncThunk(
    'currency/getAllCurrencies',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/currency"); // Adjust API endpoint if needed
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for createCurrency POST API call
export const createCurrency: any = createAsyncThunk(
    'currency/createCurrency',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/currency", params); // Adjust API endpoint if needed
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

// Thunk for updateCurrency PUT API call
export const updateCurrency: any = createAsyncThunk(
    'currency/updateCurrency',
    async (params: any, thunkAPI) => {
        console.log(params);
        try {
            const response = await apiService.put(`/currency/${params.id}`, params); // ✅ Fix: Add ID to the URL
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

// export const deleteCurrency: any = createAsyncThunk(
//     'currency/deleteCurrency',
//     async (id: number, thunkAPI) => {
//         try {
//             const response = await apiService.delete(`/currency/${id}`);
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
export const deleteCurrency = createAsyncThunk(
    'currency/deleteCurrency',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/currency/${id}`);

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


// Create Currency Slice
const currencySlice = createSlice({
    name: "state",
    initialState,
    reducers: {}, // No normal reducers for now
    extraReducers: (builder) => {
        builder

            // Handle getAllCurrencies (GET request)
            .addCase(getAllCurrencies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCurrencies.fulfilled, (state: any, action) => {
                state.loading = false;
                state.currencyList = action.payload;
            })
            .addCase(getAllCurrencies.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createCurrency (POST request)
            .addCase(createCurrency.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCurrency.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createCurrencyResult = action.payload;
            })
            .addCase(createCurrency.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle updateCurrency (PUT request)
            .addCase(updateCurrency.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCurrency.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.currencyList = state.currencyList.map((table: any) =>
                    table.id === updatedTable.id ? updatedTable : table
                );
            })
            .addCase(updateCurrency.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteCurrency (DELETE request)
            .addCase(deleteCurrency.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCurrency.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedCurrency = action.payload;
                state.currencyList = state.currencyList.filter(
                    (currency: any) => currency.id !== deletedCurrency.id
                );
            })
            .addCase(deleteCurrency.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export reducer
export default currencySlice.reducer;

import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ApiState {
    loading: boolean;
    error: string | null;
    countryList: any;
    createCountryResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    countryList: [],
    createCountryResult: null,
    checking: false,
};

// Thunk for search_area POST API call
export const getAllCountries = createAsyncThunk(
    'country/getAllCountries',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/country"); // Adjust API endpoint if needed
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
export const createCountry: any = createAsyncThunk(
    'country/createCountry',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/country", params); // Adjust API endpoint if needed
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

// Thunk for updateCountry PUT API call
export const updateCountry: any = createAsyncThunk(
    'country/updateCountry',
    async (params: any, thunkAPI) => {
        console.log(params);
        try {
            const response = await apiService.put(`/country/${params.id}`, params); // ✅ Fix: Add ID to the URL
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

// export const deleteCountry: any = createAsyncThunk(
//     'country/deleteCountry',
//     async (id: number, thunkAPI) => {
//         try {
//             const response = await apiService.delete(`/country/${id}`);
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

export const deleteCountry = createAsyncThunk(
    'country/deleteCountry',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/country/${id}`);

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


// Create Country Slice
const countrySlice = createSlice({
    name: "country",
    initialState,
    reducers: {}, // No normal reducers for now
    extraReducers: (builder) => {
        builder

            // Handle getAllCountries (GET request)
            .addCase(getAllCountries.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCountries.fulfilled, (state: any, action) => {
                state.loading = false;
                state.countryList = action.payload;
            })
            .addCase(getAllCountries.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createCountry (POST request)
            .addCase(createCountry.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCountry.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createCountryResult = action.payload;
            })
            .addCase(createCountry.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle editArea (PUT request)
            .addCase(updateCountry.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCountry.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.countryList = state.countryList.map((table: any) =>
                    table.id === updatedTable.id ? updatedTable : table
                );
            })
            .addCase(updateCountry.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteCountry (DELETE request)
            .addCase(deleteCountry.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCountry.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedCountry = action.payload;
                state.countryList = state.countryList.filter(
                    (country: any) => country.id !== deletedCountry.id
                );
            })
            .addCase(deleteCountry.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export reducer
export default countrySlice.reducer;

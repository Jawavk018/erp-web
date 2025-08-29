import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ApiState {
    loading: boolean;
    error: string | null;
    cityList: any;
    createCityResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    cityList: [],
    createCityResult: null,
    checking: false,
};

// Thunk for getAllCities POST API call
export const getAllCities = createAsyncThunk(
    'city/getAllCities',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/city"); // Adjust API endpoint if needed
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for createCity POST API call
export const createCity: any = createAsyncThunk(
    'city/createCity',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/city", params); // Adjust API endpoint if needed
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

// Thunk for updateCity PUT API call
export const updateCity: any = createAsyncThunk(
    'city/updateCity',
    async (params: any, thunkAPI) => {
        console.log(params);
        try {
            const response = await apiService.put(`/city/${params.id}`, params); // ✅ Fix: Add ID to the URL
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

// export const deleteCity: any = createAsyncThunk(
//     'city/deleteCity',
//     async (id: number, thunkAPI) => {
//         try {
//             const response = await apiService.delete(`/city/${id}`);
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
export const deleteCity = createAsyncThunk(
    'city/deleteCity',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/city/${id}`);

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


// Create City Slice
const citySlice = createSlice({
    name: "city",
    initialState,
    reducers: {}, // No normal reducers for now
    extraReducers: (builder) => {
        builder

            // Handle getAllCities (GET request)
            .addCase(getAllCities.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCities.fulfilled, (state: any, action) => {
                state.loading = false;
                state.cityList = action.payload;
            })
            .addCase(getAllCities.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createCity (POST request)
            .addCase(createCity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCity.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createCityResult = action.payload;
            })
            .addCase(createCity.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle updateCity (PUT request)
            .addCase(updateCity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCity.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.cityList = state.cityList.map((table: any) =>
                    table.id === updatedTable.id ? updatedTable : table
                );
            })
            .addCase(updateCity.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteCity (DELETE request)
            .addCase(deleteCity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCity.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedCity = action.payload;
                state.cityList = state.cityList.filter(
                    (city: any) => city.id !== deletedCity.id
                );
            })
            .addCase(deleteCity.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export reducer
export default citySlice.reducer;

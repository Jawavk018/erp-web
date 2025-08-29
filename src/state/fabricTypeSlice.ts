import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ApiState {
    loading: boolean;
    error: string | null;
    fabricTypeList: any;
    creatFabricTypeResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    fabricTypeList: [],
    creatFabricTypeResult: null,
    checking: false,
};

// Thunk for getAllFabricTypes GET API call
export const getAllFabricTypes = createAsyncThunk(
    'fabric-type/getAllFabricTypes',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/fabric-type"); // Adjust API endpoint if needed
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for createFabricType POST API call
export const createFabricType: any = createAsyncThunk(
    'fabric-type/createFabricType',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/fabric-type", params); // Adjust API endpoint if needed
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

// Thunk for updateFabricType PUT API call
export const updateFabricType: any = createAsyncThunk(
    'fabric-type/updateFabricType',
    async (params: any, thunkAPI) => {
        console.log(params);
        try {
            const response = await apiService.put(`/fabric-type/${params.id}`, params); // ✅ Fix: Add ID to the URL
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

// export const deleteFabricType: any = createAsyncThunk(
//     'fabric-type/deleteFabricType',
//     async (id: number, thunkAPI) => {
//         try {
//             const response = await apiService.delete(`/fabric-type/${id}`);
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
export const deleteFabricType = createAsyncThunk(
    'fabric-type/deleteFabricType',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/fabric-type/${id}`);

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


// Create FabricType Slice
const fabricTypeSlice = createSlice({
    name: "state",
    initialState,
    reducers: {}, // No normal reducers for now
    extraReducers: (builder) => {
        builder

            // Handle getAllFabricTypes (GET request)
            .addCase(getAllFabricTypes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllFabricTypes.fulfilled, (state: any, action) => {
                state.loading = false;
                state.fabricTypeList = action.payload;
            })
            .addCase(getAllFabricTypes.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createFabricType (POST request)
            .addCase(createFabricType.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createFabricType.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.creatFabricTypeResult = action.payload;
            })
            .addCase(createFabricType.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle updateFabricType (PUT request)
            .addCase(updateFabricType.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateFabricType.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.fabricTypeList = state.fabricTypeList.map((table: any) =>
                    table.id === updatedTable.id ? updatedTable : table
                );
            })
            .addCase(updateFabricType.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteFabricType (DELETE request)
            .addCase(deleteFabricType.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteFabricType.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedFabricType = action.payload;
                state.fabricTypeList = state.fabricTypeList.filter(
                    (ftype: any) => ftype.id !== deletedFabricType.id
                );
            })
            .addCase(deleteFabricType.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export reducer
export default fabricTypeSlice.reducer;

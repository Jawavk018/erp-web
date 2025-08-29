import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ApiState {
    loading: boolean;
    error: string | null;
    uomList: any;
    createUomMasterResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    uomList: [],
    createUomMasterResult: null,
    checking: false,
};

// Thunk for getAllUomMaster GET API call
export const getAllUomMaster = createAsyncThunk(
    'uom/getAllUomMaster',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/uom"); // Adjust API endpoint if needed
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for createUom POST API call
export const createUom: any = createAsyncThunk(
    'uom/createUom',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/uom", params); // Adjust API endpoint if needed
            console.log(response)
            if (response?.status === "success") {
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

// Thunk for updateUom PUT API call
export const updateUom: any = createAsyncThunk(
    'uom/updateUom',
    async (params: any, thunkAPI) => {
        console.log(params);
        try {
            const response = await apiService.put(`/uom/${params.id}`, params); // ✅ Fix: Add ID to the URL
            console.log(response);
            if (response?.status === "success") {
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

// export const deleteUom: any = createAsyncThunk(
//     'uom/deleteUom',
//     async (id: number, thunkAPI) => {
//         try {
//             const response = await apiService.delete(`/uom/${id}`);
//             console.log(response); // Check what the API actually returns
//             if (response?.isSuccess) {
//                 // toast.success("Successfully deleted");
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
export const deleteUom = createAsyncThunk(
    'uom/deleteUom',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/uom/${id}`);

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

// Create uom Slice 
const uomSlice = createSlice({
    name: "state",
    initialState,
    reducers: {}, // No normal reducers for now
    extraReducers: (builder) => {
        builder

            // Handle getAllUomMaster (GET request)
            .addCase(getAllUomMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllUomMaster.fulfilled, (state: any, action) => {
                state.loading = false;
                state.uomList = action.payload;
            })
            .addCase(getAllUomMaster.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createUom (POST request)
            .addCase(createUom.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createUom.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createUomMasterResult = action.payload;
            })
            .addCase(createUom.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle updateUom (PUT request)
            .addCase(updateUom.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUom.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.uomList = state.uomList.map((table: any) =>
                    table.id === updatedTable.id ? updatedTable : table
                );
            })
            .addCase(updateUom.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteUom (DELETE request)
            .addCase(deleteUom.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUom.fulfilled, (state: any, action) => {
                state.loading = false;
                const deleteduom = action.payload;
                state.uomList = state.uomList.filter(
                    (terms: any) => terms.id !== deleteduom.id
                );
            })
            .addCase(deleteUom.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export reducer
export default uomSlice.reducer;

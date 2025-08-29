import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ApiState {
    loading: boolean;
    error: string | null;
    consigneeList: any;
    createConsigneeresult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    consigneeList: [],
    createConsigneeresult: null,
    checking: false,
};

// Thunk for getAllConsignee GET API call
export const getAllConsignee = createAsyncThunk(
    'consignee/getAllConsignee',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/consignee"); // Adjust API endpoint if needed
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for createConsignee POST API call
export const createConsignee: any = createAsyncThunk(
    'consignee/createConsignee',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/consignee", params); // Adjust API endpoint if needed
            console.log(response)
            if (response?.status === 'success') {
                toast.success(response?.message);
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

// Thunk for updateConsignee PUT API call
export const updateConsignee: any = createAsyncThunk(
    'consignee/updateConsignee',
    async (params: any, thunkAPI) => {
        console.log(params);
        try {
            const response = await apiService.put(`/consignee/${params.id}`, params); // ✅ Fix: Add ID to the URL
            console.log(response);
            if (response?.status === 'success') {
                toast.success(response?.message);
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

// export const deleteConsignee: any = createAsyncThunk(
//     'consignee/deleteConsignee',
//     async (id: number, thunkAPI) => {
//         try {
//             const response = await apiService.delete(`/consignee/${id}`);
//             console.log(response); // Check what the API actually returns
//             if (response?.status === 'success') {
//                 toast.success(response?.message);
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
export const deleteConsignee = createAsyncThunk(
    'consignee/deleteConsignee',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/consignee/${id}`);

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



// Create consignee Slice
const consigneeSlice = createSlice({
    name: "state",
    initialState,
    reducers: {}, // No normal reducers for now
    extraReducers: (builder) => {
        builder

            // Handle getAllConsignee (GET request)
            .addCase(getAllConsignee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllConsignee.fulfilled, (state: any, action) => {
                state.loading = false;
                state.consigneeList = action.payload;
            })
            .addCase(getAllConsignee.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createConsignee (POST request)
            .addCase(createConsignee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createConsignee.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createConsigneeresult = action.payload;
            })
            .addCase(createConsignee.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle updateConsignee (PUT request)
            .addCase(updateConsignee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateConsignee.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.consigneeList = state.consigneeList.map((table: any) =>
                    table.id === updatedTable.id ? updatedTable : table
                );
            })
            .addCase(updateConsignee.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteConsignee (DELETE request)
            .addCase(deleteConsignee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteConsignee.fulfilled, (state: any, action) => {
                state.loading = false;
                const deleteConsignee = action.payload;
                state.consigneeList = state.consigneeList.filter(
                    (consignee: any) => consignee.id !== deleteConsignee.id
                );
            })
            .addCase(deleteConsignee.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export reducer
export default consigneeSlice.reducer;

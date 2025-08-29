import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ApiState {
    loading: boolean;
    error: string | null;
    finishFabricReceiveList: any[];
    createFinishFabricReceiveResult: any;
}

const initialState: ApiState = {
    loading: false,
    error: null,
    finishFabricReceiveList: [],
    createFinishFabricReceiveResult: null,
};

// Thunk for getAllFinishFabricReceive GET API call
export const getAllFinishFabricReceive = createAsyncThunk(
    'finish-fabric-receives/getAllFinishFabricReceive',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/finish-fabric-receives");
            console.log(response);
            const data = response;
            console.log(data);
            return data || [];
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for createFinishFabricReceive POST API call
export const createFinishFabricReceive = createAsyncThunk(
    'finish-fabric-receives/createFinishFabricReceive',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/finish-fabric-receives", params);
            console.log(response)
            if (response) {
                toast.success("Saved Successfully!");
                return response.data;
            } else {
                const errorMessage = "Failed to create purchase inward";
                return thunkAPI.rejectWithValue(errorMessage);
            }
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for updateFinishFabricReceive PUT API call
export const updateFinishFabricReceive: any = createAsyncThunk(
    'purchase_inward/updateFinishFabricReceive',
    async (params: any, thunkAPI) => {
        console.log(params);
        try {
            const response = await apiService.put(`/purchase_inward/${params.id}`, params); // ✅ Fix: Add ID to the URL
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

// export const deleteFinishFabricReceive: any = createAsyncThunk(
//     'purchase_inward/deleteFinishFabricReceive',
//     async (id: number, thunkAPI) => {
//         try {
//             const response = await apiService.delete(`/purchase_inward/${id}`);
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
export const deleteFinishFabricReceive = createAsyncThunk(
    'purchase_inward/deleteFinishFabricReceive',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/finish-fabric-receives/${id}`);

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

// Create finishFabricReceivesSlice
const finishFabricReceivesSlice = createSlice({
    name: "finishFabricReceives",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle getAllFinishFabricReceive
            .addCase(getAllFinishFabricReceive.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllFinishFabricReceive.fulfilled, (state, action) => {
                state.loading = false;
                state.finishFabricReceiveList = action.payload;
            })
            .addCase(getAllFinishFabricReceive.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Handle createFinishFabricReceive
            .addCase(createFinishFabricReceive.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createFinishFabricReceive.fulfilled, (state, action) => {
                state.loading = false;
                state.createFinishFabricReceiveResult = action.payload;
            })
            .addCase(createFinishFabricReceive.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Handle updateFinishFabricReceive (PUT request)
            .addCase(updateFinishFabricReceive.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateFinishFabricReceive.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.finishFabricReceiveList = state.finishFabricReceiveList.map((table: any) =>
                    table.id === updatedTable.id ? updatedTable : table
                );
            })
            .addCase(updateFinishFabricReceive.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteFinishFabricReceive (DELETE request)
            .addCase(deleteFinishFabricReceive.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteFinishFabricReceive.fulfilled, (state: any, action) => {
                state.loading = false;
                const deleteFinishFabricReceives = action.payload;
                state.finishFabricReceiveList = state.finishFabricReceiveList.filter(
                    (pi: any) => pi.id !== deleteFinishFabricReceives.id
                );
            })
            .addCase(deleteFinishFabricReceive.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

// Export reducer
export default finishFabricReceivesSlice.reducer;

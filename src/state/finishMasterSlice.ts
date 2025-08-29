import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ApiState {
    loading: boolean;
    error: string | null;
    finishFabricList: any;
    createFinishFabricResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    finishFabricList: [],
    createFinishFabricResult: null,
    checking: false,
};

// Thunk for getAllFinishFabric GET API call
export const getAllFinishFabric = createAsyncThunk(
    'finish-master/getAllFinishFabric',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/finish-master"); // Adjust API endpoint if needed
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for createFinishFabric POST API call
export const createFinishFabric: any = createAsyncThunk(
    'finish-master/createFinishFabric',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/finish-master", params); // Adjust API endpoint if needed
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

// Thunk for updateFinishFabric PUT API call
export const updateFinishFabric: any = createAsyncThunk(
    'finish-master/updateFinishFabric',
    async (params: any, thunkAPI) => {
        console.log(params);
        try {
            const response = await apiService.put(`/finish-master/${params.id}`, params); // ✅ Fix: Add ID to the URL
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

export const deleteFinishFabric: any = createAsyncThunk(
    'finish-master/deleteFinishFabric',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/finish-master/${id}`);
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


// Create finishFabricSlice 
const finishFabricSlice = createSlice({
    name: "state",
    initialState,
    reducers: {}, // No normal reducers for now
    extraReducers: (builder) => {
        builder

            // Handle getAllFinishFabric (GET request)
            .addCase(getAllFinishFabric.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllFinishFabric.fulfilled, (state: any, action) => {
                state.loading = false;
                state.finishFabricList = action.payload;
            })
            .addCase(getAllFinishFabric.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createFinishFabric (POST request)
            .addCase(createFinishFabric.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createFinishFabric.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createFinishFabricResult = action.payload;
            })
            .addCase(createFinishFabric.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle updateFinishFabric (PUT request)
            .addCase(updateFinishFabric.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateFinishFabric.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.finishFabricList = state.finishFabricList.map((table: any) =>
                    table.id === updatedTable.id ? updatedTable : table
                );
            })
            .addCase(updateFinishFabric.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteFinishFabric (DELETE request)
            .addCase(deleteFinishFabric.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteFinishFabric.fulfilled, (state: any, action) => {
                state.loading = false;
                const deleteduom = action.payload;
                state.finishFabricList = state.finishFabricList.filter(
                    (terms: any) => terms.id !== deleteduom.id
                );
            })
            .addCase(deleteFinishFabric.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export reducer
export default finishFabricSlice.reducer;

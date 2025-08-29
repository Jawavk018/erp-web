import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ApiState {
    loading: boolean;
    error: string | null;
    knittedknittedFabricMasterList: any;
    creatFabricMasterResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    knittedknittedFabricMasterList: [],
    creatFabricMasterResult: null,
    checking: false,
};

// Thunk for getAllKnittedFabricMasters GET API call
export const getAllKnittedFabricMasters = createAsyncThunk(
    'knitted-fabric-master/getAllKnittedFabricMasters',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/knitted-fabric-master"); // Adjust API endpoint if needed
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for createKnittedFabricMasters POST API call
export const createKnittedFabricMasters: any = createAsyncThunk(
    'knitted-fabric-master/createKnittedFabricMasters',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/knitted-fabric-master", params); // Adjust API endpoint if needed
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

// Thunk for updateKnittedFabricMasters PUT API call
export const updateKnittedFabricMasters: any = createAsyncThunk(
    'knitted-fabric-master/updateKnittedFabricMasters',
    async (params: any, thunkAPI) => {
        console.log(params);
        try {
            const response = await apiService.put(`/knitted-fabric-master/${params.id}`, params); // ✅ Fix: Add ID to the URL
            console.log(response);
            if (response?.status === 'success') {
                toast.success(response?.message);
                return response;
            } else {
                const errorMessage = "Something went wrong";
                toast.error(errorMessage); ``
                return thunkAPI.rejectWithValue(errorMessage);
            }
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const deleteKnittedFabricMasters: any = createAsyncThunk(
    'knitted-fabric-master/deleteKnittedFabricMasters',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/knitted-fabric-master/${id}`);
            console.log(response); // Check what the API actually returns
            if (response?.status === 'success') {
                toast.success(response?.message);
                return response;
            } else {
                const errorMessage = "Something went wrong";
                toast.error(errorMessage);
                return thunkAPI.rejectWithValue(errorMessage);
            }
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


// Create knittedFabricMasterSlice
const knittedFabricMasterSlice = createSlice({
    name: "state",
    initialState,
    reducers: {}, // No normal reducers for now
    extraReducers: (builder) => {
        builder

            // Handle getAllKnittedFabricMasters (GET request)
            .addCase(getAllKnittedFabricMasters.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllKnittedFabricMasters.fulfilled, (state: any, action) => {
                state.loading = false;
                state.knittedknittedFabricMasterList = action.payload;
            })
            .addCase(getAllKnittedFabricMasters.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createKnittedFabricMasters (POST request)
            .addCase(createKnittedFabricMasters.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createKnittedFabricMasters.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.creatFabricMasterResult = action.payload;
            })
            .addCase(createKnittedFabricMasters.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle updateKnittedFabricMasters (PUT request)
            .addCase(updateKnittedFabricMasters.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateKnittedFabricMasters.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.knittedknittedFabricMasterList = state.knittedknittedFabricMasterList.map((table: any) =>
                    table.id === updatedTable.id ? updatedTable : table
                );
            })
            .addCase(updateKnittedFabricMasters.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteKnittedFabricMasters (DELETE request)
            .addCase(deleteKnittedFabricMasters.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteKnittedFabricMasters.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedFabricMaster = action.payload;
                state.knittedknittedFabricMasterList = state.knittedknittedFabricMasterList.filter(
                    (fmaster: any) => fmaster.id !== deletedFabricMaster.id
                );
            })
            .addCase(deleteKnittedFabricMasters.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export reducer
export default knittedFabricMasterSlice.reducer;

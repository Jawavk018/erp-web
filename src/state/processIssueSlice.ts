import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ApiState {
    loading: boolean;
    error: string | null;
    fabricDispatchDyingList: any;
    createResul: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    fabricDispatchDyingList: [],
    createResul: null,
    checking: false,
};

// Thunk for getAllFabricDispatch GET API call
export const getAllFabricDispatch = createAsyncThunk(
    'fabric-dispatch/getAllFabricDispatch',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/fabric-dispatch"); // Adjust API endpoint if needed
            console.log(response)
            const data = response;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for createFabricDispatch POST API call
export const createFabricDispatch: any = createAsyncThunk(
    'fabric-dispatch/createFabricDispatch',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/fabric-dispatch", params); // Adjust API endpoint if needed
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


export const updateFabricDispatch: any = createAsyncThunk(
    'fabric-dispatch/updateFabricDispatch',
    async ({ id, data }: { id: number, data: any }, thunkAPI) => {
        try {
            // send only the data as body, not the wrapper object
            const response = await apiService.put(`/fabric-dispatch/${id}`, data);

            // You can adjust this depending on your backend response structure:
            if (response?.status === 'success') {
                toast.success(response?.message);
                return response;
            } else {
                const errorMessage = "Something went wrong";
                toast.error(errorMessage);
                return thunkAPI.rejectWithValue(errorMessage);
            }
        } catch (error: any) {
            toast.error(error.message || "Update failed");
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const deleteFabricDispatch: any = createAsyncThunk(
    'fabric-dispatch/deleteFabricDispatch',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/fabric-dispatch/${id}`);
            console.log(response); // Check what the API actually returns
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


// Create fabricDispatchDyeingSlice
const fabricDispatchDyeingSlice = createSlice({
    name: "state",
    initialState,
    reducers: {}, // No normal reducers for now
    extraReducers: (builder) => {
        builder

            // Handle getAllFabricDispatch (GET request)
            .addCase(getAllFabricDispatch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllFabricDispatch.fulfilled, (state: any, action) => {
                state.loading = false;
                state.fabricDispatchDyingList = action.payload;
            })
            .addCase(getAllFabricDispatch.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createFabricDispatch (POST request)
            .addCase(createFabricDispatch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createFabricDispatch.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createResul = action.payload;
            })
            .addCase(createFabricDispatch.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle updateFabricDispatch (PUT request)
            .addCase(updateFabricDispatch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateFabricDispatch.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.fabricDispatchDyingList = state.fabricDispatchDyingList.map((table: any) =>
                    table.id === updatedTable.id ? updatedTable : table
                );
            })
            .addCase(updateFabricDispatch.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteFabricDispatch (DELETE request)
            .addCase(deleteFabricDispatch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteFabricDispatch.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedSalesOrder = action.payload;
                state.fabricDispatchDyingList = state.fabricDispatchDyingList.filter(
                    (so: any) => so.id !== deletedSalesOrder.id
                );
            })
            .addCase(deleteFabricDispatch.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export reducer
export default fabricDispatchDyeingSlice.reducer;

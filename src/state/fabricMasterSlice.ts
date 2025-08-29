import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ApiState {
    loading: boolean;
    error: string | null;
    fabricMasterList: any;
    fabricMasterDetailList: any;
    creatFabricMasterResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    fabricMasterList: [],
    fabricMasterDetailList: [],
    creatFabricMasterResult: null,
    checking: false,
};

// Thunk for getAllFabricMasters GET API call
export const getAllFabricMasters = createAsyncThunk(
    'fabric-master/getAllFabricMasters',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/fabric-master"); // Adjust API endpoint if needed
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for getAllFabricMasterDetails GET API call
// export const getAllFabricMasterDetails = createAsyncThunk(
//     'fabric-master/getAllFabricMasterDetails',
//     async (params: any, thunkAPI) => {
//         alert(params)
//         try {
//             const response = await apiService.get("fabric-master/basic/${id}"); // Adjust API endpoint if needed
//             console.log(response)
//             const data = response?.data;
//             return data || [];
//         } catch (error: any) {
//             // Handle errors and reject with error message
//             return thunkAPI.rejectWithValue(error.message);
//         }
//     }
// );
export const getAllFabricMasterDetails = createAsyncThunk(
    'fabric-master/getAllFabricMasterDetails',
    async (params: { id: number }, thunkAPI) => {
        try {
            const { id } = params;
            const response = await apiService.get(`fabric-master/basic/${id}`);
            const data = response;
            console.log(response)
            return data || [];
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


// Thunk for createFabricMaster POST API call
export const createFabricMaster: any = createAsyncThunk(
    'fabric-master/createFabricMaster',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/fabric-master", params); // Adjust API endpoint if needed
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

// Thunk for updateFabricMaster PUT API call
export const updateFabricMaster: any = createAsyncThunk(
    'fabric-master/updateFabricMaster',
    async (params: any, thunkAPI) => {
        console.log(params);
        try {
            const response = await apiService.put(`/fabric-master/${params.id}`, params); // ✅ Fix: Add ID to the URL
            console.log(response);
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

export const deleteFabricMaster: any = createAsyncThunk(
    'fabric-master/deleteFabricMaster',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/fabric-master/${id}`);
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


// Create fabricMasterSlice
const fabricMasterSlice = createSlice({
    name: "state",
    initialState,
    reducers: {}, // No normal reducers for now
    extraReducers: (builder) => {
        builder

            // Handle getAllFabricMasters (GET request)
            .addCase(getAllFabricMasters.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllFabricMasters.fulfilled, (state: any, action) => {
                state.loading = false;
                state.fabricMasterList = action.payload;
            })
            .addCase(getAllFabricMasters.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle getAllFabricMasterDetails (GET request)
            .addCase(getAllFabricMasterDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllFabricMasterDetails.fulfilled, (state: any, action) => {
                state.loading = false;
                state.fabricMasterDetailList = action.payload;
            })
            .addCase(getAllFabricMasterDetails.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createFabricMaster (POST request)
            .addCase(createFabricMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createFabricMaster.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.creatFabricMasterResult = action.payload;
            })
            .addCase(createFabricMaster.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle updateFabricMaster (PUT request)
            .addCase(updateFabricMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateFabricMaster.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.fabricMasterList = state.fabricMasterList.map((table: any) =>
                    table.id === updatedTable.id ? updatedTable : table
                );
            })
            .addCase(updateFabricMaster.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteFabricMaster (DELETE request)
            .addCase(deleteFabricMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteFabricMaster.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedFabricMaster = action.payload;
                state.fabricMasterList = state.fabricMasterList.filter(
                    (fmaster: any) => fmaster.id !== deletedFabricMaster.id
                );
            })
            .addCase(deleteFabricMaster.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export reducer
export default fabricMasterSlice.reducer;

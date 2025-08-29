import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ApiState {
    loading: boolean;
    error: string | null;
    fabricInspectionList: any;
    createFabricInspectionResult: any;
    getFabricInspectionByIdList: any;
    lotEntriesList: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    fabricInspectionList: [],
    getFabricInspectionByIdList: [],
    lotEntriesList: [],
    createFabricInspectionResult: null,
    checking: false,
};

// Thunk for getAllFabricInspection GET API call
export const getAllFabricInspection = createAsyncThunk(
    'fabric-inspections/getAllFabricInspection',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/fabric-inspections"); // Adjust API endpoint if needed
            console.log(response)
            const data = response.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for getFabricInspectionById
export const getFabricInspectionById = createAsyncThunk(
    'fabric-inspections/getFabricInspectionById',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.get(`/fabric-inspections/${id}`);
            console.log("API Response:", response);
            return response || { data: [], message: "", status: "success" };
        } catch (error: any) {
            console.error("API Error:", error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for createFabricInspection POST API call
export const createFabricInspection: any = createAsyncThunk(
    'fabric-inspections/createFabricInspection',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("fabric-inspections", params); // Adjust API endpoint if needed
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


export const updateFabricInspection: any = createAsyncThunk(
    'fabric-inspections/updateFabricInspection',
    async ({ id, data }: { id: number, data: any }, thunkAPI) => {
        try {
            // send only the data as body, not the wrapper object
            const response = await apiService.put(`/fabric-inspections/${id}`, data);

            // You can adjust this depending on your backend response structure:
            if (response) {
                // You can change this to response.message if your backend returns a message
                toast.success("Fabric Inspection updated successfully!");
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


export const deleteContract: any = createAsyncThunk(
    'fabric-inspections/deleteContract',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/fabric-inspections/${id}`);
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


// Create fabricInspectionsSlice
const fabricInspectionsSlice = createSlice({
    name: "state",
    initialState,
    reducers: {}, // No normal reducers for now
    extraReducers: (builder) => {
        builder

            // Handle getAllFabricInspection (GET request)
            .addCase(getAllFabricInspection.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllFabricInspection.fulfilled, (state: any, action) => {
                state.loading = false;
                state.fabricInspectionList = action.payload;
            })
            .addCase(getAllFabricInspection.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle getFabricInspectionById (GET request)
            .addCase(getFabricInspectionById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFabricInspectionById.fulfilled, (state: any, action) => {
                state.loading = false;
                state.getFabricInspectionByIdList = action.payload;
            })
            .addCase(getFabricInspectionById.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createFabricInspection (POST request)
            .addCase(createFabricInspection.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createFabricInspection.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createFabricInspectionResult = action.payload;
            })
            .addCase(createFabricInspection.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteContract (DELETE request)
            .addCase(deleteContract.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteContract.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedWeavingContract = action.payload;
                state.fabricInspectionList = state.fabricInspectionList.filter(
                    (wc: any) => wc.id !== deletedWeavingContract.id
                );
            })
            .addCase(deleteContract.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export reducer
export default fabricInspectionsSlice.reducer;

import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ApiState {
    loading: boolean;
    error: string | null;
    weavingYarnIssuetList: any;
    createWeavingYarnIssuetResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    weavingYarnIssuetList: [],
    createWeavingYarnIssuetResult: null,
    checking: false,
};

// Thunk for getAllWeavingYarnIssue GET API call
export const getAllWeavingYarnIssue = createAsyncThunk(
    'weaving-yarn-issues/getAllWeavingYarnIssue',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/weaving-yarn-issues"); // Adjust API endpoint if needed
            console.log(response)
            const data = response;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for createWeavingYarnIssue POST API call
export const createWeavingYarnIssue: any = createAsyncThunk(
    'weaving-yarn-issues/createWeavingYarnIssue',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/weaving-yarn-issues", params); // Adjust API endpoint if needed
            console.log(response)
            if (response) {
                toast.success("Saved Successfully!");
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

export const updateWeavingYarnIssue: any = createAsyncThunk(
    'weaving-contracts/updateWeavingYarnIssue',
    async ({ id, data }: { id: number, data: any }, thunkAPI) => {
        try {
            // alert(JSON.stringify(data))
            console.log("Update Weaving Contract Data:", data);
            // send only the data as body, not the wrapper object
            const response = await apiService.put(`/weaving-yarn-issues/${id}`, data);

            // You can adjust this depending on your backend response structure:
            if (response) {
                // You can change this to response.message if your backend returns a message
                toast.success("updated successfully!");
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

export const deleteWeavingYarnIssue: any = createAsyncThunk(
    'weaving-yarn-issues/deleteWeavingYarnIssue',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/weaving-yarn-issues/${id}`);
            console.log(response); // Check what the API actually returns
            if (response?.isSuccess) {
                // toast.success("Successfully deleted");
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


// Create weavingYarnIssueSlice
const weavingYarnIssueSlice = createSlice({
    name: "state",
    initialState,
    reducers: {}, // No normal reducers for now
    extraReducers: (builder) => {
        builder

            // Handle getAllWeavingYarnIssue (GET request)
            .addCase(getAllWeavingYarnIssue.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllWeavingYarnIssue.fulfilled, (state: any, action) => {
                state.loading = false;
                state.weavingYarnIssuetList = action.payload;
            })
            .addCase(getAllWeavingYarnIssue.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createWeavingYarnIssue (POST request)
            .addCase(createWeavingYarnIssue.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createWeavingYarnIssue.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createWeavingYarnIssuetResult = action.payload;
            })
            .addCase(createWeavingYarnIssue.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteWeavingYarnIssue (DELETE request)
            .addCase(deleteWeavingYarnIssue.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteWeavingYarnIssue.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedWeavingContract = action.payload;
                state.weavingYarnIssuetList = state.weavingYarnIssuetList.filter(
                    (wc: any) => wc.id !== deletedWeavingContract.id
                );
            })
            .addCase(deleteWeavingYarnIssue.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export reducer
export default weavingYarnIssueSlice.reducer;

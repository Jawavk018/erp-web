import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ApiState {
    loading: boolean;
    error: string | null;
    sizingYarnIssuetList: any;
    createSizingYarnIssuetResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    sizingYarnIssuetList: [],
    createSizingYarnIssuetResult: null,
    checking: false,
};

// Thunk for getAllSizingYarnIssue GET API call
export const getAllSizingYarnIssue = createAsyncThunk(
    'sizing-yarn-issues/getAllSizingYarnIssue',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/sizing-yarn-issues"); // Adjust API endpoint if needed
            console.log(response)
            const data = response;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for createSizingYarnIssue POST API call
export const createSizingYarnIssue: any = createAsyncThunk(
    'sizing-yarn-issues/createSizingYarnIssue',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/sizing-yarn-issues", params); // Adjust API endpoint if needed
            console.log(response)
            if (response) {
                toast.success("Weaving Yarn Issue Successfully!");
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

export const updateSizingYarnIssue: any = createAsyncThunk(
    'weaving-contracts/updateSizingYarnIssue',
    async ({ id, data }: { id: number, data: any }, thunkAPI) => {
        try {
            // alert(JSON.stringify(data))
            console.log("Update Weaving Contract Data:", data);
            // send only the data as body, not the wrapper object
            const response = await apiService.put(`/sizing-yarn-issues/${id}`, data);

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

export const deleteSizingYarnIssue: any = createAsyncThunk(
    'sizing-yarn-issues/deleteSizingYarnIssue',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/sizing-yarn-issues/${id}`);
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


// Create sizingYarnIssueSlice
const sizingYarnIssueSlice = createSlice({
    name: "state",
    initialState,
    reducers: {}, // No normal reducers for now
    extraReducers: (builder) => {
        builder

            // Handle getAllSizingYarnIssue (GET request)
            .addCase(getAllSizingYarnIssue.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllSizingYarnIssue.fulfilled, (state: any, action) => {
                state.loading = false;
                state.sizingYarnIssuetList = action.payload;
            })
            .addCase(getAllSizingYarnIssue.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createSizingYarnIssue (POST request)
            .addCase(createSizingYarnIssue.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createSizingYarnIssue.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createSizingYarnIssuetResult = action.payload;
            })
            .addCase(createSizingYarnIssue.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteSizingYarnIssue (DELETE request)
            .addCase(deleteSizingYarnIssue.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteSizingYarnIssue.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedSizingIssue = action.payload;
                state.sizingYarnIssuetList = state.sizingYarnIssuetList.filter(
                    (wc: any) => wc.id !== deletedSizingIssue.id
                );
            })
            .addCase(deleteSizingYarnIssue.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export reducer
export default sizingYarnIssueSlice.reducer;

import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ApiState {
    loading: boolean;
    error: string | null;
    emptyBeamIssueList: any;
    createEmptyBeamIssueResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    emptyBeamIssueList: [],
    createEmptyBeamIssueResult: null,
    checking: false,
};

// Thunk for getAllEmptyBeamIssue GET API call
export const getAllEmptyBeamIssue = createAsyncThunk(
    'empty_beam_issue/getAllEmptyBeamIssue',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/empty_beam_issue"); // Adjust API endpoint if needed
            console.log(response)
            const data = response;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for createEmptyBeamIssue POST API call
export const createEmptyBeamIssue: any = createAsyncThunk(
    'empty_beam_issue/createEmptyBeamIssue',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/empty_beam_issue", params); // Adjust API endpoint if needed
            console.log(response)
            if (response) {
                toast.success("Saved Successfully!");
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

// Thunk for updateEmptyBeamIssue PUT API call
export const updateEmptyBeamIssue: any = createAsyncThunk(
    'empty_beam_issue/updateEmptyBeamIssue',
    async (params: any, thunkAPI) => {
        console.log(params);
        try {
            const response = await apiService.put(`/empty_beam_issue/${params.id}`, params); // ✅ Fix: Add ID to the URL
            console.log(response);
            if (response) {
                toast.success("Updated Successfully!");
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

export const deleteEmptyBeamIssue: any = createAsyncThunk(
    'empty_beam_issue/deleteEmptyBeamIssue',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/empty_beam_issue/${id}`);
            console.log(response); // Check what the API actually returns
            if (response?.status === 'success') {
                toast.success("Successfully Deleted!");
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


// Create emptyBeamIssueSlice 
const emptyBeamIssueSlice = createSlice({
    name: "state",
    initialState,
    reducers: {}, // No normal reducers for now
    extraReducers: (builder) => {
        builder

            // Handle getAllEmptyBeamIssue (GET request)
            .addCase(getAllEmptyBeamIssue.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllEmptyBeamIssue.fulfilled, (state: any, action) => {
                state.loading = false;
                state.emptyBeamIssueList = action.payload;
            })
            .addCase(getAllEmptyBeamIssue.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createEmptyBeamIssue (POST request)
            .addCase(createEmptyBeamIssue.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createEmptyBeamIssue.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createEmptyBeamIssueResult = action.payload;
            })
            .addCase(createEmptyBeamIssue.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle updateEmptyBeamIssue (PUT request)
            .addCase(updateEmptyBeamIssue.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateEmptyBeamIssue.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.emptyBeamIssueList = state.emptyBeamIssueList.map((table: any) =>
                    table.id === updatedTable.id ? updatedTable : table
                );
            })
            .addCase(updateEmptyBeamIssue.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteEmptyBeamIssue (DELETE request)
            .addCase(deleteEmptyBeamIssue.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteEmptyBeamIssue.fulfilled, (state: any, action) => {
                state.loading = false;
                const deleteEmptyBeamIssue = action.payload;
                state.emptyBeamIssueList = state.emptyBeamIssueList.filter(
                    (terms: any) => terms.id !== deleteEmptyBeamIssue.id
                );
            })
            .addCase(deleteEmptyBeamIssue.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export reducer
export default emptyBeamIssueSlice.reducer;

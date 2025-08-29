import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ApiState {
    loading: boolean;
    error: string | null;
    jobworkFabricReceiveList: any;
    createJobkFabricReceiveResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    jobworkFabricReceiveList: [],
    createJobkFabricReceiveResult: null,
    checking: false,
};

// Thunk for getAllJobworkFabricReceive GET API call
export const getAllJobworkFabricReceive = createAsyncThunk(
    'jobwork_fabric_receive/getAllJobworkFabricReceive',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/jobwork-fabric-receive"); // Adjust API endpoint if needed
            console.log(response)
            const data = response;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for getJobworkFabricReceiveById
export const getJobworkFabricReceiveById = createAsyncThunk(
    'jobwork_fabric_receive/getJobworkFabricReceiveById',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.get(`/jobwork_fabric_receive/${id}`);
            console.log("API Response:", response);
            return response || { data: [], message: "", status: "success" };
        } catch (error: any) {
            console.error("API Error:", error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for createJobworkFabricReceive POST API call
export const createJobworkFabricReceive: any = createAsyncThunk(
    'jobwork_fabric_receive/createJobworkFabricReceive',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/jobwork-fabric-receive", params); // Adjust API endpoint if needed
            console.log(response)
            if (response) {
                toast.success("Job Fabric Receive Created Successfully!");
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

export const updateJobworkFabricReceive: any = createAsyncThunk(
    'jobwork_fabric_receive/updateJobworkFabricReceive',
    async ({ id, data }: { id: number, data: any }, thunkAPI) => {
        try {
            // send only the data as body, not the wrapper object
            const response = await apiService.put(`/jobwork_fabric_receive/${id}`, data);

            // You can adjust this depending on your backend response structure:
            if (response) {
                // You can change this to response.message if your backend returns a message
                toast.success("Updated successfully!");
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

// export const deleteJobworkFabricReceive: any = createAsyncThunk(
//     'jobwork_fabric_receive/deleteJobworkFabricReceive',
//     async (id: number, thunkAPI) => {
//         try {
//             const response = await apiService.delete(`/jobwork_fabric_receive/${id}`);
//             console.log(response); // Check what the API actually returns
//             if (response?.isSuccess) {
//                 // toast.success("Successfully deleted");
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
export const deleteJobworkFabricReceive = createAsyncThunk(
    'jobwork_fabric_receive/deleteJobworkFabricReceive',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/jobwork-fabric-receive/${id}`);

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


// Create JobworkFabricReceiveSlice
const JobworkFabricReceiveSlice = createSlice({
    name: "state",
    initialState,
    reducers: {}, // No normal reducers for now
    extraReducers: (builder) => {
        builder

            // Handle getAllJobworkFabricReceive (GET request)
            .addCase(getAllJobworkFabricReceive.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllJobworkFabricReceive.fulfilled, (state: any, action) => {
                state.loading = false;
                state.jobworkFabricReceiveList = action.payload;
            })
            .addCase(getAllJobworkFabricReceive.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createJobworkFabricReceive (POST request)
            .addCase(createJobworkFabricReceive.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createJobworkFabricReceive.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createJobkFabricReceiveResult = action.payload;
            })
            .addCase(createJobworkFabricReceive.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteJobworkFabricReceive (DELETE request)
            .addCase(deleteJobworkFabricReceive.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteJobworkFabricReceive.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedJobworkFabricReceive = action.payload;
                state.jobworkFabricReceiveList = state.jobworkFabricReceiveList.filter(
                    (jwfr: any) => jwfr.id !== deletedJobworkFabricReceive.id
                );
            })
            .addCase(deleteJobworkFabricReceive.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export reducer
export default JobworkFabricReceiveSlice.reducer;

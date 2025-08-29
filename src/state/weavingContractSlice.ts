import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { json } from "stream/consumers";

export interface ApiState {
    loading: boolean;
    error: string | null;
    weavingContractList: any;
    createWeavingContractResult: any;
    getWeavingContractByIdList: any;
    lotEntriesList: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    weavingContractList: [],
    getWeavingContractByIdList: [],
    lotEntriesList: [],
    createWeavingContractResult: null,
    checking: false,
};

// Thunk for getAllWeavingContract GET API call
export const getAllWeavingContract = createAsyncThunk(
    'weaving-contracts/getAllWeavingContract',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/weaving-contracts"); // Adjust API endpoint if needed
            console.log(response)
            const data = response;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for getAllLotEntries GET API call
export const getAllLotEntries = createAsyncThunk(
    'lot_entry/getAllLotEntries',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/lot_entry"); // Adjust API endpoint if needed
            console.log(response)
            const data = response;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for getWeavingContractById
export const getWeavingContractById = createAsyncThunk(
    'weaving-contracts/getWeavingContractById',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.get(`/weaving-contracts/${id}`);
            console.log("API Response:", response);
            return response || { data: [], message: "", status: "success" };
        } catch (error: any) {
            console.error("API Error:", error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for createWeavingContract POST API call
export const createWeavingContract: any = createAsyncThunk(
    'weaving-contracts/createWeavingContract',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/weaving-contracts", params); // Adjust API endpoint if needed
            console.log(response)
            if (response) {
                toast.success("Weaving Contract Saved Successfully!");
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

export const updateWeavingContract: any = createAsyncThunk(
    'weaving-contracts/updateWeavingContract',
    async ({ id, data }: { id: number, data: any }, thunkAPI) => {
        try {
            // alert(JSON.stringify(data))
            console.log("Update Weaving Contract Data:", data);
            // send only the data as body, not the wrapper object
            const response = await apiService.put(`/weaving-contracts/${id}`, data);

            // You can adjust this depending on your backend response structure:
            if (response) {
                // You can change this to response.message if your backend returns a message
                toast.success("Weaving Contract updated successfully!");
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

// export const deleteContract: any = createAsyncThunk(
//     'weaving-contracts/deleteContract',
//     async (id: number, thunkAPI) => {
//         try {
//             const response = await apiService.delete(`/weaving-contracts/${id}`);
//             console.log(response); // Check what the API actually returns
//             if (response) {
//                 toast.success("Successfully deleted");
//                 return response;
//             } else {
//                 const errorMessage = "Something went wrong";
//                 toast.error(errorMessage);
//                 return thunkAPI.rejectWithValue(errorMessage);
//             }
//         } catch (error: any) {
//             return thunkAPI.rejectWithValue(error.message);
//         }
//     }
// );

export const deleteContract = createAsyncThunk(
    'weaving-contracts/deleteContract',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/weaving-contracts/${id}`);

            if (response?.status === 'success') {
                toast.success("Successfully deleted");
                return id; // Return the deleted ID for reducer handling
            }

            // Handle API error response
            const errorMessage = response.data.data?.message || 'Failed to delete category';
            toast.error(errorMessage);
            return response;

        } catch (error: any) {
            // Handle network errors or unexpected errors
            let errorMessage = 'An error occurred while deleting the category';

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


// Create weavingContractsSlice
const weavingContractsSlice = createSlice({
    name: "state",
    initialState,
    reducers: {}, // No normal reducers for now
    extraReducers: (builder) => {
        builder

            // Handle getAllWeavingContract (GET request)
            .addCase(getAllWeavingContract.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllWeavingContract.fulfilled, (state: any, action) => {
                state.loading = false;
                state.weavingContractList = action.payload;
            })
            .addCase(getAllWeavingContract.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle getAllLotEntries (GET request)
            .addCase(getAllLotEntries.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllLotEntries.fulfilled, (state: any, action) => {
                state.loading = false;
                state.lotEntriesList = action.payload;
            })
            .addCase(getAllLotEntries.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle getWeavingContractById (GET request)
            .addCase(getWeavingContractById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getWeavingContractById.fulfilled, (state: any, action) => {
                state.loading = false;
                state.getWeavingContractByIdList = action.payload;
            })
            .addCase(getWeavingContractById.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createWeavingContract (POST request)
            .addCase(createWeavingContract.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createWeavingContract.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createWeavingContractResult = action.payload;
            })
            .addCase(createWeavingContract.rejected, (state, action: PayloadAction<string>) => {
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
                state.weavingContractList = state.weavingContractList.filter(
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
export default weavingContractsSlice.reducer;

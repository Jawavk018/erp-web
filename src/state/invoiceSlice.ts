import apiService from "@/services/ApiService";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export interface ApiState {
    loading: boolean;
    error: string | null;
    invoiceList: any;
    createInvoiceResult: any;
    lastInvoiceNumber: string | null;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    invoiceList: [],
    createInvoiceResult: null,
    lastInvoiceNumber: null,
    checking: false,
};

// Thunk for getting last invoice number
export const getLastInvoiceNumber = createAsyncThunk(
    'invoices/getLastInvoiceNumber',
    async (_, thunkAPI) => {
        try {
            const response = await apiService.get("/invoices/last-number");
            return response?.data?.invoiceNumber || null;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for getAllInvoices GET API call
export const getAllInvoices = createAsyncThunk(
    'invoices/getAllInvoices',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.get("/invoices");
            const data = response;
            return data || [];
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for createInvoice POST API call
export const createInvoice: any = createAsyncThunk(
    'invoices/createInvoice',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post("/invoices", params);
            if (response) {
                toast.success('Invoice created successfully');
                return response.data;
            } else {
                const errorMessage = response?.message || "Failed to create invoice";
                toast.error(errorMessage);
                return thunkAPI.rejectWithValue(errorMessage);
            }
        } catch (error: any) {
            const errorMessage = error.message || "Failed to create invoice";
            toast.error(errorMessage);
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

// Thunk for updatePaymentTerms PUT API call
export const updatePaymentTerms: any = createAsyncThunk(
    'invoices/updatePaymentTerms',
    async (params: any, thunkAPI) => {
        console.log(params);
        try {
            const response = await apiService.put(`/invoices/${params.id}`, params); // ✅ Fix: Add ID to the URL
            console.log(response);
            if (response?.isSuccess) {
                // toast.success("Updated Successfully");
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

export const deletePaymentTerms: any = createAsyncThunk(
    'invoices/deletePaymentTerms',
    async (id: number, thunkAPI) => {
        try {
            const response = await apiService.delete(`/invoices/${id}`);
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

// Create InvoiceSlice
const invoiceSlice = createSlice({
    name: "invoice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle getLastInvoiceNumber
            .addCase(getLastInvoiceNumber.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getLastInvoiceNumber.fulfilled, (state, action) => {
                state.loading = false;
                state.lastInvoiceNumber = action.payload;
            })
            .addCase(getLastInvoiceNumber.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Handle getAllInvoices
            .addCase(getAllInvoices.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllInvoices.fulfilled, (state, action) => {
                state.loading = false;
                state.invoiceList = action.payload;
            })
            .addCase(getAllInvoices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Handle createInvoice
            .addCase(createInvoice.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createInvoice.fulfilled, (state, action) => {
                state.loading = false;
                state.createInvoiceResult = action.payload;
            })
            .addCase(createInvoice.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Handle updatePaymentTerms (PUT request)
            .addCase(updatePaymentTerms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePaymentTerms.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.invoiceList = state.invoiceList.map((table: any) =>
                    table.id === updatedTable.id ? updatedTable : table
                );
            })
            .addCase(updatePaymentTerms.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deletePaymentTerms (DELETE request)
            .addCase(deletePaymentTerms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePaymentTerms.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedPaymentTerm = action.payload;
                state.invoiceList = state.invoiceList.filter(
                    (payment: any) => payment.id !== deletedPaymentTerm.id
                );
            })
            .addCase(deletePaymentTerms.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export default invoiceSlice.reducer;

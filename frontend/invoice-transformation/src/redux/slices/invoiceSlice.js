import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  invoiceData: [],
  loading: false,
  error: null,
};

const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    addInvoiceData: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.invoiceData = [...state.invoiceData, ...action.payload];
      } else {
        state.invoiceData = [...state.invoiceData, action.payload];
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearInvoiceData: (state) => {
      state.invoiceData = [];
      state.loading = false;
      state.error = null;
    },
    clearSpecificInvoiceData: (state, action) => {
      const { invoice_id } = action.payload;
      state.invoiceData = state.invoiceData.filter(
        (invoice) => invoice.invoice_id !== invoice_id
      );
    },
    editSpecificInvoiceData: (state, action) => {
      const { invoice_id, updatedData } = action.payload;

      const index = state.invoiceData.findIndex(
        (invoice) => invoice.invoice_id === invoice_id
      );

      if (index !== -1) {
        state.invoiceData[index] = {
          ...state.invoiceData[index],
          ...updatedData,
        };
      }
    },
  },
});

export const {
  addInvoiceData,
  setLoading,
  setError,
  clearInvoiceData,
  clearSpecificInvoiceData,
  editSpecificInvoiceData,
} = invoiceSlice.actions;

export default invoiceSlice.reducer;

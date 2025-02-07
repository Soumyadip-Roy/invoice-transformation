import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { editSpecificInvoiceData } from "../redux/slices/invoiceSlice";

const EditInvoiceForm = ({ invoice, onClose }) => {
  const [formData, setFormData] = useState(invoice);
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      editSpecificInvoiceData({
        invoice_id: formData.invoice_id,
        updatedData: formData,
      })
    );
    alert("Invoice updated successfully.");
    onClose();
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        Edit Invoice
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Invoice ID"
            name="invoice_id"
            value={formData.invoice_id}
            disabled
          />
          <TextField
            fullWidth
            label="Customer Name"
            name="customer_name"
            value={formData.customer_name || ""}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            label="Product Name"
            name="product_name"
            value={formData.product_name || ""}
            onChange={handleInputChange}
          />
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              label="Quantity"
              name="qty"
              type="number"
              value={formData.qty || ""}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Tax"
              name="tax"
              type="number"
              value={formData.tax || ""}
              onChange={handleInputChange}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              label="Total Amount"
              name="total_amount"
              type="number"
              value={formData.total_amount || ""}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Unit Price"
              name="unit_price"
              type="number"
              value={formData.unit_price || ""}
              onChange={handleInputChange}
            />
          </Box>
          <TextField
            fullWidth
            label="Phone Number"
            name="phone_number"
            value={formData.phone_number || ""}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={formData.address || ""}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            label="Date"
            name="date"
            type="date"
            value={formData.date || ""}
            onChange={handleInputChange}
          />
        </Stack>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button variant="contained" color="primary" type="submit">
            Save Changes
          </Button>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default EditInvoiceForm;

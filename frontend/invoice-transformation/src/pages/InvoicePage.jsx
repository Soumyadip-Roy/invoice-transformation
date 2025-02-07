import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Modal,
  Box,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { clearSpecificInvoiceData } from "../redux/slices/invoiceSlice";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditInvoiceForm from "../component/EditInvoiceForm";
import { useState } from "react";

const Invoice = () => {
  const { invoiceData } = useSelector((state) => state.invoice);
  const dispatch = useDispatch();
  const [editInvoice, setEditInvoice] = useState(null);
  const handleEdit = (invoice) => {
    setEditInvoice(invoice);
  };

  const handleCloseModal = () => {
    setEditInvoice(null);
  };

  const handleDelete = (invoiceId) => {
    console.log("clearSpecificData", invoiceId);
    if (
      window.confirm("Are you sure you want to delete this invoice detail?")
    ) {
      dispatch(clearSpecificInvoiceData({ invoice_id: invoiceId }));
    }
  };

  console.log("invoiceData:", invoiceData);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Invoices
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.No.</TableCell>
              <TableCell>Invoice ID</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Tax</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoiceData && invoiceData.length > 0 ? (
              invoiceData.map((invoice, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{invoice?.invoice_id || "N/A"}</TableCell>
                  <TableCell>{invoice?.customer_name || "N/A"}</TableCell>
                  <TableCell>{invoice?.product_name || "N/A"}</TableCell>
                  <TableCell>{invoice?.qty || 0}</TableCell>
                  <TableCell>{invoice?.tax || 0}</TableCell>
                  <TableCell>{invoice?.total_amount || 0}</TableCell>
                  <TableCell>{invoice?.date || "N/A"}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <IconButton
                        onClick={() => handleEdit(invoice)}
                        color="primary"
                        aria-label="edit"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(invoice.invoice_id)}
                        color="error"
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No invoices available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={!!editInvoice} onClose={handleCloseModal}>
        <Box sx={{ p: 4 }}>
          {editInvoice && (
            <EditInvoiceForm invoice={editInvoice} onClose={handleCloseModal} />
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default Invoice;

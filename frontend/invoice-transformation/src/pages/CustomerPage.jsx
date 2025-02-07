import {
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import { useSelector } from "react-redux";

const Customer = () => {
  const { invoiceData } = useSelector((state) => state.invoice);
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Customer Details
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.No.</TableCell>
              <TableCell>Invoice ID</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Phone No.</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoiceData && invoiceData.length > 0 ? (
              invoiceData.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{product?.invoice_id || "N/A"}</TableCell>
                  <TableCell>{product?.customer_name || "N/A"}</TableCell>
                  <TableCell>{product?.phone_number || "N/A"}</TableCell>
                  <TableCell>{product?.total_amount || "N/A"}</TableCell>
                  <TableCell>{product?.address || "N/A"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell>No data related to the product is present</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Customer;

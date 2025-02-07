import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useSelector } from "react-redux";

const Product = () => {
  const { invoiceData } = useSelector((state) => state.invoice);
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.No.</TableCell>
              <TableCell>Invoice ID</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Total Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoiceData && invoiceData.length > 0 ? (
              invoiceData.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{product?.invoice_id || "N/A"}</TableCell>
                  <TableCell>{product?.product_name || "N/A"}</TableCell>
                  <TableCell>{product?.qty || "N/A"}</TableCell>
                  <TableCell>{product?.unit_price || "N/A"}</TableCell>
                  <TableCell>{product?.total_amount || "N/A"}</TableCell>
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

export default Product;

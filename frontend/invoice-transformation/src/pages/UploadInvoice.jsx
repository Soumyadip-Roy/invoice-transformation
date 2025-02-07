import { useState } from "react";
import {
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";

import { useForm, Controller } from "react-hook-form";
import UploadFile from "../component/uploadFile";
import { uploadInvoice } from "../services/operations/uploadDocument";
import { useDispatch } from "react-redux";
import { addInvoiceData, setLoading } from "../redux/slices/invoiceSlice";

const UploadInvoice = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      files: [],
    },
  });

  const [uploadMessage, setUploadMessage] = useState({ type: "", text: "" });
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    if (data.invoices.length === 0) {
      setUploadMessage({
        type: "error",
        text: "Please select at least one file to upload.",
      });
      return;
    }

    const formData = new FormData();
    data.invoices.forEach((file) => {
      formData.append("invoices", file);
    });

    try {
      dispatch(setLoading(true));
      const response = await uploadInvoice(formData);
      console.log("response", response);
      dispatch(addInvoiceData(response));
      dispatch(setLoading(false));

      setUploadMessage({
        type: "success",
        text: "Invoices uploaded successfully!",
      });
      reset();
    } catch (error) {
      console.error("Upload Error:", error);
      setUploadMessage({ type: "error", text: "Failed to upload invoices." });
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Upload Invoices
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="invoices"
          control={control}
          rules={{
            validate: (files) =>
              files.length > 0 || "At least one file is required.",
          }}
          render={({ field: { onChange, value } }) => (
            <UploadFile onChange={onChange} value={value} />
          )}
        />

        {errors.invoices && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errors.files.message}
          </Alert>
        )}

        {uploadMessage.text && (
          <Alert severity={uploadMessage.type} sx={{ mt: 2 }}>
            {uploadMessage.text}
          </Alert>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={24} /> : "Upload Invoices"}
        </Button>
      </form>
    </Box>
  );
};

export default UploadInvoice;

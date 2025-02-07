import { apiConnector } from "../apiConnector";
import { uploadDocumentEndpoint } from "../apis";

const { UPLOAD_INVOICE } = uploadDocumentEndpoint;

export const uploadInvoice = async (data) => {
  let result = null;
  try {
    const response = await apiConnector("POST", UPLOAD_INVOICE, data, {
      "Content-Type": "multipart/form-data",
    });

    if (response?.data?.status !== "success") {
      throw new Error(
        response?.data?.message ||
          "Unable to fetch information from the invoice"
      );
    }

    result = response.data.results.map((item) => item?.data || {});
    return result;
  } catch (error) {
    console.error("Failed to upload invoice:", error);
  }
};

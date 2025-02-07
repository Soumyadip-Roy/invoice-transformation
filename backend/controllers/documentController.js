const axios = require("axios");
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");
const FormData = require("form-data");

exports.processDocuments = async (uploadedFiles, res) => {
  console.log("Processing multiple documents in Node.js");

  if (!uploadedFiles || uploadedFiles.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  try {
    const results = [];

    for (const file of uploadedFiles) {
      if (!file.path || !file.originalname) {
        results.push({
          fileName: file.originalname || "unknown",
          error: "File path or name is missing",
        });
        continue;
      }

      const filePath = file.path;
      const fileExtension = path.extname(file.originalname).toLowerCase();
      const fileType = mime.lookup(fileExtension) || "unknown";

      console.log("Processing file:", filePath);
      console.log("File Type:", fileType);

      if (
        fileType === "application/pdf" ||
        fileType === "image/jpeg" ||
        fileType === "image/png" ||
        fileType === "application/vnd.ms-excel" ||
        fileType ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        try {
          const formData = new FormData();
          formData.append("file", fs.createReadStream(filePath));

          const response = await axios.post(
            "http://127.0.0.1:8000/process-invoice",
            formData,
            {
              headers: formData.getHeaders(),
            }
          );

          console.log("Backend Response", response.data.data);
          results.push({
            data: response.data.data,
          });
        } catch (error) {
          console.error(`Error processing file ${file.originalname}:`, error);
          results.push({
            fileName: file.originalname,
            type: fileType,
            error: "Failed to process with FastAPI",
          });
        }
      } else {
        results.push({
          fileName: file.originalname,
          type: fileType,
          error: "Unsupported file type",
        });
      }
    }

    uploadedFiles.forEach((file) => {
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });

    return res.status(200).json({ status: "success", results });
  } catch (error) {
    console.error("Error processing files:", error);
    return res
      .status(500)
      .json({ message: "Error processing files", error: error.message });
  }
};

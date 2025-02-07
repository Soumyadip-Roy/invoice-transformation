import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import PropTypes from "prop-types";

const MAX_SIZE = 10 * 1024 * 1024;

const UploadFile = ({ onChange, value }) => {
  const [files, setFiles] = useState(value || []);

  const onDrop = (acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach((file) => {
        file.errors.forEach((err) => {
          alert(`Error uploading ${file.file.name}: ${err.message}`);
        });
      });
    }

    const mappedAccepted = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );

    const updatedFiles = [...files, ...mappedAccepted];
    setFiles(updatedFiles);
    onChange(updatedFiles.map((file) => file));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".jpeg", ".jpg", ".png"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    maxSize: MAX_SIZE,
    multiple: true,
  });

  const handleRemoveFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    onChange(newFiles.map((file) => file));
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${
          isDragActive ? "bg-gray-100" : "bg-gray-50"
        }`}
      >
        <input {...getInputProps()} />
        <FiUploadCloud size={50} className="text-blue-600 mx-auto" />
        <h3 className="mt-4 text-lg font-medium">
          {isDragActive
            ? "Drop the files here..."
            : "Drag and drop PDFs, Images, or Excel files here, or click to select files"}
        </h3>
        <p className="text-sm text-gray-500 mt-2">
          Supported formats: PDF, JPEG, PNG, XLS, XLSX. Max size per file: 10MB.
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Selected Files</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {files.map((file, index) => (
              <div
                key={file.preview}
                className="relative border rounded-lg p-2 bg-white shadow-md"
              >
                {file.type === "application/pdf" ? (
                  <div className="flex items-center justify-center h-24 bg-gray-100">
                    <p className="text-sm text-gray-700">PDF File</p>
                  </div>
                ) : file.type.startsWith("image/") ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-full h-24 object-cover rounded-md"
                  />
                ) : file.type ===
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                  file.type === "application/vnd.ms-excel" ? (
                  <div className="flex items-center justify-center h-24 bg-gray-100">
                    <p className="text-sm text-gray-700">Excel File</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-24 bg-gray-100">
                    <p className="text-sm text-gray-700">Unknown File</p>
                  </div>
                )}

                <button
                  onClick={() => handleRemoveFile(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <AiOutlineClose size={16} />
                </button>

                {/* File Name */}
                <p className="mt-2 text-sm text-gray-600 truncate">
                  {file.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Props validation using PropTypes
UploadFile.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      preview: PropTypes.string,
    })
  ),
};

export default UploadFile;

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BulkUploadWorkers = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select an Excel file");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/worker/uploadbulkdata`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success(res.data.msg);
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-md mt-6">
      <h2 className="text-xl font-bold mb-4">Bulk Upload Workers (Excel)</h2>
      <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-800"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default BulkUploadWorkers;

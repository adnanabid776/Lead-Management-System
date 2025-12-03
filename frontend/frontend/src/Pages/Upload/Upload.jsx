

import React, { useState } from "react";
// import api from "../../api/axios";
import { uploadLeadsCsv } from "../../api/leads";
import { toast } from "react-toastify";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a CSV file!");

    setLoading(true);

    try {
      const res = await uploadLeadsCsv(file);
      toast(res.data.message);
      setResult(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    }

    setLoading(false);
  };

  return (
    <div className="upload-page p-6">
      <h2 className="text-2xl font-semibold mb-4">Upload CSV Leads</h2>

      <div
        className={`upload-area ${
          dragActive ? "opacity-90" : ""
        } border-2 border-dashed rounded-xl transition-all duration-200
       bg-[#0473EA]  text-white 
        text-center cursor-pointer h-56 flex flex-col items-center justify-center`}
        onDrop={handleDrop}
        onDragOver={handleDrag}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onClick={() => document.getElementById("fileInput").click()}
      >
        {file ? (
          <strong className="text-lg">{file.name}</strong>
        ) : (
          <>
            <p className="text-lg font-medium">Drag & Drop CSV file here</p>
            <p className="text-sm mt-1 opacity-80">or click to choose file</p>
          </>
        )}

        <input
          id="fileInput"
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className={`mt-6 px-6 py-3 rounded-lg text-white font-semibold 
        ${
          !file || loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#0473EA] hover:opacity-90 transition-opacity"
        }
      `}
      >
        {loading ? "Uploading..." : "Upload CSV"}
      </button>

      {result && (
        <div className="mt-6 bg-white shadow p-4 rounded-lg w-60">
          <h3 className="text-xl font-semibold">Upload Summary</h3>
          <p>Total Rows: {result.totalRows}</p>
          <p>Inserted: {result.insertedCount}</p>
          <p>Skipped: {result.skippedCount}</p>
        </div>
      )}
    </div>
  );
};

export default Upload;

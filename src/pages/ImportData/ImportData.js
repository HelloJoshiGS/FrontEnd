// src/pages/ImportData/ImportData.js
import React, { useState } from 'react';
import axios from '../../services/api';
import './ImportData.css';
import { toast } from 'react-toastify';

const ImportData = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf'];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error('Only PNG, JPG, and PDF files are allowed.');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB.');
      return;
    }

    setFile(selectedFile);

    if (selectedFile.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return toast.warning('Please select a file to upload.');

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        },
      });

      toast.success('File uploaded successfully!');
      setUploadedFiles(prev => [...prev, file.name]);
      setFile(null);
      setPreviewUrl(null);
      setProgress(0);
    } catch (error) {
      toast.error('Upload failed.');
      setProgress(0);
    }
  };

  return (
    <div className="import-data">
      <h2>Import Data</h2>

      <div className="upload-box">
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
        />

        {previewUrl && (
          <div className="preview">
            <img src={previewUrl} alt="Preview" />
          </div>
        )}

        {file && !previewUrl && (
          <p className="pdf-name">Selected PDF: {file.name}</p>
        )}

        {progress > 0 && (
          <div className="progress-bar">
            <div className="progress-bar-inner" style={{ width: `${progress}%` }}></div>
          </div>
        )}

        <button onClick={handleUpload}>Upload</button>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="uploaded-files">
          <h4>Uploaded Files:</h4>
          <ul>
            {uploadedFiles.map((fileName, index) => (
              <li key={index}>{fileName}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImportData;

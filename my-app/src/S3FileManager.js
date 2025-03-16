"use client"

import React, { useState } from "react"
import axios from "axios"
import { Upload, Download, FileText, Database } from "lucide-react"
import "./S3FileManager.css"

export default function S3FileManager() {
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState("")
  const [bucketName, setBucketName] = useState("cloudfilesync-bucket1")
  const [downloadedFile, setDownloadedFile] = useState(null)
  const [uploadStatus, setUploadStatus] = useState("")
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [metadata, setMetadata] = useState(null)

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setUploadStatus("")
    }
  }

  const uploadFile = async () => {
    if (!file) {
      setUploadStatus("❌ Please select a file")
      return
    }

    setLoading(true)
    setUploadStatus("Uploading...")
    setProgress(10)

    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentLoaded = Math.round((event.loaded / event.total) * 50)
        setProgress(percentLoaded)
      }
    }

    reader.onload = async () => {
      setProgress(60)
      const base64Data = reader.result?.toString().split(",")[1]

      try {
        setProgress(75)
        const response = await axios.post("https://cxsejhlo2j.execute-api.ap-south-1.amazonaws.com/upload", {
          bucket: bucketName,
          file: file.name,
          file_data: base64Data,
          content_type: file.type,
          metadata: {
            uploaded_by: "user123",
            upload_timestamp: new Date().toISOString(),
            description: "Uploaded via S3FileManager",
          },
        })
        console.log("Upload Response:", response)
        setProgress(100)
        setUploadStatus("✅ File uploaded successfully!")
      } catch (error) {
        console.error("Upload failed", error)
        setProgress(0)
        setUploadStatus("❌ Upload failed. Please try again.")
      } finally {
        setLoading(false)
        setTimeout(() => setProgress(0), 1000)
      }
    }
  }

  const fetchFile = async () => {
    if (!fileName) {
      setUploadStatus("❌ Enter a file name")
      return
    }

    setLoading(true)
    setDownloadedFile(null)
    setMetadata(null)
    setProgress(30)

    try {
      const response = await axios.get(
        `https://cxsejhlo2j.execute-api.ap-south-1.amazonaws.com/fetch?bucket=${bucketName}&file=${fileName}`
      )
      setProgress(80)
      const { content, is_base64, metadata } = response.data

      if (is_base64) {
        setDownloadedFile(atob(content))
      } else {
        setDownloadedFile(content)
      }
      setMetadata(metadata)
      setProgress(100)
    } catch (error) {
      console.error("Fetch failed", error)
      setUploadStatus("❌ Failed to fetch file. Please check the file name and try again.")
    } finally {
      setLoading(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <Database className="icon" />
          <h2>S3 File Manager</h2>
          <p>Upload and retrieve files from your S3 bucket</p>
        </div>

        <div className="card-body">
          <div className="input-group">
            <label htmlFor="bucket">Bucket Name</label>
            <input type="text" id="bucket" value={bucketName} onChange={(e) => setBucketName(e.target.value)} />
          </div>

          <div className="upload-section">
            <label htmlFor="file">Select File</label>
            <input type="file" id="file" onChange={handleFileChange} />
            {file && <p>Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)</p>}
            <button onClick={uploadFile} disabled={loading}>
              <Upload className="icon" />
              {loading ? "Uploading..." : "Upload File"}
            </button>
          </div>

          <div className="download-section">
            <label htmlFor="fileName">File Name</label>
            <input type="text" id="fileName" value={fileName} onChange={(e) => setFileName(e.target.value)} />
            <button onClick={fetchFile} disabled={loading}>
              <Download className="icon" />
              {loading ? "Fetching..." : "Fetch File"}
            </button>
          </div>

          {progress > 0 && <div className="progress-bar" style={{ width: `${progress}%` }}></div>}

          {uploadStatus && <p className={`status ${uploadStatus.includes("❌") ? "error" : "success"}`}>{uploadStatus}</p>}
        </div>

        {downloadedFile && (
          <div className="card-footer">
            <FileText className="icon" />
            <h3>File Content</h3>
            <pre>{downloadedFile}</pre>
            {metadata && (
              <div className="metadata">
                <h4>Metadata</h4>
                <p><strong>Uploaded By:</strong> {metadata.uploaded_by}</p>
                <p><strong>Upload Timestamp:</strong> {metadata.upload_timestamp}</p>
                <p><strong>Description:</strong> {metadata.description}</p>
                <p><strong>Content Type:</strong> {metadata.content_type}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

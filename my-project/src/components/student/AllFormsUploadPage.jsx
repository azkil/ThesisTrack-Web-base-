import React, { useState } from "react";
import axios from "axios";
import { Download, Eye, Upload } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  Field,
  PageHeader,
  Select,
} from "../ui";

const forms = [
  { id: "form2a", name: "Form 2A - Title/Program/Group Members [IT 198]" },
  { id: "form2b198", name: "Form 2B - Defense Schedule Proposal [IT 198]" },
  { id: "form2d198", name: "Form 2D - Panel Member Statement Proposal [IT 198]" },
  { id: "form2e198", name: "Form 2E - Capstone Examination Proposal [IT 198]" },
  { id: "form2f198", name: "Form 2F - Panel Review & Comments Proposal [IT 198]" },
  { id: "form2g198", name: "Form 2G - Evaluation Rubric Proposal [IT 198]" },
  { id: "form2h198", name: "Form 2H - Panel Final Rating Proposal [IT 198]" },
  { id: "form2i198", name: "Form 2I - Documentation Proposal [IT 198]" },

  { id: "form2c", name: "Form 2C - Adviser Change Request" },
  { id: "form2b199", name: "Form 2B - Defense Schedule Final [IT 199]" },
  { id: "form2d199", name: "Form 2D - Panel Member Statement Final [IT 199]" },
  { id: "form2e199", name: "Form 2E - Capstone Examination Final [IT 199]" },
  { id: "form2f199", name: "Form 2F - Panel Review & Comments Final [IT 199]" },
  { id: "form2g199", name: "Form 2G - Evaluation Rubric Final [IT 199]" },
  { id: "form2h199", name: "Form 2H - Panel Final Rating Final [IT 199]" },
  { id: "form2i199", name: "Form 2I - Documentation Final [IT 199]" },
  { id: "form2j", name: "Form 2J - Plagiarism Report" },
  { id: "form2k", name: "Form 2K - Final Submission" },
  { id: "manuscript", name: "Manuscript" },
  { id: "other_pdf", name: "Other PDF" },
];

export default function FormsUpload() {
  const studentId = localStorage.getItem("student_id");
  const [formType, setFormType] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadedPath, setUploadedPath] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreview(selected && selected.type === "application/pdf" ? URL.createObjectURL(selected) : null);
  };

  const handleUpload = async () => {
    if (!formType || !file) return alert("Please select a form and PDF file.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("student_id", studentId);
    formData.append("type", formType);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3001/api/forms-pdf/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setUploadedPath(res.data.path);
      alert("File uploaded successfully.");
      setFile(null);
      setPreview(null);
      setFormType("");
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const uploadedUrl = uploadedPath ? `http://localhost:3001/${uploadedPath}` : "";

  return (
    <div className="space-y-4 p-3 sm:p-4 lg:p-6">
      <PageHeader
        title="Upload Thesis Forms"
        description="Upload signed PDF files for each thesis form requirement."
      />

      <Card className="mx-auto max-w-3xl">
        <CardContent className="space-y-4 p-4 sm:p-6">
          <Field label="Select Form">
            <Select value={formType} onChange={(e) => setFormType(e.target.value)}>
              <option value="">Choose form</option>
              {forms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="PDF File">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full p-2"
            />
          </Field>

          <Button onClick={handleUpload} disabled={loading} className="w-full">
            <Upload className="h-4 w-4" />
            {loading ? "Uploading..." : "Upload File"}
          </Button>

          {preview && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Preview before upload</h3>
              <iframe
                src={preview}
                title="preview"
                className="h-72 w-full rounded-md border border-border"
              />
            </div>
          )}

          {uploadedPath && (
            <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-muted/40 p-3 text-sm">
              <span className="font-medium">Uploaded file</span>
              <Button variant="outline" size="sm" asChild>
                <a href={uploadedUrl} target="_blank" rel="noreferrer">
                  <Eye className="h-4 w-4" />
                  View
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={uploadedUrl} download>
                  <Download className="h-4 w-4" />
                  Download
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

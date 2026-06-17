import React, { useState, useEffect } from "react";
import axios from "axios";

export default function MyForm2D() {
  const API_BASE = "http://localhost:3001/api/form2d";
  const studentId = localStorage.getItem("student_id"); // ⬅️ UPDATED

  const [formData, setFormData] = useState({
    document_type: "",
    date: "",
    dean_name: "",
    department: "",
    panel_member_statement: "",
    panel_member_signature: "",
    oral_exam_panel: "",
    noted_by: "",
    department_chair: "",
    recommending_approval: "",
    approved_by: "",
    file_path: "",
  });

  const [formId, setFormId] = useState(null);
  const [thesisId, setThesisId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [facultyList, setFacultyList] = useState([]);

  // 🟩 Fetch faculty list for dropdowns
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/faculty")
      .then((res) => setFacultyList(res.data))
      .catch((err) => console.error("Error fetching faculty:", err));
  }, []);

  // 🟩 Auto-fetch thesis + Form2D
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get student's thesis
        const thesisRes = await axios.get(
          `http://localhost:3001/api/theses/student/${studentId}` // ⬅️ UPDATED
        );

        if (thesisRes.data?.length) {
          setThesisId(thesisRes.data[0].thesis_id);
        }

        // Check existing Form2D
        const formRes = await axios.get(
          `${API_BASE}/student/${studentId}` // ⬅️ UPDATED
        );

        if (formRes.data) {
          setFormId(formRes.data.id);
          setFormData(formRes.data);
        }
      } catch (err) {
        console.error("Error loading Form2D:", err);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) fetchData();
  }, [studentId]);

  // 🟩 Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🟩 File Upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const upload = new FormData();
    upload.append("file", file);

    try {
      const res = await axios.post("http://localhost:3001/api/upload", upload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFormData((prev) => ({ ...prev, file_path: res.data.filePath }));
      alert("📄 PDF Uploaded Successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to upload PDF.");
    }
  };

  // 🟩 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!thesisId) return alert("Thesis not found!");

    const payload = {
      ...formData,
      student_id: studentId, // ⬅️ UPDATED
      thesis_id: thesisId,
    };

    try {
      if (formId) {
        await axios.put(`${API_BASE}/${formId}`, payload);
        alert("✅ Form 2D Updated Successfully!");
      } else {
        const res = await axios.post(API_BASE, payload);
        setFormId(res.data.id);
        alert("📝 Form 2D Submitted Successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting Form 2D.");
    }
  };

  if (loading) return <p className="p-3 sm:p-4 lg:p-6">Loading...</p>;

  return (
    <div className="mx-auto mt-4 max-w-5xl rounded-2xl bg-white p-3 shadow-lg sm:p-4 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        📝 Form 2D – Panel Evaluation / Approval
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Document Type + Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Document Type</label>
            <input
              type="text"
              name="document_type"
              value={formData.document_type}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>
        </div>

        {/* Department + Dean */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Dean Name</label>
            <select
              name="dean_name"
              value={formData.dean_name}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            >
              <option value="">-- Select Dean --</option>
              {facultyList.map((f) => (
                <option key={f.faculty_id} value={f.full_name}>
                  {f.full_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Panel Member Statement */}
        <div>
          <label className="block text-sm font-semibold mb-1">Panel Member Statement</label>
          <textarea
            name="panel_member_statement"
            value={formData.panel_member_statement}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Panel Signature + Oral Exam Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Panel Member Signature</label>
            <input
              type="text"
              name="panel_member_signature"
              value={formData.panel_member_signature}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Oral Exam Panel</label>
            <input
              type="text"
              name="oral_exam_panel"
              value={formData.oral_exam_panel}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>
        </div>

        {/* Faculty Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "noted_by",
            "department_chair",
            "recommending_approval",
            "approved_by",
          ].map((field) => (
            <div key={field}>
              <label className="block text-sm font-semibold mb-1">
                {field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </label>
              <select
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              >
                <option value="">-- Select Faculty --</option>
                {facultyList.map((f) => (
                  <option key={f.faculty_id} value={f.full_name}>
                    {f.full_name}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-semibold mb-1">Upload PDF</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileUpload}
            className="border w-full rounded-lg p-2"
          />

          {formData.file_path && (
            <p className="text-sm text-green-600 mt-1">
              Uploaded:{" "}
              <a href={formData.file_path} target="_blank" rel="noreferrer" className="underline">
                {formData.file_path}
              </a>
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2 rounded-lg shadow-md"
          >
            {formId ? "💾 Update Form 2D" : "📝 Submit Form 2D"}
          </button>
        </div>
      </form>
    </div>
  );
}

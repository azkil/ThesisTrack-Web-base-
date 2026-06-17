import React, { useState, useEffect } from "react";
import axios from "axios";

export default function MyForm2G() {
  const API_BASE = "http://localhost:3001/api/form2g";
  const studentId = localStorage.getItem("student_id");

  const [formId, setFormId] = useState(null);
  const [formData, setFormData] = useState({
    exam_type: "",
    name_of_student: "",
    capstone_thesis_title: "",
    date: "",
    paper_content_rating: "",
    paper_content_weight: "",
    mastery_subject_rating: "",
    mastery_subject_weight: "",
    presentation_rating: "",
    presentation_weight: "",
    receptiveness_rating: "",
    receptiveness_weight: "",
    final_rating: "",
    description: "",
    rated_by: "",
    file_path: ""
  });

  /* ================= Fetch existing Form 2G by student ================= */
  useEffect(() => {
    if (!studentId) return;

    const fetchForm2G = async () => {
      try {
        const res = await axios.get(`${API_BASE}/student/${studentId}`);
        const form = Array.isArray(res.data) ? res.data[0] : res.data;

        if (form) {
          setFormId(form.id);
          setFormData({
            exam_type: form.exam_type || "",
            name_of_student: form.name_of_student || "",
            capstone_thesis_title: form.capstone_thesis_title || "",
            date: form.date ? form.date.split("T")[0] : "",
            paper_content_rating: form.paper_content_rating || "",
            paper_content_weight: form.paper_content_weight || "",
            mastery_subject_rating: form.mastery_subject_rating || "",
            mastery_subject_weight: form.mastery_subject_weight || "",
            presentation_rating: form.presentation_rating || "",
            presentation_weight: form.presentation_weight || "",
            receptiveness_rating: form.receptiveness_rating || "",
            receptiveness_weight: form.receptiveness_weight || "",
            final_rating: form.final_rating || "",
            description: form.description || "",
            rated_by: form.rated_by || "",
            file_path: form.file_path || ""
          });
        }
      } catch (err) {
        console.error("❌ Error fetching Form 2G:", err);
      }
    };

    fetchForm2G();
  }, [studentId]);

  /* ================= Handle input changes ================= */
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /* ================= Handle file upload ================= */
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fakePath = `/uploads/${file.name}`;
      setFormData((prev) => ({ ...prev, file_path: fakePath }));
    }
  };

  /* ================= Submit or update Form 2G ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId) return alert("⚠️ Student not logged in.");

    const payload = { ...formData, student_id: parseInt(studentId) };

    try {
      if (formId) {
        await axios.put(`${API_BASE}/${formId}`, payload);
        alert("✅ Form 2G updated successfully!");
      } else {
        const res = await axios.post(API_BASE, payload);
        setFormId(res.data.id);
        alert("📝 Form 2G submitted successfully!");
      }
    } catch (err) {
      console.error("❌ Error saving Form 2G:", err);
      alert("Failed to save Form 2G. Please check your inputs.");
    }
  };

  /* ================= UI ================= */
  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-4 max-w-4xl space-y-6 rounded-lg border p-3 shadow sm:p-4 lg:p-6">
      <h2 className="text-2xl font-bold text-center">Form 2G – Evaluation Form</h2>

      {/* ================= BASIC INFO ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-semibold">Exam Type</label>
          <input type="text" name="exam_type" value={formData.exam_type} onChange={handleChange} className="border rounded px-4 py-2 w-full" />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Date</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} className="border rounded px-4 py-2 w-full" />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Name of Student</label>
          <input type="text" name="name_of_student" value={formData.name_of_student} onChange={handleChange} className="border rounded px-4 py-2 w-full" />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Capstone Thesis Title</label>
          <input type="text" name="capstone_thesis_title" value={formData.capstone_thesis_title} onChange={handleChange} className="border rounded px-4 py-2 w-full" />
        </div>
      </div>

      {/* ================= RATINGS ================= */}
      <div className="border rounded p-4 bg-gray-50">
        <h3 className="font-semibold mb-2">Evaluation Ratings</h3>

        {["paper_content", "mastery_subject", "presentation", "receptiveness"].map((field) => (
          <div key={field} className="mb-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block mb-1">{field.replace("_", " ").toUpperCase()} Rating</label>
              <input type="number" name={`${field}_rating`} value={formData[`${field}_rating`]} onChange={handleChange} className="border rounded px-4 py-2 w-full" />
            </div>
            <div>
              <label className="block mb-1">Weight</label>
              <input type="number" step="0.01" name={`${field}_weight`} value={formData[`${field}_weight`]} onChange={handleChange} className="border rounded px-4 py-2 w-full" />
            </div>
          </div>
        ))}

        <div>
          <label className="block mb-1">Final Rating</label>
          <input type="number" step="0.01" name="final_rating" value={formData.final_rating} onChange={handleChange} className="border rounded px-4 py-2 w-full" />
        </div>
      </div>

      {/* ================= DESCRIPTION & RATER ================= */}
      <div>
        <label className="block mb-1 font-semibold">Description</label>
        <input type="text" name="description" value={formData.description} onChange={handleChange} className="border rounded px-4 py-2 w-full" />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Rated By</label>
        <input type="text" name="rated_by" value={formData.rated_by} onChange={handleChange} className="border rounded px-4 py-2 w-full" />
      </div>

      {/* ================= FILE UPLOAD ================= */}
      <div>
        <label className="block mb-1 font-semibold">Upload PDF</label>
        <input type="file" accept="application/pdf" onChange={handleFileUpload} className="border rounded px-4 py-2 w-full" />
        {formData.file_path && (
          <p className="text-sm text-green-600 mt-2">
            Uploaded: <a href={formData.file_path} target="_blank" rel="noreferrer" className="underline">{formData.file_path}</a>
          </p>
        )}
      </div>

      {/* ================= SUBMIT ================= */}
      <div className="text-center">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2 rounded-lg shadow-md">
          {formId ? "💾 Update Form 2G" : "📝 Submit Form 2G"}
        </button>
      </div>
    </form>
  );
}

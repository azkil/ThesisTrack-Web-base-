import React, { useState, useEffect } from "react";
import axios from "axios";

export default function MyForm2F() {
  const [formData, setFormData] = useState({
    exam_type: "",
    capstone_thesis_title: "",
    proponents: "",
    department: "",
    defense_date: "",
    adviser: "",
    panel_member_1: "",
    panel_member_2: "",
    chair_of_panel: "",
    comment_1: "",
    previous_draft_comment_1: "",
    revision_made_1: "",
    page_reflected_1: "",
    comment_2: "",
    previous_draft_comment_2: "",
    revision_made_2: "",
    page_reflected_2: "",
    comment_3: "",
    previous_draft_comment_3: "",
    revision_made_3: "",
    page_reflected_3: "",
    reviewed_by: "",
    approved_by: "",
    file_path: ""
  });

  const [formId, setFormId] = useState(null);
  const [thesisId, setThesisId] = useState(null);
  const [loading, setLoading] = useState(true);

  const studentId = localStorage.getItem("student_id");

  // 🟦 Fetch thesis + existing Form 2F
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch thesis of the student
        const thesisRes = await axios.get(
          `http://localhost:3001/api/theses/student/${studentId}`
        );

        if (thesisRes.data.length > 0) {
          const thesis = thesisRes.data[0];
          setThesisId(thesis.thesis_id);

          // Autofill
          setFormData((prev) => ({
            ...prev,
            capstone_thesis_title: thesis.title,
            proponents: thesis.student_names || "",
            department: thesis.department || "",
          }));
        }

        // Check if form already exists
        const existing = await axios.get(
          `http://localhost:3001/api/form2f/student/${studentId}`
        );

        if (existing.data) {
          setFormId(existing.data.id);
          setFormData(existing.data);
        }
      } catch (err) {
        console.error("Error loading Form 2F:", err);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) loadData();
  }, [studentId]);

  // 🟦 Input Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🟦 PDF Upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const upload = new FormData();
    upload.append("file", file);

    try {
      const res = await axios.post("http://localhost:3001/api/upload", upload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFormData((prev) => ({
        ...prev,
        file_path: res.data.filePath,
      }));

      alert("PDF uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to upload PDF.");
    }
  };

  // 🟦 Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      student_id: studentId,
      thesis_id: thesisId
    };

    try {
      if (formId) {
        await axios.put(`http://localhost:3001/api/form2f/${formId}`, payload);
        alert("Form 2F updated successfully!");
      } else {
        const res = await axios.post("http://localhost:3001/api/form2f", payload);
        setFormId(res.data.id);
        alert("Form 2F submitted successfully!");
      }
    } catch (err) {
      console.error("Error submitting Form 2F:", err);
      alert("Failed to submit Form 2F.");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">
        {formId ? "Edit Form 2F" : "Fill Up Form 2F"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Exam Type */}
        <select
          name="exam_type"
          value={formData.exam_type}
          onChange={handleChange}
          className="border px-4 py-2 w-full rounded"
          required
        >
          <option value="">Select Exam Type</option>
          <option value="Proposal">Proposal Defense</option>
          <option value="Final">Final Defense</option>
        </select>

        {/* Auto-filled fields */}
        <input
          type="text"
          name="capstone_thesis_title"
          placeholder="Capstone Thesis Title"
          value={formData.capstone_thesis_title}
          onChange={handleChange}
          className="border px-4 py-2 w-full rounded"
          required
        />

        <input
          type="text"
          name="proponents"
          placeholder="Proponents"
          value={formData.proponents}
          onChange={handleChange}
          className="border px-4 py-2 w-full rounded"
        />

        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
          className="border px-4 py-2 w-full rounded"
        />

        <input
          type="date"
          name="defense_date"
          value={formData.defense_date}
          onChange={handleChange}
          className="border px-4 py-2 w-full rounded"
        />

        <input
          type="text"
          name="adviser"
          placeholder="Adviser"
          value={formData.adviser}
          onChange={handleChange}
          className="border px-4 py-2 w-full rounded"
        />

        {/* Panel Members */}
        <input
          type="text"
          name="panel_member_1"
          placeholder="Panel Member 1"
          value={formData.panel_member_1}
          onChange={handleChange}
          className="border px-4 py-2 w-full rounded"
        />

        <input
          type="text"
          name="panel_member_2"
          placeholder="Panel Member 2"
          value={formData.panel_member_2}
          onChange={handleChange}
          className="border px-4 py-2 w-full rounded"
        />

        <input
          type="text"
          name="chair_of_panel"
          placeholder="Chair of Panel"
          value={formData.chair_of_panel}
          onChange={handleChange}
          className="border px-4 py-2 w-full rounded"
        />

        {/* Comments + Revisions */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input
              type="text"
              name={`comment_${i}`}
              placeholder={`Comment ${i}`}
              value={formData[`comment_${i}`]}
              onChange={handleChange}
              className="border px-4 py-2 w-full rounded"
            />
            <input
              type="text"
              name={`previous_draft_comment_${i}`}
              placeholder={`Prev Draft Comment ${i}`}
              value={formData[`previous_draft_comment_${i}`]}
              onChange={handleChange}
              className="border px-4 py-2 w-full rounded"
            />
            <input
              type="text"
              name={`revision_made_${i}`}
              placeholder={`Revision Made ${i}`}
              value={formData[`revision_made_${i}`]}
              onChange={handleChange}
              className="border px-4 py-2 w-full rounded col-span-1"
            />
            <input
              type="text"
              name={`page_reflected_${i}`}
              placeholder={`Page Reflected ${i}`}
              value={formData[`page_reflected_${i}`]}
              onChange={handleChange}
              className="border px-4 py-2 w-full rounded"
            />
          </div>
        ))}

        <input
          type="text"
          name="reviewed_by"
          placeholder="Reviewed By"
          value={formData.reviewed_by}
          onChange={handleChange}
          className="border px-4 py-2 w-full rounded"
        />

        <input
          type="text"
          name="approved_by"
          placeholder="Approved By"
          value={formData.approved_by}
          onChange={handleChange}
          className="border px-4 py-2 w-full rounded"
        />

        {/* File Upload */}
        <div>
          <label className="font-semibold">Upload PDF</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileUpload}
            className="border px-4 py-2 w-full rounded"
          />
          {formData.file_path && (
            <p className="text-sm text-green-600 mt-1">
              Uploaded:{" "}
              <a
                href={formData.file_path}
                target="_blank"
                className="underline"
              >
                {formData.file_path}
              </a>
            </p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          {formId ? "Update Form 2F" : "Submit Form 2F"}
        </button>
      </form>
    </div>
  );
}

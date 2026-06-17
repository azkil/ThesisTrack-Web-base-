import React, { useState } from "react";
import axios from "axios";

export default function Form2I({ thesisId, userId }) {
  const [formData, setFormData] = useState({
    exam_type: "",
    name_of_student: "",
    capstone_thesis_title: "",
    date_of_examination: "",
    mean_rating: "",
    passed_without_modification: false,
    passed_with_suggestions: false,
    failed: false,
    failure_reasons: "",
    remarks: "",
    panel_member_1: "",
    signature_1: "",
    panel_member_2: "",
    signature_2: "",
    chairperson: "",
    signature_3: "",
    noted_by: "",
    department: "",
    file_path: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle text/checkbox changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // File Upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("user_id", userId);
    data.append("thesis_id", thesisId);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/forms/form2i/upload",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setFormData((prev) => ({
        ...prev,
        file_path: res.data.file_path,
      }));
      alert("PDF Uploaded Successfully!");
    } catch (err) {
      console.error(err);
      alert("Error uploading file.");
    } finally {
      setLoading(false);
    }
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/forms/form2i", {
        ...formData,
        user_id: userId,
        thesis_id: thesisId,
      });

      alert("Form 2I Submitted Successfully!");
    } catch (error) {
      console.error(error);
      alert("Error submitting form.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-3xl space-y-4 rounded-lg border p-3 shadow sm:p-4 lg:p-6"
    >
      <h2 className="text-xl font-bold">Form 2I — Result of Oral Defense</h2>

      {/* Exam Type */}
      <div>
        <label className="block mb-1 font-semibold">Exam Type</label>
        <input
          type="text"
          name="exam_type"
          value={formData.exam_type}
          onChange={handleChange}
          className="border px-4 py-2 w-full"
        />
      </div>

      {/* Name of Student */}
      <div>
        <label className="block mb-1 font-semibold">Name of Student</label>
        <input
          type="text"
          name="name_of_student"
          value={formData.name_of_student}
          onChange={handleChange}
          className="border px-4 py-2 w-full"
        />
      </div>

      {/* Title */}
      <div>
        <label className="block mb-1 font-semibold">
          Capstone/Thesis Title
        </label>
        <input
          type="text"
          name="capstone_thesis_title"
          value={formData.capstone_thesis_title}
          onChange={handleChange}
          className="border px-4 py-2 w-full"
        />
      </div>

      {/* Date */}
      <div>
        <label className="block mb-1 font-semibold">Date of Examination</label>
        <input
          type="date"
          name="date_of_examination"
          value={formData.date_of_examination}
          onChange={handleChange}
          className="border px-4 py-2 w-full"
        />
      </div>

      {/* Mean Rating */}
      <div>
        <label className="block mb-1 font-semibold">Mean Rating</label>
        <input
          type="number"
          step="0.01"
          name="mean_rating"
          value={formData.mean_rating}
          onChange={handleChange}
          className="border px-4 py-2 w-full"
        />
      </div>

      {/* Results */}
      <div className="space-y-2">
        <label className="font-semibold block">Results</label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="passed_without_modification"
            checked={formData.passed_without_modification}
            onChange={handleChange}
          />
          Passed without modification
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="passed_with_suggestions"
            checked={formData.passed_with_suggestions}
            onChange={handleChange}
          />
          Passed with suggestions
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="failed"
            checked={formData.failed}
            onChange={handleChange}
          />
          Failed
        </label>
      </div>

      {/* Failure Reasons */}
      <div>
        <label className="block mb-1 font-semibold">Failure Reasons</label>
        <textarea
          name="failure_reasons"
          value={formData.failure_reasons}
          onChange={handleChange}
          className="border px-4 py-2 w-full"
        />
      </div>

      {/* Remarks */}
      <div>
        <label className="block mb-1 font-semibold">Remarks</label>
        <textarea
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          className="border px-4 py-2 w-full"
        />
      </div>

      {/* Panel Member 1 */}
      <div>
        <label className="block mb-1 font-semibold">Panel Member 1</label>
        <input
          type="text"
          name="panel_member_1"
          value={formData.panel_member_1}
          onChange={handleChange}
          className="border px-4 py-2 w-full"
        />

        <label className="block mt-2 mb-1 font-semibold">Signature 1</label>
        <input
          type="text"
          name="signature_1"
          value={formData.signature_1}
          onChange={handleChange}
          className="border px-4 py-2 w-full"
        />
      </div>

      {/* Panel Member 2 */}
      <div>
        <label className="block mb-1 font-semibold">Panel Member 2</label>
        <input
          type="text"
          name="panel_member_2"
          value={formData.panel_member_2}
          onChange={handleChange}
          className="border px-4 py-2 w-full"
        />

        <label className="block mt-2 mb-1 font-semibold">Signature 2</label>
        <input
          type="text"
          name="signature_2"
          value={formData.signature_2}
          onChange={handleChange}
          className="border px-4 py-2 w-full"
        />
      </div>

      {/* Chairperson */}
      <div>
        <label className="block mb-1 font-semibold">Chairperson</label>
        <input
          type="text"
          name="chairperson"
          value={formData.chairperson}
          onChange={handleChange}
          className="border px-4 py-2 w-full"
        />

        <label className="block mt-2 mb-1 font-semibold">Signature</label>
        <input
          type="text"
          name="signature_3"
          value={formData.signature_3}
          onChange={handleChange}
          className="border px-4 py-2 w-full"
        />
      </div>

      {/* Noted by */}
      <div>
        <label className="block mb-1 font-semibold">Noted by</label>
        <input
          type="text"
          name="noted_by"
          value={formData.noted_by}
          onChange={handleChange}
          className="border px-4 py-2 w-full"
        />
      </div>

      {/* Department */}
      <div>
        <label className="block mb-1 font-semibold">Department</label>
        <input
          type="text"
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="border px-4 py-2 w-full"
        />
      </div>

      {/* File Upload */}
      <div>
        <label className="block mb-1 font-semibold">Upload PDF</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileUpload}
          className="border px-4 py-2 w-full"
        />
        {formData.file_path && (
          <p className="text-sm text-green-600 mt-2 underline">
            {formData.file_path}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}

import React, { useState } from "react";

export default function Form2J() {
  const [formData, setFormData] = useState({
    name_of_student: "",
    capstone_thesis_title: "",
    date_of_final_defense: "",
    adviser: "",
    chair_of_panel: "",
    signature_chair: "",
    panel_member_1: "",
    signature_1: "",
    panel_member_2: "",
    signature_2: "",
    oral_exam_secretary: "",
    signature_secretary: "",
    recommending_approval: "",
    recommending_dept: "",
    approved_by: "",
  });

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form 2J Data:", formData);
    console.log("Uploaded File:", file);
    alert("Form 2J submitted successfully!");
  };

  return (
    <div className="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-3 shadow-md sm:p-4 lg:p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        FORM 2J – FINAL DEFENSE APPROVAL FORM
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ============================
            SECTION: STUDENT DETAILS
        ============================ */}
        <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
          Student Information
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Name of Student</label>
            <input
              type="text"
              name="name_of_student"
              value={formData.name_of_student}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Date of Final Defense</label>
            <input
              type="date"
              name="date_of_final_defense"
              value={formData.date_of_final_defense}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Capstone / Thesis Title</label>
          <input
            type="text"
            name="capstone_thesis_title"
            value={formData.capstone_thesis_title}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        {/* ============================
            SECTION: PANEL MEMBERS
        ============================ */}
        <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
          Panel Composition
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Adviser */}
          <div>
            <label className="block text-sm font-medium">Adviser</label>
            <input
              type="text"
              name="adviser"
              value={formData.adviser}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Chair */}
          <div>
            <label className="block text-sm font-medium">Chair of Panel</label>
            <input
              type="text"
              name="chair_of_panel"
              value={formData.chair_of_panel}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Signature (Chair)</label>
            <input
              type="text"
              name="signature_chair"
              value={formData.signature_chair}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Member 1 */}
          <div>
            <label className="block text-sm font-medium">Panel Member 1</label>
            <input
              type="text"
              name="panel_member_1"
              value={formData.panel_member_1}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Signature 1</label>
            <input
              type="text"
              name="signature_1"
              value={formData.signature_1}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Member 2 */}
          <div>
            <label className="block text-sm font-medium">Panel Member 2</label>
            <input
              type="text"
              name="panel_member_2"
              value={formData.panel_member_2}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Signature 2</label>
            <input
              type="text"
              name="signature_2"
              value={formData.signature_2}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>

        {/* ============================
            SECTION: SECRETARY + APPROVAL
        ============================ */}
        <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
          Secretary & Approval
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Oral Exam Secretary</label>
            <input
              type="text"
              name="oral_exam_secretary"
              value={formData.oral_exam_secretary}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Signature (Secretary)</label>
            <input
              type="text"
              name="signature_secretary"
              value={formData.signature_secretary}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Recommending Approval</label>
          <input
            type="text"
            name="recommending_approval"
            value={formData.recommending_approval}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Recommending Department</label>
          <input
            type="text"
            name="recommending_dept"
            value={formData.recommending_dept}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Approved By</label>
          <input
            type="text"
            name="approved_by"
            value={formData.approved_by}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* ============================
            FILE UPLOAD
        ============================ */}
        <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
          File Upload
        </h2>

        <div>
          <label className="block text-sm font-medium mb-1">Upload Signed PDF</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="block w-full"
          />
        </div>

        {/* ============================
            SUBMIT BUTTON
        ============================ */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
        >
          Submit Form 2J
        </button>
      </form>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import axios from "axios";

export default function MyForm2E() {
  const [formData, setFormData] = useState({
    exam_type: "",
    capstone_thesis_title: "",
    proponents: "",
    department: "",
    defense_date: "",
    adviser: "",
    comment_1: "",
    page_reflected_1: "",
    comment_2: "",
    page_reflected_2: "",
    comment_3: "",
    page_reflected_3: "",
    prepared_by: "",
    conformed_by: "",
    file_path: "",
  });

  const [formId, setFormId] = useState(null);
  const [thesisId, setThesisId] = useState(null);
  const studentId = localStorage.getItem("user_id"); // 🔵 now used as student_id

  // Fetch thesis details
  useEffect(() => {
    const fetchMyThesis = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/theses/student/${studentId}`
        );
        if (res.data.length > 0) {
          setThesisId(res.data[0].thesis_id);
          setFormData((prev) => ({
            ...prev,
            capstone_thesis_title: res.data[0].title,
            proponents: res.data[0].student_name || "",
          }));
        }
      } catch (err) {
        console.error("Error fetching thesis:", err);
      }
    };
    if (studentId) fetchMyThesis();
  }, [studentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:3001/api/upload",
        uploadData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setFormData((prev) => ({
        ...prev,
        file_path: res.data.filePath,
      }));

      alert("PDF uploaded successfully!");
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("Failed to upload PDF.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      student_id: studentId, // 🔵 FIXED HERE
      thesis_id: thesisId,
    };

    try {
      if (formId) {
        await axios.put(
          `http://localhost:3001/api/form2e/${formId}`,
          dataToSend
        );
        alert("Form 2E updated successfully!");
      } else {
        const res = await axios.post(
          "http://localhost:3001/api/form2e",
          dataToSend
        );
        setFormId(res.data.id);
        alert("Form 2E submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting Form 2E:", error);
      alert("Failed to submit Form 2E.");
    }
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">
        {formId ? "Edit Form 2E" : "Form 2E – Panel Comments & Corrections"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION: BASIC DETAILS */}
        <div className="border p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-lg mb-3 text-gray-700">
            Exam Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="exam_type"
              value={formData.exam_type}
              onChange={handleChange}
              className="border px-4 py-2 w-full"
              required
            >
              <option value="">Select Exam Type</option>
              <option value="Proposal">Proposal Defense</option>
              <option value="Final">Final Defense</option>
            </select>

            <input
              type="date"
              name="defense_date"
              value={formData.defense_date}
              onChange={handleChange}
              className="border px-4 py-2 w-full"
            />
          </div>

          <input
            type="text"
            name="capstone_thesis_title"
            placeholder="Capstone Thesis Title"
            value={formData.capstone_thesis_title}
            onChange={handleChange}
            className="border px-4 py-2 w-full mt-4"
          />
        </div>

        {/* SECTION: PROPONENT + DEPARTMENT */}
        <div className="border p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-lg mb-3 text-gray-700">
            Proponent Details
          </h3>

          <input
            type="text"
            name="proponents"
            placeholder="Proponents"
            value={formData.proponents}
            onChange={handleChange}
            className="border px-4 py-2 w-full mb-3"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleChange}
              className="border px-4 py-2 w-full"
            />

            <input
              type="text"
              name="adviser"
              placeholder="Adviser"
              value={formData.adviser}
              onChange={handleChange}
              className="border px-4 py-2 w-full"
            />
          </div>
        </div>

        {/* COMMENTS TABLE */}
        <div className="border p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-lg mb-3 text-gray-700">
            Panel Comments & Page Reference
          </h3>

          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  name={`comment_${i}`}
                  placeholder={`Comment ${i}`}
                  value={formData[`comment_${i}`]}
                  onChange={handleChange}
                  className="border px-4 py-2 w-full"
                />
                <input
                  type="text"
                  name={`page_reflected_${i}`}
                  placeholder={`Page Reflected ${i}`}
                  value={formData[`page_reflected_${i}`]}
                  onChange={handleChange}
                  className="border px-4 py-2 w-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* APPROVAL */}
        <div className="border p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-lg mb-3 text-gray-700">
            Approval
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="prepared_by"
              placeholder="Prepared By"
              value={formData.prepared_by}
              onChange={handleChange}
              className="border px-4 py-2 w-full"
            />

            <input
              type="text"
              name="conformed_by"
              placeholder="Conformed By"
              value={formData.conformed_by}
              onChange={handleChange}
              className="border px-4 py-2 w-full"
            />
          </div>
        </div>

        {/* FILE UPLOAD */}
        <div className="border p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-lg mb-3 text-gray-700">
            Upload Signed PDF
          </h3>

          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileUpload}
            className="border px-4 py-2 w-full"
          />

          {formData.file_path && (
            <p className="text-sm text-green-600 mt-2">
              Uploaded:{" "}
              <a
                href={formData.file_path}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                {formData.file_path}
              </a>
            </p>
          )}
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded shadow"
        >
          {formId ? "Update Form 2E" : "Submit Form 2E"}
        </button>
      </form>
    </div>
  );
}

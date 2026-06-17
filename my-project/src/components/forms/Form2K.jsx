import React, { useState } from "react";

export default function Form2K() {
  const [formData, setFormData] = useState({
    author: "",
    thesis_title: "",
    capstone_thesis_adviser_received_by: "",
    capstone_thesis_adviser_signature: "",
    capstone_thesis_adviser_date: "",
    ccis_e_library_received_by: "",
    ccis_e_library_signature: "",
    ccis_e_library_date: "",
    department_received_by: "",
    department_signature: "",
    department_date: "",
    university_library_received_by: "",
    university_library_signature: "",
    university_library_date: "",
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
    console.log("Form 2K Data:", formData);
    console.log("Uploaded File:", file);
    alert("Form 2K submitted successfully!");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-4xl space-y-6 rounded-lg border bg-white p-3 shadow sm:p-4 lg:p-6"
    >
      <h2 className="text-2xl font-bold text-center">
        FORM 2K – FINAL MANUSCRIPT SUBMISSION FORM
      </h2>

      {/* Author */}
      <div>
        <label className="block mb-1 font-semibold">Author</label>
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          className="border px-4 py-2 w-full rounded"
          required
        />
      </div>

      {/* Thesis Title */}
      <div>
        <label className="block mb-1 font-semibold">Thesis Title</label>
        <input
          type="text"
          name="thesis_title"
          value={formData.thesis_title}
          onChange={handleChange}
          className="border px-4 py-2 w-full rounded"
          required
        />
      </div>

      {/* Adviser Section */}
      <div className="pt-4 border-t">
        <h3 className="font-bold text-lg mb-2">Capstone/Thesis Adviser Section</h3>

        <div>
          <label className="block mb-1 font-semibold">Received By (Adviser)</label>
          <input
            type="text"
            name="capstone_thesis_adviser_received_by"
            value={formData.capstone_thesis_adviser_received_by}
            onChange={handleChange}
            className="border px-4 py-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Signature</label>
          <input
            type="text"
            name="capstone_thesis_adviser_signature"
            value={formData.capstone_thesis_adviser_signature}
            onChange={handleChange}
            className="border px-4 py-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Date</label>
          <input
            type="date"
            name="capstone_thesis_adviser_date"
            value={formData.capstone_thesis_adviser_date}
            onChange={handleChange}
            className="border px-4 py-2 w-full rounded"
          />
        </div>
      </div>

      {/* CCIS E-Library Section */}
      <div className="pt-4 border-t">
        <h3 className="font-bold text-lg mb-2">CCIS E-Library Section</h3>

        <div>
          <label className="block mb-1 font-semibold">Received By (CCIS E-Library)</label>
          <input
            type="text"
            name="ccis_e_library_received_by"
            value={formData.ccis_e_library_received_by}
            onChange={handleChange}
            className="border px-4 py-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Signature</label>
          <input
            type="text"
            name="ccis_e_library_signature"
            value={formData.ccis_e_library_signature}
            onChange={handleChange}
            className="border px-4 py-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Date</label>
          <input
            type="date"
            name="ccis_e_library_date"
            value={formData.ccis_e_library_date}
            onChange={handleChange}
            className="border px-4 py-2 w-full rounded"
          />
        </div>
      </div>

      {/* Department Section */}
      <div className="pt-4 border-t">
        <h3 className="font-bold text-lg mb-2">Department Section</h3>

        <div>
          <label className="block mb-1 font-semibold">Received By</label>
          <input
            type="text"
            name="department_received_by"
            value={formData.department_received_by}
            onChange={handleChange}
            className="border px-4 py-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Signature</label>
          <input
            type="text"
            name="department_signature"
            value={formData.department_signature}
            onChange={handleChange}
            className="border px-4 py-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Date</label>
          <input
            type="date"
            name="department_date"
            value={formData.department_date}
            onChange={handleChange}
            className="border px-4 py-2 w-full rounded"
          />
        </div>
      </div>

      {/* University Library Section */}
      <div className="pt-4 border-t">
        <h3 className="font-bold text-lg mb-2">University Library Section</h3>

        <div>
          <label className="block mb-1 font-semibold">Received By</label>
          <input
            type="text"
            name="university_library_received_by"
            value={formData.university_library_received_by}
            onChange={handleChange}
            className="border px-4 py-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Signature</label>
          <input
            type="text"
            name="university_library_signature"
            value={formData.university_library_signature}
            onChange={handleChange}
            className="border px-4 py-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Date</label>
          <input
            type="date"
            name="university_library_date"
            value={formData.university_library_date}
            onChange={handleChange}
            className="border px-4 py-2 w-full rounded"
          />
        </div>
      </div>

      {/* File Upload */}
      <div className="pt-4 border-t">
        <label className="block font-semibold mb-2">Upload Signed PDF</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="border px-4 py-2 w-full rounded"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
      >
        Submit Form 2K
      </button>
    </form>
  );
}

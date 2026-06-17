import { useState } from "react";

export default function Form2H() {
  const [formData, setFormData] = useState({
    exam_type: "",
    name_of_student: "",
    capstone_thesis_title: "",
    date: "",
    panel_member_1: "",
    final_rating_1: "",
    signature_1: "",
    panel_member_2: "",
    final_rating_2: "",
    signature_2: "",
    panel_member_3: "",
    final_rating_3: "",
    signature_3: "",
    average_rating: "",
    description: "",
    prepared_by: "",
    concurred_by: "",
    file_path: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fakePath = `/uploads/${file.name}`; 
      setFormData({ ...formData, file_path: fakePath });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Form 2H:", formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-lg border bg-white p-3 shadow sm:p-4 lg:p-6"
    >
      <h2 className="text-2xl font-bold border-b pb-2">
        Form 2H — Final Rating Sheet
      </h2>

      {/* Top Info Section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block mb-1 font-semibold">Exam Type</label>
          <input
            type="text"
            name="exam_type"
            value={formData.exam_type}
            onChange={handleChange}
            className="border px-4 py-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="border px-4 py-2 w-full rounded"
          />
        </div>
      </div>

      {/* Student & Title */}
      <div>
        <label className="block mb-1 font-semibold">Name of Student</label>
        <input
          type="text"
          name="name_of_student"
          value={formData.name_of_student}
          onChange={handleChange}
          className="border px-4 py-2 w-full rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Capstone Thesis Title</label>
        <input
          type="text"
          name="capstone_thesis_title"
          value={formData.capstone_thesis_title}
          onChange={handleChange}
          className="border px-4 py-2 w-full rounded"
        />
      </div>

      {/* Panel Member Ratings */}
      <div className="border rounded p-4 space-y-4">
        <h3 className="text-lg font-semibold">Panel Ratings</h3>

        {[1, 2, 3].map((num) => (
          <div key={num} className="grid grid-cols-1 gap-4 rounded border bg-gray-50 p-3 sm:grid-cols-3">
            <div>
              <label className="block mb-1 font-semibold">
                Panel Member {num}
              </label>
              <input
                type="text"
                name={`panel_member_${num}`}
                value={formData[`panel_member_${num}`]}
                onChange={handleChange}
                className="border px-4 py-2 w-full rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Final Rating</label>
              <input
                type="number"
                step="0.01"
                name={`final_rating_${num}`}
                value={formData[`final_rating_${num}`]}
                onChange={handleChange}
                className="border px-4 py-2 w-full rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Signature</label>
              <input
                type="text"
                name={`signature_${num}`}
                value={formData[`signature_${num}`]}
                onChange={handleChange}
                className="border px-4 py-2 w-full rounded"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Average Rating Section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block mb-1 font-semibold">Average Rating</label>
          <input
            type="number"
            step="0.01"
            name="average_rating"
            value={formData.average_rating}
            onChange={handleChange}
            className="border px-4 py-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border px-4 py-2 w-full rounded"
          />
        </div>
      </div>

      {/* Prepared & Concurred */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block mb-1 font-semibold">Prepared By</label>
          <input
            type="text"
            name="prepared_by"
            value={formData.prepared_by}
            onChange={handleChange}
            className="border px-4 py-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Concurred By</label>
          <input
            type="text"
            name="concurred_by"
            value={formData.concurred_by}
            onChange={handleChange}
            className="border px-4 py-2 w-full rounded"
          />
        </div>
      </div>

      {/* File Upload */}
      <div>
        <label className="block mb-1 font-semibold">Upload PDF</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileUpload}
          className="border px-4 py-2 w-full rounded"
        />

        {formData.file_path && (
          <p className="text-sm text-green-600 mt-2">
            Uploaded:{" "}
            <a
              href={formData.file_path}
              className="underline"
              target="_blank"
              rel="noreferrer"
            >
              {formData.file_path}
            </a>
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
}

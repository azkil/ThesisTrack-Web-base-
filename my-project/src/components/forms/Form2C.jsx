import React, { useState, useEffect } from "react";
import axios from "axios";

export default function MyForm2C() {
  const API_BASE = "http://localhost:3001/api/form2c";
  const studentId = localStorage.getItem("student_id"); // ✅ FIXED
  const [formId, setFormId] = useState(null);
  const [thesisId, setThesisId] = useState(null);
  const [facultyList, setFacultyList] = useState([]);

  const [formData, setFormData] = useState({
    student_name: "",
    student_id: "",
    degree: "",
    original_adviser: "",
    new_adviser: "",
    reason_for_change: "",
    effective_date: "",
    submitted_date: new Date().toISOString().split("T")[0],
    recommending_chairperson: "",
    approved_by: "",
    status: "Pending",
    file_path: "",
  });

  // ✅ Fetch Faculty List
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/faculty")
      .then((res) => setFacultyList(res.data))
      .catch((err) => console.error("❌ Error fetching faculty list:", err));
  }, []);

  // ✅ Fetch Thesis + Existing Form2C
  useEffect(() => {
    const fetchThesis = async () => {
      try {
        if (!studentId) return;

        const res = await axios.get(
          `http://localhost:3001/api/theses/student/${studentId}`
        );

        if (res.data.length > 0) {
          const thesis = res.data[0];
          setThesisId(thesis.thesis_id);

          setFormData((prev) => ({
            ...prev,
            student_name: thesis.student_names || "",
            degree: thesis.degree || "",
            student_id: thesis.student_idno || "",
            original_adviser: thesis.adviser_name || "",
          }));

          // 🔍 Check if Form2C exists
          const formRes = await axios.get(
            `${API_BASE}/check/${studentId}/${thesis.thesis_id}`
          );

          if (formRes.data.exists && formRes.data.form2c) {
            const form = formRes.data.form2c;

            setFormId(form.request_id);
            setFormData({
              student_name: form.student_name,
              student_id: form.student_id,
              degree: form.degree,
              original_adviser: form.original_adviser,
              new_adviser: form.new_adviser,
              reason_for_change: form.reason_for_change,
              effective_date: form.effective_date?.slice(0, 10) || "",
              submitted_date: form.submitted_date?.slice(0, 10) || "",
              recommending_chairperson: form.recommending_chairperson,
              approved_by: form.approved_by,
              status: form.status,
              file_path: form.file_path || "",
            });
          }
        }
      } catch (err) {
        console.error("❌ Error fetching thesis or Form2C:", err);
      }
    };

    fetchThesis();
  }, [studentId]); // ✅ FIXED

  // 📌 Handle Input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 📌 Submit / Update Form2C
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      student_id: parseInt(studentId),
      thesis_id: parseInt(thesisId),
    };

    try {
      if (formId) {
        await axios.put(`${API_BASE}/${formId}`, payload);
        alert("✅ Form 2C updated successfully!");
      } else {
        const res = await axios.post(API_BASE, payload);
        setFormId(res.data.request_id);
        alert("📝 Form 2C submitted successfully!");
      }
    } catch (error) {
      console.error("❌ Error submitting Form 2C:", error);
      alert("Failed to submit Form 2C.");
    }
  };

  return (
    <div className="mx-auto mt-4 max-w-4xl rounded-xl bg-white p-3 shadow-md sm:p-4 lg:p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {formId ? "✏️ Edit Form 2C – Change of Adviser" : "📝 Form 2C – Change of Adviser"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="student_name"
            placeholder="Student Name"
            value={formData.student_name}
            className="border px-4 py-2 w-full bg-gray-100"
            readOnly
          />

          <input
            type="text"
            name="student_id"
            placeholder="Student ID"
            value={formData.student_id}
            className="border px-4 py-2 w-full bg-gray-100"
            readOnly
          />

          <input
            type="text"
            name="degree"
            placeholder="Degree Program"
            value={formData.degree}
            className="border px-4 py-2 w-full bg-gray-100"
            readOnly
          />
        </div>

        {/* Adviser dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Original Adviser</label>
            <input
              type="text"
              name="original_adviser"
              value={formData.original_adviser}
              className="border px-4 py-2 w-full bg-gray-100"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">New Adviser</label>
            <select
              name="new_adviser"
              value={formData.new_adviser}
              onChange={handleChange}
              className="border px-4 py-2 w-full"
            >
              <option value="">-- Select New Adviser --</option>
              {facultyList.map((f) => (
                <option key={f.user_id} value={f.full_name}>
                  {f.full_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <textarea
          name="reason_for_change"
          placeholder="Reason for Change"
          value={formData.reason_for_change}
          onChange={handleChange}
          className="border px-4 py-2 w-full"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="date"
            name="effective_date"
            value={formData.effective_date}
            onChange={handleChange}
            className="border px-4 py-2 w-full"
          />

          <input
            type="date"
            name="submitted_date"
            value={formData.submitted_date}
            onChange={handleChange}
            className="border px-4 py-2 w-full"
          />
        </div>

        <input
          type="text"
          name="recommending_chairperson"
          placeholder="Recommending Chairperson"
          value={formData.recommending_chairperson}
          onChange={handleChange}
          className="border px-4 py-2 w-full"
        />

        <input
          type="text"
          name="approved_by"
          placeholder="Approved By"
          value={formData.approved_by}
          onChange={handleChange}
          className="border px-4 py-2 w-full"
        />

        <div className="text-center mt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            {formId ? "💾 Update Form 2C" : "📝 Submit Form 2C"}
          </button>
        </div>
      </form>
    </div>
  );
}

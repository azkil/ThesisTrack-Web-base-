import React, { useState, useEffect } from "react";
import axios from "axios";

export default function MyForm2A() {
  /* ================= API ================= */
  const API_FORM = "http://localhost:3001/api/form2a";
  const API_THESIS = "http://localhost:3001/api/theses";
  const API_ADVISERS = "http://localhost:3001/api/faculty/advisers/list";

  const studentId = localStorage.getItem("student_id");

  /* ================= STATE ================= */
  const [formId, setFormId] = useState(null);
  const [advisers, setAdvisers] = useState([]);

  const [formData, setFormData] = useState({
    thesis_id: "",
    faculty_id: "",
    faculty_name: "",
    faculty_department: "",
    student_id: studentId || "",
    student_name: "",
    project_title: "",
    semester: "",
    academic_year: "",
    date: "",
    dean_name: "",
    recommending_approval_name: "",
    department: "",
    associate_dean_name: "",
    approved_by: "",
    status: "Acceptance waiting to adviser",
  });

  /* ================= FETCH ALL DATA ================= */
  useEffect(() => {
    if (!studentId) return;

    const fetchAllData = async () => {
      try {
        /* 1️⃣ Fetch Advisers */
        const advisersRes = await axios.get(API_ADVISERS);
        const advisersData = advisersRes.data || [];
        setAdvisers(advisersData);

        /* 2️⃣ Fetch Thesis */
        const thesisRes = await axios.get(`${API_THESIS}/student/${studentId}`);
        const thesis = Array.isArray(thesisRes.data)
          ? thesisRes.data[0]
          : thesisRes.data;

        if (!thesis) return;

        /* 3️⃣ Fetch Form2A (Optional) */
        let form = null;
        try {
          const formRes = await axios.get(`${API_FORM}/student/${studentId}`);
          form = Array.isArray(formRes.data)
            ? formRes.data[0]
            : formRes.data;
        } catch {
          console.log("No Form2A yet.");
        }

        /* 4️⃣ Find Adviser Department */
        const adviserObj = advisersData.find(
          (a) =>
            a.faculty_id?.toString() === thesis.faculty_id?.toString()
        );

        /* 5️⃣ Merge Data */
        setFormData({
          thesis_id: thesis.thesis_id || "",
          faculty_id: thesis.faculty_id || "",
          faculty_name: thesis.adviser_name || "",
          faculty_department: adviserObj?.department || "",
          student_id: studentId,
          student_name: [
            thesis.student1_name,
            thesis.student2_name,
            thesis.student3_name,
          ]
            .filter(Boolean)
            .join(", "),
          project_title: thesis.title || "",
          semester: form?.semester || "",
          academic_year: form?.academic_year || "",
          department: form?.department || "",
          dean_name: form?.dean_name || "",
          recommending_approval_name:
            form?.recommending_approval_name || "",
          associate_dean_name:
            form?.associate_dean_name || "",
          approved_by: form?.approved_by || "",
          status:
            form?.status || "Acceptance waiting to adviser",
          date: form?.date
            ? new Date(form.date).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
        });

        if (form?.id) setFormId(form.id);

      } catch (err) {
        console.error("Error fetching Form2A data:", err);
      }
    };

    fetchAllData();
  }, [studentId]);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* ================= HANDLE FACULTY SELECT ================= */
  const handleFacultySelect = (e, nameKey) => {
    const facultyId = e.target.value;

    const selected = advisers.find(
      (f) => f.faculty_id.toString() === facultyId
    );

    setFormData((prev) => ({
      ...prev,
      [nameKey]: selected ? selected.full_name : "",
    }));
  };

  /* ================= SUBMIT ================= */
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!studentId) return alert("Student not logged in.");

  // Only include fields that exist in the table
  const payload = {
    thesis_id: formData.thesis_id,
    student_id: parseInt(studentId),
    faculty_id: formData.faculty_id,
    faculty_name: formData.faculty_name,
    faculty_department: formData.faculty_department,
    student_name: formData.student_name,
    project_title: formData.project_title,
    semester: formData.semester,
    academic_year: formData.academic_year,
    department: formData.department,
    dean_name: formData.dean_name,
    recommending_approval_name: formData.recommending_approval_name,
    associate_dean_name: formData.associate_dean_name,
    approved_by: formData.approved_by,
    date: formData.date,
    status: formData.status,
  };

  try {
    if (formId) {
      await axios.put(`${API_FORM}/${formId}`, payload);
      alert("Form2A updated successfully!");
    } else {
      const res = await axios.post(API_FORM, payload);
      setFormId(res.data.id);
      alert("Form2A submitted successfully!");
    }
  } catch (err) {
    console.error("Failed to save Form2A:", err);
    alert("Error saving Form2A.");
  }
};
  /* ================= RENDER (UNCHANGED) ================= */
  return (
    <div className="mx-auto mt-4 max-w-5xl rounded-2xl bg-white p-3 shadow-lg sm:p-4 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        📝 Form 2A – Thesis/Capstone Approval
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-1">
            Adviser
          </label>
          <input
            type="text"
            value={
              formData.faculty_name && formData.faculty_department
                ? `${formData.faculty_name} (${formData.faculty_department})`
                : formData.faculty_name || ""
            }
            readOnly
            className="w-full border rounded-lg p-2 bg-gray-100 cursor-not-allowed"
          />
        </div>

        {[
          "dean_name",
          "recommending_approval_name",
          "associate_dean_name",
          "approved_by",
        ].map((key) => (
          <div key={key}>
            <label className="block text-sm font-semibold mb-1">
              {key
                .replace(/_/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())}
            </label>
            <select
              value={
                formData[key]
                  ? advisers.find(
                      (f) => f.full_name === formData[key]
                    )?.faculty_id || ""
                  : ""
              }
              onChange={(e) => handleFacultySelect(e, key)}
              className="w-full border rounded-lg p-2"
            >
              <option value="">-- Select Faculty --</option>
              {advisers.map((f) => (
                <option key={f.faculty_id} value={f.faculty_id}>
                  {f.full_name} ({f.department})
                </option>
              ))}
            </select>
          </div>
        ))}

        <div>
          <label className="block text-sm font-semibold mb-1">
            Student Name
          </label>
          <input
            type="text"
            value={formData.student_name}
            readOnly
            className="w-full border rounded-lg p-2 bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            Project Title
          </label>
          <input
            type="text"
            value={formData.project_title}
            readOnly
            className="w-full border rounded-lg p-2 bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          >
            <option value="">Select Semester</option>
            <option value="1st">1st Semester</option>
            <option value="2nd">2nd Semester</option>
          </select>

          <input
            type="text"
            name="academic_year"
            value={formData.academic_year}
            onChange={handleChange}
            placeholder="e.g. 2025-2026"
            className="w-full border rounded-lg p-2"
          />
        </div>

        <input
          type="text"
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
          <input
            type="text"
            value={formData.status}
            readOnly
            className="w-full border rounded-lg p-2 bg-gray-100"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg"
          >
            {formId ? "💾 Update Form 2A" : "📝 Submit Form 2A"}
          </button>
        </div>
      </form>
    </div>
  );
}

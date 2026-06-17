import React, { useState, useEffect } from "react";
import axios from "axios";

export default function MyForm2B() {
  const API_FORM = "http://localhost:3001/api/form2b";
  const API_FORM2A = "http://localhost:3001/api/form2a";
  const API_THESIS = "http://localhost:3001/api/theses";
  const API_FACULTY = "http://localhost:3001/api/faculty";

  const studentId = localStorage.getItem("student_id");

  const [formId, setFormId] = useState(null);
  const [facultyList, setFacultyList] = useState([]);

  const [formData, setFormData] = useState({
    thesis_id: "",
    defense_type: "",
    capstone_thesis_title: "",
    proponent_name: "",
    department: "",
    defense_date: "",

    adviser_id: "",
    adviser_name: "",
    chairperson_id: "",
    chairperson_name: "",
    member1_id: "",
    member1_name: "",
    member2_id: "",
    member2_name: "",
    secretary_id: "",
    secretary_name: "",
    approved_by: "",

    chairperson_department_name: "",
    posted_by: "",
    status: "pending",
    file_path: "",
    student_id: studentId || "",
  });

  /* ================= Fetch Faculty ================= */
  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const res = await axios.get(API_FACULTY);
        setFacultyList(res.data);
      } catch (err) {
        console.error("❌ Error fetching faculty:", err);
      }
    };
    fetchFaculty();
  }, []);

useEffect(() => {
  if (!studentId) return;

  const fetchData = async () => {
    try {
      // Fetch thesis
      const thesisRes = await axios.get(`${API_THESIS}/student/${studentId}`);
      const thesis = Array.isArray(thesisRes.data)
        ? thesisRes.data[0]
        : thesisRes.data;

      // Fetch Form2A
      const form2ARes = await axios.get(`${API_FORM2A}/student/${studentId}`);
      const form2A = Array.isArray(form2ARes.data)
        ? form2ARes.data[0]
        : form2ARes.data;

      // Fetch existing Form2B
      const formRes = await axios.get(`${API_FORM}/student/${studentId}`);
      const form = Array.isArray(formRes.data)
        ? formRes.data[0]
        : formRes.data;

      const mergedData = {
        thesis_id: thesis?.thesis_id || "",
        capstone_thesis_title: thesis?.title || "",
        proponent_name: [
          thesis?.student1_name,
          thesis?.student2_name,
          thesis?.student3_name,
        ]
          .filter(Boolean)
          .join(", "),

        // ✅ Department priority:
        // 1️⃣ Form2B
        // 2️⃣ Form2A
        department: form?.department || form2A?.department || "",

        adviser_id: thesis?.faculty_id?.toString() || "",
        adviser_name: thesis?.adviser_name || "",

        defense_type: form?.defense_type || "",
        defense_date: form?.defense_date
          ? new Date(form.defense_date).toISOString().split("T")[0]
          : "",

        chairperson_name: form?.chairperson_name || "",
        chairperson_id: form?.chairperson_id || "",
        member1_name: form?.member1_name || "",
        member1_id: form?.member1_id || "",
        member2_name: form?.member2_name || "",
        member2_id: form?.member2_id || "",
        secretary_name: form?.secretary_name || "",
        secretary_id: form?.secretary_id || "",
        approved_by: form?.approved_by || "",
        chairperson_department_name: form?.chairperson_department_name || "",
        posted_by: form?.posted_by || "",
        status: form?.status || "pending",
        file_path: form?.file_path || "",
      };

      setFormData((prev) => ({ ...prev, ...mergedData }));
      if (form?.id) setFormId(form.id);

    } catch (err) {
      console.error("❌ Error fetching data:", err);
    }
  };



    fetchData();
  }, [studentId]);

  /* ================= Handle input changes ================= */
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /* ================= Handle faculty select ================= */
  const handleFacultySelect = (e, nameKey, idKey) => {
    const facultyId = e.target.value;
    const selected = facultyList.find(f => f.faculty_id.toString() === facultyId);

    setFormData(prev => ({
      ...prev,
      [nameKey]: selected ? selected.full_name : "",
      [idKey]: selected ? selected.faculty_id : "",
    }));
  };

  /* ================= Submit Form2B ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId) return alert("⚠️ Student not logged in.");

    if (!formData.adviser_id || !formData.thesis_id) {
      return alert("⚠️ Adviser or Thesis not assigned yet. Cannot submit Form 2B.");
    }

    const payload = {
      ...formData,
      student_id: Number(studentId),
      faculty_id: Number(formData.adviser_id),
      thesis_id: Number(formData.thesis_id),
    };

    try {
      if (formId) {
        await axios.put(`${API_FORM}/${formId}`, payload);
        alert("✅ Form 2B updated successfully!");
      } else {
        const res = await axios.post(API_FORM, payload);
        setFormId(res.data.id);
        alert("📝 Form 2B submitted successfully!");
      }
    } catch (err) {
      console.error("❌ Error saving Form2B:", err.response?.data || err);
      alert("Failed to save Form 2B. Please check your inputs.");
    }
  };

  /* ================= Render Form ================= */
  return (
    <div className="mx-auto mt-4 max-w-5xl rounded-2xl bg-white p-3 shadow-lg sm:p-4 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        📝 Form 2B – Defense Scheduling
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold">Defense Type</label>
            <select
              name="defense_type"
              value={formData.defense_type}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            >
              <option value="">Select Type</option>
              <option value="Proposal">Proposal</option>
              <option value="Final">Final</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold">Defense Date</label>
            <input
              type="date"
              name="defense_date"
              value={formData.defense_date}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-semibold">Thesis Title</label>
            <input
              type="text"
              value={formData.capstone_thesis_title}
              readOnly
              className="w-full border rounded-lg p-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Proponents</label>
            <input
              type="text"
              value={formData.proponent_name}
              readOnly
              className="w-full border rounded-lg p-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Department</label>
            <input
              type="text"
              value={formData.department}
              readOnly
              className="w-full border rounded-lg p-2 bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Adviser */}
        <div>
          <label className="text-sm font-semibold">Adviser</label>
          <input
            type="text"
            value={formData.adviser_name}
            readOnly
            className="w-full border rounded-lg p-2 bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Panel Members */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: "chairperson", nameKey: "chairperson_name", idKey: "chairperson_id" },
            { key: "member1", nameKey: "member1_name", idKey: "member1_id" },
            { key: "member2", nameKey: "member2_name", idKey: "member2_id" },
            { key: "secretary", nameKey: "secretary_name", idKey: "secretary_id" },
            { key: "approved_by", nameKey: "approved_by", idKey: "approved_by" },
          ].map(({ key, nameKey, idKey }) => (
            <div key={key}>
              <label className="text-sm font-semibold">{key.replace("_", " ")}</label>
              <select
                value={formData[idKey]}
                onChange={(e) => handleFacultySelect(e, nameKey, idKey)}
                className="w-full border rounded-lg p-2"
              >
                <option value="">-- Select Faculty --</option>
                {facultyList.map((f) => (
                  <option key={f.faculty_id} value={f.faculty_id}>
                    {f.full_name} ({f.department})
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Status */}
        <div>
          <label className="text-sm font-semibold">Status</label>
          <input
            type="text"
            readOnly
            value={formData.status}
            className="w-full border rounded-lg p-2 bg-gray-100"
          />
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2 rounded-lg shadow-md"
          >
            {formId ? "💾 Update Form 2B" : "📝 Submit Form 2B"}
          </button>
        </div>
      </form>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const formKeys = [
  "form2a","form2b","form2c","form2d","form2e",
  "form2f","form2g","form2h","form2i","form2j","form2k"
];

export default function ThesisFullList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [adviser, setAdviser] = useState("");
  const [status, setStatus] = useState("");

  /* ================= FETCH ================= */
  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3001/api/forms-pdf/theses");
      setData(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  /* ================= TOGGLE VIEW ================= */
  const toggleView = (id) => {
    setOpenId(openId === id ? null : id);
  };

  /* ================= CALCULATE PROGRESS ================= */
  const calculateProgress = (item) => {
    let completed = 0;
    formKeys.forEach((key) => {
      if (item[`${key}_path`]) completed++;
    });
    const percent = Math.round((completed / formKeys.length) * 100);
    return { completed, percent };
  };

  const renderFile = (path, name) => {
    if (!path) return <span className="text-gray-400">Not Uploaded</span>;
    const url = `http://localhost:3001/${path}`;
    return (
      <div className="flex flex-wrap gap-3 text-sm">
        <span className="break-all">{name}</span>
        <a href={url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
          View
        </a>
        <a href={url} download className="text-green-600 underline">
          Download
        </a>
      </div>
    );
  };

  /* ================= SEARCH & FILTER ================= */
  const applyFilters = () => {
    let filtered = [...data];

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.adviser_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (adviser) {
      filtered = filtered.filter((item) =>
        item.adviser_name?.toLowerCase().includes(adviser.toLowerCase())
      );
    }

    if (status) {
      filtered = filtered.filter((item) =>
        item.status?.toLowerCase() === status.toLowerCase()
      );
    }

    return filtered;
  };

  const resetFilters = () => {
    setSearchTerm("");
    setAdviser("");
    setStatus("");
    fetchAll();
  };

 const handleExport = () => {
  const filtered = applyFilters();
  const worksheet = XLSX.utils.json_to_sheet(
    filtered.map((t) => ({
      "Thesis ID": t.thesis_id,
      "Student ID": t.student_id,
      "Faculty ID": t.faculty_id,
      "Adviser Name": t.adviser_name,
      "Student 1 Name": t.student1_name,
      "Student 1 ID No": t.student1_idno,
      "Student 2 Name": t.student2_name,
      "Student 2 ID No": t.student2_idno,
      "Student 3 Name": t.student3_name,
      "Student 3 ID No": t.student3_idno,
      "Title": t.title,
      "Description": t.description,
      "Problem Statement": t.problem_stmt,
      "Objectives": t.objectives,
      "Status": t.status,
      "Created At": t.created_at,
      "Updated At": t.updated_at
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Theses");
  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  saveAs(
    new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
    "theses.xlsx"
  );
};

  /* ================= IMPORT ================= */
  const handleImport = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formDataExcel = new FormData();
  formDataExcel.append("file", file);

  try {
    await axios.post(
      "http://localhost:3001/api/theses/excel/import",
      formDataExcel,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    alert("Theses imported successfully");
    fetchAll();
  } catch (err) {
    console.error(err);
    alert("Import failed");
  } finally {
    e.target.value = "";
  }
};
  if (loading) return <p className="p-6">Loading...</p>;

  const filteredData = applyFilters();

  return (
    <div className="space-y-4 p-3 sm:p-4 lg:p-6">
      <h1 className="text-xl font-bold sm:text-2xl">📚 Thesis Records</h1>

      {/* SEARCH + FILTER + EXPORT */}
      <div className="grid grid-cols-1 gap-3 rounded bg-gray-100 p-3 sm:p-4 md:grid-cols-2 xl:grid-cols-6">
        <input
          type="text"
          placeholder="Search title, adviser, status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded border px-3 py-2 xl:col-span-2"
        />
        <input
          type="text"
          placeholder="Filter by adviser"
          value={adviser}
          onChange={(e) => setAdviser(e.target.value)}
          className="w-full rounded border px-3 py-2 xl:col-span-2"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded border px-3 py-2"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="final_approved">Final Approved</option>
        </select>

        <button
          onClick={resetFilters}
          className="rounded bg-gray-600 px-4 py-2 text-white"
        >
          Reset
        </button>
        <button
          onClick={handleExport}
          className="rounded bg-indigo-600 px-4 py-2 text-white"
        >
          Export Excel
        </button>
        <label className="cursor-pointer rounded bg-emerald-600 px-4 py-2 text-center text-white">
          Import Excel
          <input type="file" accept=".xlsx,.xls" hidden onChange={handleImport} />
        </label>
      </div>

      {/* DATA LIST */}
      {filteredData.map((item) => {
        const progress = calculateProgress(item);
        const isOpen = openId === item.thesis_id;

        return (
          <div key={item.thesis_id} className="rounded-lg border bg-white p-4 shadow-md sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h2 className="break-words text-base font-bold sm:text-lg">{item.title}</h2>
                <p>Status: {item.status}</p>
                <p>🟢 {progress.completed} / 11 Forms ({progress.percent}%)</p>
              </div>
              <button
                onClick={() => toggleView(item.thesis_id)}
                className="rounded bg-blue-600 px-4 py-2 text-white"
              >
                {isOpen ? "Hide Details" : "View Details"}
              </button>
            </div>

            {isOpen && (
              <div className="mt-6 space-y-5 border-t pt-5">
                <div><strong>Adviser:</strong> {item.adviser_name}</div>
                <div><strong>Description:</strong> {item.description}</div>
                <div><strong>Problem Statement:</strong> {item.problem_stmt}</div>
                <div><strong>Objectives:</strong> {item.objectives}</div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-green-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>

                {/* Forms */}
                <div>
                  <h3 className="font-semibold mb-2">Forms 2A–2K</h3>
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {formKeys.map((form) => (
                      <div key={form}>
                        <strong>{form.toUpperCase()}:</strong>
                        {renderFile(item[`${form}_path`], item[`${form}_name`])}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <strong>Manuscript:</strong>
                  {renderFile(item.manuscript_path, item.manuscript_name)}
                </div>

                <div>
                  <strong>Other PDF:</strong>
                  {renderFile(item.other_pdf_path, item.other_pdf_name)}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Badge, Button, Card, CardContent, Input, Select } from "../ui";

const API = "http://localhost:3001/api";

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [year, setYear] = useState("");

  const [editingStudent, setEditingStudent] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    full_name: "",
    department: "",
    student_no: "",
    is_active: true,
  });

  /* ================= FETCH ================= */
  const fetchAll = async () => {
    setLoading(true);

    try {
      const res = await axios.get(`${API}/students`);
      setStudents(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load students.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  /* ================= SEARCH ================= */
  const handleSearch = async () => {
    if (!searchTerm.trim()) return fetchAll();

    try {
      const res = await axios.get(
        `${API}/students/search?term=${encodeURIComponent(searchTerm)}`
      );

      setStudents(res.data);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  /* ================= FILTER ================= */
  const handleFilter = async () => {
    if (!year) return fetchAll();

    try {
      const res = await axios.get(`${API}/students/filter?year=${year}`);
      setStudents(res.data);
    } catch (err) {
      console.error("Filter by year failed", err);
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setYear("");
    fetchAll();
  };

  /* ================= EXPORT ================= */
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      students.map((s) => ({
        Username: s.username,
        Password: s.password,
        Email: s.email,
        "Full Name": s.full_name,
        Department: s.department,
        "Student No": s.student_no,
        Status: s.is_active ? "Active" : "Inactive",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(
      new Blob([buffer], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "students.xlsx"
    );
  };

  /* ================= IMPORT ================= */
  const importFromExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataExcel = new FormData();
    formDataExcel.append("file", file);

    try {
      await axios.post(`${API}/students/import/excel`, formDataExcel, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Students imported successfully");
      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Import failed");
    } finally {
      e.target.value = "";
    }
  };

  /* ================= EDIT ================= */
  const openEdit = (s) => {
    setEditingStudent(s);

    setFormData({
      username: s.username,
      password: s.password,
      email: s.email,
      full_name: s.full_name,
      department: s.department,
      student_no: s.student_no,
      is_active: s.is_active,
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `${API}/students/${editingStudent.student_id}`,
        formData
      );

      setEditingStudent(null);
      fetchAll();
      alert("Student updated");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;

    try {
      await axios.delete(`${API}/students/${id}`);
      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  /* ================= UI ================= */
  if (loading) {
    return <p className="p-6 text-center">Loading...</p>;
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 lg:p-6">

      <h2 className="mb-4 text-center text-xl font-semibold sm:text-2xl">
        👩‍🎓 Student Records
      </h2>

      {/* SEARCH / FILTER */}
      <Card className="mb-4">
        <CardContent className="grid grid-cols-1 gap-3 p-3 sm:p-4 md:grid-cols-6">

          <Input
            className="md:col-span-2"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">All Years</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </Select>

          <Button onClick={handleSearch}>Search</Button>
          <Button variant="secondary" onClick={handleFilter}>Filter</Button>
          <Button variant="outline" onClick={resetFilters}>Reset</Button>

        </CardContent>
      </Card>

      {/* EXPORT / IMPORT */}
      <div className="mb-3 flex justify-end gap-2">
        <Button onClick={exportToExcel}>Export Excel</Button>

        <label className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 cursor-pointer">
          Import Excel
          <input
            type="file"
            accept=".xlsx,.xls"
            hidden
            onChange={importFromExcel}
          />
        </label>
      </div>

      {/* ERROR */}
      {error && (
        <Card className="mb-4 border-red-200 bg-red-50">
          <CardContent className="p-3 text-red-600">
            {error}
          </CardContent>
        </Card>
      )}

      {/* TABLE */}
      <Card>
        <CardContent className="overflow-x-auto p-0">

          <table className="responsive-table md:min-w-[820px] w-full">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Username</th>
                <th className="p-3">Email</th>
                <th className="p-3">Full Name</th>
                <th className="p-3">Department</th>
                <th className="p-3">Student No</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s) => (
                <tr key={s.student_id} className="border-t hover:bg-gray-50">

                  <td className="p-3">{s.username}</td>
                  <td className="p-3 break-all">{s.email}</td>
                  <td className="p-3">{s.full_name}</td>

                  <td className="p-3">
                    <Badge variant="secondary">{s.department}</Badge>
                  </td>

                  <td className="p-3">{s.student_no}</td>

                  <td className="p-3">
                    <Badge variant={s.is_active ? "success" : "destructive"}>
                      {s.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </td>

                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(s)}>
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(s.student_id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </CardContent>
      </Card>

      {/* MODAL */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">

          <Card className="w-full max-w-md">
            <CardContent className="p-4">

              <h3 className="text-xl font-semibold mb-4">
                Edit Student
              </h3>

              {["username", "email", "full_name", "department", "student_no"].map((field) => (
                <Input
                  key={field}
                  className="mb-3"
                  placeholder={field.toUpperCase()}
                  value={formData[field]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field]: e.target.value })
                  }
                />
              ))}

              <Select
                className="mb-4"
                value={formData.is_active}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    is_active: e.target.value === "true",
                  })
                }
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </Select>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingStudent(null)}>
                  Cancel
                </Button>

                <Button onClick={handleUpdate}>
                  Save
                </Button>
              </div>

            </CardContent>
          </Card>

        </div>
      )}

    </div>
  );
}
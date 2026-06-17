import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import {
  Card,
  CardContent,
  Button,
  Badge,
  Input,
  Select,
  PageHeader,
} from "../ui";

const API = "http://localhost:3001/api";

export default function FacultyList() {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [thesesMap, setThesesMap] = useState({});

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    full_name: "",
    department: "",
    role: "faculty",
    is_active: true,
  });

  /* ================= FETCH ================= */
  const fetchAll = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(`${API}/faculty`);
      setFaculty(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load faculty.");
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
        `${API}/faculty/search?term=${encodeURIComponent(searchTerm)}`
      );
      setFaculty(res.data);
    } catch (err) {
      console.error(err);
      alert("Search failed");
    }
  };

  /* ================= RESET ================= */
  const resetFilters = () => {
    setSearchTerm("");
    fetchAll();
  };

  /* ================= EXPORT ================= */
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      faculty.map((f) => ({
        Username: f.username,
        Email: f.email,
        "Full Name": f.full_name,
        Role: f.role,
        Department: f.department,
        Status: f.is_active ? "Active" : "Inactive",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Faculty");

    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(
      new Blob([buffer], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "faculty.xlsx"
    );
  };

  /* ================= IMPORT ================= */
  const importFromExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataExcel = new FormData();
    formDataExcel.append("file", file);

    try {
      const res = await axios.post(
        `${API}/faculty/import/excel`,
        formDataExcel,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const { inserted, errors } = res.data;

      alert(
        `Import Done\nInserted: ${inserted}\nErrors: ${errors.length}`
      );

      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Import failed");
    } finally {
      e.target.value = "";
    }
  };

  /* ================= EDIT ================= */
  const openEdit = (f) => {
    setEditingFaculty(f);
    setFormData({
      username: f.username,
      password: f.password || "",
      email: f.email,
      full_name: f.full_name,
      department: f.department,
      role: f.role,
      is_active: f.is_active,
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `${API}/faculty/${editingFaculty.faculty_id}`,
        formData
      );
      setEditingFaculty(null);
      fetchAll();
      alert("Faculty updated");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this faculty?")) return;

    try {
      await axios.delete(`${API}/faculty/${id}`);
      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  /* ================= DETAILS ================= */
  const toggleDetails = async (facultyId) => {
    if (openId === facultyId) {
      setOpenId(null);
      return;
    }

    try {
      const res = await axios.get(
        `${API}/faculty/theses/${facultyId}`
      );

      setThesesMap((prev) => ({
        ...prev,
        [facultyId]: res.data,
      }));

      setOpenId(facultyId);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch theses");
    }
  };

  if (loading) {
    return (
      <p className="p-6 text-center text-muted-foreground">
        Loading...
      </p>
    );
  }

  return (
    <div className="min-h-screen space-y-6 bg-background p-3 sm:p-4 lg:p-6">

      {/* ================= HEADER ================= */}
      <PageHeader
        title="Faculty Records"
        description="Manage faculty accounts and assigned theses"
      />

      {/* ================= SEARCH FILTER ================= */}
      <Card className="border-0 shadow-none bg-transparent">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

            <Input
              placeholder="Search faculty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Button onClick={handleSearch}>Search</Button>

            <Button variant="secondary" onClick={resetFilters}>
              Reset
            </Button>

          </div>
        </CardContent>
      </Card>

      {/* ================= ACTIONS ================= */}
      <div className="flex flex-col justify-end gap-3 sm:flex-row">
        <Button onClick={exportToExcel}>Export Excel</Button>

        <label>
          <Button asChild>
            <span>Import Excel</span>
          </Button>
          <input type="file" hidden onChange={importFromExcel} />
        </label>
      </div>

      {/* ================= ERROR ================= */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-red-600">
            {error}
          </CardContent>
        </Card>
      )}

      {/* ================= TABLE ================= */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">

          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="p-3 text-left">Username</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Full Name</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Department</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {faculty.map((f) => {
                const isOpen = openId === f.faculty_id;

                return (
                  <React.Fragment key={f.faculty_id}>
                    <tr className="border-t hover:bg-muted/30">
                      <td className="p-3">{f.username}</td>
                      <td className="p-3">{f.email}</td>
                      <td className="p-3">{f.full_name}</td>
                      <td className="p-3">
                        <Badge>{f.role}</Badge>
                      </td>
                      <td className="p-3">{f.department}</td>
                      <td className="p-3">
                        <Badge variant={f.is_active ? "default" : "destructive"}>
                          {f.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </td>

                      <td className="p-3 text-center space-x-2">
                        <Button size="sm" variant="outline" onClick={() => openEdit(f)}>
                          Edit
                        </Button>

                        <Button size="sm" variant="destructive" onClick={() => handleDelete(f.faculty_id)}>
                          Delete
                        </Button>

                        <Button size="sm" variant="outline" onClick={() => toggleDetails(f.faculty_id)}>
                          {isOpen ? "Hide" : "View"}
                        </Button>
                      </td>
                    </tr>

                    {/* DETAILS */}
                    {isOpen && (
                      <tr className="bg-muted/20">
                        <td colSpan={7} className="p-5">
                          {thesesMap[f.faculty_id]?.length ? (
                            thesesMap[f.faculty_id].map((t) => (
                              <div key={t.thesis_id} className="border p-3 mb-2 rounded">
                                <p className="font-semibold">{t.title}</p>
                                <p className="text-sm text-muted-foreground">{t.status}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-muted-foreground">No theses found</p>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>

          </table>

        </CardContent>
      </Card>

      {/* ================= EDIT MODAL ================= */}
      {editingFaculty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
          <Card className="w-full max-w-md p-4">
            <CardContent className="space-y-3">

              <h2 className="text-lg font-bold">Edit Faculty</h2>

              {["username", "email", "full_name", "department"].map((field) => (
                <Input
                  key={field}
                  value={formData[field]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field]: e.target.value })
                  }
                  placeholder={field}
                />
              ))}
              
              <Select
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
                <Button variant="secondary" onClick={() => setEditingFaculty(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdate}>Save</Button>
              </div>

            </CardContent>
          </Card>
        </div>
      )}

    </div>
  );
}

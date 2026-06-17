import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

import {
  Card,
  CardContent,
  Button,
  Badge,
  Input,
  Select,
  PageHeader,
} from "../components/ui";

const API = "http://localhost:3001/api/forms-pdf/theses";

const formKeys = [
  "form2a",
  "form2b",
  "form2c",
  "form2d",
  "form2e",
  "form2f",
  "form2g",
  "form2h",
  "form2i",
  "form2j",
  "form2k",
];

export default function ThesisList() {
  const [theses, setTheses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [year, setYear] = useState("");
  const [openId, setOpenId] = useState(null);

  const toggleView = (id) => {
    setOpenId(openId === id ? null : id);
  };

  /* ================= FETCH ================= */
  const fetchAll = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(API);
      setTheses(res.data || []);
    } catch {
      setError("Failed to load theses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  /* ================= SEARCH ================= */
  const handleSearch = async () => {
    try {
      if (!searchTerm.trim()) return fetchAll();

      const res = await axios.get(
        `${API}/search?search=${encodeURIComponent(searchTerm)}`
      );

      setTheses(res.data || []);
    } catch {
      setError("Search failed.");
    }
  };

  /* ================= FILTER ================= */
  const handleFilter = async () => {
    try {
      if (!year) return fetchAll();

      const res = await axios.get(`${API}/year?year=${year}`);
      setTheses(res.data || []);
    } catch {
      setError("Filter failed.");
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setYear("");
    fetchAll();
  };

  /* ================= PROGRESS ================= */
  const calculateProgress = (item) => {
    let completed = 0;

    formKeys.forEach((key) => {
      const path = item?.[`${key}_path`];
      const name = item?.[`${key}_name`];

      if (path && name && path !== "null" && name !== "null") {
        completed++;
      }
    });

    const percent = Math.round((completed / formKeys.length) * 100);

    return {
      completed,
      percent: isNaN(percent) ? 0 : percent,
    };
  };

  /* ================= FILE ================= */
  const renderFile = (path, name) => {
    if (!path || path === "null") {
      return <span className="text-muted-foreground">Not Uploaded</span>;
    }

    const url = `http://localhost:3001/${path}`;

    return (
      <div className="flex flex-wrap gap-3 text-sm">
        <span>{name || "File"}</span>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 underline"
        >
          View
        </a>
        <a href={url} download className="text-green-600 underline">
          Download
        </a>
      </div>
    );
  };

  /* ================= EXPORT ================= */
  const exportToExcel = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3001/api/theses/export/excel",
        { responseType: "arraybuffer" }
      );

      const workbook = XLSX.read(res.data, { type: "array" });
      XLSX.writeFile(workbook, "theses.xlsx");
    } catch {
      alert("Export failed");
    }
  };

  /* ================= IMPORT ================= */
  const importFromExcel = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      await axios.post(
        "http://localhost:3001/api/theses/import/excel",
        formData
      );

      fetchAll();
    } catch {
      alert("Import failed");
    } finally {
      e.target.value = "";
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this thesis?");
    if (!ok) return;

    try {
      await axios.delete(`${API}/${id}`);
      fetchAll();
    } catch {
      alert("Delete failed");
    }
  };

  /* ================= UI STATES ================= */
  if (loading) {
    return <p className="p-6 text-muted-foreground">Loading theses...</p>;
  }

  if (!loading && theses.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No theses found.
        </CardContent>
      </Card>
    );
  }

  return (
  <div className="min-h-screen space-y-6 bg-background p-3 sm:p-4 lg:p-6">

    {/* ================= PAGE HEADER ================= */}
    <div className="w-full flex justify-center">
      <div className="text-center space-y-2 max-w-2xl">

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Thesis Records
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground">
          Manage theses, forms, and submitted files
        </p>

        <div className="mx-auto h-1 w-24 rounded-full bg-slate-900" />

      </div>
    </div>

    {/* ================= FILTER ================= */}
    <Card className="border-0 shadow-none bg-transparent">
      <CardContent className="p-4">

        <div className="w-full flex justify-center">
          <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">

            <Input
              placeholder="Search thesis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 shadow-none bg-muted/30 focus-visible:ring-0"
            />

            <Select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="border-0 shadow-none bg-muted/30 focus-visible:ring-0"
            >
              <option value="">All Years</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </Select>

            <Button onClick={handleSearch} className="shadow-none border-0 w-full">
              Search
            </Button>

            <Button onClick={handleFilter} className="shadow-none border-0 w-full">
              Filter
            </Button>

            <Button
              variant="secondary"
              onClick={resetFilters}
              className="shadow-none border-0 w-full"
            >
              Reset
            </Button>

          </div>
        </div>

      </CardContent>
    </Card>

    {/* ================= ACTIONS ================= */}
    <div className="flex flex-col sm:flex-row justify-end gap-3">
      <Button onClick={exportToExcel}>Export Excel</Button>

      <label>
        <Button asChild>
          <span>Import Excel</span>
        </Button>

        <input
          type="file"
          hidden
          accept=".xlsx,.xls"
          onChange={importFromExcel}
        />
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

    {/* ================= DESKTOP TABLE ================= */}
    <div className="hidden lg:block">
      <Card className="shadow-sm">
        <CardContent className="p-0 overflow-x-auto">

          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Students</th>
                <th className="p-3 text-left">Adviser</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Progress</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {theses.map((t) => {
                const progress = calculateProgress(t);
                const isOpen = openId === t.thesis_id;

                return (
                  <React.Fragment key={t.thesis_id}>

                    <tr className="border-t hover:bg-muted/30 transition">
                      <td className="p-3 font-medium">{t.title}</td>

                      <td className="p-3 space-y-1">
                        {[1, 2, 3].map((i) => {
                          const name = t[`student${i}_name`];
                          const idno = t[`student${i}_idno`];

                          return (
                            name && (
                              <div key={i}>
                                {name} <span className="text-muted-foreground">({idno})</span>
                              </div>
                            )
                          );
                        })}
                      </td>

                      <td className="p-3">{t.adviser_name}</td>

                      <td className="p-3">
                        <Badge variant="secondary">{t.status}</Badge>
                      </td>

                      <td className="p-3">
                        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                          <div
                            className="h-2 bg-green-500"
                            style={{ width: `${progress.percent}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {progress.percent}% ({progress.completed}/11)
                        </p>
                      </td>

                      <td className="p-3 text-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleView(t.thesis_id)}
                        >
                          {isOpen ? "Hide" : "View"}
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(t.thesis_id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>

                    {/* DETAILS */}
                    {isOpen && (
                      <tr className="bg-muted/20">
                        <td colSpan={6} className="p-5 space-y-3">

                          <p><b>Description:</b> {t.description}</p>
                          <p><b>Problem:</b> {t.problem_stmt}</p>
                          <p><b>Objectives:</b> {t.objectives}</p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            {formKeys.map((form) => (
                              <Card key={form}>
                                <CardContent className="p-3">
                                  <p className="font-semibold uppercase mb-2">
                                    {form}
                                  </p>
                                  {renderFile(
                                    t[`${form}_path`],
                                    t[`${form}_name`]
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                          </div>

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
    </div>

    {/* ================= MOBILE CARDS ================= */}
    <div className="grid grid-cols-1 gap-4 lg:hidden">
      {theses.map((t) => {
        const progress = calculateProgress(t);
        const isOpen = openId === t.thesis_id;

        return (
          <Card key={t.thesis_id} className="shadow-sm hover:shadow-md transition">
            <CardContent className="p-4 space-y-3">

              <div className="font-semibold text-lg">{t.title}</div>

              <div className="text-sm space-y-1">
                {[1, 2, 3].map((i) => {
                  const name = t[`student${i}_name`];
                  const idno = t[`student${i}_idno`];

                  return (
                    name && (
                      <div key={i}>
                        {name} <span className="text-muted-foreground">({idno})</span>
                      </div>
                    )
                  );
                })}
              </div>

              <div className="flex justify-between text-sm">
                <span>{t.adviser_name}</span>
                <Badge variant="secondary">{t.status}</Badge>
              </div>

              <div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-green-500"
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {progress.percent}% ({progress.completed}/11)
                </p>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleView(t.thesis_id)}
                >
                  {isOpen ? "Hide" : "View"}
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(t.thesis_id)}
                >
                  Delete
                </Button>
              </div>

              {isOpen && (
                <div className="pt-3 border-t space-y-2 text-sm">
                  <p><b>Description:</b> {t.description}</p>
                  <p><b>Problem:</b> {t.problem_stmt}</p>
                  <p><b>Objectives:</b> {t.objectives}</p>
                </div>
              )}

            </CardContent>
          </Card>
        );
      })}
    </div>

  </div>
);
}

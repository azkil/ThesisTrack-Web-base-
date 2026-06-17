import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp, Download, Eye, Trash2 } from "lucide-react";
import { Badge, Button, Card, CardContent, Info, PageHeader } from "../ui";

const API = "http://localhost:3001";

const forms = [
  {
    id: "form2a",
    name: "Form 2A - Title/Program/Group Members [IT 198]",
  },

  {
    id: "form2b198",
    name: "Form 2B - Proposal Defense Schedule [IT 198]",
  },

  

  {
    id: "form2d198",
    name: "Form 2D - Proposal Defense Result [IT 198]",
  },

  {
    id: "form2e198",
    name: "Form 2E [IT 198]",
  },

  {
    id: "form2f198",
    name: "Form 2F [IT 198]",
  },

  {
    id: "form2g198",
    name: "Form 2G [IT 198]",
  },

  {
    id: "form2h198",
    name: "Form 2H [IT 198]",
  },

  {
    id: "form2i198",
    name: "Form 2I [IT 198]",
  },

  {
    id: "form2c",
    name: "Form 2C - Change Adviser/Panelist",
  },

  {
    id: "form2b199",
    name: "Form 2B - Final Defense Schedule [IT 199]",
  },

  {
    id: "form2d199",
    name: "Form 2D - Final Defense Result [IT 199]",
  },

  {
    id: "form2e199",
    name: "Form 2E [IT 199]",
  },

  {
    id: "form2f199",
    name: "Form 2F [IT 199]",
  },

  {
    id: "form2g199",
    name: "Form 2G [IT 199]",
  },

  {
    id: "form2h199",
    name: "Form 2H [IT 199]",
  },

  {
    id: "form2i199",
    name: "Form 2I [IT 199]",
  },

  {
    id: "form2j",
    name: "Form 2J - Plagiarism Result",
  },

  {
    id: "form2k",
    name: "Form 2K - Final Submission Requirements",
  },
];




export default function ThesisByStudent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(true);
  const [previewPath, setPreviewPath] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const studentId = localStorage.getItem("student_id");

  // ======================
  // MILESTONES
  // ======================

  const proposalCompleted =
    data?.form2b198_path &&
    data?.form2d198_path;

  const finalDefenseCompleted =
    data?.form2b199_path &&
    data?.form2d199_path;

  const graduated =
    data?.form2j_path &&
    data?.form2k_path;

  // ======================
  // FETCH DATA
  // ======================
  const fetchByStudent = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API}/api/forms-pdf/theses/student/${studentId}/pdfs`
      );
      setData(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch thesis.");
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    if (studentId) fetchByStudent();
  }, [studentId, fetchByStudent]);

  // ======================
  // DELETE FILE
  // ======================
  const handleDelete = async (type, path) => {
    if (!window.confirm(`Delete ${type.toUpperCase()} file?`)) return;

    try {
      setDeleting(type);

      await axios.delete(
        `${API}/api/forms-pdf/student/${studentId}/${type}`
      );

      alert("File deleted.");

      if (previewPath && path && previewPath.includes(path)) {
        setPreviewPath(null);
      }

      fetchByStudent();
    } catch (err) {
      console.error(err);
      alert("Failed to delete file.");
    } finally {
      setDeleting(null);
    }
  };

  

  // ======================
  // FILE RENDER
  // ======================
  const renderFile = (path, name, type) => {
    if (!path) return <Badge variant="secondary">Not Uploaded</Badge>;

    const normalizedPath = path.replace(/\\/g, "/");
    const url = `${API}/${normalizedPath}`;

    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="max-w-full break-all text-sm text-muted-foreground">
          {name || normalizedPath}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setPreviewPath(url)}
        >
          <Eye className="h-4 w-4" />
          View
        </Button>

        <Button variant="outline" size="sm" asChild>
          <a href={url} download>
            <Download className="h-4 w-4" />
            Download
          </a>
        </Button>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDelete(type, normalizedPath)}
          disabled={deleting === type}
        >
          <Trash2 className="h-4 w-4" />
          {deleting === type ? "Deleting..." : "Delete"}
        </Button>
      </div>
    );
  };

  // ======================
  // LOADING / EMPTY
  // ======================
  if (loading)
    return (
      <p className="p-6 text-sm text-muted-foreground">Loading...</p>
    );

  if (!data)
    return (
      <p className="p-6 text-sm text-red-600">No thesis found.</p>
    );

  // ======================
  // FIXED MILSTONE PROGRESS (ONLY FIX HERE)
      // ======================
    const progress = forms.filter(
      (form) => data?.[`${form.id}_path`]
    ).length;

    const percent = Math.round(
      (progress / forms.length) * 100
    );
    
 return (
  <div className="space-y-4 p-3 sm:p-4 lg:p-6">
    <PageHeader
      title="My Uploaded Forms"
      description="Track, preview, and manage uploaded thesis files."
    />

    <Card>
      <CardContent className="p-4 sm:p-5">

        {/* HEADER */}
        <div className="space-y-6">

          {/* Title + Button */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

            <div className="flex-1">
              <h2 className="text-xl font-semibold break-words">
                {data.title}
              </h2>

              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="outline">{data.status}</Badge>

                <Badge variant="success">
                  {progress} / {forms.length} Forms ({percent}%)
                </Badge>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => setOpen(!open)}
              className="w-full lg:w-auto"
            >
              {open ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              {open ? "Hide Details" : "View Details"}
            </Button>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">
                Overall Progress
              </span>

              <span className="text-sm text-muted-foreground">
                {percent}%
              </span>
            </div>

            <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          {/* Milestones */}
          <div className="relative mx-auto w-full max-w-5xl py-4">

            <div className="absolute left-10 right-10 top-5 h-1 bg-gray-200" />

            <div className="relative flex justify-between">

              {/* Proposal */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    proposalCompleted
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {proposalCompleted ? "✓" : "1"}
                </div>

                <p className="mt-2 text-center text-sm font-medium">
                  Proposal Defense
                </p>

                <p className="text-xs text-muted-foreground">
                  IT 198
                </p>
              </div>

              {/* Final Defense */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    finalDefenseCompleted
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {finalDefenseCompleted ? "✓" : "2"}
                </div>

                <p className="mt-2 text-center text-sm font-medium">
                  Final Defense
                </p>

                <p className="text-xs text-muted-foreground">
                  IT 199
                </p>
              </div>

              {/* Graduated */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    graduated
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {graduated ? "🎓" : "3"}
                </div>

                <p className="mt-2 text-center text-sm font-medium">
                  Graduated
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* DETAILS */}
        {open && (
          <div className="mt-5 space-y-5 border-t pt-5">

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Info label="Adviser" value={data.adviser_name} />
              <Info label="Description" value={data.description} />
              <Info
                label="Problem Statement"
                value={data.problem_stmt}
              />
              <Info label="Objectives" value={data.objectives} />
            </div>

            <section className="space-y-3">
              <h3 className="text-sm font-semibold">
                Forms 2A-2K
              </h3>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {forms.map((form) => (
                  <div
                    key={form.id}
                    className="rounded-md border border-border bg-background p-3"
                  >
                    <p className="mb-2 text-sm font-semibold">
                      {form.name}
                    </p>

                    {renderFile(
                      data[`${form.id}_path`],
                      data[`${form.id}_name`],
                      form.id
                    )}
                  </div>
                ))}
              </div>
            </section>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">

              <div className="rounded-md border border-border bg-background p-3">
                <p className="mb-2 text-sm font-semibold">
                  Manuscript
                </p>

                {renderFile(
                  data.manuscript_path,
                  data.manuscript_name,
                  "manuscript"
                )}
              </div>

              <div className="rounded-md border border-border bg-background p-3">
                <p className="mb-2 text-sm font-semibold">
                  Other PDF
                </p>

                {renderFile(
                  data.other_pdf_path,
                  data.other_pdf_name,
                  "other_pdf"
                )}
              </div>

            </div>

            {previewPath && (
              <div className="space-y-2">

                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">
                    Preview
                  </h3>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewPath(null)}
                  >
                    Close
                  </Button>
                </div>

                <iframe
                  src={previewPath}
                  title="PDF Preview"
                  className="h-80 w-full rounded-md border border-border"
                />
              </div>
            )}

          </div>
        )}

      </CardContent>
    </Card>
  </div>
);
}
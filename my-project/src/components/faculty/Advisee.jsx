import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Info,
  PageHeader,
  Select,
} from "../ui";

const STATUS_OPTIONS = [
  "Acceptance waiting to adviser",
  "proposal approved",
  "final approved",
  "published",
  "rejected",
];

const AdviseeThesis = () => {
  const [theses, setTheses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);

  const API_BASE = "http://localhost:3001/api/faculty";
  const facultyId = localStorage.getItem("faculty_id");

  useEffect(() => {
    if (!facultyId) return;

    const fetchAdviseeTheses = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/theses/${facultyId}`);
        setTheses(res.data);
      } catch (err) {
        console.error("Error fetching advisee theses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdviseeTheses();
  }, [facultyId]);

  const toggleView = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const handleStatusChange = async (thesisId, newStatus) => {
    try {
      await axios.patch(`http://localhost:3001/api/theses/${thesisId}/status`, {
        status: newStatus,
      });

      setTheses((prev) =>
        prev.map((t) =>
          t.thesis_id === thesisId
            ? { ...t, status: newStatus, updated_at: new Date().toISOString() }
            : t
        )
      );
    } catch (err) {
      console.error("Error updating thesis status:", err);
      alert("Failed to update status.");
    }
  };

  if (loading) {
    return <p className="p-6 text-sm text-muted-foreground">Loading advisee theses...</p>;
  }

  if (theses.length === 0) {
    return (
      <div className="p-4 sm:p-6">
        <Card className="p-8 text-center text-sm text-muted-foreground">
          No advisee theses found.
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-3 sm:p-4 lg:p-6">
      <PageHeader
        title="Advisee Theses"
        description="Review and update thesis status for your advisees."
      />

      <div className="space-y-4">
        {theses.map((thesis) => {
          const isOpen = openId === thesis.thesis_id;

          return (
            <Card key={thesis.thesis_id}>
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 space-y-2">
                    <h2 className="break-words text-base font-semibold sm:text-lg">
                      {thesis.title}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{thesis.status}</Badge>
                      <Badge variant="secondary">
                        Created {new Date(thesis.created_at).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => toggleView(thesis.thesis_id)}
                    className="w-full sm:w-auto"
                  >
                    {isOpen ? (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        Hide Details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        View Details
                      </>
                    )}
                  </Button>
                </div>

                {isOpen && (
                  <div className="mt-5 space-y-5 border-t pt-5">
                    <section className="space-y-3">
                      <h3 className="text-sm font-semibold">Students</h3>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <Info
                          label="Student 1"
                          value={`${thesis.student1_name || "N/A"} (${
                            thesis.student1_idno || "N/A"
                          })`}
                        />
                        <Info
                          label="Student 2"
                          value={`${thesis.student2_name || "N/A"} (${
                            thesis.student2_idno || "N/A"
                          })`}
                        />
                        <Info
                          label="Student 3"
                          value={`${thesis.student3_name || "N/A"} (${
                            thesis.student3_idno || "N/A"
                          })`}
                        />
                      </div>
                    </section>

                    <section className="space-y-3">
                      <h3 className="text-sm font-semibold">Update Status</h3>
                      <Select
                        value={thesis.status}
                        onChange={(e) =>
                          handleStatusChange(thesis.thesis_id, e.target.value)
                        }
                        className="md:max-w-md"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </Select>
                    </section>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <Info
                        label="Created"
                        value={new Date(thesis.created_at).toLocaleString()}
                      />
                      <Info
                        label="Updated"
                        value={new Date(thesis.updated_at).toLocaleString()}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdviseeThesis;

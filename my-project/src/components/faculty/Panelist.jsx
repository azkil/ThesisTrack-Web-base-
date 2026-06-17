import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  FileText,
  GraduationCap,
  Users,
} from "lucide-react";

export default function PanelistDefenseTable() {
  const [form2bData, setForm2bData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);

  const facultyId = Number(localStorage.getItem("faculty_id"));

  useEffect(() => {
    const fetchPanelistForms = async () => {
      try {
        if (!facultyId) return;

        const res = await axios.get(
          `http://localhost:3001/api/form2b/panel/${facultyId}`
        );

        setForm2bData(res.data || []);
      } catch (err) {
        console.error("Error fetching Form2B:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPanelistForms();
  }, [facultyId]);

  const toggleView = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const safe = (value) => {
    if (value === null || value === undefined || value === "") return "N/A";
    return value;
  };

  const formatDate = (date) => {
    if (!date) return "No schedule";
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <Card className="p-6 text-center text-sm text-muted-foreground">
          Loading panelist schedule...
        </Card>
      </div>
    );
  }

  if (!form2bData.length) {
    return (
      <div className="p-4 sm:p-6">
        <Card className="p-8 text-center">
          <ClipboardList className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No scheduled defenses found.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-3 sm:p-4 lg:p-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Panelist Defense Schedule
        </h1>
        <p className="text-sm text-muted-foreground">
          Review assigned defenses and panel details.
        </p>
      </div>

      <div className="space-y-4">
        {form2bData.map((item) => {
          const itemId = item.form2b_id || item.id;
          const isOpen = openId === itemId;
          const title = safe(item.thesis_title || item.capstone_thesis_title);
          const status = safe(item.form_status || item.status);

          return (
            <Card key={itemId} className="overflow-hidden">
              <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 hidden rounded-md border bg-muted p-2 text-muted-foreground sm:block">
                      <GraduationCap className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <h2 className="break-words text-base font-semibold leading-6 text-foreground sm:text-lg">
                        {title}
                      </h2>
                      <p className="mt-1 break-words text-sm text-muted-foreground">
                        Proponents: {safe(item.proponent_name)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge>{safe(item.defense_type)}</Badge>
                    <Badge variant="secondary">{safe(item.department)}</Badge>
                    <Badge variant="outline">{status}</Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4 shrink-0" />
                    <span className="break-words">
                      {formatDate(item.defense_date)}
                    </span>
                  </div>
                </div>

                <Button onClick={() => toggleView(itemId)}>
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
                <div className="border-t bg-muted/30 p-4 sm:p-5">
                  <div className="space-y-6">
                    <Section
                      icon={<FileText className="h-4 w-4" />}
                      title="Thesis Information"
                    >
                      <InfoGrid>
                        <Info label="Title" value={item.thesis_title} />
                        <Info
                          label="Capstone Title"
                          value={item.capstone_thesis_title}
                        />
                        <Info label="Defense Type" value={item.defense_type} />
                        <Info label="Department" value={item.department} />
                        <Info label="School Year" value={item.school_year} />
                        <Info label="Semester" value={item.semester} />
                        <Info label="Thesis Status" value={item.thesis_status} />
                        <Info label="Form Status" value={item.form_status} />
                      </InfoGrid>
                    </Section>

                    <Section icon={<Users className="h-4 w-4" />} title="Proponents">
                      <InfoGrid>
                        <Info
                          label="Student 1"
                          value={`${safe(item.student1_name)} (${safe(
                            item.student1_idno
                          )})`}
                        />
                        <Info
                          label="Student 2"
                          value={`${safe(item.student2_name)} (${safe(
                            item.student2_idno
                          )})`}
                        />
                        <Info
                          label="Student 3"
                          value={`${safe(item.student3_name)} (${safe(
                            item.student3_idno
                          )})`}
                        />
                      </InfoGrid>
                    </Section>

                    <Section icon={<Users className="h-4 w-4" />} title="Panel Members">
                      <InfoGrid>
                        <Info label="Adviser" value={item.adviser_name} />
                        <Info
                          label="Chairperson"
                          value={item.chairperson_name}
                        />
                        <Info label="Member 1" value={item.member1_name} />
                        <Info label="Member 2" value={item.member2_name} />
                        <Info label="Secretary" value={item.secretary_name} />
                      </InfoGrid>
                    </Section>

                    <Section
                      icon={<ClipboardList className="h-4 w-4" />}
                      title="Thesis Details"
                    >
                      <div className="grid grid-cols-1 gap-3">
                        <Info label="Description" value={item.description} />
                        <Info
                          label="Problem Statement"
                          value={item.problem_stmt}
                        />
                        <Info label="Objectives" value={item.objectives} />
                      </div>
                    </Section>

                    <Section
                      icon={<ClipboardList className="h-4 w-4" />}
                      title="System Information"
                    >
                      <InfoGrid>
                        <Info label="Thesis ID" value={item.thesis_id} />
                        <Info label="Posted By" value={item.posted_by} />
                        <Info
                          label="Created At"
                          value={formatDate(item.created_at)}
                        />
                        <Info
                          label="Updated At"
                          value={formatDate(item.updated_at)}
                        />
                      </InfoGrid>
                    </Section>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Card({ className = "", children }) {
  return (
    <div
      className={`rounded-lg border border-border bg-card text-card-foreground shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function Button({ className = "", children, ...props }) {
  return (
    <button
      className={`inline-flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50 sm:w-auto ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function Badge({ variant = "default", children }) {
  const styles = {
    default: "border-transparent bg-slate-900 text-white",
    secondary: "border-transparent bg-slate-100 text-slate-900",
    outline: "border-slate-200 bg-white text-slate-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[variant]}`}
    >
      {children}
    </span>
  );
}

function Section({ icon, title, children }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <span className="text-muted-foreground">{icon}</span>
        <h3>{title}</h3>
      </div>
      {children}
    </section>
  );
}

function InfoGrid({ children }) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {children}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-md border border-border bg-background p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 break-words text-sm leading-6 text-foreground">
        {value || "N/A"}
      </p>
    </div>
  );
}

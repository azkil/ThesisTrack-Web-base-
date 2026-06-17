import { NavLink } from "react-router-dom";
import { FileText } from "lucide-react";
import { Card, CardContent, PageHeader } from "../ui";

export default function FormSubmission() {
  const forms = [
    { id: "2a", name: "Form 2A - Capstone/Thesis Advisory Acceptance" },
    { id: "2b", name: "Form 2B - Application for Capstone/Thesis Defense" },
    { id: "2c", name: "Form 2C - Request for Change of Adviser/Panel Member" },
    { id: "2d", name: "Form 2D - Completion of Requirements" },
    { id: "2e", name: "Form 2E - Oral Examination Comments Sheet" },
    { id: "2f", name: "Form 2F - Oral Examination Revisions Matrix" },
    { id: "2g", name: "Form 2G - Oral Examination Rating Sheet" },
    { id: "2h", name: "Form 2H - Oral Examination Summary Sheet" },
    { id: "2i", name: "Form 2I - Oral Examination Report" },
    { id: "2j", name: "Form 2J - Approval for Binding of Thesis" },
    { id: "2k", name: "Form 2K - Hardbound Thesis Distribution Form" },
  ];

  return (
    <div className="space-y-4 p-3 sm:p-4 lg:p-6">
      <PageHeader
        title="Forms Submission"
        description="Select a form to fill out and submit."
      />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {forms.map((form) => (
          <NavLink key={form.id} to={`/student/forms/${form.id}`}>
            {({ isActive }) => (
              <Card
                className={`transition-colors hover:bg-muted/60 ${
                  isActive ? "border-slate-900 bg-muted" : ""
                }`}
              >
                <CardContent className="flex items-start gap-3 p-4">
                  <div className="rounded-md border bg-background p-2 text-muted-foreground">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      Form {form.id.toUpperCase()}
                    </p>
                    <p className="mt-1 break-words text-sm text-muted-foreground">
                      {form.name.replace(/^Form \w+ - /, "")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

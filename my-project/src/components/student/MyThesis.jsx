import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardContent,
  Field,
  Input,
  PageHeader,
  Select,
  Textarea,
} from "../ui";

export default function MyThesis() {
  const API_BASE = "http://localhost:3001/api/theses";
  const studentId = localStorage.getItem("student_id");

  const [thesisId, setThesisId] = useState(null);
  const [advisers, setAdvisers] = useState([]);
  const [formData, setFormData] = useState({
    faculty_id: "",
    adviser_name: "",
    student1_name: "",
    student1_idno: "",
    student2_name: "",
    student2_idno: "",
    student3_name: "",
    student3_idno: "",
    title: "Enter your thesis title here",
    description: "Brief description of your project",
    problem_stmt: "Describe the problem statement",
    objectives: "List your objectives",
    status: "Acceptance waiting to adviser",
  });

  useEffect(() => {
    const fetchAdvisers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3001/api/faculty/advisers/list"
        );
        setAdvisers(res.data);
      } catch (err) {
        console.error("Error fetching advisers:", err);
      }
    };
    fetchAdvisers();
  }, []);

  useEffect(() => {
    if (!studentId) return;

    const fetchThesis = async () => {
      try {
        const res = await axios.get(`${API_BASE}/student/${studentId}`);
        const thesis = Array.isArray(res.data) ? res.data[0] : res.data;

        if (thesis) {
          setThesisId(thesis.thesis_id);
          setFormData({
            faculty_id: thesis.faculty_id?.toString() || "",
            adviser_name: thesis.adviser_name || "",
            student1_name: thesis.student1_name || "",
            student1_idno: thesis.student1_idno || "",
            student2_name: thesis.student2_name || "",
            student2_idno: thesis.student2_idno || "",
            student3_name: thesis.student3_name || "",
            student3_idno: thesis.student3_idno || "",
            title: thesis.title || "",
            description: thesis.description || "",
            problem_stmt: thesis.problem_stmt || "",
            objectives: thesis.objectives || "",
            status: thesis.status || "Acceptance waiting to adviser",
          });
        }
      } catch (err) {
        console.error("Error fetching thesis:", err);
      }
    };

    fetchThesis();
  }, [studentId]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAdviserChange = (e) => {
    const facultyId = e.target.value;
    const selected = advisers.find(
      (a) => a.faculty_id?.toString() === facultyId
    );

    setFormData((prev) => ({
      ...prev,
      faculty_id: facultyId,
      adviser_name: selected ? selected.full_name : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!studentId) {
      alert("Student not logged in.");
      return;
    }

    const payload = {
      ...formData,
      student_id: parseInt(studentId),
    };

    try {
      if (thesisId) {
        await axios.put(`${API_BASE}/${thesisId}`, payload);
        alert("Thesis updated successfully.");
      } else {
        const res = await axios.post(API_BASE, payload);
        setThesisId(res.data.thesis_id);
        alert("Thesis submitted successfully.");
      }
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save thesis.");
    }
  };

  return (
    <div className="space-y-4 p-3 sm:p-4 lg:p-6">
      <PageHeader
        title="My Thesis Information"
        description="Manage your thesis details, adviser, and group members."
      />

      <Card>
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Field label="Adviser">
              <Select
                name="faculty_id"
                value={formData.faculty_id}
                onChange={handleAdviserChange}
              >
                <option value="">Select adviser</option>
                {advisers.map((adv) => (
                  <option key={adv.faculty_id} value={adv.faculty_id}>
                    {adv.full_name} ({adv.department})
                  </option>
                ))}
              </Select>
            </Field>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                { name: "student1_name", label: "Student 1 Name" },
                { name: "student2_name", label: "Student 2 Name" },
                { name: "student3_name", label: "Student 3 Name" },
                { name: "student1_idno", label: "Student 1 ID No." },
                { name: "student2_idno", label: "Student 2 ID No." },
                { name: "student3_idno", label: "Student 3 ID No." },
              ].map((field) => (
                <Field key={field.name} label={field.label}>
                  <Input
                    type="text"
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                  />
                </Field>
              ))}
            </div>

            <Field label="Thesis Title">
              <Input name="title" value={formData.title} onChange={handleChange} />
            </Field>

            <Field label="Description">
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Field>

            <Field label="Problem Statement">
              <Textarea
                name="problem_stmt"
                value={formData.problem_stmt}
                onChange={handleChange}
              />
            </Field>

            <Field label="Objectives">
              <Textarea
                name="objectives"
                value={formData.objectives}
                onChange={handleChange}
              />
            </Field>

            <Field label="Status">
              <Input value={formData.status} readOnly className="bg-muted" />
            </Field>

            <div className="flex justify-end">
              <Button type="submit" className="w-full sm:w-auto">
                {thesisId ? "Update Thesis" : "Submit Thesis"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

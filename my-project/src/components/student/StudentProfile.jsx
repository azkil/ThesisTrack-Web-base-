import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, CardContent, Field, Input, PageHeader } from "../ui";

export default function ProfileEdit() {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    full_name: "",
    department: "",
    student_no: "",
    is_active: true,
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const studentId = localStorage.getItem("student_id");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/students/${studentId}`);
        setProfile({ ...res.data, password: "" });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [studentId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile({ ...profile, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...profile };
      if (!payload.password) {
        const currentRes = await axios.get(`http://localhost:3001/api/students/${studentId}`);
        payload.password = currentRes.data.password;
      }
      const res = await axios.put(`http://localhost:3001/api/students/${studentId}`, payload);
      setProfile({ ...res.data, password: "" });
      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      setMessage("Update failed.");
    }
  };

  if (loading) return <p className="p-6 text-sm text-muted-foreground">Loading profile...</p>;

  return (
    <div className="space-y-4 p-3 sm:p-4 lg:p-6">
      <PageHeader title="Student Profile" description="Update your account details." />

      <Card className="mx-auto max-w-2xl">
        <CardContent className="p-4 sm:p-6">
          {message && (
            <div className="mb-4 rounded-md border border-border bg-muted/40 px-3 py-2 text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Username">
              <Input name="username" value={profile.username} onChange={handleChange} required />
            </Field>
            <Field label="Full Name">
              <Input name="full_name" value={profile.full_name} onChange={handleChange} required />
            </Field>
            <Field label="Email">
              <Input type="email" name="email" value={profile.email} onChange={handleChange} required />
            </Field>
            <Field label="Department">
              <Input name="department" value={profile.department} onChange={handleChange} />
            </Field>
            <Field label="Student No">
              <Input name="student_no" value={profile.student_no} disabled />
            </Field>
            <Field label="Password">
              <Input
                type="password"
                name="password"
                value={profile.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current"
              />
            </Field>

            <label className="flex items-center gap-2 text-sm md:col-span-2">
              <input
                type="checkbox"
                name="is_active"
                checked={profile.is_active}
                onChange={handleChange}
                className="h-4 w-4"
              />
              Active
            </label>

            <div className="md:col-span-2">
              <Button type="submit" className="w-full sm:w-auto">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

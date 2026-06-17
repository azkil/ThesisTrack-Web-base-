import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserPlus } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  Input,
} from "../components/ui";

export default function StudentSignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    department: "",
    student_id: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      username,
      email,
      password,
      confirmPassword,
      first_name,
      last_name,
      department,
      student_id,
    } = formData;

    if (
      !username ||
      !email ||
      !password ||
      !confirmPassword ||
      !first_name ||
      !last_name
    ) {
      setError("Please fill in all required fields.");
      setSuccess("");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setSuccess("");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/api/students", {
        username,
        email,
        password,
        full_name: `${first_name} ${last_name}`,
        department: department || null,
        student_no: student_id || null,
      });

      if (response.status === 201 || response.status === 200) {
        setSuccess("Registration successful. Redirecting to login...");
        setError("");
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          first_name: "",
          last_name: "",
          department: "",
          student_id: "",
        });
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Something went wrong. Try again.");
      setSuccess("");
    }
  };

  return (
    <main className="min-h-screen bg-muted/40 p-4 sm:p-6">
      <Card className="mx-auto w-full max-w-3xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-md bg-slate-900 text-white">
            <UserPlus className="h-5 w-5" />
          </div>
          <CardTitle>Student Registration</CardTitle>
          <CardDescription>Create your student portal account.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Username">
              <Input name="username" value={formData.username} onChange={handleChange} required />
            </Field>
            <Field label="Email">
              <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </Field>
            <Field label="Password">
              <Input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </Field>
            <Field label="Confirm Password">
              <Input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
            </Field>
            <Field label="First Name">
              <Input name="first_name" value={formData.first_name} onChange={handleChange} required />
            </Field>
            <Field label="Last Name">
              <Input name="last_name" value={formData.last_name} onChange={handleChange} required />
            </Field>
            <Field label="Department">
              <Input name="department" value={formData.department} onChange={handleChange} />
            </Field>
            <Field label="Student ID">
              <Input name="student_id" value={formData.student_id} onChange={handleChange} />
            </Field>

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 md:col-span-2">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 md:col-span-2">
                {success}
              </div>
            )}

            <div className="grid gap-3 md:col-span-2">
              <Button type="submit" className="w-full">
                Register
              </Button>
              <Button variant="outline" asChild type="button" className="w-full">
                <Link to="/login">Back to login</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

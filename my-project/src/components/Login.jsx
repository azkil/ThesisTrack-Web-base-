import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LogIn } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  Input,
} from "./ui";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await axios.post("http://localhost:3001/api/login", formData);
      const user = res.data.user;

      if (!user) throw new Error("Invalid server response.");

      if (user.role === "student") {
        localStorage.setItem("student_id", user.student_id);
      } else if (user.role === "faculty" || user.role === "admin") {
        localStorage.setItem("faculty_id", user.faculty_id);
      }

      localStorage.setItem("username", user.username);
      localStorage.setItem("role", user.role);
      localStorage.setItem("full_name", user.full_name);

      switch (user.role) {
        case "student":
          navigate("/student");
          break;
        case "faculty":
          navigate("/faculty");
          break;
        case "admin":
          navigate("/admin");
          break;
        default:
          alert("Unknown role. Please contact the administrator.");
      }
    } catch (err) {
      console.error("Login failed:", err.response?.data?.message || err.message);
      setErrorMsg("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-md bg-slate-900 text-white">
            <LogIn className="h-5 w-5" />
          </div>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to continue.</CardDescription>
        </CardHeader>

        <CardContent>
          {errorMsg && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Field label="Username">
              <Input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Field>

            <Field label="Password">
              <Input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Field>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Need an account?{" "}
            <Link to="/signUp" className="font-medium text-foreground underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

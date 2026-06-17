import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const navItems = [
  { to: "/student/thesis", label: "My Thesis", icon: "📋" },
  { to: "/student/forms", label: "Forms Submission", icon: "📝" },
  { to: "/student/formsUpload", label: "Upload Forms", icon: "📤" },
  { to: "/student/formsView", label: "Uploaded Forms", icon: "📂" },
  { to: "/student/Profile", label: "Student Profile", icon: "👤" },
];

const API_BASE = "http://localhost:3001/api";

export default function StudentSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileName, setProfileName] = useState("Student User");
  const [program, setProgram] = useState("");

  const studentId = localStorage.getItem("student_id");

  useEffect(() => {
    if (!studentId) return;

    const fetchStudentData = async () => {
      try {
        const res = await axios.get(`${API_BASE}/students/${studentId}`);
        setProfileName(res.data.full_name);
        setProgram(res.data.program);
      } catch (err) {
        console.error("Error fetching student:", err);
        setProfileName("Student User");
        setProgram("");
      }
    };

    fetchStudentData();
  }, [studentId]);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-gray-800 bg-gray-900 px-4 text-white shadow-lg md:hidden">
        <span className="truncate text-sm font-semibold">Thesis Management</span>
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="rounded-md bg-gray-800 px-3 py-2 text-sm text-white"
          aria-expanded={isOpen}
          aria-controls="student-sidebar"
        >
          {isOpen ? "Close" : "Menu"}
        </button>
      </div>

      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          aria-label="Close student navigation"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        id="student-sidebar"
        className={`fixed left-0 top-0 z-50 flex h-dvh w-72 max-w-[85vw] flex-col bg-gray-900 p-4 text-white shadow-xl transition-transform duration-300 md:sticky md:top-0 md:z-auto md:h-screen md:w-64 md:max-w-none md:translate-x-0 md:p-6 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-4 rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-4 shadow-xl md:mb-8 md:p-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white shadow-md">
                {profileName?.charAt(0).toUpperCase()}
              </div>
              <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-gray-900 bg-green-500" />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold text-white">{profileName}</h2>
              <p className="mt-1 text-xs text-green-400">Online</p>
            </div>
          </div>

          {program && <p className="mt-4 text-sm text-gray-300">{program} Program</p>}

          <p className="mt-3 text-xs tracking-wide text-gray-500">
            Thesis Management System
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-2 overflow-y-auto">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-base transition-all duration-200 ${
                  isActive
                    ? "bg-gray-800 font-semibold text-white shadow-md"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <span className="text-lg">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-4 border-t border-gray-700 pt-4">
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-red-400 transition-colors hover:bg-gray-800"
          >
            <span>🚪</span>
            <span>Logout</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
}

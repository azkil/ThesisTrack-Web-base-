import { Outlet } from "react-router-dom";
import FacultySidebar from "../components/sidebar/FacultySidebar";

export default function FacultyHome() {
  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      {/* ===== Sidebar ===== */}
      <FacultySidebar />

      {/* ===== Main Content Area ===== */}
      <main className="min-w-0 flex-1 overflow-y-auto p-3 pt-20 sm:p-4 sm:pt-20 md:p-4 md:pt-4 lg:p-6">
        <Outlet />
      </main>
    </div>
  );
}

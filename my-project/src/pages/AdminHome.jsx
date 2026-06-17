import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/sidebar/AdminSidebar";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      <AdminSidebar />

      {/* Main content */}
      <main className="min-w-0 flex-1 overflow-y-auto p-3 pt-20 sm:p-4 sm:pt-20 md:p-4 md:pt-4 lg:p-6">
        <Outlet />
      </main>
    </div>
  );
}

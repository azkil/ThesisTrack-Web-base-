import { Outlet } from 'react-router-dom';
import StudentSidebar from '../components/sidebar/StudentSidebar';

export default function StudentDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      <StudentSidebar />

      <main className="min-w-0 flex-1 p-3 pt-20 sm:p-4 sm:pt-20 md:p-4 md:pt-4 lg:p-6">
        <Outlet />
      </main>
    </div>
  );
}

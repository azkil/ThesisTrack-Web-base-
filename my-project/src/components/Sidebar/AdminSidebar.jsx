import { NavLink } from "react-router-dom";
import { useState } from "react";

const navItems = [
  { to: "/admin/dashboard", label: "Thesis List", icon: "📊" },
  { to: "/admin/students", label: "Student List", icon: "🎓" },
  { to: "/admin/faculty", label: "Faculty List", icon: "👨‍🏫" },
];

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-gray-800 bg-gray-900 px-4 text-white shadow-lg md:hidden">
        <span className="truncate text-sm font-semibold">Admin Portal</span>
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="rounded-md bg-gray-800 px-3 py-2 text-sm text-white"
          aria-expanded={isOpen}
          aria-controls="admin-sidebar"
        >
          {isOpen ? "Close" : "Menu"}
        </button>
      </div>

      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          aria-label="Close admin navigation"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        id="admin-sidebar"
        className={`fixed left-0 top-0 z-50 flex h-dvh w-72 max-w-[85vw] flex-col bg-gray-900 p-4 text-white shadow-xl transition-transform duration-300 md:sticky md:top-0 md:z-auto md:h-screen md:w-64 md:max-w-none md:translate-x-0 md:p-6 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h2 className="mb-4 text-xl font-bold md:mb-8 md:text-2xl">
          Admin Portal
        </h2>

        <nav className="flex flex-1 flex-col gap-2 overflow-y-auto">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  isActive
                    ? "bg-gray-800 font-semibold text-white"
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

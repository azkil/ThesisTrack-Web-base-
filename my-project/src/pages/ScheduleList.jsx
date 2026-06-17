import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Trash2,
  Edit,
  Filter,
  Search,
  PlusCircle,
} from "lucide-react";

export default function ScheduleList() {
  // -----------------------------
  // Mock Data
  // -----------------------------
  const mockEvents = [
    {
      id: 1,
      title: "Proposal Defense",
      category: "Proposal",
      date: "2025-06-20",
      time: "08:00 AM",
      venue: "Room 201",
    },
    {
      id: 2,
      title: "Final Defense",
      category: "Final",
      date: "2025-07-02",
      time: "01:00 PM",
      venue: "Room 305",
    },
    {
      id: 3,
      title: "Thesis Consultation",
      category: "Meeting",
      date: "2025-06-22",
      time: "10:00 AM",
      venue: "MS Teams",
    },
  ];

  const [events] = useState(mockEvents);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [activeTab, setActiveTab] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // -----------------------------
  // Filter + Search Events
  // -----------------------------
  const filteredEvents = events.filter((event) => {
    const matchCategory =
      filterCategory === "All" || event.category === filterCategory;

    const matchSearch =
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.category.toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  // -----------------------------
  // Open Add/Edit Modal
  // -----------------------------
  const openModal = (event = null) => {
    setEditingEvent(event);
    setModalOpen(true);
  };

  const closeModal = () => {
    setEditingEvent(null);
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 p-3 sm:p-4 lg:p-6">

      {/* ----------------------- */}
      {/* HEADER */}
      {/* ----------------------- */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">📅 Schedule List</h1>

        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          <PlusCircle size={18} /> Add Schedule
        </button>
      </div>

      {/* ----------------------- */}
      {/* TABS */}
      {/* ----------------------- */}
      <div className="flex gap-3 border-b pb-2">
        {[
          { id: "week", label: "Weekly List" },
          { id: "month", label: "Monthly List" },
          { id: "year", label: "Yearly List" },
          { id: "all", label: "All Events" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-md ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ----------------------- */}
      {/* SEARCH + FILTER */}
      {/* ----------------------- */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute top-2 left-2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search schedule..."
            className="w-full rounded-lg border py-2 pl-10 pr-4 sm:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-600" />
          <select
            className="border py-2 px-3 rounded-lg"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option>All</option>
            <option>Proposal</option>
            <option>Final</option>
            <option>Meeting</option>
          </select>
        </div>
      </div>

      {/* ----------------------- */}
      {/* TABLE */}
      {/* ----------------------- */}
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-left">Venue</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredEvents.map((event) => (
              <tr key={event.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{event.title}</td>
                <td className="p-3">{event.category}</td>
                <td className="p-3">{event.date}</td>
                <td className="p-3">{event.time}</td>
                <td className="p-3">{event.venue}</td>
                <td className="p-3 flex justify-center gap-3">
                  <button
                    onClick={() => openModal(event)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={20} />
                  </button>

                  <button className="text-red-600 hover:text-red-800">
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}

            {filteredEvents.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-5 text-gray-500">
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ----------------------- */}
      {/* PAGINATION (UI Only) */}
      {/* ----------------------- */}
      <div className="flex justify-end items-center gap-3 pt-4">
        <button className="px-3 py-1 border rounded">Prev</button>
        <button className="px-3 py-1 border rounded bg-blue-600 text-white">
          1
        </button>
        <button className="px-3 py-1 border rounded">Next</button>
      </div>

      {/* ----------------------- */}
      {/* MODAL UI */}
      {/* ----------------------- */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-4 shadow-lg sm:p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingEvent ? "Edit Event" : "Add Event"}
            </h2>

            <div className="space-y-3">
              <input className="border p-2 w-full rounded" placeholder="Title" />
              <select className="border p-2 w-full rounded">
                <option>Proposal</option>
                <option>Final</option>
                <option>Meeting</option>
              </select>
              <input type="date" className="border p-2 w-full rounded" />
              <input type="time" className="border p-2 w-full rounded" />
              <input className="border p-2 w-full rounded" placeholder="Venue" />
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button onClick={closeModal} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

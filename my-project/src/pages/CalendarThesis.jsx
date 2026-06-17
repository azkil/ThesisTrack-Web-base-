import React, { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  isSameMonth,
} from "date-fns";

export default function CalendarThesis() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month"); // month | week
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Proposal Defense - Group 12",
      date: new Date(),
      type: "proposal",
    },
    {
      id: 2,
      title: "Final Defense - Group 4",
      date: addDays(new Date(), 3),
      type: "final",
    },
  ]);

  // Event colors
  const eventColors = {
    proposal: "bg-blue-500",
    final: "bg-green-500",
    meeting: "bg-purple-500",
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const nextMonth = () => setCurrentDate(addDays(endOfMonth(currentDate), 1));
  const prevMonth = () => setCurrentDate(addDays(startOfMonth(currentDate), -1));

  const nextWeek = () => setCurrentDate(addDays(currentDate, 7));
  const prevWeek = () => setCurrentDate(addDays(currentDate, -7));

  // =====================================
  // 📌 Drag & Drop Event Handler
  // =====================================
  const onDragStart = (event, eventData) => {
    event.dataTransfer.setData("eventId", eventData.id);
  };

  const onDrop = (e, day) => {
    const eventId = e.dataTransfer.getData("eventId");
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id == eventId ? { ...ev, date: day } : ev
      )
    );
  };

  const allowDrop = (e) => e.preventDefault();

  // ============================
  // 📌 Monthly Header
  // ============================
  const renderHeader = () => (
    <div className="flex justify-between items-center py-4 px-6 bg-gray-100 shadow rounded-lg mb-4">
      <button
        onClick={view === "month" ? prevMonth : prevWeek}
        className="px-3 py-1 bg-gray-300 rounded"
      >
        Prev
      </button>

      <h2 className="text-xl font-semibold">
        {format(currentDate, view === "month" ? "MMMM yyyy" : "'Week of' MMM d")}
      </h2>

      <button
        onClick={view === "month" ? nextMonth : nextWeek}
        className="px-3 py-1 bg-gray-300 rounded"
      >
        Next
      </button>

      <div className="flex gap-2 ml-4">
        <button
          onClick={() => setView("month")}
          className={`px-3 py-1 rounded ${
            view === "month" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Month
        </button>
        <button
          onClick={() => setView("week")}
          className={`px-3 py-1 rounded ${
            view === "week" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Week
        </button>
      </div>
    </div>
  );

  // ============================
  // 📌 Render Weekday Names
  // ============================
  const renderDays = () => {
    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return (
      <div className="grid grid-cols-7 text-gray-700 font-semibold mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center py-2">
            {day}
          </div>
        ))}
      </div>
    );
  };

  // ============================
  // 📌 Monthly Grid
  // ============================
  const renderMonthCells = () => {
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const dayEvents = events.filter((e) =>
          isSameDay(new Date(e.date), cloneDay)
        );

        days.push(
          <div
            key={day}
            onDrop={(e) => onDrop(e, cloneDay)}
            onDragOver={allowDrop}
            className={`p-3 h-28 border cursor-pointer overflow-auto 
              ${
                !isSameMonth(day, monthStart)
                  ? "bg-gray-100 text-gray-400"
                  : "bg-white"
              }
              ${isSameDay(day, new Date()) ? "border-blue-500" : ""}`}
          >
            <span className="font-semibold">{format(day, "d")}</span>

            {/* Events */}
            <div className="mt-2 space-y-1">
              {dayEvents.map((ev) => (
                <div
                  key={ev.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, ev)}
                  className={`text-white text-xs p-1 rounded ${
                    eventColors[ev.type]
                  }`}
                >
                  {ev.title}
                </div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }

      rows.push(
        <div key={day} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }

    return <div>{rows}</div>;
  };

  // ============================
  // 📌 Weekly View
  // ============================
  const renderWeekCells = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const week = Array(7)
      .fill(null)
      .map((_, i) => addDays(weekStart, i));

    return (
      <div className="grid grid-cols-7">
        {week.map((day) => {
          const dayEvents = events.filter((e) =>
            isSameDay(new Date(e.date), day)
          );

          return (
            <div
              key={day}
              onDrop={(e) => onDrop(e, day)}
              onDragOver={allowDrop}
              className={`p-3 h-64 border bg-white`}
            >
              <span className="font-semibold">{format(day, "EEE d")}</span>

              <div className="mt-2 space-y-2">
                {dayEvents.map((ev) => (
                  <div
                    key={ev.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, ev)}
                    className={`text-white text-sm p-2 rounded ${
                      eventColors[ev.type]
                    }`}
                  >
                    {ev.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // ============================
  // 📌 Monthly List
  // ============================
  const renderMonthlyList = () => {
    const monthlyEvents = events.filter((ev) =>
      isSameMonth(new Date(ev.date), currentDate)
    );

    return (
      <div className="mt-8 bg-white p-4 shadow rounded-lg">
        <h3 className="text-lg font-bold mb-2">📅 Monthly List</h3>

        {monthlyEvents.length === 0 ? (
          <p>No events this month.</p>
        ) : (
          <ul className="space-y-2">
            {monthlyEvents.map((ev) => (
              <li key={ev.id} className="border p-2 rounded">
                <div className="font-semibold">
                  {format(new Date(ev.date), "MMM dd")}
                </div>
                <div>{ev.title}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  // ============================
  // 📌 Yearly List
  // ============================
  const renderYearlyList = () => {
    const year = currentDate.getFullYear();
    const yearlyEvents = events.filter(
      (ev) => new Date(ev.date).getFullYear() === year
    );

    return (
      <div className="mt-8 bg-white p-4 shadow rounded-lg">
        <h3 className="text-lg font-bold mb-2">📘 Yearly List ({year})</h3>

        {yearlyEvents.length === 0 ? (
          <p>No events this year.</p>
        ) : (
          <ul className="space-y-2">
            {yearlyEvents.map((ev) => (
              <li key={ev.id} className="border p-2 rounded">
                <div className="font-semibold">
                  {format(new Date(ev.date), "MMM dd")}
                </div>
                <div>{ev.title}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      {renderHeader()}
      {renderDays()}
      {view === "month" ? renderMonthCells() : renderWeekCells()}

      {/* NEW: Monthly List */}
      {renderMonthlyList()}

      {/* NEW: Yearly List */}
      {renderYearlyList()}
    </div>
  );
}

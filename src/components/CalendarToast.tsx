import React from "react";

interface CalendarProps {
  month?: number; // 0-indexed
  year?: number;
  fullYear?: boolean;
  onClose: () => void;
}

const CalendarView: React.FC<CalendarProps> = ({
  month,
  year,
  fullYear,
  onClose,
}) => {
  const now = new Date();
  const targetYear = year ?? now.getFullYear();
  const targetMonth = month ?? now.getMonth();

  const renderMonth = (m: number, y: number) => {
    const date = new Date(y, m, 1);
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const firstDay = date.getDay();
    const monthName = date.toLocaleString("default", { month: "long" });

    const days = [];
    // Padding for first day of week
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }
    // Days of the month
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday =
        y === now.getFullYear() && m === now.getMonth() && d === now.getDate();
      days.push(
        <div
          key={d}
          className={`p-1 text-center rounded-none text-[10px] font-mono ${isToday ? "bg-blue-600 text-white font-bold" : "text-slate-300 hover:bg-slate-800"}`}
        >
          {d}
        </div>,
      );
    }

    return (
      <div
        key={`${y}-${m}`}
        className="p-2 bg-black border border-slate-800"
      >
        <div className="text-center font-bold text-slate-100 mb-1 uppercase tracking-widest text-[10px]">
          {monthName} {y}
        </div>
        <div className="grid grid-cols-7 gap-1 text-[8px] text-slate-500 font-bold mb-1 uppercase tracking-tighter">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="text-center">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">{days}</div>
      </div>
    );
  };

  return (
    <div className="bg-black border border-slate-700 p-3 w-full animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xs font-bold text-white font-mono tracking-tight uppercase">
          {fullYear ? `Calendar ${targetYear}` : "Calendar"}
        </h2>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-white transition-colors text-[10px] font-mono border border-slate-800 px-1"
        >
          [X]
        </button>
      </div>

      {fullYear ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {Array.from({ length: 12 }, (_, i) => renderMonth(i, targetYear))}
        </div>
      ) : (
        renderMonth(targetMonth, targetYear)
      )}
    </div>
  );
};

export default CalendarView;

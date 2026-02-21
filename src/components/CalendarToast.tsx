import React, { useEffect } from "react";

interface CalendarProps {
  month?: number; // 0-indexed
  year?: number;
  fullYear?: boolean;
  onClose: () => void;
}

const CalendarToast: React.FC<CalendarProps> = ({
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
          className={`p-2 text-center rounded-md text-xs font-mono ${isToday ? "bg-blue-600 text-white font-bold" : "text-slate-300 hover:bg-slate-800"}`}
        >
          {d}
        </div>,
      );
    }

    return (
      <div
        key={`${y}-${m}`}
        className="p-4 bg-neutral-900  border border-slate-800 shadow-xl"
      >
        <div className="text-center font-bold text-slate-100 mb-2 uppercase tracking-widest text-sm">
          {monthName} {y}
        </div>
        <div className="grid grid-cols-7 gap-1 text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-tighter">
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

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className={`bg-neutral-950 border border-slate-800  shadow-2xl max-h-[90vh] overflow-y-auto p-6 scrollbar-hide ${fullYear ? "max-w-5xl" : "max-w-md"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white font-mono tracking-tight">
            {fullYear ? `Calendar ${targetYear}` : "Calendar"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors text-sm font-mono"
          >
            [CLOSE ESC]
          </button>
        </div>

        {fullYear ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }, (_, i) => renderMonth(i, targetYear))}
          </div>
        ) : (
          renderMonth(targetMonth, targetYear)
        )}
      </div>
    </div>
  );
};

export default CalendarToast;

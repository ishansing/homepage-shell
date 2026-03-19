import React from "react";

interface CalendarProps {
  month?: number; // 0-indexed (0 = Jan, 11 = Dec)
  year?: number;
  fullYear?: boolean; // If true, renders a 12-month grid
  onClose: () => void;
}

/**
 * COMPONENT: Calendar View
 * A programmatic calendar renderer that supports single-month and full-year views.
 */
const CalendarView: React.FC<CalendarProps> = ({
  month,
  year,
  fullYear,
  onClose,
}) => {
  const now = new Date();
  const targetYear = year ?? now.getFullYear();
  const targetMonth = month ?? now.getMonth();

  /**
   * RENDERER: Single Month
   * Calculates the grid layout for a specific month/year combination.
   */
  const renderMonth = (m: number, y: number) => {
    const date = new Date(y, m, 1);
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const firstDay = date.getDay(); // 0 (Sun) to 6 (Sat)
    const monthName = date.toLocaleString("default", { month: "long" });

    const days = [];
    
    // 1. PADDING: Empty blocks for days before the 1st of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }
    
    // 2. CALENDAR DAYS: Actual numbers 1 through N
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday =
        y === now.getFullYear() && m === now.getMonth() && d === now.getDate();
        
      days.push(
        <div
          key={d}
          className={`p-1 text-center rounded-none text-[10px] font-bebas transition-colors ${
            isToday ? "bg-accent text-white font-bold" : "text-slate-500 hover:bg-accent/20 hover:text-white"
          }`}
        >
          {d}
        </div>,
      );
    }

    return (
      <div
        key={`${y}-${m}`}
        className="p-2 bg-black border border-transparent hover:border-accent/20 transition-colors"
      >
        {/* Month Header */}
        <div className="text-center font-normal text-slate-300 mb-1 uppercase tracking-widest text-[10px] font-bebas">
          {monthName} {y}
        </div>
        {/* Weekday Labels */}
        <div className="grid grid-cols-7 gap-1 text-[8px] text-slate-600 font-normal mb-1 uppercase tracking-tighter font-bebas">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="text-center">
              {day}
            </div>
          ))}
        </div>
        {/* The 7-column Date Grid */}
        <div className="grid grid-cols-7 gap-1">{days}</div>
      </div>
    );
  };

  return (
    <div className="bg-black border border-accent/30 p-3 w-full animate-in fade-in slide-in-from-top-4 duration-300">
      {/* HEADER: Control Bar */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xs font-normal text-slate-200 font-ndot tracking-widest uppercase">
          {fullYear ? `Calendar ${targetYear}` : "Calendar"}
        </h2>
        {/* Simple imperative close trigger */}
        <button
          onClick={onClose}
          className="text-slate-600 hover:text-accent transition-colors text-[10px] font-bebas border border-transparent hover:border-accent/30 px-1"
        >
          [X]
        </button>
      </div>

      {/* BODY: Full Year Grid vs Single Month */}
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

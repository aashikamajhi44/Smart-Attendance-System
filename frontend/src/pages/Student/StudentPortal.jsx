import { useEffect, useMemo, useState } from "react";
import useAuth from "../../hooks/useAuth";
import attendanceService from "../../services/attendanceService";

const StudentPortal = () => {
  const { user, logout } = useAuth();
  const [allRecords, setAllRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monthFilter, setMonthFilter] = useState("all");

  useEffect(() => {
    const fetchMyAttendance = async () => {
      if (!user?.linkedStudentId) {
        setLoading(false);
        return;
      }
      try {
        const data = await attendanceService.getAttendance({
          studentId: user.linkedStudentId,
        });
        setAllRecords(data);
      } catch (err) {
        // fail silently, show empty state
      } finally {
        setLoading(false);
      }
    };
    fetchMyAttendance();
  }, [user]);

  // Distinct months present in the data, most recent first
  const availableMonths = useMemo(() => {
    const set = new Set(allRecords.map((r) => r.date?.slice(0, 7)));
    return Array.from(set).sort().reverse();
  }, [allRecords]);

  const records = useMemo(() => {
    if (monthFilter === "all") return allRecords;
    return allRecords.filter((r) => r.date?.startsWith(monthFilter));
  }, [allRecords, monthFilter]);

  const monthLabel = (ym) => {
    const [y, m] = ym.split("-");
    return new Date(Number(y), Number(m) - 1).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const presentCount = records.filter((r) => r.status === "Present").length;
  const lateCount = records.filter((r) => r.status === "Late").length;
  const absentCount = records.filter((r) => r.status === "Absent").length;
  const totalDays = records.length;
  const attendancePct =
    totalDays > 0 ? Math.round(((presentCount + lateCount) / totalDays) * 100) : null;

  const streak = (() => {
    let count = 0;
    for (const r of allRecords) {
      if (r.status === "Present" || r.status === "Late") count++;
      else break;
    }
    return count;
  })();

  // Last 7 calendar days, most recent record wins per day
  const weekStrip = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const rec = allRecords.find((r) => r.date === dateStr);
      days.push({
        label: d.toLocaleDateString("en-US", { weekday: "narrow" }),
        dateStr,
        status: rec?.status || null,
        isToday: i === 0,
      });
    }
    return days;
  }, [allRecords]);

  const dotColor = (status) => {
    if (status === "Present") return "bg-green-600";
    if (status === "Late") return "bg-orange-500";
    if (status === "Absent") return "bg-red-500";
    return "bg-gray-200";
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const statusBadge = (status) => {
    const map = {
      Present: "bg-green-100 text-green-700",
      Late: "bg-orange-100 text-orange-700",
      Absent: "bg-red-100 text-red-600",
    };
    return map[status] || "bg-gray-100 text-gray-600";
  };

  const handleExport = () => {
    const header = "Date,Time,Status\n";
    const rows = records.map((r) => `${r.date},${r.time},${r.status}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance-${monthFilter === "all" ? "all" : monthFilter}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const firstName = user?.name?.split(" ")[0] || "Student";

  return (
    <div className="min-h-screen bg-green-50/40">
      {/* Topbar */}
      <div className="bg-white border-b border-gray-100 px-6 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-green-700 flex items-center justify-center text-white font-extrabold text-sm">
            SA
          </div>
          <div className="font-bold text-sm text-gray-900 leading-tight">
            Smart Attendance
            <span className="block font-normal text-[11px] text-gray-400">
              Student Portal
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-gray-900">{user?.name}</div>
            <div className="text-[11px] text-gray-400 font-mono">{user?.email}</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm">
            {user?.name?.slice(0, 2).toUpperCase() || "ST"}
          </div>
          <button
            onClick={logout}
            className="text-sm border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50"
          >
            Log out
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 sm:p-8">
        {/* Greeting */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {greeting()}, {firstName} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Here's how your attendance is looking this semester.
          </p>
        </div>

        {/* Hero row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
          {/* Progress ring card */}
          <div className="bg-gradient-to-br from-green-900 via-green-800 to-green-700 rounded-2xl p-6 text-white flex items-center gap-5 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-orange-500/20" />
            <svg className="w-20 h-20 shrink-0 relative" viewBox="0 0 36 36">
              <path
                d="M18 2a16 16 0 1 1 0 32 16 16 0 1 1 0-32"
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="3.2"
              />
              {attendancePct !== null && (
                <path
                  d="M18 2a16 16 0 1 1 0 32 16 16 0 1 1 0-32"
                  fill="none"
                  stroke="#F97316"
                  strokeWidth="3.2"
                  strokeDasharray={`${attendancePct} 100`}
                  strokeLinecap="round"
                  transform="rotate(-90 18 18)"
                />
              )}
              <text x="18" y="21" textAnchor="middle" fontWeight="700" fontSize="8.5" fill="white">
                {loading ? "…" : attendancePct !== null ? `${attendancePct}%` : "—"}
              </text>
            </svg>
            <div className="relative">
              <div className="text-[11px] uppercase tracking-wide text-green-300 font-semibold">
                Overall Attendance
              </div>
              <div className="text-lg font-bold mt-0.5">
                {monthFilter === "all" ? "All Time" : monthLabel(monthFilter)}
              </div>
              {attendancePct !== null && (
                <div className="text-[11px] text-green-200 mt-2 font-mono">
                  {attendancePct >= 75 ? "Above 75% requirement" : "Below 75% requirement"}
                </div>
              )}
            </div>
          </div>

          {/* Streak card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🔥</span>
              <span className="text-2xl font-bold text-gray-900">{loading ? "…" : streak}</span>
            </div>
            <div className="text-xs text-gray-400 font-medium">Day Present Streak</div>
          </div>

          {/* Status / alert card */}
          <div
            className={`rounded-2xl p-6 flex flex-col justify-center ${
              attendancePct !== null && attendancePct < 75
                ? "bg-red-50 border border-red-100"
                : "bg-orange-50 border border-orange-100"
            }`}
          >
            {attendancePct !== null && attendancePct < 75 ? (
              <>
                <div className="text-xl mb-1">🚨</div>
                <div className="text-sm font-semibold text-red-800">Below eligibility</div>
                <div className="text-xs text-red-600 mt-1">
                  Your attendance is under the 75% requirement.
                </div>
              </>
            ) : (
              <>
                <div className="text-xl mb-1">✅</div>
                <div className="text-sm font-semibold text-orange-800">Keep it up</div>
                <div className="text-xs text-orange-600 mt-1">
                  You're meeting the attendance requirement.
                </div>
              </>
            )}
          </div>
        </div>

        {/* This week strip */}
        {!loading && allRecords.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-5">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-3">
              This Week
            </h3>
            <div className="flex items-center justify-between">
              {weekStrip.map((d) => (
                <div key={d.dateStr} className="flex flex-col items-center gap-1.5">
                  <span className={`text-[10px] font-mono ${d.isToday ? "text-green-700 font-bold" : "text-gray-400"}`}>
                    {d.label}
                  </span>
                  <div
                    className={`w-3 h-3 rounded-full ${dotColor(d.status)} ${
                      d.isToday ? "ring-2 ring-offset-2 ring-green-600" : ""
                    }`}
                    title={d.status || "No record"}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stat pills */}
        {!loading && totalDays > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-white border border-gray-100 rounded-xl p-4 text-center">
              <div className="text-xl font-bold text-green-700">{presentCount}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">Present</div>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-4 text-center">
              <div className="text-xl font-bold text-red-600">{absentCount}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">Absent</div>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-4 text-center">
              <div className="text-xl font-bold text-orange-600">{lateCount}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">Late</div>
            </div>
          </div>
        )}

        {/* Attendance table */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-bold text-sm text-gray-900">My Attendance</h3>
            <div className="flex items-center gap-2">
              {availableMonths.length > 0 && (
                <select
                  value={monthFilter}
                  onChange={(e) => setMonthFilter(e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 font-mono text-gray-600 outline-none focus:border-green-600"
                >
                  <option value="all">All time</option>
                  {availableMonths.map((m) => (
                    <option key={m} value={m}>
                      {monthLabel(m)}
                    </option>
                  ))}
                </select>
              )}
              {records.length > 0 && (
                <button
                  onClick={handleExport}
                  className="text-xs font-semibold text-green-700 border border-green-200 bg-green-50 hover:bg-green-100 rounded-lg px-2.5 py-1.5"
                >
                  Export CSV
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <p className="text-center text-gray-400 text-sm py-10">Loading…</p>
          ) : records.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-10 px-6">
              Your attendance records will appear here once face recognition
              sessions begin recording your attendance.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-gray-400 border-b border-gray-100">
                  <th className="px-5 py-2.5">Date</th>
                  <th className="px-5 py-2.5">Time</th>
                  <th className="px-5 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r._id} className="border-b border-gray-50 last:border-0">
                    <td className="px-5 py-3 text-gray-700">{r.date}</td>
                    <td className="px-5 py-3 font-mono text-xs text-gray-400">{r.time}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusBadge(
                          r.status
                        )}`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-5">
          Records are read-only. Contact your department admin to dispute an entry.
        </p>
      </div>
    </div>
  );
};

export default StudentPortal;
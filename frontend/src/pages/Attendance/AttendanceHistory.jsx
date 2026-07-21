import { useEffect, useState } from "react";
import attendanceService from "../../services/attendanceService";

const todayStr = () => new Date().toISOString().split("T")[0];

const statusBadge = (status) => {
  const map = {
    Present: "bg-green-100 text-green-700",
    Late: "bg-orange-100 text-orange-700",
    Absent: "bg-red-100 text-red-600",
  };
  return map[status] || "bg-gray-100 text-gray-600";
};

const AttendanceHistory = () => {
  const [date, setDate] = useState(todayStr());
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await attendanceService.getAttendance({ date });
        setRecords(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load attendance");
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [date]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Attendance History</h1>
          <p className="text-sm text-gray-500">{records.length} record(s) for {date}</p>
        </div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-green-600"
        />
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <p className="text-center text-gray-400 text-sm py-10">Loading…</p>
        ) : error ? (
          <p className="text-center text-red-600 text-sm py-10">{error}</p>
        ) : records.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-10">
            No attendance records for this date.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-gray-400 border-b border-gray-100">
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Confidence</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r._id} className="border-b border-gray-50 last:border-0 hover:bg-green-50/50">
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    {r.student?.name || "—"}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">
                    {r.student?.studentId || "—"}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{r.time}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">
                    {r.confidenceScore ? `${(r.confidenceScore * 100).toFixed(1)}%` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusBadge(r.status)}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AttendanceHistory;
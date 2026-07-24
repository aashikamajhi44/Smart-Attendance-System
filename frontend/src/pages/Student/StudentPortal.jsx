import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import attendanceService from "../../services/attendanceService";

const StudentPortal = () => {
  const { user, logout } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

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
        setRecords(data);
      } catch (err) {
        // fail silently, show empty state
      } finally {
        setLoading(false);
      }
    };
    fetchMyAttendance();
  }, [user]);

  const presentCount = records.filter((r) => r.status === "Present").length;
  const lateCount = records.filter((r) => r.status === "Late").length;
  const absentCount = records.filter((r) => r.status === "Absent").length;
  const totalDays = records.length;
  const attendancePct =
    totalDays > 0 ? (((presentCount + lateCount) / totalDays) * 100).toFixed(0) : null;

  const statusBadge = (status) => {
    const map = {
      Present: "bg-green-100 text-green-700",
      Late: "bg-orange-100 text-orange-700",
      Absent: "bg-red-100 text-red-600",
    };
    return map[status] || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="min-h-screen bg-green-50/40">
      <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-green-700 flex items-center justify-center text-white font-extrabold text-sm">
            SA
          </div>
          <div className="font-bold text-sm text-gray-900 leading-tight">
            Smart Attendance
            <span className="block font-normal text-[11px] text-gray-400">
              Student Portal
            </span>
          </div>
        </div>
        <button
          onClick={logout}
          className="text-sm border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50"
        >
          Log out
        </button>
      </div>

      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-gradient-to-br from-green-900 to-green-700 rounded-2xl p-7 text-white mb-6">
          <div className="text-4xl font-extrabold">
            {loading ? "…" : attendancePct !== null ? `${attendancePct}%` : "—%"}
          </div>
          <div className="text-sm text-green-200 mt-1">
            Overall attendance · Welcome, {user?.name}
          </div>
        </div>

        {!loading && totalDays > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white border border-gray-100 rounded-xl p-4 text-center">
              <div className="text-xl font-bold text-green-700">{presentCount}</div>
              <div className="text-xs text-gray-400">Present</div>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-4 text-center">
              <div className="text-xl font-bold text-red-600">{absentCount}</div>
              <div className="text-xs text-gray-400">Absent</div>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-4 text-center">
              <div className="text-xl font-bold text-orange-600">{lateCount}</div>
              <div className="text-xs text-gray-400">Late</div>
            </div>
          </div>
        )}

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <p className="text-center text-gray-400 text-sm py-10">Loading…</p>
          ) : records.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-10">
              Your attendance records will appear here once face recognition
              sessions begin recording your attendance.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-gray-400 border-b border-gray-100">
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r._id} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-3">{r.date}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{r.time}</td>
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
    </div>
  );
};

export default StudentPortal;
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import studentService from "../../services/studentService";

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await studentService.getStudents();
        setStudents(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load students");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Students</h1>
          <p className="text-sm text-gray-500">{students.length} enrolled</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            placeholder="Search by name or ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-green-600 w-56"
          />
          <Link
            to="/students/add"
            className="bg-green-700 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            + Add Student
          </Link>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <p className="text-center text-gray-400 text-sm py-10">Loading students…</p>
        ) : error ? (
          <p className="text-center text-red-600 text-sm py-10">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-10">
            No students found. Add your first student to get started.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-gray-400 border-b border-gray-100">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Student ID</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Face Profile</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s._id} className="border-b border-gray-50 last:border-0 hover:bg-green-50/50">
                  <td className="px-4 py-3 font-semibold text-gray-900">{s.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{s.studentId}</td>
                  <td className="px-4 py-3 text-gray-600">{s.department}</td>
                  <td className="px-4 py-3">
                    {s.isFaceRegistered ? (
                      <span className="text-[11px] font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                        Registered
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
                        Pending
                      </span>
                    )}
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

export default StudentsList;
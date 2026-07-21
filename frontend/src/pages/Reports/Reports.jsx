import { useEffect, useState } from "react";
import reportService from "../../services/reportService";

const Reports = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await reportService.getSummary();
        setSummary(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load report");
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-lg font-bold text-gray-900 mb-1">Reports</h1>
      <p className="text-sm text-gray-500 mb-6">
        Attendance summary across all recorded sessions.
      </p>

      {loading ? (
        <p className="text-sm text-gray-400">Loading report…</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{summary.totalStudents}</div>
            <div className="text-xs text-gray-400 font-medium">Total Students</div>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <div className="text-2xl font-bold text-green-700">{summary.presentCount}</div>
            <div className="text-xs text-gray-400 font-medium">Present Records</div>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <div className="text-2xl font-bold text-orange-600">{summary.lateCount}</div>
            <div className="text-xs text-gray-400 font-medium">Late Records</div>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{summary.totalRecords}</div>
            <div className="text-xs text-gray-400 font-medium">Total Attendance Records</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
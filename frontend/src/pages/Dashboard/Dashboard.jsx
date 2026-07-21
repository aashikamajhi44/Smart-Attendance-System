import useAuth from "../../hooks/useAuth";

const StatCard = ({ label, value, sub, subColor, iconBg, icon }) => (
  <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${iconBg}`}>
      {icon}
    </div>
    <div className="text-2xl font-bold text-gray-900 mt-3">{value}</div>
    <div className="text-xs text-gray-400 font-medium">{label}</div>
    {sub && <div className={`text-[11px] font-mono font-semibold mt-1 ${subColor}`}>{sub}</div>}
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back, {user?.name || "Admin"}</p>
        </div>
        <span className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
          RECOGNITION ENGINE ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Students" value="0" iconBg="bg-green-100" icon="👥" />
        <StatCard label="Present Today" value="0" sub="↑ 0%" subColor="text-green-700" iconBg="bg-green-100" icon="✅" />
        <StatCard label="Absent Today" value="0" sub="0%" subColor="text-red-600" iconBg="bg-red-100" icon="❌" />
        <StatCard label="Avg. Recognition Time" value="—" iconBg="bg-orange-100" icon="⏱️" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Attendance — Last 7 Days</h3>
          <div className="h-40 flex items-center justify-center text-sm text-gray-400">
            Chart will appear once attendance data is recorded.
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Recent Recognitions</h3>
          <div className="text-sm text-gray-400 text-center py-8">
            No recognitions yet.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
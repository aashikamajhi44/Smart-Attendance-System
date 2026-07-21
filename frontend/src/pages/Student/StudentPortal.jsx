import useAuth from "../../hooks/useAuth";

const StudentPortal = () => {
  const { user, logout } = useAuth();

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
          <div className="text-4xl font-extrabold">—%</div>
          <div className="text-sm text-green-200 mt-1">
            Overall attendance · Welcome, {user?.name}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8 text-center text-gray-400 text-sm">
          Your attendance records will appear here once face recognition
          sessions begin recording your attendance.
        </div>
      </div>
    </div>
  );
};

export default StudentPortal;
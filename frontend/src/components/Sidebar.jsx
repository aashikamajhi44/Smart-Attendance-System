import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const navItems = [
  {
    group: "Overview",
    links: [{ to: "/dashboard", label: "Dashboard", icon: "📊" }],
  },
  {
    group: "Attendance",
    links: [
      { to: "/attendance/live", label: "Live Recognition", icon: "📷" },
      { to: "/attendance/history", label: "Attendance History", icon: "🕒" },
    ],
  },
  {
    group: "Students",
    links: [
      { to: "/students", label: "Student List", icon: "👥" },
      { to: "/students/add", label: "Add Student", icon: "➕" },
    ],
  },
  {
    group: "Insights",
    links: [{ to: "/reports", label: "Reports", icon: "📈" }],
  },
];

const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 flex flex-col bg-gradient-to-b from-green-950 to-[#0a2b19] text-green-100">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-extrabold text-sm shrink-0">
          SA
        </div>
        <div className="text-white font-bold text-sm leading-tight">
          Smart Attendance
          <span className="block font-normal text-[11px] text-green-300/70">
            Admin Console
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {navItems.map((section) => (
          <div key={section.group}>
            <div className="text-[10.5px] uppercase tracking-wider text-green-400/60 font-semibold px-2.5 pt-3.5 pb-1.5">
              {section.group}
            </div>
            {section.links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/students"}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] font-medium transition-colors ${
                    isActive
                      ? "bg-orange-500 text-white"
                      : "text-green-100/80 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <span>{link.icon}</span>
                {link.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-white/10 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
          {user?.name?.slice(0, 2).toUpperCase() || "AA"}
        </div>
        <div className="text-xs leading-tight flex-1 min-w-0">
          <b className="block text-white font-semibold text-[13px] truncate">
            {user?.name || "Admin"}
          </b>
          <span className="text-green-400/70 truncate block">{user?.email}</span>
        </div>
        <button
          onClick={logout}
          title="Log out"
          className="text-green-300/70 hover:text-white text-xs shrink-0"
        >
          ⏻
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
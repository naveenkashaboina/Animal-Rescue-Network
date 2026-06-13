import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../store/authStore";

function AdminNavbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const linkClass =
    "text-sm text-[#a8c9a0] hover:text-[#d4e8cc] transition-colors font-normal";
  const activeLinkClass = "text-sm text-[#7ec850] font-semibold";

  return (
    <nav className="bg-[#1a2e14]/95 backdrop-blur-xl border-b border-[#2d6a1f]/40 px-8 h-[56px] flex items-center sticky top-0 z-50">
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
        <NavLink to="/admin/dashboard" className="text-base font-bold text-[#d4e8cc]">
          Admin Panel
        </NavLink>
        <ul className="flex items-center gap-7">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) => (isActive ? activeLinkClass : linkClass)}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/animals"
              className={({ isActive }) => (isActive ? activeLinkClass : linkClass)}
            >
              Animals
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/users"
              className={({ isActive }) => (isActive ? activeLinkClass : linkClass)}
            >
              Users
            </NavLink>
          </li>
          <li>
            <button onClick={handleLogout} className={linkClass}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default AdminNavbar;

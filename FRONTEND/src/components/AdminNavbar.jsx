import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../store/authStore";

function AdminNavbar() {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const linkClass="flex items-center gap-2 text-sm text-[#a8c9a0] hover:text-[#d4e8cc] hover:bg-[#2d6a1f]/20 px-4 py-2 rounded-xl transition-colors font-normal";
  const activeLinkClass="flex items-center gap-2 text-sm text-[#d4e8cc] bg-[#2d6a1f]/30 px-4 py-2 rounded-xl font-semibold";

  return (
    <nav className="bg-[#132210] border-b border-[#2d6a1f]/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">

        <div className="flex items-center gap-8">
          <span className="text-sm font-bold text-[#d4e8cc] tracking-tight">
            Animal Rescue — Admin
          </span>
          <ul className="flex items-center gap-1">
            <li>
              <NavLink
                to="/admin/dashboard"
                end
                className={({ isActive }) => (isActive ? activeLinkClass : linkClass)}>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/animals"
                className={({ isActive }) => (isActive ? activeLinkClass : linkClass)}>
                Animals</NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/users"
                className={({ isActive }) => (isActive ? activeLinkClass : linkClass)}>
                Users
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/"
                end
                className={linkClass}>
                Public Site
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#2d6a1f]/10">
            <div className="w-6 h-6 rounded-full bg-[#2d6a1f]/30 text-[#7ec850] flex items-center justify-center text-xs font-bold">
              {currentUser?.firstName?.[0]?.toUpperCase()}
            </div>
            <span className="text-xs text-[#a8c9a0]">{currentUser?.firstName}</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-[#7a9970] hover:text-[#d4e8cc] hover:bg-[#2d6a1f]/20 px-3 py-2 rounded-xl transition-colors cursor-pointer">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;

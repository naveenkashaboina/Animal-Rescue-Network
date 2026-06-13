import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../store/authStore";

function AdminDashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItem =
    "block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors text-[#a8c9a0] hover:text-[#d4e8cc] hover:bg-[#2d6a1f]/20";
  const navItemActive =
    "block px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#2d6a1f]/30 text-[#7ec850]";

  return (
    <div className="min-h-screen bg-[#1a2e14] flex">
      <aside className="w-56 bg-[#132210] flex flex-col py-8 px-4 gap-2 shrink-0">
        <p className="text-[#d4e8cc] font-bold text-base px-4 mb-4">Admin Panel</p>

        <NavLink
          to="/admin/dashboard"
          end
          className={({ isActive }) => (isActive ? navItemActive : navItem)}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/animals"
          className={({ isActive }) => (isActive ? navItemActive : navItem)}
        >
          All Animals
        </NavLink>
        <NavLink
          to="/admin/users"
          className={({ isActive }) => (isActive ? navItemActive : navItem)}
        >
          Manage Users
        </NavLink>

        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm text-[#7a9970] hover:text-[#d4e8cc] hover:bg-[#2d6a1f]/20 transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-[#d4e8cc] mb-2">Welcome, {currentUser?.firstName}</h1>
        <p className="text-[#7a9970] text-sm mb-10">Manage the Animal Rescue Network.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <NavLink
            to="/admin/animals"
            className="bg-[#2d6a1f]/20 border border-[#2d6a1f]/30 rounded-2xl p-7 hover:bg-[#2d6a1f]/30 transition"
          >
            <p className="text-[#7ec850] text-xs font-semibold uppercase tracking-widest mb-2">Animals</p>
            <p className="text-[#d4e8cc] text-lg font-semibold">View all posted rescue animals</p>
          </NavLink>

          <NavLink
            to="/admin/users"
            className="bg-[#2d6a1f]/20 border border-[#2d6a1f]/30 rounded-2xl p-7 hover:bg-[#2d6a1f]/30 transition"
          >
            <p className="text-[#7ec850] text-xs font-semibold uppercase tracking-widest mb-2">Users</p>
            <p className="text-[#d4e8cc] text-lg font-semibold">Manage adopters and rescuers</p>
          </NavLink>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;

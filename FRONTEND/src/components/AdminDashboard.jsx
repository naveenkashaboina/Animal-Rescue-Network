import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../store/authStore";
import AdminNavbar from "./AdminNavbar";

function AdminDashboard() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-[#f2f5ee]">
      <AdminNavbar />
      <div className="max-w-5xl mx-auto px-6 py-14">
        <h1 className="text-4xl font-bold text-[#1a2e14] mb-2 tracking-tight">
          Welcome back, {currentUser?.firstName}
        </h1>
        <p className="text-[#7a9970] text-sm mb-12">
          Here is an overview of the Animal Rescue Network.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <NavLink
            to="/admin/animals"
            className="group bg-[#e6ede0] border border-[#b0c9a8] rounded-2xl p-8 hover:bg-[#dae5d2] transition-colors"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-[#2d6a1f] mb-3">
              Animals
            </p>
            <p className="text-xl font-bold text-[#1a2e14] mb-1">All Rescue Animals</p>
            <p className="text-sm text-[#7a9970]">
              View every animal posted — active and inactive.
            </p>
          </NavLink>

          <NavLink
            to="/admin/users"
            className="group bg-[#e6ede0] border border-[#b0c9a8] rounded-2xl p-8 hover:bg-[#dae5d2] transition-colors"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-[#2d6a1f] mb-3">
              Users
            </p>
            <p className="text-xl font-bold text-[#1a2e14] mb-1">Manage Members</p>
            <p className="text-sm text-[#7a9970]">
              Block or unblock adopters and rescuers.
            </p>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

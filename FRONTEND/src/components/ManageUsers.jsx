import { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import { toast } from "react-hot-toast";
import {
  headingClass, pageWrapper, loadingClass, emptyStateClass,
  errorClass,
} from "../styles/common";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    axios
      .get("/admin-api/users-rescuers")
      .then((res) => setUsers(res.data.payload || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggle = async (user) => {
    try {
      await axios.put("/admin-api/state", {
        mail: user.email,
        toBeActive: !user.isUserActive,
      });
      toast.success("User status updated");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f5ee]">
      <AdminNavbar />
      <div className={pageWrapper}>
        <h1 className={`${headingClass} mb-8`}>Manage Users</h1>

        {loading && <p className={loadingClass}>Loading...</p>}
        {!loading && users.length === 0 && (
          <p className={emptyStateClass}>No users found.</p>
        )}

        {!loading && users.length > 0 && (
          <div className="flex flex-col gap-3">
            {users.map((user) => (
              <div
                key={user._id}
                className="bg-[#e6ede0] rounded-2xl px-6 py-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-[#1a2e14]">
                    {user.firstName || user.email}
                  </p>
                  <p className="text-xs text-[#7a9970]">{user.email}</p>
                  <p className="text-xs text-[#4a6741] font-medium mt-0.5">
                    {user.role === "USER" ? "Adopter" : "Rescuer"}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      user.isUserActive
                        ? "bg-[#2d6a1f]/15 text-[#1a4012]"
                        : "bg-[#c0392b]/15 text-[#8b2317]"
                    }`}
                  >
                    {user.isUserActive ? "Active" : "Blocked"}
                  </span>
                  <button
                    onClick={() => handleToggle(user)}
                    className={`text-xs font-medium px-4 py-1.5 rounded-full cursor-pointer transition ${
                      user.isUserActive
                        ? "bg-[#c0392b] text-white hover:bg-[#8b2317]"
                        : "bg-[#2d6a1f] text-white hover:bg-[#1a4012]"
                    }`}
                  >
                    {user.isUserActive ? "Block" : "Unblock"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageUsers;

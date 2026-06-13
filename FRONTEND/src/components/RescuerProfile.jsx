import { NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../store/authStore";
import {
  pageBackground, mutedText, subHeadingClass, secondaryBtn, cardClass,
} from "../styles/common";

function RescuerProfile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const tabClass = "px-4 py-2 text-sm font-medium rounded-full transition-colors cursor-pointer";
  const activeTab = "bg-[#2d6a1f] text-white";
  const inactiveTab = "text-[#4a6741] hover:bg-[#e6ede0]";

  return (
    <div className={pageBackground}>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className={`${cardClass} mb-6 flex items-center justify-between`}>
          <div className="flex items-center gap-4">
            {currentUser?.profileImageUrl ? (
              <img src={currentUser.profileImageUrl} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#2d6a1f]/10 text-[#2d6a1f] flex items-center justify-center text-lg font-bold">
                {currentUser?.firstName?.[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <p className={subHeadingClass}>{currentUser?.firstName} {currentUser?.lastName}</p>
              <p className={mutedText}>{currentUser?.email}</p>
              <p className="text-xs text-[#2d6a1f] font-medium mt-0.5">Rescuer</p>
            </div>
          </div>
          <button onClick={handleLogout} className={secondaryBtn}>Logout</button>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <NavLink to="/rescuer-profile/animals" className={({ isActive }) => `${tabClass} ${isActive ? activeTab : inactiveTab}`}>
            My Animals
          </NavLink>
          <NavLink to="/rescuer-profile/post-animal" className={({ isActive }) => `${tabClass} ${isActive ? activeTab : inactiveTab}`}>
            Post Animal
          </NavLink>
          <NavLink to="/rescuer-profile/stray-reports" className={({ isActive }) => `${tabClass} ${isActive ? activeTab : inactiveTab}`}>
            Stray Reports
          </NavLink>
        </div>

        <Outlet />
      </div>
    </div>
  );
}

export default RescuerProfile;

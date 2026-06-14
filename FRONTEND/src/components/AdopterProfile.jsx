import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../store/authStore";
import { useNavigate } from "react-router";
import {
  pageBackground, pageWrapper, headingClass, bodyText,
  mutedText, secondaryBtn, cardClass, subHeadingClass,
  loadingClass, emptyStateClass,
  strayStatusOpen, strayStatusClaimed,
} from "../styles/common";

const strayStatusResolved =
  "text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#d63b8f]/10 text-[#8b2060]";

function AdopterProfile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);

  useEffect(() => {
    axios
      .get("/adopter-api/my-stray-reports")
      .then((res) => setReports(res.data.payload || []))
      .catch(() => {})
      .finally(() => setLoadingReports(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getStatusClass = (status) => {
    if (status === "Open")     return strayStatusOpen;
    if (status === "Claimed")  return strayStatusClaimed;
    return strayStatusResolved;
  };

  const statusMessage = (status) => {
    if (status === "Open")
      return "Your report is waiting for a rescuer to pick it up.";
    if (status === "Claimed")
      return "A rescuer has claimed this report and is on their way.";
    return "A rescuer has rescued this animal and added it to the listings.";
  };

  return (
    <div className={pageBackground}>
      <div className={pageWrapper}>
        <div className={`${cardClass} mb-6 flex items-center gap-5`}>
          {currentUser?.profileImageUrl ? (
            <img
              src={currentUser.profileImageUrl}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#2d6a1f]/10 text-[#2d6a1f] flex items-center justify-center text-2xl font-bold">
              {currentUser?.firstName?.[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <p className={subHeadingClass}>
              {currentUser?.firstName} {currentUser?.lastName}
            </p>
            <p className={mutedText}>{currentUser?.email}</p>
            <p className="text-xs text-[#2d6a1f] font-medium mt-1">Adopter</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-12">
          <button onClick={() => navigate("/")} className={secondaryBtn}>
            Browse Animals
          </button>
          <button onClick={() => navigate("/report-stray")} className={secondaryBtn}>
            Report a Stray
          </button>
          <button onClick={handleLogout} className={secondaryBtn}>
            Logout
          </button>
        </div>

        <h2 className={`${headingClass} mb-5`}>My Stray Reports</h2>

        {loadingReports && <p className={loadingClass}>Loading reports...</p>}

        {!loadingReports && reports.length === 0 && (
          <p className={emptyStateClass}>
            You have not reported any stray animals yet.
          </p>
        )}

        {!loadingReports && reports.length > 0 && (
          <div className="flex flex-col gap-4">
            {reports.map((report) => (
              <div
                key={report._id}
                className="bg-[#fdf8e7] border border-[#e8d98a] rounded-2xl p-5"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex gap-4">
                    {report.imageUrl && (
                      <img
                        src={report.imageUrl}
                        alt="Stray"
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-[#1a2e14]">
                        {report.species} — {report.location}
                      </p>
                      <p className="text-xs text-[#7a9970] mt-0.5">
                        Reported on {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-[#4a6741] mt-1 leading-relaxed">
                        {report.description}
                      </p>
                    </div>
                  </div>

                  <span className={`${getStatusClass(report.status)} shrink-0`}>
                    {report.status}
                  </span>
                </div>

                <p className="text-xs text-[#4a6741] mt-3 border-t border-[#e8d98a] pt-3">
                  {statusMessage(report.status)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdopterProfile;

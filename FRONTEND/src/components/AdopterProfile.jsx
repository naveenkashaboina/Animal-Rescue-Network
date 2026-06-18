import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../store/authStore";
import { useNavigate } from "react-router";
import {
  pageBackground, pageWrapper, headingClass, mutedText,
  secondaryBtn, cardClass, subHeadingClass,
  loadingClass, emptyStateClass,
  strayStatusOpen, strayStatusClaimed,
  statusAdopted, animalMeta, animalTitle, animalImage,
  strayRescuedBadge,
} from "../styles/common";

const strayStatusResolved =
  "text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#d63b8f]/10 text-[#8b2060]";

const TAB = { ADOPTED: "adopted", STRAYS: "strays" };

function AdopterProfile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab]             = useState(TAB.ADOPTED);
  const [adopted, setAdopted]     = useState([]);
  const [reports, setReports]     = useState([]);
  const [loadingA, setLoadingA]   = useState(true);
  const [loadingR, setLoadingR]   = useState(true);

  useEffect(() => {
    axios.get("/adopter-api/my-adopted")
      .then((res) => setAdopted(res.data.payload || []))
      .catch(() => {})
      .finally(() => setLoadingA(false));

    axios.get("/adopter-api/my-stray-reports")
      .then((res) => setReports(res.data.payload || []))
      .catch(() => {})
      .finally(() => setLoadingR(false));
  }, []);

  const handleLogout = async () => { await logout(); navigate("/login"); };

  const strayStatusClass = (s) => {
    if (s === "Open")    return strayStatusOpen;
    if (s === "Claimed") return strayStatusClaimed;
    return strayStatusResolved;
  };

  const strayMsg = (s, rescuer) => {
    if (s === "Open")    return "Waiting for a rescuer to claim this report.";
    if (s === "Claimed") return rescuer
      ? `${rescuer.firstName} ${rescuer.lastName || ""} (${rescuer.email}) is on their way.`
      : "A rescuer has claimed this and is on their way.";
    return "The animal has been rescued and added to the listings.";
  };

  const tabBtn = (active) =>
    `px-4 py-2 text-sm font-medium rounded-full transition-colors cursor-pointer ${
      active ? "bg-[#2d6a1f] text-white" : "text-[#4a6741] hover:bg-[#e6ede0]"
    }`;

  return (
    <div className={pageBackground}>
      <div className={pageWrapper}>

        {/* ── Profile card ── */}
        <div className={`${cardClass} mb-6 flex items-center justify-between flex-wrap gap-4`}>
          <div className="flex items-center gap-5">
            {currentUser?.profileImageUrl ? (
              <img src={currentUser.profileImageUrl} alt="Profile"
                className="w-16 h-16 rounded-full object-cover" />
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
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => navigate("/")} className={secondaryBtn}>Browse Animals</button>
            <button onClick={() => navigate("/report-stray")} className={secondaryBtn}>Report a Stray</button>
            <button onClick={handleLogout} className={secondaryBtn}>Logout</button>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-2 mb-8">
          <button className={tabBtn(tab === TAB.ADOPTED)} onClick={() => setTab(TAB.ADOPTED)}>
            My Adopted Animals
          </button>
          <button className={tabBtn(tab === TAB.STRAYS)} onClick={() => setTab(TAB.STRAYS)}>
            My Stray Reports
            {reports.filter((r) => r.status !== "Resolved").length > 0 && (
              <span className="ml-2 bg-[#c8a84b]/20 text-[#8a6e1f] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                {reports.filter((r) => r.status !== "Resolved").length}
              </span>
            )}
          </button>
        </div>

        {/* ── My Adopted Animals ── */}
        {tab === TAB.ADOPTED && (
          <>
            {loadingA && <p className={loadingClass}>Loading...</p>}
            {!loadingA && adopted.length === 0 && (
              <p className={emptyStateClass}>You have not adopted any animals yet.</p>
            )}
            {!loadingA && adopted.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {adopted.map((animal) => (
                  <div
                    key={animal._id}
                    className="bg-[#fdf0f5] border border-[#e8b0cc] rounded-2xl p-5 flex flex-col gap-2 cursor-pointer hover:bg-[#f9e0ec] transition"
                    onClick={() => navigate(`/animal/${animal._id}`)}
                  >
                    {animal.imageUrl && (
                      <img src={animal.imageUrl} alt={animal.name} className={animalImage} />
                    )}
                    <div className="flex items-center flex-wrap gap-1.5">
                      <span className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#8b2060]">
                        {animal.species}
                      </span>
                      <span className={statusAdopted}>Adopted</span>
                      {animal.fromStray && <span className={strayRescuedBadge}>Rescued Stray</span>}
                    </div>
                    <h3 className={animalTitle}>{animal.name}</h3>
                    {animal.breed  && <p className={animalMeta}>{animal.breed}</p>}
                    <p className={animalMeta}>Age: {animal.age}</p>
                    {animal.address && <p className={animalMeta}>📍 {animal.address}</p>}

                    {animal.rescuer && (
                      <div className="bg-[#eaf5e4] rounded-xl px-3 py-2 mt-1">
                        <p className="text-xs text-[#4a6741] font-medium">Rescued by</p>
                        <p className="text-xs text-[#1a2e14]">
                          {animal.rescuer.firstName} {animal.rescuer.lastName || ""}
                        </p>
                        <p className="text-xs text-[#7a9970]">{animal.rescuer.email}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── My Stray Reports ── */}
        {tab === TAB.STRAYS && (
          <>
            {loadingR && <p className={loadingClass}>Loading...</p>}
            {!loadingR && reports.length === 0 && (
              <p className={emptyStateClass}>You have not reported any stray animals yet.</p>
            )}
            {!loadingR && reports.length > 0 && (
              <div className="flex flex-col gap-4">
                {reports.map((report) => (
                  <div key={report._id}
                    className="bg-[#fdf8e7] border border-[#e8d98a] rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex gap-4">
                        {report.imageUrl && (
                          <img src={report.imageUrl} alt="Stray"
                            className="w-16 h-16 rounded-xl object-cover shrink-0" />
                        )}
                        <div>
                          <p className="text-sm font-semibold text-[#1a2e14]">
                            {report.species}
                          </p>
                          <p className="text-xs text-[#7a9970] mt-0.5">
                            📍 {report.location}
                          </p>
                          <p className="text-xs text-[#7a9970]">
                            Reported on {new Date(report.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-[#4a6741] mt-1 leading-relaxed">
                            {report.description}
                          </p>
                        </div>
                      </div>
                      <span className={`${strayStatusClass(report.status)} shrink-0`}>
                        {report.status}
                      </span>
                    </div>

                    <div className="border-t border-[#e8d98a] mt-3 pt-3">
                      <p className="text-xs text-[#4a6741]">
                        {strayMsg(report.status, report.claimedBy)}
                      </p>
                      {report.status === "Claimed" && report.claimedBy && (
                        <div className="mt-2 bg-[#eaf5e4] rounded-xl px-3 py-2">
                          <p className="text-xs font-medium text-[#2d6a1f]">Contact Rescuer</p>
                          <p className="text-xs text-[#1a2e14]">
                            {report.claimedBy.firstName} {report.claimedBy.lastName || ""}
                          </p>
                          <p className="text-xs text-[#7a9970]">{report.claimedBy.email}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

export default AdopterProfile;

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import {
  animalGrid, animalImage, animalTitle, animalMeta, animalSpeciesBadge,
  strayCard, strayStatusOpen, strayStatusClaimed,
  loadingClass, emptyStateClass, primaryBtn, secondaryBtn,
  headingClass,
} from "../styles/common";

function StrayReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchReports = () => {
    axios
      .get("/rescuer-api/stray-reports")
      .then((res) => setReports(res.data.payload || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReports(); }, []);

  const handleClaim = async (reportId) => {
    try {
      await axios.put("/rescuer-api/stray-reports/claim", { reportId });
      toast.success("Report claimed. You can now convert it to an animal listing.");
      fetchReports();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to claim");
    }
  };

  if (loading) return <p className={loadingClass}>Loading stray reports...</p>;
  if (reports.length === 0)
    return <p className={emptyStateClass}>No open stray reports at the moment.</p>;

  return (
    <div>
      <p className="text-sm text-[#4a6741] mb-6">
        These are stray animals reported by adopters. Claim a report to take responsibility,
        then convert it to an animal listing once you have rescued the animal.
      </p>

      <div className={animalGrid}>
        {reports.map((report) => (
          <div key={report._id} className={strayCard}>
            {report.imageUrl && (
              <img src={report.imageUrl} alt="Stray" className={animalImage} />
            )}

            <div className="flex items-center justify-between">
              <span className={animalSpeciesBadge}>{report.species}</span>
              <span className={report.status === "Open" ? strayStatusOpen : strayStatusClaimed}>
                {report.status}
              </span>
            </div>

            <p className={animalTitle}>Stray {report.species}</p>
            <p className={animalMeta}>Location: {report.location}</p>
            <p className="text-sm text-[#4a6741] line-clamp-2">{report.description}</p>
            <p className={animalMeta}>
              Reported by: {report.reportedBy?.firstName || report.reportedBy?.email}
            </p>
            <p className={animalMeta}>
              {new Date(report.createdAt).toLocaleDateString()}
            </p>

            <div className="flex gap-2 mt-2">
              {report.status === "Open" && (
                <button onClick={() => handleClaim(report._id)} className={primaryBtn}>
                  Claim
                </button>
              )}
              {report.status === "Claimed" && (
                <button
                  onClick={() => navigate("/convert-stray", { state: { report } })}
                  className={primaryBtn}
                >
                  Convert to Animal
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StrayReports;

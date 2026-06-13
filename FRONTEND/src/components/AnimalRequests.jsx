import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import {
  pageBackground, pageWrapper, headingClass, animalTitle, animalMeta,
  animalSpeciesBadge, animalImageLarge, inquiriesWrapper, inquiryCard,
  inquiryUserRow, avatar, inquiryUser, inquiryText,
  reqPending, reqApproved, reqRejected,
  approveBtn, rejectBtn, loadingClass, errorClass, emptyStateClass,
  divider, successClass,
} from "../styles/common";

function AnimalRequests() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnimal = () => {
    axios
      .get(`/rescuer-api/animal/${id}/requests`)
      .then((res) => setAnimal(res.data.payload))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAnimal(); }, [id]);

  const handleApprove = async (inquiryId) => {
    try {
      const res = await axios.put("/rescuer-api/inquiry/approve", {
        animalId: id,
        inquiryId,
      });
      setAnimal(res.data.payload);
      toast.success("Adoption approved! Animal marked as Adopted.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve");
    }
  };

  const handleReject = async (inquiryId) => {
    try {
      await axios.put("/rescuer-api/inquiry/reject", { animalId: id, inquiryId });
      fetchAnimal();
      toast.success("Request rejected");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject");
    }
  };

  const getReqStatusClass = (status) => {
    if (status === "Approved") return reqApproved;
    if (status === "Rejected") return reqRejected;
    return reqPending;
  };

  if (loading) return <p className={loadingClass}>Loading...</p>;
  if (!animal)  return <p className={`${errorClass} m-8`}>Animal not found.</p>;

  const adopted = animal.inquiries?.find((i) => i.status === "Approved");

  return (
    <div className={pageBackground}>
      <div className={pageWrapper}>
        <button
          onClick={() => navigate("/rescuer-profile/animals")}
          className="text-[#2d6a1f] text-sm mb-6 hover:text-[#1a4012] transition"
        >
          Back to My Animals
        </button>

        {animal.imageUrl && (
          <img src={animal.imageUrl} alt={animal.name} className={animalImageLarge} />
        )}

        <span className={animalSpeciesBadge}>{animal.species}</span>
        <h1 className={`${headingClass} mt-1 mb-1`}>{animal.name}</h1>
        <p className={animalMeta}>Age: {animal.age} {animal.breed && `· ${animal.breed}`}</p>

        {adopted && (
          <div className={`${successClass} mt-4`}>
            This animal has been adopted. All other requests have been automatically rejected.
          </div>
        )}

        <div className={divider} />

        <h2 className={`${headingClass} mb-6`}>
          Adoption Requests ({animal.inquiries?.length || 0})
        </h2>

        {animal.inquiries?.length === 0 && (
          <p className={emptyStateClass}>No requests yet.</p>
        )}

        <div className={inquiriesWrapper}>
          {animal.inquiries?.map((inq) => (
            <div key={inq._id} className={inquiryCard}>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className={inquiryUserRow}>
                  <div className={avatar}>
                    {(inq.user?.firstName || inq.user?.email || "A")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className={inquiryUser}>
                      {inq.user?.firstName
                        ? `${inq.user.firstName} ${inq.user.lastName || ""}`
                        : inq.user?.email || "Adopter"}
                    </p>
                    <p className="text-xs text-[#7a9970]">{inq.user?.email}</p>
                  </div>
                </div>
                <span className={getReqStatusClass(inq.status)}>{inq.status}</span>
              </div>

              <p className={inquiryText}>{inq.message}</p>

              {inq.status === "Pending" && !adopted && (
                <div className="flex gap-2 mt-3">
                  <button onClick={() => handleApprove(inq._id)} className={approveBtn}>
                    Approve
                  </button>
                  <button onClick={() => handleReject(inq._id)} className={rejectBtn}>
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AnimalRequests;

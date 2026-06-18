import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../store/authStore";
import { toast } from "react-hot-toast";
import {
  pageBackground, animalPageWrapper, animalMainTitle, animalSpeciesBadge,
  animalMetaRow, animalContent, animalFooter, animalImageLarge,
  inquiriesWrapper, inquiryCard, inquiryText, inquiryUserRow,
  inquiryUser, avatar, inputClass, primaryBtn,
  loadingClass, errorClass, statusAvailable, statusAdopted, statusInCare,
  reqPending, reqApproved, reqRejected, strayRescuedBadge,
  divider, bodyText, headingClass, successClass,
  contactCard, contactLabel, contactRow, contactName, contactEmail,
  transactionCard, transactionLabel, transactionRow, transactionRole,
  transactionName, transactionEmail,
} from "../styles/common";

function AnimalByID() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchAnimal = () => {
    axios
      .get("/adopter-api/animals")
      .then((res) => {
        const found = res.data.payload?.find((a) => a._id === id);
        setAnimal(found || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAnimal(); }, [id]);

  const myRequest = animal?.inquiries?.find(
    (inq) =>
      inq.user?._id === currentUser?.id ||
      inq.user?._id === currentUser?._id ||
      inq.user === currentUser?.id ||
      inq.user === currentUser?._id
  );

  const handleRequest = async () => {
    if (!message.trim()) return toast.error("Please write a message");
    setSubmitting(true);
    try {
      const res = await axios.put("/adopter-api/animals", { animalId: id, message });
      setAnimal(res.data.payload);
      setMessage("");
      toast.success("Adoption request sent!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusClass = (s) =>
    s === "Available" ? statusAvailable : s === "Adopted" ? statusAdopted : statusInCare;

  const getReqClass = (s) =>
    s === "Approved" ? reqApproved : s === "Rejected" ? reqRejected : reqPending;

  if (loading) return <p className={loadingClass}>Loading...</p>;
  if (!animal)  return <p className={`${errorClass} m-8`}>Animal not found.</p>;

  const rescuer   = animal.rescuer;
  const adopter   = animal.adoptedBy;
  const reporter  = animal.strayReportedBy;
  const isApproved = myRequest?.status === "Approved";

  return (
    <div className={pageBackground}>
      <div className={animalPageWrapper}>
        <button onClick={() => navigate(-1)}
          className="text-[#2d6a1f] text-sm mb-6 hover:text-[#1a4012] transition">
          Back
        </button>

        {animal.imageUrl && (
          <img src={animal.imageUrl} alt={animal.name} className={animalImageLarge} />
        )}

        <div className="flex items-center flex-wrap gap-2 mb-3">
          <span className={animalSpeciesBadge}>{animal.species}</span>
          <span className={getStatusClass(animal.status)}>{animal.status}</span>
          {animal.fromStray && <span className={strayRescuedBadge}>Rescued Stray</span>}
        </div>

        <h1 className={animalMainTitle}>{animal.name}</h1>

        <div className={`${animalMetaRow} mt-4`}>
          <span>{animal.breed || "Mixed"}</span>
          <span>Age: {animal.age}</span>
          <span>{new Date(animal.createdAt).toLocaleDateString()}</span>
        </div>

        {animal.address && (
          <div className="flex items-center gap-2 mt-4 text-sm text-[#4a6741]">
            <span className="text-base">📍</span>
            <span>{animal.address}</span>
          </div>
        )}

        <p className={animalContent}>{animal.description}</p>

        {/* ── Transaction Chain ── */}
        <div className={transactionCard}>
          <p className={transactionLabel}>Animal Journey</p>

          {animal.fromStray && reporter && (
            <div className={transactionRow}>
              <span className={transactionRole}>Reported</span>
              <div className={`${avatar} text-xs`}>
                {(reporter.firstName || "U")[0].toUpperCase()}
              </div>
              <div>
                <p className={transactionName}>{reporter.firstName}</p>
                <p className={transactionEmail}>Spotted and reported this stray</p>
              </div>
            </div>
          )}

          {rescuer && (
            <div className={transactionRow}>
              <span className={transactionRole}>Rescuer</span>
              <div className={`${avatar} text-xs`}>
                {(rescuer.firstName || "R")[0].toUpperCase()}
              </div>
              <div>
                <p className={transactionName}>
                  {rescuer.firstName} {rescuer.lastName || ""}
                </p>
                <p className={transactionEmail}>{rescuer.email}</p>
              </div>
            </div>
          )}

          {adopter && (
            <div className={transactionRow}>
              <span className={transactionRole}>Adopted</span>
              <div className={`${avatar} text-xs`}>
                {(adopter.firstName || "A")[0].toUpperCase()}
              </div>
              <div>
                <p className={transactionName}>
                  {adopter.firstName} {adopter.lastName || ""}
                </p>
                <p className={transactionEmail}>Gave this animal a home</p>
              </div>
            </div>
          )}
        </div>

        {/* ── Contact Section ── */}
        {isAuthenticated && currentUser?.role === "USER" && (isApproved || myRequest) && rescuer && (
          <div className={contactCard}>
            <p className={contactLabel}>Contact Rescuer</p>
            <div className={contactRow}>
              <div className={avatar}>
                {(rescuer.firstName || "R")[0].toUpperCase()}
              </div>
              <div>
                <p className={contactName}>
                  {rescuer.firstName} {rescuer.lastName || ""}
                </p>
                <p className={contactEmail}>{rescuer.email}</p>
              </div>
            </div>
            <p className="text-xs text-[#4a6741] mt-2">
              {isApproved
                ? "Your adoption was approved. Reach out to arrange the handover."
                : "You have sent a request. You may contact the rescuer to discuss in advance."}
            </p>
          </div>
        )}

        <div className={divider} />

        <h2 className={`${headingClass} mb-5`}>Adoption Requests</h2>

        {isAuthenticated && currentUser?.role === "USER" && (
          <div className="mb-8">
            {animal.status !== "Available" ? (
              <p className={`${bodyText} text-sm`}>
                This animal is no longer available for new requests.
              </p>
            ) : myRequest ? (
              <div className={`${
                myRequest.status === "Approved" ? successClass
                : myRequest.status === "Rejected" ? errorClass
                : "bg-[#c8a84b]/10 text-[#8a6e1f] border border-[#e8d98a] rounded-xl px-4 py-3 text-sm"
              }`}>
                {myRequest.status === "Approved" && "Your adoption request was approved! Contact the rescuer above to arrange the handover."}
                {myRequest.status === "Rejected" && "Your request was not approved for this animal."}
                {myRequest.status === "Pending"  && "Your request is pending — the rescuer will review it. You may contact them in advance using their email above."}
              </div>
            ) : (
              <div className="flex gap-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Introduce yourself and why you'd be a great match..."
                  className={`${inputClass} flex-1`}
                />
                <button onClick={handleRequest} className={primaryBtn} disabled={submitting}>
                  {submitting ? "Sending..." : "Request Adoption"}
                </button>
              </div>
            )}
          </div>
        )}

        {!isAuthenticated && (
          <p className={`${bodyText} mb-6 text-sm`}>
            Please login as an Adopter to request adoption.
          </p>
        )}

        <div className={inquiriesWrapper}>
          {animal.inquiries?.length === 0 && (
            <p className="text-[#7a9970] text-sm">No requests yet.</p>
          )}
          {animal.inquiries?.map((inq, i) => (
            <div key={i} className={inquiryCard}>
              <div className="flex items-center justify-between">
                <div className={inquiryUserRow}>
                  <div className={avatar}>
                    {(inq.user?.firstName || inq.user?.email || "A")[0].toUpperCase()}
                  </div>
                  <p className={inquiryUser}>
                    {inq.user?.firstName || inq.user?.email || "Adopter"}
                  </p>
                </div>
                <span className={getReqClass(inq.status)}>{inq.status}</span>
              </div>
              <p className={inquiryText}>{inq.message}</p>
            </div>
          ))}
        </div>

        <div className={animalFooter}>
          Posted on {new Date(animal.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}

export default AnimalByID;

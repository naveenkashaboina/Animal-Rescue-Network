import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import {
  animalGrid, animalCardClass, animalTitle, animalMeta,
  animalSpeciesBadge, animalImage, editBtn, deleteBtn,
  loadingClass, emptyStateClass, animalStatusActive, animalStatusDeleted,
  strayRescuedBadge,
} from "../styles/common";

function RescuerAnimals() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAnimals = () => {
    axios
      .get("/rescuer-api/animals")
      .then((res) => setAnimals(res.data.payload || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAnimals(); }, []);

  const handleToggleStatus = async (animal) => {
    try {
      await axios.patch("/rescuer-api/animals", {
        animalId: animal._id,
        isAnimalActive: !animal.isAnimalActive,
      });
      toast.success("Status updated");
      fetchAnimals();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    }
  };

  if (loading) return <p className={loadingClass}>Loading...</p>;
  if (animals.length === 0)
    return <p className={emptyStateClass}>You have not posted any animals yet.</p>;

  return (
    <div className={animalGrid}>
      {animals.map((animal) => {
        const pendingCount = animal.inquiries?.filter((i) => i.status === "Pending").length || 0;
        return (
          <div key={animal._id} className={`${animalCardClass} relative`}>
            <span className={animal.isAnimalActive ? animalStatusActive : animalStatusDeleted}>
              {animal.isAnimalActive ? "Active" : "Inactive"}
            </span>

            {animal.imageUrl && (
              <img src={animal.imageUrl} alt={animal.name} className={animalImage} />
            )}

            <div className="flex flex-wrap items-center gap-1.5">
              <span className={animalSpeciesBadge}>{animal.species}</span>
              {animal.fromStray && <span className={strayRescuedBadge}>Rescued Stray</span>}
            </div>

            <h3 className={animalTitle}>{animal.name}</h3>
            {animal.breed   && <p className={animalMeta}>{animal.breed}</p>}
            <p className={animalMeta}>Age: {animal.age}</p>
            <p className={animalMeta}>Status: {animal.status}</p>
            {animal.address && <p className={animalMeta}>📍 {animal.address}</p>}

            {animal.status === "Adopted" && animal.adoptedBy && (
              <div className="bg-[#eaf5e4] rounded-xl px-3 py-2 mt-1">
                <p className="text-xs text-[#4a6741] font-medium">Adopted by</p>
                <p className="text-xs text-[#1a2e14]">
                  {animal.adoptedBy.firstName} {animal.adoptedBy.lastName || ""}
                </p>
                <p className="text-xs text-[#7a9970]">{animal.adoptedBy.email}</p>
              </div>
            )}

            {pendingCount > 0 && (
              <p className="text-xs font-semibold text-[#8a6e1f] bg-[#c8a84b]/15 px-2.5 py-1 rounded-full w-fit">
                {pendingCount} pending request{pendingCount > 1 ? "s" : ""}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mt-3">
              <button className={editBtn}
                onClick={() => navigate("/edit-animal", { state: { animal } })}>
                Edit
              </button>
              <button
                className="bg-[#4a6741] text-white text-sm px-4 py-2 rounded-full hover:bg-[#2d6a1f] transition cursor-pointer"
                onClick={() => navigate(`/rescuer-profile/animal/${animal._id}/requests`)}>
                Requests
              </button>
              <button className={deleteBtn} onClick={() => handleToggleStatus(animal)}>
                {animal.isAnimalActive ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default RescuerAnimals;

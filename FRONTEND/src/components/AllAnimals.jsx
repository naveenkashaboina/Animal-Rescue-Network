import { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import {
  animalGrid, animalCardClass, animalTitle, animalMeta,
  animalSpeciesBadge, animalImage, loadingClass, emptyStateClass,
  animalStatusActive, animalStatusDeleted, headingClass, pageWrapper,
} from "../styles/common";

function AllAnimals() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/admin-api/animals")
      .then((res) => setAnimals(res.data.payload || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#f2f5ee]">
      <AdminNavbar />
      <div className={pageWrapper}>
        <h1 className={`${headingClass} mb-8`}>All Rescue Animals</h1>

        {loading && <p className={loadingClass}>Loading...</p>}
        {!loading && animals.length === 0 && (
          <p className={emptyStateClass}>No animals posted yet.</p>
        )}

        {!loading && animals.length > 0 && (
          <div className={animalGrid}>
            {animals.map((animal) => (
              <div key={animal._id} className={`${animalCardClass} relative`}>
                <span
                  className={
                    animal.isAnimalActive ? animalStatusActive : animalStatusDeleted
                  }
                >
                  {animal.isAnimalActive ? "Active" : "Inactive"}
                </span>

                {animal.imageUrl && (
                  <img src={animal.imageUrl} alt={animal.name} className={animalImage} />
                )}

                <span className={animalSpeciesBadge}>{animal.species}</span>
                <h3 className={animalTitle}>{animal.name}</h3>
                {animal.breed && <p className={animalMeta}>{animal.breed}</p>}
                <p className={animalMeta}>Age: {animal.age}</p>
                <p className={animalMeta}>Status: {animal.status}</p>
                <p className={animalMeta}>
                  Rescuer: {animal.rescuer?.firstName || animal.rescuer?.email || "Unknown"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AllAnimals;

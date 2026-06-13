import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import {
  pageBackground, pageWrapper, pageTitleClass, bodyText,
  animalGrid, animalTitle, animalMeta, animalImage,
  loadingClass, emptyStateClass, animalSpeciesBadge,
  statusAvailable, statusAdopted, statusInCare,
  availableCard, inCareCard, adoptedCard,
  sectionAvailable, sectionInCare, sectionAdopted, divider,
} from "../styles/common";

const SPECIES = ["All", "Dog", "Cat", "Bird", "Rabbit", "Reptile", "Other"];

function AnimalCard({ animal, cardClass, navigate }) {
  const statusClass =
    animal.status === "Available" ? statusAvailable
    : animal.status === "Adopted" ? statusAdopted
    : statusInCare;
  return (
    <div className={cardClass} onClick={() => navigate(`/animal/${animal._id}`)}>
      {animal.imageUrl && (
        <img src={animal.imageUrl} alt={animal.name} className={animalImage} />
      )}
      <div className="flex items-center justify-between">
        <span className={animalSpeciesBadge}>{animal.species}</span>
        <span className={statusClass}>{animal.status}</span>
      </div>
      <h3 className={animalTitle}>{animal.name}</h3>
      {animal.breed && <p className={animalMeta}>{animal.breed}</p>}
      <p className={animalMeta}>Age: {animal.age}</p>
      <p className="text-sm text-[#4a6741] leading-relaxed line-clamp-2 mt-1">
        {animal.description}
      </p>
    </div>
  );
}

function Home() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/adopter-api/animals")
      .then((res) => setAnimals(res.data.payload || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const bySpecies = (list) =>
    filter === "All" ? list : list.filter((a) => a.species === filter);

  const available = bySpecies(animals.filter((a) => a.status === "Available"));
  const inCare    = bySpecies(animals.filter((a) => a.status === "In Care"));
  const adopted   = bySpecies(animals.filter((a) => a.status === "Adopted"));

  return (
    <div className={pageBackground}>
      <div className={pageWrapper}>
        <div className="mb-10">
          <h1 className={pageTitleClass}>Find Your Companion</h1>
          <p className={`${bodyText} mt-3 max-w-xl`}>
            Browse animals in need of a loving home. Each one has been rescued and
            is waiting for the right family.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {SPECIES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                filter === s
                  ? "bg-[#2d6a1f] text-white"
                  : "bg-[#e6ede0] text-[#4a6741] hover:bg-[#dae5d2]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {loading && <p className={loadingClass}>Loading animals...</p>}

        {!loading && (
          <>
            {available.length > 0 && (
              <section className="mb-12">
                <p className={sectionAvailable}>Available for Adoption — {available.length}</p>
                <div className={animalGrid}>
                  {available.map((a) => (
                    <AnimalCard key={a._id} animal={a} cardClass={availableCard} navigate={navigate} />
                  ))}
                </div>
              </section>
            )}

            {inCare.length > 0 && (
              <section className="mb-12">
                <div className={divider} />
                <p className={sectionInCare}>Under Care — {inCare.length}</p>
                <div className={animalGrid}>
                  {inCare.map((a) => (
                    <AnimalCard key={a._id} animal={a} cardClass={inCareCard} navigate={navigate} />
                  ))}
                </div>
              </section>
            )}

            {adopted.length > 0 && (
              <section className="mb-4">
                <div className={divider} />
                <p className={sectionAdopted}>Successfully Adopted — {adopted.length}</p>
                <div className={animalGrid}>
                  {adopted.map((a) => (
                    <AnimalCard key={a._id} animal={a} cardClass={adoptedCard} navigate={navigate} />
                  ))}
                </div>
              </section>
            )}

            {available.length === 0 && inCare.length === 0 && adopted.length === 0 && (
              <p className={emptyStateClass}>No animals found for this filter.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Home;

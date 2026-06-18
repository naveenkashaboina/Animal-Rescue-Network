import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { toast } from "react-hot-toast";
import {
  pageBackground, formCard, formTitle, formGroup, labelClass,
  inputClass, submitBtn, errorClass, secondaryBtn,
} from "../styles/common";

function EditAnimal() {
  const { state } = useLocation();
  const animal = state?.animal;
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: animal?.name || "",
      species: animal?.species || "",
      breed: animal?.breed || "",
      age: animal?.age || "",
      address: animal?.address || "",
      description: animal?.description || "",
      status: animal?.status || "Available",
    },
  });

  if (!animal) { navigate("/rescuer-profile"); return null; }

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError("");
    try {
      await axios.put("/rescuer-api/animals", { animalId: animal._id, ...data });
      toast.success("Animal updated!");
      navigate("/rescuer-profile/animals");
    } catch (err) {
      setServerError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${pageBackground} py-10 px-4`}>
      <div className={formCard}>
        <h2 className={formTitle}>Edit Animal</h2>
        {serverError && <p className={`${errorClass} mb-4`}>{serverError}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={formGroup}>
              <label className={labelClass}>Animal Name</label>
              <input type="text" className={inputClass} {...register("name", { required: "Name is required" })} />
              {errors.name && <p className={errorClass}>{errors.name.message}</p>}
            </div>
            <div className={formGroup}>
              <label className={labelClass}>Species</label>
              <select className={inputClass} {...register("species", { required: "Species is required" })}>
                {["Dog","Cat","Bird","Rabbit","Reptile","Other"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.species && <p className={errorClass}>{errors.species.message}</p>}
            </div>
            <div className={formGroup}>
              <label className={labelClass}>Breed</label>
              <input type="text" className={inputClass} {...register("breed")} />
            </div>
            <div className={formGroup}>
              <label className={labelClass}>Age</label>
              <input type="text" className={inputClass} {...register("age", { required: "Age is required" })} />
              {errors.age && <p className={errorClass}>{errors.age.message}</p>}
            </div>
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Current Location / Address</label>
            <input type="text" placeholder="e.g. Kormangala, Bengaluru, Karnataka"
              className={inputClass} {...register("address")} />
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Status</label>
            <select className={inputClass} {...register("status")}>
              <option value="Available">Available</option>
              <option value="In Care">In Care</option>
              <option value="Adopted">Adopted</option>
            </select>
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Description</label>
            <textarea rows={4} className={inputClass}
              {...register("description", { required: "Description is required" })} />
            {errors.description && <p className={errorClass}>{errors.description.message}</p>}
          </div>

          <div className="flex gap-3">
            <button type="submit" className={submitBtn} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" className={secondaryBtn} onClick={() => navigate("/rescuer-profile/animals")}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditAnimal;

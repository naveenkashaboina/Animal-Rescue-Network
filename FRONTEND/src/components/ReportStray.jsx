import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import {
  pageBackground, formCard, formTitle, formGroup, labelClass,
  inputClass, submitBtn, errorClass, secondaryBtn,
} from "../styles/common";

function ReportStray() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError("");
    try {
      const formData = new FormData();
      formData.append("species", data.species);
      formData.append("location", data.location);
      formData.append("description", data.description);
      if (data.imageUrl?.[0]) formData.append("imageUrl", data.imageUrl[0]);

      await axios.post("/adopter-api/stray-report", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Stray report submitted! A rescuer will pick it up.");
      reset();
      navigate("/adopter-profile");
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || "Failed to submit";
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${pageBackground} py-10 px-4`}>
      <div className={formCard}>
        <h2 className={formTitle}>Report a Stray Animal</h2>
        <p className="text-sm text-[#4a6741] text-center mb-6">
          Spotted a stray? Submit a report and a nearby rescuer will be notified.
        </p>
        <p className="text-xs text-[#2d6a1f] text-center font-medium mb-4">
            Reporting is free — always.
        </p>
        {serverError && <p className={`${errorClass} mb-4`}>{serverError}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={formGroup}>
            <label className={labelClass}>Species</label>
            <select
              className={inputClass}
              {...register("species", { required: "Species is required" })}
            >
              <option value="">Select species</option>
              {["Dog", "Cat", "Bird", "Rabbit", "Reptile", "Other"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors.species && <p className={errorClass}>{errors.species.message}</p>}
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Location</label>
            <input
              type="text"
              placeholder="e.g. Near Central Park, MG Road"
              className={inputClass}
              {...register("location", { required: "Location is required" })}
            />
            {errors.location && <p className={errorClass}>{errors.location.message}</p>}
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Description</label>
            <textarea
              rows={4}
              placeholder="Describe the animal's appearance and condition..."
              className={inputClass}
              {...register("description", { required: "Description is required" })}
            />
            {errors.description && <p className={errorClass}>{errors.description.message}</p>}
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Photo (optional)</label>
            <input
              type="file"
              accept="image/jpeg,image/png"
              className={inputClass}
              {...register("imageUrl")}
            />
          </div>

          <div className="flex gap-3">
            <button type="submit" className={submitBtn} disabled={loading}>
              {loading ? "Submitting..." : "Submit Report"}
            </button>
            <button
              type="button"
              className={secondaryBtn}
              onClick={() => navigate("/adopter-profile")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReportStray;

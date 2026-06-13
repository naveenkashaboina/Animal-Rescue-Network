import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { toast } from "react-hot-toast";
import {
  pageBackground, formCard, formTitle, formGroup, labelClass,
  inputClass, submitBtn, errorClass, secondaryBtn, mutedText,
} from "../styles/common";

function ConvertStray() {
  const { state } = useLocation();
  const report = state?.report;
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { breed: "", age: "", description: report?.description || "" },
  });

  if (!report) {
    navigate("/rescuer-profile/stray-reports");
    return null;
  }

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError("");
    try {
      await axios.post("/rescuer-api/stray-reports/convert", {
        reportId: report._id,
        name: data.name,
        breed: data.breed,
        age: data.age,
        description: data.description,
      });
      toast.success("Animal added to In Care listings and is now visible on the home page.");
      navigate("/rescuer-profile/animals");
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || "Failed to convert";
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${pageBackground} py-10 px-4`}>
      <div className={formCard}>
        <h2 className={formTitle}>Convert Stray to Animal Listing</h2>
        <p className={`${mutedText} text-center mb-2`}>
          Species: <strong>{report.species}</strong> · Location: {report.location}
        </p>
        <p className="text-xs text-[#4a6741] text-center mb-6">
          Fill in the details you now know about this animal. It will be listed as "In Care"
          and appear on the home page immediately.
        </p>

        {serverError && <p className={`${errorClass} mb-4`}>{serverError}</p>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={formGroup}>
              <label className={labelClass}>Give the animal a name</label>
              <input
                type="text"
                placeholder="e.g. Brownie"
                className={inputClass}
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && <p className={errorClass}>{errors.name.message}</p>}
            </div>

            <div className={formGroup}>
              <label className={labelClass}>Breed (optional)</label>
              <input
                type="text"
                placeholder="e.g. Indie"
                className={inputClass}
                {...register("breed")}
              />
            </div>
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Estimated Age</label>
            <input
              type="text"
              placeholder="e.g. 1 year"
              className={inputClass}
              {...register("age", { required: "Age is required" })}
            />
            {errors.age && <p className={errorClass}>{errors.age.message}</p>}
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Description</label>
            <textarea
              rows={4}
              placeholder="Describe the animal's condition, personality, and any medical needs..."
              className={inputClass}
              {...register("description", { required: "Description is required" })}
            />
            {errors.description && <p className={errorClass}>{errors.description.message}</p>}
          </div>

          <div className="flex gap-3">
            <button type="submit" className={submitBtn} disabled={loading}>
              {loading ? "Adding..." : "Add to In Care"}
            </button>
            <button
              type="button"
              className={secondaryBtn}
              onClick={() => navigate("/rescuer-profile/stray-reports")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ConvertStray;

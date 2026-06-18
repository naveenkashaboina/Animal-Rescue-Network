import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import {
  formCard, formTitle, formGroup, labelClass,
  inputClass, submitBtn, errorClass,
} from "../styles/common";

function PostAnimal() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError("");
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("species", data.species);
      formData.append("breed", data.breed || "");
      formData.append("age", data.age);
      formData.append("description", data.description);
      formData.append("status", data.status);
      formData.append("address", data.address || "");
      if (data.imageUrl?.[0]) formData.append("imageUrl", data.imageUrl[0]);

      await axios.post("/rescuer-api/animal", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Animal posted successfully!");
      reset();
      navigate("/rescuer-profile/animals");
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || "Failed to post";
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={formCard}>
      <h2 className={formTitle}>Post a Rescue Animal</h2>
      {serverError && <p className={`${errorClass} mb-4`}>{serverError}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={formGroup}>
            <label className={labelClass}>Animal Name</label>
            <input type="text" placeholder="e.g. Bruno" className={inputClass}
              {...register("name", { required: "Name is required" })} />
            {errors.name && <p className={errorClass}>{errors.name.message}</p>}
          </div>
          <div className={formGroup}>
            <label className={labelClass}>Species</label>
            <select className={inputClass} {...register("species", { required: "Species is required" })}>
              <option value="">Select species</option>
              {["Dog","Cat","Bird","Rabbit","Reptile","Other"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors.species && <p className={errorClass}>{errors.species.message}</p>}
          </div>
          <div className={formGroup}>
            <label className={labelClass}>Breed (optional)</label>
            <input type="text" placeholder="e.g. Labrador" className={inputClass} {...register("breed")} />
          </div>
          <div className={formGroup}>
            <label className={labelClass}>Age</label>
            <input type="text" placeholder="e.g. 2 years" className={inputClass}
              {...register("age", { required: "Age is required" })} />
            {errors.age && <p className={errorClass}>{errors.age.message}</p>}
          </div>
        </div>

        <div className={formGroup}>
          <label className={labelClass}>Current Location / Address</label>
          <input type="text" placeholder="e.g. Kormangala, Bengaluru, Karnataka" className={inputClass}
            {...register("address", { required: "Location is required" })} />
          {errors.address && <p className={errorClass}>{errors.address.message}</p>}
        </div>

        <div className={formGroup}>
          <label className={labelClass}>Adoption Status</label>
          <select className={inputClass} {...register("status")}>
            <option value="Available">Available</option>
            <option value="In Care">In Care</option>
            <option value="Adopted">Adopted</option>
          </select>
        </div>

        <div className={formGroup}>
          <label className={labelClass}>Description</label>
          <textarea rows={4} placeholder="Describe the animal's personality, history, and any special needs..."
            className={inputClass} {...register("description", { required: "Description is required" })} />
          {errors.description && <p className={errorClass}>{errors.description.message}</p>}
        </div>

        <div className={formGroup}>
          <label className={labelClass}>Photo (optional)</label>
          <input type="file" accept="image/jpeg,image/png" className={inputClass} {...register("imageUrl")} />
        </div>

        <button type="submit" className={submitBtn} disabled={loading}>
          {loading ? "Posting..." : "Post Animal"}
        </button>
      </form>
    </div>
  );
}

export default PostAnimal;

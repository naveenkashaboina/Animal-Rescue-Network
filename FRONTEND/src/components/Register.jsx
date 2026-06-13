import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useNavigate, NavLink } from "react-router";
import { toast } from "react-hot-toast";
import {
  pageBackground, formCard, formTitle, formGroup,
  labelClass, inputClass, submitBtn, errorClass,
  mutedText, linkClass,
} from "../styles/common";

function Register() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const onRegister = async (data) => {
    setLoading(true);
    setServerError("");
    try {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("role", data.role);
      if (data.profileImageUrl?.[0]) {
        formData.append("profileImageUrl", data.profileImageUrl[0]);
      }

      await axios.post("/auth/users", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Account created! Please login.");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || "Registration failed";
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${pageBackground} flex items-center justify-center py-16 px-4`}>
      <div className={formCard}>
        <h2 className={formTitle}>Create Account</h2>

        {serverError && <p className={`${errorClass} mb-4`}>{serverError}</p>}

        <form onSubmit={handleSubmit(onRegister)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={formGroup}>
              <label className={labelClass}>First Name</label>
              <input
                type="text"
                placeholder="Jane"
                className={inputClass}
                {...register("firstName", { required: "First name is required" })}
              />
              {errors.firstName && <p className={errorClass}>{errors.firstName.message}</p>}
            </div>

            <div className={formGroup}>
              <label className={labelClass}>Last Name</label>
              <input
                type="text"
                placeholder="Doe"
                className={inputClass}
                {...register("lastName")}
              />
            </div>
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className={inputClass}
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className={inputClass}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
            />
            {errors.password && <p className={errorClass}>{errors.password.message}</p>}
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Role</label>
            <select
              className={inputClass}
              {...register("role", { required: "Role is required" })}
            >
              <option value="">Select a role</option>
              <option value="USER">Adopter</option>
              <option value="RESCUER">Rescuer</option>
            </select>
            {errors.role && <p className={errorClass}>{errors.role.message}</p>}
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Profile Photo (optional)</label>
            <input
              type="file"
              accept="image/jpeg,image/png"
              className={inputClass}
              {...register("profileImageUrl")}
            />
          </div>

          <button type="submit" className={submitBtn} disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className={`${mutedText} text-center mt-5`}>
          Already have an account?{" "}
          <NavLink to="/login" className={linkClass}>Sign in</NavLink>
        </p>
      </div>
    </div>
  );
}

export default Register;

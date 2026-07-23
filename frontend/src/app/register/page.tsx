"use client";
import axios from "axios"; 

import { useEffect, useState } from "react";
import Link from "next/link";
import {  redirect} from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, ShieldCheck, Zap, CircleCheck } from "lucide-react";
import "../../assets/CSS/register.css";
import axiosInstance from "@/libs/axiosInstance";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth"
import router from "next/router";

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------
const registerSchema = z
  .object({
    firstName: z.string().min(2, "Enter your first name"),
    lastName: z.string().min(2, "Enter your last name"),
   email: z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Email is required")
  .regex(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    "Enter a valid email address"
  )
  .refine((val) => val.endsWith("@gmail.com"), {
    message: "Please enter a valid Gmail address (e.g. name@gmail.com)",
  }),
    password: z
      .string()
      .min(8, "Use at least 8 characters")
      .regex(/[A-Z]/, { message: "Include at least one uppercase letter" })
      .regex(/[0-9]/, { message: "Include at least one number" }),
    confirmPassword: z.string(),
    agreeToTerms: z.literal(true, {
      message: "You must accept the terms to continue",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
  

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { loginUser, loading } = useAuth();
  useEffect(() => {
    if (!loading && loginUser) { return redirect('/') }
  }, [loading , loginUser])
  

  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });


 
  const onSubmit = async (data: RegisterFormValues) => {
    setServerError(null);
    try {
      // Backend is expected to set an HTTP-only JWT cookie (~2hr expiry)
      // on success, matching the auth pattern used across your apps.
      const response = await axiosInstance.post("/user/register", data);
      console.log({ response });
      

      if (response.status === 200 || response.status === 201 || response.status === 304) {
          toast.success("User Created Successfully , Redirecting to Login Page")
        setTimeout(() => {
          redirect('/login');
        }, 3000);
      }

    } catch (err) {
      let message = "Registration failed. Please try again.";

    if (axios.isAxiosError(err) && err.response) {
      // Covers common backend shapes: { message }, { error }, or { errors: [...] }
      const data = err.response.data;
      message =
        data?.message ??
        data?.error ??
        (Array.isArray(data?.errors) ? data.errors[0] : undefined) ??
        message;
    }

    setServerError(message);
    toast.error(message);
    }
  };

  return (
    <div className="register-page">
      {/* ---------------------------------------------------------------- */}
      {/* Left panel — brand / signature moment                            */}
      {/* ---------------------------------------------------------------- */}
      <div className="register-brand">
        <div className="register-brand__glow register-brand__glow--1" />
        <div className="register-brand__glow register-brand__glow--2" />

        <Link href="/" className="register-brand__logo">
          Sarab<span>Foods</span>
        </Link>

        <div className="register-brand__content">
          <p className="register-brand__eyebrow">Create your account</p>
          <h1 className="register-brand__heading">
            Your stay, <br /> a few taps away.
          </h1>
          <p className="register-brand__subtext">
            Book faster, track your reservations, and get member-only rates
            every time you sign in.
          </p>

          {/* signature floating trust badges, echoing a stat-pill motif */}
          <div className="register-badges">
            <div className="register-badge">
              <ShieldCheck className="register-badge__icon register-badge__icon--orange" />
              <span>Encrypted &amp; secure signup</span>
            </div>
            <div className="register-badge register-badge--offset">
              <Zap className="register-badge__icon register-badge__icon--gold" />
              <span>Instant account activation</span>
            </div>
            <div className="register-badge">
              <CircleCheck className="register-badge__icon register-badge__icon--green" />
              <span>No card required to join</span>
            </div>
          </div>
        </div>

        <p className="register-brand__footer">
          © {new Date().getFullYear()} Sarab Foods. All rights reserved.
        </p>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Right panel — the form                                           */}
      {/* ---------------------------------------------------------------- */}
      <div className="register-form-panel">
        <div className="register-form-wrap">
          <div className="register-form-panel__logo-mobile">
            <span>
              Grand<span className="accent">Maison</span>
            </span>
          </div>

          <div className="register-form-header">
            <h2>Create your account</h2>
            <p>
              Already have one?{" "}
              <Link href="/login" className="link">
                Sign in instead
              </Link>
            </p>
          </div>

          {/* {serverError && (
            <div role="alert" className="register-error-banner">
              {serverError}
            </div>
          )} */}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="register-form">
            {/* First name */}
            <div className="field">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                type="text"
                autoComplete="name"
                placeholder="Hadi Ahmed"
                aria-invalid={!!errors.firstName}
                aria-describedby={errors.firstName ? "firstName-error" : undefined}
                {...register("firstName")}
              />
              {errors.firstName && (
                <p id="firstName-error" className="field__error">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            {/* Last Name */}
             <div className="field">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                type="text"
                autoComplete="name"
                placeholder="Hadi Ahmed"
                aria-invalid={!!errors.lastName}
                aria-describedby={errors.lastName ? "lastName-error" : undefined}
                {...register("lastName")}
              />
              {errors.lastName && (
                <p id="lastName-error" className="field__error">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                {...register("email")}
              />
              {errors.email && (
                <p id="email-error" className="field__error">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="field__input-wrap">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="field__toggle"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="field__error">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm password */}
            <div className="field">
              <label htmlFor="confirmPassword">Confirm password</label>
              <div className="field__input-wrap">
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="field__toggle"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p id="confirmPassword-error" className="field__error">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="field">
              <label className="checkbox-row">
                <input type="checkbox" {...register("agreeToTerms")} />
                <span>
                  I agree to the{" "}
                  <Link href="/terms" className="link">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="link">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.agreeToTerms && (
                <p className="field__error">{errors.agreeToTerms.message}</p>
              )}
            </div>

            {/* Submit */}
            <button type="submit" disabled={isSubmitting} className="submit-btn">
              {isSubmitting ? "Creating your account…" : "Create account"}
            </button>
          </form>

          <p className="register-form-panel__disclaimer">
            Protected by industry-standard encryption. We never share your data.
          </p>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {toast} from "sonner"
import { z } from "zod";
import { Eye, EyeOff, ShieldCheck, Zap, CircleCheck } from "lucide-react";
  import axiosInstance from "@/libs/axiosInstance"
import "../../assets/CSS/login.css"
import axios from "axios";

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------
const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    console.log({ data });
    setServerError(null);
    try {
      // Backend is expected to set an HTTP-only JWT cookie (~2hr expiry)
      // on success, matching the auth pattern used across your apps.
      const response = await axiosInstance.post("/user/login", data);

      if (response.status === 500) {
        return toast.error("Internal Server Error");
      }
      if (response.status === 401) {
        return toast.error("Invalid  Credentials ");
      }
      if (response.status === 200 || response.status === 201) {
        toast.success("Login Successfully ");
        toast.success(" Redirecting to Home Page");
        setTimeout(() => {
          router.push("/");
        }, 200)
        
      }

      
    } catch (err) {
      let message = "Invalid Credentials";
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
      <div className="login-page">
        {/* ---------------------------------------------------------------- */}
        {/* Left panel — brand / signature moment                            */}
        {/* ---------------------------------------------------------------- */}
        <div className="login-brand">
          <div className="login-brand__glow login-brand__glow--1" />
          <div className="login-brand__glow login-brand__glow--2" />

          <Link href="/" className="login-brand__logo">
            Sarab<span>Foods</span>
          </Link>

          <div className="login-brand__content">
            <p className="login-brand__eyebrow">Welcome back</p>
            <h1 className="login-brand__heading">
              Pick up right <br /> where you left off.
            </h1>
            <p className="login-brand__subtext">
              Sign in to manage your bookings, revisit saved stays, and check
              out with your details already on file.
            </p>

            {/* signature floating trust badges, echoing a stat-pill motif */}
            <div className="login-badges">
              <div className="login-badge">
                <ShieldCheck className="login-badge__icon login-badge__icon--orange" />
                <span>Encrypted &amp; secure sign in</span>
              </div>
              <div className="login-badge login-badge--offset">
                <Zap className="login-badge__icon login-badge__icon--gold" />
                <span>Your bookings, one tap away</span>
              </div>
              <div className="login-badge">
                <CircleCheck className="login-badge__icon login-badge__icon--green" />
                <span>Trusted on this device</span>
              </div>
            </div>
          </div>

          <p className="login-brand__footer">
            © {new Date().getFullYear()} Grand Maison. All rights reserved.
          </p>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Right panel — the form                                           */}
        {/* ---------------------------------------------------------------- */}
        <div className="login-form-panel">
          <div className="login-form-wrap">
            <div className="login-form-panel__logo-mobile">
              <span>
                Grand<span className="accent">Maison</span>
              </span>
            </div>

            <div className="login-form-header">
              <h2>Sign in</h2>
              <p>
                New here?{" "}
                <Link href="/register" className="link">
                  Create an account
                </Link>
              </p>
            </div>

            {serverError && (
              <div role="alert" className="login-error-banner">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="login-form">
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
                <div className="field__label-row">
                  <label htmlFor="password">Password</label>
                  <Link href="/forgot-password" className="link link--small">
                    Forgot password?
                  </Link>
                </div>
                <div className="field__input-wrap">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
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

              {/* Remember me */}
              <div className="field">
                <label className="checkbox-row">
                  <input type="checkbox" {...register("rememberMe")} />
                  <span>Keep me signed in on this device</span>
                </label>
              </div>

              {/* Submit */}
              <button type="submit" disabled={isSubmitting} className="submit-btn">
                {isSubmitting ? "Signing in…" : "Sign in"}
              </button>
            </form>

            <p className="login-form-panel__disclaimer">
              Protected by industry-standard encryption. We never share your data.
            </p>
          </div>
        </div>
      </div>
    );
  }
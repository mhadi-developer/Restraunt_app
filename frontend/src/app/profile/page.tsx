"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosInstance from "@/libs/axiosInstance"; // adjust to your actual axiosInstance path
import "@/assets/CSS/profile-page.css";

/* ------------------------------------------------------------------ */
/* Types — line these up with the actual `/get/user/details` response  */
/* API returns: { user: { id, firstName, lastName, email,             */
/*   phoneNumber, address, createdAt, updatedAt } }                    */
/* ------------------------------------------------------------------ */
interface ApiUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string | null;
  createdAt: string; // ISO date string
  updatedAt: string;
}

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  avatarUrl: string | null; // not returned by the API today; kept optional
  memberSince: string; // derived from createdAt
}

interface StatusMessage {
  type: "success" | "error";
  text: string;
}

/* ------------------------------------------------------------------ */
/* Validation schemas                                                  */
/* ------------------------------------------------------------------ */
const profileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(40, "First name is too long"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(40, "Last name is too long"),
  email: z.string().email("Enter a valid email address"),
  phoneNumber: z
    .string()
    .min(7, "Enter a valid phone number")
    .max(20, "Phone number is too long"),
  address: z
    .string()
    .max(160, "Address is too long")
    .optional()
    .or(z.literal("")),
});
type ProfileFormValues = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(8, "Enter your current password"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type PasswordFormValues = z.infer<typeof passwordSchema>;

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */
function formatMemberSince(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function fullNameOf(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.replace(/\s+/g, " ").trim();
}

function initials(firstName: string, lastName: string): string {
  const first = firstName.trim()[0] ?? "";
  const last = lastName.trim()[0] ?? "";
  return `${first}${last}`.toUpperCase();
}

/** Maps the raw API user object into the shape the UI works with,
 *  trimming the stray whitespace the API currently sends around
 *  firstName/lastName and normalizing null fields. */
function mapApiUserToProfile(apiUser: ApiUser): UserProfile {
  return {
    id: apiUser.id,
    firstName: apiUser.firstName.trim(),
    lastName: apiUser.lastName.trim(),
    email: apiUser.email,
    phoneNumber: apiUser.phoneNumber,
    address: apiUser.address ?? "",
    avatarUrl: null,
    memberSince: apiUser.createdAt,
  };
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileStatus, setProfileStatus] = useState<StatusMessage | null>(
    null
  );

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<StatusMessage | null>(
    null
  );

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  /* Fetch the signed-in user's profile. This route sits behind the
     isAuthenticated middleware — the JWT cookie travels automatically
     as long as axiosInstance is configured with withCredentials: true.
     Response shape: { user: ApiUser } */
  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      setIsLoading(true);
      setLoadError(null);
      try {
        const { data } = await axiosInstance.get<{ user: ApiUser }>(
          "/get/user/details"
        );
        if (!isMounted) return;

        const mapped = mapApiUserToProfile(data.user);
        setProfile(mapped);
        profileForm.reset({
          firstName: mapped.firstName,
          lastName: mapped.lastName,
          email: mapped.email,
          phoneNumber: mapped.phoneNumber,
          address: mapped.address,
        });
      } catch {
        if (!isMounted) return;
        setLoadError("We couldn't load your profile. Please try again.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadProfile();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleCancelEdit() {
    if (profile) {
      profileForm.reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
        address: profile.address,
      });
    }
    setIsEditing(false);
    setProfileStatus(null);
  }

  async function onSubmitProfile(values: ProfileFormValues) {
    setIsSavingProfile(true);
    setProfileStatus(null);
    try {
      const { data } = await axiosInstance.patch<{ user: ApiUser }>(
        "/api/users/me",
        {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phoneNumber: values.phoneNumber,
          address: values.address || null,
        }
      );
      const mapped = mapApiUserToProfile(data.user);
      setProfile(mapped);
      setIsEditing(false);
      setProfileStatus({
        type: "success",
        text: "Your details have been updated.",
      });
    } catch {
      setProfileStatus({
        type: "error",
        text: "We couldn't save your changes. Please try again.",
      });
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function onSubmitPassword(values: PasswordFormValues) {
    setIsChangingPassword(true);
    setPasswordStatus(null);
    try {
      await axiosInstance.post("/api/users/change-password", {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      passwordForm.reset();
      setPasswordStatus({
        type: "success",
        text: "Your password has been changed.",
      });
    } catch {
      setPasswordStatus({
        type: "error",
        text: "We couldn't change your password. Check your current password and try again.",
      });
    } finally {
      setIsChangingPassword(false);
    }
  }

  function handleAvatarClick() {
    fileInputRef.current?.click();
  }

  async function handleAvatarChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];
    if (!file || !profile) return;

    const localUrl = URL.createObjectURL(file);
    setAvatarPreview(localUrl);
    setIsUploadingAvatar(true);

    try {
      // Wire this to the same Cloudinary upload flow used on the
      // Add Menu Item page, then PATCH the returned secure_url here.
      // Note: the current /get/user/details response has no avatarUrl
      // field yet, so the backend needs to support this before the
      // uploaded image will persist across reloads.
      const formData = new FormData();
      formData.append("avatar", file);
      const { data } = await axiosInstance.patch<{ user: ApiUser }>(
        "/api/users/me/avatar",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setProfile(mapApiUserToProfile(data.user));
    } catch {
      setProfileStatus({
        type: "error",
        text: "We couldn't update your photo. Please try again.",
      });
    } finally {
      setIsUploadingAvatar(false);
      event.target.value = "";
    }
  }

  if (isLoading) {
    return (
      <div className="eh-profile">
        <div className="eh-profile__loading">Loading your profile…</div>
      </div>
    );
  }

  if ( !profile) {
    return (
      <div className="eh-profile">
        <div className="eh-profile__error-state">
          <p>{loadError ?? "Your profile is unavailable right now."}</p>
        </div>
      </div>
    );
  }

  const avatarSrc = avatarPreview ?? profile.avatarUrl;
  const displayName = fullNameOf(profile.firstName, profile.lastName);

  return (
    <div className="eh-profile">
      <div className="eh-profile__container">
        {/* ---------------------------------------------------------- */}
        {/* Hero: membership card                                      */}
        {/* ---------------------------------------------------------- */}
        <section className="eh-profile-card" aria-label="Membership card">
          <div className="eh-profile-card__glow" aria-hidden="true" />

          <div className="eh-profile-card__top">
            <div className="eh-profile-card__avatar-wrap">
              <button
                type="button"
                className="eh-profile-card__avatar"
                onClick={handleAvatarClick}
                aria-label="Change profile photo"
              >
                {avatarSrc ? (
                  <img src={avatarSrc} alt="" />
                ) : (
                  <span>{initials(profile.firstName, profile.lastName)}</span>
                )}
                <span
                  className="eh-profile-card__avatar-badge"
                  aria-hidden="true"
                >
                  {isUploadingAvatar ? "…" : "✎"}
                </span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="eh-visually-hidden"
                onChange={handleAvatarChange}
              />
            </div>

            <div className="eh-profile-card__identity">
              <h1 className="eh-profile-card__name">{displayName}</h1>
              <p className="eh-profile-card__email">{profile.email}</p>
            </div>
          </div>

          <div className="eh-profile-card__divider" aria-hidden="true" />

          <div className="eh-profile-card__meta">
            <div>
              <span className="eh-profile-card__meta-label">Member ID</span>
              <span className="eh-profile-card__meta-value">
                EH-{profile.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
            <div>
              <span className="eh-profile-card__meta-label">
                Member since
              </span>
              <span className="eh-profile-card__meta-value">
                {formatMemberSince(profile.memberSince)}
              </span>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Contact details + security                                 */}
        {/* ---------------------------------------------------------- */}
        <div className="eh-profile__grid">
          {/* Contact details */}
          <section
            className="eh-profile-section"
            aria-labelledby="contact-details-heading"
          >
            <div className="eh-profile-section__header">
              <div>
                <h2
                  id="contact-details-heading"
                  className="eh-profile-section__title"
                >
                  Your details
                </h2>
                <p className="eh-profile-section__subtitle">
                  Keep your contact information current so we can reach you
                  about orders.
                </p>
              </div>
              {!isEditing && (
                <button
                  type="button"
                  className="eh-btn eh-btn--ghost"
                  onClick={() => setIsEditing(true)}
                >
                  Edit details
                </button>
              )}
            </div>

            {profileStatus && (
              <div
                className={`eh-status eh-status--${profileStatus.type}`}
                role="status"
              >
                {profileStatus.text}
              </div>
            )}

            <form
              className="eh-profile-form"
              onSubmit={profileForm.handleSubmit(onSubmitProfile)}
            >
              <div className="eh-profile-form__row">
                <div className="eh-profile-form__field">
                  <label
                    className="eh-profile-form__label"
                    htmlFor="firstName"
                  >
                    First name
                  </label>
                  <input
                    id="firstName"
                    className="eh-profile-form__input"
                    disabled={!isEditing}
                    {...profileForm.register("firstName")}
                  />
                  {profileForm.formState.errors.firstName && (
                    <span className="eh-profile-form__error">
                      {profileForm.formState.errors.firstName.message}
                    </span>
                  )}
                </div>

                <div className="eh-profile-form__field">
                  <label
                    className="eh-profile-form__label"
                    htmlFor="lastName"
                  >
                    Last name
                  </label>
                  <input
                    id="lastName"
                    className="eh-profile-form__input"
                    disabled={!isEditing}
                    {...profileForm.register("lastName")}
                  />
                  {profileForm.formState.errors.lastName && (
                    <span className="eh-profile-form__error">
                      {profileForm.formState.errors.lastName.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="eh-profile-form__field">
                <label className="eh-profile-form__label" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  className="eh-profile-form__input"
                  disabled={!isEditing}
                  {...profileForm.register("email")}
                />
                {profileForm.formState.errors.email && (
                  <span className="eh-profile-form__error">
                    {profileForm.formState.errors.email.message}
                  </span>
                )}
              </div>

              <div className="eh-profile-form__field">
                <label
                  className="eh-profile-form__label"
                  htmlFor="phoneNumber"
                >
                  Phone number
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  className="eh-profile-form__input"
                  disabled={!isEditing}
                  {...profileForm.register("phoneNumber")}
                />
                {profileForm.formState.errors.phoneNumber && (
                  <span className="eh-profile-form__error">
                    {profileForm.formState.errors.phoneNumber.message}
                  </span>
                )}
              </div>

              <div className="eh-profile-form__field">
                <label className="eh-profile-form__label" htmlFor="address">
                  Delivery address
                </label>
                <input
                  id="address"
                  className="eh-profile-form__input"
                  disabled={!isEditing}
                  placeholder={!isEditing && !profile.address ? "Not set" : ""}
                  {...profileForm.register("address")}
                />
                {profileForm.formState.errors.address && (
                  <span className="eh-profile-form__error">
                    {profileForm.formState.errors.address.message}
                  </span>
                )}
              </div>

              {isEditing && (
                <div className="eh-profile-form__actions">
                  <button
                    type="button"
                    className="eh-btn eh-btn--ghost"
                    onClick={handleCancelEdit}
                    disabled={isSavingProfile}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="eh-btn eh-btn--primary"
                    disabled={isSavingProfile || !profileForm.formState.isDirty}
                  >
                    {isSavingProfile ? "Saving…" : "Save changes"}
                  </button>
                </div>
              )}
            </form>
          </section>

          {/* Security */}
          <section
            className="eh-profile-section"
            aria-labelledby="security-heading"
          >
            <div className="eh-profile-section__header">
              <div>
                <h2 id="security-heading" className="eh-profile-section__title">
                  Password
                </h2>
                <p className="eh-profile-section__subtitle">
                  Use at least 8 characters. You&rsquo;ll stay signed in on
                  this device.
                </p>
              </div>
            </div>

            {passwordStatus && (
              <div
                className={`eh-status eh-status--${passwordStatus.type}`}
                role="status"
              >
                {passwordStatus.text}
              </div>
            )}

            <form
              className="eh-profile-form"
              onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
            >
              <div className="eh-profile-form__field">
                <label
                  className="eh-profile-form__label"
                  htmlFor="currentPassword"
                >
                  Current password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  className="eh-profile-form__input"
                  autoComplete="current-password"
                  {...passwordForm.register("currentPassword")}
                />
                {passwordForm.formState.errors.currentPassword && (
                  <span className="eh-profile-form__error">
                    {passwordForm.formState.errors.currentPassword.message}
                  </span>
                )}
              </div>

              <div className="eh-profile-form__field">
                <label className="eh-profile-form__label" htmlFor="newPassword">
                  New password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  className="eh-profile-form__input"
                  autoComplete="new-password"
                  {...passwordForm.register("newPassword")}
                />
                {passwordForm.formState.errors.newPassword && (
                  <span className="eh-profile-form__error">
                    {passwordForm.formState.errors.newPassword.message}
                  </span>
                )}
              </div>

              <div className="eh-profile-form__field">
                <label
                  className="eh-profile-form__label"
                  htmlFor="confirmPassword"
                >
                  Confirm new password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="eh-profile-form__input"
                  autoComplete="new-password"
                  {...passwordForm.register("confirmPassword")}
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <span className="eh-profile-form__error">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </span>
                )}
              </div>

              <div className="eh-profile-form__actions">
                <button
                  type="submit"
                  className="eh-btn eh-btn--primary"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? "Updating…" : "Update password"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
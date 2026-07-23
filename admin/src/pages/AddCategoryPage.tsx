import React, { useCallback, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import "../resources/css/add-category-page.css";
import toast from "react-hot-toast";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const categorySchema = z.object({
  categoryName: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters.")
    .max(60, "Category name must be under 60 characters."),
  image: z
    .custom<File>((val) => val instanceof File, "Please upload a category image.")
    .refine((file) => file && file.size <= MAX_FILE_SIZE, "Image must be under 5MB.")
    .refine(
      (file) => file && ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only JPG, PNG, or WEBP images are allowed."
    ),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export const AddCategoryPage: React.FC = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { categoryName: "" },
    mode: "onSubmit",
  });

  const applyFile = useCallback(
    (file: File | undefined | null, onChange: (file: File | undefined) => void) => {
      if (!file) return;
      onChange(file);

      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    },
    []
  );

  const removeImage = (onChange: (file: undefined) => void) => {
    onChange(undefined);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (values: CategoryFormValues) => {
  try {
    const formData = new FormData();
    formData.append("name", values.categoryName);
    formData.append("image", values.image); // Appends the File object

    // If using a relative URL or base URL configuration, adjust your endpoint string accordingly
    const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/create/category`, {
      method: "POST",
      // Do NOT set 'Content-Type': 'multipart/form-data' manually here!
      // Browser automatically injects boundary headers for FormData.
      credentials:'include',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    toast.success("Category Created Successfully");
    reset();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    toast.error(error.message || "Failed to create category");
  }
};
  return (
    <div className="cc-page">
      <div className="cc-card">
        <div className="cc-card-eyebrow">Catalog / New Entry</div>
        <h1 className="cc-card-title">Create Category</h1>
        <p className="cc-card-subtitle">
          Name the category and give it a face — this is what shoppers will see first.
        </p>

        <form className="cc-form" encType={'multipart/form-data'} onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="cc-field">
            <label htmlFor="categoryName" className="cc-label">
              Category name
            </label>
            <input
              id="categoryName"
              type="text"
              className={`cc-input ${errors.categoryName ? "cc-input-error" : ""}`}
              placeholder="e.g. Smoked Chili Oils"
              {...register("categoryName")}
            />
            {errors.categoryName && (
              <span className="cc-error-text">{errors.categoryName.message}</span>
            )}
          </div>

          <div className="cc-field">
            <label className="cc-label">Category image</label>

            <Controller
              name="image"
              control={control}
              render={({ field: { onChange } }) => {
                const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
                  e.preventDefault();
                  setIsDragging(false);
                  applyFile(e.dataTransfer.files?.[0], onChange);
                };

                const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                  applyFile(e.target.files?.[0], onChange);
                };

                return !previewUrl ? (
                  <div
                    className={`cc-dropzone ${isDragging ? "cc-dropzone-active" : ""} ${
                      errors.image ? "cc-input-error" : ""
                    }`}
                    onDrop={onDrop}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
                    }}
                  >
                    <div className="cc-dropzone-icon">
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 16V4M12 4L7 9M12 4L17 9"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4 16V18.5C4 19.8807 5.11929 21 6.5 21H17.5C18.8807 21 20 19.8807 20 18.5V16"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p className="cc-dropzone-title">Drag an image here, or click to browse</p>
                    <p className="cc-dropzone-hint">JPG, PNG, or WEBP, up to 5MB</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="cc-hidden-input"
                      onChange={onInputChange}
                    />
                  </div>
                ) : (
                  <div className="cc-preview">
                    <img src={previewUrl} alt="Category preview" className="cc-preview-img" />
                    <div className="cc-preview-overlay">
                      <button
                        type="button"
                        className="cc-preview-btn"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Replace
                      </button>
                      <button
                        type="button"
                        className="cc-preview-btn cc-preview-btn-remove"
                        onClick={() => removeImage(onChange)}
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="cc-hidden-input"
                      onChange={onInputChange}
                    />
                  </div>
                );
              }}
            />
            {errors.image && (
              <span className="cc-error-text">{errors.image.message as string}</span>
            )}
          </div>

          <button type="submit" className="cc-submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating…" : "Create Category"}
          </button>
        </form>
      </div>
    </div>
  );
};


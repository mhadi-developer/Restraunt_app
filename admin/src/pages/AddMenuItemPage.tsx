import React, { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import '../resources/css/add-menu-item-page.css';
import { useAdminAuth } from '../context/AdminAuthProvider';
import { useNavigate } from 'react-router';
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';

// 1. Zod Validation Schema
const menuItemSchema = z.object({
  itemName: z.string().min(2, 'Item name must be at least 2 characters long'),
  categoryName: z.string('please select any category'),
  price: z
    .number()
    .positive('Price must be greater than zero'),
  shortDescription: z
    .string()
    .min(10, 'Description should be at least 10 characters')
    .max(200, 'Description cannot exceed 150 characters'),
  badge: z.enum(['none', 'hot', 'new', 'best seller', 'chiefs pick']).default('none'),
  images: z
    .custom<FileList>()
    .refine((files) => files && files.length > 0, 'Please select at least one image.'),
});

type MenuItemFormValues = z.input<typeof menuItemSchema>;

interface Category {
  id: string;
  categoryName: string;
}

const AddMenuItem = () => {
  const { loginAdmin } = useAdminAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      itemName: '',
      categoryName: '',
      price: undefined,
      shortDescription: '',
      badge: 'none',
    },
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Redirect to admin login if not authenticated.
  useEffect(() => {
    if (!loginAdmin?.adminName) {
      navigate('/admin/login');
    }
  }, [loginAdmin, navigate]);

  // Watch the image field to generate previews instantly
  const selectedImages = watch('images');

  useEffect(() => {
    if (selectedImages && selectedImages.length > 0) {
      const urls = Array.from(selectedImages).map((file) => URL.createObjectURL(file));
      setImagePreviews(urls);
      return () => urls.forEach((url) => URL.revokeObjectURL(url));
    } else {
      setImagePreviews([]);
    }
  }, [selectedImages]);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/admin/get/categories');
        if (response.status === 200 || response.status === 304) {
          setCategories(response?.data?.fetchedCategoires);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Handle Form Submission via FormData
  const onSubmit: SubmitHandler<MenuItemFormValues> = async (data) => {
    try {
      const formData = new FormData();

      // 1. Append standard text fields
      formData.append('itemName', data.itemName);
      formData.append('categoryName', data.categoryName);
      // FormData only accepts strings or Blobs, so we must convert the number
      formData.append('price', data.price.toString()); 
      formData.append('shortDescription', data.shortDescription);
      formData.append('badge', data.badge ?? 'none');

      // 2. Append all images to the same key ('images')
      // Make sure your backend Multer setup expects an array of files under the 'images' field
      Array.from(data.images).forEach((file) => {
        formData.append('images', file);
      });

      // 3. Send POST request to your backend endpoint
     const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/create/item`, {
      method: "POST",
      // Do NOT set 'Content-Type': 'multipart/form-data' manually here!
      // Browser automatically injects boundary headers for FormData.
      credentials:'include',
      body: formData,
    });

      if (response.ok) {
      toast.success('Item Successfully Added')
        setTimeout(() => { reset() },2000)
        setImagePreviews([]);
      }
      if (!response.ok) {
        const mesage = await response.json()
         toast.error(mesage.message)
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to add item')
    
    }
  };

  return (
    <div className="menu-form-container">
      <div className="menu-form-card">
        <h2>Add New Menu Item</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          
          {/* Item Name */}
          <div className="form-group">
            <label htmlFor="itemName">Item Name</label>
            <input
              id="itemName"
              type="text"
              className="form-control"
              placeholder="e.g. Truffle Fries"
              {...register('itemName')}
            />
            {errors.itemName && <span className="error-message">{errors.itemName.message}</span>}
          </div>

          {/* Category Dropdown */}
          <div className="form-group">
            <label htmlFor="categoryId">Category</label>
            <select
              id="categoryId"
              className="form-control"
              {...register('categoryName')}
              disabled={isLoadingCategories}
            >
              <option value="">
                {isLoadingCategories ? 'Loading categories...' : 'Select a category'}
              </option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.categoryName}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
            {errors.categoryName && <span className="error-message">{errors.categoryName.message}</span>}
          </div>

          {/* Price */}
          <div className="form-group">
            <label htmlFor="price">Price ($)</label>
            <input
              id="price"
              type="number"
              step="0.01"
              className="form-control"
              placeholder="0.00"
              {...register('price', { valueAsNumber: true })}
            />
            {errors.price && <span className="error-message">{errors.price.message}</span>}
          </div>

          {/* Short Description */}
          <div className="form-group">
            <label htmlFor="shortDescription">Short Description</label>
            <textarea
              id="shortDescription"
              className="form-control"
              placeholder="Describe the dish ingredients and flavor profile..."
              {...register('shortDescription')}
            />
            {errors.shortDescription && <span className="error-message">{errors.shortDescription.message}</span>}
          </div>

          {/* Badge Enum Dropdown */}
          <div className="form-group">
            <label htmlFor="badge">Display Badge</label>
            <select id="badge" className="form-control" {...register('badge')}>
              <option value="none">None</option>
              <option value="hot">Hot</option>
              <option value="new">New</option>
              <option value="best seller">Best Seller</option>
              <option value="chiefs pick">Chef's Pick</option>
            </select>
            {errors.badge && <span className="error-message">{errors.badge.message}</span>}
          </div>

          {/* Multiple Image Upload */}
          <div className="form-group file-upload-wrapper">
            <label htmlFor="images">Upload Images (One or more)</label>
            <input
              id="images"
              type="file"
              accept="image/*"
              multiple
              className="file-input"
              {...register('images')}
            />
            {errors.images && <span className="error-message">{errors.images.message}</span>}
            
            {/* Live Previews */}
            {imagePreviews.length > 0 && (
              <div className="image-preview-gallery">
                {imagePreviews.map((url, index) => (
                  <img key={index} src={url} alt={`Preview ${index + 1}`} className="image-preview-item" />
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Saving to Database...' : 'Add Menu Item'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMenuItem;
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "../resources/css/login-page.css";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";


// Validation Schema
const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),

  remember: z
    .boolean()
    .optional(),
});


// Infer TypeScript type from schema
type LoginFormData = z.infer<typeof loginSchema>;


const AdminLogin: React.FC = () => {

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });


  const onSubmit = async (data: LoginFormData) => {

      const response = await axiosInstance.post('/admin/login', data);
      if (response.status === 200 || response.status === 201) {
          toast.success('Login successfully redirecting.....')
          setTimeout(() => {
              window.location.href = '/';  
          },3000)
          
      }
    
    
  };


  return (
    <div className="login-body">

      <div className="login-layout">


        {/* Branding Panel */}
        <div className="brand-panel">

          <div className="brand-content">

            <h2 className="brand-logo">
              Sarab<span>Foods</span>
            </h2>


            <p className="brand-tagline">
              Management Portal
            </p>


            <div className="decorative-line"></div>


            <blockquote className="brand-quote">
              "Operational precision behind culinary excellence."
            </blockquote>

          </div>

        </div>



        {/* Form Panel */}
        <div className="form-panel">

          <div className="form-container">


            <h2 className="mobile-logo">
              Maison<span>Chili</span>
            </h2>



            <div className="form-header">

              <h1 className="login-title">
                Welcome Back
              </h1>


              <p className="login-subtitle">
                Sign in to access your dashboard.
              </p>

            </div>



            <form
              className="login-form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >


              {/* Email */}
              <div className="input-group">

                <label htmlFor="email">
                  Email Address
                </label>


                <input
                  id="email"
                  type="email"
                  placeholder="hadi@maisonchili.com"
                  {...register("email")}
                />


                {
                  errors.email && (
                    <p className="error-message">
                      {errors.email.message}
                    </p>
                  )
                }

              </div>





              {/* Password */}
              <div className="input-group">

                <label htmlFor="password">
                  Password
                </label>


                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                />


                {
                  errors.password && (
                    <p className="error-message">
                      {errors.password.message}
                    </p>
                  )
                }

              </div>






              {/* Actions */}
              <div className="form-actions">


                <label className="checkbox-wrapper">

                  <input
                    type="checkbox"
                    {...register("remember")}
                  />


                  <span className="checkbox-label">
                    Remember me
                  </span>


                </label>



                <a
                  href="#"
                  className="forgot-link"
                >
                  Forgot password?
                </a>


              </div>





              <button
                type="submit"
                className="btn-primary btn-block"
                disabled={isSubmitting}
              >

                {
                  isSubmitting
                    ? "Signing In..."
                    : "Sign In"
                }

              </button>



            </form>


          </div>


        </div>


      </div>


    </div>
  );
};


export default AdminLogin;
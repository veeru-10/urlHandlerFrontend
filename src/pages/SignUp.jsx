import { Link } from "react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../store/stores/authSlice";
import { Eye, EyeOff } from "lucide-react";

import google from '../assets/Google.png'

//i have to define schma for validation
const signUpSchema = z.object({
  name: z
    .string()
    .min(5, { message: "Name must be 5 characters" })
    .max(20, { message: "name cannot exceed 20 characters" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email" }),
  password: z
    .string()
    .min(6, { message: "password must be atleast 6 characters" }),
  mobile: z
    .string()
    .regex(/^[0-9]{10}$/, { message: "Mobile number must be 10 digits" }),
});
const API_URL = import.meta.env.VITE_BACKEND_URI || "http://localhost:5050";

const SignUp = () => {
  //initialize useForm and pass the zodReslover
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      mobile: "",
      email: "",
      password: "",
    },
  });
  // const selectedInterests = watch("interests");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { error: authError, status } = useSelector((state) => state.auth);
  const isSigningUp = status === "signingUp";
  const onSubmit = async (data) => {
    const result = await dispatch(signupUser(data));
    if (!result.error) navigate("/login");
  };
  return (
    <>
      <div className="max-w-xl sm:mx-auto mx-4 my-5 ">
        <h1 className="text-center text-4xl">Create an account</h1>

        <div className="flex flex-col gap-4 px-4 py-2 rounded bg-black/5 border border-black/10 mt-4 backdrop-blur-lg ">
          {/* <Link to="/">
            <h1 className="text-3xl md:text-4xl text-amber-800 text-center">
              Url
              <span className="text-slate-700">Handler</span>
            </h1>
          </Link> */}
          <button
            type="button"
            onClick={() => {
              window.location.href = `${API_URL}/api/auth/google`;
            }}
            className="px-8 py-3 bg-amber-800 text-white rounded-lg mx-auto btn mt-4 cursor-pointer flex gap-2"
          >
            <span> <img src={google} className="size-6" alt="" /> </span>continue with google 
          </button>
          <div className="text-gray-700 text-xl text-center">
            or continue with email
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
            <div>
              <input
                type="text"
                {...register("name")}
                placeholder="Your name.."
                className="border px-4 py-2 rounded w-full outline-0 foucs:border-2 focus:border-gray-400 transition-all duration-500"
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div>
              <input
                type="email"
                {...register("email", { required: true })}
                placeholder="Your email.."
                className="border px-4 py-2 rounded w-full outline-0 foucs:border-2 focus:border-gray-400 transition-all duration-500"
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: true })}
                  placeholder="Your password.."
                  className="border px-4 py-2 pr-12 rounded w-full outline-0 foucs:border-2 focus:border-gray-400 transition-all duration-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>
            <div>
              <input
                type="tel"
                {...register("mobile", { required: true })}
                placeholder="Your mobile.."
                className="border px-4 py-2 rounded w-full outline-0 foucs:border-2 focus:border-gray-400 transition-all duration-500"
              />
              {errors.mobile && (
                <p className="text-red-500">{errors.mobile.message}</p>
              )}
            </div>
            <p className="font-semibold text-blue-600 text-sm text-end my-4">
              do you have an account ? -{" "}
              <span className="text-gray-600 underline">
                <Link to="/login">click here to login</Link>
              </span>
            </p>
            {authError && (
              <p className="font-sans text-sm text-red-600">{authError}</p>
            )}
            <button
              type="submit"
              disabled={isSigningUp}
              className="ink-button mx-auto cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 mb-2"
            >
              {isSigningUp ? "Signing up..." : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;

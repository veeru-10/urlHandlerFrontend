import { Link } from "react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, loginUser } from "../store/stores/authSlice";
import { useNavigate } from "react-router";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("enter a valid email"),
  password: z.string().min(6, "atleast 6 characters"),
});
const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const authError = useSelector((state) => state.auth.error);

  useEffect(() => {
    if (!authError) return undefined;

    const timeoutId = window.setTimeout(() => {
      dispatch(clearAuthError());
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [authError, dispatch]);

  const onSubmit = async (data) => {
    dispatch(clearAuthError());
    const result = await dispatch(loginUser(data));
    if (!result.error) navigate("/dashboard");
  };
  return (
    <>
      <div className="max-w-xl sm:mx-auto mx-4 my-5 flex justify-center flex-col">
        <h1 className="text-center text-4xl">Sign In</h1>

        <div className="flex flex-col gap-4 px-4 rounded bg-black/5 border border-black/10 mt-4 backdrop-blur-lg py-10">
          <Link to="/">
            <h1 className="text-3xl md:text-4xl text-amber-800 text-center">
              Url
              <span className="text-slate-700">Handler</span>
            </h1>
          </Link>
          <button className="px-8 py-3 bg-amber-800 text-white rounded-lg mx-auto btn">
            continue with google
          </button>
          <div className="text-gray-700 text-xl text-center">
            or continue with email
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                type="email"
                {...register("email")}
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
                  {...register("password")}
                  placeholder="Your password.."
                  className="border px-4 py-2 pr-12 rounded w-full outline-0 foucs:border-2 focus:border-gray-400 transition-all duration-500 text-xl"
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

            <p className="font-semibold text-blue-600 text-sm text-end">
              don't you have an account ? -{" "}
              <span className="text-gray-600 underline">
                <Link to="/signup">click here to sign up</Link>
              </span>
            </p>
            {authError && (
              <p className="font-sans text-sm text-red-600">{authError}</p>
            )}
            <button type="submit" className="ink-button mr-auto cursor-pointer">
              Sign in
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;

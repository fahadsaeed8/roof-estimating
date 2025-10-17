"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setCookie } from "nookies";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

import { loginAPI } from "@/services/auth";
import { setCredentials } from "@/redux/slices/authSlice";

import logo from "../../public/Superior Pro Roofing logo black.png";


export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: { email: string; password: string }) => loginAPI(data),
    onSuccess: (data: any) => {
      const { token, user } = data;

      setCookie(null, "token", token, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
        secure: true,
        sameSite: "strict",
      });

      dispatch(setCredentials({ user, token }));
      toast.success(data?.message);

      const roleName = data?.role?.name || "";
      switch (roleName) {
        case "Admin":
          router.push("/admin-panel/dashboard");
          break;
        default:
          router.push("/customer-panel/dashboard");
          break;
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail);
    },
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-[#0c2340] via-[#16375f] to-[#245b68]">
      {/* Left Section */}
      <div className="flex-1 flex justify-center items-center px-4 sm:px-6 py-8 sm:py-10">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 sm:p-8 relative">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            
            <Image
              src={logo}
              alt="Superior Pro Roofing Logo"
              width={250}
              height={70}
              className="w-[220px] sm:w-[260px] h-auto drop-shadow-md"
              priority
            />
          </div>

          <h2 className="text-center font-bold text-lg sm:text-xl text-[#0c2340]">
            Login to Your Account
          </h2>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={(values) => mutate(values)}
          >
            {() => (
              <Form className="space-y-4 mt-5">
                <div>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full border-b border-gray-400 focus:outline-none focus:border-[#25606a] py-2 text-sm sm:text-base text-black placeholder-secondary"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-xs sm:text-sm text-red-600"
                  />
                </div>

                <div className="relative">
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    className="w-full border-b border-gray-400 focus:outline-none focus:border-[#25606a] py-2 text-sm sm:text-base text-black placeholder-secondary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="cursor-pointer absolute right-2 top-2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-xs sm:text-sm text-red-600"
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm gap-2 sm:gap-0 text-black">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4" />
                    Remember Me
                  </label>
                  <Link
                    href="/forget"
                    className="text-[#0c2340] font-bold hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#25606a] to-[#2ea97d] cursor-pointer text-white py-2 rounded-lg text-sm sm:text-base font-semibold shadow-md hover:opacity-90 transition-all duration-300"
                >
                  {isPending ? "Logging in..." : "Sign In →"}
                </button>
              </Form>
            )}
          </Formik>

          <p className="text-center font-medium text-xs sm:text-sm mt-4 text-black">
            Not a member?{" "}
            <Link
              href="/signup"
              className="text-[#25606a] font-bold hover:underline"
            >
              Sign Up Now
            </Link>
          </p>

          <div className="bg-gradient-to-r from-[#123c54] to-[#25606a] text-white mt-6 p-4 rounded-xl shadow">
            <h3 className="text-[#c6f414] font-bold text-base sm:text-lg">
              Need a Roof Report?
            </h3>
            <p className="text-xs sm:text-sm mt-1 leading-relaxed">
              Order precise roof measurement reports instantly — quick,
              affordable, and accurate. No subscription needed!
            </p>
            <button className="bg-[#c6f414] cursor-pointer text-black px-4 sm:px-5 py-2 mt-4 rounded-lg font-semibold text-sm sm:text-base hover:bg-lime-400 transition">
              Order Now
            </button>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden md:flex flex-1 flex-col justify-center items-center text-white p-10">
        <Image
          src="/main.png"
          alt="Roof Measurement Illustration"
          width={600}
          height={400}
          className="shadow-xl rounded-2xl mb-8"
        />

        <h2 className="text-2xl font-bold mb-2">
          Accurate Roof Measurements, Instantly
        </h2>
        <p className="text-center max-w-lg text-gray-200 text-sm leading-relaxed">
          Create detailed roof measurement reports using satellite imagery and
          export them as professional PDFs for clients or teams.
        </p>

        <p className="text-xs text-gray-300 mt-6">
          *All plans include 3-device access + free support!
        </p>
      </div>
    </div>
  );
}

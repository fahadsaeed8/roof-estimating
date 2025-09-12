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
        domain: ".roof-estimating.vercel.app",
        secure: true,
        sameSite: "strict",
      });

      dispatch(setCredentials({ user, token }));
      toast.success(data?.message);
      router.push("/");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail);
    },
  });

  return (
    <div className="min-h-screen flex pt-[75px] flex-col md:flex-row bg-white">
      {/* Left Section */}
      <div className="flex-1 flex justify-center items-center bg-[#0c2340] px-6 py-10">
        <div className="bg-white w-full max-w-md rounded-lg shadow p-8">
          {/* Logo */}
          <div className="flex justify-center -mb-6 -mt-8">
            <Image
              src="/Black-Logo-main.png"
              alt="iRoofing"
              width={250}
              height={10}
            />
          </div>

          <h2 className="text-center font-bold">Enter Your Email To Login</h2>

          {/* ✅ Formik form */}
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              mutate(values); // call loginAPI
            }}
          >
            {() => (
              <Form className="space-y-4 mt-5">
                <div>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full border-b border-gray-400 focus:outline-none focus:border-blue-600 py-2"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-sm text-red-600"
                  />
                </div>
                <div className="relative">
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    className="w-full border-b border-gray-400 focus:outline-none focus:border-blue-600 py-2"
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
                    className="text-sm text-red-600"
                  />
                </div>

                {/* Remember Me + Forgot Password */}
                <div className="flex justify-between items-center text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4 font-bold" />
                    Remember Me
                  </label>
                  <Link
                    href="/forget"
                    className="text-blue-700 font-bold hover:underline"
                  >
                    Forgot Password
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 cursor-pointer text-white py-2 rounded hover:from-blue-600 hover:to-blue-800"
                >
                  {isPending ? "Logging in..." : "Sign In →"}
                </button>
              </Form>
            )}
          </Formik>

          {/* Signup Link */}
          <p className="text-center font-bold text-sm mt-4">
            Not A Member?{" "}
            <Link href="/signup" className="text-blue-700 hover:underline">
              Sign Up Now
            </Link>
          </p>

          {/* Roof Report Box */}
          <div className="bg-gradient-to-r from-[#123c54] to-[#25606a] text-white mt-6 p-4 rounded">
            <h3 className="text-[#c6f414] font-bold text-lg">
              Need A Roof Report?
            </h3>
            <p className="text-sm mt-1">
              No subscription needed! Order low-cost precise roof measurement
              reports in just a few clicks—quick, accurate, and hassle-free.
            </p>
            <button className="bg-[#c6f414] cursor-pointer text-black px-5 py-2 mt-4 rounded font-medium hover:bg-lime-400">
              Order Now!
            </button>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 py-10">
        <Image
          src="/main.png"
          alt="Roof Measurement"
          width={600}
          height={400}
          className="rounded shadow rounded-xl"
        />

        <div className="text-center mt-8 max-w-lg">
          <h2 className="text-2xl font-bold text-gray-800">
            Unlimited Measurement Reports
          </h2>
          <p className="text-gray-600 mt-3">
            Create unlimited, detailed roof measurement reports from your
            desktop PC using the app’s satellite imagery. Then, share any report
            by saving and sending it as a PDF.
          </p>
        </div>

        <p className="text-xs text-gray-500 mt-6 text-center">
          *ALL PLANS INCLUDE ACCESS FOR 3 DEVICES + FREE, UNLIMITED TRAINING AND
          SUPPORT!
        </p>
      </div>
    </div>
  );
}

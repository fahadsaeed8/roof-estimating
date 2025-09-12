import { axiosInstance, handleAPIRequest } from "./axiosInstance";

export const loginAPI = (data) =>
  handleAPIRequest(axiosInstance.post, "api/login", data);

export const signupAPI = (data) =>
  handleAPIRequest(axiosInstance.post, "api/signup/", data);

export const verifyOTPAPI = (data) =>
  handleAPIRequest(axiosInstance.post, "api/verify-otp", data);

export const forgotPasswordAPI = (data) =>
  handleAPIRequest(axiosInstance.post, "api/reset_password", data);

export const resendOTPAPI = (data) =>
  handleAPIRequest(axiosInstance.post, "api/resend-otp", data);

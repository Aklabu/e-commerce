"use client";
import api from "@/lib/api";
import { AxiosResponse } from "axios";
import React, { createContext, useContext, ReactNode } from "react";

type SignUpData = {
  customer_type: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password?: string;
  confirm_password?: string;
};

type BillingData = {
  email?: string;
  company_name: string;
  vat_number: string;
  company_registration: string;
  po_number: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  postal_code: string;
  province: string;
};

type AuthContextType = {
  handleSignUp: (data: SignUpData) => Promise<AxiosResponse<any>>;
  handleBilling: (data: BillingData) => Promise<AxiosResponse<any>>;
  handleDelivery: (
    data: Omit<BillingData, "email">
  ) => Promise<AxiosResponse<any>>;
  handleTradeOnly: (data: FormData) => Promise<AxiosResponse<any>>;
  handleVerify: (data: {
    email: string;
    code: string;
  }) => Promise<AxiosResponse<any>>;
  handleLogin: (data: any) => Promise<AxiosResponse<any>>;
  handleLogout: (data: any) => Promise<AxiosResponse<any>>;
  handleForgotPassword: (data: any) => Promise<AxiosResponse<any>>;
  handleChangePassword: (data: any) => Promise<AxiosResponse<any>>;
};

const AuthContext = createContext<AuthContextType | null>(null);

type CustomerInfo = {
  email: string;
  customer_type: string;
};

export const AuthProviders = ({ children }: { children: ReactNode }) => {
  //handeling all singup method
  const handleSignUp = async (data: SignUpData) => {
    try {
      // Simulate API call
      const res = await api.post("/accounts/register/", data);
      if (res.status === 201) {
        const customerInfo: CustomerInfo = {
          email: res?.data?.data?.email,
          customer_type: res?.data?.data?.customer_type,
        };
        localStorage.setItem("customer_info", JSON.stringify(customerInfo));
      }
      return res;
    } catch (error) {
      console.log("checking error", error);
      throw error;
    }
  };

  const handleBilling = async (data: BillingData) => {
    const { email } = JSON.parse(localStorage.getItem("customer_info") || "{}");
    if (email) {      
      const payload = { ...data, email };
      try {
        const res = await api.post("/accounts/register/billing-address/", payload);
        if (res.status === 201 || res.status === 200) {
          localStorage.setItem(
            "billing address",
            JSON.stringify(res?.data?.data)
          );
        }
        return res;
      } catch (error) {
        throw error;
      }
    } else {
      throw new Error("Email is required");
    }
  };

  const handleDelivery = async (data: Omit<BillingData, "email">) => {
    const { email } = JSON.parse(localStorage.getItem("customer_info") || "{}");
    if (email) {
      const payload = { ...data, email };
      try {
        const res = await api.post(
          "/accounts/register/delivery-address/",
          payload
        );
        console.log("checking response", res);
        return res;
      } catch (error) {
        throw error;
      }
    } else {
      throw new Error("Email is required");
    }
  };

  const handleTradeOnly = async (data: FormData) => {
    console.log("checking data......", Object.fromEntries(data));
    const { email } = JSON.parse(localStorage.getItem("customer_info") || "{}");
    if (email) {
      data.append("email", email);
      try {
        const res = await api.post("/accounts/register/trade-info/", data);
        console.log("checking response....", res);
        return res;
      } catch (error) {
        throw error;
      }
    } else {
      throw new Error("Email is required");
    }
  };

  const handleVerify = async (data: { email: string; code: string }) => {
    try {
      // Simulate API call
      const res = await api.post("/accounts/register/", data);
      return res;
    } catch (error) {
      throw error;
    }
  };

  const handleLogin = async (data: any) => {
    try {
      // Simulate API call
      const res = await api.post("/accounts/register/", data);
      return res;
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = async (data: any) => {
    try {
      // Simulate API call
      const res = await api.post("/accounts/register/", data);
      return res;
    } catch (error) {
      throw error;
    }
  };

  const handleForgotPassword = async (data: any) => {
    try {
      // Simulate API call
      const res = await api.post("/accounts/register/", data);
      return res;
    } catch (error) {
      throw error;
    }
  };

  const handleChangePassword = async (data: any) => {
    try {
      // Simulate API call
      const res = await api.post("/accounts/register/", data);
      return res;
    } catch (error) {
      throw error;
    }
  };

  const methodObj = {
    handleSignUp,
    handleBilling,
    handleDelivery,
    handleTradeOnly,
    handleVerify,
    handleLogin,
    handleLogout,
    handleForgotPassword,
    handleChangePassword,
  };

  return (
    <AuthContext.Provider value={methodObj}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};

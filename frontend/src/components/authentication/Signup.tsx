/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import Image from "next/image";
import { useId, useState } from "react";

import { FiEyeOff } from "react-icons/fi";
import { FiEye } from "react-icons/fi";
import Link from "next/link";
import { z } from "zod";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import Swal from "sweetalert2";
import { useAuth } from "@/context/AuthProviders";

// Zod validation schema
const signUpSchema = z
  .object({
    customer_type: z.string("Customer type is required"),
    first_name: z
      .string()
      .min(2, "First Name must be at least 2 characters")
      .max(50, "First Name must be less than 50 characters"),
    last_name: z
      .string()
      .min(2, "Last Name must be at least 2 characters")
      .max(50, "Last Name must be less than 50 characters"),
    email: z.string().email("Invalid email address"),
    phone_number: z
      .string()
      .min(4, "Phone number must be at least 9 characters")
      .max(15, "Phone number must be less than 15 digits")
      .regex(/^\+\d+$/, "Phone number should start with '+'"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /(?=.*[a-z])/,
        "Password must contain at least one lowercase letter"
      )
      .regex(
        /(?=.*[A-Z])/,
        "Password must contain at least one uppercase letter"
      )
      .regex(/(?=.*\d)/, "Password must contain at least one number"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const Signup = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const customerTypeId = useId();
  const firstNameId = useId();
  const lastNameId = useId();
  const emailId = useId();
  const phoneNumberId = useId();
  const passwordId = useId();
  const confirm_password = useId();
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const router = useRouter();
  const {handleSignUp} = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
  });


  

  const onSubmit = async (data: any) => {
    const res = await handleSignUp(data);
    if(res?.status  === 201 || res?.status === 200){
      Swal.fire({
        title: "Successfully submited!",
        icon: "success",
        draggable: true,
      });
      router.push("/signup/billing");
      handleNext();
    }else{
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: res.response.data.data.email[0] || res.response.data.data.phone_number[0] || "Something went wrong!",
      });
    }
  };

  //Top Progress Bar:
  const steps = [
    { id: 1, label: "Registration" },
    { id: 2, label: "Billing" },
    { id: 3, label: "Delivery" },
    { id: 4, label: "Trade Only" },
    { id: 5, label: "Verify" },
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="lg:w-7xl mx-auto mt-10">
      <div>
        <div className="lg:flex gap-8 items-center">
          <div className="hidden lg:w-[686px] h-[855px] lg:flex flex-col items-center justify-center relative ">
            <Image
              src="/authentication/signup.png"
              alt="sign-up-image"
              fill
              className="rounded-3xl object-cover"
            />
          </div>

          <div className="flex flex-col items-center justify-center lg:w-[940px] border-1 h-[855px] border-gray-100 rounded-lg shadow-lg py-6">
            <div className="w-full  flex justify-end lg:pr-16">
              <Link href={"/"}>
                <Image
                  src="/logo/logo.png"
                  alt="logo"
                  height={100}
                  width={100}
                />
              </Link>
            </div>
            {/*Progress Bar top*/}
            <div className="flex items-center justify-center gap-6 mt-6">
              {steps.map((step, index) => {
                const isCompleted = currentStep > step.id;
                const isActive = currentStep === step.id;

                return (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`flex flex-col items-center relative ${
                        index !== steps.length - 1 ? "mr-6" : ""
                      }`}
                    >
                      <div
                        className={`w-10 h-10 flex items-center justify-center rounded-full border-8 transition-all duration-300 ${
                          isCompleted
                            ? "bg-green-500 border-green-500 text-white"
                            : isActive
                            ? "border-green-500 text-green-600"
                            : "border-green-500 text-gray-400"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 size={22} />
                        ) : (
                          <span>{step.id}</span>
                        )}
                      </div>
                      <div
                        className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                          isCompleted || isActive
                            ? "bg-gradient-to-r from-green-700 to-lime-400 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {step.label}
                      </div>
                      {/* connector line */}
                      {index < steps.length - 1 && (
                        <div
                          className={`absolute top-5 left-[calc(55%+0.75rem)] w-24 h-[4px] ${
                            currentStep > step.id
                              ? "bg-green-500"
                              : "bg-green-500"
                          }`}
                        ></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <form
              className="w-full max-w-[612px] mt-16"
              onSubmit={handleSubmit(onSubmit)}
            >
              <h1 className="text-[#313131] font-poppins font-semibold text-4xl">
                Sign up
              </h1>
              <p className="text-[#313131] font-poppins mt-5">
                {"Let's "}get you all set up so you can access your personal
                account.
              </p>

              <div className="flex flex-col w-full">
                <div className="group relative mt-8 w-full">
                  <label
                    htmlFor="customerType"
                    className="bg-background absolute start-1 top-0 z-10 font-poppins text-[#1C1B1F] block -translate-y-1/2 px-2 text-xs font-normal group-has-disabled:opacity-50"
                  >
                    Customer Type <span className="text-red-500 ">*</span>
                  </label>
                  <select
                    id={customerTypeId}
                    className="h-10 w-full text-[#1C1B1F] font-poppins border border-gray-300 rounded-md px-3 focus:outline-none"
                    {...register("customer_type")}
                    required={true}
                  >
                    <option disabled value="">Select type</option>
                    <option defaultChecked value="Retail">Retail</option>
                    <option value="Trade">Trade</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-4 w-full">
                <div className="group relative mt-8 w-full">
                  <label
                    htmlFor={firstNameId}
                    className="bg-background absolute start-1 top-0 z-10 font-poppins text-[#1C1B1F] block -translate-y-1/2 px-2 text-xs font-normal group-has-disabled:opacity-50"
                  >
                    First Name <span className="text-red-500 ">*</span>
                  </label>
                  <Input
                    id={firstNameId}
                    className="h-10 text-[#1C1B1F] font-poppins"
                    placeholder="first name"
                    type="text"
                    required={true}
                    {...register("first_name")}
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.first_name.message}
                    </p>
                  )}
                </div>

                <div className="group relative mt-8 w-full">
                  <label
                    htmlFor={lastNameId}
                    className="bg-background absolute start-1 top-0 z-10 font-poppins text-[#1C1B1F] block -translate-y-1/2 px-2 text-xs font-normal group-has-disabled:opacity-50"
                  >
                    Last Name <span className="text-red-500 ">*</span>
                  </label>
                  <Input
                    id={lastNameId}
                    className="h-10 text-[#1C1B1F] font-poppins"
                    placeholder="last name"
                    type="text"
                    required={true}
                    {...register("last_name")}
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.last_name.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-4 w-full">
                <div className="group relative mt-8 w-full">
                  <label
                    htmlFor={emailId}
                    className="bg-background absolute start-1 top-0 z-10 font-poppins text-[#1C1B1F] block -translate-y-1/2 px-2 text-xs font-normal group-has-disabled:opacity-50"
                  >
                    Email <span className="text-red-500 ">*</span>
                  </label>
                  <Input
                    id={emailId}
                    className="h-10 text-[#1C1B1F] font-poppins"
                    placeholder="abc@gmail.com"
                    type="email"
                    required={true}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="group relative mt-8 w-full">
                  <label
                    htmlFor={phoneNumberId}
                    className="bg-background absolute start-1 top-0 z-10 font-poppins text-[#1C1B1F] block -translate-y-1/2 px-2 text-xs font-normal group-has-disabled:opacity-50"
                  >
                    Phone Number <span className="text-red-500 ">*</span>
                  </label>
                  <Input
                    id={phoneNumberId}
                    className="h-10 text-[#1C1B1F] font-poppins"
                    placeholder=""
                    type="017......"
                    required={true}
                    {...register("phone_number")}
                  />
                  {errors.phone_number && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.phone_number.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="group relative mt-8 w-full">
                <label
                  htmlFor={passwordId}
                  className="bg-background absolute start-1 top-0 z-10 font-poppins text-[#1C1B1F] block -translate-y-1/2 px-2 text-xs font-normal group-has-disabled:opacity-50"
                >
                  Password <span className="text-red-500 ">*</span>
                </label>
                <div className="relative w-full">
                  <Input
                    id={passwordId}
                    className="h-10 text-[#1C1B1F] font-poppins"
                    placeholder="password"
                    type={showPassword1 ? "text" : "password"}
                    required={true}
                    {...register("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="absolute right-1 top-1/2 
                            -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowPassword1(!showPassword1)}
                  >
                    {showPassword1 ? (
                      <FiEyeOff className="h-6 w-6" />
                    ) : (
                      <FiEye className="h-6 w-6" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="group relative mt-8 w-full">
                <label
                  htmlFor={confirm_password}
                  className="bg-background absolute start-1 top-0 z-10 font-poppins text-[#1C1B1F] block -translate-y-1/2 px-2 text-xs font-normal group-has-disabled:opacity-50"
                >
                  Confirm Password <span className="text-red-500 ">*</span>
                </label>
                <div className="relative w-full">
                  <Input
                    id={confirm_password}
                    className="h-10 text-[#1C1B1F] font-poppins"
                    placeholder="confirm password"
                    type={showPassword2 ? "text" : "password"}
                    required={true}
                    {...register("confirm_password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="absolute right-1 top-1/2 
                            -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowPassword2(!showPassword2)}
                  >
                    {showPassword2 ? (
                      <FiEyeOff className="h-6 w-6" />
                    ) : (
                      <FiEye className="h-6 w-6" />
                    )}
                  </Button>
                </div>
                {errors.confirm_password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirm_password.message}
                  </p>
                )}
              </div>
              <div className="w-full mt-4">
                <Button
                  type="submit"
                  className="w-full h-10 text-[#F3F3F3] bg-linear-to-r from-[#088347]
                            to-[#C6E824] cursor-pointer font-poppins"
                >
                  Next
                </Button>
              </div>

              <p className="mt-4 text-center font-poppins">
                Already have an account?{"  "}
                <Link href="/login" className="text-[#FF8682] font-bold">
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

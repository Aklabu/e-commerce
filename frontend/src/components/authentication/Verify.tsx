/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useId } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CheckCircle2 } from "lucide-react";
import { IoChevronBackOutline } from "react-icons/io5";

const Verify = () => {
  const confirmPasswordId = useId();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  const { register, handleSubmit } = useForm({
    mode: "onChange", // Add this for immediate validation
    defaultValues: {
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Form submitted:", data);
      router.push("/sign-in");
      // Handle successful submission here
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const pathName = usePathname();

  const getCurrentPath = () => {
    if (pathName.includes("signup/billing/delivery/trade/verify")) return 5;
    if (pathName.includes("signup/billing/delivery/trade")) return 4;
    if (pathName.includes("signup/billing/delivery")) return 3;
    if (pathName.includes("signup/billing")) return 2;
    return 1;
  };

  //Top Progress Bar:
  const steps = [
    { id: 1, label: "Registration" },
    { id: 2, label: "Billing" },
    { id: 3, label: "Delivery" },
    { id: 4, label: "Trade Only" },
    { id: 5, label: "Verify" },
  ];

  const currentPath = getCurrentPath();

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

          <div className=" flex flex-col items-center justify-center lg:w-[940px] border-1 border-gray-100 rounded-lg shadow-lg py-6">
            <div className="w-full  flex justify-between lg:pr-16">
              <div className="flex items-center ml-6 font-semibold">
                <IoChevronBackOutline />
                <Link href={"/login"}>Back to login</Link>
              </div>
              <Link href={"/"}>
                <Image
                  src="/logo/logo.png"
                  alt="logo"
                  height={100}
                  width={100}
                />
              </Link>
            </div>
            {/*Back to login*/}

            {/*Progress Bar top*/}
            <div className="flex items-center lg:justify-center lg:gap-6 mt-6">
              {steps.map((step, index) => {
                const isCompleted = currentPath > step.id;
                const isActive = currentPath === step.id;

                return (
                  <div key={`step-${step.id}`} className="flex items-center">
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
                Verify Code
              </h1>
              <p className="text-[#313131] font-poppins mt-5">
                An authentication code has been sent to your email.
              </p>

              <div className="group relative mt-8 w-full">
                <label
                  htmlFor={confirmPasswordId}
                  className="bg-background absolute start-1 top-0 z-10 font-poppins text-[#1C1B1F] block -translate-y-1/2 px-2 text-xs font-normal group-has-disabled:opacity-50"
                >
                  Enter Code
                </label>
                <div className="relative w-full">
                  <Input
                    id={confirmPasswordId}
                    className="h-10 text-[#1C1B1F] font-poppins"
                    placeholder="000000"
                    type="text"
                    {...register("confirmPassword")}
                  />
                </div>
              </div>

              <div className="mt-3">
                <span>
                  <p>Didn&apos;t receive a code?</p>
                  <button className="text-red-500">Resend</button>
                </span>
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

export default Verify;

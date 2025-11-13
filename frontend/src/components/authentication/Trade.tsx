/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import Image from "next/image";
import { useId, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CheckCircle2, CircleUserRoundIcon } from "lucide-react";
import Swal from "sweetalert2";
import { useAuth } from "@/context/AuthProviders";

const Trade = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { handleTradeOnly } = useAuth();

  const bussinessTypeId = useId();
  const monthyAttachmentPrefId = useId();
  const procurContractId = useId();
  const documentId = useId();
  const router = useRouter();

  const { handleSubmit, register, watch, setValue } = useForm({
    mode: "onChange",
  });

  const documentFile = watch("documents");
  const previewUrl = documentFile?.[0] ? URL.createObjectURL(documentFile[0]) : null;
  const fileName = documentFile?.[0]?.name || null;

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("business_type", data.business_type || "");
    formData.append("monthly_statement", data.monthly_statement || "");
    formData.append("procurement_no", data.procurement_no || "");
    if (data.documents?.[0]) {
      formData.append("documents", data.documents[0]);
    }
    console.log("checking form data....", Object.fromEntries(formData));
    const response = await handleTradeOnly(formData);
    console.log("API Response:", response);
    if (response && (response.status === 201 || response.status === 200)) {
      Swal.fire({
        title: "Successfully submited!",
        icon: "success",
        draggable: false,
      });
      router.push("/signup/billing/delivery/trade/verify");
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
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
              <p className="text-gray-600 font-poppins  text-xl font-bold">
                Trade only from
              </p>

              <div className="flex flex-col w-full">
                <div className="group relative mt-8 w-full">
                  <label
                    htmlFor="bussinessType"
                    className="bg-background absolute start-1 top-0 z-10 font-poppins text-[#1C1B1F]
                    block -translate-y-1/2 px-2 text-xs font-normal group-has-disabled:opacity-50"
                  >
                    Business Type <span className="text-red-500 ">*</span>
                  </label>
                  <select
                    id={bussinessTypeId}
                    {...register("business_type")}
                    className="h-10 w-full text-[#1C1B1F] font-poppins border border-gray-300 rounded-md px-3 focus:outline-none"
                  >
                    <option value="" disabled>
                      Select type
                    </option>
                    <option value="Electrician">Electrician</option>
                    <option value="Contractor">Contractor</option>
                    <option value="Reseller">Reseller</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 w-full">
                  <div className="group relative mt-8 w-full">
                    <label
                      htmlFor={monthyAttachmentPrefId}
                      className="bg-background absolute start-1 top-0 z-10 font-poppins text-[#1C1B1F] block -translate-y-1/2 px-2 text-xs font-normal group-has-disabled:opacity-50"
                    >
                      Monthly Statement Preference
                    </label>
                    <Input
                      id={monthyAttachmentPrefId}
                      {...register("monthly_statement")}
                      className="h-10 text-[#1C1B1F] font-poppins"
                      placeholder="000 0000 0000"
                      type="text"
                    />
                  </div>

                  <div className="group relative mt-8 w-full">
                    <label
                      htmlFor={procurContractId}
                      className="bg-background absolute start-1 top-0 z-10 font-poppins text-[#1C1B1F] block -translate-y-1/2 px-2 text-xs font-normal group-has-disabled:opacity-50"
                    >
                      Procurement Contact
                    </label>
                    <Input
                      id={procurContractId}
                      {...register("procurement_no")}
                      className="h-10 text-[#1C1B1F] font-poppins"
                      placeholder="doe@gmail.com"
                      type="text"
                    />
                  </div>
                </div>
              </div>

              {/*Upload Doc*/}
              <div className="group relative mt-8 w-full">
                <div className="flex flex-col items-center gap-2">
                  <div className="inline-flex items-center gap-2 align-top">
                    <div
                      className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-input"
                      aria-label={
                        previewUrl
                          ? "Preview of uploaded image"
                          : "Default user avatar"
                      }
                    >
                      {previewUrl ? (
                        <Image
                          className="size-full object-cover"
                          src={previewUrl}
                          alt="Preview of uploaded image"
                          width={32}
                          height={32}
                        />
                      ) : (
                        <div aria-hidden="true">
                          <CircleUserRoundIcon
                            className="opacity-60"
                            size={16}
                          />
                        </div>
                      )}
                    </div>
                    <div className="relative inline-block">
                      <Button
                        variant={"secondary"}
                        type="button"
                        aria-haspopup="dialog"
                        className="cursor-pointer"
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        {fileName ? "Change image" : "Upload Trade Docs "}
                      </Button>
                      <input
                        {...register("documents")}
                        type="file"
                        id="file-upload"
                        accept="image/*"
                        aria-label="Upload Trade Docs"
                        className="hidden"
                      />
                    </div>
                  </div>
                  {fileName && (
                    <div className="inline-flex gap-2 text-xs">
                      <p
                        className="truncate text-muted-foreground"
                        aria-live="polite"
                      >
                        {fileName}
                      </p>{" "}
                      <button
                        onClick={() => {
                          setValue("documents", null);
                        }}
                        className="font-medium text-destructive hover:underline"
                        aria-label={`Remove ${fileName}`}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
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

export default Trade;

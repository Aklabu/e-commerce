/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import Image from "next/image";
import { useId } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CheckCircle2 } from "lucide-react";
import Swal from "sweetalert2";;
import { useAuth } from "@/context/AuthProviders";



const Billing = () => {
  const companyNameId = useId();
  const vatNumberId = useId();
  const registrationId = useId();
  const poNumberId = useId();
  const billingAddressLine1Id = useId();
  const billingAddressLine2Id = useId();
  const cityId = useId();
  const postalCodeId = useId();
  const provinceId = useId();
  const router = useRouter();
  const {handleBilling} = useAuth();

  const { 
    register,
    handleSubmit 
    } = useForm({
    mode: "onChange",
  });


  const onSubmit = async (data: any) => {
    const response = await handleBilling(data);
      console.log("API Response:", response);
      if(response.status === 201){
        Swal.fire({
        title: "Successfully submited!",
        icon: "success",
        draggable: false,
      });
      router.push("/signup/billing/delivery");
      }else{
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      }
  };

  const pathName = usePathname();

  const getCurrentPath = () => {
    if (pathName.includes("signup/verify")) return 5;
    if (pathName.includes("signup/trade-only")) return 4;
    if (pathName.includes("signup/delevery")) return 3;
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
    <div>
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
              <div className="w-full flex justify-end lg:pr-16">
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
                              currentPath > step.id
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
                <p className="text-[#313131] text-2xl font-poppins mt-5">
                  Billing / Invoicing
                </p>

                <div className="flex flex-col w-full">
                  <div className="group relative mt-8 w-full">
                    <label
                      htmlFor={companyNameId}
                      className="bg-background absolute start-1 top-0 z-10 font-poppins text-[#1C1B1F]
                      block -translate-y-1/2 px-2 text-xs font-normal group-has-disabled:opacity-50"
                    >
                      Company Name
                    </label>
                    <Input
                      id={companyNameId}
                      className="h-10 text-[#1C1B1F] font-poppins"
                      placeholder="example"
                      type="text"
                      {...register("company_name")}
                      required={true}
                    />
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 w-full">
                  <div className="group relative mt-8 w-full">
                    <label
                      htmlFor={vatNumberId}
                      className="bg-background absolute start-1 top-0 z-10 font-poppins text-[#1C1B1F] block -translate-y-1/2 px-2 text-xs font-normal group-has-disabled:opacity-50"
                    >
                      VAT Number
                    </label>
                    <Input
                      id={vatNumberId}
                      className="h-10 text-[#1C1B1F] font-poppins"
                      placeholder="000 000 00000"
                      type="text"
                      {...register("vat_number")}
                      required={true}
                    />
                  </div>

                  <div className="group relative mt-8 w-full">
                    <label
                      htmlFor={registrationId}
                      className="bg-background absolute start-1 top-0 z-10 font-poppins text-[#1C1B1F] block -translate-y-1/2 px-2 text-xs font-normal group-has-disabled:opacity-50"
                    >
                      Company Registration (CIPC){" "}
                      <span className="text-red-500 ">*</span>
                    </label>
                    <Input
                      id={registrationId}
                      className="h-10 text-[#1C1B1F] font-poppins"
                      placeholder="000 000 0000"
                      type="text"
                      {...register("company_registration")}
                      required={true}
                    />
                  </div>
                </div>

                <div className="group relative mt-8 w-full">
                  <label
                    htmlFor={poNumberId}
                    className="bg-background absolute start-1 top-0 z-10 font-poppins text-[#1C1B1F]
                    block -translate-y-1/2 px-2 text-xs font-normal group-has-disabled:opacity-50"
                  >
                    PO Number
                  </label>
                  <Input
                    id={poNumberId}
                    className="h-10 text-[#1C1B1F] font-poppins"
                    placeholder="000 0000 0000"
                    type="text"
                    {...register("po_number")}
                    required={true}
                  />
                </div>

                <div className="flex flex-col lg:flex-row gap-4 w-full">
                  <div className="group relative mt-8 w-full">
                    <label
                      htmlFor={billingAddressLine1Id}
                      className="bg-background absolute start-1 top-0 z-10 font-poppins text-[#1C1B1F] block -translate-y-1/2 px-2 text-xs font-normal group-has-disabled:opacity-50"
                    >
                      Billing Address Line 1{" "}
                      <span className="text-red-500 ">*</span>
                    </label>
                    <Input
                      id={billingAddressLine1Id}
                      className="h-10 text-[#1C1B1F] font-poppins"
                      placeholder="example: 123/A, Green Stree"
                      type="text"
                      {...register("address_line_1")}
                      required={true}
                    />
                  </div>

                  <div className="flex flex-col lg:flex-row gap-4 w-full">
                    <div className="group relative mt-8 w-full">
                      <label
                        htmlFor={billingAddressLine2Id}
                        className="bg-background absolute start-1 top-0 z-10 font-poppins text-[#1C1B1F] block -translate-y-1/2 px-2 text-xs font-normal group-has-disabled:opacity-50"
                      >
                        Billing Address Line 2
                      </label>
                      <Input
                        id={billingAddressLine2Id}
                        className="h-10 text-[#1C1B1F] font-poppins"
                        placeholder="example: 123/A, Green Stree"
                        type="text"
                        {...register("address_line_2")}
                        required={true}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 w-full">
                  <div className="group relative mt-8 w-full">
                    <label
                      htmlFor={cityId}
                      className="bg-background absolute start-1 top-0 z-10 font-poppins text-[#1C1B1F] block -translate-y-1/2 px-2 text-xs font-normal group-has-disabled:opacity-50"
                    >
                      City/Suburb <span className="text-red-500 ">*</span>
                    </label>
                    <div className="relative w-full">
                      <Input
                        id={cityId}
                        className="h-10 text-[#1C1B1F] font-poppins"
                        placeholder="New York"
                        type="text"
                        {...register("city")}
                        required={true}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        className="absolute right-1 top-1/2 
                            -translate-y-1/2 cursor-pointer"
                      ></Button>
                    </div>
                  </div>
                  <div className="group relative mt-8 w-full">
                    <label
                      htmlFor={postalCodeId}
                      className="bg-background absolute start-1 top-0 z-10 font-poppins text-[#1C1B1F] block -translate-y-1/2 px-2 text-xs font-normal group-has-disabled:opacity-50"
                    >
                      Postal Code
                    </label>
                    <Input
                      id={postalCodeId}
                      className="h-10 text-[#1C1B1F] font-poppins"
                      placeholder="0000"
                      type="text"
                      required={true}
                      {...register("postal_code")}
                    />
                  </div>
                </div>
                <div className="flex flex-col w-full">
                  <div className="group relative mt-8 w-full">
                    <label
                      htmlFor={provinceId}
                      className="bg-background absolute start-1 top-0 z-10 font-poppins text-[#1C1B1F]
                      block -translate-y-1/2 px-2 text-xs font-normal group-has-disabled:opacity-50"
                    >
                      Province <span className="text-red-500 ">*</span>
                    </label>
                    <select
                      id={provinceId}
                      {...register("province")}
                      className="h-10 w-full text-[#1C1B1F] font-poppins border border-gray-300 rounded-md px-3 focus:outline-none"
                    >
                      <option disabled value="">Select province</option>
                      <option value="Eastern Cape">Eastern Cape</option>
                      <option value="Free State">Free State</option>
                      <option value="Gauteng">Gauteng</option>
                      <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                      <option value="Limpopo">Limpopo</option>
                      <option value="Mpumalanga">Mpumalanga</option>
                      <option value="Northern Cape">Northern Cape</option>
                      <option value="North West">North West</option>
                      <option value="Western Cape">Western Cape</option>
                    </select>
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;

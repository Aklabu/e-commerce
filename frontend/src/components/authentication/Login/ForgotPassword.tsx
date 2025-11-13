"use client";
import Image from "next/image";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { useId } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

// Zod validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const ForgotPassword = () => {
  const emailId = useId();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange", // Add this for immediate validation
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Form submitted:", data);
      router.push("/verifycode");
      // Handle successful submission here
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <div>
      <div className="w-full h-screen bg-[#FFFFFF]">
        <div className="lg:flex gap-20">
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
            <div className="w-full max-w-[512px]">
              <Link href={"/"}>
                <Image
                  src="/logo/logo.png"
                  alt="logo"
                  height={100}
                  width={100}
                />
              </Link>
            </div>
            <form
              className="w-full max-w-[512px] mt-24"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Link href="/login" className="flex items-center gap-1">
                <MdOutlineArrowBackIos />
                <p className="font-poppins text-[#313131]">Back to login</p>
              </Link>
              <h1 className="text-[#313131] font-poppins font-semibold text-4xl mt-4">
                Forgot your password?
              </h1>
              <p className="text-[#313131] font-poppins mt-5">
                Don’t worry, happens to all of us. Enter your email below to
                recover your password
              </p>

              <div className="group relative mt-12 w-full">
                <label
                  htmlFor={emailId}
                  className="bg-background absolute start-1 top-0 z-10 font-poppins text-[#1C1B1F] block -translate-y-1/2 px-2 text-xs font-normal group-has-disabled:opacity-50"
                >
                  Email
                </label>
                <Input
                  id={emailId}
                  className="h-10 text-[#1C1B1F] font-poppins"
                  placeholder="john.doe@gmail.com"
                  type="email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="w-full mt-12">
                <Button
                  type="submit"
                  className="w-full h-10 text-[#F3F3F3] bg-linear-to-r from-[#088347]
                            to-[#C6E824] cursor-pointer font-poppins"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          </div>

          <div className="hidden lg:block lg:w-1/2 h-[816px] relative">
            <Image
              src="/auth/login.png"
              alt="sign-in-image"
              fill
              className="rounded-3xl object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

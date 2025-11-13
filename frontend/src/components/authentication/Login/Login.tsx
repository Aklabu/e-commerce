"use client";
import Image from "next/image";
import { useId, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FiEyeOff } from "react-icons/fi";
import { FiEye } from "react-icons/fi";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

// Zod validation schema
const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/(?=.*[a-z])/, "Password must contain at least one lowercase letter")
    .regex(/(?=.*[A-Z])/, "Password must contain at least one uppercase letter")
    .regex(/(?=.*\d)/, "Password must contain at least one number"),
  rememberMe: z.boolean().refine((val) => val === true, ""),
});

const Login = () => {
  const emailId = useId();
  const passwordId = useId();
  const rememberMeId = useId();

  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(signInSchema),
    mode: "onChange", // Add this for immediate validation
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      rememberMe: false,
    },
  });

  const rememberMe = watch("rememberMe");

  const onSubmit = async (data) => {
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

  return (
    <div>
      <div className="w-full h-screen bg-[#FFFFFF]">
        <div className="lg:flex gap-20">
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
            <div className="w-full max-w-[512px]">
              <Image src="/logo/logo.png" alt="logo" height={100} width={100} />
            </div>
            <form
              className="w-full max-w-[512px] mt-16"
              onSubmit={handleSubmit(onSubmit)}
            >
              <h1 className="text-[#313131] font-poppins font-semibold text-4xl">
                Log in
              </h1>
              <p className="text-[#313131] font-poppins mt-5">
                Login to access your travelwise account
              </p>

              <div className="group relative mt-8 w-full">
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

              <div className="group relative mt-8 w-full">
                <label
                  htmlFor={passwordId}
                  className="bg-background absolute start-1 top-0 z-10 font-poppins text-[#1C1B1F] block -translate-y-1/2 px-2 text-xs font-normal group-has-disabled:opacity-50"
                >
                  Password
                </label>
                <div className="relative w-full">
                  <Input
                    id={passwordId}
                    className="h-10 text-[#1C1B1F] font-poppins"
                    placeholder="..............."
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="absolute right-1 top-1/2 
                            -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
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

              <div className="flex justify-between mt-8">
                <div className="flex items-center gap-2 font-poppins">
                  <Checkbox
                    id={rememberMeId}
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setValue("rememberMe", checked)
                    }
                  />
                  <Label
                    htmlFor={rememberMeId}
                    className="text-[#313131] font-poppins"
                  >
                    Remember Me
                  </Label>
                </div>
                <Link
                  href="/forgotpassword"
                  className="text-[#FF8682] font-poppins"
                >
                  Forgot Password
                </Link>
              </div>

              <div className="w-full mt-8">
                <Button
                  type="submit"
                  className="w-full h-10 text-[#F3F3F3] bg-linear-to-r from-[#088347]
                            to-[#C6E824] cursor-pointer font-poppins"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging In..." : "Log In"}
                </Button>
              </div>

              <p className="mt-8 text-center font-poppins">
                Don’t have an account?{" "}
                <Link href="/sign-up" className="text-[#FF8682]">
                  Sign Up
                </Link>
              </p>

              <div className="w-full flex gap-3 mt-6">
                <div className="w-full max-w-[400px] h-[1px] bg-[gray]" />
                <p className="text-[gray] font-poppins -translate-y-1/2 text-sm">
                  Or
                </p>
                <div className="w-full max-w-[400px] h-[1px] bg-[gray]" />
              </div>

              <div className="border-1 border-gray-500 rounded-sm">
                <Button variant={"ghost"} className="w-full cursor-pointer">
                  <FcGoogle /> Login with Google
                </Button>
              </div>
            </form>
          </div>

          <div className="hidden lg:w-1/2 h-[816px] lg:flex flex-col items-center justify-center relative">
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

export default Login;

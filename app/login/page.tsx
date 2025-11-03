"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { UserCredentials } from "@/app/types";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { useState } from "react";
import { useUser } from "../UserProvider";
import BackButton from "@/components/BackButton";
// Configure axios to include credentials
axios.defaults.withCredentials = true;

const Login = () => {
  const router = useRouter();
  const { setUser } = useUser();
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserCredentials>();

  const submitFormHandler = async (data: UserCredentials) => {
    try {
      const response = await axios.post(`${API_URL}/login`, data);
      if (response.data.user) {
        // Validate user object structure before setting
        const user = response.data.user;
        if (
          typeof user === "object" &&
          user !== null &&
          typeof user.id === "string" &&
          user.id.length > 0 &&
          typeof user.username === "string" &&
          user.username.length > 0 &&
          !("password" in user)
        ) {
          setUser(user);
          toast.success("Logged in successfully");
          router.push("/");
        } else {
          throw new Error("Invalid user data received");
        }
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "An error occurred");
      } else {
        setError("An unexpected error occurred");
        toast.error(error as string);
      }
    }
  };

  return (
    <div>
      <BackButton url="/" />
      <form
        className="h-screen flex flex-col items-center justify-center font-mrEaves"
        onSubmit={handleSubmit(submitFormHandler)}
      >
        <Card className="w-[350px] sm:w-[400px]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Login to your account
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 px-6 py-2">
            <div className="flex flex-col gap-2">
              <Input
                className="font-bookInsanity"
                type="text"
                placeholder="Username"
                {...register("username", {
                  required: "Username is required",
                })}
              />
              {errors.username && (
                <p className="text-red-600 text-sm pl-2">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Input
                type="password"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              {errors.password && (
                <p className="text-red-600 text-sm pl-2">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button>Log In</Button>
            {error && (
              <p className="text-red-600 text-sm pl-2 text-center">{error}</p>
            )}
            <Separator className="w-5/6 mx-auto bg-black/40" />

            <p className="text-center">
              Don&apos;t have an account?{" "}
              <span
                className="text-blue-400 cursor-pointer"
                onClick={() => router.push("/signup")}
              >
                Sign up
              </span>
            </p>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default Login;

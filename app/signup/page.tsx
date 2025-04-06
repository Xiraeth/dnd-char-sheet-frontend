"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { UserCredentials } from "@/app/types";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import BackButton from "@/components/BackButton";
const Signup = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserCredentials>({
    defaultValues: {
      password: "",
      username: "",
    },
  });

  const submitFormHandler = async (dataToSubmit: UserCredentials) => {
    try {
      await axios.post(`${API_URL}/signup`, dataToSubmit);
      sessionStorage.setItem("userCreationSuccessful", "true");
      router.push("/login");
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.response?.data?.message || "An error occurred");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <>
      <BackButton url="/" />
      <form
        className="h-screen flex flex-col items-center justify-center"
        onSubmit={handleSubmit(submitFormHandler)}
      >
        <Card className="w-[350px] sm:w-[400px]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Sign up
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 px-6 py-2">
            <div className="flex flex-col gap-2">
              <Input
                type="username"
                placeholder="Username"
                {...register("username", {
                  required: "Username is required",
                })}
              />
              {errors.username && (
                <p className="text-red-500 text-sm pl-2">
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
                <p className="text-red-500 text-sm pl-2">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button>Sign Up</Button>
            {error && (
              <p className="text-red-500 text-sm pl-2 text-center">{error}</p>
            )}
            <Separator className="w-5/6 mx-auto" />

            <p className="text-center">
              Already have an account?{" "}
              <span
                className="text-blue-400 cursor-pointer"
                onClick={() => router.push("/login")}
              >
                Log In
              </span>
            </p>
          </CardContent>
        </Card>
      </form>
    </>
  );
};

export default Signup;

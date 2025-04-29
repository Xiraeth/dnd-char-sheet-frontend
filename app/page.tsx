"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "./UserProvider";
import { Loader } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useUser();

  if (isLoading) {
    return (
      <div className="text-black w-screen h-screen flex items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 font-bookInsanity">
        <p className="text-xl sm:text-4xl font-bold text-text-dark text-red-600 text-center">
          D&D Character Sheet
        </p>
        <div className="flex gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              router.push("/login");
            }}
          >
            Log In
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              router.push("/signup");
            }}
          >
            Sign Up
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 font-mrEaves">
      <p className="text-4xl sm:text-5xl font-bold text-text-dark text-red-600 text-center">
        Welcome {user?.username}
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="default"
          size="lg"
          onClick={() => {
            router.push("/characters");
          }}
        >
          View characters
        </Button>
        <Button
          variant="default"
          size="lg"
          onClick={() => {
            router.push("/create-character");
          }}
        >
          Create new character
        </Button>
      </div>
      <Button
        variant="outline"
        size="lg"
        className="absolute bottom-4 right-4"
        onClick={() => {
          logout();
        }}
      >
        Log Out
      </Button>
    </div>
  );
}

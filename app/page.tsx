"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "./UserProvider";
import { Loader } from "lucide-react";
import CharacterCard from "@/components/CharacterCard";
import { Character } from "@/app/types";
import axios from "axios";
import { useEffect, useState } from "react";

type CharactersResponse = {
  success: boolean;
  count: number;
  data: Character[];
};

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout, handleNoToken } = useUser();
  const [characters, setCharacters] = useState<CharactersResponse | null>(null);
  const [areCharactersLoading, setAreCharactersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, [user, isLoading]);

  useEffect(() => {
    if (!isMounted || !isAuthenticated) return;

    try {
      setAreCharactersLoading(true);
      const fetchCharacters = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/${user?.id}/characters`,
            {
              withCredentials: true,
            }
          );

          setCharacters(response.data);
          setAreCharactersLoading(false);
        } catch (err) {
          setAreCharactersLoading(false);
          if (axios.isAxiosError(err)) {
            setError(err.response?.data?.message || "An error occurred");
            if (err.response?.status === 401) {
              handleNoToken();
            }
          } else {
            setError("An error occurred. Server is probably down.");
          }
        }
      };

      fetchCharacters();
    } catch (err) {
      setAreCharactersLoading(false);
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error ||
          err.response?.data?.message ||
          "An error occurred"
        );
      } else {
        setError("An error occurred. Server is probably down.");
      }
    }
  }, [isMounted, isLoading, isAuthenticated, user?.id, handleNoToken]);

  const handleCharacterClick = (characterId?: string) => {
    if (characterId) {
      router.push(`/characters/${characterId}`);
    }
  };

  if (isLoading || (isAuthenticated && areCharactersLoading)) {
    return (
      <div className="text-black w-screen h-screen flex items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  // ---------- return (jsx) statements ----------
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

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 font-bookInsanity">
        <p className="text-red-600">{error}</p>
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

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 my-20 sm:my-0 font-mrEaves">
      <p className="text-3xl sm:text-4xl font-bold text-text-dark text-red-600 text-center">
        Welcome {user?.username}
      </p>
      <div className="h-fit flex flex-col gap-4 items-center font-bookInsanity">
        {characters?.data?.length ? null : (
          <div className="flex flex-col gap-2 items-center justify-center">
            <h1 className="text-lg text-dndRed py-2">You have no characters</h1>
          </div>
        )}
        {characters?.data &&
          characters?.data?.map((char) => (
            <CharacterCard
              key={char._id}
              character={char}
              onClick={handleCharacterClick}
            />
          ))}
        <Button
          variant="default"
          size="lg"
          className="w-full text-base"
          onClick={() => {
            router.push("/create-character");
          }}
        >
          Create new character
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="sm:hidden w-full"
          onClick={() => {
            logout();
          }}
        >
          Log Out
        </Button>
      </div>

      <Button
        variant="outline"
        size="lg"
        className="hidden sm:block fixed bottom-4 right-4"
        onClick={() => {
          logout();
        }}
      >
        Log Out
      </Button>
    </div>
  );
}

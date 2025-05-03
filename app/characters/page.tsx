"use client";

import { Character } from "@/app/types";
import { useUser } from "@/app/UserProvider";
import BackButton from "@/components/BackButton";
import CharacterCard from "@/components/CharacterCard";
import axios from "axios";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
type CharactersResponse = {
  success: boolean;
  count: number;
  data: Character[];
};

const Characters = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [characters, setCharacters] = useState<CharactersResponse | null>(null);
  const [areCharactersLoading, setAreCharactersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, [user, isLoading]);

  useEffect(() => {
    if (!isMounted) return;

    if (!user && isMounted) {
      toast.error("You must be logged in to view your characters");
      router.push("/");
      return;
    }

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
            if (err?.status === 401) {
              toast.error("You must be logged in to view your characters");
              localStorage.removeItem("dnd-char-sheet-user");
              router.push("/");
              return;
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
  }, [user, isMounted, isLoading]);

  const handleCharacterClick = (characterId?: string) => {
    if (characterId) {
      router.push(`/characters/${characterId}`);
    }
  };

  if (isLoading || areCharactersLoading)
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <p>{error}</p>
      </div>
    );

  return (
    <>
      <BackButton url="/" />
      <div className="h-screen flex flex-col gap-4 items-center justify-center font-bookInsanity">
        {characters?.data?.length ? (
          <h1 className="text-2xl font-bold">Your characters</h1>
        ) : (
          <div className="flex flex-col gap-2 items-center justify-center">
            <h1 className="text-2xl font-bold">You have no characters</h1>
            <Link
              href="/create-character"
              className="text-blue-500 hover:underline transition-all duration-150 text-2xl"
            >
              Create
            </Link>
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
      </div>
    </>
  );
};

export default Characters;

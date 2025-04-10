"use client";

import { Character } from "@/app/types";
import { useUser } from "@/app/UserProvider";
import BackButton from "@/components/BackButton";
import CharacterCard from "@/components/CharacterCard";
import axios from "axios";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

type CharactersResponse = {
  success: boolean;
  count: number;
  data: Character[];
};

const Characters = () => {
  const { user } = useUser();
  const [characters, setCharacters] = useState<CharactersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    if (!user) return;

    try {
      const fetchCharacters = async () => {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/${user?.id}/characters`,
          {
            withCredentials: true,
          }
        );

        setCharacters(response.data);
        setIsLoading(false);
      };

      fetchCharacters();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error ||
            err.response?.data?.message ||
            "An error occurred"
        );
      } else {
        setError("An error occurred. Server is probably down.");
      }
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading)
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
      <div className="h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Your characters</h1>
        {characters?.data &&
          characters?.data?.map((char) => (
            <CharacterCard key={char._id} character={char} />
          ))}
      </div>
    </>
  );
};

export default Characters;

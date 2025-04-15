"use client";

import { useUser } from "@/app/UserProvider";
import BackButton from "@/components/BackButton";
import DndDivider from "@/components/RedDivider";
import axios from "axios";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { use } from "react";
import CharacterProvider, {
  useCharacter,
} from "@/app/characters/[characterId]/components/CharacterProvider";
import BasicInfo from "@/app/characters/[characterId]/components/BasicInfo";
import { Stats } from "@/app/characters/[characterId]/components/Stats";
import Abilities from "@/app/characters/[characterId]/components/Abilities";
import SavingThrows from "@/app/characters/[characterId]/components/SavingThrows";
import Skills from "@/app/characters/[characterId]/components/Skills";
import FeaturesAndTraits from "@/app/characters/[characterId]/components/FeaturesAndTraits";
import OtherProficienciesAndLanguages from "@/app/characters/[characterId]/components/OtherProficienciesAndLanguages";
import Equipment from "@/app/characters/[characterId]/components/Equipment";

// Define the params type
type CharacterParams = {
  characterId: string;
};

const CharacterPage = ({ params }: { params: Promise<CharacterParams> }) => {
  const { user } = useUser();
  const router = useRouter();
  const { character, setCharacter } = useCharacter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Unwrap params using React.use()
  const unwrappedParams = use(params);
  const characterId = unwrappedParams.characterId;

  useEffect(() => {
    setIsLoading(true);

    if (!user && !isLoading) {
      router.replace("/");
      return;
    }

    try {
      const fetchCharacter = async () => {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/${characterId}`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setCharacter(response.data.character);
        setIsLoading(false);
      };

      fetchCharacter();
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
  }, [user, characterId, router]);

  // ----------  return statements ---------- do not write code bellow this point ----------

  if (isLoading)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Loader className="w-10 h-10 animate-spin" />
      </div>
    );
  if (error)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        {error}
      </div>
    );

  if (!character)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        Character not found
      </div>
    );

  return (
    <div>
      <BackButton url="/characters" />

      <div id="content" className="p-4 mt-6 sm:mt-0 sm:p-12">
        <BasicInfo />

        <DndDivider />

        <Stats />

        <DndDivider />

        <Abilities />

        <DndDivider />

        <SavingThrows />

        <DndDivider />

        <Skills />

        <DndDivider />

        <FeaturesAndTraits />

        <DndDivider />

        <Equipment />

        <DndDivider />

        <OtherProficienciesAndLanguages />

        <DndDivider />
      </div>
    </div>
  );
};

const CharacterPageWrapper = ({
  params,
}: {
  params: Promise<CharacterParams>;
}) => {
  return (
    <CharacterProvider>
      <CharacterPage params={params} />
    </CharacterProvider>
  );
};

export default CharacterPageWrapper;

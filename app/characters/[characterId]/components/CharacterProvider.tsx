import {
  Character,
  CharacterContextType,
  DeleteCharacterResponseType,
  UpdateCharacterResponseType,
} from "@/app/types";
import axios from "axios";
import { useParams } from "next/navigation";
import { useContext, createContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useUser } from "@/app/UserProvider";

const CharacterContext = createContext<CharacterContextType>({
  character: null,
  setCharacter: () => {},
  deleteCharacter: () =>
    Promise.resolve({ status: 200, message: "Character deleted successfully" }),
  updateCharacter: () =>
    Promise.resolve({
      status: 200,
      message: "Character updated successfully",
    }),
  shortRest: () =>
    Promise.resolve({
      status: 200,
      message: "Character short rested successfully",
    }),
});

const CharacterProvider = ({ children }: { children: React.ReactNode }) => {
  const { handleNoToken } = useUser();
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [characterError, setCharacterError] = useState<string | null>(null);

  const { characterId } = useParams();

  useEffect(() => {
    setIsLoading(true);

    try {
      const fetchCharacter = async () => {
        try {
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
        } catch (err) {
          if (axios.isAxiosError(err)) {
            if (err?.status === 401) {
              handleNoToken();
            }
          }
          setIsLoading(false);
        }
      };

      fetchCharacter();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setCharacterError(
          err.response?.data?.error ||
            err.response?.data?.message ||
            "An error occurred"
        );
      } else {
        setCharacterError("An error occurred.");
      }
      setIsLoading(false);
    }
  }, [characterId]);

  const deleteCharacter = async (
    characterId: string
  ): Promise<DeleteCharacterResponseType> => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/${characterId}/delete`,
        {
          withCredentials: true,
        }
      );
      setCharacter(null);

      return {
        status: response.status,
        message: "Character deleted successfully",
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("Error deleting character", error.response?.data.message);
      } else {
        toast.error("Error deleting character");
      }
      return { status: 500, message: "Failed to delete character" };
    }
  };

  const updateCharacter = async (
    characterId: string,
    character: Character
  ): Promise<UpdateCharacterResponseType> => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/${characterId}/update`,
        character,
        {
          withCredentials: true,
        }
      );

      if (response.status === 400) {
        return {
          status: response.status,
          message: response.data.message,
          error: response.data.error,
        };
      }

      setCharacter(response.data?.character);

      return {
        status: response.status,
        message: response.data.message,
        character: response.data?.character,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("Error updating character", error.response?.data.message);
      } else {
        toast.error("Error updating character");
      }
      return { status: 500, message: "Failed to update character" };
    }
  };

  const shortRest = async (characterId: string, hitDiceExpended?: number) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/${characterId}/shortRest`,
        { hitDiceExpended },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        setCharacter(response.data.character);
      }

      return {
        status: response.status,
        message: response.data.message,
        character: response.data.character,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          "Error short resting character",
          error.response?.data.message?.error
        );
      } else {
        toast.error("Error short resting character");
      }
      return { status: 500, message: "Failed to short rest character" };
    }
  };

  return (
    <CharacterContext.Provider
      value={{
        character,
        setCharacter,
        deleteCharacter,
        updateCharacter,
        characterError,
        isLoading,
        shortRest,
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacter = () => {
  return useContext(CharacterContext);
};

export default CharacterProvider;

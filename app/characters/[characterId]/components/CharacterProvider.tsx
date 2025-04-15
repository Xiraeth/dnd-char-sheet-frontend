import {
  Character,
  CharacterContextType,
  DeleteCharacterResponseType,
} from "@/app/types";
import axios from "axios";
import { useContext, createContext, useState } from "react";
import { toast } from "sonner";
const CharacterContext = createContext<CharacterContextType>({
  character: null,
  setCharacter: () => {},
  deleteCharacter: () =>
    Promise.resolve({ status: 200, message: "Character deleted successfully" }),
});

const CharacterProvider = ({ children }: { children: React.ReactNode }) => {
  const [character, setCharacter] = useState<Character | null>(null);

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

  return (
    <CharacterContext.Provider
      value={{ character, setCharacter, deleteCharacter }}
    >
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacter = () => {
  return useContext(CharacterContext);
};

export default CharacterProvider;

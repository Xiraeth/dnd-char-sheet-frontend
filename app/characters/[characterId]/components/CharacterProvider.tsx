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
  updateCharacterField: () => {},
  updateCharacter: () =>
    Promise.resolve({
      status: 200,
      message: "Character updated successfully",
    }),
  wasCharacterUpdated: false,
  setWasCharacterUpdated: () => {},
});

const CharacterProvider = ({ children }: { children: React.ReactNode }) => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [wasCharacterUpdated, setWasCharacterUpdated] = useState(false);

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
  ): Promise<DeleteCharacterResponseType> => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/${characterId}/update`,
        character,
        {
          withCredentials: true,
        }
      );

      setCharacter(response.data?.character);

      return {
        status: response.status,
        message: "Character updated successfully",
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

  // will probably not use this
  const updateCharacterField = ({
    field,
    value,
  }: {
    field: string;
    value: string | number;
  }) => {
    if (!character) return;

    // Handle nested properties (e.g., "basicInfo.level")
    const updateNestedProperty = (
      obj: Record<string, unknown>,
      path: string,
      val: string | number
    ) => {
      const keys = path.split(".");
      const lastKey = keys.pop()!;
      const target = keys.reduce(
        (o, key) => o[key] as Record<string, unknown>,
        obj
      );
      target[lastKey] = val;
      return obj;
    };

    // Create a deep copy of the character
    const characterCopy = JSON.parse(JSON.stringify(character));

    // Update the nested property
    updateNestedProperty(characterCopy, field, value);

    // Set the updated character
    setCharacter(characterCopy);
  };

  return (
    <CharacterContext.Provider
      value={{
        character,
        setCharacter,
        deleteCharacter,
        updateCharacterField,
        updateCharacter,
        wasCharacterUpdated,
        setWasCharacterUpdated,
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

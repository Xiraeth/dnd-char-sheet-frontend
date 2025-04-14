import { Character, CharacterContextType } from "@/app/types";
import { useContext, createContext, useState } from "react";

const CharacterContext = createContext<CharacterContextType>({
  setCharacter: () => {},
});

const CharacterProvider = ({ children }: { children: React.ReactNode }) => {
  const [character, setCharacter] = useState<Character | null>(null);

  return (
    <CharacterContext.Provider value={{ character, setCharacter }}>
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacter = () => {
  return useContext(CharacterContext);
};

export default CharacterProvider;

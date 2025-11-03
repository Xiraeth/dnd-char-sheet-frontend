"use client";

import BackButton from "@/components/BackButton";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import CharacterProvider, {
  useCharacter,
} from "@/app/characters/[characterId]/components/CharacterProvider";
import ViewMode, {
  ViewMode as ViewModeType,
} from "@/app/characters/[characterId]/components/Viewmode";
import GeneralPage from "@/app/characters/[characterId]/components/GeneralView/GeneralPage";
import SpellsPage from "@/app/characters/[characterId]/components/SpellsView/SpellsPage";
import CombatPage from "@/app/characters/[characterId]/components/CombatView/CombatPage";
import Notes from "@/app/characters/[characterId]/components/NotesView/Notes";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const CharacterPage = () => {
  const { character, isLoading, characterError } = useCharacter();
  const [viewMode, setViewMode] = useState<ViewModeType>(null);

  const isInfoOpen = useSearchParams().get("overlay") === "true";

  useEffect(() => {
    const viewModeFromLocalStorage = localStorage.getItem(
      "dnd-char-sheet-character-view-mode"
    );
    if (viewModeFromLocalStorage) {
      setViewMode(viewModeFromLocalStorage as ViewModeType);
    } else {
      setViewMode("General");
    }
  }, []);

  const resetViewMode = () => {
    setViewMode(null);
    localStorage.removeItem("dnd-char-sheet-character-view-mode");
  };

  // ----------  return statements ---------- do not write code bellow this point ----------
  if (isLoading)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );

  if (characterError)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        {characterError}
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
      <BackButton url="/characters" onClick={resetViewMode} />

      <div
        id="content"
        className={cn(
          "pt-10 sm:mt-0 sm:pt-4",
          !isInfoOpen ? "p-4 pt-10" : "overflow-hidden px-4"
        )}
      >
        <ViewMode viewMode={viewMode} setViewMode={setViewMode} />

        {viewMode === "General" && <GeneralPage />}
        {viewMode === "Combat" && <CombatPage />}
        {viewMode === "Spells" && <SpellsPage />}
        {viewMode === "Notes" && <Notes />}
      </div>
    </div>
  );
};

const CharacterPageWrapper = () => {
  return (
    <CharacterProvider>
      <CharacterPage />
    </CharacterProvider>
  );
};

export default CharacterPageWrapper;

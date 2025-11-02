import { useCharacter } from "@/app/characters/[characterId]/components/CharacterProvider";
import { Character } from "@/app/types";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const Notes = () => {
  const { character, updateCharacter } = useCharacter();
  const [notes, setNotes] = useState<string>(character?.notes || "");

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  const updateNotes = () => {
    if (character?._id) {
      updateCharacter(character?._id, { ...character, notes } as Character);
    }
    toast.success("Notes updated");
  };

  return (
    <div className="space-y-4 overflow-hidden pb-10">
      <p className=" text-center text-xl sm:text-2xl text-black font-scalySans">
        Here you can keep notes for your campaign
      </p>

      <textarea
        className="w-full border-2 border-black/50 rounded-md p-2 text-md sm:text-lg font-scalySans bg-white/50 text-black outline-none ring-0 focus:border-black focus:bg-white/80"
        value={notes}
        rows={20}
        onChange={handleNotesChange}
      />

      <Button className="w-full" onClick={updateNotes}>
        Save
      </Button>
    </div>
  );
};

export default Notes;

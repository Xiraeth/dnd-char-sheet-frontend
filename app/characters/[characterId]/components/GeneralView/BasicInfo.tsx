import { useCharacter } from "@/app/characters/[characterId]/components/CharacterProvider";
import { VerticalDivider } from "@/app/characters/[characterId]/components/VerticalDivider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios from "axios";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const BasicInfo = () => {
  const { character, deleteCharacter } = useCharacter();
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteClick = async () => {
    setIsDeleteDialogOpen(false);
    if (character?._id) {
      try {
        const response = await deleteCharacter(character._id);
        if (response.status === 200) {
          toast.success("Character deleted successfully");
          router.push("/characters");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error("Error deleting character", error.response?.data.message);
        } else {
          toast.error("Error deleting character");
        }
      }
    } else {
      toast.error("Character not found or delete function not available");
    }
  };

  const handleRedirectToEdit = () => {
    router.push(`/characters/${character?._id}/edit`);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-1 w-full justify-center sm:justify-between">
      <div className="flex justify-between sm:justify-start gap-0 sm:gap-20 w-full sm:w-fit items-center">
        <div className="text-4xl sm:text-6xl text-dndRed font-scalySans flex gap-2 items-center">
          {character?.appearance?.photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={character?.appearance?.photo}
              alt={character?.basicInfo?.name}
              className="rounded-full w-[50px] h-[50px]"
            />
          )}
          {character?.basicInfo?.name}
        </div>

        <Popover>
          <PopoverTrigger asChild className="sm:absolute sm:right-6 sm:top-20">
            <div className="size-10 flex justify-center items-center bg-black/80 p-2 rounded-md border border-black/45 shadow-md shadow-black/45 cursor-pointer hover:bg-black/70 transition-all duration-150">
              <Menu size={20} className="text-white" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="bg-white text-black w-fit text-center p-0 font-mrEaves">
            <p
              className="cursor-pointer border-b border-black/45 hover:bg-black/10 transition-all duration-150 p-2"
              onClick={handleRedirectToEdit}
            >
              Edit
            </p>
            <p
              className="cursor-pointer hover:bg-black/10 transition-all duration-150 p-2 text-red-600"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Delete
            </p>
          </PopoverContent>
        </Popover>

        {/* delete character dialog */}
        <div className="flex gap-2 absolute">
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogContent className="w-10/12 sm:max-w-fit bg-bgTextureDarkened rounded-md font-mrEaves text-xl sm:text-2xl font-bold">
              <DialogHeader className="sr-only">
                <DialogTitle>
                  Are you sure you want to delete this character?
                </DialogTitle>
              </DialogHeader>

              <p className="text-center pt-2">
                Are you sure you want to delete this character?
              </p>
              <div className="flex justify-center items-center gap-2">
                <Button
                  type="submit"
                  variant="destructive"
                  className="font-bookInsanity"
                  onClick={handleDeleteClick}
                >
                  Yes
                </Button>
                <Button
                  type="submit"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  No
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-0 sm:gap-2 font-bookInsanity">
        <div className="text-base sm:text-lg flex gap-2">
          <span>Level</span> <span>{character?.basicInfo?.level}</span>
          {character?.basicInfo?.race} {character?.basicInfo?.class}{" "}
        </div>
        <VerticalDivider />
        <p className="text-base sm:text-lg flex justify-between">
          {character?.basicInfo?.alignment}, {character?.basicInfo?.background}
        </p>
      </div>
    </div>
  );
};

export default BasicInfo;

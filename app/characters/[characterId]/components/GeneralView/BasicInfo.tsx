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
import Image from "next/image";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Loader2, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const BasicInfo = () => {
  const {
    character,
    deleteCharacter,
    shortRest,
    longRest,
    isShortRestLoading,
    isLongRestLoading,
  } = useCharacter();
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isShortRestDialogOpen, setIsShortRestDialogOpen] = useState(false);
  const [isLongRestDialogOpen, setIsLongRestDialogOpen] = useState(false);
  const [hitDiceToExpend, setHitDiceToExpend] = useState<number | undefined>(
    undefined
  );

  const remainingHitDice = character?.stats?.hitDice?.remaining;

  const handleDeleteClick = async () => {
    setIsDeleteDialogOpen(false);
    if (character?._id) {
      try {
        const response = await deleteCharacter(character._id);
        if (response.status === 200) {
          router.push("/");
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

  const handleShortRest = async (hitDiceToExpend?: number) => {

    if (
      hitDiceToExpend &&
      remainingHitDice &&
      hitDiceToExpend > remainingHitDice
    ) {
      toast.error(
        `Not enough hit dice to expend. You have ${remainingHitDice} hit dice remaining.`
      );
      return;
    }

    if (hitDiceToExpend && !remainingHitDice) {
      toast.error("No hit dice to expend");
      return;
    }

    try {
      if (character?._id) {
        const response = await shortRest(
          character?._id,
          Number(hitDiceToExpend || "0")
        );
        if (response.status === 200) {
          setIsShortRestDialogOpen(false);
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          "Error short resting character",
          error.response?.data.message
        );
      } else {
        toast.error("Error short resting character");
      }
    }
  };

  const handleLongRest = async () => {
    try {
      if (character?._id) {
        const response = await longRest(character?._id);
        if (response.status === 200) {
          setIsLongRestDialogOpen(false);
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          "Error long resting character",
          error.response?.data.message
        );
      } else {
        toast.error("Error long resting character");
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-1 w-full justify-center sm:justify-between sm:pt-4 md:pt-0">
      <div className="flex justify-between sm:justify-start gap-0 sm:gap-20 w-full sm:w-fit items-center">
        <div className="text-4xl sm:text-6xl text-dndRed font-scalySans flex gap-2 items-center">
          {character?.appearance?.photo && (
            <div className="w-[75px] md:w-[100px] h-[75px] md:h-[100px] rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={character?.appearance?.photo}
                width={100}
                height={100}
                alt="Character photo"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {character?.basicInfo?.name}
        </div>

        <Popover>
          <PopoverTrigger asChild className="sm:absolute sm:right-6 sm:top-28">
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
              className="cursor-pointer border-b border-black/45 hover:bg-black/10 transition-all duration-150 p-2"
              onClick={() => setIsShortRestDialogOpen(true)}
            >
              Short rest
            </p>
            <p
              className="cursor-pointer border-b border-black/45 hover:bg-black/10 transition-all duration-150 p-2"
              onClick={() => setIsLongRestDialogOpen(true)}
            >
              Long rest
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
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="w-10/12 sm:max-w-fit bg-bgTextureDarkened rounded-md font-mrEaves text-xl sm:text-2xl font-bold py-8 flex flex-col gap-6">
            <DialogHeader className="sr-only">
              <DialogTitle>
                Are you sure you want to delete this character?
              </DialogTitle>
            </DialogHeader>

            <p className="text-center pt-2 text-3xl">
              Are you sure you want to delete this character?
            </p>
            <div className="flex justify-center items-center gap-2">
              <Button
                type="submit"
                variant="destructive"
                className="font-bookInsanity text-lg w-1/2 drop-shadow-lg shadow-sm shadow-black/40"
                onClick={handleDeleteClick}
              >
                Yes
              </Button>
              <Button
                type="submit"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="text-lg font-bookInsanity w-1/2 drop-shadow-lg shadow-sm shadow-black/40"
              >
                No
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* short rest dialog */}
        <Dialog
          open={isShortRestDialogOpen}
          onOpenChange={setIsShortRestDialogOpen}
        >
          <DialogContent className="pt-10 bg-white/80 backdrop-filter backdrop-blur-xl rounded-md font-bookInsanity">
            {isShortRestLoading ? (
              <div className="w-full h-full flex justify-center items-center">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              <>
                <DialogHeader className="sr-only">
                  <DialogTitle>
                    How many hit dice do you want to expend? (optional)
                  </DialogTitle>
                </DialogHeader>

                <div className="flex items-center flex-col md:flex-row justify-between">
                  <div className="text-center font-montserrat pt-2 text-black text-base">
                    Expend hit dice (optional)
                    <span className="italic text-indigo-600 ml-2">
                      ({remainingHitDice} available)
                    </span>
                  </div>
                  <Input
                    type="text"
                    className="font-montserrat text-lg drop-shadow-lg shadow-sm shadow-black/40 w-20"
                    value={hitDiceToExpend?.toString() || ""}
                    onChange={(e) => {
                      if (
                        isNaN(Number(e.target.value)) ||
                        e.target.value === ""
                      ) {
                        setHitDiceToExpend(undefined);
                      } else {
                        setHitDiceToExpend(Number(e.target.value));
                      }
                    }}
                  />
                </div>

                <Button
                  type="submit"
                  className="font-bookInsanity text-white transition-all duration-150 drop-shadow-md bg-green-600 hover:bg-green-700"
                  onClick={() => handleShortRest(hitDiceToExpend)}
                >
                  Short rest
                </Button>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* long rest dialog */}
        <Dialog
          open={isLongRestDialogOpen}
          onOpenChange={setIsLongRestDialogOpen}
        >
          <DialogContent className="bg-white/80 backdrop-filter backdrop-blur-xl rounded-md font-bookInsanity text-xl sm:text-2xl border-none p-10 drop-shadow-lg shadow-white/20 shadow-lg">
            {isLongRestLoading ? (
              <div className="w-full h-full flex justify-center items-center">
                <Loader2 className="animate-spin text-black" />
              </div>
            ) : (
              <>
                {" "}
                <DialogHeader className="sr-only">
                  <DialogTitle>Are you sure you want to long rest?</DialogTitle>
                </DialogHeader>
                <p className="text-center pt-2 text-black">
                  Are you sure you want to long rest?
                </p>
                <Button
                  type="submit"
                  className="font-bookInsanity text-white transition-all duration-150 drop-shadow-md bg-green-600 hover:bg-green-700"
                  onClick={handleLongRest}
                >
                  Long rest
                </Button>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-0 sm:gap-2 font-bookInsanity">
        <div className="text-base sm:text-lg flex flex-row sm:flex-col md:flex-row gap-2 sm:gap-0 md:gap-2">
          <span>Level {character?.basicInfo?.level}</span>
          {character?.basicInfo?.race} {character?.basicInfo?.class}{" "}
        </div>
        <VerticalDivider />
        <p className="text-base sm:text-lg flex flex-row sm:flex-col md:flex-row gap-2 sm:gap-0 md:gap-2">
          <span>
            {character?.basicInfo?.alignment}
            <span className="inline sm:hidden md:inline">, </span>
          </span>
          <span>{character?.basicInfo?.background}</span>
        </p>
      </div>
    </div>
  );
};

export default BasicInfo;

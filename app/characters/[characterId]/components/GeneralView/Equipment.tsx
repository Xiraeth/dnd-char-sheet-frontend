import { useCharacter } from "@/app/characters/[characterId]/components/CharacterProvider";
import { Item } from "@/app/types";
import { useUser } from "@/app/UserProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Equipment = () => {
  const { user } = useUser();
  const { character, setCharacter } = useCharacter();

  const [isUpdating, setIsUpdating] = useState(false);
  const [isEquipmentVisible, setIsEquipmentVisible] = useState(false);

  const [amountToUpdate, setAmountToUpdate] = useState<Record<string, string | undefined> | undefined>(undefined);

  const itemsMap = new Map();

  character?.inventory?.items?.forEach(item => {
    itemsMap.set(item?._id, item);
  })

  const expendItem = async (itemId: string, amount: number, amountToUse?: number) => {
    if (isUpdating) return;

    if (amountToUse && amountToUse <= 0) {
      toast.error("Custom use amount must be a positive integer (or empty)");
      return;
    }

    if (amountToUse && amountToUse > amount) {
      toast.error("Custom use amount must be less than or equal to the amount of items");
      return;
    }

    setIsUpdating(true);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/${character?._id}/useItem/${itemId}?amountToUse=${amountToUse || 1}`,
        user,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Item used successfully");
        setCharacter(response.data.character);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to use item"
        );
      } else {
        toast.error("Failed to use item");
      }
    } finally {
      setAmountToUpdate(undefined);
      setIsUpdating(false);
    }
  };

  const gainItem = async (itemId: string, amountToGain?: number) => {
    if (isUpdating) return;

    if (amountToGain && amountToGain <= 0) {
      toast.error("Custom gain amount must be a positive integer (or empty)");
      return;
    }

    setIsUpdating(true);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/${character?._id}/gainItem/${itemId}?gainAmount=${amountToGain || 1}`,
        user,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Item gained successfully");
        setCharacter(response.data.character);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to gain item"
        );
      } else {
        toast.error("Failed to gain item");
      }
    } finally {
      setAmountToUpdate(undefined);
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-3xl font-bold text-center font-mrEaves ml-auto">
          Equipment
        </p>
        <ChevronDown
          className={clsx(
            "size-6 ml-auto cursor-pointer bg-white/20 rounded-full p-1",
            isEquipmentVisible ? "rotate-180" : ""
          )}
          onClick={() => setIsEquipmentVisible(!isEquipmentVisible)}
        />
      </div>
      {isEquipmentVisible && (
        <div className="text-base sm:text-lg">
          {!!character?.inventory?.gold && (
            <div className="flex gap-2 font-bookInsanity">
              <p className="font-bold text-dndRed">Gold: </p>
              <p>{character?.inventory?.gold}</p>
            </div>
          )}

          {!!character?.inventory?.items?.length && (
            <div className="flex flex-col gap-2 font-bookInsanity">
              <p className="text-lg sm:text-xl text-center mb-2 font-scalySans border-b border-b-black/45">
                Items
              </p>
              {character?.inventory?.items?.map((item: Item) => {
                const itemData = itemsMap.get(item?._id);
                const { name, description, isConsumable, amount, _id } = itemData;

                const consumableInfo = isConsumable ? `(${amount})` : "";

                const customAmount = amountToUpdate?.[_id]

                return (
                  <div key={_id} className="w-full flex items-center justify-between">

                    <div>
                      <span className="font-bold text-dndRed">{name}</span>{" "}
                      <span className="text-indigo-700 font-bold">{consumableInfo}</span>
                      <pre className="w-[calc(100vw - 2rem)] text-wrap font-scalySans">
                        {description}
                      </pre>
                    </div>

                    {item.isConsumable ? <div className="flex gap-2 flex-col md:flex-row w-full md:w-auto mb-2 lg:mb-2">
                      <Button
                        className="bg-red-600 text-black hover:bg-red-600/75 transition-all duration-150 drop-shadow-md h-[32px]"
                        disabled={(amount || 0) <= 0 || isUpdating}
                        size="sm"
                        onClick={() => {
                          expendItem(_id, amount, customAmount ? +customAmount : undefined,);
                        }}
                      >
                        Use Item ({customAmount || 1})
                      </Button>

                      <Input type="text"
                        key={`custom-recharge-amount-${_id}`}
                        value={customAmount || ""}
                        className="h-[32px] min-w-[90px]"
                        onChange={(e) => {
                          if (e.target.value === "") {
                            setAmountToUpdate({ ...amountToUpdate, [_id]: undefined });
                            return;
                          }

                          if (isNaN(parseInt(e.target.value)) || e.target.value.includes("-")) {
                            return;
                          }

                          const parsedValue = parseInt(e.target.value);
                          setAmountToUpdate({ ...amountToUpdate, [_id]: parsedValue.toString() });
                        }}
                        placeholder="Custom use amount"
                      />

                      <Button
                        className="bg-green-600 text-black hover:bg-green-600/75 transition-all duration-150 drop-shadow-md h-[32px]"
                        size="sm"
                        onClick={() => {
                          gainItem(_id, customAmount ? +customAmount : undefined);
                        }}
                      >
                        Gain Item ({customAmount || 1})
                      </Button>
                    </div> : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Equipment;

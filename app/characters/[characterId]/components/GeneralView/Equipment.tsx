import { useCharacter } from "@/app/characters/[characterId]/components/CharacterProvider";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const Equipment = () => {
  const { character } = useCharacter();
  const [isEquipmentVisible, setIsEquipmentVisible] = useState(false);

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
              {character?.inventory?.items?.map((item) => {
                const itemName = item?.name;
                const itemDescription = item?.description;

                const isConsumable = item?.isConsumable;
                const numberLeft = item?.numberLeft;
                const numberTotal = item?.numberTotal;

                const consumableInfo = isConsumable ? `(${numberLeft}/${numberTotal})` : "";

                return (
                  <div key={itemName}>
                    <span className="font-bold text-dndRed">{itemName}</span> <span className="text-indigo-700 font-bold">{consumableInfo}</span>
                    <pre className="w-[calc(100vw - 2rem)] text-wrap font-scalySans">
                      {itemDescription}
                    </pre>
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

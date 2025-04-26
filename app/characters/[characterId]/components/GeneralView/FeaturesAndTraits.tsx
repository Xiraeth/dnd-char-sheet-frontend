import { useCharacter } from "@/app/characters/[characterId]/components/CharacterProvider";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
const FeaturesAndTraits = () => {
  const { character } = useCharacter();
  const [areFeaturesAndTraitsVisible, setAreFeaturesAndTraitsVisible] =
    useState(false);

  return (
    <div className="my-2 gap-2 flex flex-col">
      <div className="flex items-center justify-center gap-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-center font-mrEaves ml-auto">
          Features and Traits
        </h2>
        <ChevronDown
          className={clsx(
            "size-6 ml-auto cursor-pointer bg-white/20 rounded-full p-1",
            areFeaturesAndTraitsVisible ? "rotate-180" : ""
          )}
          onClick={() =>
            setAreFeaturesAndTraitsVisible(!areFeaturesAndTraitsVisible)
          }
        />
      </div>
      {!!areFeaturesAndTraitsVisible &&
        !!character?.featuresAndTraits?.length && (
          <div className="flex flex-col gap-4 text-base sm:text-lg">
            {character?.featuresAndTraits?.map((feature) => {
              const title = feature?.name;
              const description = feature?.description;
              const source = feature?.source;

              return (
                <div key={title} className="font-bookInsanity">
                  <p className="text-lg font-bold text-dndRed">{title}</p>
                  <pre className="w-fit font-scalySans text-base text-wrap">
                    {description}
                  </pre>
                  {source && (
                    <p className="text-black/80 my-1 italic font-scalySans">
                      Source: {source}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
};

export default FeaturesAndTraits;

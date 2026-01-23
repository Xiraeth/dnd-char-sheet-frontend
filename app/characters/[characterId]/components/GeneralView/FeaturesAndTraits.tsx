import { useCharacter } from "@/app/characters/[characterId]/components/CharacterProvider";
import { RechargeOnType } from "@/app/types";
import { useUser } from "@/app/UserProvider";
import { Button } from "@/components/ui/button";
import axios from "axios";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const rechargeMap = {
  daily: "daily",
  longRest: "on long rest",
  longOrShortRest: "on long/short rest",
  shortRest: "on short rest",
  other: "other",
} as const;

const getColourForUsesLeft = (usesLeft: number) => {
  if (usesLeft === 0) return 'text-red-600';
}



const getRechargesOnText = (rechargeOn: RechargeOnType, customRechargeOn?: string) => {
  if (rechargeOn === 'other') {
    return `Recharges ${customRechargeOn}`;
  }

  return `Recharges ${rechargeMap[rechargeOn as RechargeOnType]}`;
}

const FeaturesAndTraits = () => {
  const { user } = useUser();
  const { character, setCharacter } = useCharacter();
  const [areFeaturesAndTraitsVisible, setAreFeaturesAndTraitsVisible] =
    useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const featuresMap = new Map();

  character?.featuresAndTraits?.forEach(feat => {
    featuresMap.set(feat?._id, feat);
  })


  const expendFeature = async (featureId: string, usesLeft: number) => {
    if (isUpdating) return;

    if (usesLeft <= 0) {
      toast.error("No uses left");
      return;
    }

    setIsUpdating(true);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/${character?._id}/expendFeature/${featureId}`,
        user,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Feature expended successfully");
        setCharacter(response.data.character);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to expend feature"
        );
      } else {
        toast.error("Failed to expend feature");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const restoreFeature = async (
    featureId: string,
    usesLeft: number,
    usesTotal: number
  ) => {
    if (isUpdating) return;

    if (usesLeft >= usesTotal) {
      toast.error("No uses left");
      return;
    }

    setIsUpdating(true);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/${character?._id}/gainFeature/${featureId}`,
        user,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Feature restored successfully");
        setCharacter(response.data.character);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to restore feature"
        );
      } else {
        toast.error("Failed to restore feature");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="my-2 gap-2 flex flex-col">
      <div className="flex items-center justify-center gap-2">
        <h2 className="text-3xl font-bold text-center font-mrEaves ml-auto">
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
              const { name, description, source, isExpendable, usesLeft, usesTotal, rechargeOn, customRechargeOn, _id } = featuresMap.get(feature._id);

              const colourForUsesLeft = getColourForUsesLeft(usesLeft);

              return (
                <div key={_id} className="font-bookInsanity">
                  <p className="text-2xl font-bold text-dndRed">{name}</p>

                  {isExpendable && (
                    <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <div className="flex gap-2 items-center">
                        <p className="text-black my-1 italic font-montserrat text-base font-bold">
                          Uses left: <span className={clsx(colourForUsesLeft)}>{usesLeft}</span>/{usesTotal}
                        </p>

                        {rechargeOn && (
                          <p className="text-indigo-700 drop-shadow-2xl font-bold text-xl py-2 font-roboto">
                            {getRechargesOnText(rechargeOn, customRechargeOn)}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 mb-4 sm:mb-0">
                        <Button
                          className="bg-red-600 text-black hover:bg-red-600/75 transition-all duration-150 drop-shadow-md h-[26px]"
                          disabled={(usesLeft || 0) <= 0 || isUpdating}
                          size="sm"
                          onClick={() => {
                            expendFeature(feature?._id || "", usesLeft || 0);
                          }}
                        >
                          Expend a charge
                        </Button>

                        <Button
                          className="bg-green-600 text-black hover:bg-green-600/75 transition-all duration-150 drop-shadow-md h-[26px]"
                          disabled={(usesLeft || 0) >= (usesTotal || 0) || isUpdating}
                          size="sm"
                          onClick={() => {
                            restoreFeature(
                              feature?._id || "",
                              usesLeft || 0,
                              usesTotal || 0
                            );
                          }}
                        >
                          Restore a charge
                        </Button>
                      </div>
                    </div>
                  )}

                  <pre className="w-fit font-scalySans text-lg text-wrap">
                    {description}
                  </pre>

                  {source && (
                    <p className="text-gray-800 my-1 italic font-bookInsanity font-bold">
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

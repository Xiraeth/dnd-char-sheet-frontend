import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Feature, RechargeOnType } from "@/app/types";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { getProficiencyBonus, validateRechargeDice } from "@/lib/utils";
import { DICE_OPTIONS } from "@/app/constants";

const DEFAULT_FEATURE: Feature = {
  name: "",
  description: "",
  source: "",
  isExpendable: false,
  usesLeft: 0,
  usesTotal: 0,
  rechargeOn: undefined,
  chargesRestored: undefined,
};

const FeaturesAndTraitsCard = () => {
  const { watch, setValue } = useFormContext();
  const [isEditFeatureFormOpen, setIsEditFeatureFormOpen] = useState(false);
  const [feature, setFeature] = useState<Feature>(DEFAULT_FEATURE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const featuresAndTraits = watch("featuresAndTraits");
  const proficiencyBonus = getProficiencyBonus(watch("basicInfo.level"));

  const validateFeature = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    const rechargeDiceErrors = validateRechargeDice(feature.rechargeDice);

    if (Object.keys(rechargeDiceErrors).length) {
      Object.entries(rechargeDiceErrors).forEach(([key, error]: [string, string]) => {
        newErrors[key] = error;
      })
    }

    if (!feature.name) {
      newErrors.name = "Name is required";
    }

    if (!feature.description) {
      newErrors.description = "Description is required";
    }

    if (!feature.source) {
      newErrors.source = "Source is required";
    }

    if (feature.isExpendable && !feature.usesTotal) {
      newErrors.usesTotal = "Uses total is required when feature is expendable";
    }

    if (feature.isExpendable && !feature.rechargeOn) {
      newErrors.rechargeOn =
        "Recharge timer is required when feature is expendable";
    }

    if (!feature.chargesRestored) {
      newErrors.chargesRestored = "The amount of charges restored is mandatory";
    }

    if (feature.chargesRestored === 'arbitraryNumber' && (!feature.rechargeAmount || feature.rechargeAmount === '-')) {
      newErrors.rechargeAmount = "Recharge amount must be a postive integer";
    }

    if (typeof feature.rechargeAmount === 'number' && feature.rechargeAmount <= 0) {
      newErrors.rechargeAmount = "Recharge amount must be a postive integer";
    }

    setErrors(newErrors);
    return newErrors;
  };

  const handleConfirm = () => {
    const validationErrors = validateFeature();

    if (Object.keys(validationErrors).length > 0) {
      return;
    } else {
      if (feature._id) {
        setValue(
          "featuresAndTraits",
          featuresAndTraits.map((f: Feature) => {
            if (f._id === feature._id) {
              return { ...f, ...feature };
            }
            return f;
          })
        );
      } else {
        setValue("featuresAndTraits", [
          ...(featuresAndTraits || []),
          { ...feature, _id: uuidv4() },
        ]);
      }
      setFeature(DEFAULT_FEATURE);
      setIsEditFeatureFormOpen(false);
    }
  };

  const handleCancel = () => {
    setFeature(DEFAULT_FEATURE);
    setErrors({});
    setIsEditFeatureFormOpen(false);
  };

  const handleDelete = (
    e: React.MouseEvent<SVGElement>,
    id: string | undefined
  ) => {
    e?.stopPropagation();
    setIsEditFeatureFormOpen(false);
    setFeature(DEFAULT_FEATURE);
    setValue(
      "featuresAndTraits",
      featuresAndTraits?.filter((feature: Feature) => feature._id !== id)
    );
  };

  const handleFeatureClick = (id: string) => {
    setFeature(
      featuresAndTraits?.find((feature: Feature) => feature._id === id)
    );
    setIsEditFeatureFormOpen(true);
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Features and Traits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 flex-wrap">
          {featuresAndTraits?.map((feature: Feature, index: number) => (
            <div
              key={feature?._id || index}
              className="flex gap-2 bg-black/90 w-fit text-white rounded-md px-4 py-2 items-center text-sm mb-4 cursor-pointer hover:bg-black/75 transition-all duration-150"
              onClick={() => handleFeatureClick(feature?._id || "")}
            >
              <p>{feature.name}</p>
              <X
                className="size-4 cursor-pointer hover:text-red-600 transition-all duration-150"
                onClick={(e) => handleDelete(e, feature?._id || "")}
              />
            </div>
          ))}
        </div>

        {isEditFeatureFormOpen && (
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block mb-1">
                Name <span className="text-red-600">*</span>
              </label>
              <Input
                id="name"
                placeholder="Feature name"
                value={feature?.name}
                onChange={(e) =>
                  setFeature({ ...feature, name: e.target.value })
                }
              />
              {errors.name && (
                <p className="text-red-600 text-sm">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="source" className="block mb-1">
                Source <span className="text-red-600">*</span>
              </label>
              <Input
                id="source"
                placeholder="Source (e.g., Class, Race, Background)"
                value={feature?.source}
                onChange={(e) =>
                  setFeature({ ...feature, source: e.target.value })
                }
              />
              {errors.source && (
                <p className="text-red-600 text-sm">{errors.source}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block mb-1">
                Description <span className="text-red-600">*</span>
              </label>
              <Textarea
                id="description"
                placeholder="Feature description"
                className="min-h-[100px]"
                value={feature?.description}
                onChange={(e) =>
                  setFeature({ ...feature, description: e.target.value })
                }
              />
              {errors.description && (
                <p className="text-red-600 text-sm">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 justify-center text-center">
              <div className="col-span-2 flex gap-2 justify-center items-center">
                <Label htmlFor="isExpendable">Is expendable?</Label>
                <Switch
                  id="isExpendable"
                  checked={feature?.isExpendable}
                  onCheckedChange={() => {
                    setErrors({ ...errors, usesTotal: "", rechargeOn: "", chargesRestored: "", rechargeAmount: "" });
                    setFeature({
                      ...feature,
                      isExpendable: !feature?.isExpendable,
                      usesLeft: !feature?.isExpendable ? 0 : undefined,
                      usesTotal: !feature?.isExpendable ? 0 : undefined,
                      areUsesTotalEqualToProfBonus: false,
                      rechargeOn: undefined,
                      rechargeDice: undefined,
                      chargesRestored: undefined,
                      rechargeAmount: undefined,
                    });
                  }}
                />
                {errors.isExpendable && (
                  <p className="text-red-600 text-sm">{errors.isExpendable}</p>
                )}
              </div>

              {feature?.isExpendable && (
                <>
                  {/* uses total */}
                  <div className="flex flex-col items-center gap-2">
                    <Label htmlFor="usesTotal">Uses total</Label>
                    <Input
                      id="usesTotal"
                      type="text"
                      disabled={feature?.areUsesTotalEqualToProfBonus}
                      value={feature?.usesTotal || ""}
                      onChange={(e) => {
                        const resetUsesTotal = () => {
                          setFeature({
                            ...feature,
                            usesTotal: 0,
                            usesLeft: 0,
                          });
                        };

                        if (e.target.value === "") {
                          resetUsesTotal();
                          return;
                        }

                        if (isNaN(parseInt(e.target.value))) {
                          resetUsesTotal();
                          return;
                        }

                        setFeature({
                          ...feature,
                          usesTotal: parseInt(e.target.value),
                          usesLeft: parseInt(e.target.value),
                        });
                      }}
                    />
                    {errors.usesTotal && (
                      <p className="text-red-600 text-sm">{errors.usesTotal}</p>
                    )}

                    <div className="flex justify-between gap-2 items-center">
                      <p className="italic text-black/80 text-xs">
                        (equal to proficiency bonus)
                      </p>
                      <Checkbox
                        checked={feature?.areUsesTotalEqualToProfBonus}
                        onCheckedChange={() => {
                          setFeature({
                            ...feature,
                            usesTotal: feature?.areUsesTotalEqualToProfBonus
                              ? feature.usesTotal
                              : proficiencyBonus,
                            usesLeft: feature?.areUsesTotalEqualToProfBonus
                              ? feature.usesLeft
                              : proficiencyBonus,
                            areUsesTotalEqualToProfBonus:
                              !feature?.areUsesTotalEqualToProfBonus,
                          });
                        }}
                      />
                    </div>
                  </div>

                  {/* recharge on */}
                  <div className="flex flex-col items-center gap-2 w-full">
                    <div className="flex flex-col items-center gap-2 w-full">
                      <Label htmlFor="rechargeOn">Recharge</Label>
                      <Select
                        value={feature?.rechargeOn}
                        onValueChange={(value) =>
                          setFeature({
                            ...feature,
                            rechargeOn: value as RechargeOnType,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select recharge" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="shortRest">On short rest</SelectItem>
                          <SelectItem value="longRest">On long rest</SelectItem>
                          <SelectItem value="longOrShortRest">
                            On long/short rest
                          </SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.rechargeOn && (
                        <p className="text-red-600 text-sm">
                          {errors.rechargeOn}
                        </p>
                      )}
                    </div>

                    {feature.rechargeOn === 'other' ? (
                      <div className="w-full">
                        <Label htmlFor="customRechargeOn">Custom recharge timer</Label>
                        <Input
                          id="customRechargeOn"
                          type="text"
                          value={feature?.customRechargeOn || ""}
                          onChange={(e) =>
                            setFeature({ ...feature, customRechargeOn: e.target.value })
                          }
                          placeholder="When does it recharge?"
                        />
                      </div>
                    ) : null}

                  </div>
                </>
              )}
            </div>

            {/* amount of charges restored */}
            {feature?.isExpendable && (
              <div className="flex flex-col gap-2 justify-center items-center">
                <Label htmlFor="rechargeAmount" className="w-full">Select how many charges are restored every time this feature recharges</Label>
                <Select
                  value={feature.chargesRestored}
                  onValueChange={(value) => {
                    if (value === 'all') {
                      setFeature({ ...feature, chargesRestored: 'all', rechargeAmount: undefined, rechargeDice: undefined });
                      setErrors({ ...errors, chargesRestored: "", rechargeAmount: "", rechargeDice: "" });
                    } else if (value === 'dice') {
                      setFeature({ ...feature, chargesRestored: 'dice', rechargeDice: { typeOfDice: 0, amountOfDice: 0 }, rechargeAmount: undefined });
                      setErrors({ ...errors, chargesRestored: "", rechargeDice: "", rechargeAmount: "" });
                    } else if (value === 'arbitraryNumber') {
                      setFeature({ ...feature, chargesRestored: 'arbitraryNumber', rechargeAmount: undefined, rechargeDice: undefined });
                      setErrors({ ...errors, chargesRestored: "", rechargeAmount: "", rechargeDice: "" });
                    }
                  }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select how many charges are restored" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="dice">Dice</SelectItem>
                    <SelectItem value="arbitraryNumber">Arbitrary number</SelectItem>
                  </SelectContent>
                </Select>

                {errors.chargesRestored && (
                  <p className="text-red-600 text-sm">{errors.chargesRestored}</p>
                )}

                {/* in case rechargeDice is an object, select the dice amount and type (e.g. 3d4) */}
                {feature.chargesRestored === 'dice' && (
                  <div className="flex w-full items-start justify-center gap-2">

                    {/* amount of dice */}
                    <div className="w-2/5">
                      <Label htmlFor="rechargeDice.amountOfDice">Amount of dice</Label>
                      <Input
                        id="rechargeDice.amountOfDice"
                        type="number"
                        value={feature.rechargeDice?.amountOfDice || ''}
                        onChange={(e) => {
                          if (e.target.value === "") {
                            setFeature({ ...feature, rechargeDice: { typeOfDice: feature.rechargeDice?.typeOfDice || '', amountOfDice: '', modifier: feature.rechargeDice?.modifier || '' } });
                            return;
                          }

                          const parsedValue = parseInt(e.target.value);
                          if (isNaN(parsedValue)) {
                            return;
                          }
                          setFeature({
                            ...feature,
                            rechargeDice:
                            {
                              ...feature.rechargeDice,
                              typeOfDice: feature.rechargeDice?.typeOfDice || 0,
                              amountOfDice: parsedValue
                            }
                          });
                        }}
                      />
                      {errors.amountOfDice && (
                        <p className="text-red-600 text-sm">{errors.amountOfDice}</p>
                      )}
                    </div>

                    {/* dice type */}
                    <div className="w-1/5">
                      <Label htmlFor="rechargeDice.typeOfDice">Dice type</Label>
                      <Select
                        onValueChange={(value) => {
                          const parsedValue = parseInt(value);
                          if (isNaN(parsedValue)) {
                            return;
                          }
                          setFeature({ ...feature, rechargeDice: { ...feature.rechargeDice, typeOfDice: parsedValue, amountOfDice: feature.rechargeDice?.amountOfDice || 0 } });
                        }}
                        value={feature.rechargeDice?.typeOfDice?.toString() || "0"}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select dice type" />
                        </SelectTrigger>
                        <SelectContent>
                          {DICE_OPTIONS.map((dice) => (
                            <SelectItem key={dice.value} value={dice.value.toString()}>
                              {dice.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.typeOfDice && (
                        <p className="text-red-600 text-sm">{errors.typeOfDice}</p>
                      )}
                    </div>

                    {/* modifier */}
                    <div className="w-2/5">
                      <Label htmlFor="rechargeDice.modifier">Modifier</Label>
                      <Input
                        id="rechargeDice.modifier"
                        type="text"
                        value={feature.rechargeDice?.modifier || ""}
                        onChange={(e) => {
                          if (e.target.value === "-") {
                            setFeature({ ...feature, rechargeDice: { typeOfDice: feature.rechargeDice?.typeOfDice || 0, amountOfDice: feature.rechargeDice?.amountOfDice || 0, modifier: '-' } });
                            return;
                          }

                          if (e.target.value === "+") {
                            setFeature({ ...feature, rechargeDice: { typeOfDice: feature.rechargeDice?.typeOfDice || 0, amountOfDice: feature.rechargeDice?.amountOfDice || 0, modifier: 1 } });
                            return;
                          }
                          if (e.target.value === "") {
                            setFeature({ ...feature, rechargeDice: { typeOfDice: feature.rechargeDice?.typeOfDice || 0, amountOfDice: feature.rechargeDice?.amountOfDice || 0, modifier: undefined } });
                            return;
                          }

                          if (isNaN(parseInt(e.target.value))) {
                            setFeature({ ...feature, rechargeDice: { typeOfDice: feature.rechargeDice?.typeOfDice || 0, amountOfDice: feature.rechargeDice?.amountOfDice || 0, modifier: undefined } });
                            return;
                          }

                          setFeature({ ...feature, rechargeDice: { typeOfDice: feature.rechargeDice?.typeOfDice || 0, amountOfDice: feature.rechargeDice?.amountOfDice || 0, modifier: parseInt(e.target.value) } });
                        }}
                        placeholder="Custom modifier (negative or positive constant that gets added to the dice roll)"
                      />
                      {errors.modifier && (
                        <p className="text-red-600 text-sm">{errors.modifier}</p>
                      )}
                    </div>

                  </div>
                )}

                {/* in case neither rechargeFully nor rechargeDice are set, we can assume the feature has a custom recharge amount */}
                {feature.chargesRestored === 'arbitraryNumber' ? (
                  <div className="w-full">
                    <Label htmlFor="rechargeAmount">Recharge amount</Label>
                    <Input
                      id="rechargeAmount"
                      type="text"
                      value={feature.rechargeAmount || ''}
                      onChange={(e) => {
                        if (e.target.value === "-") {
                          setFeature({ ...feature, rechargeAmount: '-' });
                          return;
                        }

                        if (e.target.value === "") {
                          setFeature({ ...feature, rechargeAmount: '' });
                          return;
                        }

                        const parsedValue = parseInt(e.target.value);
                        if (isNaN(parsedValue)) {
                          return;
                        }
                        setFeature({ ...feature, rechargeAmount: parsedValue });
                      }}
                    />
                    {errors.rechargeAmount && (
                      <p className="text-red-600 text-sm">{errors.rechargeAmount}</p>
                    )}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        )}

        {!isEditFeatureFormOpen && (
          <Button
            className="w-full"
            type="button"
            onClick={() => setIsEditFeatureFormOpen(true)}
          >
            Add Feature
          </Button>
        )}

        {isEditFeatureFormOpen && (
          <div className="flex gap-2">
            <Button className="w-full" type="button" onClick={handleConfirm}>
              Confirm
            </Button>
            <Button className="w-full" type="button" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeaturesAndTraitsCard;

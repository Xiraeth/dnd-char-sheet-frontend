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
import { Feature } from "@/app/types";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { getProficiencyBonus } from "@/lib/utils";

const DEFAULT_FEATURE: Feature = {
  name: "",
  description: "",
  source: "",
  isExpendable: false,
  usesLeft: 0,
  usesTotal: 0,
  rechargeOn: "",
};

const FeaturesAndTraitsCard = () => {
  const { watch, setValue } = useFormContext();
  const [isEditFeatureFormOpen, setIsEditFeatureFormOpen] = useState(false);
  const [feature, setFeature] = useState<Feature>(DEFAULT_FEATURE);
  const [errors, setErrors] = useState<Partial<Feature>>({});
  const featuresAndTraits = watch("featuresAndTraits");

  const proficiencyBonus = getProficiencyBonus(watch("basicInfo.level"));

  const validateFeature = () => {
    const newErrors: Partial<Feature> = {};

    if (!feature.name) {
      newErrors.name = "Name is required";
    }

    if (!feature.description) {
      newErrors.description = "Description is required";
    }

    if (!feature.source) {
      newErrors.source = "Source is required";
    }

    setErrors(newErrors);
    return newErrors;
  };

  const handleConfirm = () => {
    const validationErrors = validateFeature();

    if (Object.keys(validationErrors).length > 0) {
      return;
    } else {
      if (feature.id) {
        setValue(
          "featuresAndTraits",
          featuresAndTraits.map((f: Feature) => {
            if (f.id === feature.id) {
              return { ...f, ...feature };
            }
            return f;
          })
        );
      } else {
        setValue("featuresAndTraits", [
          ...(featuresAndTraits || []),
          { ...feature, id: uuidv4() },
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
      featuresAndTraits?.filter((feature: Feature) => feature.id !== id)
    );
  };

  const handleFeatureClick = (id: string) => {
    setFeature(
      featuresAndTraits?.find((feature: Feature) => feature.id === id)
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
              key={feature?.id || index}
              className="flex gap-2 bg-black/90 w-fit text-white rounded-md px-4 py-2 items-center text-sm mb-4 cursor-pointer hover:bg-black/75 transition-all duration-150"
              onClick={() => handleFeatureClick(feature?.id || "")}
            >
              <p>{feature.name}</p>
              <X
                className="size-4 cursor-pointer hover:text-red-600 transition-all duration-150"
                onClick={(e) => handleDelete(e, feature?.id)}
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
                value={feature.name}
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
                value={feature.source}
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
                value={feature.description}
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
                  checked={feature.isExpendable}
                  onCheckedChange={() => {
                    setFeature({
                      ...feature,
                      isExpendable: !feature.isExpendable,
                      usesLeft: !feature.isExpendable ? 0 : undefined,
                      usesTotal: !feature.isExpendable ? 0 : undefined,
                      rechargeOn: !feature.isExpendable ? "" : undefined,
                    });
                  }}
                />
              </div>
              {feature?.isExpendable && (
                <>
                  <div className="flex flex-col items-center gap-2">
                    <Label htmlFor="usesTotal">Uses total</Label>
                    <Input
                      id="usesTotal"
                      type="text"
                      disabled={feature?.areUsesTotalEqualToProfBonus}
                      value={feature.usesTotal || ""}
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
                  <div className="flex flex-col items-center gap-2 ">
                    <Label htmlFor="rechargeOn">Recharge</Label>
                    <Select
                      value={feature.rechargeOn}
                      onValueChange={(value) =>
                        setFeature({ ...feature, rechargeOn: value })
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
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div></div>
            </div>
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

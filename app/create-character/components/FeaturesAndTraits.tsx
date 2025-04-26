import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface Feature {
  id?: string;
  name: string;
  description: string;
  source: string;
}

const DEFAULT_FEATURE: Feature = {
  name: "",
  description: "",
  source: "",
};

const FeaturesAndTraitsCard = () => {
  const { watch, setValue } = useFormContext();
  const [isEditFeatureFormOpen, setIsEditFeatureFormOpen] = useState(false);
  const [feature, setFeature] = useState<Feature>(DEFAULT_FEATURE);
  const [errors, setErrors] = useState<Partial<Feature>>({});
  const featuresAndTraits = watch("featuresAndTraits");

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

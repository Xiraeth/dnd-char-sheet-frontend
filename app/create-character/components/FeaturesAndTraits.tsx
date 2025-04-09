import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { X } from "lucide-react";

interface Feature {
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
  const [isCreateFeatureFormOpen, setIsCreateFeatureFormOpen] = useState(false);
  const [feature, setFeature] = useState<Feature>(DEFAULT_FEATURE);
  const [errors, setErrors] = useState<Partial<Feature>>({});
  const features = watch("features");

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
      setValue("features", [...(features || []), feature]);
      setFeature(DEFAULT_FEATURE);
      setIsCreateFeatureFormOpen(false);
    }
  };

  const handleCancel = () => {
    setFeature(DEFAULT_FEATURE);
    setIsCreateFeatureFormOpen(false);
  };

  const handleDelete = (index: number) => {
    setValue(
      "features",
      features?.filter((feature: Feature, i: number) => i !== index)
    );
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Features and Traits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 flex-wrap">
          {features?.map((feature: Feature, index: number) => (
            <div
              key={index}
              className="flex gap-2 bg-black/90 w-fit text-white rounded-md px-4 py-2 items-center text-sm mb-4"
            >
              <p>{feature.name}</p>
              <X
                className="size-4 cursor-pointer hover:text-red-600 transition-all duration-150"
                onClick={() => handleDelete(index)}
              />
            </div>
          ))}
        </div>

        {isCreateFeatureFormOpen && (
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

        {!isCreateFeatureFormOpen && (
          <Button
            className="w-full"
            type="button"
            onClick={() => setIsCreateFeatureFormOpen(true)}
          >
            Add Feature
          </Button>
        )}

        {isCreateFeatureFormOpen && (
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

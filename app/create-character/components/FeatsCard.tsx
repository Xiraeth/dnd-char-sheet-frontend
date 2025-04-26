import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface Feat {
  id?: string;
  name: string;
  description: string;
  level: string;
}

const DEFAULT_FEAT: Feat = {
  name: "",
  description: "",
  level: "",
};

const FeatsCard = () => {
  const { watch, setValue } = useFormContext();
  const [isEditFeatFormOpen, setIsEditFeatFormOpen] = useState(false);
  const [feat, setFeat] = useState<Feat>(DEFAULT_FEAT);
  const [errors, setErrors] = useState<Partial<Feat>>({});
  const feats = watch("feats");

  const validateFeat = () => {
    const newErrors: Partial<Feat> = {};

    if (!feat.name) {
      newErrors.name = "Name is required";
    }

    if (!feat.description) {
      newErrors.description = "Description is required";
    }

    if (!feat.level) {
      newErrors.level = "Level is required";
    }

    setErrors(newErrors);
    return newErrors;
  };

  const handleConfirm = () => {
    const validationErrors = validateFeat();

    if (Object.keys(validationErrors).length > 0) {
      return;
    } else {
      if (feat.id) {
        setValue(
          "feats",
          feats.map((f: Feat) => {
            if (f.id === feat.id) {
              return { ...f, ...feat };
            }
            return f;
          })
        );
      } else {
        setValue("feats", [...(feats || []), { ...feat, id: uuidv4() }]);
      }
      setFeat(DEFAULT_FEAT);
      setIsEditFeatFormOpen(false);
    }
  };

  const handleCancel = () => {
    setFeat(DEFAULT_FEAT);
    setIsEditFeatFormOpen(false);
  };

  const handleDelete = (
    e: React.MouseEvent<SVGElement>,
    id: string | undefined
  ) => {
    e?.stopPropagation();
    setIsEditFeatFormOpen(false);
    setFeat(DEFAULT_FEAT);
    setValue(
      "feats",
      feats?.filter((feat: Feat) => feat.id !== id)
    );
  };

  const handleFeatClick = (id: string) => {
    setFeat(feats?.find((feat: Feat) => feat.id === id));
    setIsEditFeatFormOpen(true);
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Feats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 flex-wrap">
          {feats?.map((feat: Feat, index: number) => (
            <div
              key={feat?.id || index}
              className="flex gap-2 bg-black/90 w-fit text-white rounded-md px-4 py-2 items-center text-sm mb-4 cursor-pointer hover:bg-black/75 transition-all duration-150"
              onClick={() => handleFeatClick(feat?.id || "")}
            >
              <p>
                {feat.name} (Level {feat.level})
              </p>
              <X
                className="size-4 cursor-pointer hover:text-red-600 transition-all duration-150"
                onClick={(e) => handleDelete(e, feat?.id)}
              />
            </div>
          ))}
        </div>

        {isEditFeatFormOpen && (
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block mb-1">
                Name <span className="text-red-600">*</span>
              </label>
              <Input
                id="name"
                placeholder="Feat name"
                value={feat.name}
                onChange={(e) => setFeat({ ...feat, name: e.target.value })}
              />
              {errors.name && (
                <p className="text-red-600 text-sm">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="level" className="block mb-1">
                Level Acquired <span className="text-red-600">*</span>
              </label>
              <Input
                id="level"
                type="string"
                placeholder="Level when feat was acquired"
                value={feat.level}
                onChange={(e) => setFeat({ ...feat, level: e.target.value })}
              />
              {errors.level && (
                <p className="text-red-600 text-sm">{errors.level}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block mb-1">
                Description <span className="text-red-600">*</span>
              </label>
              <Textarea
                id="description"
                placeholder="Feat description"
                className="min-h-[100px]"
                value={feat.description}
                onChange={(e) =>
                  setFeat({ ...feat, description: e.target.value })
                }
              />
              {errors.description && (
                <p className="text-red-600 text-sm">{errors.description}</p>
              )}
            </div>
          </div>
        )}

        {!isEditFeatFormOpen && (
          <Button
            className="w-full"
            type="button"
            onClick={() => setIsEditFeatFormOpen(true)}
          >
            Add Feat
          </Button>
        )}

        {isEditFeatFormOpen && (
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

export default FeatsCard;

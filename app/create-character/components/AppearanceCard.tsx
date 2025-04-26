import { Character } from "@/app/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AppearanceCard = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<Character>();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Appearance</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-indigo-600">
        <div className="flex flex-col gap-2">
          <Label className="text-black" htmlFor="appearance.age">
            Age
          </Label>
          <Input
            placeholder="Age"
            {...register("appearance.age")}
            type="text"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-black" htmlFor="appearance.height">
            Height
          </Label>
          <Input
            placeholder="Height"
            {...register("appearance.height")}
            type="text"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-black" htmlFor="appearance.weight">
            Weight
          </Label>
          <Input
            placeholder="Weight"
            {...register("appearance.weight")}
            type="text"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-black" htmlFor="appearance.eyes">
            Eyes
          </Label>
          <Input
            placeholder="Eyes"
            {...register("appearance.eyes")}
            type="text"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-black" htmlFor="appearance.hair">
            Hair
          </Label>
          <Input
            placeholder="Hair"
            {...register("appearance.hair")}
            type="text"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-black" htmlFor="appearance.skin">
            Skin
          </Label>
          <Input
            placeholder="Skin"
            {...register("appearance.skin")}
            type="text"
          />
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <Label className="text-black" htmlFor="appearance.photo">
            Picture URL
          </Label>
          <Input placeholder="Picture URL" {...register("appearance.photo")} />
        </div>

        {errors?.appearance?.photo && (
          <p className="text-red-600 text-sm">
            {errors.appearance.photo.message}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default AppearanceCard;

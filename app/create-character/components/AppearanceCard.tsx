import { Character } from "@/app/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";

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
        <Input placeholder="Age" {...register("appearance.age")} />

        <Input placeholder="Height" {...register("appearance.height")} />

        <Input placeholder="Weight" {...register("appearance.weight")} />

        <Input placeholder="Eyes" {...register("appearance.eyes")} />

        <Input placeholder="Hair" {...register("appearance.hair")} />

        <Input placeholder="Skin" {...register("appearance.skin")} />

        <Input
          className="flex flex-col gap-2 md:col-span-2"
          placeholder="Picture URL"
          {...register("appearance.photo")}
        />

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

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
        <Input placeholder="Age" {...register("appearance.age")} type="text" />

        <Input
          placeholder="Height"
          {...register("appearance.height")}
          type="text"
        />

        <Input
          placeholder="Weight"
          {...register("appearance.weight")}
          type="text"
        />

        <Input
          placeholder="Eyes"
          {...register("appearance.eyes")}
          type="text"
        />

        <Input
          placeholder="Hair"
          {...register("appearance.hair")}
          type="text"
        />

        <Input
          placeholder="Skin"
          {...register("appearance.skin")}
          type="text"
        />

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

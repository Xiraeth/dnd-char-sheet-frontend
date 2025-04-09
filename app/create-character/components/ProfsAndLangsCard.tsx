import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";

const ProfsAndLangsCard = () => {
  const { register } = useFormContext();

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Other proficiencies and languages</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="proficiencies">Proficiencies</Label>
          <Textarea id="proficiencies" {...register("otherProficiencies")} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="languages">Languages</Label>
          <Textarea id="languages" {...register("languages")} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfsAndLangsCard;

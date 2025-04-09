import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
const PersonalityCard = () => {
  const { register } = useFormContext();

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Personality</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="personalityTraits">Personality Traits</Label>
          <Textarea id="personalityTraits" {...register("personalityTraits")} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="ideals">Ideals</Label>
          <Textarea id="ideals" {...register("ideals")} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="bonds">Bonds</Label>
          <Textarea id="bonds" {...register("bonds")} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="flaws">Flaws</Label>
          <Textarea id="flaws" {...register("flaws")} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="backstory">Character backstory</Label>
          <Textarea id="backstory" {...register("characterBackstory")} />
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalityCard;

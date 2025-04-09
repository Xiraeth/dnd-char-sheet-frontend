import { Attack } from "@/app/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { DAMAGE_TYPES, ABILITIES } from "@/app/constants";
import { X } from "lucide-react";

const DEFAULT_ATTACK: Attack = {
  name: "",
  attackRoll: "",
  damageRoll: "",
  damageType: "",
  range: "",
  areaOfEffect: "",
  description: "",
  abilitySave: "",
};

const AttacksCard = () => {
  const { watch, setValue } = useFormContext();
  const [isCreateAttackFormOpen, setIsCreateAttackFormOpen] = useState(false);
  const [attack, setAttack] = useState<Attack>(DEFAULT_ATTACK);
  const [errors, setErrors] = useState<Partial<Attack>>({});
  const attacks = watch("attacks");

  const validateAttack = () => {
    const newErrors: Partial<Attack> = {};

    if (!attack.name) {
      newErrors.name = "Name is required";
    }

    setErrors(newErrors);
    return newErrors;
  };

  const handleConfirm = () => {
    const validationErrors = validateAttack();

    if (Object.keys(validationErrors).length > 0) {
      return;
    } else {
      setValue("attacks", [...(attacks || []), attack]);
      setAttack(DEFAULT_ATTACK);
      setIsCreateAttackFormOpen(false);
    }
  };

  const handleCancel = () => {
    setAttack(DEFAULT_ATTACK);

    setIsCreateAttackFormOpen(false);
  };

  const handleDelete = (index: number) => {
    setValue(
      "attacks",
      attacks?.filter((attack: Attack, i: number) => i !== index)
    );
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Attacks</CardTitle>
      </CardHeader>
      <CardContent>
        {attacks?.map((attack: Attack, index: number) => (
          <div
            key={index}
            className="flex gap-2 bg-black/90 w-fit text-white rounded-md px-4 py-2 items-center text-sm mb-4"
          >
            <p>{attack.name}</p>
            <X
              className="size-4 cursor-pointer hover:text-red-600 transition-all duration-150"
              onClick={() => handleDelete(index)}
            />
          </div>
        ))}

        {isCreateAttackFormOpen && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            <div>
              <Input
                placeholder="Name"
                value={attack.name}
                onChange={(e) => setAttack({ ...attack, name: e.target.value })}
              />
              {errors.name && (
                <p className="text-red-600 text-sm">{errors.name}</p>
              )}
            </div>

            <Input
              placeholder="Attack Roll"
              value={attack.attackRoll}
              onChange={(e) =>
                setAttack({ ...attack, attackRoll: e.target.value })
              }
            />

            <Input
              placeholder="Damage Roll"
              value={attack.damageRoll}
              onChange={(e) =>
                setAttack({ ...attack, damageRoll: e.target.value })
              }
            />

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Damage Type" />
              </SelectTrigger>
              <SelectContent>
                {DAMAGE_TYPES?.map((damageType) => (
                  <SelectItem key={damageType.value} value={damageType.value}>
                    {damageType.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Range"
              value={attack.range}
              onChange={(e) => setAttack({ ...attack, range: e.target.value })}
            />

            <Input
              placeholder="Area of Effect"
              value={attack.areaOfEffect}
              onChange={(e) =>
                setAttack({ ...attack, areaOfEffect: e.target.value })
              }
            />

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Ability save" />
              </SelectTrigger>
              <SelectContent>
                {ABILITIES?.map((ability) => (
                  <SelectItem key={ability.value} value={ability.value}>
                    {ability.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Textarea
              className="col-span-full"
              placeholder="Description"
              value={attack.description}
              onChange={(e) =>
                setAttack({ ...attack, description: e.target.value })
              }
            />
          </div>
        )}

        {!isCreateAttackFormOpen && (
          <Button
            className="w-full"
            type="button"
            onClick={() => setIsCreateAttackFormOpen(true)}
          >
            Add Attack
          </Button>
        )}

        {isCreateAttackFormOpen && (
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

export default AttacksCard;

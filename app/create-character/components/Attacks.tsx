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
import { DAMAGE_TYPES, ABILITIES, DICE_OPTIONS } from "@/app/constants";
import { X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Attack, CharacterAbilities } from "@/app/types";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { getModifier } from "@/lib/utils";

const DEFAULT_ATTACK: Attack = {
  name: "",
  attackRoll: {},
  damageRoll: {
    numberOfDice: 0,
    diceType: 4,
  },
  damageType: "",
  range: "",
  areaOfEffect: "",
  description: "",
  abilitySave: "",
  isProficient: false,
  otherAttackRollModifier: 0,
  otherDamageModifier: 0,
};

interface AttackErrors {
  name?: string;
  abilitySave?: string;
  damageType?: string;
  range?: string;
  damageRoll?: {
    numberOfDice?: string;
    abilityUsed?: string;
  };
}

const AttacksCard = () => {
  const { watch, setValue } = useFormContext();
  const [isEditAttackFormOpen, setIsEditAttackFormOpen] = useState(false);
  const [attack, setAttack] = useState<Attack>(DEFAULT_ATTACK);
  const [attackType, setAttackType] = useState<"save" | "roll">("roll");
  const [errors, setErrors] = useState<AttackErrors>({});
  const attacks = watch("attacks");
  const abilities = watch("abilities");

  const validateAttack = () => {
    const newErrors: AttackErrors = {};

    if (!attack.name) {
      newErrors.name = "Required";
    }

    if (!attack.abilitySave && attackType === "save") {
      newErrors.abilitySave = "Required";
    }

    if (!attack.damageRoll.numberOfDice) {
      newErrors.damageRoll = {
        numberOfDice: "Required",
      };
    }

    if (!attack.damageType) {
      newErrors.damageType = "Required";
    }

    if (!attack.range) {
      newErrors.range = "Required";
    }

    if (attackType === "roll" && !attack.damageRoll.abilityUsed) {
      newErrors.damageRoll = {
        ...newErrors.damageRoll,
        abilityUsed: "Required",
      };
    }

    setErrors(newErrors);
    return newErrors;
  };

  const handleConfirm = () => {
    const validationErrors = validateAttack();

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const isAttackRoll = attackType === "roll";

    const attackRollModifier =
      isAttackRoll &&
      getModifier(
        abilities[attack?.damageRoll?.abilityUsed as keyof CharacterAbilities]
      );

    const attackToSave = {
      ...attack,
      isProficient: isAttackRoll ? attack.isProficient : undefined,
      attackRoll: isAttackRoll ? { modifier: attackRollModifier } : undefined,
      damageRoll: isAttackRoll
        ? attack.damageRoll
        : { ...attack.damageRoll, abilityUsed: undefined },
    };

    if (attack.id) {
      setValue(
        "attacks",
        attacks.map((a: Attack) => (a.id === attack.id ? attackToSave : a))
      );
    } else {
      setValue("attacks", [
        ...(attacks || []),
        { ...attackToSave, id: uuidv4() },
      ]);
    }
    setAttack(DEFAULT_ATTACK);
    setIsEditAttackFormOpen(false);
  };

  const handleCancel = () => {
    setAttack(DEFAULT_ATTACK);
    setErrors({});

    setIsEditAttackFormOpen(false);
  };

  const handleDelete = (e: React.MouseEvent<SVGElement>, id: string) => {
    e?.stopPropagation();
    setValue(
      "attacks",
      attacks?.filter((attack: Attack) => attack.id !== id)
    );
    setIsEditAttackFormOpen(false);
    setAttack(DEFAULT_ATTACK);
  };

  const handleEditAttack = (id: string) => {
    setAttack(attacks.find((attack: Attack) => attack.id === id));
    setIsEditAttackFormOpen(true);
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Attacks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 flex-wrap">
          {attacks?.map((attack: Attack, index: number) => (
            <div
              key={attack?.id || index}
              className="flex gap-2 bg-black/90 w-fit text-white rounded-md px-4 py-2 items-center text-sm mb-4 cursor-pointer hover:bg-black/75 transition-all duration-150"
              onClick={() => handleEditAttack(attack?.id || "")}
            >
              <p>{attack.name}</p>
              <X
                className="size-4 cursor-pointer hover:text-red-600 transition-all duration-150"
                onClick={(e) => handleDelete(e, attack?.id || "")}
              />
            </div>
          ))}
        </div>

        {isEditAttackFormOpen && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            <div className="col-span-full flex justify-center items-center gap-4">
              <p>Attack Roll</p>
              <Switch
                defaultChecked={false}
                checked={attackType === "save"}
                onCheckedChange={() =>
                  setAttackType(attackType === "roll" ? "save" : "roll")
                }
              />
              <p>Ability save</p>
            </div>

            <div>
              <Label htmlFor="name" className="text-xs sm:text-sm">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Name"
                value={attack.name}
                onChange={(e) => setAttack({ ...attack, name: e.target.value })}
              />
              {errors.name && (
                <p className="text-red-600 text-sm">{errors.name}</p>
              )}
            </div>

            <div>
              <Label
                htmlFor="damageRoll.numberOfDice"
                className="text-xs sm:text-sm"
              >
                Number of Dice
              </Label>
              <Input
                id="damageRoll.numberOfDice"
                placeholder="Number of Dice"
                value={attack.damageRoll?.numberOfDice || ""}
                type="text"
                onChange={(e) => {
                  if (e.target.value === "") {
                    setAttack({
                      ...attack,
                      damageRoll: { ...attack.damageRoll, numberOfDice: 0 },
                    });
                    return;
                  }

                  if (isNaN(parseInt(e.target.value))) {
                    return;
                  }

                  setAttack({
                    ...attack,
                    damageRoll: {
                      ...attack.damageRoll,
                      numberOfDice: parseInt(e.target.value),
                    },
                  });
                }}
              />
              {errors.damageRoll?.numberOfDice && (
                <p className="text-red-600 text-sm">
                  {errors.damageRoll?.numberOfDice}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="damageRoll.diceType"
                className="text-xs sm:text-sm"
              >
                Dice Type
              </Label>
              <Select
                onValueChange={(value) => {
                  setAttack({
                    ...attack,
                    damageRoll: {
                      ...attack.damageRoll,
                      diceType: parseInt(value),
                    },
                  });
                }}
                value={attack.damageRoll.diceType?.toString() || "4"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Dice Type" />
                </SelectTrigger>
                <SelectContent id="damageRoll.diceType">
                  {DICE_OPTIONS.map((dice) => (
                    <SelectItem key={dice.value} value={dice.value.toString()}>
                      {dice.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="damageType" className="text-xs sm:text-sm">
                Damage Type
              </Label>
              <Select
                onValueChange={(value) => {
                  setAttack({ ...attack, damageType: value });
                }}
                value={attack.damageType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Damage Type" />
                </SelectTrigger>
                <SelectContent id="damageType">
                  {DAMAGE_TYPES?.map((damageType) => (
                    <SelectItem key={damageType.value} value={damageType.value}>
                      {damageType.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.damageType && (
                <p className="text-red-600 text-sm">{errors.damageType}</p>
              )}
            </div>

            <div>
              <Label htmlFor="range" className="text-xs sm:text-sm">
                Range
              </Label>
              <Input
                id="range"
                placeholder="Range"
                value={attack.range}
                onChange={(e) =>
                  setAttack({ ...attack, range: e.target.value })
                }
              />
              {errors.range && (
                <p className="text-red-600 text-sm">{errors.range}</p>
              )}
            </div>

            <div>
              <Label htmlFor="areaOfEffect" className="text-xs sm:text-sm">
                Area of Effect
              </Label>
              <Input
                id="areaOfEffect"
                placeholder="Area of Effect"
                value={attack.areaOfEffect}
                onChange={(e) =>
                  setAttack({ ...attack, areaOfEffect: e.target.value })
                }
              />
            </div>

            {attackType === "roll" && (
              <div>
                <Label
                  htmlFor="damageRoll.abilityUsed"
                  className="text-ellipsis text-nowrap w-fit text-xs sm:text-sm"
                >
                  Ability used in attack
                </Label>
                <Select
                  onValueChange={(value) => {
                    setAttack({
                      ...attack,
                      damageRoll: {
                        ...attack.damageRoll,
                        abilityUsed: value as keyof CharacterAbilities,
                      },
                      abilitySave: undefined,
                    });
                  }}
                  value={attack.damageRoll.abilityUsed}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Ability used in attack" />
                  </SelectTrigger>
                  <SelectContent id="damageRoll.abilityUsed">
                    {ABILITIES.map((ability) => (
                      <SelectItem key={ability.value} value={ability.value}>
                        {ability.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.damageRoll?.abilityUsed && (
                  <p className="text-red-600 text-sm">
                    {errors.damageRoll?.abilityUsed}
                  </p>
                )}
                {errors.abilitySave && (
                  <p className="text-red-600 text-sm">{errors.abilitySave}</p>
                )}
              </div>
            )}

            {attackType === "save" && (
              <div>
                <Label htmlFor="abilitySave" className="text-xs sm:text-sm">
                  Ability save
                </Label>
                <Select
                  onValueChange={(value) => {
                    setAttack({
                      ...attack,
                      abilitySave: value,
                      attackRoll: { modifier: undefined },
                      damageRoll: {
                        ...attack.damageRoll,
                        abilityUsed: undefined,
                      },
                    });
                  }}
                  value={attack.abilitySave}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Ability save" />
                  </SelectTrigger>
                  <SelectContent id="abilitySave">
                    {ABILITIES?.map((ability) => (
                      <SelectItem key={ability.value} value={ability.value}>
                        {ability.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.abilitySave && (
                  <p className="text-red-600 text-sm">{errors.abilitySave}</p>
                )}
              </div>
            )}

            {attackType === "roll" && (
              <div className="col-span-full flex justify-center items-center gap-4 mt-2">
                <p className="text-sm italic text-black/80">
                  Add proficiency bonus to attack roll?
                </p>
                <Checkbox
                  checked={attack.isProficient}
                  onCheckedChange={() =>
                    setAttack({ ...attack, isProficient: !attack.isProficient })
                  }
                />
              </div>
            )}

            <div className=" col-span-2  sm:w-1/2">
              <Label
                htmlFor="otherAttackRollModifier"
                className="text-xs sm:text-sm text-nowrap text-ellipsis"
              >
                Other attack modifier
              </Label>
              <Input
                type="number"
                id="otherAttackRollModifier"
                placeholder="Other attack roll modifier"
                value={attack.otherAttackRollModifier || ""}
                onChange={(e) => {
                  const resetOtherAttackRollModifier = () => {
                    setAttack({
                      ...attack,
                      otherAttackRollModifier: 0,
                    });
                  };

                  if (e.target.value === "") {
                    resetOtherAttackRollModifier();
                    return;
                  }

                  if (isNaN(parseInt(e.target.value))) {
                    resetOtherAttackRollModifier();
                    return;
                  }

                  setAttack({
                    ...attack,
                    otherAttackRollModifier: parseInt(e.target.value),
                  });
                }}
              />
            </div>

            <div className="col-span-2 w-full sm:col-span-1 ">
              <Label
                htmlFor="otherDamageModifier"
                className="text-xs sm:text-sm text-nowrap text-ellipsis text"
              >
                Other damage modifier
              </Label>
              <Input
                id="otherDamageModifier"
                value={attack.otherDamageModifier || ""}
                onChange={(e) => {
                  const resetOtherDamageModifier = () => {
                    setAttack({
                      ...attack,
                      otherDamageModifier: 0,
                    });
                  };

                  if (e.target.value === "") {
                    resetOtherDamageModifier();
                    return;
                  }

                  if (isNaN(parseInt(e.target.value))) {
                    resetOtherDamageModifier();
                    return;
                  }

                  setAttack({
                    ...attack,
                    otherDamageModifier: parseInt(e.target.value),
                  });
                }}
                placeholder="Other damage modifier"
              />
            </div>

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

        {!isEditAttackFormOpen && (
          <Button
            className="w-full"
            type="button"
            onClick={() => setIsEditAttackFormOpen(true)}
          >
            Add Attack
          </Button>
        )}

        {isEditAttackFormOpen && (
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

import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Spell } from "@/app/types";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DAMAGE_TYPES, SPELL_SCHOOLS } from "@/app/constants";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from "uuid";

const CustomSpellForm = ({
  setIsCreateSpellFormOpen,
  setSelectedSpell,
  selectedSpell,
}: {
  setIsCreateSpellFormOpen: (isOpen: boolean) => void;
  selectedSpell: Spell | null;
  setSelectedSpell?: (spell: Spell | null) => void;
}) => {
  const { control } = useFormContext();

  const { append, update, fields } = useFieldArray({
    control,
    name: "spells",
  });

  const spell = selectedSpell || {
    _id: "",
    name: "",
    desc: "",
    level: "",
    school: {
      name: "",
      desc: "",
    },
    casting_time: "",
    range: "",
    components: [],
    duration: "",
    higher_level: [],
    damage: {
      damage_type: {
        name: "",
      },
      damage_at_slot_level: [],
    },
  };

  const [errors, setErrors] = useState<Partial<Spell>>({});

  const validateSpell = () => {
    const newErrors: Partial<Spell> = {};

    if (!spell.name?.length) {
      newErrors.name = "Name is required";
    }

    if (!spell.level?.length) {
      newErrors.level = "Level is required";
    }

    if (!spell.school?.name?.length) {
      newErrors.school = { name: "School is required" };
    }

    if (!spell.casting_time?.length) {
      newErrors.casting_time = "Casting time is required";
    }

    if (!spell.range?.length) {
      newErrors.range = "Range is required";
    }

    if (!spell.duration?.length) {
      newErrors.duration = "Duration is required";
    }

    if (!spell.desc?.length) {
      newErrors.desc = "Description is required";
    }

    if (!spell.components?.some((component) => component.length)) {
      newErrors.components = ["Components are required"];
    }

    setErrors(newErrors);
    return newErrors;
  };

  const onSave = () => {
    const validationErrors = validateSpell();

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const spellData = { ...spell, _id: selectedSpell?._id || uuidv4() };

    // Find if the spell exists in the array
    const spellIndex = fields.findIndex(
      (field) =>
        (field as unknown as { _id: string })._id === selectedSpell?._id
    );

    if (spellIndex !== -1) {
      // Update existing spell
      update(spellIndex, spellData);
    } else {
      // Add as new if somehow it has an ID but isn't in the array
      append(spellData);
    }

    setIsCreateSpellFormOpen(false);
    setSelectedSpell?.(null);
  };

  return (
    <div className="px-6 py-2 grid grid-cols-1 md:grid-cols-2 gap-4 font-lato mt-4">
      <div className="flex items-center justify-between md:col-span-2">
        <h1 className="font-bold text-center text-lg ml-auto">
          Custom Spell Form
        </h1>
        <X
          className="size-4 ml-auto cursor-pointer hover:text-black/50 transition-all duration-150"
          onClick={() => {
            setIsCreateSpellFormOpen(false);
            setSelectedSpell?.(null);
          }}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="name">
          Name <span className="text-red-600">*</span>
        </label>
        <Input
          id="name"
          value={spell.name}
          onChange={(e) =>
            setSelectedSpell?.({ ...spell, name: e.target.value })
          }
          className="text-indigo-600"
        />
        {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="level">
          Level <span className="text-red-600">*</span>
        </label>
        <Input
          id="level"
          type="number"
          className="text-indigo-600"
          value={spell.level}
          onChange={(e) =>
            setSelectedSpell?.({
              ...spell,
              level: e.target.value,
              damage: {
                damage_type: { name: spell.damage?.damage_type?.name || "" },
                damage_at_slot_level: [
                  {
                    damage:
                      spell.damage?.damage_at_slot_level?.[0]?.damage || "",
                    level: e.target.value,
                  },
                ],
              },
            })
          }
        />
        {errors.level && <p className="text-red-600 text-sm">{errors.level}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="school">
          School <span className="text-red-600">*</span>
        </label>
        <Select
          onValueChange={(value) =>
            setSelectedSpell?.({
              ...spell,
              school: {
                name: value,
                desc: spell.school?.desc || "",
              },
            })
          }
          value={spell.school?.name}
        >
          <SelectTrigger className="text-indigo-600">
            <SelectValue placeholder="Select a school" />
          </SelectTrigger>
          <SelectContent>
            {SPELL_SCHOOLS.map((school) => (
              <SelectItem key={school.value} value={school.value}>
                {school.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.school && (
          <p className="text-red-600 text-sm">{errors.school.name}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="casting_time">
          Casting Time <span className="text-red-600">*</span>
        </label>
        <Input
          id="casting_time"
          value={spell.casting_time}
          className="text-indigo-600"
          onChange={(e) =>
            setSelectedSpell?.({
              ...spell,
              casting_time: e.target.value,
            })
          }
        />
        {errors.casting_time && (
          <p className="text-red-600 text-sm">{errors.casting_time}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="range">
          Range <span className="text-red-600">*</span>
        </label>
        <Input
          id="range"
          className="text-indigo-600"
          value={spell.range}
          onChange={(e) =>
            setSelectedSpell?.({
              ...spell,
              range: e.target.value,
            })
          }
        />
        {errors.range && <p className="text-red-600 text-sm">{errors.range}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="duration">
          Duration <span className="text-red-600">*</span>
        </label>
        <Input
          id="duration"
          className="text-indigo-600"
          value={spell.duration}
          onChange={(e) =>
            setSelectedSpell?.({
              ...spell,
              duration: e.target.value,
            })
          }
        />
        {errors.duration && (
          <p className="text-red-600 text-sm">{errors.duration}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="damageType">Damage Type</label>
        <Select
          onValueChange={(value) =>
            setSelectedSpell?.({
              ...spell,
              damage: { ...spell.damage, damage_type: { name: value } },
            })
          }
          value={spell.damage?.damage_type?.name}
        >
          <SelectTrigger className="text-indigo-600">
            <SelectValue placeholder="Select a damage type" />
          </SelectTrigger>
          <SelectContent>
            {DAMAGE_TYPES.map((damageType) => (
              <SelectItem key={damageType.value} value={damageType.value}>
                {damageType.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="damage">Damage at selected level</label>
        <Input
          id="damage"
          className="text-indigo-600"
          value={spell.damage?.damage_at_slot_level?.[0]?.damage || ""}
          onChange={(e) =>
            setSelectedSpell?.({
              ...spell,
              damage: {
                damage_type: {
                  name: spell.damage?.damage_type?.name || "",
                },
                damage_at_slot_level: [
                  {
                    damage: e.target.value,
                    level: spell?.level || "0",
                  },
                ],
              },
            })
          }
        />
      </div>

      <div className="flex flex-col gap-1 md:col-span-2">
        <label htmlFor="healing">Healing at selected level</label>
        <Input
          id="healing"
          className="text-indigo-600"
          value={spell.healing_at_slot_level?.[0]?.healing || ""}
          onChange={(e) =>
            setSelectedSpell?.({
              ...spell,
              healing_at_slot_level: [
                {
                  healing: e.target.value,
                  level: spell.level || "0",
                },
              ],
            })
          }
        />
      </div>

      <div className="flex flex-col gap-1 md:col-span-2">
        <label htmlFor="components">
          Components <span className="text-red-600">*</span>
        </label>
        <ToggleGroup
          type="multiple"
          value={spell.components}
          onValueChange={(value) =>
            setSelectedSpell?.({ ...spell, components: value })
          }
          className="border-[1px] border-black/40 rounded-md"
        >
          <ToggleGroupItem value="V">Verbal</ToggleGroupItem>
          <ToggleGroupItem value="S">Somatic</ToggleGroupItem>
          <ToggleGroupItem value="M">Material</ToggleGroupItem>
        </ToggleGroup>
        {errors.components && (
          <p className="text-red-600 text-sm">{errors.components.join("")}</p>
        )}
      </div>

      <div className="flex flex-col gap-1 md:col-span-2">
        <label htmlFor="desc">
          Description <span className="text-red-600">*</span>
        </label>
        <Textarea
          id="desc"
          className="min-h-[100px] p-2 border rounded-md text-indigo-600"
          value={spell.desc}
          onChange={(e) =>
            setSelectedSpell?.({ ...spell, desc: e.target.value })
          }
        />
        {errors.desc && <p className="text-red-600 text-sm">{errors.desc}</p>}
      </div>

      <div className="flex flex-col gap-1 md:col-span-2">
        <label htmlFor="higher_level">Higher Level Effects</label>
        <Input
          id="higher_level"
          className="text-indigo-600"
          value={spell.higher_level?.join(", ") || ""}
          onChange={(e) =>
            setSelectedSpell?.({
              ...spell,
              higher_level: e.target.value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
            })
          }
        />
      </div>

      <div className="md:col-span-2 flex justify-end mt-4">
        <button
          type="button"
          className="px-4 py-2 bg-black/90 text-white rounded-md hover:bg-black/75 transition-colors"
          onClick={onSave}
        >
          {selectedSpell?._id ? "Update Spell" : "Save Spell"}
        </button>
      </div>
    </div>
  );
};

export default CustomSpellForm;

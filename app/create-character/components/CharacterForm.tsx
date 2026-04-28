import AbilitiesCard from "@/app/create-character/components/AbilitiesCard";
import BasicInfoCard from "@/app/create-character/components/BasicInfoCard";
import SavingThrowsCard from "@/app/create-character/components/SavingThrowsCard";
import SkillsCard from "@/app/create-character/components/SkillsCard";
import StatsCard from "@/app/create-character/components/StatsCard";
import AttacksCard from "@/app/create-character/components/Attacks";
import FeaturesAndTraitsCard from "@/app/create-character/components/FeaturesAndTraits";
import FeatsCard from "@/app/create-character/components/FeatsCard";
import SpellcastingCard from "@/app/create-character/components/SpellcastingCard";
import SpellSlotsCard from "@/app/create-character/components/SpellSlotsCard";
import SpellsCard from "@/app/create-character/components/SpellsCard";
import ProfsAndLangsCard from "@/app/create-character/components/ProfsAndLangsCard";
import InventoryCard from "@/app/create-character/components/InventoryCard";
import AppearanceCard from "@/app/create-character/components/AppearanceCard";
import PersonalityCard from "@/app/create-character/components/PersonalityCard";
import { Character } from "@/app/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUp } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { useParams } from "next/navigation";

type CharacterFormSectionId =
  | "basic-info"
  | "abilities"
  | "saving-throws"
  | "skills"
  | "stats"
  | "attacks"
  | "features-and-traits"
  | "feats"
  | "custom-spellcaster"
  | "spellcasting"
  | "spell-slots"
  | "spells"
  | "proficiencies-and-languages"
  | "inventory"
  | "appearance"
  | "personality";

interface CharacterFormSection {
  id: CharacterFormSectionId;
  label: string;
  isVisible?: boolean;
}

const FormSection = ({
  id,
  children,
}: {
  id: CharacterFormSectionId;
  children: ReactNode;
}) => {
  return (
    <section id={id} className="scroll-mt-6">
      {children}
    </section>
  );
};

const CharacterFormSectionNav = ({
  sections,
}: {
  sections: CharacterFormSection[];
}) => {
  const [activeSectionId, setActiveSectionId] =
    useState<CharacterFormSectionId>("basic-info");

  useEffect(() => {
    let animationFrameId: number | null = null;

    const updateActiveSection = () => {
      const sectionOffset = 160;
      const currentSection = sections.reduce<CharacterFormSectionId>(
        (activeId, section) => {
          const element = document.getElementById(section.id);

          if (!element) {
            return activeId;
          }

          if (element.getBoundingClientRect().top <= sectionOffset) {
            return section.id;
          }

          return activeId;
        },
        sections[0]?.id ?? "basic-info"
      );

      setActiveSectionId((previousSectionId) =>
        previousSectionId === currentSection
          ? previousSectionId
          : currentSection
      );
    };

    const scheduleActiveSectionUpdate = () => {
      if (animationFrameId !== null) {
        return;
      }

      animationFrameId = window.requestAnimationFrame(() => {
        updateActiveSection();
        animationFrameId = null;
      });
    };

    updateActiveSection();
    window.addEventListener("scroll", scheduleActiveSectionUpdate, {
      passive: true,
    });
    window.addEventListener("resize", scheduleActiveSectionUpdate);

    return () => {
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }

      window.removeEventListener("scroll", scheduleActiveSectionUpdate);
      window.removeEventListener("resize", scheduleActiveSectionUpdate);
    };
  }, [sections]);

  const scrollToSection = (sectionId: CharacterFormSectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <aside className="lg:sticky lg:top-6 lg:self-start">
      <nav className="rounded-lg border border-black/20 p-3 shadow-md shadow-black/10 backdrop-blur-sm">
        <p className="mb-3 text-center font-mrEaves text-xl font-bold text-dndRed">
          Sections
        </p>
        <div className="flex flex-wrap gap-2 lg:flex-col">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              className={cn(
                "rounded-md border border-black/15 bg-white/35 px-3 py-2 text-left font-bookInsanity text-sm text-black shadow-sm transition-all duration-150",
                "hover:bg-black/80 hover:text-white",
                activeSectionId === section.id && "bg-black/80 text-white"
              )}
              onClick={() => scrollToSection(section.id)}
            >
              {section.label}
            </button>
          ))}
        </div>
      </nav>
    </aside>
  );
};

const CharacterForm = ({
  isSpellcaster,
  setIsSpellcaster,
  isSubmitting,
  formReady = true,
}: {
  isSpellcaster: boolean;
  setIsSpellcaster: (isSpellcaster: boolean) => void;
  isSubmitting?: boolean;
  formReady?: boolean;
}) => {
  const characterId = useParams() as { characterId: string };

  const { watch, setError, clearErrors } = useFormContext<Character>();
  const characterClass = watch("basicInfo.class");
  const race = watch("basicInfo.race");
  const isCustomClass = characterClass?.toLowerCase() === "custom";

  const formSections = useMemo<CharacterFormSection[]>(
    () => [
      { id: "basic-info", label: "Basic Information" },
      { id: "abilities", label: "Abilities" },
      { id: "saving-throws", label: "Saving Throws" },
      { id: "skills", label: "Skills" },
      { id: "stats", label: "Stats" },
      { id: "attacks", label: "Attacks" },
      { id: "features-and-traits", label: "Features and Traits" },
      { id: "feats", label: "Feats" },
      {
        id: "custom-spellcaster",
        label: "Spellcaster",
        isVisible: isCustomClass,
      },
      { id: "spellcasting", label: "Spellcasting", isVisible: isSpellcaster },
      { id: "spell-slots", label: "Spell Slots", isVisible: isSpellcaster },
      {
        id: "spells",
        label: "Spells",
        isVisible: isSpellcaster && formReady,
      },
      {
        id: "proficiencies-and-languages",
        label: "Proficiencies and Languages",
      },
      { id: "inventory", label: "Inventory" },
      { id: "appearance", label: "Appearance" },
      { id: "personality", label: "Personality" },
    ],
    [formReady, isCustomClass, isSpellcaster]
  );

  const visibleFormSections = useMemo(
    () => formSections.filter((section) => section.isVisible ?? true),
    [formSections]
  );

  const validateRace = () => {
    if (!race?.length) {
      setError("basicInfo.race", {
        message: "Race is required",
      });
    } else {
      clearErrors("basicInfo.race");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative grid grid-cols-1 gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
      <CharacterFormSectionNav sections={visibleFormSections} />

      <div className="flex min-w-0 flex-col gap-4">
        <FormSection id="basic-info">
          <BasicInfoCard setIsSpellcaster={setIsSpellcaster} />
        </FormSection>

        <FormSection id="abilities">
          <AbilitiesCard />
        </FormSection>

        <FormSection id="saving-throws">
          <SavingThrowsCard />
        </FormSection>

        <FormSection id="skills">
          <SkillsCard />
        </FormSection>

        <FormSection id="stats">
          <StatsCard isEditPage={!!characterId} />
        </FormSection>

        <FormSection id="attacks">
          <AttacksCard />
        </FormSection>

        <FormSection id="features-and-traits">
          <FeaturesAndTraitsCard />
        </FormSection>

        <FormSection id="feats">
          <FeatsCard />
        </FormSection>

        {isCustomClass && (
          <FormSection id="custom-spellcaster">
            <div className="flex items-center gap-4 w-full justify-center border-[1px] border-black/20 rounded-lg px-4 py-2 shadow-md shadow-black/5">
              <p>This character is a spellcaster</p>
              <Switch onCheckedChange={setIsSpellcaster} />
            </div>
          </FormSection>
        )}

        {isSpellcaster && (
          <FormSection id="spellcasting">
            <SpellcastingCard />
          </FormSection>
        )}

        {isSpellcaster && (
          <FormSection id="spell-slots">
            <SpellSlotsCard />
          </FormSection>
        )}

        {isSpellcaster && formReady && (
          <FormSection id="spells">
            <SpellsCard />
          </FormSection>
        )}

        <FormSection id="proficiencies-and-languages">
          <ProfsAndLangsCard />
        </FormSection>

        <FormSection id="inventory">
          <InventoryCard />
        </FormSection>

        <FormSection id="appearance">
          <AppearanceCard />
        </FormSection>

        <FormSection id="personality">
          <PersonalityCard />
        </FormSection>

        <Button
          type="submit"
          className="w-full"
          onClick={validateRace}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Saving..."
            : characterId
            ? "Save changes"
            : "Create Character"}
        </Button>
      </div>

      <Button
        type="button"
        size="icon"
        aria-label="Back to top"
        className="fixed bottom-6 right-6 z-40 size-11 rounded-full bg-black/80 text-white shadow-lg shadow-black/30 transition-all duration-150 hover:bg-black"
        onClick={scrollToTop}
      >
        <ArrowUp className="size-5" />
      </Button>
    </div>
  );
};

export default CharacterForm;

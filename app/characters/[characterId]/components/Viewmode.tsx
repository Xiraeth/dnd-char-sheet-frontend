import { VIEW_MODES } from "@/app/characters/[characterId]/constants";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ViewMode = "General" | "Combat" | "Spells" | "Notes" | null;

const ViewMode = ({
  viewMode,
  setViewMode,
}: {
  viewMode: ViewMode;
  setViewMode: (viewMode: ViewMode) => void;
}) => {
  return (
    <div className="sm:mt-6">
      <Select
        value={viewMode || "General"}
        onValueChange={(value) => {
          setViewMode(value as ViewMode);
          localStorage.setItem("dnd-char-sheet-character-view-mode", value);
        }}
      >
        <SelectTrigger className="text-white font-mrEaves w-full mb-4 text-lg sm:text-xl bg-neutral-800 hover:bg-neutral-800/90 border border-white/40 transition-all duration-150">
          <SelectValue placeholder={`View mode (${viewMode})`} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup className="font-bookInsanity">
            {VIEW_MODES.map((mode) => (
              <SelectItem key={mode} value={mode}>
                {mode}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ViewMode;

import { VIEW_MODES } from "@/app/characters/[characterId]/constants";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type ViewMode = "General" | "Combat" | "Spells" | "Notes" | null;

const ViewMode = ({
  viewMode,
  setViewMode,
}: {
  viewMode: ViewMode;
  setViewMode: (viewMode: ViewMode) => void;
}) => {
  /**
   * Handles the view mode change for both Select and Tabs components
   * Syncs the selected view mode to localStorage
   */
  const handleViewModeChange = (value: string) => {
    setViewMode(value as ViewMode);
    localStorage.setItem("dnd-char-sheet-character-view-mode", value);
  };

  return (
    <div className="sm:mt-6 sticky top-0 z-10">
      <div className="block mb-8">
        <Tabs
          value={viewMode || "General"}
          onValueChange={handleViewModeChange}
          className="w-full"
        >
          <TabsList className="w-full bg-neutral-800 border border-white/40 h-12">
            {VIEW_MODES.map((mode) => (
              <TabsTrigger
                key={mode}
                value={mode}
                className="flex-1 text-white font-mrEaves data-[state=active]:bg-neutral-700 data-[state=active]:text-white text-base sm:text-md md:text-lg"
              >
                {mode}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default ViewMode;

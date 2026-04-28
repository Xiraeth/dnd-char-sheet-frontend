import { Character } from "@/app/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";

const PersonalityCard = () => {
  const { register } = useFormContext<Character>();
  const backstoryTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const backstoryMeasurementTextareaRef = useRef<HTMLTextAreaElement | null>(
    null
  );
  const extraBackstoryTextareaHeight = 50;
  const {
    ref: backstoryRegisterRef,
    onChange: backstoryOnChange,
    ...backstoryRegister
  } = register("characterBackstory");

  const getBackstoryMeasurementTextarea = () => {
    if (backstoryMeasurementTextareaRef.current) {
      return backstoryMeasurementTextareaRef.current;
    }

    const measurementTextarea = document.createElement("textarea");
    measurementTextarea.setAttribute("aria-hidden", "true");
    measurementTextarea.tabIndex = -1;
    measurementTextarea.style.position = "fixed";
    measurementTextarea.style.top = "0";
    measurementTextarea.style.left = "-9999px";
    measurementTextarea.style.visibility = "hidden";
    measurementTextarea.style.pointerEvents = "none";
    measurementTextarea.style.height = "auto";
    measurementTextarea.style.minHeight = "0";
    measurementTextarea.style.maxHeight = "none";
    measurementTextarea.style.overflow = "hidden";

    document.body.appendChild(measurementTextarea);
    backstoryMeasurementTextareaRef.current = measurementTextarea;

    return measurementTextarea;
  };

  /** Keep the backstory textarea tall enough to show its full contents. */
  const resizeBackstoryTextarea = () => {
    const textarea = backstoryTextareaRef.current;

    if (!textarea) {
      return;
    }

    const measurementTextarea = getBackstoryMeasurementTextarea();
    measurementTextarea.className = textarea.className;
    measurementTextarea.rows = textarea.rows;
    measurementTextarea.value = textarea.value;
    measurementTextarea.style.width = `${textarea.offsetWidth}px`;

    textarea.style.height = `${
      measurementTextarea.scrollHeight + extraBackstoryTextareaHeight
    }px`;
  };

  useEffect(() => {
    return () => {
      backstoryMeasurementTextareaRef.current?.remove();
      backstoryMeasurementTextareaRef.current = null;
    };
  }, []);

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
          <Textarea
            id="backstory"
            {...backstoryRegister}
            rows={10}
            ref={(element) => {
              backstoryRegisterRef(element);
              backstoryTextareaRef.current = element;
              requestAnimationFrame(resizeBackstoryTextarea);
            }}
            onChange={(event) => {
              backstoryOnChange(event);
              resizeBackstoryTextarea();
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalityCard;

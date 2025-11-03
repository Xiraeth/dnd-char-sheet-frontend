"use client";

import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SCROLL_THRESHOLD = 10;

const BackButton = ({
  url,
  onClick,
}: {
  url: string;
  onClick?: () => void;
}) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const eventListener = () => {
      if (window.scrollY > SCROLL_THRESHOLD) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", eventListener);

    return () => {
      window.removeEventListener("scroll", eventListener);
    };
  }, []);

  return (
    <div
      className={cn(
        "fixed top-0 left-0 m-2 cursor-pointer rounded-full p-2 hover:bg-white transition-all duration-150",
        isVisible ? "bg-white" : "bg-transparent"
      )}
    >
      <ArrowLeft
        className="size-8"
        onClick={() => {
          onClick?.();
          router.push(url);
        }}
      />
    </div>
  );
};

export default BackButton;

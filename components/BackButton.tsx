"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const BackButton = ({
  url,
  onClick,
}: {
  url: string;
  onClick?: () => void;
}) => {
  const router = useRouter();
  return (
    <div className="absolute top-0 left-0 m-2 cursor-pointer">
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

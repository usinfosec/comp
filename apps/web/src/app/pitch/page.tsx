import { PitchCarousel } from "@/app/components/pitch/pitch-carousel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pitch | Comp AI",
};

export default function Pitch() {
  return (
    <div className="fixed top-0 bottom-0 right-0 left-0 h-screen">
      <PitchCarousel />
    </div>
  );
}

"use client";

import Image from "next/image";
import { FC } from "react";
import { cn } from "@/lib/utils";

interface HeroProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}

const Hero: FC<HeroProps> = ({
  title = "ECON 1500",
  subtitle = "The China Growth Game",
  children,
  className,
}) => {
  return (
    <div
      className={cn("relative h-[50vh] w-full overflow-hidden md:h-[60vh] lg:h-[70vh]", className)}
    >
      {/* Hero Image */}
      <Image
        src="/hero/economy-hero.png"
        alt="Economics Hero"
        fill
        priority
        className="object-cover object-center"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
      />

      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col items-start justify-center bg-gradient-to-r from-black/70 to-transparent p-8 md:p-12 lg:p-16">
        <div className="max-w-2xl">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">{title}</h1>
          <p className="mb-8 text-xl text-gray-200 md:text-2xl">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Hero;

import Image from "next/image";

import cityNightLaptop from "@/assets/city-night-laptop.webp";

export default function Hero() {
  return (
    <section className="relative w-full aspect-video mb-12 border-2 border-solid border-contrast rounded-lg overflow-hidden">
      <Image
        src={cityNightLaptop.src}
        alt="City by night view with laptop"
        layout="fill"
        objectFit="cover"
        className="rounded-lg"
        priority
      />
      <span className="absolute top-0 left-0 w-full h-full bg-black/20"></span>
      <div
        className="absolute top-6 left-1/2 -translate-x-1/2 text-foreground font-bold uppercase w-80 text-pretty text-center text-2xl leading-normal h-auto">
        <span>Hi, I'm Pedro!</span>
        <span className="text-white block">Fullstack developer</span>.
      </div>
      <div className="absolute bottom-0 left-0">
        <button type="button"
          className="w-full px-4 py-2 flex items-center justify-center rounded-tr-2xl bg-contrast text-foreground font-bold uppercase shadow-lg"
        >
          Explore my work
        </button>
      </div>
    </section>
  );
}

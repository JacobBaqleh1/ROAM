import { useState, useEffect } from "react";

const slides = [
  { src: "/hero/brycecan.webp", src800: "/hero/brycecan-800.webp", text: "Utah", subText: "Bryce Canyon National Park" },
  { src: "/hero/yosemite2.webp", src800: "/hero/yosemite2-800.webp", text: "California", subText: "Yosemite National Park" },
  { src: "/hero/craterlake4.webp", src800: "/hero/craterlake4-800.webp", text: "Oregon", subText: "Crater Lake National Park" },
  { src: "/hero/chacopark4.webp", src800: "/hero/chacopark4-800.webp", text: "New Mexico", subText: "Chaco Culture National Historical Park" },
];

const HERO_WIDTH = 1200;
const HERO_HEIGHT = 720;

export default function AutoCarousel() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [loadedUrls, setLoadedUrls] = useState<Record<number, string>>({ 0: slides[0].src });

  const ensureLoaded = (i: number) => {
    setLoadedUrls((prev) => (prev[i] ? prev : { ...prev, [i]: slides[i].src }));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => {
          const next = (prev + 1) % slides.length;
          ensureLoaded(next);
          return next;
        });
        setFade(true);
      }, 500);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    ensureLoaded(index);
  }, [index]);

  useEffect(() => {
    const prefetchNext = () => ensureLoaded((index + 1) % slides.length);
    if (typeof requestIdleCallback === "function") {
      const id = requestIdleCallback(prefetchNext);
      return () => cancelIdleCallback(id);
    }
    const t = setTimeout(prefetchNext, 1500);
    return () => clearTimeout(t);
  }, [index]);

  const currentSrc = loadedUrls[index];

  return (
    <div className="relative w-full h-full overflow-hidden">
      {currentSrc && (
        <img
          src={currentSrc}
          srcSet={`${slides[index].src800} 800w, ${slides[index].src} 1200w`}
          sizes="100vw"
          alt={slides[index].subText}
          width={HERO_WIDTH}
          height={HERO_HEIGHT}
          loading="eager"
          decoding="async"
          fetchPriority={index === 0 ? "high" : "low"}
          data-darkreader-ignore
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            fade ? "opacity-90" : "opacity-0"
          }`}
        />
      )}

      <div className="flex flex-col absolute bottom-0 left-0 mb-4 z-10 ">
        <h1 className="text-white text-xl inline-block rounded-lg font-extrabold ">
          {slides[index].subText}
        </h1>
        <p className="text-white text-lg rounded-lg p-1 inline-block mt-2 font-extrabold ">
          {slides[index].text}
        </p>
      </div>
    </div>
  );
}

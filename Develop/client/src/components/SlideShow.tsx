import { useState, useEffect } from "react";
import utahImg from '../assets/brycecan.png';
import caliImg from '../assets/yosemite2.png';
import oregonImg from '../assets/craterlake4.png';
import newMexicoImg from '../assets/chacopark4.png';

const views = [
  { img: utahImg, text: "Discover Utah", subText: "Bryce Canyon National Park" },
  { img: caliImg, text: "Discover California", subText: "Yosemite National Park" },
  { img: oregonImg, text: "Discover Oregon", subText: "Crater Lake National Park" },
  { img: newMexicoImg, text: "Discover New Mexico", subText: "Chaco Culture National Historical Park" },
];

export default function AutoCarousel() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true); // Manage fade state

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // Start fading out
      setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % views.length); // Change image
        setFade(true); // Fade back in
      }, 500); // Match this to transition duration
    }, 6000); // Every 6 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Image with fade transition and Dark Reader ignore */}
      <img
        src={views[index].img}
        alt={views[index].text}
        data-darkreader-ignore
        className={`w-full h-full object-cover transition-opacity duration-1000 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      />
      
      {/* Text Overlay */}
      <div className="flex flex-col absolute bottom-0 left-0 p-4 z-10">
        <h1 className="text-white text-3xl px-4 py-2 inline-block bg-black/50 rounded-lg">
          {views[index].text}
        </h1>
        <p className="text-white text-lg px-4 py-2 rounded-lg inline-block mt-2 bg-black/50">
          {views[index].subText}
        </p>
      </div>
    </div>
  );
}

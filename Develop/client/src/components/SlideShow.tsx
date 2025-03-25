import { useState, useEffect } from "react";
import utahImg from '../assets/brycecan.png';
import caliImg from '../assets/yosemite2.png';
import oregonImg from '../assets/craterlake4.png';
import newMexicoImg from '../assets/chacopark4.png';

const views = [
  { img: utahImg, text: "Utah", subText: "Bryce Canyon National Park" },
  { img: caliImg, text: "California", subText: "Yosemite National Park" },
  { img: oregonImg, text: "Oregon", subText: "Crater Lake National Park" },
  { img: newMexicoImg, text: "New Mexico", subText: "Chaco Culture National Historical Park" },
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
        className={`w-full h-full object-cover transition-opacity duration-1000 ${fade ? "opacity-90" : "opacity-0"
          }`}
      />

      {/* Text Overlay */}
      <div className="flex flex-col absolute bottom-0 left-0 mb-4 z-10 ">
        <h1 className="text-white text-xl  inline-block rounded-lg font-extrabold ">
          {views[index].subText}
        </h1>
        <p className="text-white text-lg  rounded-lg p-1 inline-block mt-2 font-extrabold ">
          {views[index].text}
        </p>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import utahImg from '../assets/brycecan.png';
import caliImg from '../assets/yosemite.png'
import oregonImg from '../assets/craterlake.png';
import newMexicoImg from '../assets/chacopark.png'
const views = [
  { img: `url(${utahImg})`, text: "Discover Utah" },
  { img: `url(${caliImg})`, text: "Discover California" },
  { img: `url(${oregonImg})`, text: "Discover Oregon" },
  { img: `url(${newMexicoImg})`, text: "Discover New Mexico" },
];

export default function AutoCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % views.length);
    }, 3000); // Changes every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="absolute inset-0 w-full h-[70%] transition-all duration-500 bg-cover bg-center"
      style={{ backgroundImage: views[index].img }}
    >
      <h1 className="text-white text-3xl bg-black/50 px-4 py-2 rounded-lg">
        {views[index].text}
      </h1>
    </div>
  );
}

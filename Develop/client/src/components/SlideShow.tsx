import { useState, useEffect } from "react";
import utahImg from '../assets/brycecan.png';
import caliImg from '../assets/yosemite.png'
import oregonImg from '../assets/craterlake.png';
import newMexicoImg from '../assets/chacopark.png'
const views = [
  { img: `url(${utahImg})`, text: "Discover Utah", subText: "Bryce Canyon National Park" },
  { img: `url(${caliImg})`, text: "Discover California", subText: "Yosemite National Park" },
  { img: `url(${oregonImg})`, text: "Discover Oregon", subText:"Crater Lake National Park" },
  { img: `url(${newMexicoImg})`, text: "Discover New Mexico", subText:"Chaco Culture National Historical Park" },
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
      className="absolute inset-0 w-full transition-all duration-500 bg-cover bg-center"
      style={{ backgroundImage: views[index].img }}
    >
      <div className="flex flex-col absolute bottom-0 left-0  p-4  ">
        <h1 className="text-white text-3xl px-4 py-2  inline-block bg-black/50 rounded-lg">
          {views[index].text}
        </h1>
        <p className="text-white text-lg px-4 py-2 rounded-lg inline-block mt-2 bg-black/50">
          {views[index].subText}
        </p>
      </div>
    </div>
  );
}

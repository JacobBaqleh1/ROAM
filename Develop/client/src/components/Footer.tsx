import jakeImg from '../assets/jake.png';
import samImg from '../assets/sam.png';
import davidImg from '../assets/david.jpg';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 mb-8 ">
      <div className="container mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Meet the Devs</h2>
        <div className="flex flex-col md:flex-row justify-center gap-8">
          <div>
            <img
              src={samImg}
              alt="Sam"
              className="w-24 h-24 rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold">Sam</h3>
            {/* <p>
              <a href="https://github.com/sam" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                GitHub
              </a>
            </p>
            <p>
              <a href="https://linkedin.com/in/sam" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                LinkedIn
              </a>
            </p> */}
          </div>
          <div>
            <img
              src={davidImg}
              alt="David"
              className="w-24 h-24 rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold">David</h3>
            {/* <p>
              <a href="https://github.com/david" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                GitHub
              </a>
            </p>
            <p>
              <a href="https://linkedin.com/in/david" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                LinkedIn
              </a>
            </p> */}
          </div>

          <div>
            <img
              src={jakeImg}
              alt="Jacob"
              className="w-24 h-24 rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold">Jacob</h3>
            {/* <p>
              <a href="https://github.com/jacob" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                GitHub
              </a>
            </p>
            <p>
              <a href="https://linkedin.com/in/jacob" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                LinkedIn
              </a>
            </p> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
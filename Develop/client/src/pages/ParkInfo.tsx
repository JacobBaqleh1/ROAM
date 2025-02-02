import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchParkById } from '../utils/API';

const ParkDetails = () => {
  const { id } = useParams();
  
  const [park, setPark] = useState<any>(null);

  useEffect(() => {
 console.log("Current park ID:", id);
    if (!id) return;
setPark(null);
 console.log("Current park ID:", id);
    const getParkDetails = async () => {
      const data = await fetchParkById(id);
      console.log("Fetched park data:", data);
      setPark(data);
    };

    getParkDetails();
  }, [id]);

  if (!park) return <p>Loading park details...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">{park.fullName}</h1>
      <p className="text-gray-700">{park.description}</p>
      {park.images?.length > 0 && <img
      className='w-86 h-86'
       src={park.images[0].url} alt={park.fullName} />}
      <a href={park.url} target="_blank" className="text-blue-500">Official Website</a>
      <button className='border border-black'>ADD TO TRAVEL LIST</button>
      <button className='border border-black'>Leave a REVIEW</button>
         <div className="border border-gray-300 rounded-lg shadow-lg p-4 max-w-md bg-white">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div>
          <h3 className="text-lg font-semibold">John Doe</h3>
          <p className="text-sm text-gray-500">Verified Reviewer</p>
        </div>
      </div>
      <p className="mt-3 text-gray-700">
        "This park was absolutely amazing! The views were breathtaking, and the trails were well-maintained."
      </p>
      <div className="mt-2 flex space-x-1 text-yellow-400">
        ⭐⭐⭐⭐⭐
      </div>
    </div>
    </div>
  );
};

export default ParkDetails;

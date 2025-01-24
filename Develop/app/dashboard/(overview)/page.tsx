import {fetchParks} from '@/app/lib/fetch'
import Image from 'next/image'
export default async function Page() {



  const response = await fetchParks();
 

  const allParks = response?.data || [];

  if (!allParks || allParks.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>;
  }

 const firstPark = allParks[0];
  const firstImage = firstPark?.images?.[0]?.url || null;

    return(
    <div>
    <p>Dashboard Page</p>

  {firstImage ? (
        <img
          src={firstImage}
          alt={firstPark?.name || 'Park image'}
          width={500}
          height={300}
        />
      ) : (
        <p className="text-gray-500">No image available for this park.</p>
      )}

    </div>
   )
    
  };
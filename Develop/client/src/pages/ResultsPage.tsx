import { useLocation, Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { SAVE_PARK } from '../utils/mutations';
import { QUERY_ME } from '../utils/queries';

const ResultsPage = () => {
  const location = useLocation();
  const parks = location.state?.parks || [];

  // GraphQL Mutation for saving parks
  const [saveParkMutation, { error }] = useMutation(SAVE_PARK, {
    refetchQueries: [{ query: QUERY_ME }], // Refresh user's saved parks after mutation
  });

  const handleSavePark = async (park: any) => {
    try {
      await saveParkMutation({
        variables: {
          input: {
            parkId: park.id,
            fullName: park.fullName,
            description: park.description,
            states: park.states,
            images: park.images?.map((image: any) => ({
              credit: image.credit,
              title: image.title,
              altText: image.altText,
              caption: image.caption,
              url: image.url,
            })) || [],
          },
        },
      });
    } catch (err) {
      console.error('Error saving park:', err);
    }
  };

  return (
    <div>
      <h1>Search Results</h1>

      {parks.length === 0 ? (
        <p>No parks found.</p>
      ) : (
        <div>
          {parks.map((park:any) => (
             <div className="bg-white border border-gray-200 rounded-lg shadow-lg flex " key={park.id}>
                <Link to={`/park/${park.id}`} className='flex  ' style={{ textDecoration: 'none', color: 'inherit' }} >
                {park.images?.length > 0 ? (
                  <img
                    src={park.images[0].url}
                    alt={`Image of ${park.fullName}`}
                    className="max-w-[20rem] min-w-[20rem] max-h-[30rem] object-cover rounded-t-lg "
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-t-lg">
                    <span className="text-gray-500">No Image Available</span>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{park.fullName}</h3>
                  <p className="text-sm text-gray-500">Location: {park.states}</p>
                  <p className="mt-2 text-gray-700">{park.description}</p>
                  <div className="mt-4 space-y-2">
                  
                   
                  </div>
                </div>
                </Link>
                <section className=''>
                 <button
                      className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                      onClick={() => handleSavePark(park)}
                    >
                      Add to Travel List
                    </button>
                    <button className='w-full bg-black text-white py-2 rounded hover:bg-green-600'>
                      directions
                    </button>
                    </section>
              </div>
          ))}
        </div>
      )}

      {error && <p style={{ color: 'red' }}>Error saving park.</p>}
    </div>
  );
};

export default ResultsPage;

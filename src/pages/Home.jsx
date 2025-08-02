import { useEffect, useState } from 'react';
import LocationCard from '../components/LocationCard';
import SearchForm from '../components/SearchForm';

export default function Home({ user, fetchUser }) {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:4000/locations`)
      .then(res => res.json())
      .then(data => {
        setLocations(data);
        setFilteredLocations(data);
      })
      .catch(err => console.error(err));

    if (fetchUser) fetchUser();
  }, []);

  const handleDelete = async (id) => {
    const res = await fetch(`http://localhost:4000/locations/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      const updated = locations.filter(loc => loc._id !== id);
      setLocations(updated);
      setFilteredLocations(updated);
    } else {
      console.error('Failed to delete location');
    }
  };

  const handleSearch = (query) => {
    const lower = query.toLowerCase();
    const result = locations.filter(loc =>
      loc.location.toLowerCase().includes(lower)
    );
    setFilteredLocations(result);
  };

  return (
    <div className="container py-4" style={{ maxWidth: '960px' }}>
      <h1 className="mb-4 text-center">All Locations</h1>

      <div className="d-flex justify-content-center mb-5">
        <div style={{ width: '600px', maxWidth: '100%' }}>
          <SearchForm onSearch={handleSearch} />
        </div>
      </div>

      {filteredLocations.length === 0 ? (
        <p className="text-center">No matching results.</p>
      ) : (
        <div className="row">
          {filteredLocations.map(loc => (
            <div key={loc._id} className="col-md-6 mb-4 d-flex align-items-stretch">
              <LocationCard
                location={loc}
                user={user}
                onDelete={handleDelete}
                showDelete={user && user.isAdmin}
                refreshUser={fetchUser}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

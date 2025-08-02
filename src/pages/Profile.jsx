import { useEffect, useState } from 'react';
import LocationCard from '../components/LocationCard';

export default function Profile({ user, fetchUser }) {
  const [savedLocations, setSavedLocations] = useState([]);

  useEffect(() => {
    if (user?.savedLocations) {
      setSavedLocations(user.savedLocations);
    } else {
      setSavedLocations([]);
    }
  }, [user]);

  if (!user) return <p className="text-center mt-4">Please log in to view your profile.</p>;

  return (
    <div className="container py-4" style={{ maxWidth: '900px' }}>
      <h2 className="mb-4 text-center">{user.username}'s Profile</h2>

      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      </div>

      <h4 className="mb-3">Saved Locations</h4>

      {savedLocations.length === 0 ? (
        <p className="text-muted">No saved locations yet.</p>
      ) : (
        <div className="row">
          {savedLocations.map(location => (
            <div key={location._id || location.id} className="col-md-6 mb-4">
              <LocationCard
                location={location}
                user={user}
                refreshUser={fetchUser} 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

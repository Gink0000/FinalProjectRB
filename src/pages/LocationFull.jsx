import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function LocationFull({ user, refreshUser }) {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [location, setLocation] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  const GoogleAPI = import.meta.env.VITE_GOOGLE_API;

  useEffect(() => {
    fetch(`http://localhost:4000/Locations/${id}`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setLocation(data))
      .catch(err => console.error(err));
  }, [id]);

  useEffect(() => {
    if (user && user.savedLocations && location) {
      const match = user.savedLocations.some(
        (loc) => loc._id === location._id || loc === location._id
      );
      setIsSaved(match);
    } else {
      setIsSaved(false);
    }
  }, [user, location]);

  const handleToggleSave = async () => {
    if (!user) {
      alert('You must be logged in to save locations.');
      return;
    }
    const url = `http://localhost:4000/api/auth/save-location/${location._id}`;
    const method = isSaved ? 'DELETE' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        credentials: 'include',
      });

      if (res.ok) {
        if (refreshUser) {
          await refreshUser();
        }
      } else {
        console.error('Failed to save/unsave location');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async () => {
    try {
      const res = await fetch(`http://localhost:4000/locations/${location._id}/approve`, {
        method: 'PATCH',
        credentials: 'include',
      });
      if (res.ok) {
        navigate('/pendingLocations'); 
      } else {
        console.error('Failed to approve location');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDisapprove = async () => {
    try {
      const res = await fetch(`http://localhost:4000/locations/${location._id}/reject`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        navigate('/pendingLocations');
      } else {
        console.error('Failed to disapprove location');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!location) return <p className="text-center">Loading location...</p>;

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-6 mb-4">
          {location.imageUrl && (
            <img
              src={`http://localhost:4000/uploads/${location.imageUrl}`}
              alt={location.location}
              className="img-fluid rounded shadow"
            />
          )}
        </div>
        <div className="col-md-6">
          <h1>{location.location}</h1>
          <p><strong>Country:</strong> {location.country}</p>
          <p><strong>Province/State:</strong> {location.provinceOrState}</p>
          <p><strong>Description:</strong> {location.description}</p>
          <p><strong>Latitude:</strong> {location.latitude}</p>
          <p><strong>Longitude:</strong> {location.longitude}</p>
          {user && (
            <> 
              <button onClick={handleToggleSave} className={`btn ${isSaved ? 'btn-secondary' : 'btn-primary'} mt-3 me-2`}>{isSaved ? 'Unsave' : 'Save'}
              </button>
              {user.isAdmin && (
                <>
                  <button onClick={handleApprove}className="btn btn-success mt-3 me-2">
                    Approve
                  </button>
                  <button onClick={handleDisapprove} className="btn btn-danger mt-3">
                    Disapprove
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
      <div className="mt-5">
        <h3>Map</h3>
        <div className="ratio ratio-16x9">
          <iframe
            title={`Map of ${location.location}`}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps/embed/v1/view?key=${GoogleAPI}&center=${location.latitude},${location.longitude}&zoom=12`}
          ></iframe>
        </div>
      </div>
    </div>
  );
}

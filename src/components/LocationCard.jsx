import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function LocationCard({location,user,onDelete,showDelete,refreshUser,onApprove, onDisapprove,showApproveButton}) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (user && user.savedLocations) {
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
  return (
    <div className="card mb-3" style={{ maxWidth: '540px' }}>
      <div className="row g-0">
        {location.imageUrl && (
          <div className="col-md-4">
            <img
              src={`http://localhost:4000/uploads/${location.imageUrl}`}
              alt={location.location}
              className="img-fluid rounded-start"
              style={{ height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">
              <Link to={`/location/${location._id}`} className="text-decoration-none">{location.location}</Link>
            </h5>
            <p className="card-text">{location.provinceOrState}, {location.country}</p>
            <p className="card-text">
              {location.description.length > 100
                ? location.description.substring(0, 100) + '...'
                : location.description}
            </p>
            {user && (
              <button onClick={handleToggleSave}className={`btn ${isSaved ? 'btn-secondary' : 'btn-primary'} me-2`}>{isSaved ? 'Unsave' : 'Save'}</button>
            )}
            {showDelete && (
              <button onClick={() => onDelete(location._id)}className="btn btn-danger me-2">
                Delete
              </button>
            )}
            {showApproveButton && (
              <>
                <button onClick={() => onApprove(location._id)}className="btn btn-success me-2">
                  Approve
                </button>
                <button onClick={() => onDisapprove(location._id)}className="btn btn-danger"
                  >
                  Disapprove
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

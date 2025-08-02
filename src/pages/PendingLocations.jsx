import { useEffect, useState } from 'react';
import LocationCard from '../components/LocationCard';

export default function PendingLocations({ user }) {
  const [pendingLocations, setPendingLocations] = useState([]);

  useEffect(() => {
    const fetchPending = async () => {
      const res = await fetch('http://localhost:4000/locations/pending/all', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setPendingLocations(data);
      } else {
        console.error('Failed to load pending locations');
      }
    };
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    const res = await fetch(`http://localhost:4000/locations/${id}/approve`, {
      method: 'PATCH',
      credentials: 'include',
    });
    if (res.ok) {
      setPendingLocations(pendingLocations.filter((loc) => loc._id !== id));
    } else {
      console.error('Failed to approve');
    }
  };

  const handleDisapprove = async (id) => {
    const res = await fetch(`http://localhost:4000/locations/${id}/reject`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      setPendingLocations(pendingLocations.filter((loc) => loc._id !== id));
    } else {
      console.error('Failed to disapprove/reject');
    }
  };

  return (
    <div>
      <h1>Pending Locations</h1>

      {pendingLocations.length === 0 ? (
        <p>No pending locations</p>
      ) : (
        pendingLocations.map((loc) => (
          <LocationCard
            key={loc._id}
            location={loc}
            user={user}
            onApprove={handleApprove}
            onDisapprove={handleDisapprove}
            showApproveButton={user && user.isAdmin}
          />
        ))
      )}
    </div>
  );
}

import { useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 50,
  lng: 0
};

export default function SubmitForm({ apiKey, onAdd }) {
  const [formData, setFormData] = useState({
    location: '',
    country: '',
    provinceOrState: '',
    description: '',
    latitude: '',
    longitude: ''
  });

  const [image, setImage] = useState(null);    
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey
  });

  const handleChange = (e) => {    
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]); 
  };
    
  const handleMapClick = (event) => {
    const lat = event.latLng.lat();  
    const lng = event.latLng.lng(); 
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng   
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append('location', formData.location);
    payload.append('country', formData.country);
    payload.append('provinceOrState', formData.provinceOrState);
    payload.append('description', formData.description);
    payload.append('latitude', formData.latitude);
    payload.append('longitude', formData.longitude);
    if (image) {
      payload.append('image', image);
    }
    try {
      const res = await fetch('http://localhost:4000/locations', {
        method: 'POST',
        credentials: 'include',
        body: payload
      });

      if (res.ok) {
        const newLocation = await res.json();
        if (onAdd) onAdd(newLocation);  
        setFormData({
          location: '',
          country: '',
          provinceOrState: '',
          description: '',
          latitude: '',  
          longitude: ''
        });
        setImage(null);
      } else {
        console.error('Failed to add location');   
      }
    } catch (err) {
      console.error(err);  
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: '800px' }}>  
      <h2 className="mb-4 text-center">Add a Location</h2>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="mb-3">  
          <label className="form-label">Location Name</label>
          <input
            type="text"
            name="location"
            className="form-control"
            placeholder="Enter location name"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Country</label>
          <input
            type="text"
            name="country"
            className="form-control"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Province or State</label>  
          <input
            type="text"  
            name="provinceOrState"
            className="form-control"
            placeholder="Province or State"
            value={formData.provinceOrState}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            rows="4"
            placeholder="Write a description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={handleFileChange}
            required
          />
        </div>

        <div className="mb-3">
          <strong>Click on the map to set Latitude & Longitude:</strong>
          {isLoaded && (
            <div className="mt-2">
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={4}
                onClick={handleMapClick}
              >
                {formData.latitude && formData.longitude && (
                  <Marker
                    position={{
                      lat: parseFloat(formData.latitude),
                      lng: parseFloat(formData.longitude)
                    }}
                  />
                )}
              </GoogleMap>
            </div>
          )}
        </div>

        <div className="mb-3">
          <p><strong>Latitude:</strong> {formData.latitude}</p>
          <p><strong>Longitude:</strong> {formData.longitude}</p>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Add Location
        </button>
      </form>
    </div>
  );
}

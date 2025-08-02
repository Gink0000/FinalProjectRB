import SubmitForm from '../components/SubmitForm';

export default function AddLocations() {
  const GOOGLE_API = import.meta.env.VITE_GOOGLE_API;
  return (
    <div>
      <h1>Add a New Location</h1>
      <SubmitForm apiKey={GOOGLE_API} />
    </div>
  );
}
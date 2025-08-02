export default function SearchForm({ onSearch }) {
  return (
    <form onSubmit={e => e.preventDefault()}>
      <input
        type="text"
        placeholder="Search by location name..."
        onChange={e => onSearch(e.target.value)}
        className="form-control form-control-lg"
        style={{ width: '100%' }}
      />
    </form>
  );
}

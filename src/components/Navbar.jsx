import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">Home</Link>

        <ul className="navbar-nav d-flex flex-row gap-2 ms-auto mb-2 mb-lg-0">
          {!user ? (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link px-2">Login</Link>
              </li>  
              <li className="nav-item">
                <Link to="/signup" className="nav-link px-2">Signup</Link>
              </li>
            </>
          ) : (
            <>
              {user.isAdmin && (
                <li className="nav-item">
                  <Link to="/pendingLocations" className="nav-link px-2">Pending</Link>
                </li>
              )}
              <li className="nav-item">
                <Link to="/profile" className="nav-link px-2">Profile</Link>
              </li>
              <li className="nav-item">
                <Link to="/AddLocation" className="nav-link px-2">Add Location</Link>
              </li>
              <li className="nav-item">
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-light btn-sm ms-2">
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

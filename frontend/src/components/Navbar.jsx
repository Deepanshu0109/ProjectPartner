import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate("/"); // Go to landing after logout
  };

  return (
    <nav className="navbar">
      <h1 className="logo">ProjectPartner</h1>
      <div className="nav-links">
        {/* Home should go to dashboard if logged in */}
        <Link to={isLoggedIn ? "/dashboard" : "/"} className="navs">Home</Link>

        {isLoggedIn ? (
          <>
            <Link to="/projects" className="navs">Projects</Link>
            <Link to="/profile" className="navs">Profile</Link>
            <button onClick={handleLogoutClick}>Logout</button>
          </>
        ) : (
          <Link to="/login" className="login-btn">Login | Register</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

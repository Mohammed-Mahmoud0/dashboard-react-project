import { Outlet, useNavigate, Link } from "react-router-dom";

function AppLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  return (
    <div className="container-fluid" style={{ backgroundColor: '#1a1a1a', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center p-3" style={{ backgroundColor: '#0d1117', borderBottom: '1px solid #30363d' }}>
        <div className="d-flex align-items-center">
          <Link to="/dashboard" className="text-white text-decoration-none">
            <h2 className="m-0">Dashboard App</h2>
          </Link>
        </div>
        <div className="d-flex gap-3 align-items-center ">
          <Link to="/dashboard" className="text-white text-decoration-none px-2 py-1 rounded nav-link-hover">Home</Link>
          <Link to="/dashboard/users" className="text-white text-decoration-none px-2 py-1 rounded nav-link-hover">Users</Link>
          <Link to="/dashboard/notes" className="text-white text-decoration-none px-2 py-1 rounded nav-link-hover">Notes</Link>
          <Link to="/dashboard/analytics" className="text-white text-decoration-none px-2 py-1 rounded nav-link-hover">Analytics</Link>
          <Link to="/dashboard/weather" className="text-white text-decoration-none px-2 py-1 rounded nav-link-hover">Weather</Link>
          <button 
            type="button" 
            className="btn btn-outline-danger"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
      
      <div className="container-fluid" style={{ backgroundColor: '#1a1a1a' }}>
        <Outlet />
      </div>
    </div>
  );
}

export default AppLayout;
import { Outlet, useNavigate } from "react-router-dom";

function AppLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center p-3 bg-dark">
        <h2 className="text-white m-0">My App</h2>
        <button 
          type="button" 
          className="btn btn-danger"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      

      <div className="container mt-4">
        <Outlet />
      </div>
    </div>
  );
}

export default AppLayout;
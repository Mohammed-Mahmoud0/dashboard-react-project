import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="container-fluid py-4" style={{ backgroundColor: '#1a1a1a', minHeight: '100vh', color: '#ffffff' }}>
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4 text-white">Dashboard</h1>
        </div>
      </div>
      
      <div className="row g-4">
        <div className="col-lg-6 col-md-12">
          <div className="card h-100 dark-card">
            <div className="card-body">
              <h5 className="card-title text-white">User & Posts Manager</h5>
              <p className="card-text text-light">Manage users and their posts</p>
              <Link to="/dashboard/users" className="btn btn-primary">View Users</Link>
            </div>
          </div>
        </div>

        <div className="col-lg-6 col-md-12">
          <div className="card h-100 dark-card">
            <div className="card-body">
              <h5 className="card-title text-white">Note Manager</h5>
              <p className="card-text text-light">Create and organize your notes</p>
              <Link to="/dashboard/notes" className="btn btn-success">Manage Notes</Link>
            </div>
          </div>
        </div>

        <div className="col-lg-6 col-md-12">
          <div className="card h-100 dark-card">
            <div className="card-body">
              <h5 className="card-title text-white">Simple Analytics</h5>
              <p className="card-text text-light">View user statistics and summaries</p>
              <Link to="/dashboard/analytics" className="btn btn-info">View Analytics</Link>
            </div>
          </div>
        </div>

        <div className="col-lg-6 col-md-12">
          <div className="card h-100 dark-card">
            <div className="card-body">
              <h5 className="card-title text-white">Weather Widget</h5>
              <p className="card-text text-light">Check current weather conditions</p>
              <Link to="/dashboard/weather" className="btn btn-warning">Check Weather</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
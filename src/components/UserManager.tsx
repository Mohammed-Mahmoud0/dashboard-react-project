import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}

function UserManager() {
  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      return response.json();
    },
  });

  return (
    <div className="container-fluid py-4 user-manager-dark">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1">User & Posts Manager</h2>
              <p className="text-light mb-0">Manage users, their posts and todos</p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                refetch();
                console.log("Refreshing users...");
              }}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Refresh Users"}
            </button>
          </div>

          {isLoading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-light">Loading users...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-danger">
              <strong>Error:</strong> {error.message}
            </div>
          )}

          {users && (
            <div className="row">
              {users.map((user) => (
                <div key={user.id} className="col-xl-4 col-lg-6 col-md-6 mb-4">
                  <div className="card h-100 dark-card">
                    <div className="card-body">
                      <h5 className="card-title text-white">{user.name}</h5>
                      <p className="card-text text-light">
                        <strong>Username:</strong> {user.username}<br />
                        <strong>Email:</strong> {user.email}<br />
                        <strong>Phone:</strong> {user.phone}
                      </p>
                      <Link 
                        to={`/dashboard/users/${user.id}`} 
                        className="btn btn-primary"
                      >
                        View Details & Posts
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {users && users.length === 0 && (
            <div className="text-center py-5">
              <div className="alert alert-info">
                <h4>No users found</h4>
                <p>There are currently no users to display.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserManager;
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

function Users() {
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
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 bg-dark p-3 rounded">
        <h1>Users</h1>
        <button
          className="btn btn-primary"
          onClick={() => {refetch();console.log("refetching...");}}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Refresh Users"}
        </button>
      </div>

      {isLoading && (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          Error loading users: {error.message}
        </div>
      )}

      {users && (
        <div className="row">
          {users.map((user) => (
            <div key={user.id} className="col-md-6 col-lg-4 mb-3">
              <div className="card h-100 bg-dark text-white">
                <div className="card-body">
                  <h5 className="card-title">{user.name}</h5>
                  <p className="card-text">
                    <strong>Username:</strong> {user.username}
                    <br />
                    <strong>Email:</strong> {user.email}
                  </p>
                  <Link to={`/users/${user.id}`} className="btn btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {users && users.length === 0 && (
        <div className="alert alert-info">No users found.</div>
      )}
    </div>
  );
}

export default Users;

import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

function UserDetails() {
  const { id } = useParams<{ id: string }>();
  const userId = parseInt(id || '0');

  const { 
    data: user, 
    isLoading: userLoading, 
    error: userError 
  } = useQuery<User>({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      console.log("herrrrrrrrrrrrrrrre");
      return response.json();
    },
    enabled: userId > 0,
  });

  const { 
    data: posts, 
    isLoading: postsLoading, 
    error: postsError 
  } = useQuery<Post[]>({
    queryKey: ['posts', userId],
    queryFn: async () => {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      console.log("fetching posts");
      return response.json();

    },
    enabled: userId > 0, 
  });


  if (userLoading) {
    return <div className="text-center">Loading user...</div>;
  }


  if (userError) {
    return (
      <div className="alert alert-danger">
        Error loading user: {userError.message}
      </div>
    );
  }

  if (!user) {
    return <div className="alert alert-warning">User not found</div>;
  }

  return (
    <div>
   
      <Link to="/users" className="btn btn-secondary mb-3">
        ← Back to Users
      </Link>

      <div className="card mb-4 bg-dark text-white">
        <div className="card-header bg-dark text-white">
          <h2>User Details</h2>
        </div>
        <div className="card-body bg-dark text-white">
          <h4>{user.name}</h4>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      </div>

      <div className="card bg-dark text-white">
        <div className="card-header bg-dark text-white">
          <h3>Posts by {user.name}</h3>
        </div>
        <div className="card-body bg-dark text-white">
          {postsLoading && <div>Loading posts...</div>}
          
          {postsError && (
            <div className="alert alert-danger">
              Error loading posts: {postsError.message}
            </div>
          )}
          
          {posts && posts.length === 0 && (
            <p>This user has no posts.</p>
          )}
          
          {posts && posts.length > 0 && (
            <div className="row bg-dark text-white">
              {posts.map((post) => (
                <div key={post.id} className="col-md-6 mb-3">
                  <div className="card bg-dark text-white">
                    <div className="card-body bg-dark text-white ">
                      <h5 className="card-title bg-dark text-white">{post.title}</h5>
                      <p className="card-text bg-dark text-white">{post.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDetails;
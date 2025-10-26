import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

function Analytics() {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [usersResponse, postsResponse, todosResponse] = await Promise.all(
          [
            fetch("https://jsonplaceholder.typicode.com/users"),
            fetch("https://jsonplaceholder.typicode.com/posts"),
            fetch("https://jsonplaceholder.typicode.com/todos"),
          ]
        );

        if (!usersResponse.ok || !postsResponse.ok || !todosResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const [usersData, postsData, todosData] = await Promise.all([
          usersResponse.json(),
          postsResponse.json(),
          todosResponse.json(),
        ]);

        setUsers(usersData);
        setPosts(postsData);
        setTodos(todosData);
      } catch (err) {
        setError("Error loading analytics data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateStats = () => {
    if (users.length === 0 || posts.length === 0 || todos.length === 0) {
      return null;
    }

    const postCounts = users.map((user) => ({
      ...user,
      postCount: posts.filter((post) => post.userId === user.id).length,
    }));

    const todoCounts = users.map((user) => ({
      ...user,
      completedTodos: todos.filter(
        (todo) => todo.userId === user.id && todo.completed
      ).length,
    }));

    const mostPosts = postCounts.reduce((max, user) =>
      user.postCount > max.postCount ? user : max
    );
    const fewestPosts = postCounts.reduce((min, user) =>
      user.postCount < min.postCount ? user : min
    );
    const mostCompletedTodos = todoCounts.reduce((max, user) =>
      user.completedTodos > max.completedTodos ? user : max
    );
    const fewestCompletedTodos = todoCounts.reduce((min, user) =>
      user.completedTodos < min.completedTodos ? user : min
    );

    return {
      totalUsers: users.length,
      mostPosts,
      fewestPosts,
      mostCompletedTodos,
      fewestCompletedTodos,
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <h2 className="text-white mb-4">📊 Simple Analytics</h2>
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-light mt-2">Loading analytics data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <h2 className="text-white mb-4">📊 Simple Analytics</h2>
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <h2 className="text-white mb-4">📊 Simple Analytics</h2>

          {stats && (
            <>
              <div className="row mb-4">
                <div className="col-12">
                  <div className="card dark-card">
                    <div className="card-body text-center">
                      <h3 className="text-white mb-2">👥 Total Users</h3>
                      <div className="display-4 text-primary fw-bold">
                        {stats.totalUsers}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="card dark-card h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        <div className="p-2 bg-success rounded me-3">
                          <span className="text-white">📈</span>
                        </div>
                        <h5 className="text-white mb-0">Most Posts</h5>
                      </div>
                      <div className="ps-5">
                        <p className="text-light mb-1">
                          <strong>{stats.mostPosts.username}</strong>
                        </p>
                        <p className="text-secondary mb-0">
                          {stats.mostPosts.postCount} posts
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 mb-4">
                  <div className="card dark-card h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        <div className="p-2 bg-warning rounded me-3">
                          <span className="text-dark">📉</span>
                        </div>
                        <h5 className="text-white mb-0">Fewest Posts</h5>
                      </div>
                      <div className="ps-5">
                        <p className="text-light mb-1">
                          <strong>{stats.fewestPosts.username}</strong>
                        </p>
                        <p className="text-secondary mb-0">
                          {stats.fewestPosts.postCount} posts
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 mb-4">
                  <div className="card dark-card h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        <div className="p-2 bg-primary rounded me-3">
                          <span className="text-white">✅</span>
                        </div>
                        <h5 className="text-white mb-0">
                          Most Completed Todos
                        </h5>
                      </div>
                      <div className="ps-5">
                        <p className="text-light mb-1">
                          <strong>{stats.mostCompletedTodos.username}</strong>
                        </p>
                        <p className="text-secondary mb-0">
                          {stats.mostCompletedTodos.completedTodos} completed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 mb-4">
                  <div className="card dark-card h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        <div className="p-2 bg-danger rounded me-3">
                          <span className="text-white">❌</span>
                        </div>
                        <h5 className="text-white mb-0">
                          Fewest Completed Todos
                        </h5>
                      </div>
                      <div className="ps-5">
                        <p className="text-light mb-1">
                          <strong>{stats.fewestCompletedTodos.username}</strong>
                        </p>
                        <p className="text-secondary mb-0">
                          {stats.fewestCompletedTodos.completedTodos} completed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;

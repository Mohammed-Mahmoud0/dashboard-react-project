import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  phone: string;
  website: string;
}

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

function UserDetails() {
  const { id } = useParams<{ id: string }>();
  const userId = parseInt(id || '0');
  
  const [todoStates, setTodoStates] = useState<{ [key: number]: boolean }>({});

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
      return response.json();
    },
    enabled: userId > 0, 
  });

  const { 
    data: todos, 
    isLoading: todosLoading, 
    error: todosError 
  } = useQuery<Todo[]>({
    queryKey: ['todos', userId],
    queryFn: async () => {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      return response.json();
    },
    enabled: userId > 0, 
  });

  useEffect(() => {
    if (todos) {
      const initialStates: { [key: number]: boolean } = {};
      todos.forEach(todo => {
        const storedState = localStorage.getItem(`todo-${todo.id}`);
        if (storedState !== null) {
          initialStates[todo.id] = storedState === 'true';
        } else {
          initialStates[todo.id] = todo.completed;
        }
      });
      setTodoStates(initialStates);
    }
  }, [todos]);

  const toggleTodo = (todoId: number) => {
    const newState = !todoStates[todoId];
    setTodoStates(prev => ({
      ...prev,
      [todoId]: newState
    }));
    localStorage.setItem(`todo-${todoId}`, newState.toString());
  };


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
    <div className="container-fluid py-4 user-manager-dark">
      <div className="row">
        <div className="col-12">
          <Link to="/dashboard/users" className="btn btn-secondary mb-4">
            ← Back to Users
          </Link>

          <div className="card mb-4 dark-card">
            <div className="card-header" style={{ backgroundColor: '#2d2d2d', borderBottom: '1px solid #404040' }}>
              <h2 className="text-white mb-0">User Details</h2>
            </div>
            <div className="card-body">
              <h4 className="text-white">{user.name}</h4>
              <div className="row">
                <div className="col-md-6">
                  <p className="text-light"><strong>Username:</strong> {user.username}</p>
                  <p className="text-light"><strong>Email:</strong> {user.email}</p>
                </div>
                <div className="col-md-6">
                  <p className="text-light"><strong>Phone:</strong> {user.phone}</p>
                  <p className="text-light"><strong>Website:</strong> {user.website}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-6 mb-4">
              <div className="card dark-card h-100">
                <div className="card-header" style={{ backgroundColor: '#2d2d2d', borderBottom: '1px solid #404040' }}>
                  <h3 className="text-white mb-0">Posts by {user.name}</h3>
                </div>
                <div className="card-body" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                  {postsLoading && (
                    <div className="text-center py-3">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2 text-light">Loading posts...</p>
                    </div>
                  )}
                  
                  {postsError && (
                    <div className="alert alert-danger">
                      Error loading posts: {postsError.message}
                    </div>
                  )}
                  
                  {posts && posts.length === 0 && (
                    <p className="text-light">This user has no posts.</p>
                  )}
                  
                  {posts && posts.length > 0 && (
                    <div>
                      {posts.map((post) => (
                        <div key={post.id} className="mb-3 p-3" style={{ backgroundColor: '#1a1a1a', borderRadius: '8px', border: '1px solid #404040' }}>
                          <h6 className="text-white">{post.title}</h6>
                          <p className="text-light mb-0 small">{post.body}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="card dark-card h-100">
                <div className="card-header" style={{ backgroundColor: '#2d2d2d', borderBottom: '1px solid #404040' }}>
                  <h3 className="text-white mb-0">To-dos by {user.name}</h3>
                </div>
                <div className="card-body" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                  {todosLoading && (
                    <div className="text-center py-3">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2 text-light">Loading todos...</p>
                    </div>
                  )}
                  
                  {todosError && (
                    <div className="alert alert-danger">
                      Error loading todos: {todosError.message}
                    </div>
                  )}
                  
                  {todos && todos.length === 0 && (
                    <p className="text-light">This user has no todos.</p>
                  )}
                  
                  {todos && todos.length > 0 && (
                    <div>
                      {todos.map((todo) => {
                        const isCompleted = todoStates[todo.id] || false;
                        return (
                          <div 
                            key={todo.id} 
                            className="d-flex align-items-center mb-2 p-2" 
                            style={{ 
                              backgroundColor: '#1a1a1a', 
                              borderRadius: '6px', 
                              border: '1px solid #404040',
                              cursor: 'pointer'
                            }}
                            onClick={() => toggleTodo(todo.id)}
                          >
                            <input
                              type="checkbox"
                              checked={isCompleted}
                              onChange={() => toggleTodo(todo.id)}
                              className="form-check-input me-3"
                              style={{ cursor: 'pointer' }}
                            />
                            <span 
                              className={`${isCompleted ? 'text-success' : 'text-light'}`}
                              style={{ 
                                textDecoration: isCompleted ? 'line-through' : 'none',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              {todo.title}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetails;
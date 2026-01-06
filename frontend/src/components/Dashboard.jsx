import { useEffect, useState } from "react";
import API from "../API/api.js"
import { useAuth } from "../context/AuthContext";
import './Dashboard.css'
import './Button.css'

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.log(err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    
    setSubmitting(true);
    try {
      const res = await API.post("/tasks", form);
      setTasks((prev) => [res.data, ...prev]);
      setForm({ title: "", description: "" });
    } catch (err) {
      console.log(err.response?.data);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";

    try {
      const res = await API.put(`/tasks/${task._id}`, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? res.data : t))
      );
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await API.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const completedTasks = tasks.filter(task => task.status === 'completed');
  const pendingTasks = tasks.filter(task => task.status === 'pending');

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="welcome-text">Welcome back, {user?.name}! </h1>
          <button className="btn btn-danger" onClick={logout}>
            Sign Out
          </button>
        </div>

        {/* Task Creation */}
        <div className="dashboard-card">
          <h2 className="card-title"> Create New Task</h2>
          <form className="task-form" onSubmit={handleCreate}>
            <div className="form-group">
              <input
                className="form-input"
                name="title"
                placeholder="Task title..."
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                className="form-input"
                name="description"
                placeholder="Task description (optional)..."
                value={form.description}
                onChange={handleChange}
              />
            </div>
            <button 
              className="btn btn-primary" 
              type="submit"
              disabled={submitting || !form.title.trim()}
            >
              {submitting ? (
                <>
                  <span className="loading"></span>
                  Adding...
                </>
              ) : (
                '+ Add Task'
              )}
            </button>
          </form>
        </div>

        {/* Task Statistics */}
        {tasks.length > 0 && (
          <div className="dashboard-card">
            <h2 className="card-title">📊 Task Overview</h2>
            <div className="task-stats">
              <div className="stat-card">
                <div className="stat-number total">{tasks.length}</div>
                <div className="stat-label">Total Tasks</div>
              </div>
              <div className="stat-card">
                <div className="stat-number completed">{completedTasks.length}</div>
                <div className="stat-label">Completed</div>
              </div>
              <div className="stat-card">
                <div className="stat-number pending">{pendingTasks.length}</div>
                <div className="stat-label">Pending</div>
              </div>
            </div>
          </div>
        )}

        {/* Tasks List */}
        <div className="dashboard-card">
          <h2 className="card-title">📋 Your Tasks</h2>
          
          {loading ? (
            <div className="loading-container">
              <span className="loading"></span>
              Loading your tasks...
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <div className="empty-state-text">No tasks yet</div>
              <p className="empty-state-description">Create your first task above to get started!</p>
            </div>
          ) : (
            <ul className="task-list">
              {tasks.map((task) => (
                <li key={task._id} className={`task-item ${task.status}`}>
                  <div className="task-content">
                    <div className="task-title">{task.title}</div>
                    {task.description && (
                      <div className="task-description">{task.description}</div>
                    )}
                    <div className="task-status">
                      {task.status === 'completed' ? '✅' : '⏳'} 
                      {task.status === 'completed' ? 'Completed' : 'Pending'}
                    </div>
                  </div>
                  <div className="task-actions">
                    <button 
                      className={`btn btn-small ${
                        task.status === 'completed' ? 'btn-secondary' : 'btn-primary'
                      }`}
                      onClick={() => handleToggleStatus(task)}
                    >
                      {task.status === "completed" ? "↩️ Reopen" : "✅ Complete"}
                    </button>
                    <button 
                      className="btn btn-small btn-danger"
                      onClick={() => handleDelete(task._id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

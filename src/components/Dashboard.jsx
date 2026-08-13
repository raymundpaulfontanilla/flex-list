import styles from "./dashboard.module.css";
import { useFetch } from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Dashboard() {
  const { errors, isLoading, tasks, createTask, updateTask, deleteTask } =
    useFetch();
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");

  useEffect(() => {
    if (errors) {
      navigate("/login");
    } else {
      const storedName = localStorage.getItem("name");
      if (storedName && storedName.length > 0) {
        const storedNameUpperFirst = storedName.charAt(0).toUpperCase();
        const restOfName = storedName.slice(1).toLowerCase();
        setUserName(storedNameUpperFirst + restOfName);
      }
    }
  }, [errors, navigate]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    await createTask(newTaskTitle);
    setNewTaskTitle("");
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setEditTaskTitle(task.title);
    setIsModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editTaskTitle.trim() || !editingTask) return;

    const result = await updateTask(editingTask.id, editTaskTitle);
    if (result.success) {
      setIsModalOpen(false);
      setEditingTask(null);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const pendingTasks = Array.isArray(tasks)
    ? tasks
        .filter(
          (task) => task && (task.is_completed == 0 || !task.is_completed),
        )
        .sort((a, b) => Number(a.display_order) - Number(b.display_order))
    : [];

  const completedTasks = Array.isArray(tasks)
    ? tasks
        .filter((task) => task && task.is_completed == 1)
        .sort((a, b) => Number(a.display_order) - Number(b.display_order))
    : [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h3 className={styles.title}>📋 My Tasks</h3>
          <div className={styles.userInfo}>
            <div>
              <div className={styles.welcomeText}>Welcome</div>
              <div className={styles.userName}>{userName}</div>
            </div>
            Logout
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Create new task..."
            className={styles.searchInput}
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <button type="submit" className={styles.searchButton}>
            Create
          </button>
        </form>
      </div>

      <div className={styles.tasksContainer}>
        <div className={`${styles.column} ${styles.pendingColumn}`}>
          <div className={styles.columnHeader}>
            <h4 className={styles.columnTitle}>📝 Pending Tasks</h4>
            <span className={`${styles.counter} ${styles.pendingCounter}`}>
              {pendingTasks.length}
            </span>
          </div>

          {pendingTasks.length > 0 ? (
            <div className={styles.tasksList}>
              {pendingTasks.map((task, index) => (
                <div
                  key={task.id || `pending-${index}`}
                  draggable
                  className={styles.taskCard}
                >
                  <div className={styles.taskContent}>
                    <div className={styles.taskDetails}>
                      <div className={styles.taskTitle}>{task.title}</div>
                      <div className={styles.taskMeta}>
                        Order: {task.display_order}
                      </div>
                    </div>
                    <div className={styles.taskActions}>
                      <button
                        className={styles.actionButton}
                        onClick={() => openEditModal(task)}
                      >
                        ✏️
                      </button>
                      <button
                        className={styles.actionButton}
                        onClick={() => deleteTask(task.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>☕</div>
              <div className={styles.emptyTitle}>All caught up!</div>
            </div>
          )}
        </div>

        <div className={`${styles.column} ${styles.completedColumn}`}>
          <div className={styles.columnHeader}>
            <h4 className={styles.columnTitle}>✅ Completed Tasks</h4>
            <span className={`${styles.counter} ${styles.completedCounter}`}>
              {completedTasks.length}
            </span>
          </div>

          {completedTasks.length > 0 ? (
            <div className={styles.tasksList}>
              {completedTasks.map((task, index) => (
                <div
                  key={task.id || `completed-${index}`}
                  draggable
                  className={styles.taskCard}
                >
                  <div className={styles.taskContent}>
                    <div className={styles.taskDetails}>
                      <div className={styles.taskTitle}>{task.title}</div>
                      <div className={styles.taskMeta}>
                        Order: {task.display_order}
                      </div>
                    </div>
                    <div className={styles.taskActions}>
                      <button
                        className={styles.actionButton}
                        onClick={() => openEditModal(task)}
                      >
                        ✏️
                      </button>
                      <button
                        className={styles.actionButton}
                        onClick={() => deleteTask(task.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🎉</div>
              <div className={styles.emptyTitle}>No completed tasks yet</div>
            </div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h4>✏️ Edit Task Title</h4>
            <form onSubmit={handleEditSubmit}>
              <input
                type="text"
                className={styles.modalInput}
                value={editTaskTitle}
                onChange={(e) => setEditTaskTitle(e.target.value)}
                required
              />
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.saveButton}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

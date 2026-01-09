import styles from "./dashboard.module.css";
import { useState, useEffect } from "react";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [errors, setErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        setErrors(null);

        const url = "http://flex-list-api.local/api/tasks";
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP status error ${response.status}`);
        }

        const result = await response.json();

        if (isMounted) {
          if (Array.isArray(result)) {
            setTasks(result);
          } else if (result && result.task && Array.isArray(result.task)) {
            setTasks(result.task);
          } else {
            setTasks([]);
          }
        }
      } catch (error) {
        if (isMounted) {
          setErrors(`Oops something went wrong: ${error.message}`);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchTasks();

    return () => {
      isMounted = false;
    };
  }, []);

  if (errors) {
    return <div>Error: {errors}</div>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const pendingTasks = Array.isArray(tasks)
    ? tasks.filter((task) => task.is_completed === 0 || !task.is_completed)
    : [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h3 className={styles.title}>📋 My Tasks</h3>
          <div className={styles.userInfo}>
            <div>
              <div className={styles.welcomeText}>Welcome</div>
              <div className={styles.userName}>Raymund</div>
            </div>
            Logout
          </div>
        </div>

        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Create new task..."
            className={styles.searchInput}
          />
          <button className={styles.searchButton}>Create</button>
        </div>
      </div>

      <div className={styles.tasksContainer}>
        <div className={`${styles.column} ${styles.pendingColumn}`}>
          <div className={styles.columnHeader}>
            <h4 className={styles.columnTitle}>📝 Pending Tasks</h4>
            <span className={`${styles.counter} ${styles.pendingCounter}`}>
              {pendingTasks.length}
            </span>
          </div>

          <div className={styles.tasksList}>
            <div draggable className={styles.taskCard}>
              <div className={styles.taskContent}>
                <div className={styles.taskDetails}>
                  <div className={styles.taskTitle}>
                    Create a video tutorial
                  </div>
                  <div className={styles.taskDescription}>
                    Video tutorial about React drag and drop features
                  </div>
                  <div className={styles.taskMeta}>ID: 1 • Order: 1</div>
                </div>
                <div className={styles.taskActions}>
                  <button className={styles.actionButton}>✏️</button>
                  <button className={styles.actionButton}>🗑️</button>
                </div>
              </div>
            </div>

            <div draggable className={styles.taskCard}>
              <div className={styles.taskContent}>
                <div className={styles.taskDetails}>
                  <div className={styles.taskTitle}>Learn Node.js backend</div>
                  <div className={styles.taskDescription}>
                    Learn advanced Node.js concepts and Express.js
                  </div>
                  <div className={styles.taskMeta}>ID: 2 • Order: 2</div>
                </div>
                <div className={styles.taskActions}>
                  <button className={styles.actionButton}>✏️</button>
                  <button className={styles.actionButton}>🗑️</button>
                </div>
              </div>
            </div>

            <div draggable className={styles.taskCard}>
              <div className={styles.taskContent}>
                <div className={styles.taskDetails}>
                  <div className={styles.taskTitle}>
                    Study Next.js framework
                  </div>
                  <div className={styles.taskDescription}>
                    Learn Next.js 14 with App Router and Server Components
                  </div>
                  <div className={styles.taskMeta}>ID: 3 • Order: 3</div>
                </div>
                <div className={styles.taskActions}>
                  <button className={styles.actionButton}>✏️</button>
                  <button className={styles.actionButton}>🗑️</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.column} ${styles.completedColumn}`}>
          <div className={styles.columnHeader}>
            <h4 className={styles.columnTitle}>✅ Completed Tasks</h4>
            <span className={`${styles.counter} ${styles.completedCounter}`}>
              0
            </span>
          </div>

          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🎉</div>
            <div className={styles.emptyTitle}>No completed tasks yet</div>
            <div className={styles.emptySubtitle}>
              Drag tasks from the left column to mark them as pending
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

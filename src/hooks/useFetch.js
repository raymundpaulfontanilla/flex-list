import { useState, useEffect } from "react";

const BASE_API_URL = "http://flex-list-api.local/api/tasks";

const ENDPOINTS = {
  getAllTasks: BASE_API_URL,
  createTask: `${BASE_API_URL}/create-task`,
  updateTask: (taskId) => `${BASE_API_URL}/update-task/${taskId}`,
};

export const useFetch = () => {
  const [tasks, setTasks] = useState([]);
  const [errors, setErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getValidatedToken = () => {
    const apiToken = localStorage.getItem("api_token");

    if (!apiToken) {
      setIsLoading(false);
      return;
    }
    return apiToken;
  };

  const getAuthHeaders = () => {
    const apiToken = getValidatedToken();
    if (!apiToken) return {};

    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${apiToken}`,
    };
  };

  const fetchTasks = async () => {
    if (!getValidatedToken) return;

    try {
      setErrors(null);

      const response = await fetch(ENDPOINTS.getAllTasks, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP status error ${response.status}`);
      }

      const data = await response.json();
      setTasks(Array.isArray(data) ? data : (data.task ?? []));
    } catch (error) {
      setErrors(`Error ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (title) => {
    try {
      const nextOrder = tasks.length + 1;

      if (nextOrder > 5) {
        alert("Maximum limit of 5 tasks reached!");
        return;
      }

      const response = await fetch(ENDPOINTS.createTask, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: title,
          is_completed: false,
          display_order: nextOrder,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server creation error code: ${response.status}`);
      }

      const data = await response.json();
      const newTask = data.task || data;
      setTasks((prevTasks) => [...prevTasks, newTask]);
    } catch (error) {
      console.error("Task creation failed:", error.message);
    }
  };

  const updateTask = async (taskId, newTitle) => {
    if (!getValidatedToken) return;

    try {
      const response = await fetch(ENDPOINTS.updateTask(taskId), {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: newTitle,
          is_completed: false,
          display_order: 1,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server creation error code: ${response.status}`);
      }

      const data = await response.json();
      const updateTask = data.task || data;

      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? updateTask : task)),
      );

      return { success: true };
    } catch (error) {
      console.error("Task update failed", error.message);
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    const apiToken = localStorage.getItem("api_token");
    if (apiToken) {
      setIsLoading(true);
      fetchTasks();
    } else {
      setIsLoading(false);
    }
  }, []);

  return { tasks, errors, isLoading, createTask, updateTask };
};

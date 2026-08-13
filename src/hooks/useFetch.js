import { useState, useEffect } from "react";

const BASE_API_URL = "http://flex-list-api.local/api/tasks";

const ENDPOINTS = {
  getAllTasks: BASE_API_URL,
  createTask: `${BASE_API_URL}/create-task`,
};

export const useFetch = () => {
  const [tasks, setTasks] = useState([]);
  const [errors, setErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = async () => {
    const apiToken = localStorage.getItem("api_token");

    if (!apiToken) {
      setIsLoading(false);
      return;
    }

    try {
      setErrors(null);

      const response = await fetch(ENDPOINTS.getAllTasks, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
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
      const apiToken = localStorage.getItem("api_token");
      if (!apiToken) return;

      const nextOrder = tasks.length + 1;

      if (nextOrder > 5) {
        alert("Maximum limit of 5 tasks reached!");
        return;
      }

      const response = await fetch(ENDPOINTS.createTask, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
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

  useEffect(() => {
    const apiToken = localStorage.getItem("api_token");
    if (apiToken) {
      setIsLoading(true);
      fetchTasks();
    } else {
      setIsLoading(false);
    }
  }, []);

  return { tasks, errors, isLoading, createTask };
};

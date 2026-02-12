import { useState, useEffect } from "react";

const BASE_API_URL = "http://flex-list-api.local/api";

const ENDPOINTS = {
  getAllTasks: `${BASE_API_URL}/tasks`,
};

export const useFetch = () => {
  const [tasks, setTasks] = useState([]);
  const [errors, setErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      setErrors(null);

      const apiToken = localStorage.getItem("api_token");

      const response = await fetch(ENDPOINTS.getAllTasks, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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

  useEffect(() => {
    fetchTasks();
  }, []);

  return { tasks, errors, isLoading };
};

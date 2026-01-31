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
      setIsLoading(false);
      setErrors(null);

      const response = await fetch(ENDPOINTS.getAllTasks);

      if (!response.ok) {
        throw new Error(`HTTP status error ${response.status}`);
      }

      const data = await response.json();
      setTasks(Array.isArray(data) ? data : (data.task ?? []));
    } catch (error) {
      setErrors(`Error ${error.message}`);
    }
  };

  useEffect(() => {
    fetchTasks();
  });

  return { tasks, errors, isLoading };
};

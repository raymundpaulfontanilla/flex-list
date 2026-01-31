import { useState, useEffect } from "react";

export const useFetch = () => {
  const [tasks, setTasks] = useState([]);
  const [errors, setErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setIsLoading(false);
      setErrors(null);

      const response = await fetch("http://flex-list-api.local/api/tasks");

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

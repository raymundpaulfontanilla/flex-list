import { useState, useEffect } from "react";

const API_URL = "http://flex-list-api.local/api/tasks";

export const useFetch = () => {
  const [errors, setErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        setErrors(null);

        const response = await fetch(API_URL);
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

  return {
    errors,
    isLoading,
    tasks,
  };
};

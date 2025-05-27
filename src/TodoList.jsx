import { useState, useEffect } from "react";
import axios from "axios";

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme === "true") {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const apiUrl = "https://pit4-appdev-1.onrender.com/todos/";

  useEffect(() => {
    axios
      .get(apiUrl)
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, []);

  const addTask = () => {
    if (task.trim() === "") return;

    const newTask = { title: task, completed: false };

    axios
      .post(apiUrl, newTask)
      .then((response) => {
        setTasks([...tasks, response.data]);
        setTask("");
      })
      .catch((error) => {
        console.error("Error adding task:", error);
      });
  };

  const removeTask = (index) => {
    const taskToRemove = tasks[index];

    axios
      .delete(`${apiUrl}${taskToRemove.id}/`)
      .then(() => {
        setTasks(tasks.filter((_, i) => i !== index));
      })
      .catch((error) => {
        console.error("Error removing task:", error);
      });
  };

  const toggleComplete = (index) => {
    const updatedTask = { ...tasks[index], completed: !tasks[index].completed };

    axios
      .put(`${apiUrl}${updatedTask.id}/`, updatedTask)
      .then((response) => {
        const updatedTasks = tasks.map((task, i) =>
          i === index ? response.data : task
        );
        setTasks(updatedTasks);
      })
      .catch((error) => {
        console.error("Error toggling task completion:", error);
      });
  };

  const startEditing = (index) => {
    setEditIndex(index);
    setEditText(tasks[index].title);
  };

  const saveEdit = (index) => {
    const updatedTask = { ...tasks[index], title: editText };

    axios
      .put(`${apiUrl}${updatedTask.id}/`, updatedTask)
      .then((response) => {
        const updatedTasks = tasks.map((task, i) =>
          i === index ? response.data : task
        );
        setTasks(updatedTasks);
        setEditIndex(null);
      })
      .catch((error) => {
        console.error("Error saving task edit:", error);
      });
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "completed") return t.completed;
    if (filter === "pending") return !t.completed;
    return true;
  });

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
      <h2>To-Do List</h2>
      <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>
      <input
        type="text"
        placeholder="Add a new task..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button onClick={addTask}>Add Task</button>
      <div>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
        <button onClick={() => setFilter("pending")}>Pending</button>
      </div>
      <ul>
        {filteredTasks.map((t, index) => (
          <li key={t.id} style={{ textDecoration: t.completed ? "line-through" : "none" }}>
            {editIndex === index ? (
              <>
                <input value={editText} onChange={(e) => setEditText(e.target.value)} />
                <button onClick={() => saveEdit(index)}>Save</button>
              </>
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => toggleComplete(index)}
                />
                {t.title}
                <button onClick={() => startEditing(index)}>Edit</button>
                <button onClick={() => removeTask(index)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
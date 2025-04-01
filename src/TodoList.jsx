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
    // Fetch tasks from the Django API
    axios.get("http://127.0.0.1:8000/api/tasks/")
      .then(response => setTasks(response.data))
      .catch(error => console.error(error));
    
    // Load dark mode preference from localStorage
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

  const addTask = () => {
    if (task.trim() === "") return;

    axios.post("http://127.0.0.1:8000/api/tasks/", { text: task, completed: false })
      .then(response => setTasks([...tasks, response.data]))
      .catch(error => console.error(error));

    setTask("");
  };

  const removeTask = (id) => {
    axios.delete(`http://127.0.0.1:8000/api/tasks/${id}/`)
      .then(() => setTasks(tasks.filter(t => t.id !== id)))
      .catch(error => console.error(error));
  };

  const toggleComplete = (id, completed) => {
    axios.patch(`http://127.0.0.1:8000/api/tasks/${id}/`, { completed: !completed })
      .then(response => {
        setTasks(tasks.map(t => (t.id === id ? response.data : t)));
      })
      .catch(error => console.error(error));
  };

  const startEditing = (index) => {
    setEditIndex(index);
    setEditText(tasks[index].text);
  };

  const saveEdit = (id) => {
    axios.patch(`http://127.0.0.1:8000/api/tasks/${id}/`, { text: editText })
      .then(response => {
        setTasks(tasks.map(t => (t.id === id ? response.data : t)));
        setEditIndex(null);
      })
      .catch(error => console.error(error));
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
                <button onClick={() => saveEdit(t.id)}>Save</button>
              </>
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => toggleComplete(t.id, t.completed)}
                />
                {t.text}
                <button id="editB" onClick={() => startEditing(index)}>Edit</button>
                <button onClick={() => removeTask(t.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

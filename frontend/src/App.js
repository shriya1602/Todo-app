import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Fetch tasks from the backend
  useEffect(() => {
    axios.get("http://localhost:5000/tasks").then((res) => {
      setTasks(res.data);
    });
  }, []);

  // Add a new task
  const addTask = () => {
    axios
      .post("http://localhost:5000/tasks", { task: newTask, completed: false })
      .then((res) => {
        setTasks([...tasks, res.data]);
        setNewTask("");
      });
  };

  // Delete a task
  const deleteTask = (id) => {
    axios.delete(`http://localhost:5000/tasks/${id}`).then(() => {
      setTasks(tasks.filter((task) => task._id !== id));
    });
  };

  // Toggle completion status
  const toggleTaskCompletion = (id, completed) => {
    axios
      .put(`http://localhost:5000/tasks/${id}`, { completed: !completed })
      .then((res) => {
        setTasks(
          tasks.map((task) =>
            task._id === id ? { ...task, completed: !completed } : task
          )
        );
      });
  };

  return (
    <div className="container">
      <h1 className="my-4">TODO App</h1>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New Task"
        />
        <button className="btn btn-primary" onClick={addTask}>Add Task</button>
      </div>
      <ul className="list-group">
        {tasks.map((task) => (
          <li key={task._id} className="list-group-item d-flex justify-content-between">
            <span style={{ textDecoration: task.completed ? "line-through" : "" }}>
              {task.task}
            </span>
            <div>
              <button
                className={`btn btn-${task.completed ? 'warning' : 'success'} btn-sm`}
                onClick={() => toggleTaskCompletion(task._id, task.completed)}
              >
                {task.completed ? "Unmark" : "Mark as Completed"}
              </button>
              <button className="btn btn-danger btn-sm ms-2" onClick={() => deleteTask(task._id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

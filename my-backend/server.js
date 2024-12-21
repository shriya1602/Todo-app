const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/todoApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const taskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const Task = mongoose.model("Task", taskSchema);

// GET all tasks
app.get("/tasks", (req, res) => {
  Task.find()
    .then((tasks) => res.json(tasks))
    .catch((err) => res.status(400).send(err));
});

// POST a new task
app.post("/tasks", (req, res) => {
  const newTask = new Task(req.body);
  newTask
    .save()
    .then((task) => res.json(task))
    .catch((err) => res.status(400).send(err));
});

// PUT to toggle task completion
app.put("/tasks/:id", (req, res) => {
  Task.findByIdAndUpdate(req.params.id, { completed: req.body.completed }, { new: true })
    .then((task) => res.json(task))
    .catch((err) => res.status(400).send(err));
});

// DELETE a task
app.delete("/tasks/:id", (req, res) => {
  Task.findByIdAndDelete(req.params.id)
    .then(() => res.json({ message: "Task deleted" }))
    .catch((err) => res.status(400).send(err));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

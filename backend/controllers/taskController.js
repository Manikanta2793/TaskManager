import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    console.log("USER ID:", req.user);

    const task = await Task.create({
      title,
      description,
      user: req.user,
    });

    res.json(task);
  } catch (error) {
    console.log("CREATE TASK ERROR:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const getTasks = async (req, res) => {
  try {
    console.log("GET TASKS for user:", req.user);

    const tasks = await Task.find({ user: req.user }).sort({
      createdAt: -1,
    });

    res.json(tasks);
  } catch (error) {
    console.log("GET TASKS ERROR:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Task.findOneAndUpdate(
      { _id: id, user: req.user },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ msg: "Task not found" });
    }

    res.json(updated);
  } catch (error) {
    console.log("UPDATE TASK ERROR:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Task.findOneAndDelete({
      _id: id,
      user: req.user,
    });

    if (!deleted) {
      return res.status(404).json({ msg: "Task not found" });
    }

    res.json({ msg: "Task deleted" });
  } catch (error) {
    console.log("DELETE TASK ERROR:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

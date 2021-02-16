const express = require("express");
const Task = require("../models/task");
const router = new express.Router();
router.post("/tasks", async (req, res) => {
  const task = new Task(req.body);
  //   task
  //     .save()
  //     .then(() => {
  //       res.send(task);
  //     })
  //     .catch((error) => {
  //       res.status(400).send(error);
  //     });
  try {
    res.send(await task.save());
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/tasks", async (req, res) => {
  // Task.find({}).then((task)=>{if(!task)return res.status(404).send;
  // res.send(task);}).catch((error) => {res.status(500).send(error)})
  try {
    const task = await Task.find({});
    if (!task) return res.status(404).send;
    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});
router.get("/tasks/:id", async (req, res) => {
  const id = req.params.id;
  // Task.findById(id).then((task)=>{
  //     if(!task)
  //     res.status(404).send;
  //     res.send(task);
  // }).catch((error) => {res.status(500).send(error)})
  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).send;
    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch("/tasks/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdate = ["description", "completed"];
  const isValidOperation = updates.every((update) => {
    return allowedUpdate.includes(update);
  });
  if (!isValidOperation) {
    return res.status(400).send({ error: "invalid updates" });
  }
  try {
      const task=await Task.findById(req.params.id);
      updates.forEach((update) => {
          task[update]=req.body[update];
      }) 
      task.save();
    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    if (!task) return res.status(404).send();
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findOneAndDelete(req.params.id);
    if (!task) return res.status(404).send();
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});
module.exports = router;

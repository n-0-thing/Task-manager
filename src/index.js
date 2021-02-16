const express = require("express");
const app = express();
require("./db/mongoose");
const UserRouter = require("./routers/user");
const TaskRouter = require("./routers/task");
const Task = require("./models/task");
const port = process.env.PORT || 8080;

app.use(express.json());

app.use(UserRouter);
app.use(TaskRouter);

app.listen(port, () => {
  console.log("Server is running");
});

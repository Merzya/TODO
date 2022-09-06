require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

const TodoTask = require("./models/Task");

app.set("port", process.env.PORT || 80);
app.set("view engine", "ejs");

app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: true }));

//connection to db
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
  console.log("Connected to db!");
  app.listen(app.get("port"), () => console.log("Server Up and running"));
});
// app.listen(app.get("port"), () => {
//   console.log(`web app working at http://127.0.0.1:${app.get("port")}`);
// });

// GET METHOD
app.get("/", (req, res) => {
  TodoTask.find({}, (err, tasks) => {
    res.render("todo.ejs", { Tasks: tasks });
  });
});

//POST METHOD
app.post("/", async (req, res) => {
  const Task = new TodoTask({ content: req.body.content });
  try {
    await Task.save();
    res.redirect("/");
  } catch (err) {
    res.redirect("/");
  }
});
//UPDATE
app
  .route("/edit/:id")
  .get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
      res.render("Edit.ejs", { todoTasks: tasks, idTask: id });
    });
  })
  .post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, (err) => {
      if (err) return res.send(500, err);
      res.redirect("/");
    });
  });
//DELETE
app.route("/remove/:id").get((req, res) => {
  const id = req.params.id;
  TodoTask.findByIdAndRemove(id, (err) => {
    if (err) return res.send(500, err);
    res.redirect("/");
  });
});

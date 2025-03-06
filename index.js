const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const PORT = 9999;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  fs.readdir(`./notes`, (error, notes) => {
    if (!error) {
      res.render("index", { notes: notes });
      return;
    }
    console.log(error);
  });
});

app.post("/create", (req, res) => {
  const data = req.body;
  fs.writeFile(
    `./notes/${data.noteTittle.split(" ").join("")}`,
    data.noteDescription,
    (error) => {
      if (!error) {
        console.log("Note Created");
        res.redirect("/");
        return;
      }
      console.log(error);
    }
  );
});

app.listen(PORT, () => {
  console.log("Server Running");
});

const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const PORT = 9999;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

fs.readdir(`./notes`, (error, notes) => {
  if (error) {
    return "error";
  }
  app.get("/", (req, res) => {
    res.render("index", { notes: notes });
  });
  console.log(notes);
});

app.post("/create", (req, res) => {
  const data = req.body;
  fs.writeFile(
    `./notes/${data.noteTittle.split(" ").join("")}`,
    data.noteDescription,
    (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log("Note Created");
      }
    }
  );
});

app.listen(PORT, () => {
  console.log("Server Running");
});

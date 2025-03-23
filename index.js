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
  if (!fs.existsSync("./notes")) {
    fs.mkdirSync("./notes");
  }
  fs.readdir(`./notes`, (error, notes) => {
    if (!error) {
      let allNotesArray = [];
      let readFilesCount = 0;
      if (notes.length === 0) {
        return res.render("index", { allNotes: [] });
      }
      notes.forEach((elem, index) => {
        fs.readFile(`./notes/${elem}`, "utf-8", (error, data) => {
          if (!error) {
            const noteData = JSON.parse(data);
            allNotesArray.push(noteData);
            readFilesCount++;
            if (index === notes.length - 1 && readFilesCount === notes.length) {
              res.render("index", { allNotes: allNotesArray });
              return;
            }
            return;
          }
          console.log(error.message);
        });
      });
      return;
    }
    console.log(error.message);
  });
});

app.post("/create", (req, res) => {
  const date = new Date().toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: "true",
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });
  const noteData = {
    noteName: req.body.noteTittle.replace(/\s/g, ""),
    noteTittle: req.body.noteTittle,
    noteDescription: req.body.noteDescription,
    noteTime: date,
  };
  fs.writeFile(
    `./notes/${req.body.noteTittle.split(" ").join("")}.json`,
    JSON.stringify(noteData),
    (error) => {
      if (!error) {
        res.redirect("/");
        return;
      }
      console.log(error);
    }
  );
});

app.get("/notes/:noteName", (req, res) => {
  fs.readFile(
    `./notes/${req.params.noteName}.json`,
    "utf-8",
    (error, noteDescription) => {
      if (!error) {
        res.render("noteShow", {
          name: JSON.parse(noteDescription).noteName,
          tittle: JSON.parse(noteDescription).noteTittle,
          description: JSON.parse(noteDescription).noteDescription,
          time: JSON.parse(noteDescription).noteTime,
        });
        return;
      }
      console.log(error);
    }
  );
});

app.get("/delete/:noteName", (req, res) => {
  fs.unlink(`./notes/${req.params.noteName}.json`, (error) => {
    if (!error) {
      res.redirect("/");
    }
    console.log(error.message);
  });
});

app.listen(PORT, () => {
  console.log("Server Running");
});

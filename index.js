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
    if (error) {
      console.log("failed to show Notes", error.message);
      res.status(500).json({ error: "failed to show Notes" });
      return;
    }
    let allNotesArray = [];
    let readFilesCount = 0;
    if (notes.length === 0) {
      return res.render("index", { allNotes: allNotesArray });
    }
    notes.forEach((elem, index) => {
      fs.readFile(`./notes/${elem}`, "utf-8", (error, data) => {
        if (error) {
          console.log("failed to show Notes", error.message);
          res.status(500).json({ error: "failed to show Notes" });
          return;
        }
        const noteData = JSON.parse(data);
        allNotesArray.push(noteData);
        readFilesCount++;

        if (index === notes.length - 1 && readFilesCount === notes.length) {
          res.render("index", {
            allNotes: allNotesArray,
          });
          return;
        }
      });
    });
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
    noteFileName: `${req.body.noteTittle.split(" ").join("")}.json`,
    noteTittle: req.body.noteTittle,
    noteDescription: req.body.noteDescription,
    noteTime: date,
  };
  fs.writeFile(
    `./notes/${noteData.noteFileName}`,
    JSON.stringify(noteData),
    (error) => {
      if (error) {
        console.error("Error Creating Note", error.message);
        res.status(500).json({ error: "failed to create note" });
        return;
      }
      res.redirect("/");
    }
  );
});

app.get("/notes/:noteFileName", (req, res) => {
  fs.readFile(
    `./notes/${req.params.noteFileName}`,
    "utf-8",
    (error, noteDescription) => {
      if (!error) {
        res.render("noteShow", {
          name: JSON.parse(noteDescription).noteFileName,
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

app.get("/delete/:noteFileName", (req, res) => {
  fs.unlink(`./notes/${req.params.noteFileName}`, (error) => {
    if (!error) {
      res.redirect("/");
    }
    console.log(error.message);
  });
});

app.get("/edit/:noteTittle", (req, res) => {
  res.render("noteedit", {
    notePreviousName: req.params.noteTittle,
  });
});

app.post("/update", (req, res) => {
  const previousTittle = `./notes/${req.body.previousTittle
    .split(" ")
    .join("")}.json`;
  const newTittle = `./notes/${req.body.newTittle}`;

  fs.rename(
    previousTittle,
    `${newTittle.split(" ").join("")}.json`,
    (error) => {
      if (error) {
        console.error("Error renaming file:", error.message);
        res.status(500).json({ error: "Failed to rename file" });
        return;
      }
      fs.readFile(
        `${newTittle.split(" ").join("")}.json`,
        "utf-8",
        (error, data) => {
          if (error) {
            console.error("Error renaming file:", error.message);
            res.status(500).json({ error: "Failed to rename file" });
            return;
          }
          const noteData = JSON.parse(data);
          noteData.noteFileName = `${req.body.newTittle
            .split(" ")
            .join("")}.json`;
          noteData.noteTittle = req.body.newTittle;
          fs.writeFile(
            `${newTittle.split(" ").join("")}.json`,
            JSON.stringify(noteData),
            "utf-8",
            (error) => {
              if (error) {
                console.error("Error renaming file:", error.message);
                res.status(500).json({ error: "Failed to rename file" });
                return;
              }
              res.redirect("/");
            }
          );
        }
      );
    }
  );
});

app.listen(PORT, () => {
  console.log("Server Running");
});

const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const PORT = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  fs.readdir(`./notes`, (error, notes) => {
    if (!error) {
      const allNotesArray = [];
      notes.forEach((elem, index) => {
        fs.readFile(`./notes/${elem}`, "utf-8", (error, data) => {
          if (!error) {
            const noteData = JSON.parse(data);
            allNotesArray.push(noteData);
            if (index === notes.length - 1) {
              res.render("index", {
                allNotes: allNotesArray,
              });
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
    `./notes/${req.params.noteName}`,
    "utf-8",
    (error, noteDescription) => {
      if (!error) {
        res.render("noteShow", {
          heading: req.params.noteName,
          description: noteDescription,
        });

        console.log(noteDescription);
        return;
      }
      console.log(error);
    }
  );
});

app.delete("/delete", (req, res) => {
  const data = req.body;
  console.log(data);
});

app.listen(PORT, () => {
  console.log("Server Running");
});

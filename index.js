const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const {
  addOrUpdateCharacter,
  getCharacters,
  deleteCharacter,
  getCharacterById,
} = require("./dynamo");

// const user = require("./routes.js");

const app = express();
app.use(express.json());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// Routes
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/test", (req, res) => {
  res.render("endpoint", { msg: "for Developer", id: 23444 });
  // res.render("endpoint", { msg: "Good message" });
});

app.get("/api/test", (req, res) => {
  try {
    res.status(500).json({ name: "Oluwanishola", age: 32 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

app.get("/api/characters", async (req, res) => {
  try {
    const characters = await getCharacters();
    res.json(characters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

app.get("/api/characters/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const character = await getCharacterById(id);
    res.json(character);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

app.post("/api/characters", async (req, res) => {
  const character = req.body;
  try {
    const newCharacter = await addOrUpdateCharacter(character);
    res.json(newCharacter);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

app.put("/api/characters/:id", async (req, res) => {
  const character = req.body;
  const { id } = req.params;
  character.id = id;
  try {
    const newCharacter = await addOrUpdateCharacter(character);
    res.json(newCharacter);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

app.delete("/api/characters/:id", async (req, res) => {
  const { id } = req.params;
  try {
    res.json(await deleteCharacter(id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong!" });
  }
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`listening on port port ${port}`);
});

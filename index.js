import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "123456",
  port: 5432
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  let results = await db.query("SELECT * FROM todo");
  let items = results.rows;

  console.log("ITEMS: " + JSON.stringify(items));

  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;

  try {
    await db.query("INSERT INTO todo(task) VALUES($1)", [item]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.post("/edit", async (req, res) => { 
  const item = req.body.updatedItemTitle;
  const taskToEdit = req.body.updatedItemId;

  try {
    await db.query("UPDATE todo SET task = ($1) WHERE id = ($2)", [item, taskToEdit]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
 });

app.post("/delete", async (req, res) => { 

  const idToDelete = req.body.deleteItemId;

  console.log(idToDelete);

  try {
    await db.query("DELETE FROM todo WHERE id = ($1)", [idToDelete]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
 });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  try {
    res.render("index.ejs");
  } catch (error) {
    console.error("Error rendering index:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, (req, res) => {
  console.log("Server is running successfully on port ", port);
});

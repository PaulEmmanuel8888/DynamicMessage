import "dotenv/config";

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
const adminUsername = process.env.ADMIN_USERNAME;
const adminPassword = process.env.ADMIN_PASSWORD;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  try {
    res.render("index.ejs");
  } catch (error) {
    console.error("Error rendering page:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/messages", (req, res) => {
  try {
    res.render("messages.ejs");
  } catch (error) {
    console.error("Error rendering page:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/login", (req, res) => {
  try {
    const username = req.body.username.trim();
    const password = req.body.password.trim();

    const isAdmin = checkCredentials(
      username,
      password,
      adminUsername,
      adminPassword
    );

    if (isAdmin === true) {
      res.redirect("messages");
    } else if (isAdmin === false) {
      console.log("Unauthorized user.");
      res.redirect("/");
    }
  } catch (error) {
    console.error("Error rendering page:", error);
    res.status(500).send("Internal Server Error");
  }
});

function checkCredentials(
  currentUsername,
  currentPassword,
  adminUsername,
  adminPassword
) {
  try {
    if (
      currentUsername === adminUsername &&
      currentPassword === adminPassword
    ) {
      console.log("Logged in successfully.");
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error checking credentials:", error);
  }
}

app.listen(port, (req, res) => {
  console.log("Server is running successfully on port ", port);
});

import "dotenv/config";

import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import {
  initDatabase,
  insertMessage,
  getMessages,
  deleteMessage,
} from "./public/js/database.js";

await initDatabase();

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

let isAdmin = false;

app.get("/", (req, res) => {
  try {
    res.render("index.ejs");
  } catch (error) {
    console.error("Error rendering page:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/messages", async (req, res) => {
  try {
    if (isAdmin === true) {
      const recentMessages = await getMessages();

      const sortedMessages = recentMessages.sort(
        (a, b) => b.timeStamp - a.timeStamp
      );

      res.render("messages.ejs", { allMessages: sortedMessages });
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.error("Error rendering page:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/login", (req, res) => {
  try {
    const username = req.body.username.trim();
    const password = req.body.password.trim();

    const isAdminCheck = checkCredentials(
      username,
      password,
      adminUsername,
      adminPassword
    );

    if (isAdminCheck === true) {
      isAdmin = true;
      res.redirect("messages");
    } else if (isAdminCheck === false) {
      console.log("Unauthorized user.");
      res.redirect("/");
    }
  } catch (error) {
    console.error("Error rendering page:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/save", async (req, res) => {
  try {
    const text = req.body.message_input;
    const id = 1;

    if (text.trim() !== "") {
      const now = new Date(Date.now());

      // Format time
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12; // convert to 12-hour format
      const formattedTime = `${hours}:${minutes} ${ampm}`;

      // Format date as dd/mm/yy
      const day = now.getDate().toString().padStart(2, "0");
      const month = (now.getMonth() + 1).toString().padStart(2, "0"); // months are 0-based
      const year = now.getFullYear().toString().slice(-2);
      const formattedDate = `${day}/${month}/${year}`;

      const message = {
        id: id,
        time: formattedTime,
        date: formattedDate,
        timeStamp: Date.now(),
        messageContent: text,
      };

      insertMessage(message);

      res.redirect("/messages");
    }
  } catch (error) {
    console.error("Error rendering page:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/delete/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    deleteMessage(id);
    res.redirect("/messages");
  } catch (error) {
    console.error("Error deleting message:", error);
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

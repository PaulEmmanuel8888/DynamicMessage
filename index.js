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

const clients = [];

app.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders(); // send headers right away

  clients.push(res);

  req.on("close", () => {
    const index = clients.indexOf(res);
    if (index !== -1) clients.splice(index, 1);
  });
});

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
    if (text.trim() !== "") {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      const formattedTime = `${hours}:${minutes} ${ampm}`;
      const day = now.getDate().toString().padStart(2, "0");
      const month = (now.getMonth() + 1).toString().padStart(2, "0");
      const year = now.getFullYear().toString().slice(-2);
      const formattedDate = `${day}/${month}/${year}`;

      const message = {
        time: formattedTime,
        date: formattedDate,
        timeStamp: Date.now(),
        messageContent: text,
      };

      insertMessage(message);

      sendEventToAllClients(message); // 🔥 push update to all clients

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
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error checking credentials:", error);
  }
}
function sendEventToAllClients(message) {
  const data = `data: ${JSON.stringify(message)}\n\n`;
  clients.forEach((client) => client.write(data));
}

app.listen(port, (req, res) => {
  console.log("Server is running successfully on port ", port);
});

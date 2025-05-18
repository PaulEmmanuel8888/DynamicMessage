// database.js
import initSqlJs from "sql.js";
import fs from "fs";
import path from "path";

const config = {
  locateFile: (file) => path.join("public", file),
};

let db;

export async function initDatabase() {
  const SQL = await initSqlJs(config);

  // Optionally load an existing DB from file
  // const fileBuffer = fs.readFileSync('data.db');
  // db = new SQL.Database(fileBuffer);

  // Or create a new one
  db = new SQL.Database();

  // Example setup
  db.run(
    `CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  time TEXT,
  date TEXT,
  timeStamp INTEGER,
  messageContent TEXT
);
`
  );
}

export function insertMessage(message) {
  const stmt = db.prepare(
    "INSERT INTO messages (time, date, timeStamp, messageContent) VALUES (?, ?, ?, ?)"
  );
  stmt.run([
    message.time,
    message.date,
    message.timeStamp,
    message.messageContent,
  ]);
  stmt.free();
}

export function getMessages() {
  const stmt = db.prepare("SELECT * FROM messages");
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}
export function deleteMessage(id) {
  const stmt = db.prepare("DELETE FROM messages WHERE id = ?");
  stmt.run([id]);
  stmt.free();
}

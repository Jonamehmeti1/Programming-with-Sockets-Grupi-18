const fs = require("fs");
const path = require("path");

const SHARED_FOLDER = path.join(__dirname, "shared_folder");

// krijon folderin e ri nese nuk ekziston asnje folder
if (!fs.existsSync(SHARED_FOLDER)) {
  fs.mkdirSync(SHARED_FOLDER);
}

function safeFilePath(filename) {
  return path.join(SHARED_FOLDER, path.basename(filename));
}

function handleCommand(username, commandLine, hasPermission) {
  const parts = commandLine.trim().split(" ");
  const command = parts[0]?.toLowerCase();

  if (!command) return "ERROR: Empty command";

  if (command === "list") {
    if (!hasPermission(username, "read")) {
      return "ACCESS DENIED: No read permission";
    }

    try {
      const files = fs.readdirSync(SHARED_FOLDER);
      return files.length ? `FILES: ${files.join(", ")}` : "Folder is empty";
    } catch (err) {
      return `ERROR: ${err.message}`;
    }
  }
  if (command === "read") {
    if (!hasPermission(username, "read")) {
      return "ACCESS DENIED: No read permission";
    }

    const filename = parts[1];
    if (!filename) return "ERROR: Missing filename";

    try {
      const content = fs.readFileSync(safeFilePath(filename), "utf8");
      return `CONTENT:\n${content}`;
    } catch (err) {
      return `ERROR: ${err.message}`;
    }
  }

  if (command === "write") {
    if (!hasPermission(username, "write")) {
      return "ACCESS DENIED: No write permission";
    }

    const filename = parts[1];
    const text = parts.slice(2).join(" ");

    if (!filename || !text) {
      return "ERROR: write filename.txt text";
    }

    try {
      fs.writeFileSync(safeFilePath(filename), text, "utf8");
      return `SUCCESS: Written to ${filename}`;
    } catch (err) {
      return `ERROR: ${err.message}`;
    }
  }

  if (command === "execute") {
    if (!hasPermission(username, "execute")) {
      return "ACCESS DENIED: No execute permission";
    }

    const sub = parts[1];

    if (sub === "date") return new Date().toString();
    if (sub === "list") {
      const files = fs.readdirSync(SHARED_FOLDER);
      return files.length ? files.join(", ") : "Folder is empty";
    }

    return "ERROR: Unknown execute command";
  }

  return "ERROR: Unknown command";
}

module.exports = { handleCommand };
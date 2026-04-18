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
}
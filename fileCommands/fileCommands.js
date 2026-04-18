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


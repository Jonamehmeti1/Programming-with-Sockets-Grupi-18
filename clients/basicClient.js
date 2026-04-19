
function printHelp() {
  console.log("\n📖 AVAILABLE COMMANDS (READ-ONLY ACCESS):");
  console.log("  list                    - List all files in shared folder");
  console.log("  read <filename>         - Read content of a file");
  console.log("  help                    - Show this help message");
  console.log("  exit                    - Exit the program");
  console.log("Note: write and execute commands require admin permissions\n");
}

function validateCommand(command) {
  const parts = command.trim().split(" ");
  const cmd = parts[0]?.toLowerCase();
  

  if (["list", "read"].includes(cmd)) {
    return true;
  }
  
  if (["write", "execute"].includes(cmd)) {
    console.log("❌ ACCESS DENIED: You don't have permission for '" + cmd + "' command (admin only)");
    return false;
  }
  
  return true; 
}

function askCommand() {
  if (waitingForResponse) {
    return; 
  }
  
  rl.question("\n➤ Command: ", (input) => {
    const command = input.trim();

    if (command.toLowerCase() === "exit") {
      console.log("Goodbye!");
      client.close();
      rl.close();
      process.exit(0);
    }

    if (command.toLowerCase() === "help") {
      printHelp();
      askCommand();
      return;
    }

    if (!command) {
      console.log("⚠️  Please enter a command");
      askCommand();
      return;
    }


    if (!validateCommand(command)) {
      askCommand();
      return;
    }

    const message = JSON.stringify({ username: USERNAME, command });
    client.send(message, SERVER_PORT, SERVER_IP);
    waitingForResponse = true;
  });
}

client.on("message", (msg) => {
  waitingForResponse = false;
  console.log("\n✓ Server Response:", msg.toString());
  askCommand(); // Ask for next command after receiving response
});

client.on("error", (err) => {
  console.log("❌ Error:", err.message);
  client.close();
  rl.close();
  process.exit(1);
});

console.log("═══════════════════════════════════════");
console.log("✅ Logged in as BASIC USER (read-only)");
console.log("═══════════════════════════════════════");
printHelp();
askCommand();
const dgram = require("dgram");
const readline = require("readline");

const client = dgram.createSocket("udp4");

const SERVER_IP = "127.0.0.1";
const SERVER_PORT = 4444;

const USERNAME = "admin1"; 

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askCommand() {
  rl.question("ADMIN Command: ", (command) => {
    const message = JSON.stringify({ username: USERNAME, command });

    client.send(message, SERVER_PORT, SERVER_IP);

    askCommand();
  });
}

client.on("message", (msg) => {
  console.log("\nServer:", msg.toString());
});

client.on("error", (err) => {
  console.log("Error:", err.message);
  client.close();
});

console.log("Logged in as ADMIN");
askCommand();
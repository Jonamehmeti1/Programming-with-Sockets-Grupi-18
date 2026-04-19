const dgram = require("dgram");
const { handleCommand } = require("./fileCommands/fileCommands");

const server = dgram.createSocket("udp4");

const SERVER_IP = "127.0.0.1";
const SERVER_PORT = 4444;

const users = {
  admin1: ["read", "write", "execute"],
  guest1: ["read"],
  guest2: ["read"],
  guest3: ["read"],
};

function hasPermission(username, permission) {
  return users[username] && users[username].includes(permission);
}

server.on("message", (msg, rinfo) => {
  let data;

  try {
    data = JSON.parse(msg.toString());
  } catch {
    return server.send("Invalid JSON", rinfo.port, rinfo.address);
  }

  const { username, command } = data;

  if (!users[username]) {
    return server.send("Unknown user", rinfo.port, rinfo.address);
  }

  const response = handleCommand(username, command, hasPermission);

  server.send(response, rinfo.port, rinfo.address);
});

server.on("error", (err) => {
  console.error("Server error:", err);
});


server.bind(SERVER_PORT, SERVER_IP, () => {
  console.log(`Server running on ${SERVER_IP}:${SERVER_PORT}`);
});

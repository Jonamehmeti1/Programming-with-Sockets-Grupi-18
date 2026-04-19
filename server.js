const dgram = require("dgram");
const { handleCommand } = require("./fileCommands/fileCommands");
const os = require("os");
const server = dgram.createSocket("udp4");

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
function getLocalIP() {
  const interfaces = os.networkInterfaces();

  for (let name of Object.keys(interfaces)) {
    for (let net of interfaces[name]) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
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

  console.log(`📨 Request from ${username} (${rinfo.address}:${rinfo.port}) → ${command}`);
  const response = handleCommand(username, command, hasPermission);

  server.send(response, rinfo.port, rinfo.address);
});



server.on("error", (err) => {
  console.error("Server error:", err);
});

server.bind(SERVER_PORT, "0.0.0.0", () => {
  const ip = getLocalIP();
  console.log(" Server started successfully!");
  console.log(` IP Address: ${ip}`);
  console.log(`Port: ${SERVER_PORT}`);
  console.log(" Waiting for clients...");
});
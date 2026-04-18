const dgram = require("dgram");
const { handleCommand } = require("./fileCommands");

const server = dgram.createSocket("udp4");

const SERVER_IP = "127.0.0.1";
const SERVER_PORT = 4444;

const users = {
  admin1: ["read", "write", "execute"],
  guest1: ["read"],
  guest2: ["read"],
  guest3: ["read"],
};

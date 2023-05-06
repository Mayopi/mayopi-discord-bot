require("dotenv").config();
const express = require("express");
const { client } = require("../app.js");
const mongoose = require("mongoose");

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.get("/api/hello", (req, res) => {
  res.status(200).json({ message: "Hello World", status: 200 });
});

app.get("/api/send", (req, res) => {
  const { message, guildID, channelID } = req.query;

  if (!message) {
    res.status(403).json({ message: "Message cannot be empty" });
    return;
  }

  const guild = client.guilds.cache.get(guildID);
  const channel = guild.channels.cache.get(channelID);
  channel.send(`message: ${message}, ownerId: ${guild.ownerId}`);

  res.status(200).json({
    status: 200,
    message,
    guild: {
      name: guild.name,
      ownerId: guild.ownerId,
    },
  });
});

const API = () => {
  app.listen(port, () => {
    console.log(`Endpoint is listening on http://localhost:${port}`);
    return;
  });
};

module.exports = { API };

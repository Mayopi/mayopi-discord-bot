const { PermissionsBitField } = require("discord.js");
const { author } = require("../config.json");

const checkPermission = (msg, client) => {
  const content = msg.content.split(" ");
  msg.channel.send("checking for authorization");
  if (msg.author.id === author) {
    msg.channel.send("Authorized");

    try {
      if (msg.member.permissions.has(PermissionsBitField.Flags[`${content[content.length - 1]}`])) {
        msg.channel.send(`this bot have a permission to ${content[content.length - 1]}`);
      } else {
        msg.channel.send(`this bot doesn't have a permission to ${content[content.length - 1]}`);
      }
    } catch (error) {
      msg.reply(error.message);
    }
  } else {
    msg.channel.send("you are not my Papa! (Unauthorized)");
  }
};

module.exports = { checkPermission };

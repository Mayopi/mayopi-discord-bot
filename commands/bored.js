const axios = require("axios");
const { EmbedBuilder } = require("discord.js");

const bored = async (msg, config) => {
  if (msg.content.includes("bored set")) {
    let content = msg.content.split(" ");
    if (content[content.length - 1].toLowerCase() == "false") {
      content = false;
    } else if (content[content.length - 1].toLowerCase() == "true") {
      content = true;
    }

    return config[0]
      .updateOne({ "guild.bored": content })
      .then((response) => {
        if (response.modifiedCount) {
          const embeds = new EmbedBuilder().setDescription(`Successfuly set bored to **${content}**`).setColor(0x00ff00);

          msg.channel.send({ embeds: [embeds] });
        } else {
          const embeds = new EmbedBuilder().setDescription(`Failed to set bored into **${content}**`).setColor(0xff0000);

          msg.channel.send({ embeds: [embeds] });
        }
      })
      .catch((error) => {
        if (error.message.includes("Cast to Boolean failed for value")) {
          const embeds = new EmbedBuilder().setDescription("Value must be Boolean E.g " + "`True` or `False`").setColor(0xff0000);

          msg.channel.send({ embeds: [embeds] });
        }
      });
  }

  if (msg.content.includes("bored status")) {
    const bored = String(config[0].guild.bored);

    const embeds = new EmbedBuilder()
      .setAuthor({ name: msg.member.user.username, iconURL: msg.member.displayAvatarURL() })
      .setTitle("Bored Status")
      .addFields({ name: "Status", value: `**${bored}**` })
      .setColor(0x00ff00);

    msg.channel.send({ embeds: [embeds] });
  }

  if (!config[0].guild.bored) return;

  axios
    .get("https://www.boredapi.com/api/activity")
    .then((response) => {
      msg.reply(`I suggest you to ${response.data.activity.toLowerCase()}`);
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = { bored };

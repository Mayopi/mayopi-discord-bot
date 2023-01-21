const { Config } = require("../models/Configuration");
const { EmbedBuilder } = require("discord.js");
const { author } = require("../config.json");

const addPrefix = async (msg) => {
  let content = msg.content.split(" ");
  content = content[content.length - 1];

  Config.updateOne(
    { "guild.guildId": msg.guildId },
    {
      $push: { "guild.prefix": content },
    }
  )
    .then((val) => {
      if (val.acknowledged) {
        msg.reply(`> successfully adding new prefix ${content}`);
      } else {
        msg.reply(`> failed adding new prefix ${content}`);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const showPrefix = async (msg, client) => {
  const config = await Config.find({ "guild.guildId": msg.guildId });

  const prefixes = config[0].guild.prefix.map((pre) => {
    return {
      name: pre,
      value: `use case: ${pre} ping`,
    };
  });

  const embeds = new EmbedBuilder()
    .setTitle("Prefix List")
    .setThumbnail(client.user.displayAvatarURL())
    .addFields(prefixes)
    .setAuthor({ name: msg.member.user.username, iconURL: msg.member.displayAvatarURL() })
    .setFooter({ text: "Powered by NodeJS", iconURL: "https://cdn.changelog.com/uploads/icons/topics/Wg/icon_small.png?v=63684546142" })
    .setTimestamp(Date.now());

  msg.channel.send({ embeds: [embeds] });
};

const removePrefix = (msg) => {
  let content = msg.content.split(" ");

  content = content[content.length - 1];
  if (msg.author.id === author) {
    msg.reply("> Authorized");
    Config.updateOne(
      { "guild.guildId": msg.guildId },
      {
        $pull: { "guild.prefix": content },
      }
    )
      .then((val) => {
        console.log(val);
        if (val.acknowledged) {
          msg.reply(`> Successfully removed prefix ${content}`);
        } else {
          msg.reply(`> Failed removed prefix ${content}`);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    msg.reply("> you are Unauthorized to remove any prefixes");
    msg.reply("> Terminating current process");
  }
};

module.exports = { addPrefix, showPrefix, removePrefix };

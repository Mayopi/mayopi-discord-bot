const { joinVoiceChannel, getVoiceConnection } = require("@discordjs/voice");
const { author } = require("../config.json");

const join = async (channelId, adapterCreator, msg) => {
  const guildId = msg.guild.id;

  try {
    const connection = joinVoiceChannel({
      channelId,
      guildId,
      adapterCreator,
    });

    if (msg.author.id === author) {
      msg.channel.send("hello my fellas peasant, oh i mean Its my majesty to gracing me with your presence, papa");
    } else {
      msg.channel.send("hello my fellas peasant");
    }

    msg.react("✅");

    return connection;
  } catch (error) {
    if (error.message === "Cannot read properties of null (reading 'id')") {
      msg.reply("How am i supposed to join a member if they were not in a voice channel?");
    }
  }
};

module.exports = { join };

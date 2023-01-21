const { SlashCommandBuilder } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");
const { author } = require("../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("join")
    .setDescription("join a voice channel")
    .addChannelOption((option) => option.setName("channel").setDescription("channel to joined into").setRequired(false)),

  async execute(interaction) {
    const channel = interaction.options.getChannel("channel") || "How am i supposed to join a member if they were not in a voice channel?";

    const guildId = interaction.guild.id;
    const channelId = (interaction.member.voice.channel && interaction.member.voice.channel.id) || "How am i supposed to join a member if they were not in a voice channel?";

    try {
      if (channelId === "How am i supposed to join a member if they were not in a voice channel?" && channel === "How am i supposed to join a member if they were not in a voice channel?") throw Error(channelId);

      if (typeof channel === "object") {
        joinVoiceChannel({
          channelId: channel.id,
          guildId,
          adapterCreator: interaction.guild.voiceAdapterCreator,
        });
      } else {
        joinVoiceChannel({
          channelId: channelId,
          guildId,
          adapterCreator: interaction.guild.voiceAdapterCreator,
        });
      }

      if (interaction.member.id === author) {
        interaction.reply("hello my fellas peasant, oh i mean Its my majesty to gracing me with your presence, papa");
      } else {
        interaction.reply("hello my fellas peasant");
      }
    } catch (error) {
      interaction.reply(error.message);
    }
  },
};

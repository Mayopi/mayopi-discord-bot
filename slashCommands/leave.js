const { SlashCommandBuilder } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder().setName("leave").setDescription("leave an existing connection"),

  async execute(interaction) {
    try {
      const guildId = interaction.guild.id;
      const connection = getVoiceConnection(guildId);

      const channelId = (interaction.member.voice.channel && interaction.member.voice.channel.id) || false;

      if (!connection) throw Error("bruh.. Im not connected to any voice channel");

      if (!channelId || interaction.member.voice.channel.id !== connection.joinConfig.channelId) throw Error("You must join a voice channel within me");

      if (connection) {
        interaction.reply("How dare you to fuck me off-");
        connection.destroy();
      }
    } catch (error) {
      interaction.reply(error.message);
    }
  },
};

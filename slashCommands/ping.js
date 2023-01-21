const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Replies with pong includes latency"),

  async execute(interaction) {
    const latency = Date.now() - interaction.createdTimestamp;
    await interaction.reply("> Pong!\n> Latency: `" + latency + "ms`");
  },
};

const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const { createPollingToken } = require("../utilities/handlePolling");

const { Polling } = require("../models/Polling");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("review")
    .setDescription("review recruitment")
    .addStringOption((option) => option.setName("name").setDescription("Recruitmen Avatar Name").setRequired(true))
    .addStringOption((option) => option.setName("description").setDescription("add custom description for the polling").setRequired(true).setMaxLength(2000)),

  async execute(interaction) {
    try {
      const name = interaction.options.getString("name");
      const descriptions = interaction.options.getString("description");

      const token = createPollingToken();

      const owner = await interaction.guild.fetchOwner();

      await Polling.create({
        "guild.name": interaction.guild.name,
        "guild.owner.username": owner.user.username,
        "guild.owner.userID": owner.user.id,
        "guild.id": interaction.guildId,
        "ballot.username": interaction.member.user.username,
        "ballot.userID": interaction.member.user.id,
        description: descriptions,
        name,
        "avatar.username": name,
        "token.value": token,
      });

      const polling = await Polling.findOne({ "token.value": token });
      const expired = new Date(Number(polling.token.expired)).toLocaleString();

      const embeds = new EmbedBuilder()
        .setTitle(name)
        .setAuthor({ name: interaction.member.user.username, iconURL: interaction.member.displayAvatarURL() })
        .addFields(
          {
            name: "Pengaju Review",
            value: interaction.member.user.username,
          },
          {
            name: "Tanggal Expired",
            value: expired,
          },
          {
            name: "Token Polling",
            value: polling.token.value,
          }
        )
        .setDescription(descriptions)
        .setTimestamp(Date.now())
        .setColor("White")
        .setFooter({ text: token });

      const agree = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("agree-polling").setLabel("Kalem").setStyle(ButtonStyle.Success));

      const disagree = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("disagree-polling").setLabel("Bermasalah").setStyle(ButtonStyle.Danger));

      interaction.reply({ embeds: [embeds], components: [agree, disagree] });
    } catch (error) {
      console.log(error);
    }
  },
};

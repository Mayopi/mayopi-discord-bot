const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("news")
    .setDescription("Send a report message through bot into specific channel")
    .addChannelOption((option) => option.setName("channel").setDescription("select a channel name").setRequired(true))
    .addStringOption((option) => option.setName("title").setDescription("Title of the news").setRequired(true))
    .addStringOption((option) => option.setName("text").setDescription("Report Text").setRequired(true)),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply("You don't have the permission to send News Message");

    const channel = interaction.options.getChannel("channel");
    const text = interaction.options.getString("text");
    const title = interaction.options.getString("title");

    const embeds = new EmbedBuilder()
      .setTitle(title)
      .setDescription("```" + text + "```")
      .addFields({ name: "Author", value: interaction.member.user.username })
      .setFooter({ text: new Date().toLocaleString() })
      .setColor("White");

    channel.send({ embeds: [embeds] });

    interaction.reply("Message successfully sended");
  },
};

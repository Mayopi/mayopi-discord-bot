const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Config } = require("../models/Configuration");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("prefix")
    .setDescription("configuration for your guild prefix")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("add a custom prefix")
        .addStringOption((option) => option.setName("prefix").setDescription("your prefix").setRequired(true).setMaxLength(12))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("remove a existing prefix")
        .addStringOption((option) => option.setName("prefix").setDescription("existing prefix").setRequired(true).setMaxLength(12))
    )
    .addSubcommand((subcommand) => subcommand.setName("show").setDescription("show all existing prefix")),
  async execute(interaction) {
    if (interaction.options.getSubcommand() === "add") {
      const prefix = interaction.options.getString("prefix");

      const existPrefix = await Config.find({ "guild.guildId": interaction.guild.id });

      const duplicate = existPrefix[0].guild.prefix.includes(prefix);

      if (duplicate) return interaction.reply("Prefix`" + prefix + "` has already exist");

      Config.updateOne(
        { "guild.guildId": interaction.guild.id },
        {
          $push: { "guild.prefix": prefix },
        }
      )
        .then((response) => {
          interaction.reply("Successfully adding prefix: `" + prefix + "`");
        })
        .catch((error) => {
          interaction.reply(error.message);
        });
    }

    if (interaction.options.getSubcommand() === "remove") {
      const prefix = interaction.options.getString("prefix");

      const config = await Config.find({ "guild.guildId": interaction.guild.id });
      const result = config[0].guild.prefix.includes(prefix);

      if (result) {
        Config.updateOne({ "guild.guildId": interaction.guild.id }, { $pull: { "guild.prefix": prefix } })
          .then((response) => {
            interaction.reply("Successfully removed prefix: `" + prefix + "`");
          })
          .catch((error) => {
            interaction.reply(error.message);
          });
      } else {
        interaction.reply(`You cannot delete something that doesn't exist`);
      }
    }

    if (interaction.options.getSubcommand() === "show") {
      const config = await Config.find({ "guild.guildId": interaction.guild.id });
      const client = interaction.client;
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
        .setAuthor({ name: interaction.member.user.username, iconURL: interaction.member.displayAvatarURL() })
        .setFooter({ text: "Powered by NodeJS", iconURL: "https://cdn.changelog.com/uploads/icons/topics/Wg/icon_small.png?v=63684546142" })
        .setTimestamp(Date.now())
        .setColor(0x999999);

      interaction.reply({ embeds: [embeds] });
    }
  },
};

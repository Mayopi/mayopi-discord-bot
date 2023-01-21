const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("analysis")
    .setDescription("process and analyzed your text input")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("language-detection")
        .setDescription("detect a certain language of text")
        .addStringOption((option) => option.setName("text").setDescription("your text").setRequired(true).setMaxLength(2000))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("entity-recognition")
        .setDescription("identifying and classifying named entities in text")
        .addStringOption((option) => option.setName("text").setDescription("your text").setRequired(true).setMaxLength(6000))
        .addStringOption((option) => option.setName("language").setDescription("Language Type").setRequired(true).setMaxLength(20))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("summarize")
        .setDescription("summarize your long text")
        .addStringOption((option) => option.setName("text").setDescription("your text").setRequired(true).setMaxLength(6000))
        .addStringOption((option) => option.setName("language").setDescription("Language Type").setRequired(true).setMaxLength(20))
        .addNumberOption((option) => option.setName("percentage").setDescription("Content Percentage of the original text").setRequired(true).setMaxValue(100))
    ),

  async execute(interaction) {
    if (interaction.options.getSubcommand() === "language-detection") {
      const data = interaction.options.getString("text");
      //   interaction.reply(data);

      const options = {
        method: "POST",
        url: "https://text-analysis12.p.rapidapi.com/language-detection/api/v1.1",
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": "da5575cbabmshf4b02496e9761f2p1e7edfjsn7a0ee3fcae2a",
          "X-RapidAPI-Host": "text-analysis12.p.rapidapi.com",
        },
        data: `{"text": "${data}"}`,
      };

      axios
        .request(options)
        .then(function (response) {
          if (!response.data.ok) {
            return interaction.reply(response.data.msg);
          }
          const client = interaction.client;

          const getLang = (obj) => {
            const langPairs = [];
            for (const lang in obj) {
              langPairs.push({ name: lang, value: obj[lang] });
            }

            return langPairs;
          };

          const data = getLang(response.data.language_probability);

          const fields = data.map((field) => {
            return {
              name: `${field.name} Confidence`,
              value: field.value,
            };
          });

          const embeds = new EmbedBuilder()
            .setTitle("Language Detection")
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(fields)
            .setAuthor({ name: interaction.member.user.username, iconURL: interaction.member.displayAvatarURL() })
            .setFooter({ text: "Powered by NodeJS", iconURL: "https://cdn.changelog.com/uploads/icons/topics/Wg/icon_small.png?v=63684546142" })
            .setTimestamp(Date.now())
            .setColor(0x999999);

          interaction.reply({ embeds: [embeds] });
        })
        .catch(function (error) {
          console.error(error);
        });
    }

    if (interaction.options.getSubcommand() === "entity-recognition") {
      const text = interaction.options.getString("text");
      const language = interaction.options.getString("language");

      const client = interaction.client;

      const options = {
        method: "POST",
        url: "https://text-analysis12.p.rapidapi.com/ner/api/v1.1",
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": "da5575cbabmshf4b02496e9761f2p1e7edfjsn7a0ee3fcae2a",
          "X-RapidAPI-Host": "text-analysis12.p.rapidapi.com",
        },
        data: `{"language":"${language}","text":"${text}"}`,
      };

      axios
        .request(options)
        .then(function (response) {
          if (!response.data.ok) {
            return interaction.reply(response.data.msg);
          }
          const fields = response.data.ner.map((ent) => {
            return {
              name: ent.entity,
              value: ent.label,
              inline: true,
            };
          });

          const embeds = new EmbedBuilder()
            .setTitle("Entity Recognition")
            .setDescription("**text:** `" + text + "`")
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(fields)
            .setAuthor({ name: interaction.member.user.username, iconURL: interaction.member.displayAvatarURL() })
            .setFooter({ text: "Powered by NodeJS", iconURL: "https://cdn.changelog.com/uploads/icons/topics/Wg/icon_small.png?v=63684546142" })
            .setTimestamp(Date.now())
            .setColor(0x999999);

          interaction.reply({ embeds: [embeds] });
        })
        .catch(function (error) {
          console.error(error);
        });
    }

    if (interaction.options.getSubcommand() === "summarize") {
      const text = interaction.options.getString("text");
      const language = interaction.options.getString("language");
      const percentage = interaction.options.getNumber("percentage");

      const client = interaction.client;

      const options = {
        method: "POST",
        url: "https://text-analysis12.p.rapidapi.com/summarize-text/api/v1.1",
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": "da5575cbabmshf4b02496e9761f2p1e7edfjsn7a0ee3fcae2a",
          "X-RapidAPI-Host": "text-analysis12.p.rapidapi.com",
        },
        data: `{"language":"${language}","summary_percent":${percentage},"text":"${text}"}`,
      };

      axios
        .request(options)
        .then(function (response) {
          if (!response.data.ok) {
            return interaction.reply(response.data.msg);
          }
          console.log(response.data.summary.length);

          if (response.data.summary.length < 1950) {
            const embeds = new EmbedBuilder()
              .setTitle("Language Detection")
              .setThumbnail(client.user.displayAvatarURL())
              .setDescription(`**Summary:** ${response.data.summary}`)
              .setAuthor({ name: interaction.member.user.username, iconURL: interaction.member.displayAvatarURL() })
              .setFooter({ text: "Powered by NodeJS", iconURL: "https://cdn.changelog.com/uploads/icons/topics/Wg/icon_small.png?v=63684546142" })
              .setTimestamp(Date.now())
              .setColor(0x999999);

            interaction.reply({ embeds: [embeds] });
          } else {
            interaction.reply("Your Text was too long, Max character is 2000 characters");
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  },
};

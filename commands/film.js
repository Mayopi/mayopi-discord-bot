require("dotenv").config();
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const axios = require("axios");

const getFilm = (msg, client) => {
  let content = msg.content.split("film ");
  content = content[content.length - 1];

  axios
    .get(`https://omdbapi.com/`, {
      headers: { Accept: "application/json", "Accept-Encoding": "identity" },
      params: { trophies: true, apikey: process.env.omdbapiKey, s: content },
    })
    .then((response) => {
      if (response.data.Response === "False") throw new Error(response.data.Error);
      const data = response.data.Search[0];

      const embeds = new EmbedBuilder()
        .setAuthor({ name: msg.member.user.username, iconURL: msg.member.displayAvatarURL() })
        .setThumbnail(client.user.displayAvatarURL())
        .addFields(
          {
            name: "Title",
            value: data.Title,
          },
          {
            name: "Year",
            value: data.Year,
          },
          {
            name: "Type",
            value: data.Type,
          },
          {
            name: "imdbID",
            value: data.imdbID,
          }
        )
        .setImage(data.Poster)
        .setFooter({ text: "Powered By NodeJS", iconURL: "https://cdn.changelog.com/uploads/icons/topics/Wg/icon_small.png?v=63684546142" })
        .setTimestamp(Date.now())
        .setColor("White");

      const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("detail-film").setLabel("Details").setStyle(ButtonStyle.Primary));

      msg.channel.send({ embeds: [embeds], components: [row] });
    })
    .catch((error) => {
      console.log(error);
      msg.reply(`${error.message} with Query: ${content}`);
    });
};

const getDetailFilm = (interaction, client) => {
  const fields = interaction.message.embeds[0].data.fields;
  axios
    .get("https://omdbapi.com/", {
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "identity",
      },
      params: {
        trophies: true,
        apikey: omdbapiKey,
        i: fields[fields.length - 1].value,
      },
    })
    .then((response) => {
      const data = response.data;

      if (data.Response === "False") throw new Error(data.Error);

      const embeds = new EmbedBuilder()
        .setAuthor({ name: interaction.member.user.username, iconURL: interaction.member.displayAvatarURL() })
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(`**Synopsis**\n\n${data.Plot}`)
        .addFields(
          {
            name: "Title",
            value: data.Title,
            inline: true,
          },
          {
            name: "Year",
            value: data.Year,
            inline: true,
          },
          {
            name: "Type",
            value: data.Type,
            inline: true,
          },
          {
            name: "imdbID",
            value: data.imdbID,
            inline: true,
          },
          {
            name: "Released",
            value: data.Released,
            inline: true,
          },
          {
            name: "Language",
            value: data.Language,
            inline: true,
          },
          {
            name: "Rating",
            value: data.imdbRating,
            inline: true,
          },
          {
            name: "Director",
            value: data.Director,
            inline: true,
          },
          {
            name: "Actors",
            value: data.Actors,
            inline: true,
          },
          {
            name: "Genre",
            value: data.Genre,
            inline: true,
          },
          {
            name: "Awards",
            value: data.Awards,
            inline: true,
          },
          {
            name: "Poster Link",
            value: data.Poster,
          }
        )
        .setImage(data.Poster)
        .setFooter({ text: "Powered By NodeJS", iconURL: "https://cdn.changelog.com/uploads/icons/topics/Wg/icon_small.png?v=63684546142" })
        .setTimestamp(Date.now())
        .setColor("White");

      interaction.reply({ embeds: [embeds] });
    })
    .catch((error) => {
      // console.log(error.response.data.Error);
      interaction.reply(error.response.data.Error);
    });
};

module.exports = { getFilm, getDetailFilm };

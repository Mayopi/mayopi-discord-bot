const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

const nsfw = (msg, client) => {
  const channel = msg.channel;
  let content = msg.content.split("nsfw ");
  content = content[content.length - 1];

  if (!channel.nsfw) {
    return msg.reply("B-baka... you cannot use this feature in non NSFW channel");
  }
  axios
    .get("https://quality-porn.p.rapidapi.com/search", {
      headers: {
        "X-RapidAPI-Key": "da5575cbabmshf4b02496e9761f2p1e7edfjsn7a0ee3fcae2a",
        "X-RapidAPI-Host": "quality-porn.p.rapidapi.com",
        Accept: "application/json",
        "Accept-Encoding": "identity",
      },
      params: {
        trophies: true,
        query: content,
        quality: "1080p",
        page: "1",
        timeout: "5000",
      },
    })
    .then((response) => {
      const rawData = response.data.data[0].links;

      rawData.forEach((data) => {
        const embeds = new EmbedBuilder()
          .setAuthor({ name: msg.member.user.username, iconURL: msg.member.displayAvatarURL() })
          .setThumbnail(client.user.displayAvatarURL())
          .addFields(
            {
              name: "Title",
              value: data.title ? data.title : "N/A",
            },
            {
              name: "Duration",
              value: data.duration ? data.duration : "N/A",
              inline: true,
            },
            {
              name: "Quality",
              value: data.quality ? data.quality : "N/A",
              inline: true,
            },
            {
              name: "Views",
              value: data.views ? data.views : "N/A",
              inline: true,
            },
            {
              name: "Link",
              value: data.url,
            }
          )
          .setImage(data.image)
          .setFooter({ text: "Powered By NodeJS", iconURL: "https://cdn.changelog.com/uploads/icons/topics/Wg/icon_small.png?v=63684546142" })
          .setTimestamp(Date.now())
          .setColor("White");

        msg.channel.send({ embeds: [embeds] });
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = { nsfw };

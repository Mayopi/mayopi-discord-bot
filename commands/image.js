const axios = require("axios");
const { EmbedBuilder } = require("discord.js");

const sendImage = (msg, client) => {
  const wordArray = msg.content.split("send image");
  const content = wordArray[wordArray.length - 1];

  const options = {
    method: "GET",
    url: "https://bing-image-search1.p.rapidapi.com/images/search",
    params: { q: content },
    headers: {
      "X-RapidAPI-Key": "da5575cbabmshf4b02496e9761f2p1e7edfjsn7a0ee3fcae2a",
      "X-RapidAPI-Host": "bing-image-search1.p.rapidapi.com",
    },
  };

  axios
    .request(options)
    .then(function (response) {
      const image = response.data.value[0].contentUrl;
      const height = String(response.data.value[0].height);
      const width = String(response.data.value[0].width);

      const embeds = new EmbedBuilder()
        .setTitle(content)
        .setDescription(response.data.value[0].name)
        .setAuthor({ name: msg.member.user.username, iconURL: msg.member.displayAvatarURL() })
        .setThumbnail(client.user.displayAvatarURL())
        .addFields(
          {
            name: "Height",
            value: height,
            inline: true,
          },
          {
            name: "Width",
            value: width,
            inline: true,
          },
          {
            name: "Detail Link",
            value: image,
          }
        )
        .setImage(image)
        .setColor("White")
        .setFooter({ text: "Powered By NodeJS", iconURL: "https://cdn.changelog.com/uploads/icons/topics/Wg/icon_small.png?v=63684546142" })
        .setTimestamp(Date.now());

      msg.reply({ content: `Processing your request **${content}**`, embeds: [embeds] });
      // msg.channel.send({ files: [response.data.value[0].contentUrl] });
    })
    .catch(function (error) {
      console.error(error);
    });
};

module.exports = { sendImage };

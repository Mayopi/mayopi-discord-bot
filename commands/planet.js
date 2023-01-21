const axios = require("axios");
const { EmbedBuilder } = require("discord.js");

const getPlanet = (msg, client) => {
  let content = msg.content.split("planet ");
  content = content[content.length - 1];

  const options = {
    method: "GET",
    url: "https://planets-info-by-newbapi.p.rapidapi.com/api/v1/planet/list",
    headers: {
      "X-RapidAPI-Key": "da5575cbabmshf4b02496e9761f2p1e7edfjsn7a0ee3fcae2a",
      "X-RapidAPI-Host": "planets-info-by-newbapi.p.rapidapi.com",
    },
  };

  axios
    .request(options)
    .then(function (response) {
      const names = ["Saturn", "Jupiter", "Uranus", "Neptune", "Venus", "Earth", "Mars", "Mercury"];

      if (!names.some((name) => name.toLowerCase() == content.toLowerCase())) {
        throw Error(`Error 404! Planet ${content} is Not Found!`);
      } else {
        response.data.map((data) => {
          if (data.name.toLowerCase() == content.toLowerCase()) {
            content = content.toLowerCase();
            let firstChar = content.charAt(0);
            let upperCaseFirstChar = firstChar.toUpperCase();

            content = content.replace(firstChar, upperCaseFirstChar);
            const embeds = new EmbedBuilder()
              .setTitle(content)
              .addFields(
                {
                  name: "Mass",
                  value: data.basicDetails[0].mass,
                  inline: true,
                },
                {
                  name: "Volume",
                  value: data.basicDetails[0].volume,
                  inline: true,
                },
                {
                  name: "Link",
                  value: data.wikiLink,
                  inline: true,
                }
              )
              .setDescription(data.description)
              .setColor(msg.member.displayHexColor)
              .setThumbnail(client.user.displayAvatarURL())
              .setAuthor({ name: msg.member.user.username, iconURL: msg.member.displayAvatarURL() })
              .setImage(data.imgSrc[0].img)
              .setTimestamp(Date.now())
              .setFooter({ text: "Powered by NodeJS", iconURL: "https://cdn.changelog.com/uploads/icons/topics/Wg/icon_small.png?v=63684546142" });

            return msg.channel.send({ embeds: [embeds] });
          }
        });
      }
    })
    .catch(function (error) {
      msg.reply(error.message);
    });
};

module.exports = { getPlanet };

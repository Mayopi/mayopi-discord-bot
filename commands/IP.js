require("dotenv").config();
const { EmbedBuilder } = require("discord.js");
const axios = require("axios");
const { writeFileSync } = require("fs");

const trackIP = (msg) => {
  let content = msg.content.split("track ");
  content = content[content.length - 1];

  axios
    .get("https://api.bigdatacloud.net/data/ip-geolocation", {
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "identity",
      },
      params: {
        trophies: true,
        key: process.env.IPGeolocationKey,
        ip: content,
      },
    })
    .then((response) => {
      msg.reply(
        '```json\n{\n   "IP": "' +
          response.data.ip +
          '",\n   "Location": {\n       "Contry": "' +
          response.data.country.isoNameFull +
          '",\n       "Principal Subdivision": "' +
          response.data.location.principalSubdivision +
          '",\n       "city": "' +
          response.data.location.city +
          '"\n  },\n    "Coordinates": {\n       "Latitude": "' +
          response.data.location.latitude +
          '",\n       "Longitude": "' +
          response.data.location.longitude +
          '"\n  }\n}```'
      );

      writeFileSync("./data/IP.json", JSON.stringify(response.data));

      msg.reply({ content: "Download to see full details, Recommended to use a third party apps for JSON viewer in mobile apps or if you are using desktop you may need a JSON Viewer extension on google chrome", files: ["./data/IP.json"] });
    })

    .catch((error) => {
      console.log(error);
    });
};

const getLocation = (msg, client) => {
  let content = msg.content.split(" ");
  const latitude = content[content.length - 2];
  const longitude = content[content.length - 1];

  const filter = (m) => {
    return m.author.id === msg.author.id;
  };
  msg.reply("This feature are exposing your input location, are you sure to continue? please type `yes` or `no`");
  msg.channel
    .awaitMessages({ filter, max: 1, time: 30000, errors: ["time"] })
    .then((collected) => {
      const content = collected.first().content.toLowerCase();

      if (content !== "yes" && content !== "no") {
        msg.reply("please type a correct answer either `yes` or `no`");
      }

      if (content === "yes") {
        axios
          .get("https://api.bigdatacloud.net/data/reverse-geocode-client", {
            headers: {
              Accept: "application/json",
              "Accept-Encoding": "identity",
            },
            params: {
              latitude,
              longitude,
            },
          })
          .then((resolve) => {
            const data = resolve.data;
            const embeds = new EmbedBuilder()
              .setAuthor({ name: msg.member.user.username, iconURL: msg.member.displayAvatarURL() })
              .setTitle("Geocode Location")
              .setDescription(`This location info is based on\n\n> Latitude: **${data.latitude}**\n> Longitude: **${data.longitude}**`)
              .setThumbnail(client.user.displayAvatarURL())
              .addFields(
                {
                  name: "Continent",
                  value: data.continent,
                  inline: true,
                },
                {
                  name: "Country",
                  value: data.countryName,
                  inline: true,
                },
                {
                  name: "Principal Subdivision",
                  value: data.principalSubdivision,
                  inline: false,
                },
                {
                  name: "City",
                  value: data.city,
                  inline: true,
                }
              )
              .setImage(data.Poster)
              .setFooter({ text: "Powered By NodeJS", iconURL: "https://cdn.changelog.com/uploads/icons/topics/Wg/icon_small.png?v=63684546142" })
              .setTimestamp(Date.now())
              .setColor("White");

            msg.channel.send({ embeds: [embeds] });
          });
      } else {
        msg.reply("terminating current process");
      }
    })
    .catch((error) => {
      console.log(error);
      msg.reply("Times up, terminating current process");
    });
};

module.exports = { trackIP, getLocation };

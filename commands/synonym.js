const axios = require("axios");
const { EmbedBuilder } = require("discord.js");

const synonym = (msg, client) => {
  let content = msg.content.split("synonym ");
  content = content[content.length - 1];

  const options = {
    method: "GET",
    url: "https://thesaurus-by-api-ninjas.p.rapidapi.com/v1/thesaurus",
    params: { word: content, trophies: true },
    headers: {
      "X-RapidAPI-Key": "da5575cbabmshf4b02496e9761f2p1e7edfjsn7a0ee3fcae2a",
      "X-RapidAPI-Host": "thesaurus-by-api-ninjas.p.rapidapi.com",
      Accept: "application/json",
      "Accept-Encoding": "identity",
    },
  };

  axios
    .get(options.url, {
      headers: options.headers,
      params: options.params,
    })
    .then((response) => {
      const synonyms = response.data.synonyms;

      let fields = synonyms.map((synonym, index) => {
        return {
          name: `Synonym ${index}`,
          value: synonym,
        };
      });

      fields = fields.length > 25 ? fields.splice(0, 25) : fields;

      const embeds = new EmbedBuilder()
        .setAuthor({ name: msg.member.user.username, iconURL: msg.member.displayAvatarURL() })
        .setThumbnail(client.user.displayAvatarURL())
        .addFields(fields)
        .setFooter({ text: "Powered By NodeJS", iconURL: "https://cdn.changelog.com/uploads/icons/topics/Wg/icon_small.png?v=63684546142" })
        .setTimestamp(Date.now())
        .setColor("White");

      msg.reply({ embeds: [embeds] });
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = { synonym };

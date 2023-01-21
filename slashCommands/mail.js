const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mail")
    .setDescription("get a gmail feature")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("send")
        .setDescription("send a message in email")
        .addStringOption((option) => option.setName("message").setDescription("Your Message").setRequired(true).setMaxLength(6000))
        .addStringOption((option) => option.setName("to").setDescription("send message to?").setRequired(true))
        .addStringOption((option) => option.setName("from").setDescription("Your Email Address").setRequired(true))
        .addStringOption((option) => option.setName("subject").setDescription("Subject for your message").setRequired(true).setMaxLength(50))
    ),

  async execute(interaction) {
    if (interaction.options.getSubcommand() === "send") {
      const message = interaction.options.getString("message");
      const to = interaction.options.getString("to");
      const from = interaction.options.getString("from");
      const subject = interaction.options.getString("subject");

      const options = {
        method: "POST",
        url: "https://rapidprod-sendgrid-v1.p.rapidapi.com/mail/send",
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": "da5575cbabmshf4b02496e9761f2p1e7edfjsn7a0ee3fcae2a",
          "X-RapidAPI-Host": "rapidprod-sendgrid-v1.p.rapidapi.com",
        },
        data: `{"personalizations":[{"to":[{"email":"${to}"}],"subject":"${subject}"}],"from":{"email":"${from}"},"content":[{"type":"text/plain","value":"${message}"}]}`,
      };
      axios
        .request(options)
        .then(function (response) {
          interaction.reply(`message was successfully sending to ${to}`);
        })
        .catch(function (error) {
          console.error(error);
          interaction.reply(error.message);
        });
    }
  },
};

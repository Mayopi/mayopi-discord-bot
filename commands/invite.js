const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

const invite = (msg, client) => {
  const QR = new AttachmentBuilder("./assets/img/invitation.jpeg");

  const embeds = new EmbedBuilder()
    .setTitle("Humbled and Honored to be invited - Looking forward to an amazing event!")
    .addFields(
      {
        name: "Invitation Link",
        value: "https://discord.com/api/oauth2/authorize?client_id=984027246601842688&permissions=8&scope=bot%20applications.commands",
      },
      {
        name: "Requested By",
        value: msg.member.user.username,
      },
      {
        name: "Developed By",
        value: "mayo#1692",
      }
    )
    .setAuthor({ name: msg.member.user.username, iconURL: msg.member.displayAvatarURL() })
    .setThumbnail(client.user.displayAvatarURL())
    .setImage("attachment://invitation.jpeg")
    .setDescription("This bot is currently in development phase, so please be gentle with me\n\nTo add me in your server, you can scan the QR below or click the Invitation Link")
    .setColor(msg.member.displayHexColor)
    .setTimestamp(Date.now())
    .setFooter({ text: "Powered By NodeJS", iconURL: "https://cdn.changelog.com/uploads/icons/topics/Wg/icon_small.png?v=63684546142" });

  msg.channel.send({ embeds: [embeds], files: [QR] });
};

module.exports = { invite };

const { EmbedBuilder } = require("discord.js");

const regression = (msg) => {
  const embeds = new EmbedBuilder().setColor("Aqua").setTitle("Linear Regression").setDescription(`
    y = a + bx
    a = (Σy)(Σx²) - (Σx)(Σxy)
          ———————————
                  n(Σx²)(Σx)²
    
    b = n(Σxy) - (Σx)(Σy)
          ———————————
                  n(Σx²)(Σx)²
`);

  msg.channel.send({ embeds: [embeds] });
};

module.exports = { regression };

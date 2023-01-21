const crypto = require("crypto-js");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");

const { Polling } = require("../models/Polling");

const checkPolling = (polling, interaction, userID) => {
  console.log(polling);

  if (polling.agree.participant.some((participant) => participant.userID === userID)) {
    interaction.reply(`${interaction.user.username} sudah review dan hanya bisa dilakukan satu kali untuk setiap user`);
    return false;
  }

  if (polling.disagree.participant.some((participant) => participant.userID === userID)) {
    interaction.reply(`${interaction.user.username} sudah review dan hanya bisa dilakukan satu kali untuk setiap user`);
    return false;
  }

  return true;
};

const checkDMPolling = (polling, message, userID) => {
  if (polling.agree.participant.some((participant) => participant.userID === userID)) {
    message.channel.send(`${message.author.username} sudah review dan hanya bisa dilakukan satu kali untuk setiap user`);
    return false;
  }

  if (polling.disagree.participant.some((participant) => participant.userID === userID)) {
    message.channel.send(`${message.author.username} sudah review dan hanya bisa dilakukan satu kali untuk setiap user`);
    return false;
  }

  return true;
};

const checkDisagree = async (token) => {
  const polling = await Polling.findOne({ "token.value": token });
  return polling.disagree.amount;
};

const checkActive = async (token) => {
  const polling = await Polling.findOne({ "token.value": token });
  return polling.active.status;
};

const sendAdminDM = async (client, token) => {
  const polling = await Polling.findOne({ "token.value": token });
  const guild = client.guilds.cache.get(polling.guild.id);

  if (polling.reported) return;

  let membersWithAdmin = guild.members.cache.filter((member) => {
    let hasAdmin = false;
    if (!member.user.bot) {
      member.roles.cache.forEach((role) => {
        if (role.permissions.has(PermissionsBitField.Flags.Administrator)) hasAdmin = true;
      });
      return hasAdmin;
    }
  });

  const allVoteMember = [];
  polling.disagree.participant.forEach((member) => {
    allVoteMember.push({ name: member.username, value: "Keterangan: **Bermasalah**\nAlasan: ```" + member.reason + "```" });
  });

  polling.agree.participant.forEach((member) => {
    allVoteMember.push({ name: member.username, value: "> Keterangan: **Kalem**" });
  });

  allVoteMember.splice(25);

  if (allVoteMember.length < 1) return;

  await membersWithAdmin.map((m) => {
    client.users
      .fetch(m.user.id)
      .then((user) => {
        user
          .createDM()
          .then((dm) => {
            const embeds = new EmbedBuilder()
              .setTitle(`Review ${polling.name} Selesai`)
              .setDescription("ini adalah hasil review dari ketentuan detail review berikut:\nNama Review: ```" + polling.name + "```\nToken: ```" + polling.token.value + "```\nTanggal Review Dibuat: ```" + polling.timeStamp + "```")
              .addFields(allVoteMember)
              .setColor("White");

            dm.send({ embeds: [embeds] });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  });

  polling.reported = true;

  polling.save();
};

const createPollingToken = () => {
  const token = crypto.lib.WordArray.random(4).toString();
  return token;
};

const agreePoll = async (interaction, client) => {
  const token = interaction.message.embeds[0].data.footer.text;

  const username = interaction.user.username;
  const userID = interaction.user.id;

  const polling = await Polling.findOne({ "token.value": token });

  if (!polling) return interaction.reply("Review dengan token `" + token + "` tidak ditemukan! kemungkinan voting sudah dihapus oleh developer, hubungi developer untuk penanganan lebih lanjut");

  if (polling.token.expired < Date.now()) {
    await sendAdminDM(client, token);
    return interaction.reply("<@" + userID + "> Token review expired!, review sudah ditutup\n`Token: " + token + "`");
  }

  const checkVote = checkPolling(polling, interaction, userID);
  if (!checkVote) return;

  if ((await checkDisagree(token)) >= 2) {
    await sendAdminDM(client, token);
    return interaction.reply("Target tercapai, Review selesai");
  }

  const active = await checkActive(token);

  if (!active) {
    await sendAdminDM(client, token);
    return interaction.reply("Review sudah tidak aktif!");
  }

  interaction.reply(`DM Berhasil dikirim ke <@${userID}>, silahkan cek DM`);

  client.users.fetch(userID).then((user) => {
    user.createDM().then((dm) => {
      dm.send("**WARNING REVIEW INI HANYA BISA DILAKUKAN SATU KALI UNTUK SETIAP USER**\n> apakah <@" + userID + "> sudah yakin memilih `Kalem`?\n\nketik\n```yes review kalem " + token + "```untuk melanjutkan");
    });
  });
};

const disagreePoll = async (interaction, client) => {
  const token = interaction.message.embeds[0].data.footer.text;

  const userID = interaction.user.id;

  const polling = await Polling.findOne({ "token.value": token });

  if (!polling) return interaction.reply("Review dengan token `" + token + "` tidak ditemukan! kemungkinan review sudah dihapus oleh developer, hubungi developer untuk penanganan lebih lanjut");

  if (polling.token.expired < Date.now()) {
    await sendAdminDM(client, token);
    return interaction.reply("<@" + userID + "> Token review expired!, review sudah ditutup\n`Token: " + token + "`");
  }

  const checkVote = checkPolling(polling, interaction, userID);
  if (!checkVote) return;

  if ((await checkDisagree(token)) >= 2) {
    await sendAdminDM(client, token);
    return interaction.reply("Target tercapai, review selesai");
  }

  const active = await checkActive(token);

  if (!active) {
    await sendAdminDM(client, token);
    return interaction.reply("Review sudah tidak aktif!");
  }

  interaction.reply(`DM Berhasil dikirim ke <@${userID}>, silahkan cek DM`);

  client.users.fetch(userID).then((user) => {
    user.createDM().then((dm) => {
      dm.send(
        "**WARNING REVIEW INI HANYA BISA DILAKUKAN SATU KALI UNTUK SETIAP USER**\n> apakah <@" +
          userID +
          "> sudah yakin memilih `Bermasalah`?\n\nketik `yes review bermasalah` untuk melanjutkan\n\n Jika anda yakin untuk melanjutkan ini adalah token review anda `" +
          token +
          "`"
      );
    });
  });
};

const DMDisagree = async (message, client) => {
  message.channel.send(
    "<@" +
      message.author.id +
      "> Bermasalah, tolong berikan alasannya dengan cara ```<alasan review>|<token review>```\ncontohnya ```ini adalah contoh alasan review|token123```\nPastikan untuk mengetik dengan format yang benar (tidak ada jarak spasi diantara | )"
  );
  const filter = (m) => m.author.id === message.author.id;
  message.channel
    .awaitMessages({ filter, max: 1, time: 300000, errors: ["time"] })
    .then(async (collected) => {
      let reason = collected.first().content.split("|");
      reason = reason[0];
      let token = collected.first().content.split("|");
      token = token[token.length - 1];

      const username = message.author.username;
      const userID = message.author.id;

      const polling = await Polling.findOne({ "token.value": token });

      const checkVote = checkDMPolling(polling, message, userID);
      if (!checkVote) return;

      if (polling.token.expired < Date.now()) {
        await sendAdminDM(client, token);
        return message.channel.reply("<@" + userID + "> Token review expired!, review sudah ditutup\n`Token: " + token + "`");
      }

      if ((await checkDisagree(token)) >= 2) {
        await sendAdminDM(client, token);
        return message.channel.reply("Target tercapai, Review selesai");
      }

      const active = await checkActive(token);

      if (!active) {
        await sendAdminDM(client, token);
        return message.channel.reply("Review sudah tidak aktif!");
      }

      if (!polling) {
        return message.channel.send(`Data gagal dikirim, pastikan untuk menulis format dengan benar dan pastikan token tidak salah`);
      }

      polling.disagree.amount++;
      polling.disagree.participant.push({
        username,
        userID,
        reason,
        votingAt: new Date(),
      });

      polling.save();

      message.channel.send("Data berhasil direkam\n```Reason: " + reason + "\nToken: " + token + "```");

      const guild = client.guilds.cache.get(polling.guild.id);
      const pollingChannel =
        guild.channels.cache.find((channel) => {
          if (channel.name.includes("review") || channel.name.includes("polling")) {
            return channel;
          }
        }) ?? guild.channels.cache.get(guild.systemChannelId);

      pollingChannel.send(`<@${message.author.id}> sudah selesai review`);
    })
    .catch((error) => {
      console.log(error);
      message.channel.send("Waktu habis, hanya diberi waktu 5 menit untuk menuliskan alasannya. tolong ketik **`yes review bermasalah`** kembali untuk menulis ulang alasan");
    });
};

const DMAgree = async (message, client) => {
  const content = message.content.split(" ");
  const token = content[content.length - 1];

  const username = message.author.username;
  const userID = message.author.id;

  const polling = await Polling.findOne({ "token.value": token });

  const checkVote = checkDMPolling(polling, message, userID);
  if (!checkVote) return;

  if (polling.token.expired < Date.now()) {
    await sendAdminDM(client, token);
    return message.channel.reply("<@" + userID + "> Token Review expired!, Review sudah ditutup\n`Token: " + token + "`");
  }

  if ((await checkDisagree(token)) >= 2) {
    await sendAdminDM(client, token);
    return message.channel.reply("Target tercapai, Review selesai");
  }

  const active = await checkActive(token);

  if (!active) {
    await sendAdminDM(client, token);
    return message.channel.reply("Review sudah tidak aktif!");
  }

  if (!polling) {
    return message.channel.send(`Data gagal dikirim, pastikan untuk menulis format dengan benar dan pastikan token tidak salah`);
  }

  polling.agree.amount++;
  polling.agree.participant.push({
    username,
    userID,
    votingAt: new Date(),
  });

  polling.save();

  message.channel.send("Data berhasil direkam");

  const guild = client.guilds.cache.get(polling.guild.id);
  const pollingChannel =
    guild.channels.cache.find((channel) => {
      if (channel.name.includes("review") || channel.name.includes("polling")) {
        return channel;
      }
    }) ?? guild.channels.cache.get(guild.systemChannelId);

  pollingChannel.send(`<@${message.author.id}> sudah selesai review`);
};

const stopPolling = async (message, client) => {
  let token = message.content.split(" ");
  token = token[token.length - 1];
  const polling = await Polling.findOne({ "token.value": token });
  const guild = client.guilds.cache.get(polling.guild.id);
  const admin = guild.members.cache.get(message.author.id);
  if (!admin.permissions.has(PermissionsBitField.Flags.Administrator)) return message.reply("Kamu tidak punya akses untuk menghentikan review");

  if (!polling) return message.reply("Review dengan token: `" + token + "` tidak ditemukan");

  if (!polling.active.status) return message.reply("Review telah diberhentikan oleh\n```Author: " + polling.active.author.username + "\nTanggal: " + new Date(Number(polling.active.timeStamp)).toLocaleString() + "```");

  await sendAdminDM(client, token);

  polling.active.status = false;
  polling.active.author.username = message.member.user.username;
  polling.active.author.userID = message.member.user.id;
  polling.active.timeStamp = Date.now();

  polling.save();

  message.reply("Review dengan `Token: " + token + "` berhasil diberhentikan");
};

module.exports = { createPollingToken, agreePoll, disagreePoll, DMDisagree, DMAgree, stopPolling };

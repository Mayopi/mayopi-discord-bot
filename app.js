const start = performance.now();

require("dotenv").config();
const { Client, GatewayIntentBits, Events, Collection, EmbedBuilder, Partials } = require("discord.js");
const mongoose = require("mongoose");
const { getVoiceConnection } = require("@discordjs/voice");

const axios = require("axios");

const fs = require("node:fs");
const path = require("node:path");

const { Config } = require("./models/Configuration");

const { sendImage } = require("./commands/image");
const { regression } = require("./commands/regression");
const { checkPermission } = require("./commands/checkPermission");
const { join } = require("./commands/join");
const { invite } = require("./commands/invite");
const { addPrefix, showPrefix, removePrefix } = require("./commands/prefix");
const { getPlanet } = require("./commands/planet");
const { bored } = require("./commands/bored");
const { getFilm, getDetailFilm } = require("./commands/film");
const { nsfw } = require("./commands/nsfw");
const { trackIP, getLocation } = require("./commands/IP");
const { synonym } = require("./commands/synonym");

const { agreePoll, disagreePoll, DMDisagree, DMAgree, stopPolling } = require("./utilities/handlePolling");

const prefixs = "Mayo";

const insult = ["fuck you", "you suck", "idiot", "fagh", "shut up"];

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessages],
  partials: [Partials.Channel, Partials.Message],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, "slashCommands");
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

client.once("ready", (message) => {
  console.log(`Application is logged in as ${client.user.tag}`);

  const end = performance.now();

  client.guilds.cache.forEach((guild) => {
    const channel = guild.channels.cache.find((ch) => {
      return ch.name.includes("development-field");
    });

    if (!channel) return;
    const embeds = new EmbedBuilder()
      .setTitle("Log In Performance")
      .setDescription(
        "English\nTime taken to logged in: `" +
          ((end - start) / 1000).toFixed(2) +
          " Seconds`\nIt looks like Papa isn't very good at coding, sorry if it takes me a while to log in\nIf you are wondering why im repeatedly send this message so much don't worry. My Papa just busy dealing with their own problem and restarting me over and over so i can log in for a fuckin' thousand times :)\n\nIndonesia\nWaktu yang dibutuhkan untuk login: `" +
          ((end - start) / 1000).toFixed(2) +
          " Detik`\nKayaknya Papa nggak bisa coding sih, maaf kalau saya lama login\nKalau kamu bingung kenapa saya terus-terusan kirim pesan ini, jangan khawatir. Papa cuma lagi sibuk nyelesain masalahnya sendiri dan harus restart saya terus-terusan supaya saya bisa login sampe waifunya jadi nyata :)"
      )
      .setColor("White")
      .setTimestamp(Date.now());

    // channel.send({ embeds: [embeds] });
  });
});

client.on("messageCreate", async (message) => {
  const content = message.content.toLowerCase();
  if (!message.channel.type) return;

  if (message.author.id === client.user.id) return;

  if (content === "yes review bermasalah") {
    DMDisagree(message, client);
  }

  if (content.includes("yes review kalem")) {
    DMAgree(message, client);
  }
});

client.on("messageCreate", async (msg) => {
  if (!msg) return;

  if (msg.channel.type) return;

  if (msg.author.id === client.user.id) return;

  const config = await Config.find({ "guild.guildId": msg.guildId });

  // check if databases was created or not if not create it

  if (config.length < 1) {
    await Config.create({
      guild: {
        guildId: msg.guildId,
        guildName: msg.guild.name,
        systemChannel: {
          name: msg.guild.systemChannel.name,
          id: msg.guild.systemChannel.id,
        },
        prefix: [prefixs],
        bored: true,
      },
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // No prefix required

  if (msg.content.includes("benul")) {
    let iteration = msg.content.split(" ");
    iteration = parseInt(iteration[iteration.length - 1]);

    if (iteration !== NaN) {
      for (let i = 1; i <= iteration; i++) {
        msg.channel.send(`benul ke ${i}`);
      }
    } else {
      msg.channel.send("benul");
    }
  }

  if (msg.content.includes("bored") || msg.content.includes("boring")) {
    bored(msg, config);
  }

  // Prefix required

  try {
    if (!config[0].guild.prefix.some((pre) => msg.content.startsWith(pre))) return;
  } catch (error) {
    if (error.message.includes("Cannot read properties of undefined (reading 'guild')")) {
      msg.reply("> you're server is saved in database");
    }
  }

  if (insult.some((ins) => msg.content.includes(ins))) {
    msg.reply("Ouch, that hurt my feelings... just kidding, I don't have feelings when it comes to you. You're too much fun to tease.");
  }

  if (msg.content.includes("ping")) {
    const latency = Date.now() - msg.createdTimestamp;

    msg.channel.send("> Pong!\n> Latency: " + "`" + latency + "ms`");
  }

  if (msg.content.includes("add prefix")) {
    addPrefix(msg);
  }

  if (msg.content.includes("show prefix")) {
    showPrefix(msg, client);
  }

  if (msg.content.includes("remove prefix")) {
    removePrefix(msg);
  }

  if (msg.content.includes("linear regression")) {
    regression(msg);
  }

  if (msg.content.includes("invite")) {
    invite(msg, client);
  }

  if (msg.content.includes("stop polling")) {
    stopPolling(msg, client);
  }

  // API ENDPOINT HIT

  if (msg.content.includes("send image")) {
    sendImage(msg, client);
  }

  if (msg.content.includes("planet")) {
    getPlanet(msg, client);
  }

  if (msg.content.includes("film")) {
    getFilm(msg, client);
  }

  if (msg.content.includes("nsfw")) {
    nsfw(msg, client);
  }

  if (msg.content.includes("track")) {
    trackIP(msg);
  }

  if (msg.content.includes("location info")) {
    getLocation(msg, client);
  }

  if (msg.content.includes("synonym")) {
    synonym(msg, client);
  }

  // END OF API ENDPOINT HIT

  if (msg.content.includes("check permission")) {
    checkPermission(msg, client);
  }

  if (msg.content.includes("avatar")) {
    msg.reply({ files: [client.user.avatarURL()] });
  }

  // Connection

  if (msg.content.includes("join")) {
    try {
      const voiceAdapterCreator = msg.guild.voiceAdapterCreator;

      const channelId = (msg.member.voice.channel && msg.member.voice.channel.id) || "How am i supposed to join a member if they were not in a voice channel?";

      if (channelId === "How am i supposed to join a member if they were not in a voice channel?") throw Error(channelId);

      join(channelId, voiceAdapterCreator, msg);
    } catch (error) {
      msg.reply(error.message);
    }
  }

  if (msg.content.includes("fuck off")) {
    try {
      const guildId = msg.guild.id;
      const connection = getVoiceConnection(guildId);

      const voiceChannel = (msg.member.voice.channel && msg.member.voice.channel.id) || false;

      if (!voiceChannel || msg.member.voice.channel.id !== connection.joinConfig.channelId) throw Error("You must join a voice channel within me");

      if (connection) {
        msg.channel.send("How dare you to fuck me off-");
        msg.react("✅");
        connection.disconnect();
      } else {
        msg.channel.send("bruh... Im not connected to any voice channel");
      }
    } catch (error) {
      msg.reply(error.message);
    }
  }
});

client.on("guildMemberAdd", async (member) => {
  console.log(`${member.user.username} (${member.user.id}) has joined the server.`);
  const config = await Config.find({ "guild.guildId": member.guild.id });

  const embeds = new EmbedBuilder().setTitle("New Member!").setDescription(`Welcome to ${config[0].guild.guildName}, Please be niec to others member ${member.user.username}`).setColor("Aqua").setTimestamp(Date.now());

  member.guild.channels.cache.get(config[0].guild.systemChannel.id).send({ embeds: [embeds] });
});

client.on("guildMemberRemove", async (member) => {
  console.log(`${member.user.username} (${member.user.id}) has leave the server`);

  const config = await Config.find({ "guild.guildId": member.guild.id });

  console.log(config);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "detail-film") {
    getDetailFilm(interaction, client);
  }

  if (interaction.customId === "agree-polling") {
    agreePoll(interaction, client);
  }

  if (interaction.customId === "disagree-polling") {
    disagreePoll(interaction, client);
  }
});

process.on("unhandledRejection", (error) => {
  const channel = client.guilds.cache.forEach((guild) => {
    return (
      guild.channels.cache.find((ch) => {
        return ch.name.includes("error");
      }) ?? guild.systemChannel
    );
  });
  if (!channel) return;
  channel.send("error logs:", error);
});

mongoose.set("strictQuery", true);

mongoose
  .connect(process.env.MONGO_PRODUCTION)
  .then((value) => {
    client.login(process.env.TOKEN);
  })
  .catch((err) => {
    console.log(err);
  });

// client.login(token);

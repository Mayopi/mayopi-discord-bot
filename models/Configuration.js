const mongoose = require("mongoose");

const configSchema = new mongoose.Schema({
  guild: {
    guildId: {
      type: String,
      required: [true, "Guild ID  is required"],
      unique: true,
    },
    guildName: {
      type: String,
      required: [true, "Guild name is required"],
    },
    systemChannel: {
      name: {
        type: String,
        required: [true, "system channel name is required"],
        default: null,
      },
      id: {
        type: String,
        required: [true, "id of system channel is required"],
        default: null,
        unique: true,
      },
    },

    prefix: {
      type: [String],
      required: [true, "New Prefix are required"],
      maxLenght: [12, "Max lenght of the prefix is 12 character"],
      unique: true,
    },

    bored: {
      type: Boolean,
      default: true,
    },
  },
});

const Config = mongoose.model("config", configSchema);

module.exports = { Config };

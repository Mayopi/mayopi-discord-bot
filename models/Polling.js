const mongoose = require("mongoose");

const pollingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name polling is required"],
  },

  description: {
    type: String,
    required: [true, "description polling is required"],
  },
  guild: {
    name: {
      type: String,
      required: [true, "guild name is required"],
    },

    owner: {
      username: {
        type: String,
        required: [true, "guild owner is required"],
      },

      userID: {
        type: String,
        required: [true, "owner userID is required"],
      },
    },

    id: {
      type: String,
      required: [true, "guild id is required"],
    },
  },

  ballot: {
    username: {
      type: String,
    },

    userID: {
      type: String,
    },
  },

  agree: {
    amount: {
      type: Number,
      default: 0,
    },

    participant: [
      {
        username: {
          type: String,
        },

        userID: {
          type: String,
        },

        votingAt: {
          type: String,
          default: new Date(),
        },
      },
    ],
  },

  disagree: {
    amount: {
      type: Number,
      maxLength: [2, "max number of disagree participant exceeded"],
      default: 0,
    },

    participant: [
      {
        username: {
          type: String,
        },

        userID: {
          type: String,
        },

        votingAt: {
          type: String,
          default: new Date(),
        },

        reason: {
          type: String,
        },
      },
    ],
  },

  token: {
    value: {
      type: String,
      required: [true, "token polling is required"],
      unique: true,
    },

    expired: {
      type: String,
      default: () => Date.now() + 24 * 60 * 60 * 1000,
    },
  },

  avatar: {
    username: {
      type: String,
      required: [true, "avatar username is required"],
    },
  },

  reported: {
    type: Boolean,
    required: [true, "reported polling field is required"],
    default: false,
  },

  active: {
    status: {
      type: Boolean,
      required: [true, "active status is required"],
      default: true,
    },

    timeStamp: {
      type: String,
      required: [true, "timeStamp active is required"],
      default: Date.now(),
    },

    author: {
      username: {
        type: String,
      },

      userID: {
        type: String,
      },
    },
  },

  timeStamp: {
    type: String,
    default: new Date(),
  },
});

const Polling = mongoose.model("polling", pollingSchema);

module.exports = {
  Polling,
};

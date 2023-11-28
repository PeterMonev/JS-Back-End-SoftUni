const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: [4, "Username must be at  least 4 characters"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: [10, "Email must be at  least 4 characters"],
  },
  hashedPassword: { type: String, required: true },
});

userSchema.index(
  { email: 1 },
  {
    collation: {
      locale: "en",
      strength: 2,
    },
  }
);

userSchema.index(
  { email: 1 },
  {
    collation: {
      locale: "en",
      strength: 2,
    },
  }
);

const User = model("User", userSchema);

module.exports = User;

const { Schema, model, Types } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: [3, "Username must be at  least 3 characters"],
  },
  hashedPassword: { type: String, required: true }, 
  likedPlays: {type: [Types.ObjectId], ref: 'Play', default: []},
});

userSchema.index(
  { username: 1 },
  {
    collation: {
      locale: "en",
      strength: 2,
    },
  }
);

const User = model("User", userSchema);

module.exports = User;

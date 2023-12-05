const { Schema, model } = require("mongoose");

const NAME_PATTERN = /^[A-Za-z]+ [A-Za-z]+$/;

const userSchema = new Schema({
  name: {type: String, required: true, validate: {
     validator: (value) => NAME_PATTERN.test(value),
     message: 'Invalid username'
  }},
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: [5, "Username must be at  least 5 characters"],
  },
  hashedPassword: { type: String, required: true },
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

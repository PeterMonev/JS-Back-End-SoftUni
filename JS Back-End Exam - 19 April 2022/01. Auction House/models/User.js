const { Schema, model } = require("mongoose");

const EMAIL_PATTERN = /^([a-zA-Z]+)@([a-zA-Z]+)\.([a-zA-Z]+)$/;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
         return EMAIL_PATTERN.test(value);
      },
      message: 'Invalid Email'
    },
  },
  hashedPassword: { type: String, required: true },
  firstName : {type: String, required: true, minlength: [1,'First Name must be at least 1 character']},
  lastName : {type: String, required: true, minlength: [1,'First Name must be at least 1 character']}
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

const User = model("User", userSchema);

module.exports = User;

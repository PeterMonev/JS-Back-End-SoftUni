const { Schema, model,Types } = require("mongoose");

const EMAIL_PATTERN = /^([a-zA-Z]+)@([a-zA-Z]+)\.([a-zA-Z]+)$/;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value){
        return EMAIL_PATTERN.test(value);
      },
      message: 'Invalid email'
    },
  },
  hashedPassword: { type: String, required: true },
  gender: {type: String, required: true, enum: ['male', 'female']},
  history: {type: [Types.ObjectId], ref: 'Trip', default: []}
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

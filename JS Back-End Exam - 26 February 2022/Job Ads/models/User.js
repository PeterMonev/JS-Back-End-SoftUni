const { Schema, model,Types } = require("mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [
      /^[a-z]+@{1}[a-z]+\.{1}[a-z]{2,3}$/i,
      "Username must be only letters and numbers. No special characters allowed.",
    ],
  },
  hashedPassword: { type: String, required: true },
  skills: { type: String, required: true,maxlength: [40, "Sklills description should be 40 chars long"]},
  myAd: {type: [Types.ObjectId],ref: 'Ad',default: []}
  
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

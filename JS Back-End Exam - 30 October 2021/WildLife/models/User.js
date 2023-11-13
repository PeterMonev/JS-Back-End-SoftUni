const { Schema, model,Types } = require("mongoose");

const EMAIL_PATTERN = /^([a-zA-Z]+)@([a-zA-Z]+)\.([a-zA-Z]+)$/;

const userSchema = new Schema({
  firstName: {type: String, required: true,minlength: [3, 'The first name should be at least 3 characters long']},
  lastName: {type: String, required: true,minlength: [5, 'The last name should be at least 5 characters']},
  email: {
    type: String,
    required: true,
    unique: true,
   validate: {
    validator(value){
      return EMAIL_PATTERN.test(value);
    },
    messages: 'Invalid email'
   }
  },
  hashedPassword: { type: String, required: true },
  myPost: {type: [Types.ObjectId],ref: 'Post', default: []}
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

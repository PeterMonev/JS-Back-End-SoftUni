const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = "dasidos";

async function register(username, password) {
  const existing = await User.findOne({ username }).collation({
    locale: "en",
    strength: 2,
  });
  if (existing) {
    throw new Error("User already registered!");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    hashedPassword,
  });

  return createSession(user);
}

async function login(username, password) {
  const user = await User.findOne({ username }).collation({
    locale: "en",
    strength: 2,
  });
  if (!user) {
    throw new Error("Incorrect username or password");
  }

  const hasMatch = await bcrypt.compare(password, user.hashedPassword);

  if (!hasMatch) {
    throw new Error("Incorrect username or password");
  }

  return createSession(user);
}

function createSession({ _id, username }) {
  const payload = {
    _id,
    username,
  };

  return jwt.sign(payload, JWT_SECRET);
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

async function getUserById(userId) {
  return await User.findById(userId).lean();
}

async function userLike(userId,playId){
   const user = await User.findById(userId);

   user.likedPlays.push(playId);
   await user.save();
}

module.exports = {
  register,
  login,
  verifyToken,
  getUserById,
  userLike
};

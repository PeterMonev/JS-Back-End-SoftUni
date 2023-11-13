const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = "dasidos";

async function register(firstName, lastName, email, password) {
  const existing = await User.findOne({ email }).collation({
    locale: "en",
    strength: 2,
  });
  if (existing) {
    throw new Error("Email already registered!");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName,
    lastName,
    email,
    hashedPassword,
  });

  return createSession(user);
}

async function login(email, password) {
  const user = await User.findOne({ email }).collation({
    locale: "en",
    strength: 2,
  });
  if (!user) {
    throw new Error("Incorrect email or password");
  }

  const hasMatch = await bcrypt.compare(password, user.hashedPassword);

  if (!hasMatch) {
    throw new Error("Incorrect email or password");
  }

  return createSession(user);
}

function createSession({ _id, email }) {
  const payload = {
    _id,
    email,
  };

  return jwt.sign(payload, JWT_SECRET);
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

async function getUserById(userId) {
  return await User.findById(userId).lean();
}

async function updateUser(userId,list) {
    let existingUser = await User.findById(userId);
    existingUser.myPost = list;
    await existingUser.save();
}

module.exports = {
  register,
  login,
  verifyToken,
  getUserById,
  updateUser
};

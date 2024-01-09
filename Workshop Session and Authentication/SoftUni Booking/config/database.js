const mongoose = require("mongoose");

const connStr =
  process.env.DATABASE_CONNECTION_STRING ||
  "mongodb://0.0.0.0:27017/softuni-booking";

mongoose.set("strictQuery", true);
module.exports = async (app) => {
  try {
    await mongoose.connect(connStr, {
      useNewUrlParser: true,
      // useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: false
    });
    console.log("Database connect");
  } catch (err) {
    console.error("Error initializing database");
    console.error(err.message);
    process.exit(1);
  }
};

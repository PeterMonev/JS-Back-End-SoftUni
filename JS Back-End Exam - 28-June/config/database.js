const mongoose = require("mongoose");

const CONNESTION_STRING =  process.env.DATABASE_CONNECTION_STRING ||
  "mongodb://0.0.0.0:27017/theaters";

mongoose.set("strictQuery", true);
module.exports = async (app) => {
  try {
      await mongoose.connect(CONNESTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   
    });
    console.log('Database connected');
    
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

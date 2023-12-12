const { Schema, model } = require("mongoose");

const articleShema = new Schema({
  author: String,
  title: { type: String, minLength: 10 },
  content: { type: String, minLength: 10 },
});

const Article = model("Article", articleShema);

module.exports = Article;

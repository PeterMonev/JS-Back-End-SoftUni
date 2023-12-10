const { model, Schema, Types } = require("mongoose");

const articleShema = new Schema({
  author: String,
  titlte: { type: String, required: true, minLength: 10 },
  content: { type: String, required: true, minLength: 10 },
  comments: { type: [Types.ObjectId], default: [], ref: "Comments" },
});

const Article = model("Article", articleShema);

module.exports = Article;

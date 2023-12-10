const mongoose = require("mongoose");
const Person = require("./models/person");

const connetionString = "mongodb://localhost:27017/testdb2";
start();

async function start() {
  await mongoose.connect(connetionString, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  // const person = new Person({
  //   firstName: "Peter",
  //   lastName: "Peterson",
  //   age: 23,
  //   nationaliti: 'Bulgarian'
  // });

  // await person.save();

  // const data = await Person.find({});

  // console.log(data[0].sayHi());
  // console.log(data[0].name);

  //Crud

  //Create:
  new Person({}).save();

  //Read:
  const person = await Person.findOne({ firstName: "John" });

  //Update:
  person.age = 16;
  await person.save();
  //||
  await Person.findByIdAndUpdate("6524141", { $set: { age: 17 } });

  //Queries

  const result = await Person.find({})
    .where("age")
    .gte(17)
    .lte(30)
    // .seletect('firstName age');
    .sort({ age: 1 })
    .skip(10)
    .limit(10);

  await mongoose.disconnect();
}

///////////////////////////////////////////////////////////////////////////////////////
const mongoose = require("mongoose");
const Article = require("./models/Article");
const Comment = require("./models/Comment");

const connetionStrings = "mongodb://localhost:27017/testdb2";
start();

async function start() {
  await mongoose.connect(connetionStrings, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  const article = await Article.find({});
  const comment = await Comment.find({});

  article.comments.push(comment);

  await article.save();

  await mongoose.disconnect();
}

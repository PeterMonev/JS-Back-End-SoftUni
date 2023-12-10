// const mongodb = require("mongodb");

// const connectionString = "mongodb://localhost:27017";
// start();

// async function start(){
//     const connection = new mongodb.MongoClient(connectionString, {
//         useUnifiedTopology: true,
//       });

//       await  connection.connect();

//       const db = connection.db('testdb');
//       const collection = db.collection('casts');
//       const query = collection.find({});
//       const data = await query.toArray();

//       console.log(data);
// }
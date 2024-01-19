const fs = require("fs");

const fileName = "./models/data.json";
const data = JSON.parse(fs.readFileSync(fileName));

async function persist() {
  return new Promise((res, rej) => {
    fs.writeFile(fileName, JSON.stringify(data,null, 2), (err) => {
      if ((err = null)) {
        res();
      } else {
        rej(err);
      }
    });
  });
}

function getAll(search) {
  return data.filter(r=> r.name.toLowerCase().includes(search.toLowerCase()));
}

function getById(id) {
  return data.find((i) => i === id);
}

async function create(roomData) {
  const room = {
    id: getId(),
    name: roomData.name,
    description: roomData.description,
    city: roomData.city,
    beds: Number(roomData.beds),
    price: Number(roomData.price),
    imgUrl: roomData.imgUrl,
  };

  if (Object.values(room).some((v) => !v)) {
    throw new Error("All fields need required!");
  }

  data.push(room);
  await persist();

  return room;
}

function getId() {
  return ("000000" + ((Math.random() * 999999) | 0).toString(16)).slice(-6);
}

module.exports = {
  getAll,
  getById,
  create,
};

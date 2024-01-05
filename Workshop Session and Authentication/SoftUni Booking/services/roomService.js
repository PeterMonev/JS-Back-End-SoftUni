const Room = require("../models/room");

function getAll(search) {
  return Room.find({}).lean();
}

function getById(id) {
  return Room.findById(id).populate('facilities','label icoUrl').lean();
}

async function create(roomData) {
  const room = {
    name: roomData.name,
    description: roomData.description,
    city: roomData.city,
    beds: Number(roomData.beds),
    price: Number(roomData.price),
   imgUrl: roomData.imgUrl,
  };

  const missing = Object.entries(room).filter(([k, v]) => !v);

  if (missing.length > 0) {
    throw new Error(missing.map((m) => `${m[0]} is required`).join("\n"));
  }

  const result = await Room.create(room);

  return result;
}

module.exports = {
  getAll,
  getById,
  create,
};

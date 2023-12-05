const Rent = require("../models/Rent");

async function getAll() {
  return Rent.find({}).lean();
}

async function create(rent) {
  return await Rent.create(rent);
}

async function getById(id) {
  return await Rent.findById(id).lean();
}

async function update(id,rent){
  const existing = await Rent.findById(id);

  existing.name = rent.name;
  existing.type = rent.type;
  existing.year = rent.year;
  existing.city = rent.city;
  existing.imageUrl = rent.imageUrl;
  existing.description = rent.description;
  existing.pieces = Number(rent.pieces);

  await existing.save();
}

async function deleteById(id){
   await Rent.findByIdAndRemove(id);
}

async function takeRents(rentId,userId){
   const rent = await Rent.findById(rentId);
   rent.pieces -= 1;
   rent.rentHouse.push(userId);
   await rent.save();
}

async function search(search){
  search = new RegExp(search, "i");
  return (Rent.find({ type:  search }).lean());
}



module.exports = {
  getAll,
  create,
  getById,
  update,
  takeRents,
  deleteById,
  search,
};

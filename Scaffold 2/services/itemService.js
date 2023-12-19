const Item = require("../models/Item");

async function getAll() {
  return Item.find({}).lean();
}

async function create(item) {
  return await Item.create(item);
}

async function getById(id) {
  return await Item.findById(id).lean();
}

async function update(id,item){
  const existing = await item.findById(id);

  existing.name = item.name;
  existing.imageUrl = item.imageUrl;
  existing.price = item.price;
  existing.description = item.description;
  existing.payment = item.payment;

  await existing.save();
}

async function deleteById(id){
   await Item.findByIdAndRemove(id);
}

async function buyItems(itemId,userId){
   const Item = await Item.findById(itemId);

   Item.buyItem.push(userId);
   await Item.save();
}



module.exports = {
  getAll,
  create,
  getById,
  update,
  buyItems,
  deleteById,

};

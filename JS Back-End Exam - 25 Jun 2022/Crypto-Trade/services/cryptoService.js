const Crypto = require("../models/Crypto");

async function getAllSearch(cryptoText,cryptoPay){
  if (cryptoText) {
    return (Crypto.find({ name: {$regex: cryptoText, $options: 'i'} }).lean());
}

if (!cryptoText && cryptoPay) {
    return (Crypto.find({ paymentMethod: cryptoPay }).lean());
}
}

async function getAll() {
  return Crypto.find({}).lean();
}

async function create(crypto) {
  return await Crypto.create(crypto);
}

async function getById(id) {
  return await Crypto.findById(id).lean();
}

async function update(id,crypto){
  const existing = await Crypto.findById(id);

  existing.name = crypto.name;
  existing.imageUrl = crypto.imageUrl;
  existing.price = crypto.price;
  existing.description = crypto.description;
  existing.payment = crypto.payment;

  await existing.save();
}

async function deleteById(id){
   await Crypto.findByIdAndRemove(id);
}

async function buyCryptos(cryptoId,userId){
   const crypto = await Crypto.findById(cryptoId);

   crypto.buyCrypto.push(userId);
   await crypto.save();
}



module.exports = {
  getAll,
  create,
  getById,
  update,
  buyCryptos,
  deleteById,
  getAllSearch
};

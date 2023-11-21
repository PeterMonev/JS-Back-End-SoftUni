const Art = require("../models/Art");

async function getAll() {
  return Art.find({}).lean();
}

async function create(art) {
  return await Art.create(art);
}

async function getById(id) {
  return await Art.findById(id).lean();
}

async function update(id,art){
  const existing = await Art.findById(id);

  existing.title = art.title;
  existing.technique = art.technique;
  existing.imageUrl = art.imageUrl;
  existing.certificate = art.certificate;

  await existing.save();
}

async function deleteById(id){
   await Art.findByIdAndRemove(id);
}

async function getShare(artId,userId){
   const art = await Art.findById(artId);

   art.shared.push(userId);
   await art.save();
}



module.exports = {
  getAll,
  create,
  getById,
  update,
  getShare,
  deleteById,

};

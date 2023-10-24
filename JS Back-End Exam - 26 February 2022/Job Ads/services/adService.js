const Ad = require("../models/Ad");

async function getAll() {
  return Ad.find({}).lean();
}

async function getFirstThree() {
  return Ad.find({}).limit(3).lean();
}

async function create(ad) {
  let id= "";
  await Ad.create(ad).then(ad => id= ad._id);
 
  return id;
}


async function getById(id) {
  return await Ad.findById(id).lean();
}

async function applied(adId,user){
  const ad = await Ad.findById(adId);
  ad.userApplied.push(user);
  await ad.save();
}

async function deleteById(id){
  return await Ad.findByIdAndRemove(id);
}

async function update(id,ad){
  const existingAd = await Ad.findById(id);

  existingAd.headline = ad.headline;
  existingAd.location = ad.location;
  existingAd.name = ad.name;
  existingAd.description = ad.description;

  await existingAd.save();

}

async function search(search){
  return (Ad.find({ owner:  search }).lean());
}

module.exports = {
  getAll,
  getFirstThree,
  create,
  getById,
  applied,
  deleteById,
  update,
  search
};

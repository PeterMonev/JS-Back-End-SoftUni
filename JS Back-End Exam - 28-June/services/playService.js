const Play = require("../models/Play");

async function getAll() {
  return Play.find({}).lean();
}

async function getThreeByCount(){
  return Play.find({}).sort({ usersLiked: -1}).limit(3).lean();
}

async function getAllByLikes(){
  return Play.find({}).sort({ usersLiked: -1}).lean();
}

async function getAllByDate(){
  return Play.find({}).sort({ date: -1}).lean();
}

async function create(play) {
  return await Play.create(play);
}

async function getById(id) {
  return await Play.findById(id).lean();
}

async function update(id,play){
  const existing = await Play.findById(id);

  existing.title = play.title;
  existing.description = play.description;
  existing.imageUrl = play.imageUrl;
  existing.public = Boolean(play.public);

  await existing.save();
}

async function deleteById(id){
   await Play.deleteOne({_id: id});
}

async function liked(playId,userId){
   const play = await Play.findById(playId);
   
   play.usersLiked.push(userId);
   await play.save();
}

module.exports = {
  getAll,
  create,
  getById,
  update,
  liked,
  deleteById,
  getThreeByCount,
  getAllByLikes,
  getAllByDate
};

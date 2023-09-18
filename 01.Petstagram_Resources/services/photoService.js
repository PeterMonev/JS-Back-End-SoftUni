const Photo = require("../models/Photo");

async function getAll() {
  return Photo.find({}).lean();
}

async function create(photo) {
  return await Photo.create(photo);
}

async function getById(id) {
  return await Photo.findById(id).lean();
}

async function update(id,photo){
  const existing = await Photo.findById(id);

  existing.name = photo.name;
  existing.imageUrl = photo.imageUrl;
  existing.age = Number(photo.age);
  existing.description = photo.description;
  existing.location = photo.location;

  await existing.save();
}

async function deleteById(id){
   await Photo.deleteOne({_id: id});
}

async function commentPhoto(photoId,userId,comment){
  const photo = await Photo.findById(photoId);

  let comments = photo.commentList;
  let commentObj = new Object();
  commentObj.userID = userId;
  commentObj.comment = comment
  console.log(commentObj);
  comments.push(commentObj);
  photo.commentList = comments;
  await photo.save();
}



module.exports = {
  getAll,
  create,
  getById,
  update,
  deleteById,
  commentPhoto,

};

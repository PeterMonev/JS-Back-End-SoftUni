const Post = require("../models/Post");

async function getAll() {
  return Post.find({}).lean();
}

async function create(post) {
  return await Post.create(post);
}

async function getById(id) {
  return await Post.findById(id).lean();
}

async function update(id,post){
  const existing = await Post.findById(id);

  existing.title = post.title;
  existing.keyword = post.keyword;
  existing.location = post.location;
  existing.date = post.date;
  existing.imageUrl = post.imageUrl;
  existing.description = post.description;

  await existing.save();
}

async function deleteById(id){
   await Post.findByIdAndRemove(id);
}

async function voteUp(postId,userId){
   const post = await Post.findById(postId);
   post.rating += 1;
   post.vote.push(userId);
   await post.save();
}

async function voteDown(postId,userId){
  const post = await Post.findById(postId);
  post.rating -= 1;
  post.vote.push(userId);
  await post.save();
}



module.exports = {
  getAll,
  create,
  getById,
  update,
  voteUp,
  voteDown,
  deleteById,

};

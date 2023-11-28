const Book = require("../models/Book");

async function getAll() {
  return Book.find({}).lean();
}

async function getById(id) {
  return Book.findById(id).lean();
}

async function getByUserWishing(userId){
  return Book.find({ wishingList: userId }).lean();
}

async function create(book){
  return await Book.create(book);
}

async function update(id,book){
  const existing = await Book.findById(id);

  existing.title = book.title;
  existing.author = book.author;
  existing.imageUrl = book.imageUrl;
  existing.review = book.review;
  existing.genre = book.genre;
  existing.stars = book.stars;

  await existing.save();
}

async function deleteById(id) {
  await Book.findByIdAndRemove(id);
}

async function bookWish(booklId, userId) {
  const book = await Book.findById(booklId);

  book.wishingList.push(userId);
  await book.save();
}

module.exports = {
    getAll,
    getById,
    create,
    deleteById,
    bookWish,
    update,
    getByUserWishing,
}
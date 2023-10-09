const Auction = require("../models/Auction");

async function getAll() {
  return Auction.find({}).lean();
}

async function getById(id) {
  return await Auction.findById(id).lean();
}

async function create(auction) {
  return await Auction.create(auction);
}

async function auctionBid(id, auction, price) {
  const currAuction = await Auction.findById(id);

  currAuction.price = Number(price);
  currAuction.bidder = auction.bidder;

  await currAuction.save();
}

async function deleteById(id) {
  await Auction.findByIdAndRemove(id);
}

async function update(id, auction){
  const existing = await Auction.findById(id);

  existing.title = auction.title;
  existing.description = auction.description;
  existing.category = auction.category;
  existing.imageUrl = auction.imageUrl;
  existing.price = auction.price;

  await existing.save();
  
}

async function getClosedByUser(userId) {
  let auction =   await Auction.find({}).lean();
  return auction.filter(a => a.owner.toString() === userId).filter(a => a.closed == true);
}

async function closeAuction(id){
    const auction = await Auction.findById(id);

    if(!auction.bidder){
      throw new Error('Cannot close auction without bidder');
    }

    auction.closed = true;
    await auction.save();
}

module.exports = {
  getAll,
  create,
  getById,
  auctionBid,
  deleteById,
  update,
  getClosedByUser,
  closeAuction
};

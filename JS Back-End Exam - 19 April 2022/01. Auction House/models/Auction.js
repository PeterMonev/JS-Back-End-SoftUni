const { Schema, model, Types } = require("mongoose");

const IMAGE_PATTERN = /^(.+)\.(png|jpg|jpeg)$/;

 
const auctionSchema = new Schema({
    title: {type: String, required: true, minlength: [4,'Title must be at least 4 characters']},
    description: {type: String, maxlength: [200,'Description should not be more than 200 characters']},
    category: {type: String, required: [true, 'Category is required'], enum: ["vehicles", "estate", "electronics", "furniture", "other"]},
    imageUrl: {type: String, required: true,},
    price: {type: Number, required: true, min: [0,'Price cannot be a negative number'], default: 0},
    owner: {type: Types.ObjectId, ref:'User', required: true},
    bidder: {type: Types.ObjectId, ref:'User'},
    closed: {type: Boolean, default: false}
});

const Auction = model('Auction', auctionSchema);

module.exports = Auction;

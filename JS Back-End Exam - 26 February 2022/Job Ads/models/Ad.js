const {Schema, model, Types} = require('mongoose');

const adSchema = new Schema({
    headline: {type: String,require: true,minlenght: [4,'Headline must be at least 4 characters long']},
    location: {type: String,require: true,minlenght: [8, 'Location must be at least 8 characters long']},
    name: {type: String,require: true,minlenght: [3, 'Company name must be at least 3 characters long']},
    description: {type: String,require: true,maxlenght: [40, 'Description must be less than 40 characters long']},
    owner: {type: Types.ObjectId,ref: 'User'},
    userApplied: {type: [Types.ObjectId],ref: 'User' ,default: []}

});

const Ad = model('Ad', adSchema);

module.exports = Ad;
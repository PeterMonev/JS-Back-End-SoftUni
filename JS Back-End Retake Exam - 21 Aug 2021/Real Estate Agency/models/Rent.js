const { Schema, model, Types } = require("mongoose");

const URL_PATTERN = /^https?:\/\/.+$/i;

const rentSchema = new Schema({
    name: {type: String, required: true,unique: true,minlength: [6,'Name must be at least 6 characters']},
    type: {type: String, required: true, enum: ['Apartament','Villa','House']},
    year: {type: Number, required: true, min: [1850,'Year must be bigger than 1850'],max: [2021,'Year must be smaller than 2021 year']},
    city: {type: String, required: true,minlength: [4,'City must be at least 4 characters']},
    imageUrl: {type: String, required: true, validate:{
        validator: (value) => URL_PATTERN.test(value),
        message: 'Invalid image URL'
    }},
    description: {type: String, required: true,maxlength: [60,'Descriptions should be maximum 60 characters long']},
    pieces: {type: Number, required: true,min: [0,'Pieces must be positive number'],max: [10,'Pieces must be maximum 10 pieces']},
    rentHouse: {type: [Types.ObjectId],ref: 'User', default: []},
    owner: {type: Types.ObjectId, ref: 'User', required: true},
  
});

rentSchema.index({ name: 1}, {collation: {
    locale: 'en',
    strength: 2
}});

const Rent = model('Rent', rentSchema);

module.exports = Rent;

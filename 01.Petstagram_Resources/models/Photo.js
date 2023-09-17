const { Schema, model, Types } = require("mongoose");

const URL_PATTERN = /^https?:\/\/.+$/i;

const photoSchema = new Schema({
    name: {type: String, required: true,minlength: [2,'Name must be at least 2 characters']},
    imageUrl: {type: String, required: true, validate:{
        validator: (value) => URL_PATTERN.test(value),
        message: 'Invalid image URL'
    }},
    age: {type: Number, required: true, min: [1,'The age must be between 1 and 100 ages'], max: [100,'The age must be between 1 and 100 ages']},
    description: {type: String, required: true,minlength: [5,'Description must be at least 5 characters long'], maxlength: [50,'Description must be maximum 50 characters long']},
    location: {type: String, required: true,minlength: [5,'Location must be at least 5 characters long'], maxlength: [50,'Location must be maximum 50 characters long']},
    commentList: [{userID:{type: String}, comment:{type: String}}],
    owner: {type: Types.ObjectId, ref: 'User', required: true}
});

// itemSchema.index({ name: 1}, {collation: {
//     locale: 'en',
//     strength: 2
// }});

const Photo = model('Photo', photoSchema);

module.exports = Photo;

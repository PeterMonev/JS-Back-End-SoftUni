const { Schema, model, Types } = require("mongoose");

const URL_PATTERN = /^https?:\/\/.+$/i;

const artSchema = new Schema({
    title: {type: String, required: true ,minlength: [6,'Title must be at least 6 characters long']},
    technique: {type: String, required: true, maxlength: [15,'Technique should be a maximum of 15 characters long']},
    imageUrl: {type: String, required: true, validate:{
        validator: (value) => URL_PATTERN.test(value),
        message: 'Invalid image URL'
    }},
    certificate: {type: String, required: true, enum: ['Yes', 'No']},
    owner: {type: Types.ObjectId, ref: 'User', required: true},
    shared: {type: [Types.ObjectId], ref: 'User', required: true},
});

const Art = model('Art', artSchema);

module.exports = Art;

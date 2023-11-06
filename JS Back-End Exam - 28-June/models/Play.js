const { Schema, model, Types } = require("mongoose");

const URL_PATTERN = /^https?:\/\/.+$/i;

const playSchema = new Schema({
    title: {type: String, required: true,unique: true,minlength: [1,'Title must be at least 1 characters']},
    description: {type: String, required: true,maxlength: [50,'Description must be a maximum 50 characters']},
    imageUrl: {type: String, required: true, validate:{
        validator: (value) => URL_PATTERN.test(value),
        message: 'Invalid image URL'
    }},
    public: {type: Boolean, default: false},
    date: {type: Date, required: true},
    owner: {type: Types.ObjectId, ref: 'User', required: true},
    usersLiked: {type: [Types.ObjectId], ref: 'User', default: []},
});

playSchema.index({ title: 1}, {collation: {
    locale: 'en',
    strength: 2
}});

const Play = model('Play', playSchema);

module.exports = Play;

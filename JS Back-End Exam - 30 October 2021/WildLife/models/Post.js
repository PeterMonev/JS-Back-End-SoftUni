const { Schema, model, Types } = require("mongoose");

const URL_PATTERN = /^https?:\/\/.+$/i;

const postSchema = new Schema({
    title: {type: String, required: true, minlength: [6,'Title must be at least 6 characters long']},
    keyword: {type: String, required: true, minlength: [6,'Keyword must be at least 6 characters long']},
    location: {type: String, required: true, maxlength: [15, 'The Location should be a maximum of 15 characters long'] },
    date: {type: String, required: true, minlength: [10,'Date must be correct'], maxlength: [10, 'Date must be correct']},
    imageUrl: {type: String, required: true, validate:{
        validator: (value) => URL_PATTERN.test(value),
        message: 'Invalid image URL'
    }},
    description: {type: String, required: true,minlength: [8,'Description must be at least 8 characters']},
    owner: {type: Types.ObjectId, ref: 'User', required: true},
    vote: {type: [Types.ObjectId], ref: 'User', default: []},
    rating: {type: Number, default: 0}
  
});

const Post = model('Post', postSchema);

module.exports = Post;

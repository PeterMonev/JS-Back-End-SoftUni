const {Schema, model, Types, models} = require('mongoose');

const URL_PATTERN = /https?:\/\/./i;

const tripSchema = new Schema({
    start: {type: String, required: true, minlength: [4,'Starting point must be at least 4 characters long'] },
    end: {type: String, required: true, minlength: [4,'End point must be at least 4 characters long']},
    date: {type: String, required: true},
    time: {type: String, required: true},
    imageUrl: {type: String, required: true, validate: {
        validator: (value) => URL_PATTERN.test(value),
        message: 'Invalid URL'
        }
    },
    car: {type: String, required: true, minlength: [4,'Car brand must be at least 4 characters long']},
    seats: {type: Number, required: true},
    price: {type: Number, required: true,min: [1,'Price must be at least 1'], max: [50, 'Price must be less than 50']},
    description: {type: String, required: true, minlength: [10,'Description point must be at least 4 characters long']},
    owner: {type: Types.ObjectId, ref: 'User'},
    buddies: {type: [Types.ObjectId], ref: 'User', default: []},
});

const Trip = model('Trip', tripSchema);

module.exports = Trip;
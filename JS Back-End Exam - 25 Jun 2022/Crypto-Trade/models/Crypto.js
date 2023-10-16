const { Schema, model, Types } = require("mongoose");

const URL_PATTERN = /^https?:\/\/.+$/i;

const cryptoSchema = new Schema({
    name: {type: String, required: true,unique: true,minlength: [2,'Name must be at least 2 characters']},
    imageUrl: {type: String, required: true, validate:{
        validator: (value) => URL_PATTERN.test(value),
        message: 'Invalid image URL'
    }},
    price: {type: Number, required: true, min: [0,'Price must be positive numbers']},
    description: {type: String, required: true,minlength: [10,'Description must be at least 10 characters']},
    payment: {type: String, required: true,enum: ['crypto-wallet', 'credit-card', 'debit-card', 'paypal']},
    buyCrypto: {type: [Types.ObjectId], ref:'User',default: []},
    owner: {type: Types.ObjectId, ref: 'User', required: true}
});

cryptoSchema.index({ name: 1}, {collation: {
    locale: 'en',
    strength: 2
}});

const Crypto = model('Crypto', cryptoSchema);

module.exports = Crypto;

const ProductModel = require('../models/product.model')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'

const cartSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        items: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                },
                kind: {
                    type: String,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true
                },
                discount: {
                    type: Number,
                    required: true
                },
                note: {
                    type: String,
                },
            }
        ],
        total: {
            type: Number,
                }
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

cartSchema.pre('save', async function (next) {
    this.total = this.items.reduce((total, item) => {

        return total + (item.price - item.price*item.discount/100) * item.quantity;
    }, 0);

    next();
});

module.exports = mongoose.model(DOCUMENT_NAME, cartSchema);
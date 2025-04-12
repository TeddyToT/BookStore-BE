const mongoose = require('mongoose');
const userModel = require('./user.model');
const Schema = mongoose.Schema;


const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'Orders'

const orderSchema = new Schema(
    {
        user: {
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

        // tien truoc, tinh % sau
        voucher: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Voucher',
            }
        ],
        total: {
            type: Number,
            min: 0,
        },
        paymentStatus: {
            type: String,
            enum: ['paid', 'unpaid'],
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: ['momo', 'cod'],
            required: true,
        },
        deliveryStatus: {
            type: String,
            required: true,
            enum: ['pending', 'confirmed','systemCancel','customerCancel','doing', 'shipping', 'success','fail'],
            default: "pending"
        },
        note: {
            type: String,
        },
        name: {
            type: String,
        },
        address: {
            type: String,
        },
        phone: {
            type: String,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = mongoose.model(DOCUMENT_NAME, orderSchema);
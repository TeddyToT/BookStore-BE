const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DOCUMENT_NAME = 'Feedback'
const COLLECTION_NAME = 'Feedbacks'
const CustomerSchema = new Schema(
    {
        email: String,
        password: {
            type: String,
            required: true,
        },
        name: String,
        birthday: Date,
        avatar: String,
        phone: String,
        address: [{
            type: String,
            isDefault: Boolean,
        }],
        orders: {
            type: Schema.Types.ObjectId,
            ref: 'Orders',
        },
        vouchers: {
            type: Schema.Types.ObjectId,
            ref: 'Vouchers',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Customer', CustomerSchema);
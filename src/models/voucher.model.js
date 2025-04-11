const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'Voucher'
const COLLECTION_NAME = 'Vouchers'

const voucherSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        customerUsed: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            }
        ],
        startDay: {
            type: Date,
            required: true,
        },
        endDay: {
            type: Date,
            required: true,
        },

        type: {
            type: String,
            enum: ['amount', 'percent'],
            required: true,
        },
        value: {
            type: Number,
            required: true,
        }
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = model(DOCUMENT_NAME, voucherSchema);
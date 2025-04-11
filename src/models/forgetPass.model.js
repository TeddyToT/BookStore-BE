const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DOCUMENT_NAME = 'Forget'
const COLLECTION_NAME = 'Forgets'

const forgetSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        verificationCode: {
            type: String,
            required: true,
        },
        expiredDate: {
            type: Date,
            required: true,
        }
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = mongoose.model(DOCUMENT_NAME, forgetSchema);
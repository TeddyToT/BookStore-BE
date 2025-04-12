const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DOCUMENT_NAME = 'Author'
const COLLECTION_NAME = 'Authors'

const authorSchema = new Schema(
    {
        avatar: String,
        name: {
            type: String,
            require: true
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);


module.exports = mongoose.model(DOCUMENT_NAME, categorySchema);
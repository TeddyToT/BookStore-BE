const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DOCUMENT_NAME = 'Category'
const COLLECTION_NAME = 'Categorys'

const categorySchema = new Schema(
    {
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
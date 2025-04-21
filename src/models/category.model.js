const { model, Schema } = require('mongoose');


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


module.exports = model(DOCUMENT_NAME, categorySchema);
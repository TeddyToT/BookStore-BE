const { model, Schema } = require('mongoose');


const DOCUMENT_NAME = 'Banner'
const COLLECTION_NAME = 'Banner'

const bannerSchema = new Schema(
    {
        images: [{ type: String }]

    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);


module.exports = model(DOCUMENT_NAME, bannerSchema);
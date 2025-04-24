const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productSchema = new Schema(
    {
        images: {
            type: [String],
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        type: [
            {
                _id: false,
                kind: {
                    type: String,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                    min: 0,
                },
                discount: {
                    type: Number,
                    required: true,
                    min: 0,
                    max: 100,
                    default: 0,
                },
                stock: {
                    type: Number,
                    required: true,
                    min: 0,
                    default: 0,
                    
                },
            }
        ],
        description: {
            type: String,
            required: true,
            trim: true,
            max: 1000,
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true,

        },
        authorId: {
            type: Schema.Types.ObjectId,
            ref: 'Author',
            required: true,
        }
       
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME
    }
);

module.exports = mongoose.model(DOCUMENT_NAME, productSchema);
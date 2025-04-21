const mongoose = require("mongoose");
const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = "Shop";
const COLLECTION_NAME = "Shop";
const shopSchema = new Schema(
  {
    logo: { type: String },
    logodark: { type: String },
    name: { type: String, required: true },
    about: { type: String },
    address: { type: String },
    email: { type: String },
    phone: { type: String },
    hotline: { type: String },
  },
  { 
    timestamps: true, 
    collection: COLLECTION_NAME 
}
);

module.exports = model(DOCUMENT_NAME, shopSchema);
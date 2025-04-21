const { model, Schema } = require('mongoose');


const DOCUMENT_NAME = "Feedback";
const COLLECTION_NAME = "Feedback";

const feedbackSchema = new Schema(
  {
    feedbackId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    content: { type: String, required: true },
    isHandle: { type: Boolean, default: false },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

module.exports = model(DOCUMENT_NAME, feedbackSchema);

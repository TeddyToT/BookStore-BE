const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'Users'

var userSchema = new Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        validate: {
            validator: (value) => {
                return /(84|0[3|5|7|8|9])+([0-9]{8})\b/g.test(value);
            },
            message: (props) => `${props.value} is not a valid phone number!`
        }
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin', 'staff']
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, userSchema);
const cloudinary = require("../config/cloudinary.config")

const uploadImage = async (filePath, cloudinaryFolder) => {
    const result = await cloudinary.uploader.upload(filePath, { folder: cloudinaryFolder });
    return result.secure_url;
}

module.exports = uploadImage;
const cloudinary = require("../config/cloudinary.config")

const uploadImage = async (filePath, cloudinaryFolder, customFileName) => {
    const result = await cloudinary.uploader.upload(filePath, { folder: cloudinaryFolder, public_id: customFileName });
    return result.secure_url;
}

module.exports = uploadImage;
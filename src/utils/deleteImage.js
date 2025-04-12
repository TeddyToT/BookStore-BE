const cloudinary = require("../config/cloudinary.config")

const deleteImage = async (fileID) => {
    try {
        const result = await cloudinary.uploader.destroy(fileID);
        return {
            message: "Success",
            result,
        };
    } catch (error) {
        return {
            message: "Failure",
            error,
        };
    }
}

module.exports = deleteImage;
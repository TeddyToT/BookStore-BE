const { uploadImage } = require('../utils/uploadImage');
const { deleteImage } = require('../utils/deleteImage');
const authorModel = require('../models/author.model');
const { BadRequestError, InternalServerError } = require('../utils/errorResponse');
const getData = require('../utils/formatRes');

class AuthorService {
    static getAllAuthors = async () => {
        try {
            const authors = await authorModel.find({});

            return authors.map(author =>
                getData({ fields: ['_id', 'name', 'avatar'], object: author })
            );
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    static getAuthorById = async ({ id }) => {
        try {
            const author = await authorModel.findById(id);

            if (!author) {
                return {
                    success: false,
                    message: "Author not found"
                };
            }

            return getData({ fields: ['_id', 'name', 'avatar'], object: author });
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
    
    static getAuthorByName = async ({ name }) => {
        try {
            const author = await authorModel.findOne({ name });

            if (!author) {
                return {
                    success: false,
                    message: "Author not found"
                };
            }

            return getData({ fields: ['_id', 'name', 'avatar'], object: author });
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    static addAuthor = async (file, { name }) => {
        try {
            // Kiểm tra xem tác giả đã tồn tại chưa
            const existingAuthor = await authorModel.findOne({ name });

            if (existingAuthor) {
                throw new BadRequestError("Author already exists");
            }

            // Kiểm tra và upload ảnh avatar nếu có
            let avatarLink = null;
            if (file) {
                const cloudinaryFolder = 'Book/Author';
                avatarLink = await uploadImage(file.path, cloudinaryFolder);  // Tải ảnh lên Cloudinary
            }

            // Tạo tác giả mới
            const newAuthor = new authorModel({
                name,
                avatar: avatarLink, // Lưu link ảnh avatar
            });

            const savedAuthor = await newAuthor.save();

            return getData({ fields: ['_id', 'name', 'avatar'], object: savedAuthor });
        } catch (error) {
            if (error instanceof BadRequestError) {
                return { success: false, message: error.message };
            }
            return new InternalServerError(error.message);
        }
    }

    static updateAuthor = async (id, file, { name }) => {
        try {
            const author = await authorModel.findById(id);

            if (!author) {
                return {
                    success: false,
                    message: "Author not found"
                };
            }

            if (name) {
                const existAuthor = await authorModel.findOne({ name });
                if (existAuthor && existAuthor.id.toString() !== id) {
                    throw new BadRequestError("Author name already exists");
                }
                author.name = name;
            }

            // Cập nhật ảnh avatar nếu có
            if (file) {
                const cloudinaryFolder = 'Book/Author';
                const avatarLink = await uploadImage(file.path, cloudinaryFolder);

                // Xóa ảnh cũ trên Cloudinary nếu có
                const linkArr = author.avatar.split('/');
                const imgName = linkArr[linkArr.length - 1];
                const imgID = imgName.split('.')[0];
                const result = "Book/Author/" + imgID;
                await deleteImage(result);  // Xóa ảnh cũ

                author.avatar = avatarLink;
            }

            const savedAuthor = await author.save();

            return getData({ fields: ['_id', 'name', 'avatar'], object: savedAuthor });
        } catch (error) {
            if (error instanceof BadRequestError) {
                return { success: false, message: error.message };
            }
            return new InternalServerError(error.message);
        }
    }

    static deleteAuthor = async (id) => {
        try {
            // Kiểm tra xem tác giả có tồn tại không
            const author = await authorModel.findById(id);

            if (!author) {
                return {
                    success: false,
                    message: "Author not found"
                };
            }

            await productModel.updateMany(
                { authorId: id }, 
                { $set: { authorId: "unknown" } }
            );

            await authorModel.findByIdAndDelete(id);

            return {
                success: true,
                message: "Author deleted successfully, products updated with 'unknown' author"
            };
        } catch (error) {
            return new InternalServerError(error.message);
        }
    }
}



module.exports = AuthorService;

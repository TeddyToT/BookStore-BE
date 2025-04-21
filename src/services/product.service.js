const productModel = require("../models/product.model");
const categoryModel = require("../models/category.model");
const uploadImage = require("../utils/uploadImage");
const deleteImage = require("../utils/deleteImage");
const cartModel = require("../models/cart.model");
const {
  BadRequestError,
  InternalServerError,
} = require("../utils/errorResponse");

class ProductService {
  static getIdProductByName = async ({ name }) => {
    try {
      const product = await productModel
        .findOne({ name })
        .populate("categoryId");

      if (!product) {
        return {
          success: false,
          message: "wrong product",
        };
      }

      return product.id;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  };

  static addProduct = async (
    files,
    { name, type, description, categoryId, authorId }
  ) => {
    try {
      const product = await productModel.findOne({ name }).lean();
      const category = await categoryModel.findById(categoryId).lean();

      if (product) {
        return { success: false, message: "Product already exists" };
      }

      if (!category) {
        return { success: false, message: "Invalid category" };
      }

      if (!authorId) {
        return { success: false, message: "Author is required" };
      }

      if (!type) {
        return { success: false, message: "Type is required" };
      }

      type = JSON.parse(type);

      for (const variant of type) {
        const { kind, price, discount, stock } = variant;
        if (!kind || price == null || discount == null || stock == null) {
          return new BadRequestError(
            "Each type must have kind, price, discount, and stock"
          );
        }
        if (price < 0 || discount < 0 || discount > 100 || stock < 0) {
          return new BadRequestError(
            "Invalid type values (price ≥ 0, 0 ≤ discount ≤ 100, stock ≥ 0)"
          );
        }
      }

      const cloudinaryFolder = "Book/Product";

      const imageLinks = [];
      if (files && files.length > 0) {
        for (const file of files) {
          const link = await uploadImage(file.path, cloudinaryFolder);
          imageLinks.push(link);
        }
      }

      const newProduct = new productModel({
        images: imageLinks,
        name,
        type,
        description,
        categoryId,
        authorId,
      });

      const savedProduct = await newProduct.save();
      return savedProduct;
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  static getProduct = async () => {
    try {
      const products = await productModel.find({}).populate("categoryId");

      // products.forEach(p => {
      //     console.log('{id: ObjectId("' + p.id + '"), type:[' + p.type + ']},')
      // })

      return products;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  };

  static getProductID = async ({ id }) => {
    try {
      const product = await productModel.findById(id).populate("categoryId");

      if (!product) {
        return {
          success: false,
          message: "wrong product",
        };
      }

      return product;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  };

  static updateProduct = async (id, files, body) => {
    try {
        const { name, type, description, categoryId, authorId } = body;
        const product = await productModel.findById(id);
        const category = await categoryModel.findById(categoryId).lean();

        if (!product) return { success: false, message: "Product not found" };
        if (!category) return { success: false, message: "Invalid category" };

        if (name) {
            const existProduct = await productModel.findOne({ name });
            if (existProduct && existProduct.id.toString() !== id) {
                return { success: false, message: "Product name already exists" };
            }
            product.name = name;
        }

        let newImageLinks = [];
        if (Array.isArray(body.images)) {
            newImageLinks = body.images.filter(url => typeof url === "string" && url.startsWith("http"));
        } else if (typeof body.images === "string") {
            newImageLinks = [body.images];
        }

        if (files && files.length > 0) {
            const cloudinaryFolder = "Book/Product";
            for (const file of files) {
                const uploadedLink = await uploadImage(file.path, cloudinaryFolder);
                newImageLinks.push(uploadedLink);
            }
        }

        const oldImages = product.images || [];
        const imagesToDelete = oldImages.filter(img => !newImageLinks.includes(img));
        for (const imageUrl of imagesToDelete) {
            const parts = imageUrl.split('/');
            const fileName = parts[parts.length - 1].split('.')[0];
            const publicId = `Book/Product/${fileName}`;
            await deleteImage(publicId);
        }

        product.images = newImageLinks;

        if (type) {
            const parsedType = JSON.parse(type);
            for (const variant of parsedType) {
                const { kind, price, discount, stock } = variant;
                if (!kind || price == null || discount == null || stock == null) {
                    return new BadRequestError("Each type must have kind, price, discount, and stock");
                }
                if (price < 0 || discount < 0 || discount > 100 || stock < 0) {
                    return new BadRequestError("Invalid type values (price ≥ 0, 0 ≤ discount ≤ 100, stock ≥ 0)");
                }
            }
            product.type = parsedType;
        }

        if (description) product.description = description;
        if (categoryId) product.categoryId = categoryId;
        if (authorId) product.authorId = authorId;

        const savedProduct = await product.save();

        // Cập nhật giỏ hàng
        const carts = await cartModel.find({ "items.product": savedProduct.id });
        if (carts.length > 0) {
            for (let cart of carts) {
                cart.items = cart.items.filter(item => {
                    const match = savedProduct.type.find(t => t.kind === item.kind);
                    if (match) {
                        item.price = match.price;
                        item.discount = match.discount;
                        return true;
                    }
                    return false;
                });
                await cart.save();
            }
        }

        return savedProduct;
    } catch (error) {
        return { success: false, message: error.message };
    }
};


  static updateProductNameById = async (id, { name }) => {
    try {
      const product = await productModel.findById(id);

      if (!product) {
        return {
          success: false,
          message: "wrong product",
        };
      }

      if (name.trim().length === 0) {
        return {
          success: false,
          message: "Invalid product name",
        };
      }

      product.name = name;

      const savedProduct = await product.save();

      return {
        success: true,
        product: savedProduct,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  };

  static deleteProduct = async ({ id }) => {
    try {
      const product = await productModel.findByIdAndDelete(id);

      if (!product) {
        return {
          success: false,
          message: "Product not found",
        };
      }

      // Cập nhật cart: gỡ những item có product bị xoá
      const carts = await cartModel.find({ "items.product": product.id });

      if (carts && carts.length > 0) {
        for (let cart of carts) {
          cart.items = cart.items.filter((item) => {
            return product.type.some((t) => t.kind === item.kind);
          });
          await cart.save();
        }
      }

      // Xoá ảnh trên Cloudinary
      const linkArr = product.image.split("/");
      const imgName = linkArr[linkArr.length - 1];
      const imgID = imgName.split(".")[0];
      const result = "Book/Product/" + imgID;
      await deleteImage(result);

      return {
        success: true,
        message: "Delete successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  };

  static listCategoryOfProduct = async () => {
    try {
      const result = await productModel.aggregate([
        {
          $group: {
            _id: "$categoryId",
            name: { $first: "" },
            products: {
              $push: {
                _id: "$_id",
                name: "$name",
                image: "$image",
                description: "$description",
                type: "$type",
                authorId: "$authorId",
              },
            },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      // Lấy tên của các category
      for (const cateId of result) {
        const category = await categoryModel.findById(cateId._id);
        if (category) {
          cateId.name = category.name;
        }
      }

      return result;
    } catch (error) {
      return new InternalServerError(error.message);
    }
  };

  static listAuthorOfProduct = async () => {
    try {
      const result = await productModel.aggregate([
        {
          $group: {
            _id: "$authorId",
            name: { $first: "" },
            products: {
              $push: {
                _id: "$_id",
                name: "$name",
                image: "$image",
                description: "$description",
                type: "$type",
                categoryId: "$categoryId",
              },
            },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      // Lấy tên của các tác giả từ Authors collection
      for (const authorId of result) {
        const author = await authorModel.findById(authorId._id);
        if (author) {
          authorId.name = author.name;
        }
      }

      return result;
    } catch (error) {
      return new InternalServerError(error.message);
    }
  };
}

module.exports = ProductService;

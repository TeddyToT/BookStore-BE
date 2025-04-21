const ProductService = require('../services/product.service')

class ProductController {

    addProduct = async (req, res, next) => {
        console.log("HEADERS:", req.headers);
        console.log("BODY:", req.body);
        console.log("FILES:", req.files);
        try {
            return res.status(201).json(await ProductService.addProduct(req.files, req.body))
        } catch (error) {
            next(error)
        }
    }

    getProduct = async (req, res, next) => {
        try {
            return res.status(201).json(await ProductService.getProduct())
        } catch (error) {
            next(error)
        }
    }

    getProductID = async (req, res, next) => {
        try {
            return res.status(201).json(await ProductService.getProductID(req.params))
        } catch (error) {
            next(error)
        }
    }

    updateProduct = async (req, res, next) => {
        try {
            return res.status(201).json(await ProductService.updateProduct(req.params.id, req.files, req.body))
        } catch (error) {
            next(error)
        }
    }

    updateProductNameById = async (req, res, next) => {
        try {
            return res.status(201).json(await ProductService.updateProductNameById(req.params.id, req.body))
        } catch (error) {
            next(error)
        }
    }

    deleteProduct = async (req, res, next) => {
        try {
            return res.status(201).json(await ProductService.deleteProduct(req.params))
        } catch (error) {
            next(error)
        }
    }

    listCategoryOfProduct = async (req, res, next) => {
        try {
            return res.status(201).json(await ProductService.listCategoryOfProduct())
        } catch (error) {
            next(error)
        }
    }
    listAuthorOfProduct = async (req, res, next) => {
        try {
            return res.status(201).json(await ProductService.listCategoryOfProduct())
        } catch (error) {
            next(error)
        }
    }

    getIdProductByName = async (req, res, next) => {
        try {
            return res.status(201).json(await ProductService.getIdProductByName(req.body))
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new ProductController()
const categoryService = require('../services/category.service')

class CategoryController {
    getAllCategory = async (req, res, next) => {
        try {
            return res.status(201).json(await categoryService.getAllCategory())
        } catch (error){
            next(error)
        }
    }

    getCategoryById = async (req, res, next) => {
        try {
            return res.status(201).json(await categoryService.getCategoryById(req.params))
        } catch (error){
            next(error)
        }
    }

    getCategoryByName = async (req, res, next) => {
        try {
            return res.status(201).json(await categoryService.getCategoryByName(req.params))
        } catch (error){
            next(error)
        }
    }

    addCategory = async (req, res, next) => {
        try {
            return res.status(201).json(await categoryService.addCategory(req.body))
        } catch (error){
            next(error)
        }
    }

    updateCategory = async (req, res, next) => {
        try {
            return res.status(201).json(await categoryService.updateCategory(req.params, req.body))
        } catch (error){
            next(error)
        }
    }

    deleteCategory = async (req, res, next) => {
        try {
            return res.status(201).json(await categoryService.deleteCategory(req.params))
        } catch (error){
            next(error)
        }
    }
}

module.exports = new CategoryController();
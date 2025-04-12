const categoryModel = require('../models/category.model')
const getData = require('../utils/formatResponse')
const _ = require('lodash');

class CategoryService {
    static getAllCategory = async () => {
        try {
            const categorys = await categoryModel.find({})

            return categorys.map(cat =>
                getData({ fields: ['_id', 'name'], object: cat })
            )
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static getCategoryById = async ({ id }) => {
        try {
            const category = await categoryModel.findById(id)

            if (!category) {
                return {
                    success: false,
                    message: "wrong category"
                }
            }

            return getData({ fields: ['_id', 'name'], object: category })
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static getCategoryByName = async ({name}) => {
        try {
            const category = await categoryModel.findOne({name})

            if (!category) {
                return {
                    success: false,
                    message: "wrong category"
                }
            }

            return getData({ fields: ['_id', 'name'], object: category })
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static addCategory = async ({ name }) => {
        try {
            const category = await categoryModel.findOne({ name: name })

            if (category) {
                return {
                    success: false,
                    message: "category exists"
                }
            }

            const newcategory = new categoryModel({
                name
            })

            const savedcategory = await newcategory.save()

            return getData({ fields: ['_id', 'name'], object: savedcategory })
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static updateCategory = async ({ id },{ name }) => {
        try {
            const category = await categoryModel.findById(id)

            if (!category) {
                return {
                    success: false,
                    message: "wrong category"
                }
            }

            if (name)
                category.name = name

            const savedcategory = await category.save()

            return getData({ fields: ['_id', 'name'], object: savedcategory })
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static deleteCategory = async ({ id }) => {
        try {
            const category = await categoryModel.findByIdAndDelete(id)

            if (!category) {
                return {
                    success: false,
                    message: "wrong category"
                }
            }

            return {
                success: true,
                message: "delete successfully"
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }
}

module.exports = CategoryService;
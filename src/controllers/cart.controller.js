const CartService = require('../services/cart.service')

class CartController {
    addCart = async (req, res, next) => {
        try {
            return res.status(201).json(await CartService.addCart())
        } catch (error) {
            next(error)
        }
    }

    addItemCartNoLogin = async (req, res, next) => {
        try {
            return res.status(201).json(await CartService.addItemCartNoLogin(req.body))
        } catch (error) {
            next(error)
        }
    }

    deleteItemCartNoLogin = async (req, res, next) => {
        try {
            return res.status(201).json(await CartService.deleteItemCartNoLogin(req.body))
        } catch (error) {
            next(error)
        }
    }

    addItemCart = async (req, res, next) => {
        try {
            return res.status(201).json(await CartService.addItemCart(req.body))
        } catch (error) {
            next(error)
        }
    }

    deleteItemCart = async (req, res, next) => {
        try {
            return res.status(201).json(await CartService.deleteItemCart(req.body))
        } catch (error) {
            next(error)
        }
    }

    getCart = async (req, res, next) => {
        try {
            return res.status(201).json(await CartService.getAllCart())
        } catch (error) {
            next(error)
        }
    }

    getCartByUserId = async (req, res, next) => {
        try {
            return res.status(201).json(await CartService.getCartByUserId(req.params))
        } catch (error) {
            next(error)
        }
    }
    
    getCartById = async (req, res, next) => {
        try {
            return res.status(201).json(await CartService.getCartById(req.params))
        } catch (error) {
            next(error)
        }
    }
    
    updateQuantity = async (req, res, next) => {
        try {
            return res.status(201).json(await CartService.updateQuantity(req.body))
        } catch (error) {
            next(error)
        }
    }

    updateQuantityNoLog = async (req, res, next) => {
        try {
            return res.status(201).json(await CartService.updateQuantityNoLog(req.body))
        } catch (error) {
            next(error)
        }
    }

    clearCartByUserId = async (req, res, next) => {
        try {
            return res.status(201).json(await CartService.clearCartByUserId(req.params))
        } catch (error) {
            next(error)
        }
    }

    clearCartById = async (req, res, next) => {
        try {
            return res.status(201).json(await CartService.clearCartById(req.params))
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new CartController()
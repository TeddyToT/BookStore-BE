const productModel = require('../models/product.model')
const userModel = require('../models/user.model')
const cartModel = require('../models/cart.model')

class CartService {
    static addCart = async () => {
        try {
            const newCart = new cartModel({
            })

            const savedCart = await newCart.save()

            return savedCart.id
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static getAllCart = async () => {
        try {
            const carts = await cartModel.find({}).populate({
                path: "userId",
                select: '_id name email address phone'
            }).populate('items.product')

            return carts
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static getCartById = async ({ id }) => {
        try {
            const cart = await cartModel.findById(id).populate({
                path: "userId",
                select: '_id name email address phone'
            }).populate('items.product')

            if (!cart) {
                return {
                    success: false,
                    message: "wrong cart"
                }
            }

            return cart
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static getCartByUserId = async ({ userId }) => {
        try {
            const cart = await cartModel.findOne({ userId: userId }).populate({
                path: "userId",
                select: '_id name email address phone'
            }).populate('items.product')

            if (!cart) {
                return {
                    success: false,
                    message: "wrong cart"
                }
            }

            return cart
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static addItemCart = async ({ userId, productId, kind, quantity, note }) => {
        try {
            const product = await productModel.findById(productId)
            const user = await userModel.findById(userId)
    
            if (!user) return { success: false, message: "wrong user" }
            if (!product) return { success: false, message: "wrong product" }
            if (!product.type.some(p => p.kind == kind)) {
                return { success: false, message: "wrong kind" }
            }
    
            let cart = await cartModel.findOne({ userId })
            if (!cart) cart = await new cartModel({ userId }).save()
    
            const existingItem = cart.items.find(item => item.product.toString() === productId && item.kind === kind)
    
            const variant = product.type.find(p => p.kind === kind)
            if (!variant) return { success: false, message: "Invalid kind" }
    
            if (existingItem) {
                existingItem.quantity += quantity
                if (note) existingItem.note = note
                existingItem.price = variant.price
                existingItem.discount = variant.discount
            } else {
                cart.items.push({
                    product: productId,
                    kind,
                    quantity,
                    price: variant.price,
                    discount: variant.discount,
                    note
                })
            }
    
            await cart.save()
            return cart
        } catch (error) {
            return { success: false, message: error.message }
        }
    }
    

    static deleteItemCart = async ({ userId, productId, kind, quantity }) => {
        try {
            console.log(userId)
            const user = await userModel.findById(userId)
            const product = await productModel.findById(productId)

            if (!user) {
                return {
                    success: false,
                    message: "wrong user"
                }
            }

            if (!product) {
                return {
                    success: false,
                    message: "wrong product"
                }
            }

            if (!product.type.some(p => p.kind == kind)) {
                return {
                    success: false,
                    message: "wrong kind"
                }
            }

            const cart = await cartModel.findOne({ userId: userId })

            if (quantity) {
                if (cart.items.some((item) => item.product == productId && item.kind == kind)) {
                    cart.items.forEach(item => {
                        if (item.product == productId && item.kind == kind) {
                            if (item.quantity > quantity) {
                                if (note) { item.note = note }
                                item.quantity -= quantity
                            }
                        }
                    })

                    await cart.save()

                    return cart
                }
                else {
                    return {
                        success: false,
                        message: "product not found in cart"
                    }
                }
            }
            else {
                if (cart.items.some((item) => item.product == productId && item.kind == kind)) {
                    cart.items.forEach((item, index) => {
                        if (item.product == productId && item.kind == kind) {
                            cart.items.splice(index, 1)
                        }
                    })

                    await cart.save()

                    return cart
                }
                else {
                    return {
                        success: false,
                        message: "product not found in cart"
                    }
                }
            }


        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static addItemCartNoLogin = async ({ cartId, productId, kind, quantity, note }) => {
        try {
            const product = await productModel.findById(productId)

            const cart = await cartModel.findById(cartId)

            if (!cart) {
                return {
                    success: false,
                    message: "wrong cart"
                }
            }

            if (!product) {
                return {
                    success: false,
                    message: "wrong product"
                }
            }

            if (!product.type.some(p => p.kind == kind)) {
                return {
                    success: false,
                    message: "wrong kind"
                }
            }

            if (cart.items.some((item) => item.product == productId && item.kind == kind)) {
                cart.items.forEach(item => {
                    if (item.product == productId && item.kind == kind) {
                        item.quantity += quantity
                        product.type.forEach(p => {
                            if (p.kind == kind) {
                                item.price = p.price
                                item.discount = product.discount
                            }
                        })
                    }
                })

                await cart.save()

                return cart
            }
            else {
                product.type.forEach(p => {
                    if (p.kind == kind) {
                        cart.items.push({
                            "product": productId,
                            quantity,
                            kind,
                            "price": p.price,
                            "discount": product.discount,
                            note
                        })
                    }
                })

                await cart.save()

                return cart
            }

        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static deleteItemCartNoLogin = async ({ cartId, productId, kind, quantity }) => {
        try {
            const cart = await cartModel.findById(cartId)

            const product = await productModel.findById(productId)

            if (!cart) {
                return {
                    success: false,
                    message: "wrong cart"
                }
            }

            if (!product) {
                return {
                    success: false,
                    message: "wrong product"
                }
            }

            if (!product.type.some(p => p.kind == kind)) {
                return {
                    success: false,
                    message: "wrong kind"
                }
            }

            if (quantity) {
                if (cart.items.some((item) => item.product == productId && item.kind == kind)) {
                    cart.items.forEach(item => {
                        if (item.product == productId && item.kind == kind) {
                            if (item.quantity > quantity) {
                                item.quantity -= quantity
                            }
                        }
                    })

                    await cart.save()

                    return cart
                }
                else {
                    return {
                        success: false,
                        message: "product not found in cart"
                    }
                }
            }
            else {
                if (cart.items.some((item) => item.product == productId && item.kind == kind)) {
                    cart.items.forEach((item, index) => {
                        if (item.product == productId && item.kind == kind) {
                            cart.items.splice(index, 1)
                        }
                    })

                    await cart.save()

                    return cart
                }
                else {
                    return {
                        success: false,
                        message: "product not found in cart"
                    }
                }
            }


        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static clearCartById = async ({ id }) => {
        try {
            const cart = await cartModel.findById(id).populate({
                path: "userId",
                select: '_id name email address phone'
            }).populate('items.product')

            if (!cart) {
                return {
                    success: false,
                    message: "wrong cart"
                }
            }

            cart.items = []

            cart.save()

            return cart
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static updateQuantity = async ({ userId, productIds, quantities, notes }) => {
        try {
            console.log(quantities)
            const cart = await cartModel.findOne({ userId: { _id: userId } })

            if (!cart) {
                return {
                    success: false,
                    message: "Cart not found"
                }
            }

            productIds.forEach((productId, index) => {
                const quantity = quantities[index]
                const note = notes[index]
                console.log(quantity + " " + note)
                const item = cart.items.find(item => item.product._id.toString() === productId)

                if (item) {
                    item.quantity = quantity
                    item.note = note
                }
            })

            await cart.save()

            return {
                success: true,
                message: "Cart updated successfully",
                cart
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static updateQuantityNoLog = async ({ cartId, productIds, quantities, notes }) => {
        try {
            const cart = await cartModel.findById(cartId)
            if (!cart) {
                return {
                    success: false,
                    message: "Cart not found"
                }
            }

            productIds.forEach((productId, index) => {
                const quantity = quantities[index]
                const note = notes[index]
                const item = cart.items.find(item => item.product._id.toString() === productId)

                if (item) {
                    item.quantity = quantity
                    item.note = note
                }
            })

            await cart.save()

            return {
                success: true,
                message: "Cart updated successfully",
                cart
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static clearCartByUserId = async ({ userId }) => {
        try {
            const cart = await cartModel.findOne({ userId: userId }).populate({
                path: "userId",
                select: '_id name email address phone'
            }).populate('items.product')

            if (!cart) {
                return {
                    success: false,
                    message: "wrong cart"
                }
            }

            cart.items = []

            cart.save()

            return cart
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }
}

module.exports = CartService;
const OrdersServices = require('../services/order.service')

class OrdersController {

    addOrder = async (req, res, next) => {
        try {
            return res.status(201).json(await OrdersServices.addOrder(req.body))
        } catch (error) {
            next(error)
        }
    }

    addOrderNoAccount = async (req, res, next) => {
        try {
            return res.status(201).json(await OrdersServices.addOrderNoAccount(req.body, req.params))
        } catch (error) {
            next(error)
        }
    }

    deleteOrderNoAccount = async (req, res, next) => {
        try {
            return res.status(201).json(await OrdersServices.deleteOrderNoAccount(req.query))
        } catch (error) {
            next(error)
        }
    }

    getOrder = async (req, res, next) => {
        try {
            return res.status(201).json(await OrdersServices.getOrder())
        } catch (error) {
            next(error)
        }
    }

    getOrderID = async (req, res, next) => {
        try {
            return res.status(201).json(await OrdersServices.getOrderID(req.params))
        } catch (error) {
            next(error)
        }
    }

    getOrdersByUserId = async (req, res, next) => {
        try {
            return res.status(201).json(await OrdersServices.getOrdersByUserId(req.params))
        } catch (error) {
            next(error)
        }
    }

    updateOrder = async (req, res, next) => {
        try {
            return res.status(201).json(await OrdersServices.updateOrder(req.params, req.body))
        } catch (error) {
            next(error)
        }
    }

    deleteOrder = async (req, res, next) => {
        try {
            return res.status(201).json(await OrdersServices.deleteOrder(req.params))
        } catch (error) {
            next(error)
        }
    }

    paymentOrder = async (req, res, next) => {
        try {
            return res.status(201).json(await OrdersServices.paymentOrder(req.body))
        } catch (error) {
            next(error)
        }
    }
    changeStatus = async (req, res) => {
        try {
            return res.status(201).json(await OrdersServices.changeStatus(req.params, req.body))
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new OrdersController()
const VouchersService = require('../services/voucher.service')

class VouchersController {
    addVoucher = async (req, res, next) => {
        try {
            return res.status(201).json(await VouchersService.addVoucher(req.body))
        } catch (error) {
            next(error)
        }
    }

    getVoucher = async (req, res, next) => {
        try {
            return res.status(201).json(await VouchersService.getVoucher())
        } catch (error) {
            next(error)
        }
    }

    getVoucherID = async (req, res, next) => {
        try {
            return res.status(201).json(await VouchersService.getVoucherID(req.params))
        } catch (error) {
            next(error)
        }
    }

    getVoucherByName = async (req, res, next) => {
        try {
            return res.status(201).json(await VouchersService.getVoucherByName(req.params))
        } catch (error) {
            next(error)
        }
    }

    updateVoucher = async (req, res, next) => {
        try {
            return res.status(201).json(await VouchersService.updateVoucher(req.params, req.body))
        } catch (error) {
            next(error)
        }
    }

    deleteVoucher = async (req, res, next) => {
        try {
            return res.status(201).json(await VouchersService.deleteVoucher(req.params))
        } catch (error) {
            next(error)
        }
    }

    confirmVoucher = async (req, res, next) => {
        try {
            return res.status(201).json(await VouchersService.confirmVoucher(req.body))
        } catch (error) {
            next(error)
        }
    }

    checkVoucher = async (req, res, next) => {
        try {
            return res.status(201).json(await VouchersService.checkStatusVoucher(req.body))
        } catch (error) {
            next(error)
        }
    }
    
    getTotalUsedVouchers = async (req, res, next) => {
        try {
            return res.status(201).json(await VouchersService.getTotalUsedVouchers(req.body))
        } catch (error) {
            next(error)
        }
    }

    vouchersToId = async (req, res, next) => {
        try {
            return res.status(201).json(await VouchersService.vouchersToId(req.body))
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new VouchersController()
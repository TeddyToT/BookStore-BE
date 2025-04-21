const voucherModel = require('../models/voucher.model');
const userModel = require('../models/user.model');
const { InternalServerError, BadRequestError, ConflictRequestError } = require('../utils/errorResponse')

class VouchersService {
    static addVoucher = async ({ name, startDay, endDay, type, value }) => {
        try {
            const isExist = await voucherModel.findOne({ name }).lean();
            if (isExist) {
                return new ConflictRequestError('Already exist')
            }

            [startDay, endDay] = [new Date(startDay), new Date(endDay)]
            if (startDay > endDay) {
                return new BadRequestError('Start date must be before end date')
            }

            const newVoucher = new voucherModel({
                name, startDay, endDay, type, value, "customerUsed": []
            })

            return await newVoucher.save()
        } catch (error) {
            // Validation error "type"
            if (error.name === 'ValidationError') {
                return new BadRequestError('Invalid input for type')
            }

            throw new InternalServerError(error.message)
        }
    }

    static getVoucher = async () => {
        try {
            return await voucherModel.find().populate({
                path: "customerUsed",
                select: '_id name email address phone'
            })
        } catch (error) {
            throw new InternalServerError(error.message)
        }
    }

    static getVoucherID = async ({ id }) => {
        try {
            const voucher = await voucherModel.findById(id).populate({
                path: "customerUsed",
                select: '_id name email address phone'
            })
            if (!voucher) {
                return new ConflictRequestError(`Voucher doesn't exist`)
            }

            return voucher
        } catch (error) {
            throw new InternalServerError(error.message)
        }
    }

    static updateVoucher = async ({ id }, { name, startDay, endDay, type, value }) => {
        try {
            [startDay, endDay] = [new Date(startDay), new Date(endDay)]
            if (startDay > endDay) {
                return new BadRequestError('Start date must be before end date')
            }

            const voucher = await voucherModel.findByIdAndUpdate(id, { name, startDay, endDay, type, value }, {
                new: true,
                runValidators: true
            })

            if (!voucher) {
                return new ConflictRequestError(`Voucher doesn't exist`)
            }

            return voucher
        } catch (error) {
            // duplicate key error
            if (error.code === 11000) {
                return new ConflictRequestError('Voucher name already exists')
            }

            throw new InternalServerError(error.message)
        }
    }

    static deleteVoucher = async ({ id }) => {
        try {
            const voucher = await voucherModel.findByIdAndDelete(id)
            if (!voucher) {
                return new ConflictRequestError(`Voucher doesn't exist`)
            }

            return {
                success: true,
                message: 'Voucher deleted successfully'
            }
        } catch (error) {
            // duplicate key error
            if (error.code === 11000) {
                return new ConflictRequestError('Voucher name already exists')
            }

            throw new InternalServerError(error.message)
        }
    }

    static confirmVoucher = async (id, userId) => {
        try {
            const user = await userModel.findById(userId)

            if (!user) {
                return {
                    success: false,
                    message: "wrong user"
                }
            }

            const voucher = await voucherModel.findById(id)

            if (voucher) {
                const currentTime = new Date().getTime()

                if (voucher.startDay.getTime() <= currentTime && voucher.endDay.getTime() >= currentTime) {

                    if (voucher.customerUsed.some(user => user.toString() == userId.toString())) {
                        return {
                            success: false,
                            message: "voucher can only be used once"
                        }
                    }
                    else {

                        voucher.customerUsed.push(userId)

                        await voucher.save()

                        return {
                            success: true,
                            message: "used successfully",
                            voucher: {
                                type: voucher.type,
                                value: voucher.value
                            }
                        }
                    }
                }
                else {
                    if (voucher.startDay.getTime() > currentTime) {
                        return {
                            success: false,
                            message: "voucher cannot be used yet"
                        }
                    }

                    if (voucher.endDay.getTime() < currentTime) {
                        return {
                            success: false,
                            message: "voucher expires"
                        }
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

    static checkVoucher = async (id, userId) => {
        try {
            const user = await userModel.findById(userId)

            if (!user) {
                return {
                    success: false,
                    message: "wrong user"
                }
            }

            const voucher = await voucherModel.findById(id)

            if (voucher) {
                const currentTime = new Date().getTime()

                if (voucher.startDay.getTime() <= currentTime && voucher.endDay.getTime() >= currentTime) {
                    if (voucher.customerUsed.some(user => user.toString() == userId.toString())) {
                        return {
                            success: false,
                            message: "voucher can only be used once"
                        }
                    }
                    else {
                        return {
                            success: true,
                            voucher: {
                                type: voucher.type,
                                value: voucher.value
                            }
                        }
                    }
                }
                else {
                    if (voucher.startDay.getTime() > currentTime) {
                        return {
                            success: false,
                            message: "voucher cannot be used yet"
                        }
                    }

                    if (voucher.endDay.getTime() < currentTime) {
                        return {
                            success: false,
                            message: "voucher expires"
                        }
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

    static checkStatusVoucher = async ({ id, userId }) => {
        try {
            const voucher = await voucherModel.findById(id)

            if (voucher) {
                const currentTime = new Date().getTime()

                if (voucher.startDay.getTime() <= currentTime && voucher.endDay.getTime() >= currentTime) {
                    if (voucher.customerUsed.some(user => user.toString() == userId.toString())) {
                        return {
                            success: false,
                            message: "voucher can only be used once"
                        }
                    }
                    else {
                        return {
                            voucher: {
                                success: true,
                                message: "available"
                            }
                        }
                    }
                }
                else {
                    if (voucher.startDay.getTime() > currentTime) {
                        return {
                            success: false,
                            message: "pending"
                        }
                    }

                    if (voucher.endDay.getTime() < currentTime) {
                        return {
                            success: false,
                            message: "expire"
                        }
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

    static getTotalUsedVouchers = async ({ userId, vouchers, total }) => {
        try {
            const user = await userModel.findById(userId)

            if (!user) {
                return {
                    success: false,
                    message: "wrong user"
                }
            }

            for (let ele of vouchers) {
                const existVoucher = await voucherModel.findById(ele);

                if (!existVoucher) {
                    return {
                        success: false,
                        message: "voucher can not found"
                    }
                }

                const currentTime = new Date().getTime()

                if (existVoucher.startDay.getTime() <= currentTime && existVoucher.endDay.getTime() >= currentTime) {
                    if (existVoucher.customerUsed.some(u => u.toString() == userId.toString())) {
                        return {
                            success: false,
                            message: "voucher can only be used once"
                        }
                    }
                }
                else {
                    if (existVoucher.startDay.getTime() > currentTime) {
                        return {
                            success: false,
                            message: "voucher cannot be used yet"
                        }
                    }

                    if (existVoucher.endDay.getTime() < currentTime) {
                        return {
                            success: false,
                            message: "voucher expires"
                        }
                    }
                }

            }

            const totalPrice = total
            let isOverHalfTotal = false

            for (const item of vouchers) {
                let check = await this.checkVoucher(item, userId)
                // console.log(check, 'heh')
                
                if (check.success) {
                    let { type } = check.voucher

                    if (type === 'amount') {
                        let value = check.voucher.value

                        if (total - value < totalPrice * 0.5) {
                            isOverHalfTotal = true
                        }

                        total -= value
                    }
                }
            }

            for (const item of vouchers) {
                let check = await this.checkVoucher(item, user)

                if (check.success) {
                    let { type } = check.voucher

                    if (type === 'percent') {
                        let value = check.voucher.value

                        if (total - (total * value) / 100 < totalPrice * 0.5) {
                            isOverHalfTotal = true
                        }

                        total -= (total * value) / 100
                    }
                }
            }

            if(isOverHalfTotal){
                return {
                    success: false,
                    message: "over half",
                    total: total
                }
            }
            else{
                return {
                    success: true,
                    total: total
                }
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static vouchersToId = async ({ vouchers }) => {
        try {
            const newVouchers = []
            
            for (const item of vouchers) {
                const existVoucher = await voucherModel.findOne({name: item});

                newVouchers.push(existVoucher.id)
            }

            return newVouchers
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }
}

module.exports = VouchersService
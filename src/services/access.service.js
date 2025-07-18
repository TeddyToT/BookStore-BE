const ForgetModel = require('../models/forgetPass.model')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')
const getData = require('../utils/formatResponse');
const AuthService = require('./auth.service');
const userModel = require('../models/user.model');
const { InternalServerError, BadRequestError, ConflictRequestError } = require('../utils/errorResponse')
const isInvalidEmail = require('../utils/checkEmail')

const storeMail = process.env.EMAIL_STORE;
const storeMailPassword = process.env.EMAIL_PASS;


const MIN_PASSWORD_LENGTH = 6

const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000);
}

class AccessService {
    static signup = async ({ name, email, address, phone, password, role }) => {
        try {
            const checkEmail = await isInvalidEmail(email)
            if (checkEmail) {
                return new BadRequestError('Disposable or Invalid email is not allowed')
            }

            const existEmail = await userModel.findOne({ email: email }).lean()
            if (existEmail) {
                return new ConflictRequestError('Email already exists')
            }

            const existPhone = await userModel.findOne({ phone: phone }).lean()
            if (existPhone) {
                return new ConflictRequestError('Phone already exists')
            }

            if (password.length < MIN_PASSWORD_LENGTH) {
                return new BadRequestError('Password must be at least 6 characters long')
            }

            const salt = await bcrypt.genSalt()
            const passwordHash = await bcrypt.hash(password, salt)

            const newUser = await userModel.create({
                "name": name,
                "email": email || null,
                "address": address,
                "phone": phone || null,
                "password": passwordHash,
                "role": role
            })

            const payload = { id: newUser._id, email, phone };

            const accessToken = AuthService.createAccessToken(payload);

            if (email) {
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: storeMail,
                        pass: storeMailPassword
                    }
                })

                var mailoptions = {
                    from: storeMail,
                    to: newUser.email,
                    subject: 'Đăng ký thành công - Book Store',
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 10px; border: 2px solid #e0e0e0; border-radius: 10px;">
                            <h2 style="color:rgb(52, 145, 221); text-align: center;">Welcome to Book Store!</h2>
                            <p style="font-size: 18px; color: #333;">Xin chào bạn,</p>
                            <p style="font-size: 16px; color: #333;">
                                Chúng tôi rất vui mừng khi có bạn tham gia. Bạn đã đăng ký tài khoản thành công với BookStore.
                            </p>
                            <div style="text-align: center; margin: 20px 0;">
                                <img src="https://d2u4q3iydaupsp.cloudfront.net/QqWTq0SV6DJsPop8vgo7MgI8n2JqdoAsyJWMre6290zep0GmMDtMRtxrcdkPuLo8yFhvNtZs49DKZ79Kmu0GKnoBvtw7vW5HyBQI8cfAHAiKhKgcn6S1OSTEEVOWtkIL" alt="Thank You" style="max-width: 50%; max-height: 100px; border-radius: 10px;">
                            </div>
                            <p style="font-size: 16px; color: #333;">
                                Hãy khám phá các tính năng của chúng tôi và tận hưởng trải nghiệm mua sắm tốt nhất.
                            </p>
                            <p style="font-size: 16px; color: #333;">
                                Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại <a href="mailto:${storeMail}" style="color: rgb(52, 145, 221);">liên hệ với chúng tôi</a>.
                            </p>
                            <p style="font-size: 16px; color: #333;">
                                Trân trọng,<br>
                                The Bookstore Team
                            </p>
                        </div>
                    `
                }

                transporter.sendMail(mailoptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            }
            return {
                success: true,
                user: getData({ fields: ['_id', 'name', 'email', 'address', 'phone', 'role'], object: newUser }),
                accessToken: accessToken
            }
        } catch (error) {
            // Validation Error
            if (error.name === 'ValidationError') {
                const errors = Object.values(error.errors).map(key => ({
                    field: key.path,
                    message: key.message
                }))

                return {
                    type: new BadRequestError('Validation Error', 400),
                    errors: errors
                }
            }
            // Internal Server Error
            return new InternalServerError(error.message)
        }
    }
    // [POST]/v1/api/login
    static login = async ({ email, password }, res) => {
        try {
            const existUser = await userModel.findOne({ email })
            if (!existUser) {
                return {
                    success: false,
                    message: "User not registered"
                }
            }
            const match = await bcrypt.compare(password, existUser.password);
            if (!match) {
                return {
                    success: false,
                    message: 'Wrong Password'
                }
            }

            const payload = { id: existUser.id, email };

            const accessToken = AuthService.createAccessToken(payload);

            const refreshToken = AuthService.createRefreshToken(payload);

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 14,
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14)
            })

            return {
                success: true,
                user: getData({ fields: ['_id', 'email', 'phone', 'address', 'name', 'birthday', 'role'], object: existUser }),
                accessToken: accessToken,
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static getVerificationCode = async ({ email }) => {
        try {
            const existUser = await userModel.findOne({ email: email })
            console.log('Email nhận vào:', email);
            if (!existUser || !existUser.email) {
                console.log("user not founDDDD");
                return {
                    success: false,
                    message: "User doesn't exist"
                }
            }

            if (email) {
                const verificationCode = generateVerificationCode();

                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: storeMail,
                        pass: storeMailPassword
                    }
                })

                var mailoptions = {
                    from: storeMail,
                    to: existUser.email,
                    subject: 'Verification Code - Book Store',
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 10px; border: 2px solid #e0e0e0; border-radius: 10px;">
                            <h2 style="color: rgb(52, 145, 221); text-align: center;">Mã xác nhận đặt lại mật khẩu</h2>
                            <p style="font-size: 18px; color: #333;">Xin chào bạn,</p>
                            <p style="font-size: 16px; color: #333;">
                                Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản Book Store của bạn. Vui lòng sử dụng mã xác nhận dưới đây để đặt lại mật khẩu.
                            </p>
                            <p style="font-size: 16px; color: #333; text-align: center;">
                                Mã xác nhận của bạn là: <strong>${verificationCode}</strong>, mã sẽ có thời hạn trong vòng 10 phút
                            </p>
                            <p style="font-size: 16px; color: #333;">
                                Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này hoặc liên hệ với bộ phận hỗ trợ của chúng tôi nếu bạn có bất kỳ câu hỏi nào.
                            </p>
                            <p style="font-size: 16px; color: #333;">
                                Trân trọng,<br>
                                The Bookstore Team
                            </p>
                        </div>
                    `
                }

                transporter.sendMail(mailoptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });

                const currentDate = new Date();
                const expireDate = new Date(currentDate.getTime() + (10 * 60 * 1000))
                const newForget = new ForgetModel({
                    userId: existUser._id,
                    verificationCode: verificationCode,
                    expiredDate: expireDate
                })
                await newForget.save()
            }

            return {
                message: "Send email successfully"
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static checkVerification = async ({ email, code }) => {
        try {
            const existEmail = await userModel.findOne({ email: email })
            if (!existEmail) {
                return {
                    success: false,
                    message: "User don't exist"
                }
            }

            const existForgetPassword = await ForgetModel.find({ userId: existEmail._id })
            if (!existForgetPassword) {
                return {
                    success: false,
                    message: "Verification don't get in email"
                }
            }
            const currentDate = new Date();
            const validObjects = existForgetPassword.filter(ele =>
                new Date(ele.expiredDate) > currentDate && ele.verificationCode === code
            );
            if (validObjects.length === 0) {
                return {
                    success: false,
                    message: "Verification code is not valid"
                }
            }
            const lastValidObject = validObjects[validObjects.length - 1];

            return {
                success: true,
                data: lastValidObject
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static changePassword = async ({ email, newPassword }) => {
        try {
            const existEmail = await userModel.findOne({ email: email })
            if (!existEmail) {
                return {
                    success: false,
                    message: "User don't exist"
                }
            }

            const salt = await bcrypt.genSalt()
            const newPasswordHash = await bcrypt.hash(newPassword, salt)

            const updateUser = await userModel.findByIdAndUpdate({ _id: existEmail._id }, { password: newPasswordHash }, { new: true })

            if (updateUser) {
                return {
                    success: true,
                    message: "Password updated successfully",
                    user: updateUser
                };
            } else {
                return {
                    success: false,
                    message: "Failed to update password"
                };
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static updateInfo = async ({  name, phone, email, address }, { userId }) => {
        try {
            const existUser = await userModel.findById(userId)
            if (!existUser) {
                return {
                    success: false,
                    message: "User don't exist"
                }
            }

            const emailExist = await userModel.findOne({ email: email })

            if (emailExist && existUser.email != email) {
                return {
                    success: false,
                    message: "email exists"
                }
            }



            if (name) {
                existUser.name = name
            }

            if (phone) {
                existUser.phone = phone
            }

            if (email) {
                existUser.email = email
            }

            if (address) {
                existUser.address = address
            }

            await existUser.save()

            return {
                success: true,
                user: getData({ fields: ['_id', 'email', 'phone', 'address', 'name'], object: existUser })

            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static logout = async (req, res) => {
        const ck = req.cookies.refreshToken
        if (!ck) {
            return {
                message: 'You are not logged in'
            }
        }
        res.clearCookie('refreshToken')
        return {
            message: "Logout successfully"
        }
    }

    static contact = async ({ name, email, text }) => {
        try {
            if (email) {
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: storeMail,
                        pass: storeMailPassword
                    }
                })

                var mailoptions = {
                    from: storeMail,
                    to: email,
                    subject: 'Ghi nhận phản hồi - Bookstore',
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 10px; border: 2px solid #e0e0e0; border-radius: 10px;">
                            <h2 style="color: rgb(52, 145, 221); text-align: center;">Cảm ơn bạn đã phản hồi!</h2>
                            <p style="font-size: 18px; color: #333;">Xin chào ${name},</p>
                            <p style="font-size: 16px; color: #333;">
                                Cảm ơn bạn đã dành thời gian để gửi phản hồi quý báu cho chúng tôi. Dưới đây là tóm tắt ý kiến của bạn:
                            </p>
                            <blockquote style="border-left: 4px solid #ccc; margin: 20px 0; padding-left: 15px; color: #555;">
                                ${text}
                            </blockquote>
                            <p style="font-size: 16px; color: #333;">
                            Chúng tôi rất trân trọng ý kiến của bạn và sẽ sử dụng nó để cải thiện dịch vụ và trải nghiệm mua sắm của bạn.
                            </p>
                            <p style="font-size: 16px; color: #333;">
                                Trân trọng,<br>
                                The Bookstore Team
                            </p>
                        </div>
                    `
                }

                transporter.sendMail(mailoptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });

                return {
                    sucess: true,
                    message: "Send email successfully"
                }
            } else {
                return {
                    sucess: false,
                    message: "Send email failed"
                }
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static getUsers = async () => {
        try {
            const users = await userModel.find().lean()

            return users
        } catch (error) {
            return new InternalServerError(error.message)
        }
    }

    static getUserById = async ({ id }) => {
        try {
            const user = await userModel.findById(id)

            return user
        } catch (error) {
            return new InternalServerError(error.message)
        }
    }
}

module.exports = AccessService;
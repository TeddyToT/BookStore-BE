const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')
const getData = require('../utils/formatResponse');

class AuthService {
    static createAccessToken = (payload) => {
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1d'
        })
        return accessToken
    }

    static createRefreshToken = (payload) => {
        const refreshToken = jwt.sign( payload, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '30d',
        })
        return refreshToken
    }

    static verifyToken = (req, res, next) => {
        const token = req.headers['authorization']
        if (token){
            const accessToken = token.split(" ")[1]
            jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
                if (err) {
                    return res.status(403).json({
                        message: 'Invalid token'
                    })
                }
                req.user = user;
                next();
            })
        }else{
            return res.status(401).json({
                message: 'You are not authorized to access' 
            })
        }
    }
    // [POST]v1/api/refreshToken
    static HandleRefreshToken = async (req,res) => {
        const refreshToken = req.cookies.refreshToken
        const decoded = jwt.decode(refreshToken);

        if (decoded) {
            const exitsPayment = await paymentModel.findOne({email: decoded.id})
            if (!exitsPayment) {
                return {
                    success: false,
                    message: "Payment does not exist"
                }
            }
            else{
                if (!refreshToken) {
                    return res.status(401).json({
                        message: 'You are not authorized to access'   
                    })
                }
                jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                    if (err) {
                        return res.status(403).json({
                            message: 'Invalid token'
                        })
                    }
                    const newAccessToken = AuthService.createAccessToken({id: user.id, email: user.email})
                    const newRefreshToken = AuthService.createRefreshToken({id: user.id, email: user.email})
                    res.cookie("refreshToken", newRefreshToken, {
                        httpOnly: true,
                        secure: false,
                        sameSite: "strict",
                        maxAge: 1000 * 60 * 60 * 24 * 14,
                        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14)
                    })
        
                    return res.status(200).json({
                        accessToken: newAccessToken,
                        user: getData({ fields: ['id', 'email'], object: user}),
                    })
                })
            }
        }
        
    }
}

module.exports = AuthService;
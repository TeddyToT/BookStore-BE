const AuthService = require('../services/auth.service')

class AuthController {
    handleRefreshToken = async (req, res, next) => {
        try {
            return res.status(201).json(await AuthService.HandleRefreshToken(req,res))
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new AuthController()
const ShopService = require('../services/shop.service');

class ShopController {
    getShop = async (req, res, next) => {
        try {
            const shop = await ShopService.getShop();
            return res.status(200).json(shop);
        } catch (error) {
            next(error);
        }
    }

    addShop = async (req, res, next) => {
        try {
            console.log('Request Body:', req.body);
        console.log('Request Files:', req.files);
            return res.status(201).json(await ShopService.addShop(req.files,req.body));

        } catch (error) {
            next(error);
        }
    }

    updateShop = async (req, res, next) => {
        try {
            return res.status(201).json(await ShopService.updateShop(req.files,req.body));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ShopController();

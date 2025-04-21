const Shop = require('../models/shop.model');
const uploadImage = require('../utils/uploadImage');
const deleteImage = require('../utils/deleteImage');

class ShopService {
    static getShop = async () => {
        const shop = await Shop.findOne().lean();
        return shop;
    }

    static addShop = async (files, data) => {
        console.log(files, data);
        const shopExists = await Shop.findOne();
        if (shopExists) return { success: false, message: "Shop already exists" };

        let logo = null;
        let logodark = null;

        if (files?.logo) {
            logo = await uploadImage(files.logo[0].path, 'Book/Logo');
        }

        if (files?.logodark) {
            logodark = await uploadImage(files.logodark[0].path, 'Book/Logo');
        }

        const newShop = new Shop({
            ...data,
            logo,
            logodark
        });

        const savedShop = await newShop.save();
        return savedShop;
    }

    static updateShop = async (files, data) => {
        const shop = await Shop.findOne();
        if (!shop) return { success: false, message: "Shop not found" };

        let logo = shop.logo;
        let logodark = shop.logodark;

        if (files?.logo) {
            logo = await uploadImage(files.logo[0].path, 'Book/Logo');
        }

        if (files?.logodark) {
            logodark = await uploadImage(files.logodark[0].path, 'Book/Logo');
        }

        Object.assign(shop, data);
        shop.logo = logo;
        shop.logodark = logodark;

        const updated = await shop.save();
        return updated;
    }
}

module.exports = ShopService;

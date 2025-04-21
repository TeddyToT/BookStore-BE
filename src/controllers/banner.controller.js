const BannerService = require('../services/banner.service');

class BannerController {
  getBanner = async (req, res, next) => {
    try {
        return res.status(201).json(await BannerService.getBanner())

    } catch (error) {
      next(error);
    }
  };

  addBanner = async (req, res, next) => {
    try {
        return res.status(201).json(await BannerService.addBanner(req.files, req.body))

    } catch (error) {
      next(error);
    }
  };

  updateBanner = async (req, res, next) => {
    try {
      const result = await BannerService.updateBanner(req.files, req.body.images ? JSON.parse(req.body.images) : []);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  deleteImage = async (req, res, next) => {
    try {
        console.log("iamge: ",req.body);
      const { imageUrl } = req.body;
      const result = await BannerService.deleteImageFromBanner(imageUrl);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  deleteAllBanners = async (req, res, next) => {
    try {
        return res.status(201).json(await BannerService.deleteAllBanners())

    } catch (error) {
      next(error);
    }
  };
}

module.exports = new BannerController();

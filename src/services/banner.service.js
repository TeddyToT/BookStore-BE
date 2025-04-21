const Banner = require('../models/banner.model');
const uploadImage = require('../utils/uploadImage');
const deleteImage = require('../utils/deleteImage');

class BannerService {
  static async getBanner() {
    const banner = await Banner.findOne().lean();
    return banner;
  }

  static async addBanner(files) {
    const imageUrls = [];
  
    for (const file of files) {
      const imageUrl = await uploadImage(file.path, 'Book/Banner');
      imageUrls.push(imageUrl);
    }
  
    const newBanner = new Banner({ images: imageUrls });
    return await newBanner.save();
  }

  static async updateBanner(files) {
    const banner = await Banner.findOne();
    if (!banner) return { success: false, message: 'No banner to update' };
  
    const newImageUrls = [];
    for (const file of files) {
      const imageUrl = await uploadImage(file.path, 'Book/Banner');
      newImageUrls.push(imageUrl);
    }
  
    banner.images.push(...newImageUrls);
    return await banner.save();
  }

  static async deleteImageFromBanner(imageUrl) {
    const banner = await Banner.findOne();
    if (!banner) return { success: false, message: "Banner not found" };

    banner.images = banner.images.filter(img => img !== imageUrl);

    const parts = imageUrl.split('/');
    const fileName = parts[parts.length - 1].split('.')[0];
    const publicId = `Book/Banner/${fileName}`;
    await deleteImage(publicId);

    return await banner.save();
  }

  static async deleteAllBanners() {
    const banner = await Banner.findOne();
    if (!banner) return { success: false, message: "No banner to delete" };
  
    for (const imageUrl of banner.images) {
      const parts = imageUrl.split('/');
      const fileName = parts[parts.length - 1].split('.')[0];
      const publicId = `Book/Banner/${fileName}`;
      await deleteImage(publicId);
    }
  
    await Banner.deleteMany();
    return { success: true, message: "All banners deleted" };
  }
}

module.exports = BannerService;

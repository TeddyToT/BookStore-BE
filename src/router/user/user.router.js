const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'uploads/', limits: { fieldSize: 25 * 1024 * 1024 } });


const ProductController = require('../../controllers/product.controller')
const VouchersController = require('../../controllers/voucher.controller')
const OrderController = require('../../controllers/order.controller')
const CartController = require('../../controllers/cart.controller')
const AccessController = require('../../controllers/access.controller')
const AuthController = require('../../controllers/auth.controller')
const CategoryController = require('../../controllers/category.controller')
const AuthorController = require('../../controllers/author.controller');
const shopController = require('../../controllers/shop.controller');
const BannerController = require('../../controllers/banner.controller');
const FeedbackController = require ('../../controllers/feedback.controller')
// get verification code
router.post('/verification', AccessController.getVerificationCode)
//check expire verification code
router.post('/verification/check', AccessController.checkVerification)
// change password
router.put('/password/change', AccessController.changePassword)
// update info 
router.put('/users/update/:userId', AccessController.updateInfo)
// refresh token
router.post('/refreshToken', AuthController.handleRefreshToken)
// logout
router.post('/logout', AccessController.logout)
// contact
router.post('/contact', AccessController.contact)

//product
router.get('/products', ProductController.getProduct)
router.get('/products/categories', ProductController.listCategoryOfProduct)
router.get('/products/authors', ProductController.listAuthorOfProduct)
router.get('/products/:id', ProductController.getProductID)
router.post('/products', upload.array('images', 10), ProductController.addProduct)
router.put('/products/:id', upload.array('images', 10), ProductController.updateProduct)
router.put('/products/name/:id', ProductController.updateProductNameById)
router.delete('/products/:id', ProductController.deleteProduct)
router.post('/getIdProductByName', ProductController.getIdProductByName)

//vouchers
router.post('/vouchers', VouchersController.addVoucher)
router.get('/vouchers', VouchersController.getVoucher)
// router.get('/vouchers/:name', VouchersController.getVoucherByName)
router.get('/vouchers/:id', VouchersController.getVoucherID)
router.put('/vouchers/:id', VouchersController.updateVoucher)
router.delete('/vouchers/:id', VouchersController.deleteVoucher)
router.post('/vouchers/confirmVoucher', VouchersController.confirmVoucher)
router.post('/vouchers/checkVoucher', VouchersController.checkVoucher)
router.post('/vouchers/getTotalUsedVouchers', VouchersController.getTotalUsedVouchers)
router.post('/vouchers/vouchersToId', VouchersController.vouchersToId)

//orders
router.post('/orders', OrderController.addOrder)
router.get('/orders', OrderController.getOrder)
router.get('/orders/:id', OrderController.getOrderID)
router.get('/orders/users/:userId', OrderController.getOrdersByUserId)
router.put('/orders/:id', OrderController.updateOrder)
router.delete('/orders/:id', OrderController.deleteOrder)
router.delete('/ordersAnonymus', OrderController.deleteOrderNoAccount)
router.post('/orders/payment', OrderController.paymentOrder)
router.put('/orders/changeStatus/:id', OrderController.changeStatus)

//cart
router.post('/carts/addCart', CartController.addCart)
router.post('/carts/addItemCart', CartController.addItemCart)
router.delete('/carts/deleteItemCart', CartController.deleteItemCart)
router.post('/carts/addItemCartNoLogin', CartController.addItemCartNoLogin)
router.delete('/carts/deleteItemCartNoLogin', CartController.deleteItemCartNoLogin)
router.get('/carts', CartController.getCart)
router.get('/carts/getCartByUserId/:userId', CartController.getCartByUserId)
router.get('/carts/getCartById/:id', CartController.getCartById)
router.put('/carts/updateQuantity', CartController.updateQuantity)
router.put('/carts/updateQuantityNoLog', CartController.updateQuantityNoLog)
router.delete('/carts/clearCartById/:id', CartController.clearCartById)
router.delete('/carts/clearCartByUserId/:userId', CartController.clearCartByUserId)

//admin
router.get('/users', AccessController.getUsers)
router.get('/users/:id', AccessController.getUserById)

//category
router.get('/categories', CategoryController.getAllCategory)
router.get('/categories/:id', CategoryController.getCategoryById)
router.get('/categories/name/:name', CategoryController.getCategoryByName)
router.post('/categories', CategoryController.addCategory)
router.put('/categories/:id', CategoryController.updateCategory)
router.delete('/categories/:id', CategoryController.deleteCategory)

// author
router.get('/authors', AuthorController.getAllAuthor);
router.get('/authors/:id', AuthorController.getAuthorById);
router.get('/authors/name/:name', AuthorController.getAuthorByName);
router.post('/authors', upload.single('avatar'), AuthorController.addAuthor);
router.put('/authors/:id',upload.single('avatar'), AuthorController.updateAuthor);
router.delete('/authors/:id', AuthorController.deleteAuthor);

//shop
router.get('/shop',  shopController.getShop);
router.post('/shop', upload.fields([{ name: 'logo' }, { name: 'logodark' }]), shopController.addShop);
router.put('/shop', upload.fields([{ name: 'logo' }, { name: 'logodark' }]), shopController.updateShop);

//banner
router.get('/banner', BannerController.getBanner);
router.post('/banner', upload.array('images'), BannerController.addBanner);
router.put('/banner', upload.array('images'), BannerController.updateBanner);
router.delete('/banner/image', BannerController.deleteImage);
router.delete('/banner', BannerController.deleteAllBanners);

//feedback
router.get('/feedbacks', FeedbackController.getAllFeedback)
router.get('/feedbacks/:id', FeedbackController.getFeedbackById)
router.post('/feedbacks', FeedbackController.addFeedback)
router.put('/feedbacks/:id', FeedbackController.updateFeedbackStatus)


module.exports = router
const { registerCaptain, sendOTP, verifyOTP, getCaptainProfile, logoutCaptain } = require('../controller/captain-controller')
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const isLoggedIn = require('../middlewares/isLoggedIn');



router.post('/register', [
  body('mobile').notEmpty().withMessage("Mobile number is required")
    .isMobilePhone("en-IN").withMessage("Invalid Indian mobile number") // for India
    .isLength({ min: 10, max: 10 }).withMessage("Mobile number must be 10 digits"),

  body('otp').notEmpty().withMessage("otp is required")
    .isLength({ min: 6, max: 6 }).withMessage("otp must be 6 digits"),

  body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
  body('vehicle.color').isLength({ min: 3 }).withMessage('Color must be at least 3 characters long'),
  body('vehicle.plate').isLength({ min: 3 }).withMessage('Plate must be at least 3 characters long'),
  body('vehicle.capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  body('vehicle.vehicleType').isIn(['car', 'motorcycle', 'auto']).withMessage('Invalid vehicle type')
], registerCaptain);

router.post('/send-otp', [
  body('mobile').notEmpty().withMessage("Mobile number is required")
    .isMobilePhone("en-IN").withMessage("Invalid Indian mobile number") // for India
    .isLength({ min: 10, max: 10 }).withMessage("Mobile number must be 10 digits"),
], sendOTP);


router.post('/verify-otp', [
  body('otp').notEmpty().withMessage("otp is required")
    .isLength({ min: 6, max: 6 }).withMessage("otp must be 6 digits"),
], verifyOTP)

router.get('/profile',isLoggedIn.captain,getCaptainProfile);

router.get('/logout',isLoggedIn.captain,logoutCaptain);

module.exports = router;
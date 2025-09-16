const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const isLoggedIn = require('../middlewares/isLoggedIn');
const { createRide, getFare, confirmRide, startRide, endRide } = require('../controller/ride-controller');


router.post('/create', isLoggedIn.user, [
    body('pickup').isString().isLength({ min: 3 }).withMessage("Invalid pickup address"),
    body('destination').isString().isLength({ min: 3 }).withMessage("Invalid destination address"),
    body('vehicleType').isString().isIn(['auto', 'car', 'moto']).withMessage("Invalid vehicle type"),
], createRide);


router.get('/get-fare', isLoggedIn.user, [
    query('pickup').isString().isLength({ min: 3 }).withMessage("Invalid pickup address"),
    query('destination').isString().isLength({ min: 3 }).withMessage("Invalid destination address"),
], getFare)


router.post('/confirm', isLoggedIn.captain, [
    body('rideId').isString().isMongoId().withMessage("Invalid ride id"),
], confirmRide);


router.get('/start-ride', isLoggedIn.captain, [
    query('rideId').isString().isMongoId().withMessage("Invalid pickup address"),
    query('otp').isString().isLength({ min: 6, max: 6 }).withMessage('Invalid otp')
], startRide);


router.post('/end-ride', isLoggedIn.captain, [
    body('rideId').isString().isMongoId().withMessage("Invalid ride id"),
], endRide);

module.exports = router;
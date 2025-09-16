const { validationResult } = require('express-validator');
const { getAddressCoordinates, getCaptainsInTheRadius } = require('../services/map-service');
const rideModel = require('../models/ride-model');
const { sendMessageToSocketId } = require('../socket');
const rideService = require('../services/ride-service');


module.exports.createRide = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {  pickup, destination, vehicleType, pickupCoordinates } = req.body;

    try {
        const ride = await rideService.createRide({
            userId:req.user._id,
            pickup,
            destination,
            vehicleType,

        })
        if (ride) res.status(201).json(ride);
        // console.log(ride)
       
       // we don't have map apis so currently we are setting dumy coordinats 
       //is we have map apis then we can uncommnet below line and not take pickupcordinates from user
        // const pickupCoordinates = await getAddressCoordinates(pickup);
console.log(pickupCoordinates)
        const captainInRadius = await getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 2)

        // ride.otp = "";
        console.log(captainInRadius,"captain in radius");

        const rideWithUser = await rideModel.findById(ride._id).populate('userId');

        captainInRadius.map((captain) => {
            sendMessageToSocketId(captain.socketId, {
                event: 'new-ride',
                data: rideWithUser
            })
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: [error.message] });
    }
}

module.exports.getFare = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { pickup, destination } = req.query;

    try {
        const fare = await rideService.getFares(pickup, destination);
        return res.status(200).json(fare);
    } catch (error) {
        return res.status(500).json({ errors: [err.message] });
    }
}

module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId,captainId } = req.body;
    try {
        const ride = await rideService.confirmRide({ rideId, captainId });

        sendMessageToSocketId(ride.userId.socketId, {
            event: 'ride-confirmed',
            data: ride
        })
        return res.status(200).json(ride);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ errors: [err.message] });
    }
}

module.exports.startRide = async (req, res) => {
 const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

        // console.log(ride);

        sendMessageToSocketId(ride.userId.socketId, {
            event: 'ride-started',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ errors: [err.message] });
    }
}

module.exports.endRide = async (req, res) => {
 const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.userId.socketId, {
            event: 'ride-ended',
            data: ride
        })



        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ errors:[ err.message ]});
    } 
}
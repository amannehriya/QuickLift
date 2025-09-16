const rideModel = require("../models/ride-model");
const { getDistanceTime } = require("./map-service");
const crypto = require('crypto');

module.exports.getFares = async function (pickup, destination) {

    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    const distance = await getDistanceTime(pickup, destination);

    const baseFare = {
        auto: 30,
        car: 50,
        moto: 20
    };

    const perKmRate = {
        auto: 7,
        car: 10,
        moto: 4
    };

    const fare = {
        auto: Math.round(baseFare.auto + (distance * perKmRate.auto)),
        car: Math.round(baseFare.car + (distance * perKmRate.car)),
        moto: Math.round(baseFare.moto + (distance * perKmRate.moto)),
    };

    return fare;

}

module.exports.getOTP = async function (num) {

    const otp =  crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();

    return parseInt(otp);
}

module.exports.createRide = async ({
    userId, pickup, destination, vehicleType
}) => {
    if (!userId || !pickup || !destination || !vehicleType) {
        throw new Error('All fields are required');
    }

    const fare = await this.getFares(pickup, destination);
    const otp = await this.getOTP(6)



    const ride = await rideModel.create({
        userId,
        pickup,
        destination,
        otp,
        fare: fare[vehicleType],
        vehicleType
    })

    return ride;
}

module.exports.confirmRide = async ({ rideId, captainId }) => {

    if (!rideId) throw new Error("ride id is required");
    await rideModel.findByIdAndUpdate(rideId, {
        status: 'accepted',
        captain: captainId
    })

    const ride = await rideModel.findById(rideId).populate('userId').populate('captain').select('+otp');

    if (!ride) throw new Error("ride not found");

    return ride;


}

module.exports.startRide = async({rideId,otp,captain})=>{
       if (!rideId || !otp) {
        throw new Error('Ride id and OTP are required');
    }

    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('userId').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'accepted') {
        throw new Error('Ride not accepted');
    }

    // console.log(ride.otp);
    // console.log(otp);
    if (ride.otp != otp) {
        throw new Error('Invalid OTP');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'ongoing'
    })

    return ride;
}

module.exports.endRide = async ({ rideId, captain }) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    const ride = await rideModel.findOne({
        _id: rideId,
        captain: captain._id
    }).populate('userId').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'ongoing') {
        throw new Error('Ride not ongoing');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'completed'
    })

    return ride;
}
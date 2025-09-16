const mongoose = require('mongoose');
;

const rideSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'captain'
    },
    pickup: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'],
        default: 'pending'
    },
    duration: {
        type: Number,
    },
    paymentID: {
        type: Number,
    },
    distance: {
        type: Number,
    },
    orderID: {
        type: Number,
    },
    signature: {
        type: Number,
    },
    otp:
    {
        type: Number,
        select: false,
        required: true,
    },
    vehicleType:{
        type:String,
        enum:['car','auto','moto']
    },
    fare:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('ride', rideSchema)
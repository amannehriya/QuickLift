const { validationResult } = require('express-validator');
const captainModel = require('../models/captain-model');
const otpGenerator = require("otp-generator");
const blacklistTokenModel = require('../models/blacklistToken-model');


// In-memory OTP store (better use Redis in production)
const otpStore = new Map();

module.exports.registerCaptain = async (req, res, next) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(401).json({ errors: errors.array() });

        const { fullname, mobile, vehicle, otp } = req.body;

        //verify otp
        const validOtp = otpStore.get(mobile);
        if (validOtp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });

        }

        otpStore.delete(mobile); // clear OTP after use

        const isCaptainAlreadyExist = await captainModel.findOne({ mobile });

        if (isCaptainAlreadyExist) return res.status(401).json({ message: "captain already exist" });

        if (!fullname || !mobile || !vehicle) return res.status(401).json({ message: "All fields are required" });



        const captain = await captainModel.create({
            fullname,
            mobile,
            vehicle
        })

        const token = captain.generateAuthToken();

        console.log(token);
        res.status(201).json({captain, token});

    } catch (error) {
        res.status(500).json({ error: error })
    }
}


module.exports.sendOTP = async (req, res) => {
    try {
        const { mobile } = req.body;

        if (!mobile) return res.status(400).json({ message: "Mobile number is required" });

        // Generate 6 digit OTP
        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false,
        });

        // Save OTP (in memory for now, can use Redis/DB with expiry)
        otpStore.set(mobile, otp);

        // Send SMS
        // await client.messages.create({
        //   body: `Your OTP is ${otp}`,
        //   from: process.env.TWILIO_PHONE_NUMBER, // Twilio number
        //   to: `+91${mobile}`, // change country code accordingly
        // });

        return res.json({ message: "OTP sent successfully", otp });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

module.exports.verifyOTP = async (req, res, next) => {
    try {
        const { mobile, otp } = req.body;

        if (!mobile || !otp) {
            return res.status(400).json({ message: "Mobile and OTP are required" });
        }

        const validOtp = otpStore.get(mobile);
        if (validOtp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }



        // Check if user exists, else create
        let captain = await captainModel.findOne({ mobile });

        if (!captain) {
            return res.status(201).json({ captainExist: false, message: "please register " })
        }


        otpStore.delete(mobile); // clear OTP after use
        const token = captain.generateAuthToken();

       res.cookie("token",token)
        return res.status(201).json({ captainExist: true, token });

    } catch (err) {
        console.log(err)
        res.status(500).json({ err });
    }
}

module.exports.getCaptainProfile = async(req,res)=>{
    return res.status(200).json({captain:req.captain});
}

module.exports.logoutCaptain = async(req,res)=>{
    
     const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

    await blacklistTokenModel.create({ token });
   

    res.clearCookie('token');

    res.status(200).json({ message: 'Logout successfully' });
}

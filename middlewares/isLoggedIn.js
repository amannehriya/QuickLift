const jwt = require('jsonwebtoken');
const blacklistTokenModel = require('../models/blacklistToken-model');
const userModel = require('../models/user-model');
const captainModel = require('../models/captain-model');

module.exports.user = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(400).json({ message: "Unauthorized" });

    const isBlacklisted = await blacklistTokenModel.findOne({ token: token });

    if (isBlacklisted) return res.status(400).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded._id);

        req.user = user;  //req.user = user makes the logged-in user available across your request cycle.

        return next();

    } catch (error) {
        return res.status(400).json({ message: "Unauthorized" });
    }
}

module.exports.captain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ message: "unauthorized" });

    const isBlacklisted = await blacklistTokenModel.findOne({ token });

    if (isBlacklisted) return res.status(401).json({ message: "unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const captain = await captainModel.findById(decoded._id);
        req.captain = captain;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "unauthorized" });

    }
}
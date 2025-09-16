const { validationResult } = require('express-validator');
const { getAddressCoordinates, suggestion, getDistanceTime } = require('../services/map-service');


// we are setting coordinates becoz currently 
//we don't have map apis
module.exports.setCoordinates = async(req,res)=>{
    
}

module.exports.getCordinates = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { address } = req.query;

    try {
        const Coordinates = await getAddressCoordinates(address);
        res.status(200).json({ Coordinates });

    } catch (error) {
        console.log(error);
        res.status(400).json({ errors: ["coordinates not found"] })
    }
}

module.exports.getAutoCompleteSuggestion = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { address } = req.query;
    // console.log(address)
    try {
        const suggestions = await suggestion(address)
        res.status(200).json(suggestions)
    } catch (error) {
        console.log(error)
        res.status(500).json({ errors: ["internal server error"] })
    }
}

module.exports.getdistancebtw = async(req,res)=>{
  try {

        const errors = validationResult(req);
        if (!errors.isEmpty())  return res.status(400).json({ errors: errors.array() });
        

        const { origin, destination } = req.query;

        const distanceTime = await getDistanceTime(origin,destination);

        res.status(200).json(distanceTime);

    } catch (err) {
        console.error(err);
        res.status(500).json({ errors: ['Internal server error'] });
    }
}
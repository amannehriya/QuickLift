const axios = require('axios');
const captainModel = require('../models/captain-model');


//note currently we don't have google map apis key so we are taking only dumy data

module.exports.getAddressCoordinates = async (address) => {

   
    try {
        // const response = await fetch(url);
        // const data = await response.json();

        // if (data.length > 0) {
            return {
                    // lat: data[0].lat,
                // lon: data[0].lon
                lat:25.1379627 ,
                lon: 75.8592052 
            }
        // } else {
        //     throw new Error("Address not found")
        // }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports.suggestion = async (query) => {

    if (!query) throw new Error("address is required");

   

    try {
        // const response = await fetch(url, {
        //     headers: {
        //         "User-Agent": "MyApp/1.0 (myemail@example.com)" // Nominatim requires this
        //     }
        // });

        // if(!response.Ok) throw new Error("unable to suggest");
        // console.log('data')
        // const data = await response.json();

        const data = ['bhilwara','ujjain','indore'];

        return data.map(item => (
            item
        ));

    } catch (err) {
        console.error(err);
        throw err;
    }

}

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) throw new Error("origin and destination are required");

    //find distance betwwen them
    // function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    //     const R = 6371; // Earth radius in km
    //     const dLat = (lat2 - lat1) * (Math.PI / 180);
    //     const dLon = (lon2 - lon1) * (Math.PI / 180);

    //     const a =
    //         Math.sin(dLat / 2) ** 2 +
    //         Math.cos(lat1 * (Math.PI / 180)) *
    //         Math.cos(lat2 * (Math.PI / 180)) *
    //         Math.sin(dLon / 2) ** 2;

    //     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    //     return R * c; // distance in km
    // }


   
    // const coord1 = await this.getAddressCoordinates(origin);
    // const coord2 = await this.getAddressCoordinates(destination);

// return Math.ceil(getDistanceFromLatLonInKm(coord1.lat,coord1.lon,coord2.lat,coord2.lon))

return 62;



}

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {

    // radius in km


    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [ [ ltd, lng ], radius / 6371 ]
            }
        }
    });

    return captains;


}
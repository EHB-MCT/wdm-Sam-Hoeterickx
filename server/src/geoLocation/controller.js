const { findSessionById } = require("../sessions/model");
const { getAllGeoLocations, saveGeoLocation, findGeoLocationWithSession } = require("./service");

/**
 * Retrieves all geolocation data from the database
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} geoLocationCollection - MongoDB collection for geolocation data
 * @returns {Promise<Object>} JSON response with geolocation data or error message
 */
const getAllGeoLocationData = async (req, res, geoLocationCollection) => {
    try {
        const result = await getAllGeoLocations(geoLocationCollection);

        if (!result || result.length === 0) {
            return res.status(404).json({
                status: 404,
                message: 'No locations found'
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'GeoLocation data successfully found',
            data: result
        });
    } catch (error) {
        console.error('Error while getting geolocation data:', error);
        return res.status(500).json({
            status: 500,
            message: error.message
        });
    }
};

/**
 * Saves geolocation data to the database for a specific session
 * 
 * @param {Object} req - Express request object containing geolocation data in body
 * @param {Object} res - Express response object
 * @param {Object} geoLocationCollection - MongoDB collection for geolocation data
 * @param {Object} sessionCollection - MongoDB collection for session data
 * @returns {Promise<Object>} JSON response with saved geolocation data or error message
 */
const saveGeoLocationData = async (req, res, geoLocationCollection, sessionCollection) => {
    try {
        const SESSION_ID = req.signedCookies.session;
        const { latitude, longitude, accuracy, altitude, altitudeAccuracy, heading, speed, timestamp } = req.body;

        if (!latitude || !longitude) {
            return res.status(422).json({
                status: 422,
                message: 'Missing required geolocation info (latitude and longitude)'
            });
        }

        if (!SESSION_ID) {
            return res.status(422).json({
                status: 422,
                message: 'Missing session cookie'
            });
        }

        const locationData = {
            latitude,
            longitude,
            accuracy,
            altitude,
            altitudeAccuracy,
            heading,
            speed,
            timestamp
        };
        const excisitingGeoLocation = await findGeoLocationWithSession(geoLocationCollection, SESSION_ID);
        if(excisitingGeoLocation){
            return res.status(200).json({
                status: 200,
                message: 'Location is already saved with this session id'
            })
        }


        const result = await saveGeoLocation(
            { geoLocationCollection, sessionCollection },
            SESSION_ID,
            locationData
        );

        return res.status(201).json({
            status: 201,
            message: 'Successfully saved geolocation data',
            data: result
        });
    } catch (error) {
        console.error('Error while saving geolocation data:', error);
        
        if (error.message.includes('required') || error.message.includes('Session not found')) {
            return res.status(422).json({
                status: 422,
                message: error.message
            });
        }

        return res.status(500).json({
            status: 500,
            message: error.message
        });
    }
};

module.exports = {
    getAllGeoLocationData,
    saveGeoLocationData
};
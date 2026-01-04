const { getAllLocations, saveLocationData, findGeoLocationSession } = require('./model');
const { findSessionById } = require('../sessions/model');

/**
 * Retrieves all geolocation records from the database
 * 
 * @param {Object} geoLocationCollection - MongoDB collection for geolocation data
 * @returns {Promise<Array>} Array of all geolocation records
 */
const getAllGeoLocations = async (geoLocationCollection) => {
    return await getAllLocations(geoLocationCollection);
};

/**
 * Saves geolocation data with session validation
 * 
 * @param {Object} collections - Object containing MongoDB collections
 * @param {Object} collections.geoLocationCollection - MongoDB collection for geolocation data
 * @param {Object} collections.sessionCollection - MongoDB collection for session data
 * @param {string} sessionId - Session ID to associate with the geolocation data
 * @param {Object} locationData - Geolocation data to be saved
 * @param {number} locationData.latitude - Latitude coordinate
 * @param {number} locationData.longitude - Longitude coordinate
 * @param {number} [locationData.accuracy] - Accuracy of the location in meters
 * @param {number} [locationData.altitude] - Altitude in meters
 * @param {number} [locationData.altitudeAccuracy] - Altitude accuracy in meters
 * @param {number} [locationData.heading] - Direction of travel in degrees
 * @param {number} [locationData.speed] - Speed in meters per second
 * @param {number} [locationData.timestamp] - Timestamp of the location reading
 * @returns {Promise<Object>} Saved geolocation record with generated ID
 * @throws {Error} When latitude and longitude are not provided
 * @throws {Error} When session is not found
 */
const saveGeoLocation = async ({ geoLocationCollection, sessionCollection }, SESSION_ID, locationData) => {
    if (!locationData.latitude || !locationData.longitude) {
        throw new Error('Latitude and longitude are required');
    }

    const session = await findSessionById(sessionCollection, SESSION_ID);
    if (!session) {
        throw new Error('Session not found');
    }

    const dataToSave = {
        session_id: SESSION_ID,
        ...locationData
    };

    return await saveLocationData(geoLocationCollection, dataToSave);
};

const findGeoLocationWithSession = async(geoLocationCollection, SESSION_ID) => {
    return await findGeoLocationSession(geoLocationCollection, SESSION_ID);

}

module.exports = {
    getAllGeoLocations,
    saveGeoLocation,
    findGeoLocationWithSession
};
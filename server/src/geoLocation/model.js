/**
 * Retrieves all geolocation records from the database
 * 
 * @param {Object} geoLocationCollection - MongoDB collection for geolocation data
 * @returns {Promise<Array>} Array of all geolocation records
 */
const getAllLocations = async (geoLocationCollection) => {
    return await geoLocationCollection.find({}).toArray();
};

/**
 * Saves geolocation data to the database
 * 
 * @param {Object} geoLocationCollection - MongoDB collection for geolocation data
 * @param {Object} locationData - Geolocation data to be saved
 * @returns {Promise<Object>} Saved geolocation record with generated ID
 */
const saveLocationData = async (geoLocationCollection, locationData) => {

    const result = await geoLocationCollection.insertOne(locationData);
    
    return {
        _id: result.insertedId,
        ...locationData
    };
};

module.exports = {
    getAllLocations,
    saveLocationData
};
/**
 * Browser Tracking Model
 * Performs direct database operations for browser sessions.
 */

/**
 * Finds all browser sessions in the collection.
 *
 * @param {Object} collection - The MongoDB collection instance.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of browser session documents.
 */
const findAllBrowserSessions = async (collection) => {
    return await collection.find({}).toArray(); // Added .toArray() assuming standard MongoDB driver
};

/**
 * Inserts a single browser data document into the collection.
 *
 * @param {Object} collection - The MongoDB collection instance.
 * @param {Object} browserData - The browser data object to insert.
 * @returns {Object}
 */
const insertBrowserData = async (collection, browserData) => {
    const result = await collection.insertOne(browserData);
    
    if (result.acknowledged) {
        return { _id: result.insertedId, ...browserData };
    }
};

const findBrowserSession = async(collection, SESSION_ID) => {
    return await collection.findOne({ session_id: SESSION_ID });
}

module.exports = {
    findAllBrowserSessions,
    insertBrowserData,
    findBrowserSession
};
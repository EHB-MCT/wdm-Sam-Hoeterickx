const getAllGeoLocationData = (req, res, geoLocationCollection) => {
    try{

    }catch(error){
        console.error('Error while getting geolocation data', error);
        return res.status(500).json({
            status: 500,
            message: error.message
        })
    }
}

const saveGeoLocationData = (req, res, geoLocationCollection, sessionCollection) => {
    try{

    }catch(error){
        console.error('Error while saving geolocation data', error);
        return res.status(500).json({
            status: 500,
            message: error.message
        })
    }
}

module.exports = {
    getAllGeoLocationData,
    saveGeoLocationData
}
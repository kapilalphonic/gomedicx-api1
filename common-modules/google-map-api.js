const axios = require('axios');
module.exports = {
    getAddress: async (pageData)=>{
        try{
            let res = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${pageData.lat},${pageData.lng}&key=${process.env.GOOGLE_MAP_KEY}`)
            return res.data;
        }catch(err){
            throw err;   
        }
    }
}
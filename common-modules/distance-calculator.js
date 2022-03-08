const axios = require('axios');
module.exports = {
    getDistance: async (data)=>{
        try{
            let res = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?units=${data.units}&origins=${data.originLat},${data.originLong}&destinations=${data.destinationLat},${data.destinationLong}&key=${process.env.GOOGLE_DISTANCE_CALCULATE_API_KEY}`)
            return res.data;
        }catch(err){
            throw err;   
        }
    }
}
const dotenv = require('dotenv');


dotenv.config();

const port = process.env.PORT || 3000;
const apiKey = process.env.API_KEY;
const jwtKey = process.env.JWT_KEY;

module.exports = {
    port: port,
    apiKey: apiKey,
    jwtKey: jwtKey
}
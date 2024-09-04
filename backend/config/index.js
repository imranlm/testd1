require('dotenv').config();

module.exports = {
    saltRounds: parseInt(process.env.SALT_ROUNDS, 10),
    secretKey: process.env.SECRET_KEY,
    localDbURI: process.env.LOCAL_DB_URI
};

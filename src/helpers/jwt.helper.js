const jwt = require('jsonwebtoken');
const config = require('../config/config');

const createJwt = async (uid, expiresIn = "7000h") => {
    return new Promise( (resolve, reject) => {
        const payload = {uid};
        jwt.sign(payload, config.SECRET_TOKEN, {
            expiresIn
        }, ( err, token ) => {
            if ( err ) {
                console.log(err);
                reject( 'No se pudo generar el token' )
            } else {
                resolve( token );
            }
        })
    });
}

module.exports = {
    createJwt
}
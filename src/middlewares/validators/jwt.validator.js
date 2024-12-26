const moment = require("moment");
const jwt = require('jsonwebtoken');
const {user_model} = require('../../model/user.model');
const config = require("../../config/config");

const checkJwt = async(req, res, next ) => {
    const token = req.header('Authorization');
    
    if ( !token ) return res.status(401).json({error: 'No hay token en la petición'})

    try {   
        const {uid, exp} = jwt.verify(token, config.SECRET_TOKEN);
        
        if (exp <= moment().unix()) return res.status(401).json({message: "El token ha expirado"});

        const user = await user_model.findById(uid);
        if( !user ) {
            return res.status(401).json({
                error: 'Token no válido - usuario no existe DB'
            })
        }
        if (!req.body.user) req.body.user = uid; 
        next();
    } catch (error) {
        console.log(error)
        res.status(401).json({
            error: 'Token no válido'
        })
    }
}

const checkJwtAdmin = async(req, res, next ) => {
    // const token = req.header('Authorization');
    // if ( !token ) return res.status(401).json({error: 'No hay token en la petición'})
    // try {   
    //     const {uid, exp} = jwt.verify(token, config.SECRET_TOKEN);
        
    //     if (exp <= moment().unix()) return res.status(401).json({message: "El token ha expirado"});

    //     const user = await user_model.findById(uid);
    //     if( !user ) {
    //         return res.status(401).json({
    //             error: 'Token no válido - usuario no existe DB'
    //         })
    //     }
    //     if (!user.rol == "ADMIN_ROLE") {
    //         return res.status(400).json({
    //             error: "El token no proviene de un administrador."
    //         });
    //     }

    //     if (!req.body.user) req.body.user = uid; 
    //     next();
    // } catch (error) {
    //     res.status(401).json({
    //         error: 'Token no válido'
    //     })
    // }
}

module.exports = {
    checkJwt,
    checkJwtAdmin,
}
const jwt = require('jsonwebtoken');
const moment = require("moment");
const {createJwt} = require('../helpers/jwt.helper.js');
const user_repository = require('../repositories/user.repository.js');
const {user_model} = require('../model/user.model.js');
const bcryptjs = require('bcryptjs');
const config = require('../config/config.js');

async function create(req, res) {
    try {
        const new_model = new user_model();
        new_model.name = req.body.name;
        new_model.lastName = req.body.lastName;
        new_model.username = req.body?.email?.toLowerCase();
        new_model.user = req.body.user;
        new_model.dni = req.body.dni;
        new_model.email = req.body?.email?.toLowerCase();
        new_model.phone = req.body.phone;
        new_model.birthDate = req.body.birthDate;
        new_model.address = req.body.address;
        new_model.role = "USER_ROLE";
        new_model.country = "Mexico";
        new_model.city = req.body.city;
        new_model.fullName = `${req.body.name} ${req.body.lastName}`;
        new_model.rfc = req.body.rfc;

        const salt = await bcryptjs.genSalt();
        new_model.password = await bcryptjs.hash(req.body.password, salt);

        const usersCount = await user_repository.count();
        new_model.registerNumber = `${usersCount + 1}`;

        const result = await user_repository.create(new_model);
        const token = await createJwt(result?.uid || result?._id);

        return res.status(200).json({
            data: result,
            token,
            ok: true
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
}

async function login(req, res) {
    try {
        const login_model = new user_model();
        login_model.email = req.body.email;
        const result = await user_repository.getByLogin(login_model.email.toLowerCase());

        if (result == null) {
            return res.status(404).json("Clave o correo electronico incorrecto");
        }
        
        if (result.deleted) {
            return res.status(404).json({
                message: "Usuario no encontrado."
            });
        }
        
        const validPassword = bcryptjs.compareSync( req.body.password, result.password );
        if (!validPassword) {
            return res.status(404).json({ // Envio un 404 adrede. 
                msg: 'Clave o correo electronico incorrecto.'
            });
        }

        const token = await createJwt(result.id, "7000h");
        
        result.lastLogin = Date.now();
        await user_repository.update(result);

        delete result._doc.password;

        return res.status(200).json({
            data: {
                ...result._doc,
            },
            token
        });
    } catch (e) {
        console.log(e)
        return res.status(500).json(e);
    }
}

async function forgotPassword(req, res) {
    try {
        const user = await user_repository.getByLogin(req.body.email);
        if (!user) return res.status(404).json({ok: false, message: "Usuario no encontrado."});
        user.recoverCode = makeRandomCode(6);
        await user_repository.update(user);

        return res.status(200).json({ok: true});
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
}

async function checkVerificationCode(req, res) {
    try {
        const result = await user_repository.getByLogin(req.body.email);
        if (result.recoverCode.toString() == req.body.recoverCode.toString() && req.body.recoverCode.toString().length > 0) {
            return res.json({
                ok: true
            })
        } else {
            return res.status(500).json({
                ok: false
            });
        }
    } catch(e) {
        return res.status(500).json(e);
    }
}

function makeRandomCode(length) {
    var result = '';
    //var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var characters = '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

async function changePassword(req, res) {
    try {
        const new_model = await user_repository.getByLogin(req.body.email);
        
        const salt = await bcryptjs.genSalt();
        new_model.password = await bcryptjs.hash(req.body.newPassword, salt);
        new_model.recoverCode = "";

        await user_repository.update(new_model);
        return res.status(200).json({
            ok: true
        });
    } catch (e) {
        return res.status(500).json(e);
    }
}

async function refreshToken(req, res) {
    try {
        const last_token = req.header("Authorization");
        const {uid} = jwt.decode(last_token, config.SECRET_TOKEN);
        const result = await user_repository.getById(uid);

        if (result == null) {
            return res.status(404).json("Clave o correo electronico incorrecto");
        }
        
        if (result.deleted) {
            return res.status(404).json({
                message: "Usuario no encontrado."
            });
        }
        
        const validPassword = bcryptjs.compareSync( req.body.password, result.password );
        if (!validPassword) {
            return res.status(404).json({
                msg: 'Clave o correo electronico incorrecto.'
            });
        }

        const token = await createJwt(result.id);

        return res.status(200).json({data: result, token});
    } catch (e) {
        console.log(e)
        return res.status(500).json(e);
    }
}

async function update(req, res) {
    try {
        const edit_user_model = await user_repository.getById(req.params.id);
        edit_user_model.name = req.body.name || edit_user_model.name;
        edit_user_model.lastName = req.body.lastName || edit_user_model.lastName;
        edit_user_model.email = req.body.email || edit_user_model.email;
        edit_user_model.username = req.body.username || edit_user_model.username;
        edit_user_model.dni = req.body.dni || edit_user_model.dni;
        edit_user_model.phone = req.body.phone || edit_user_model.phone;
        edit_user_model.state = req.body.state || edit_user_model.state;
        edit_user_model.address = req.body.address || edit_user_model.address;
        edit_user_model.postalCode = req.body.postalCode || edit_user_model.postalCode;
        edit_user_model.rol = req.body.rol || edit_user_model.rol;
        edit_user_model.country = req.body.country || edit_user_model.country;
        edit_user_model.city = req.body.city || edit_user_model.city;
        edit_user_model.privacyPolicies = req.body.privacyPolicies || edit_user_model.privacyPolicies;
        edit_user_model.rfc = req.body.rfc || edit_user_model.rfc;
        // edit_user_model.birthDate = new Date(req.body.birthDate) || edit_user_model.birthDate;
        edit_user_model.principalAddress = req.body.principalAddress || edit_user_model.principalAddress;
        
        if (req.body.newPassword) {
            const validPassword = bcryptjs.compareSync( req.body.password, edit_user_model.password );
            if (!validPassword) {
                return res.status(404).json({ // Envio un 404 adrede. 
                    msg: 'Clave incorrecta.'
                });
            }
    
            const salt = await bcryptjs.genSalt();
            edit_user_model.password = await bcryptjs.hash(req.body.newPassword, salt);
        }

        const result = await user_repository.update(edit_user_model);
        const token = createJwt(result.id);
        console.log(result);
        return res.status(200).json({data: result, token});
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
}

async function getBy(req, res) {
    try {
        const {page, pageSize, sort, rol, query, ...query2} = req.query;
        const token = req.header("Authorization");
        const {uid} = jwt.verify(token, config.SECRET_TOKEN);
        const user = await user_repository.getById(uid);
        let terms = {};
        
        if (rol && rol != "All") terms.rol = {
            $eq: rol,
            $ne: "ADMIN_ROLE"
        };
        
        terms["$or"] = [
            { name: { $regex: query, $options: 'i' } },
            { lastName: { $regex: query, $options: 'i' } },
            { username: { $regex: query, $options: 'i' } }
        ];

        let sortTerms = {};
        if (sort) sortTerms[sort] = -1;

        const result = await user_repository.getBy({
            page,
            pageSize,
            terms: {
                ...terms,
                ...query2
            }
        });
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
}

async function getById(req, res) {
    try {
        const result = await user_repository.getById(req.params.id);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json(e);
    }
}

async function getByToken(req, res) {
    try {
        const token = req.header("Authorization");
        const {uid, exp} = jwt.decode(token, config.SECRET_TOKEN);
        
        let expired = false; 
        if (exp <= moment().unix()) expired = true;
        
        const result = await user_repository.getById(uid);

        delete result._doc.password;

        return res.status(200).json({
            ...result._doc,
            exp: expired,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
}

async function getByLogin(req, res) {
    try {
        const result = await user_repository.getByLogin(req.params.id);
        if (result.banned) {
            return res.status(400).json({
                message: "Estas baneado. Si crees que se trata de un error, escribe a soporte."
            });
        }
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json(e);
    }
}

async function deleteById(req, res) {
    try {
        const user = await user_repository.getById(req.params.id);
        if (user == null) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }
        const result = await user_repository.deleteEntity(user);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json(e);
    }
}

module.exports = {
    create,
    getBy,
    getByToken,
    getById,
    getByLogin,
    deleteById,
    update,
    refreshToken,
    login,
    changePassword,
    forgotPassword,
    checkVerificationCode,
}
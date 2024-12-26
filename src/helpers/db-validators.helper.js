const detectSpecialCharacter = (text) => {
    const specialChars = /[`@$%^*()\=\[\]{};:"\\|<>\/~]/;
    return specialChars.test(text);
}

const checkEmail = (property) => {
    if (property == undefined) return false;
    if (detectSpecialCharacter(property)) return false;
    if (property.length < 5 || property.length > 150) return false; 
    return true;
}

const checkName = (property, put=false) => {
    if (property == undefined) {
        if (put===true) return true; 
        return false;
    }
    if (detectSpecialCharacter(property)) return false;
    if (property.length < 3 || property.length > 200) return false; 
    return true;
}

module.exports = {
    checkName,
    checkEmail,
};
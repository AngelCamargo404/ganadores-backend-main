const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname, '../../uploads/images'));
    },
    filename: function(req, file, cb) {
        const extension = path.extname(file.originalname);
        cb(null, `${Date.now()}${extension}`);
    }
});


const upload = multer({storage, limits: {fileSize: 9000000}});
module.exports = upload; 
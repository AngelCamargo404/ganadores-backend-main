const path = require("path");
const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME || "dfldylfrg",
    api_key: process.env.CLOUDINARY_API_KEY || "798971786767736",
    api_secret: process.env.CLOUDINARY_API_SECRET || "dedPyu6oae189lrx58iQdZKbDQE"
});

exports.cloudinaryUploadImage = async (filePath) => {
    return await new Promise(resolve => {
        cloudinary.uploader.upload(filePath, (result) => {
            resolve({
                url: result.url,
                id: result.public_id
            })
        }, {
            resource_type: "auto"
        });
    }).catch(e => {
        console.log(e);
    });
}

exports.createFolderCloudinaryApi = async (folderName) => {
    return await new Promise(resolve => {
        cloudinary.api.create_folder(folderName.toLowerCase(), (result) => {
            resolve({
                url: "cloudinary",
                id: result.path
            });
        });
    }).catch(e => {
        console.log(e);
    });
}

exports.deleteFolderCloudinaryApi = async (folderName) => {
    return await new Promise(resolve => {
        cloudinary.api.delete_folder(folderName.toLowerCase(), (result) => {
            resolve(result);
        });
    }).catch(e => {
        console.log(e);
    });
}

exports.deleteCloudinaryApi = async (file) => {
    try {
        const result = await cloudinary.uploader.destroy(file);
        if (result.result != "ok") {
            return false;
        }
        return result;
    } catch(e) {
        console.log(e);
    }
}
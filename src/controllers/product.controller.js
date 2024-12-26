const config = require('../config/config.js');

const product_repository = require('../repositories/product.repository.js');
const {product_model} = require('../model/product.model.js');

const defaultPageSize = config.defaultPageSize;
const xlsx = require('xlsx');

const {cloudinaryUploadImage, deleteCloudinaryApi} = require('../services/cloudinary.service.js');
const mongoose = require('mongoose');

// getAllProductsAndUpdateCategoryAndSubCategory();
async function getAllProductsAndUpdateCategoryAndSubCategory() {
    const products = await product_model.find({
        name: { $regex: "Gel Semipermanente" }
    });

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        product.category = "66262f1fa27f973d21f4de2f";
        product.otherCategory = "6626733b1643cf8e1444cd09";
        await product.save();
    }

    console.log("listo");
}

async function create(req, res) {
    try {
        const new_model = new product_model();
        new_model.name = req.body.name;
        new_model.quantity = req.body.quantity;
        new_model.price = req.body.price;
        new_model.description = req.body.description;
        new_model.category = req.body.category;
        new_model.otherCategory = req.body.otherCategory;
        new_model.stock = req.body.stock;
        new_model.provider = req.body.provider;
        new_model.boxStop = req.body.boxStop;
        new_model.wholesaleStop = req.body.wholesaleStop;
        new_model.invMin = req.body.invMin;
        new_model.invMax = req.body.invMax;
        new_model.weightInMg = req.body.weightInMg;
        new_model.lengthInMm = req.body.lengthInMm;
        new_model.widthInMm = req.body.widthInMm;
        new_model.heightInMm = req.body.heightInMm;
        new_model.tags = req.body.tags;
        new_model.details = req.body.details;
        new_model.offerPrice = req.body.offerPrice;
        new_model.cost = req.body.cost;
        new_model.offer = req.body.offer;
        new_model.media = req.body.media;
        new_model.code = req.body.code;
        new_model.department = req.body.department;
        new_model.brands = req.body.brands;
        new_model.brand = req.body.brand;
        new_model.specialPrice = req.body.specialPrice;
        new_model.createdAt = new Date();

        if (req?.files?.file[0]) {
            const resp = await cloudinaryUploadImage(req.files?.file[0]?.path);
            new_model.thumbnail = resp.url;
            new_model.thumbnailId = resp.id;
        }

        if (req?.files?.images && req.files.images.length > 0) {
            const images = [];
            for (let i = 0; i < req?.files?.images?.length; i++) {
                const image = req.files?.images[i];
                const resp = await cloudinaryUploadImage(image.path);
                images.push({
                    image: resp.url,
                    imageId: resp.id
                });
            }
            new_model.images = images;
        }

        const result = await product_repository.create(new_model);
        
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
}
// createFromExcel()
async function createFromExcel(req, res) {
    try {
        const path = require('path');
        const fs = require('fs');
        const xlsx = require('xlsx');

        const fs2 = require('fs').promises;

        const rutaArchivo = path.join(__dirname, './productos.xlsx');
        const workbook = xlsx.readFile(rutaArchivo);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const datos = xlsx.utils.sheet_to_json(sheet);

        for (let i = 0; i < datos.length; i++) {
            if (i === 0) continue;
            if (datos[i]?.thumbnail == null) continue;
            const carpetaBase = path.join(__dirname);
            const enlaceImagen = datos[i]?.thumbnail;
            const partesEnlace = enlaceImagen.split('/');
            const rutaImagen = (path.join(...partesEnlace).replace(/\\/g, '/')).replace(",","")
            // console.log('Ruta absoluta de la imagenEE:', rutaImagen);
            
            const enlacesImagenes = datos[i]?.images;
           
            let rutasImagenes = enlacesImagenes.split(',').map((enlace) => {
                const partesEnlace = enlace.trim().split('/');
                const rutaImagen = (path.join(...partesEnlace).replace(/\\/g, '/')).replace(",","");
                return rutaImagen;
            });

            rutasImagenes = rutasImagenes.filter((ruta) => ruta !== ".");

            const new_model = new product_model();
            new_model.name = datos[i]?.name;
            new_model.price = Number(datos[i]?.price?.toString()?.replace("$","").replace(",",".").replace(",","."));
            new_model.specialPrice = Number(datos[i]?.specialPrice?.toString()?.replace("$","").replace(",","."));
            new_model.offerPrice = Number(datos[i]?.offerPrice.toString()?.replace("$","").replace(",","."));
            new_model.cost = datos[i]?.cost;
            new_model.provider = datos[i]?.provider;
            new_model.department = datos[i]?.department;
            new_model.boxStop = datos[i]?.boxStop;
            new_model.wholesaleStop = datos[i]?.wholesaleStop;
            new_model.invMin = datos[i]?.invMin;
            new_model.invMax = datos[i]?.invMax;
            new_model.weightInMg = datos[i]?.weightInMg;
            new_model.lengthInMm = datos[i]?.lengthInMm;
            new_model.widthInMm = datos[i]?.widthInMm;
            new_model.heightInMm = datos[i]?.heightInMm;
            new_model.tags = datos[i]?.tags;
            new_model.description = datos[i]?.description;
            new_model.details = datos[i]?.details;
            new_model.category = datos[i]?.category;
            new_model.stock = datos[i]?.stock;
            new_model.new = datos[i]?.new;
            new_model.offer = datos[i]?.offer;
            new_model.media = datos[i]?.media;
            new_model.code = datos[i]?.code;
            new_model.images = [];

            rutasImagenes.shift();
            const uploadPromises = rutasImagenes.map(async (rutaImagen2) => {
                try {
                    const stats = await fs2.stat(rutaImagen2);
                    if (stats.isFile()) {
                        console.log('La ruta de la imagen apunta a un archivo.', stats);
                        const resp = await cloudinaryUploadImage(rutaImagen2);
                        return {
                            image: resp.url,
                            imageId: resp.id
                        };
                    }
                } catch (err) {
                    return {
                        image: null,
                        imageId: null
                    }
                    // console.error('Error al obtener información del archivo:', err);
                }
            });
            
            new_model.images = await Promise.all(uploadPromises);

            fs.stat(rutaImagen, async (err, stats) => {
                if (err) {
                    // console.error('Error al obtener información del archivo:', err);
                } else {
                    if (stats.isFile()) {
                        const resp = await cloudinaryUploadImage(rutaImagen);
            
                        new_model.thumbnail = datos[i]?.thumbnail;
                        new_model.thumbnailId = resp.id;
                        new_model.thumbnail = resp.url;
            
                        const result = await product_repository.create(new_model);
                        return;
                    } else {
                        // console.error('La ruta de la imagen no es válida. No apunta a un archivo.');
                    }
                }
            });
        }
    
    } catch (e) {
        console.log(e);
        // return res.status(500).json(e);
    }
}

//  createFromExcel();

async function update(req, res) {
    try {
        const edit_product_model = await product_repository.getById(req.params.id);
        
        const {
            name,
            price,
            description,
            category,
            stock,
            provider,
            department,
            quantity,
            boxStop,
            wholesaleStop,
            invMin,
            invMax,
            weightInMg,
            lengthInMm,
            widthInMm,
            heightInMm,
            tags,
            details,
            offerPrice,
            cost,
            offer,
            media,
            code,
            brands,
            soldOut,
            brand,
            new: isNew,
        } = req.body;

        edit_product_model.otherCategory = req.body.otherCategory || edit_product_model.otherCategory;
        edit_product_model.name = name || edit_product_model.name;
        edit_product_model.price = price || edit_product_model.price;
        edit_product_model.description = description || edit_product_model.description;
        edit_product_model.category = category || edit_product_model.category;
        edit_product_model.stock = stock || edit_product_model.stock;
        edit_product_model.provider = provider || edit_product_model.provider;
        edit_product_model.updatedAt = new Date();
        edit_product_model.department = department || edit_product_model.department;
        edit_product_model.quantity = quantity || edit_product_model.quantity;
        edit_product_model.boxStop = boxStop || edit_product_model.boxStop;
        edit_product_model.wholesaleStop = wholesaleStop || edit_product_model.wholesaleStop;
        edit_product_model.invMin = invMin || edit_product_model.invMin;
        edit_product_model.invMax = invMax || edit_product_model.invMax;
        edit_product_model.weightInMg = weightInMg || edit_product_model.weightInMg;
        edit_product_model.lengthInMm = lengthInMm || edit_product_model.lengthInMm;
        edit_product_model.widthInMm = widthInMm || edit_product_model.widthInMm;
        edit_product_model.heightInMm = heightInMm || edit_product_model.heightInMm;
        edit_product_model.tags = tags || edit_product_model.tags;
        edit_product_model.details = details || edit_product_model.details;
        edit_product_model.offerPrice = offerPrice || edit_product_model.offerPrice;
        edit_product_model.cost = cost || edit_product_model.cost;
        edit_product_model.offer = offer || edit_product_model.offer;
        edit_product_model.media = media || edit_product_model.media;
        edit_product_model.code = code || edit_product_model.code;
        edit_product_model.brands = brands || edit_product_model.brands;
        edit_product_model.soldOut = soldOut || edit_product_model.soldOut;
        edit_product_model.new = isNew || edit_product_model.new;
        edit_product_model.brand = brand || edit_product_model.brand;

        if (req.file) {
            if (edit_product_model?.thumbnail) {
                await deleteCloudinaryApi(edit_product_model.thumbnailId);
            }

            const resp = await cloudinaryUploadImage(req.file.path);
            edit_product_model.thumbnail = resp.url;
            edit_product_model.thumbnailId = resp.id;
        }
        
        const result = await product_repository.update(edit_product_model);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
}

async function updateImage(req, res) {
    try {
        const edit_product_model = await product_repository.getById(req.params.id);

        if (req.file) {
            const resp = await cloudinaryUploadImage(req.file.path);
            
            edit_product_model.images.push({
                image: resp.url,
                imageId: resp.id
            });
        }
        
        const result = await product_repository.update(edit_product_model);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
}

async function deleteImage(req, res) {
    try {
        const edit_product_model = await product_repository.getById(req.params.id);
        const {imageId} = req.body;

        const index = edit_product_model.images.findIndex(image => image.imageId === imageId);
        if (index === -1) {
            return res.status(404).json({
                message: "Imagen no encontrada"
            });
        }

        await deleteCloudinaryApi(imageId);
        edit_product_model.images.splice(index, 1);
        
        const result = await product_repository.update(edit_product_model);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
}

async function getBy(req, res) {
    try {
        const {page = 0, pageSize = defaultPageSize, query, category} = req.query;
        const terms = {};
        if (query) {
            terms["$or"] = [
                {name: {"$regex": query, "$options": 'i'}},
            ]
            
            if (/^[0-9a-fA-F]{24}$/.test(query)) {
                terms["$or"].push({_id: mongoose.Types.ObjectId(query)});
            }
            
            terms["$or"].push({tags: {"$regex": query, "$options": 'i'}});
        }
        
        if (category) {
            if (/^[0-9a-fA-F]{24}$/.test(category)) {
                terms["$or"] = [
                    {category: mongoose.Types.ObjectId(category)},
                    {otherCategory: mongoose.Types.ObjectId(category)},
                ]
            }
        }

        const result = await product_repository.getBy({
            page,
            pageSize,
            terms
        });
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
}

async function getById(req, res) {
    try {
        const result = await product_repository.getById(req.params.id);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json(e);
    }
}

async function deleteById(req, res) {
    try {
        const product = await product_repository.getById(req.params.id);
        if (product == null) {
            return res.status(404).json({
                message: "Producto no encontrado"
            });
        }
        const result = await product_repository.deleteEntity(product);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json(e);
    }
}

module.exports = {
    create,
    getBy,
    getById,
    update,
    updateImage,
    deleteImage,
    deleteById
}
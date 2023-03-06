import type {Fields, Files} from "formidable";
import {IncomingForm} from 'formidable';
import fs from "fs";
import prepareFileInfo from "~/helpers/upload/prepareFileInfo";

export default defineEventHandler(async (event) => {

    try {

        const customOptions = {
            keepExtensions: true,
            allowEmptyFiles: false,
            maxFileSize: 500 * 1024 * 1024 * 1024 * 1024,
            maxFieldsSize: 500 * 1024 * 1024 * 1024 * 1024,
            multiples: true,
        };
        const form = new IncomingForm(customOptions);

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

        const response = await new Promise<Record<string, Fields | any>>((resolve, reject) => {
            form.parse(event.node.req, (err, fields: Fields, files: Files) => {
                if (err) {
                    reject(err)
                }

                if (!files.upload) {
                    reject('File not added')
                }

                if (Array.isArray(files.upload) && !allowedTypes.includes(files.upload[0].mimetype as string)) {
                    reject('File type error')
                }

                resolve({files})
            })
        })

        const {files} = response;

        return await new Promise(async (resolve, reject) => {

            if (files.upload[0].mimetype.startsWith("image/")) {

                const newFileName: string = files.upload[0].newFilename;
                const oldPath = files.upload[0].filepath;

                const newPath = prepareFileInfo(newFileName, '/public/img/');

                const stream = fs.createReadStream(oldPath);

                stream.on('open', () => {
                    const outputStream = fs.createWriteStream(newPath);
                    stream.pipe(outputStream);
                })

                resolve({
                    fileName: newPath.substring(newPath.lastIndexOf('/') + 1),
                    uploaded: 1,
                    url: newPath.substring(newPath.indexOf('/img'))
                });

            } else {
                reject('Please upload images only.');
            }
        })

    } catch (e) {
        throw createError({
            statusCode: 404,
            statusMessage: (typeof e === 'string') ? e : 'Error occurred'
        })
    }
})


/*import formidable from "formidable";
import {firstValues} from 'formidable/src/helpers/firstValues.js';
import uploadFile from "~/helpers/upload/uploadFile";
import prepareFileInfo from "~/helpers/upload/prepareFileInfo";*/

/*export default defineEventHandler(async (event) => {

    const form = formidable({
        encoding: 'utf-8',
        keepExtensions: true,
        // 2 mb for news image and attachments. override otherwise
        maxFileSize: 2 * 1024 * 1024,
    });

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    const {files, err} = await new Promise((resolve, reject) => {
        form.parse(event.node.req, (err, fields, files) => {
            resolve({files: firstValues(form, files), err})
        });
    })

    if (err || !allowedTypes.includes(files.upload.mimetype) /!*|| files.avatar.size > maxFileSize*!/) {
        event.res.statusCode = 422;
        event.res.end(JSON.stringify({msg: 'Неверный тип или размер файла превышен'}));
    } else {

        try {

            const picPath = prepareFileInfo(files.upload.newFilename, '/public/img/blog/uploads/');

            const {mainImage} =  await uploadFile(files.upload, '/public/',  {
                mainImage: true,
                mainImagePath: picPath,
                mainImageWidth: null,
                mainImageHeight: null,
            });

            return {
                fileName: mainImage.substring(mainImage.lastIndexOf('/')+1),
                uploaded: 1,
                url: mainImage.substring(mainImage.indexOf('/img'))
            }

        } catch (e) {
            event.res.setHeader('Content-Type', 'application/json');
            event.res.statusCode = 401;
            event.res.end(JSON.stringify({msg: 'Ошибка! Вы не авторизованы!'}));
        }
    }

})*/


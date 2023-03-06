import prisma from '~/helpers/prisma';
 import type {Fields} from "formidable";
import { IncomingForm } from 'formidable';
import fs from "fs";
import type {IError, IRelease} from "~/types/interfaces";
import { object, string, ObjectSchema } from 'yup';
import prepareFileInfo from "~/helpers/upload/prepareFileInfo";
import type { Prisma } from '@prisma/client'
import sharp from "sharp";

const schema: ObjectSchema<{title: string}> = object({
    title: string().trim().required('No name')
});
export default defineEventHandler(async (event) => {

        try {

            const customOptions = { keepExtensions: true,
                allowEmptyFiles: false,
                maxFileSize: 500 * 1024 * 1024 * 1024 * 1024,
                maxFieldsSize: 500 * 1024 * 1024 * 1024 * 1024,
                multiples: true,};
            const form = new IncomingForm(customOptions);

            /*const form =  formidable({
                keepExtensions: true,
                allowEmptyFiles: false,
                maxFileSize: 500 * 1024 * 1024 * 1024 * 1024,
                maxFieldsSize: 500 * 1024 * 1024 * 1024 * 1024,
                multiples: true,
            });*/

            const response = await new Promise<Record<string, Fields | any>>((resolve, reject) => {
                form.parse(event.node.req, (err, fields, files) => {
                    if (err) {
                        reject(err)
                    }

                    if (!files.media_file) {
                        reject('File not added')
                    }
                    resolve({ fields: JSON.parse(fields.data as string), files })
                })
            })

            const { fields, files } = response;

            await schema.validate(fields);

            const updated: IRelease = await new Promise<IRelease>(async (resolve, reject) => {

                if (files.media_file[0].mimetype.startsWith("image/")) {

                    const origFileName: string = files.media_file[0].originalFilename;

                    const ext: string = origFileName.substring(origFileName.lastIndexOf('.') + 1);

                        const fileName: string =  fields.title.split(' ').join('_')+'.'+ext;
                        const oldPath = files.media_file[0].filepath;
                        const fileUrl = "/img/" + fileName;

                    const newPath = prepareFileInfo(fileName, '/public/img/', fileName);

                        //fs.copyFileSync(oldPath, newPath);

                    const {width, height} =  await sharp(oldPath).metadata();

                    const stream = fs.createReadStream(oldPath);

                    stream.on('open', () => {

                        const outputStream = fs.createWriteStream(newPath);
                        const resize = {
                            width: width > 1422 ? 1422 : null,
                            height: height > 1422 ? 1422 : null,
                            fit: 'cover',
                            position: 'right top',
                        }

                        const transformer = sharp()
                            .resize(resize);

                        stream
                            .pipe(transformer)
                            .pipe(outputStream);
                    })

                        resolve({
                            ...fields,
                            image: fileUrl,
                        });

                    } else {
                    reject('Please upload images only.');
                    }
            });

           const result = await prisma.release.create({
                data: updated as unknown as Prisma.ReleaseCreateInput,
            });

            return {result}

        } catch (e) {
            const typedError = e as IError;

            if (typedError.path && typedError.errors?.length) {
                throw createError({
                    statusCode: 422,
                    statusMessage: typedError.errors[0]
                })
            } else {
                throw createError({
                    statusCode: 404,
                    statusMessage: (typeof e === 'string') ? e : 'Error occurred'
                })
            }
        }
})

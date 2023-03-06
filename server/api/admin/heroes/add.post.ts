import prisma from '~/helpers/prisma';
 import type {Fields} from "formidable";
import { IncomingForm } from 'formidable';
import fs from "fs";
import type {IError, IHero} from "~/types/interfaces";
import { object, string, ObjectSchema } from 'yup';
import prepareFileInfo from "~/helpers/upload/prepareFileInfo";
import type { Prisma } from '@prisma/client'
import sharp from "sharp";

// will raise a compile-time type error if the schema does not produce a valid Person
const schema: ObjectSchema<{name: string, duties: string}> = object({
    name: string().trim().required('No name'),
    duties: string().trim().required('No duties')
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

            /*console.log(fields);
            console.log(files);

            return {}*/

            const updated: IHero = await new Promise<IHero>(async (resolve, reject) => {

                if (files.media_file[0].mimetype.startsWith("image/")) {

                    const origFileName: string = files.media_file[0].originalFilename;

                    const ext: string = origFileName.substring(origFileName.lastIndexOf('.') + 1);

                        const fileName: string =  fields.name.split(' ').join('_')+'.'+ext;
                        const oldPath = files.media_file[0].filepath;
                        const fileUrl = "/img/" + fileName;

                    const newPath = prepareFileInfo(fileName, '/public/img/', fileName);

                        //fs.copyFileSync(oldPath, newPath);

                    const {width, height} =  await sharp(oldPath).metadata();

                    const stream = fs.createReadStream(oldPath);

                    stream.on('open', () => {

                        const outputStream = fs.createWriteStream(newPath);
                        const resize = {
                            width: width > 370 ? 370 : null,
                            height: null,
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
                            img: fileUrl,
                        });

                    } else {
                    reject('Please upload images only.');
                    }
            });

           const result = await prisma.hero.create({
                data: updated as unknown as Prisma.HeroCreateInput,
            });

            return {result}

            /*const filePromises = Object.keys(files).map(async key => {

                const file = files[key]

                /!*const cloudinaryResource = await uploadToCloudinary(file.filepath)

                return createMediaFile({
                    url: cloudinaryResource.secure_url,
                    providerPublicId: cloudinaryResource.public_id,
                    userId: userId,
                    tweetId: tweet.id
                })*!/
            })

            await Promise.all(filePromises)*/

        } catch (e) {
            console.log(e);
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

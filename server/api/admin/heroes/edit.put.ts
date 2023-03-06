import prisma from '~/helpers/prisma';
import formidable, {Fields, Files} from "formidable";
import fs from "fs";
import type {IError, IHero} from "~/types/interfaces";
import { object, string, ObjectSchema } from 'yup';
import prepareFileInfo from "~/helpers/upload/prepareFileInfo";
import setFilePath from "~/helpers/upload/setFilePath";
import type { Prisma } from '@prisma/client';
import sharp from "sharp";


// will raise a compile-time type error if the schema does not produce a valid Person
const schema: ObjectSchema<{name: string, duties: string}> = object({
    name: string().trim().required('No name'),
    duties: string().trim().required('No duties')
});
export default defineEventHandler(async (event) => {

        try {

            const form =  formidable({
                keepExtensions: true,
                allowEmptyFiles: false,
                maxFileSize: 500 * 1024 * 1024 * 1024 * 1024,
                maxFieldsSize: 500 * 1024 * 1024 * 1024 * 1024,
                multiples: true,
            });

            const response = await new Promise<Record<string, Fields | any>>((resolve, reject) => {
                form.parse(event.node.req, (err, fields, files) => {
                    if (err) {
                        reject(err)
                    }
                    resolve({ fields: JSON.parse(fields.data as string), files })
                })
            })

            const { fields, files } = response;

            await schema.validate(fields);

            const updated: IHero = await new Promise<IHero>(async (resolve, reject) => {

                if(files && Object.keys(files).length > 0){
                    if (files.media_file[0].mimetype.startsWith("image/")) {

                        if (fs.existsSync(setFilePath('/public' + fields.img))) {
                            fs.unlinkSync(setFilePath('/public' + fields.img));
                        }

                        const origFileName: string = files.media_file[0].originalFilename;

                        const ext: string = origFileName.substring(origFileName.lastIndexOf('.') + 1);

                        const fileName: string =  fields.name.split(' ').join('_')+'.'+ext;
                        const oldPath = files.media_file[0].filepath;
                        const fileUrl = "/img/" + fileName;

                        const newPath = prepareFileInfo(fileName, '/public/img/', fileName);

                       // fs.copyFileSync(oldPath, newPath);
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

                            /*const transformer = sharp()
                                .resize(resize)
                                .composite([
                                    {
                                        input: prepareFileInfo('', '/public/img/thmb/', 'img.png'),
                                        gravity: 'southeast'
                                      //  top: 5,
                                      //  left: 5,
                                    },
                                ]);

                            stream
                                .pipe(transformer)
                                .pipe(outputStream);*/

                        })

                        resolve({
                            ...fields,
                            img: fileUrl,
                        });
                    } else {
                        reject('Please upload images only.');
                    }
                }else{
                    resolve({
                        ...fields,
                    });
                }
            });

            const result = await prisma.hero.update({
                where: {
                    id: fields.id,
                },
                data: updated as unknown as Prisma.HeroUpdateInput,
            });

            return {result}

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

import prisma from '~/helpers/prisma';
import formidable, {Fields} from "formidable";
import fs from "fs";
import type {IError, ITrack} from "~/types/interfaces";
import { object, string, ObjectSchema } from 'yup';
import prepareFileInfo from "~/helpers/upload/prepareFileInfo";
import setFilePath from "~/helpers/upload/setFilePath";

const schema: ObjectSchema<{title: string}> = object({
    title: string().trim().required('No name')
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

            const updated: ITrack = await new Promise<ITrack>((resolve, reject) => {

                if(files && Object.keys(files).length > 0){
                    if (files.media_file[0].mimetype.startsWith("audio/")) {

                        if (fs.existsSync(setFilePath('/public' + fields.path))) {
                            fs.unlinkSync(setFilePath('/public' + fields.path));
                        }

                        const origFileName: string = files.media_file[0].originalFilename;

                        const ext: string = origFileName.substring(origFileName.lastIndexOf('.') + 1);

                        const fileName: string =  fields.title.split(' ').join('_')+'.'+ext;
                        const oldPath = files.media_file[0].filepath;
                        const fileUrl = "/music/" + fileName;

                        const newPath = prepareFileInfo(fileName, '/public/music/', fileName);

                        fs.copyFileSync(oldPath, newPath);

                        /*const stream = fs.createReadStream(oldPath);

                        stream.on('open', () => {
                            const outputStream = fs.createWriteStream(newPath);
                            stream.pipe(outputStream);
                        })*/

                        resolve({
                            title: fields.title,
                            path: fileUrl,
                            status: fields.status
                        });
                    } else {
                        reject('Please upload audio mp3 only.');
                    }
                }else{
                    resolve({
                        title: fields.title,
                        path: fields.path,
                        status: fields.status
                    });
                }
            });

            const result = await prisma.track.update({
                where: {
                    id: fields.id,
                },
                data: updated,
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

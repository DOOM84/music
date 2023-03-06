import prisma from '~/helpers/prisma';
import fs from "fs";
import setFilePath from "~/helpers/upload/setFilePath";
export default defineEventHandler(async (event) => {

        try {
            const {id, path} = await readBody(event);

                await prisma.track.delete({
                    where: {
                        id
                    },
                })

            if (fs.existsSync(setFilePath('/public' + path))) {
                fs.unlinkSync(setFilePath('/public' + path));
            }

            return {
                id
            }

        } catch (e) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Error occurred'
                })
        }
})

import prisma from '~/helpers/prisma';
import type {IAbout, IError} from "~/types/interfaces";


import { object, string, ObjectSchema } from 'yup';

const schema: ObjectSchema<IAbout> = object({
    text: string().defined(),
});
export default defineEventHandler(async (event) => {

        try {
            const updated: IAbout = await readBody(event);

            if(updated.text.trim() === "<p></p>"){updated.text = ""}

            await schema.validate(updated);

            await prisma.about.upsert({
                where: {
                    id: 1,
                },
                update: {
                    text: updated.text
                },
                create: {
                    text: updated.text
                },
            })

            return {
                result: updated
            };

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
                    statusMessage: 'Error occurred'
                })
            }
        }
})

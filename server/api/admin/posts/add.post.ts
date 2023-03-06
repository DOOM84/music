import prisma from '~/helpers/prisma';
import type {IPost, IError} from "~/types/interfaces";
import { object, string, ObjectSchema } from 'yup';

// will raise a compile-time type error if the schema does not produce a valid Person
const schema: ObjectSchema<{text: string; added: string}> = object({
    text: string().trim().required('No text'),
    added: string().trim().required('No date added')
});
export default defineEventHandler(async (event) => {

        try {
            const updated: IPost = await readBody(event);

            if(updated.text.trim() === "<p></p>"){updated.text = ""}

            await schema.validate(updated);

           const result = await prisma.post.create({
                data: updated,
            });

            return {
                result
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

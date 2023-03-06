import type {IError, IUser} from "~/types/interfaces";
import { object, string, ObjectSchema, ref } from 'yup';
import { serverSupabaseServiceRole } from '#supabase/server';
type AdminUser = Omit<IUser, 'id' | 'admin'>;

const schema: ObjectSchema<AdminUser> = object({

    login: string().trim('Login incorrect')
        .min(3, 'Login incorrect')
        .max(100, 'Login incorrect')
        .matches(/^[0-9A-Za-zа-яґєіїёА-ЯҐЄІЇЁ ]*$/, 'Login incorrect')
        .required('Login required'),
    email: string().trim('Email incorrect')
        .email('Email incorrect').required('Email incorrect'),
    password: string()
        //.notRequired()
        .trim('Min password length 6')
        .min(6, 'Min password length 6'),
    passwordConfirmation: string().when('password', (password, field) => {
          //  console.log(!!password[0])
           return  password[0] ? field.required("Passwords must match")
                    .trim('Min password length 6')
                    .oneOf([ref('password')], 'Passwords must match')
                : field
        }
    ),
});
export default defineEventHandler(async (event) => {

        try {
            const client = serverSupabaseServiceRole(event);

            const updated: IUser = await readBody(event);

            await schema.validate(updated);

            const { data, error } = await client.auth.admin.updateUserById(
                updated.id as string,
                updated.password ? {
                    email: updated.email,
                    password: updated.password,
                    user_metadata: { login: updated.login, admin: updated.admin }
                } : {
                    email: updated.email,
                    user_metadata: { login: updated.login, admin: updated.admin }
                }
            )

            if (error) throw error;

            return {
                result: {
                    id: updated.id,
                    login: updated.login,
                    email: updated.email,
                    admin: updated.admin
                }
            };

        } catch (e) {

            const typedError = e as IError;

            if (typedError.path && typedError.errors?.length) {
                throw createError({
                    statusCode: 422,
                    statusMessage: typedError.errors[0]
                })
            } else {
                if(typedError.toString().includes('AuthApiError')){
                    throw createError({
                        statusCode: 422,
                        statusMessage: 'Email address already registered by another user'
                    })
                }

                throw createError({
                    statusCode: 404,
                    statusMessage: 'Error occurred'
                })
            }
        }
})

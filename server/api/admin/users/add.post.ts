import type {IError, IUser} from "~/types/interfaces";
import { object, string, ObjectSchema, ref } from 'yup';
import { serverSupabaseServiceRole } from '#supabase/server';
type AdminUser = Omit<IUser, 'admin' | 'id'>;

const schema: ObjectSchema<AdminUser> = object({

    login: string().trim('Login incorrect')
        .min(3, 'Login incorrect')
        .max(100, 'Login incorrect')
        .matches(/^[0-9A-Za-zа-яґєіїёА-ЯҐЄІЇЁ ]*$/, 'Login incorrect')
        .required('Login required'),
    email: string().trim('Email incorrect')
        .email('Email incorrect').required('Email incorrect'),
    password: string()
        .trim('Min password length 6')
        .min(6, 'Min password length 6')
        .required('Min password length 6'),
    passwordConfirmation: string().trim('Min password length 6').required('Password does not match')
        .oneOf([ref('password')], 'Password does not match'),
});
export default defineEventHandler(async (event) => {

        try {
            const client = serverSupabaseServiceRole(event);

            const updated: IUser = await readBody(event);

            await schema.validate(updated);

            const { data: { user }, error } = await client.auth.admin.createUser({
                email: updated.email,
                password: updated.password,
                user_metadata:  { login: updated.login, admin: updated.admin}
            })

            if (error) throw error;

            if(user?.id){
                await client.auth.admin.updateUserById(
                    user.id,
                    {
                        email_confirm: true,
                        user_metadata:  { login: updated.login, admin: updated.admin}
                    }
                )
            }

            return {
                result: {
                    id: user?.id,
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

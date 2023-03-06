import {serverSupabaseServiceRole} from "#supabase/server";
export default defineEventHandler(async (event) => {

        try {
            const client = serverSupabaseServiceRole(event);

            const {id} = await readBody(event);

            await client.auth.admin.deleteUser(id);

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

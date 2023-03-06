import {
    getCookie
} from 'h3'

import { serverSupabaseServiceRole } from '#supabase/server';

export default defineEventHandler(async (event) => {
    try {
        const client = serverSupabaseServiceRole(event);
        const token = getCookie(event, 'sb-access-token') || getQuery(event)['sb-access-token'] as string;

         const { data } = await client.auth.getUser(token);

        if(data.user){
             return sendError(event, createError({
                 statusCode: 404,
                 statusMessage: 'Error occurred'
             }))
         }

        return {access: true}

    } catch (e) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Error occurred'
        })
    }

})

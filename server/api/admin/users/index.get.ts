import { serverSupabaseServiceRole } from '#supabase/server';

export default defineEventHandler(async (event) => {
    try {

        const client = serverSupabaseServiceRole(event);

        const {data: {users}, error} = await client.auth.admin.listUsers();

        if (error) throw error;

        const result = users.map(user => ( {
            id: user.id,
            email: user.email,
            login: user.user_metadata.login,
            admin: user.user_metadata.admin
        }))

        return {users: result};

        /*const { data, error } = await client.auth.admin.updateUserById(
          'cc19ee6b-bda1-46f9-90bf-cc1ac35411cc',
          { email_confirm: true,
            user_metadata: { login: 'DOOM777' } }
      )*/

        /* const { data, error } = await client.auth.getUser(
             'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjc3NTk2MTYxLCJzdWIiOiJjMTE4ZjgwNS0yOTZkLTQyMjUtOTI3Ni1kMGYzZmY2ODMxNjIiLCJlbWFpbCI6Il9kb29tX0B1a3IubmV0IiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJsb2dpbiI6IkRPT003NzcifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTY3NzU4ODk1Mn1dLCJzZXNzaW9uX2lkIjoiMDYxZWQ3OTctMmU2Ni00OGVmLTg4MWUtZWE3MGY4YWZmYTlmIn0.ddHT78DiRR-ZuKB1Ef5CjZ0uxKMO0P-bKNcR94kTujw'
         )*/

        /*const { data, error } = await client.auth.admin.generateLink({
            type: 'signup',
            email: '_doom_@ukr.net',
            options: {
                'password': 'lacrimosa'
            }
        })*/

    }catch (e) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Error occurred'
        })
    }

})
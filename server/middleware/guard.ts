export default defineEventHandler(async (event) => {
    try {
        const toName = event.node.req.url?.split("/") as string[];

        if(toName[2] === 'admin' && (toName[toName.length - 1] === 'add' ||
            toName[toName.length - 1] === 'edit' || toName[toName.length - 1] === 'remove'||
            toName[toName.length - 1] === 'uploader')){

            await $fetch('/api/check', {
                params: {['sb-access-token']: getCookie(event, 'sb-access-token')},
            })
        }
    } catch (e) {
        //console.log(e);
        throw createError({
            statusCode: 404,
            statusMessage: 'Error occurred'
        })
    }
});
export default defineNuxtRouteMiddleware(async (to) => {
    const nuxtApp = useNuxtApp()
    if (process.client && nuxtApp.isHydrating && nuxtApp.payload.serverRendered) return

    try {

        await $fetch<{access: boolean }>('/api/check', {
            headers: useRequestHeaders(["cookie"]) as HeadersInit | undefined,
        });

    } catch (e) {
        throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
    }
})
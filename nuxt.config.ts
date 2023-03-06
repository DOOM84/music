// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        pageTransition: {
            name: 'page',
            mode: 'out-in' // default
        },
        layoutTransition: {
            name: 'page',
            mode: 'out-in' // default
        }
    },
    modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase', 'nuxt-icon'],
})

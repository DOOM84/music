import { defineNuxtPlugin } from '#app'
import VuePlyr from '@skjnldsv/vue-plyr'
import '@skjnldsv/vue-plyr/dist/vue-plyr.css'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(VuePlyr, {
        plyr: {
            controls: ['play', 'progress', 'current-time', 'mute', 'volume', /*'duration'*/]
        }
    })
})

import type { RouterConfig } from '@nuxt/schema'
// https://router.vuejs.org/api/interfaces/routeroptions.html
export default <RouterConfig> {
    async scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        }

        const findEl = async (hash: string, x = 0) => {
            return (
                document.querySelector(hash) ||
                new Promise((resolve) => {
                    if (x > 0) {
                        return resolve(document.querySelector("#app"));
                    }
                    setTimeout(() => {
                        resolve(findEl(hash, 1));
                    }, 700);
                })
            );
        };

        if (to.hash) {
            const el = await findEl(to.hash) as HTMLElement;
            if ("scrollBehavior" in document.documentElement.style) {
                return window.scrollTo({ top: el.offsetTop, behavior: "smooth" });
            } else {
                return window.scrollTo(0, el.offsetTop);
            }
        }
        return { left: 0, top: 0, behaviour: "smooth" };
    }
}
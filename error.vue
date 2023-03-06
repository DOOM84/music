<template>
  <div
      class="bg-cover bg-center bg-fixed flex flex-col h-[100vh] lg:h-[70vh] xl:h-[70vh] relative"
      :style="{ backgroundImage: `url('/img/bg.jpg')` }"
  >
    <header class="h-full">
      <div class="grid sm:grid-cols-2 grid-cols-1
         justify-center content-center h-full gap-y-14 px-3">
        <div class="text-center self-center text-zinc-100">
            <span class="sans block font-extrabold text-xl sm:text-3xl lg:text-4xl xl:text-5xl mb-5">
             Error 404 Page Not Found
            </span>
          <NuxtLink to="/" class="btn font-bold bg-transparent text-2xl hover:bg-transparent">
            Main page
          </NuxtLink>
        </div>
        <div id="logo" class="text-center min-w-[180px] mx-auto
          transform transition-all duration-1000 ease-in-out scale-0">
          <img src="/img/logo.png" alt="logo">
        </div>
      </div>
    </header>
    <TheFooter />
  </div>
</template>

<script setup lang="ts">
onMounted(() => {

  const logo = document.querySelector('#logo') as HTMLElement;
  logo.classList.remove('scale-0');
  logo.classList.add('scale-100');
})

useHead({
  bodyAttrs: {
    class: 'bg-black'
  }
})

</script>

<style scoped>

</style>
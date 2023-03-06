<template>
  <header class="h-full">
    <div class="grid sm:grid-cols-2 grid-cols-1
         justify-center content-center h-full gap-y-14 px-3">
      <div class="text-center self-center text-zinc-100">
            <span class="sans block font-extrabold text-2xl sm:text-3xl lg:text-4xl xl:text-5xl">
              WELCOME {{user?.user_metadata?.login}}
            </span>
        <span class="text-xl sm:text-2xl lg:text-2xl xl:text-2xl font-bold">
               to the official homepage of Inner Silence!
            </span>
      </div>
      <div id="logo" class="text-center min-w-[180px] mx-auto
          transform transition-all duration-1000 ease-in-out scale-0">
        <img src="/img/logo.png" alt="logo">
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
</script>
<template>
  <div
      :style="{ backgroundImage: `url('/img/aboutback.jpg')` }"
      class="flex
  flex-col items-center
   min-h-[750px]
  bg-gray-600 text-center py-7
  bg-cover bg-center bg-fixed
  text-zinc-100
"
  >
    <div class="max-w-[1000px] mt-24 px-3">

      <h2 class="px-3 text-4xl font-extrabold sans">About</h2>

      <div v-html="bio.text" class="text-left mt-7 text-zinc-400">
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>

import type {IAbout} from "~/types/interfaces";

interface TheAboutProps {
  bio: IAbout;
}

const props = defineProps<TheAboutProps>()

</script>

<style scoped>

</style>
<template>
  <div
      :style="{ backgroundImage: `url('/img/newsback.jpg')` }"
      class="flex
  flex-col items-center
   min-h-[600px]
  bg-gray-600 text-center py-7
  bg-cover bg-center bg-fixed
  text-zinc-100"
  >
    <div class="max-w-[1000px] mt-24 px-3">

      <h2 class="px-3 text-4xl font-extrabold sans">News</h2>

      <div v-for="post in posts" class="text-left mt-7 text-zinc-400">
        <div v-html="post.text"></div>
        <p class="text-right mt-1 text-sm font-semibold">{{post.added}}</p>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>

import type {IPost} from "~/types/interfaces";

interface TheNewsProps {
  posts: IPost[];
}

defineProps<TheNewsProps>()

</script>

<style scoped>

</style>
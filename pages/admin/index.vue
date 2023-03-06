<template>
  <main class="withFooter text-center text-3xl text-zinc-200">
    <p class="my-3">
      Dashboard
    </p>
  </main>
</template>


<script setup lang="ts">

definePageMeta({
  layout: 'admin',
  middleware: ["admin"]
})

const title = computed((): string =>  'Dashboard')

useHead({
  title: title
})

</script>
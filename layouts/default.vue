<template>
  <div class="relative">
    <NuxtLoadingIndicator color="white"/>
    <the-navigation />
    <slot/>
    <TheFooter />
  </div>
</template>

<script lang="ts" setup>

useHead({
  bodyAttrs: {
    class: 'bg-black'
  }
})
</script>
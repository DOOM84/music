<template>
  <div>
    <NuxtLoadingIndicator color="white"/>
    <AdminTheHeader/>
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
<template>
  <main class="withFooter text-center">
    <p class="text-3xl text-zinc-200 my-3">
      About
    </p>
    <ClientOnly>
      <div class="mb-4 flex justify-center relative">
        <TheLoading :show-load="showLoading" :full-page="false" />
        <AdminTheEditor @updatedContent="updatedContent" :content="data.about.text"></AdminTheEditor>
      </div>
      <button
          :disabled="showLoading"
          type="button"
          class="btn my-5 w-1/2 font-bold"
          @click.prevent="storeItem">
        Save
      </button>
    </ClientOnly>

  </main>
</template>

<script lang="ts" setup>
import type {IError, IAbout} from "~/types/interfaces";

definePageMeta({
  layout: 'admin',
  middleware: ["admin"]
})

const title = computed((): string => 'About')

useHead({
  title: title,
  script: [
    {
      src: '/scripts/ckeditor/ckeditor.js',
      defer: true,
    }
  ]
})

const showLoading = ref<boolean>(false);

const {data, error} = await useAsyncData('adminAbout', () => $fetch<{ about: IAbout }>('/api/admin/about'));

function updatedContent(cont: string): void {
  data.value.about.text = cont;
}

async function storeItem(): Promise<void> {

  try {
    showLoading.value = true;

    useNuxtApp().$toast.info('Processing...');

    const {result} = await $fetch<{ result: IAbout }>('/api/admin/about/edit', {
      method: 'POST',
      body: data.value.about,
    })

    useNuxtApp().$toast.success('Completed!');

  } catch (e) {

    const typedError = e as IError;

    useNuxtApp().$toast.error(typedError.statusMessage);

  }finally {
    showLoading.value = false;
  }
}

</script>
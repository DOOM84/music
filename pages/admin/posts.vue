<template>
  <main class="withFooter text-center">
    <p class="text-3xl text-zinc-200 my-3">
      News
    </p>

    <div class="text-right">
      <button
          class="btn font-bold"
          type="button"
          @click.prevent="addItem">
        Add news
      </button>
    </div>
    <ClientOnly>
      <Teleport to="body">
        <modal :show="showDlg" @close="closeModal" :showLoading="showLoading">
          <template #body>
            <div class="mb-4">
              <label for="title">Text</label>
              <AdminTheEditor @updatedContent="updatedContent" :content="postToUpdate.text"></AdminTheEditor>
            </div>
            <div class="form-group">
              <label for="description">Added date (dd-mm-yyyy)</label>
              <input type="text" v-model.trim="postToUpdate.added" class="block
              w-full h-8 px-2 py-3 text-md text-zinc-800 border
              border-solid border-zinc-600 rounded-lg shadow-lg shadow-indigo-500/40" id="description">
            </div>
            <div class="right">
              <label for="status">Published</label>
              <input type="checkbox" v-model="postToUpdate.status" id="status">
            </div>
            <button
                type="button"
                class="btn mt-5 w-full font-bold"
                @click.prevent="storeItem">
              Save
            </button>
          </template>
        </modal>
      </Teleport>
      <AdminDtable @endFilter="toFilter = false"
                   :data="data.posts"
                   :toFilter="toFilter"
                   :filtering="filtering"
                   :toSearch="['text', 'status']">
        <template #thead>
          <table-head>
            <div class="flex justify-center items-center">
              <strong>Text</strong>
              <Icon @click.prevent="filter('text', 'asc')" name="ant-design:caret-up-filled" class="cursor-pointer ml-1"
                    size="10"/>
              <Icon @click.prevent="filter('text', 'desc')" name="ant-design:caret-down-filled" class="cursor-pointer"
                    size="10"/>
            </div>
          </table-head>
          <table-head>
            <div class="flex justify-center items-center">
              <strong>Added</strong>
            </div>
          </table-head>
          <table-head>
            <div class="flex justify-center items-center">
              <strong>Published</strong>
              <Icon @click.prevent="filter('status', 'asc')" name="ant-design:caret-up-filled" class="cursor-pointer ml-1"
                    size="10"/>
              <Icon @click.prevent="filter('status', 'desc')" name="ant-design:caret-down-filled" class="cursor-pointer"
                    size="10"/>
            </div>
          </table-head>
          <table-head/>
        </template>

        <template #rows="{row}">
          <table-body>
            {{ row.text }}
          </table-body>
          <table-body>
            {{ row.added }}
          </table-body>
          <table-body>
            {{ row.status ? 'Yes': 'No' }}
          </table-body>
          <table-body>
            <button @click.prevent="updateItem(row)">
              <Icon name="material-symbols:edit-square-outline" size="20"/>
            </button>
            <button @click.prevent="removeItem(row.id)">
              <Icon name="ion:trash-b" size="20"/>
            </button>
          </table-body>
        </template>
      </AdminDtable>
    </ClientOnly>

  </main>
</template>

<script lang="ts" setup>
import type {IError, IPost} from "~/types/interfaces";

definePageMeta({
  layout: 'admin',
  middleware: ["admin"]
})

const title = computed((): string => 'News')

useHead({
  title: title,
  script: [
    {
      src: '/scripts/ckeditor/ckeditor.js',
      defer: true,
    }
  ]
})
const {data, error} = await useAsyncData('adminNews', () => $fetch<{ posts: IPost[] }>('/api/admin/posts'));

import useFilter from "~/helpers/useFilter";

const {filtering, toFilter, showDlg, mode, filter} = useFilter();

const showLoading = ref<boolean>(false);

const postToUpdate = ref<{status: boolean, text: ''} | IPost>({status: false, text: ''});

function updatedContent(cont: string): void {
  postToUpdate.value.text = cont;
}

function closeModal(): void {
  showDlg.value = false;
  mode.value = null;
  postToUpdate.value.status = false;
}

function updateItem(post: IPost) {
  mode.value = 'edit';
  postToUpdate.value = {...post}
  showDlg.value = true;
}

function addItem(): void {
  mode.value = 'add';
  postToUpdate.value = {status: false, text: '', added: ''}
  showDlg.value = true;
}

async function storeItem(): Promise<void> {

  try {
    showLoading.value = true;
    useNuxtApp().$toast.info('Processing...');

    if (mode.value === 'edit') {
      const {result} = await $fetch<{ result: IPost }>('/api/admin/posts/edit', {
        method: 'PUT',
        body: postToUpdate.value,
      })
      if (data.value?.posts) {
        const ind: number = data.value.posts.findIndex((item: IPost) => item.id === result.id);
        data.value.posts[ind] = result;
      }
    }

    if (mode.value === 'add') {
      const {result} = await $fetch<{ result: IPost }>('/api/admin/posts/add', {
        method: 'POST',
        body: postToUpdate.value,
      })
      data.value?.posts.unshift(result);
    }

    filter('', '');

    closeModal();

    useNuxtApp().$toast.success('Completed!');

  } catch (e) {

    const typedError = e as IError;

    useNuxtApp().$toast.error(typedError.statusMessage);

    /*if (typedError.response?.status === 422) {

      useNuxtApp().$toast.error(typedError.statusMessage);

    }  else {

      useNuxtApp().$toast.error(typedError.statusMessage);

    }*/

  } finally {
    showLoading.value = false;
  }
}

async function removeItem(dbId: string): Promise<void> {
  if (confirm('Are you sure?')) {
    try {

      useNuxtApp().$toast.info('Processing...');

      const {id} = await $fetch<{ id: number }>('/api/admin/posts/remove', {
        method: 'DELETE',
        body: {id: dbId},
      })

      data.value?.posts.splice(data.value.posts.findIndex((item: IPost) => item.id === id), 1);

      filter('', '');

      useNuxtApp().$toast.success('Completed!');

    } catch (e) {

      const typedError = e as IError;

      useNuxtApp().$toast.error(typedError.statusMessage);

    }
  }
}

</script>
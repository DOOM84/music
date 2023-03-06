<template>
  <main class="withFooter text-center">
    <p class="text-3xl text-zinc-200 my-3">
      Releases
    </p>

    <div class="text-right">
      <button
          class="btn font-bold"
          type="button"
          @click.prevent="addItem">
        Add release
      </button>
    </div>
    <ClientOnly>
      <Teleport to="body">
        <modal :show="showDlg" @close="closeModal" :showLoading="showLoading">
          <template #body>
            <div class="form-group">
              <label for="title">Title</label>
              <input type="text" v-model.trim="releaseToUpdate.title" class="block
              w-full h-8 px-2 py-3 text-md text-zinc-800 border
              border-solid border-zinc-600 rounded-lg shadow-lg shadow-indigo-500/40" id="title">
            </div>
            <div class="form-group flex justify-center mt-3">
              <img :src="releaseToUpdate.image" width="300" alt="">
            </div>
            <div class="form-group">
              <label for="published">Published</label>
              <input type="text" v-model.trim="releaseToUpdate.published" class="block
              w-full h-8 px-2 py-3 text-md text-zinc-800 border
              border-solid border-zinc-600 rounded-lg shadow-lg shadow-indigo-500/40" id="published">
            </div>
            <div class="form-group">
              <label for="recordLabel">Record Label</label>
              <input type="text" v-model.trim="releaseToUpdate.recordLabel" class="block
              w-full h-8 px-2 py-3 text-md text-zinc-800 border
              border-solid border-zinc-600 rounded-lg shadow-lg shadow-indigo-500/40" id="recordLabel">
            </div>
            <div class="form-group">
              <label for="format">Format</label>
              <input type="text" v-model.trim="releaseToUpdate.format" class="block
              w-full h-8 px-2 py-3 text-md text-zinc-800 border
              border-solid border-zinc-600 rounded-lg shadow-lg shadow-indigo-500/40" id="format">
            </div>
            <div class="form-group">
              <label for="length">Length</label>
              <input type="text" v-model.trim="releaseToUpdate.length" class="block
              w-full h-8 px-2 py-3 text-md text-zinc-800 border
              border-solid border-zinc-600 rounded-lg shadow-lg shadow-indigo-500/40" id="length">
            </div>
            <div class="form-group">
              <label for="link">Link</label>
              <input type="text" v-model.trim="releaseToUpdate.link" class="block
              w-full h-8 px-2 py-3 text-md text-zinc-800 border
              border-solid border-zinc-600 rounded-lg shadow-lg shadow-indigo-500/40" id="link">
            </div>
            <div class="form-group">
              <div>Tracks</div>
              <div class="text-right mb-2 font-bold">
                <button class="btn bg-emerald-800" @click="addTrack">Add track</button>
              </div>

              <div v-for="(track, i) in releaseToUpdate.tracks" :key="i" class="flex w-full">
                <input type="text" v-model.trim="track.title" class="flex-1
              h-8 px-2 py-3 text-md text-zinc-800 border
              border-solid border-zinc-600 rounded-lg shadow-lg shadow-indigo-500/40" id="description">
                <input type="text" v-model.trim="track.time" class="w-1/4
              h-8 px-2 py-3 text-md text-zinc-800 border
              border-solid border-zinc-600 rounded-lg shadow-lg shadow-indigo-500/40" id="description">
                </div>
              </div>
            <div class="flex justify-center mt-3" v-if="picToLoad">
              <div v-if="showSpinner"  class="text-center">
                <Icon  name="svg-spinners:12-dots-scale-rotate" size="40"/>
              </div>
              <img :src="picToLoad" width="300" alt="">
            </div>
            <div class="p-4 pl-16">
              <label for="img" class="block">Image cover</label>
              <input id="img" type="file" accept="image/jpeg"
                     @change="handleFileChange">
            </div>
            <div class="text-right">
              <label for="status">Published</label>
              <input type="checkbox" v-model="releaseToUpdate.status" id="status">
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
                   :data="data.releases"
                   :toFilter="toFilter"
                   :filtering="filtering"
                   :toSearch="['title']">
        <template #thead>
          <table-head>
            <div class="flex justify-center items-center">
              <strong>Title</strong>
              <Icon @click.prevent="filter('title', 'asc')" name="ant-design:caret-up-filled" class="cursor-pointer ml-1"
                    size="10"/>
              <Icon @click.prevent="filter('title', 'desc')" name="ant-design:caret-down-filled" class="cursor-pointer"
                    size="10"/>
            </div>
          </table-head>
          <table-head>
            <div class="flex justify-center items-center">
              <strong>Image</strong>
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
            {{ row.title }}
          </table-body>
          <table-body>
            <div class="flex justify-center">
              <img :src="row.image" width="150" alt="">
            </div>
          </table-body>
          <table-body>
            {{ row.status ? 'Yes': 'No' }}
          </table-body>
          <table-body>
            <button @click.prevent="updateItem(row)">
              <Icon name="material-symbols:edit-square-outline" size="20"/>
            </button>
            <button @click.prevent="removeItem(row.id, row.image)">
              <Icon name="ion:trash-b" size="20"/>
            </button>
          </table-body>
        </template>
      </AdminDtable>
    </ClientOnly>

  </main>
</template>

<script lang="ts" setup>
import type {IError, IRelease} from "~/types/interfaces";

definePageMeta({
  layout: 'admin',
  middleware: ["admin"]
})

const title = computed((): string => 'Releases')

const {data, error} = await useAsyncData('adminReleases', () => $fetch<{ releases: IRelease[] }>('/api/admin/releases'));

import useFilter from "~/helpers/useFilter";

const {filtering, toFilter, showDlg, mode, filter} = useFilter();

const releaseToUpdate = ref<{status: boolean,
  title: string, id?: number, image?: string, tracks?: [{title: string; time: string}]} | IRelease>({status: false, title: ''});

const selectedFile = ref<File>();

const showSpinner = ref<boolean>(false);

const showLoading = ref<boolean>(false);

const picToLoad = ref<string>()

function closeModal(): void {
  releaseToUpdate.value = {status: false, title: ''}
  picToLoad.value = '';
  showDlg.value = false;
  mode.value = null;
  selectedFile.value = undefined;
}

function updateItem(release: IRelease) {
  mode.value = 'edit';
  releaseToUpdate.value = JSON.parse(JSON.stringify(release))
  showDlg.value = true;
}

function addItem(): void {
  mode.value = 'add';
  releaseToUpdate.value = {status: false, title: '', tracks: [{title: '', time: ''}]}
  showDlg.value = true;
}

function addTrack(): void {

  if(Array.isArray(releaseToUpdate.value.tracks)){
    releaseToUpdate.value.tracks.push({title: '', time: ''})
  }
}

function handleFileChange(event: { target: { files: (File | undefined)[]; }; }) {

 /* [...event.target.files].forEach((mediaFile, index) => {
    //form.append('media_file_' + index, mediaFile)
  })*/

  picToLoad.value  = '';

  selectedFile.value = event.target.files[0]

  const file = event.target.files[0]

  selectedFile.value = file

  const reader = new FileReader()

  reader.onloadstart = (event)=>{
    showSpinner.value = true;
  }

  reader.onload = (event) => {
    showSpinner.value = false;
    picToLoad.value = event.target?.result as string
  }

  reader.readAsDataURL(file as File)
}

async function storeItem(): Promise<void> {

  showLoading.value = true;

  if(Array.isArray(releaseToUpdate.value.tracks)){
    releaseToUpdate.value.tracks = [...releaseToUpdate.value.tracks.filter(track => !!track.title)];
  }

  const formData = new FormData();
  formData.append('data', JSON.stringify(releaseToUpdate.value))

  if(selectedFile.value){
    formData.append('media_file', selectedFile.value as File)
  }

  try {
    useNuxtApp().$toast.info('Processing...');

    if (mode.value === 'edit') {

      const {result} = await $fetch<{ result: IRelease }>('/api/admin/releases/edit', {
        method: 'PUT',
        body: formData,
      })
      if (data.value?.releases) {
        const ind: number = data.value?.releases.findIndex((item: IRelease) => item.id === result.id);
        data.value.releases[ind] = result;
      }
    }

    if (mode.value === 'add') {

      const {result} = await $fetch<{ result: IRelease }>('/api/admin/releases/add', {
        method: 'POST',
        body: formData,
      })
      data.value?.releases.unshift(result);
    }

    filter('', '');

    closeModal();

    useNuxtApp().$toast.success('Completed!');

  } catch (e) {

    const typedError = e as IError;

    useNuxtApp().$toast.error(typedError.statusMessage);

  }finally {
    showLoading.value = false;
  }
}

async function removeItem(dbId: number, path: string): Promise<void> {

  if (confirm('Are you sure?')) {
    try {

      useNuxtApp().$toast.info('Processing...');

      const {id} = await $fetch<{ id: number }>('/api/admin/releases/remove', {
        method: 'DELETE',
        body: {id: dbId, path},
      })

      data.value?.releases.splice(data.value.releases.findIndex((item: IRelease) => item.id === id), 1);

      filter('', '');

      useNuxtApp().$toast.success('Completed!');

    } catch (e) {

      const typedError = e as IError;

      useNuxtApp().$toast.error(typedError.statusMessage);

    }
  }
}

</script>
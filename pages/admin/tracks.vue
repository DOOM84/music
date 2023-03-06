<template>
  <main class="withFooter text-center">
    <p class="text-3xl text-zinc-200 my-3">
      Demo tracks
    </p>

    <div class="text-right">
      <button
          class="btn font-bold"
          type="button"
          @click.prevent="addItem">
        Add track
      </button>
    </div>
    <ClientOnly>
      <Teleport to="body">
        <modal :show="showDlg" @close="closeModal" :showLoading="showLoading">
          <template #body>
            <div v-if="showSpinner"  class="text-center">
              <Icon  name="svg-spinners:12-dots-scale-rotate" size="40"/>
            </div>
            <div v-if="trackToPlay">
              <vue-plyr ref="plyr">
                <audio ref="audio" controls crossorigin>
                  <source :src="trackToPlay" type="audio/mp3"/>
                </audio>
              </vue-plyr>
            </div>
            <div class="form-group">
              <label for="description">Title</label>
              <input type="text" v-model.trim="trackToUpdate.title" class="block
              w-full h-8 px-2 py-3 text-md text-zinc-800 border
              border-solid border-zinc-600 rounded-lg shadow-lg shadow-indigo-500/40" id="description">
            </div>
            <div class="p-4 pl-16">
              <input type="file" accept="audio/mpeg"
                     @change="handleFileChange">
            </div>
            <div class="text-right">
              <label for="status">Published</label>
              <input type="checkbox" v-model="trackToUpdate.status" id="status">
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
                   :data="data.tracks"
                   :toFilter="toFilter"
                   :filtering="filtering"
                   :toSearch="['title', 'status']">
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
              <strong>Path</strong>
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
            {{ row.path }}
          </table-body>
          <table-body>
            {{ row.status ? 'Yes': 'No' }}
          </table-body>
          <table-body>
            <button @click.prevent="updateItem(row)">
              <Icon name="material-symbols:edit-square-outline" size="20"/>
            </button>
            <button @click.prevent="removeItem(row.id, row.path)">
              <Icon name="ion:trash-b" size="20"/>
            </button>
          </table-body>
        </template>
      </AdminDtable>
    </ClientOnly>

  </main>
</template>

<script lang="ts" setup>
import type {IError, ITrack} from "~/types/interfaces";

definePageMeta({
  layout: 'admin',
  middleware: ["admin"]
})

const title = computed((): string => 'Tracks')

const {data, error} = await useAsyncData('adminTracks', () => $fetch<{ tracks: ITrack[] }>('/api/admin/tracks'));

import useFilter from "~/helpers/useFilter";

const {filtering, toFilter, showDlg, mode, filter} = useFilter();

const trackToUpdate = ref<{status: boolean, title: string, id?: number, path?: string} | ITrack>({status: false, title: ''});

const selectedFile = ref<File>();

const showSpinner = ref<boolean>(false);

const showLoading = ref<boolean>(false);

const trackToPlay = ref<string>()

function closeModal(): void {
  trackToUpdate.value = {status: false, title: ''}
  trackToPlay.value = '';
  showDlg.value = false;
  mode.value = null;
  selectedFile.value = undefined;
}

function updateItem(track: ITrack) {
  mode.value = 'edit';
  trackToUpdate.value = {...track}
  trackToPlay.value = trackToUpdate.value.path;
  showDlg.value = true;
}

function addItem(): void {
  mode.value = 'add';
  trackToUpdate.value = {status: false, title: ''}
  showDlg.value = true;
}

function handleFileChange(event: { target: { files: (File | undefined)[]; }; }) {

 /* [...event.target.files].forEach((mediaFile, index) => {
    //form.append('media_file_' + index, mediaFile)
  })*/

  trackToPlay.value  = '';

  selectedFile.value = event.target.files[0]

  const file = event.target.files[0]

  selectedFile.value = file

  const reader = new FileReader()

  reader.onloadstart = (event)=>{
    showSpinner.value = true;
  }

  reader.onload = (event) => {
    showSpinner.value = false;
    trackToPlay.value = event.target?.result as string
  }

  reader.readAsDataURL(file as File)
}

async function storeItem(): Promise<void> {

  /*console.log(selectedFile.value);
  console.log(trackToUpdate.value);

  return*/

  //const form = new FormData()

  const formData = new FormData();
  formData.append('data', JSON.stringify(trackToUpdate.value))

  if(selectedFile.value){
    formData.append('media_file', selectedFile.value)
  }

  /*event.target.files.forEach((mediaFile, index) => {
    form.append('media_file_' + index, mediaFile)
  })*/

  /*return useFetchApi('/api/user/tweets', {
    method: 'POST',
    body: form
  })*/



  try {
    showLoading.value = true;

    useNuxtApp().$toast.info('Processing...');

    if (mode.value === 'edit') {

      const {result} = await $fetch<{ result: ITrack }>('/api/admin/tracks/edit', {
        method: 'PUT',
        body: formData,
      })
      if (data.value?.tracks) {
        const ind: number = data.value?.tracks.findIndex((item: ITrack) => item.id === result.id);
        data.value.tracks[ind] = result;
      }
    }

    if (mode.value === 'add') {

      const {result} = await $fetch<{ result: ITrack }>('/api/admin/tracks/add', {
        method: 'POST',
        body: formData,
      })
      data.value?.tracks.unshift(result);
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

  }finally {
    showLoading.value = false;
  }
}

async function removeItem(dbId: number, path: string): Promise<void> {

  if (confirm('Are you sure?')) {
    try {

      useNuxtApp().$toast.info('Processing...');

      const {id} = await $fetch<{ id: number }>('/api/admin/tracks/remove', {
        method: 'DELETE',
        body: {id: dbId, path},
      })

      data.value?.tracks.splice(data.value.tracks.findIndex((item: ITrack) => item.id === id), 1);

      filter('', '');

      useNuxtApp().$toast.success('Completed!');

    } catch (e) {

      const typedError = e as IError;

      useNuxtApp().$toast.error(typedError.statusMessage);

    }
  }
}

</script>
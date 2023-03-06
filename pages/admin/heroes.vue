<template>
  <main class="withFooter text-center">
    <p class="text-3xl text-zinc-200 my-3">
      Members
    </p>

    <div class="text-right">
      <button
          class="btn font-bold"
          type="button"
          @click.prevent="addItem">
        Add member
      </button>
    </div>
    <ClientOnly>
      <Teleport to="body">
        <modal :show="showDlg" @close="closeModal" :showLoading="showLoading">
          <template #body>
            <div class="form-group flex justify-center mt-3">
              <img :src="heroToUpdate.img" width="200" alt="">
            </div>
            <div class="form-group">
              <label for="title">Name</label>
              <input type="text" v-model.trim="heroToUpdate.name" class="block
              w-full h-8 px-2 py-3 text-md text-zinc-800 border
              border-solid border-zinc-600 rounded-lg shadow-lg shadow-indigo-500/40" id="title">
            </div>
            <div class="form-group">
              <label for="title">Duties</label>
              <input type="text" v-model.trim="heroToUpdate.duties" class="block
              w-full h-8 px-2 py-3 text-md text-zinc-800 border
              border-solid border-zinc-600 rounded-lg shadow-lg shadow-indigo-500/40" id="title">
            </div>
            <div class="flex justify-center mt-3" v-if="picToLoad">
              <div v-if="showSpinner"  class="text-center">
                <Icon  name="svg-spinners:12-dots-scale-rotate" size="40"/>
              </div>
              <img :src="picToLoad" width="200" alt="">
            </div>
            <div class="p-4 pl-16">
              <label for="img" class="block">Image</label>
              <input id="img" type="file" accept="image/jpeg"
                     @change="handleFileChange">
            </div>
            <div class="text-right">
              <label for="status">Published</label>
              <input type="checkbox" v-model="heroToUpdate.status" id="status">
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
                   :data="data.heroes"
                   :toFilter="toFilter"
                   :filtering="filtering"
                   :toSearch="['name']">
        <template #thead>
          <table-head>
            <div class="flex justify-center items-center">
              <strong>Name</strong>
              <Icon @click.prevent="filter('name', 'asc')" name="ant-design:caret-up-filled" class="cursor-pointer ml-1"
                    size="10"/>
              <Icon @click.prevent="filter('name', 'desc')" name="ant-design:caret-down-filled" class="cursor-pointer"
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
              <strong>Duties</strong>
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
            {{ row.name }}
          </table-body>
          <table-body>
            <div class="flex justify-center">
              <img :src="row.img" width="150" alt="">
            </div>
          </table-body>
          <table-body>
            {{row.duties}}
          </table-body>
          <table-body>
            {{ row.status ? 'Yes': 'No' }}
          </table-body>
          <table-body>
            <button @click.prevent="updateItem(row)">
              <Icon name="material-symbols:edit-square-outline" size="20"/>
            </button>
            <button @click.prevent="removeItem(row.id, row.img)">
              <Icon name="ion:trash-b" size="20"/>
            </button>
          </table-body>
        </template>
      </AdminDtable>
    </ClientOnly>

  </main>
</template>

<script lang="ts" setup>
import type {IError, IHero} from "~/types/interfaces";

definePageMeta({
  layout: 'admin',
  middleware: ["admin"]
})

const title = computed((): string => 'Members')

const {data, error} = await useAsyncData('adminHeroes', () => $fetch<{ heroes: IHero[] }>('/api/admin/heroes'));

import useFilter from "~/helpers/useFilter";

const {filtering, toFilter, showDlg, mode, filter} = useFilter();

const heroToUpdate = ref<{status: boolean; name: string; id?: number} | IHero>({status: false, name: ''});

const selectedFile = ref<File>();

const showSpinner = ref<boolean>(false);

const showLoading = ref<boolean>(false);

const picToLoad = ref<string>()

function closeModal(): void {
  heroToUpdate.value = {status: false, name: '', duties: ''}
  picToLoad.value = '';
  showDlg.value = false;
  mode.value = null;
  selectedFile.value = undefined;
}

function updateItem(hero: IHero) {
  mode.value = 'edit';
  heroToUpdate.value = JSON.parse(JSON.stringify(hero))
  showDlg.value = true;
}

function addItem(): void {
  mode.value = 'add';
  heroToUpdate.value = {status: false, name: '', duties: ''}
  showDlg.value = true;
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

  const formData = new FormData();
  formData.append('data', JSON.stringify(heroToUpdate.value))

  if(selectedFile.value){
    formData.append('media_file', selectedFile.value as File)
  }

  try {
    useNuxtApp().$toast.info('Processing...');

    if (mode.value === 'edit') {

      const {result} = await $fetch<{ result: IHero }>('/api/admin/heroes/edit', {
        method: 'PUT',
        body: formData,
      })
      if (data.value?.heroes) {
        const ind: number = data.value?.heroes.findIndex((item: IHero) => item.id === result.id);
        data.value.heroes[ind] = result;
      }
    }

    if (mode.value === 'add') {

      const {result} = await $fetch<{ result: IHero }>('/api/admin/heroes/add', {
        method: 'POST',
        body: formData,
      })
      data.value?.heroes.unshift(result);
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

      const {id} = await $fetch<{ id: number }>('/api/admin/heroes/remove', {
        method: 'DELETE',
        body: {id: dbId, path},
      })

      data.value?.heroes.splice(data.value.heroes.findIndex((item: IHero) => item.id === id), 1);

      filter('', '');

      useNuxtApp().$toast.success('Completed!');

    } catch (e) {

      const typedError = e as IError;

      useNuxtApp().$toast.error(typedError.statusMessage);

    }
  }
}

</script>
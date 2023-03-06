<template>
  <main class="withFooter text-center">
    <p class="text-3xl text-zinc-200 my-3">
      Users
    </p>

    <div class="text-right">
      <button
          class="btn font-bold"
          type="button"
          @click.prevent="addItem">
        Add user
      </button>
    </div>
    <ClientOnly>
      <Teleport to="body">
        <modal :show="showDlg" @close="closeModal" :showLoading="showLoading">
          <template #body>
              <div class="relative">
                <ClientOnly>
                  <TheLoading :show-load="showLoading" :full-page="false" />
                </ClientOnly>
                <div class="md:flex md:items-center mb-6">
                  <div class="md:w-1/3">
                    <label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="login">
                      Login
                    </label>
                  </div>
                  <div class="md:w-2/3">
                    <input
                        id="login"
                        v-model="userToUpdate.login"
                        name="login"
                        type="text"
                        class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500">
                  </div>
                </div>
                <div class="md:flex md:items-center mb-6">
                  <div class="md:w-1/3">
                    <label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="email">
                      Email
                    </label>
                  </div>
                  <div class="md:w-2/3">
                    <input
                        v-model="userToUpdate.email"
                        type="email"
                        id="email"
                        name="email"
                        required
                        class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500">
                  </div>
                </div>
                <div class="md:flex md:items-center mb-6">
                  <div class="md:w-1/3">
                    <label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="password">
                      Password
                    </label>
                  </div>
                  <div class="md:w-2/3">
                    <input
                        id="password"
                        v-model="userToUpdate.password"
                        name="password"
                        type="password"
                        class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500">
                  </div>
                </div>
                <div class="md:flex md:items-center mb-6">
                  <div class="md:w-1/3">
                    <label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="passwordConfirmation">
                      Password confirmation
                    </label>
                  </div>
                  <div class="md:w-2/3">
                    <input
                        id="passwordConfirmation"
                        v-model="userToUpdate.passwordConfirmation"
                        name="password"
                        type="password"
                        class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500">
                  </div>
                </div>
                <div class="text-right">
                  <label for="status">Administrator</label>
                  <input type="checkbox" v-model="userToUpdate.admin" id="status">
                </div>
                <button
                    type="button"
                    class="btn mt-5 w-full font-bold"
                    @click.prevent="storeItem">
                  Save
                </button>
              </div>
          </template>
        </modal>
      </Teleport>
      <AdminDtable @endFilter="toFilter = false"
                   :data="data.users"
                   :toFilter="toFilter"
                   :filtering="filtering"
                   :toSearch="['login', 'email']">
        <template #thead>
          <table-head>
            <div class="flex justify-center items-center">
              <strong>Login</strong>
              <Icon @click.prevent="filter('login', 'asc')" name="ant-design:caret-up-filled" class="cursor-pointer ml-1"
                    size="10"/>
              <Icon @click.prevent="filter('login', 'desc')" name="ant-design:caret-down-filled" class="cursor-pointer"
                    size="10"/>
            </div>
          </table-head>
          <table-head>
            <div class="flex justify-center items-center">
              <strong>Email</strong>
              <Icon @click.prevent="filter('email', 'asc')" name="ant-design:caret-up-filled" class="cursor-pointer ml-1"
                    size="10"/>
              <Icon @click.prevent="filter('email', 'desc')" name="ant-design:caret-down-filled" class="cursor-pointer"
                    size="10"/>
            </div>
          </table-head>
          <table-head>
            <div class="flex justify-center items-center">
              <strong>Administrator</strong>
            </div>
          </table-head>
          <table-head/>
        </template>

        <template #rows="{row}">
          <table-body>
            {{ row.login }}
          </table-body>
          <table-body>
            {{ row.email }}
          </table-body>
          <table-body>
            {{ row.admin ? 'Yes': 'No' }}
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
import type {IError, IUser} from "~/types/interfaces";

definePageMeta({
  layout: 'admin',
  middleware: ["admin"]
})

const title = computed((): string => 'Users')

useHead({
  title: title,
})
const {data, error} = await useAsyncData('adminUsers', () => $fetch<{ users: IUser[] }>('/api/admin/users'));

import useFilter from "~/helpers/useFilter";

const {filtering, toFilter, showDlg, mode, filter} = useFilter();

const showLoading = ref<boolean>(false);

const userToUpdate = ref<{admin: boolean, email: '', login: ''} | IUser>({admin: false, email: '', login: ''});

function closeModal(): void {
  showDlg.value = false;
  mode.value = null;
  userToUpdate.value.admin = false;
}

function updateItem(user: IUser) {
  mode.value = 'edit';
  userToUpdate.value = {...user}
  showDlg.value = true;
}

function addItem(): void {
  mode.value = 'add';
  userToUpdate.value = {admin: false, login: '', email: ''}
  showDlg.value = true;
}

async function storeItem(): Promise<void> {

  try {
    showLoading.value = true;
    useNuxtApp().$toast.info('Processing...');

    if (mode.value === 'edit') {
      const {result} = await $fetch<{ result: IUser }>('/api/admin/users/edit', {
        method: 'PUT',
        body: userToUpdate.value,
      })
      if (data.value?.users) {
        const ind: number = data.value.users.findIndex((item: IUser) => item.id === result.id);
        data.value.users[ind] = result;
      }
    }

    if (mode.value === 'add') {
      const {result} = await $fetch<{ result: IUser }>('/api/admin/users/add', {
        method: 'POST',
        body: userToUpdate.value,
      })
      data.value?.users.unshift(result);
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

      const {id} = await $fetch<{ id: string }>('/api/admin/users/remove', {
        method: 'DELETE',
        body: {id: dbId},
      })

      data.value?.users.splice(data.value.users.findIndex((item: IUser) => item.id === id), 1);

      filter('', '');

      useNuxtApp().$toast.success('Completed!');

    } catch (e) {

      const typedError = e as IError;

      useNuxtApp().$toast.error(typedError.statusMessage);

    }
  }
}

</script>
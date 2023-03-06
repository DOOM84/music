<template>
  <main>
    <section
        class="container mx-auto flex flex-wrap items-center justify-center px-5 py-24 text-gray-400"
    >
      <form @submit.prevent="userLogin" class="w-full max-w-sm">
        <div class="relative">
          <ClientOnly>
          <TheLoading :show-load="showLoading" :full-page="false" />
          </ClientOnly>
          <div class="md:flex md:items-center mb-6">
            <div class="md:w-1/3">
              <label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="email">
                Email
              </label>
            </div>
            <div class="md:w-2/3">
              <input
                  v-model="email"
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
                  v-model="password"
                  name="password"
                  type="password"
                  class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500">
            </div>
          </div>
          <div class="flex md:items-center">
            <div class="md:w-1/3"></div>
            <div class="md:w-2/3 w-full">
              <button type="submit" class="w-full shadow bg-zinc-600 hover:bg-zinc-800 duration-200 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  </main>
</template>

<script lang="ts" setup>
import {IError} from "~/types/interfaces";

definePageMeta({
  middleware: ["auth"]
})

useHead({
  title: 'Login',
})

const router = useRouter();

const user = useSupabaseUser();
const email = ref<string>('');
const password = ref<string>('');
//const errorMsg = ref<string>('');
const showLoading = ref<boolean>(false);
const { auth } = useSupabaseClient();
const userLogin = async () => {
  try {
    showLoading.value = true;
    const { error } = await auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });
    if (error) throw error;
    email.value = '';
    password.value = '';

    router.replace('/admin');

  } catch (error) {
    const typedError = error as IError;
  //  errorMsg.value = error.message;
    useNuxtApp().$toast.error(typedError.message)
    /*setTimeout(() => {
      errorMsg.value = '';
    }, 3000);*/
  }finally {
    showLoading.value = false;
  }
};
/*watchEffect(() => {
  if (user.value) {
    return navigateTo('/');
  }
});*/
</script>
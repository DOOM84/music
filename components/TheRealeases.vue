<template>
  <div
      :style="{ backgroundImage: `url('/img/bggal.jpg')` }"
      class="flex
  flex-col items-center
   min-h-[750px]
  bg-gray-600 text-center py-7
  bg-cover bg-center bg-fixed
  text-zinc-100">
    <div class="max-w-[1200px] mt-24 px-3">

      <h2 class="px-3 text-4xl font-extrabold sans">Releases</h2>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 grid-cols-1
         justify-center content-center h-full gap-y-7 px-3 mt-5">
        <div v-for="(album, i) in albums" class="text-center self-center text-slate-400 font-semibold flex flex-col">
          <span class="text-2xl mb-2">"{{ album.title }}"</span>
          <p><span class="text-zinc-100">Published: </span>{{ album.published }}</p>
          <p><span class="text-zinc-100">Record label: </span>{{ album.recordLabel }}</p>
          <p><span class="text-zinc-100">Format: </span>{{ album.format }}</p>
          <p><span class="text-zinc-100">Length: </span>{{ album.length }}</p>
          <p><span class="text-zinc-100">Music store: </span>
            <a class="text-red-500 font-bold hover:text-sky-600 transition-colors ease-in" target="_blank"
               :href="album.link">Download link</a></p>
          <div @click="showImg(album.image)" class="mt-3 overflow-hidden cursor-pointer relative cont">
            <img class="image scale-100" :src="album.image"/>
            <div class="middle">
              <div class="text text-zinc-300 flex justify-center items-center flex-col">
                <ul class="list-none">
                  <li v-for="track in album.tracks">
                    {{ track.title }} ({{ track.time }})
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Teleport to="body">
        <!-- use the modal component, pass in the prop -->
        <modal :noBg="true" :close-color="'100'" :close-by-out-click="true" :show="showModal" @close="showModal = false">
          <template #body>
            <img :src="curImg"/>
          </template>
        </modal>
      </Teleport>
    </div>
  </div>
</template>

<script lang="ts" setup>

import type {IRelease} from "~/types/interfaces";

interface TheReleasesProps {
  albums: IRelease[];
}

const props = defineProps<TheReleasesProps>()

const showModal = ref<boolean>(false);

const curImg = ref<string>('');
function showImg(img: string): void {
  curImg.value = img;
  showModal.value = true;

}

</script>

<style lang="scss" scoped>
.cont {
  position: relative;

  &:hover {
    .image {
      transform: scale(1.25);
    }
    .middle {
      opacity: 1;
    }
  }

  .image {
    opacity: 1;
    /*display: block;*/
    width: 100%;
    height: auto;
    transition: .5s ease;
    backface-visibility: hidden;
  }


  .middle {
    transition: .5s ease;
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    background-color: rgba(0, 0, 0, .6);
  }

}

.text {
  width: 100%;
  height: 100%;
}

</style>
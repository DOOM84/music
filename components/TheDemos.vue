<template>
  <div
      :style="{ backgroundImage: `url('/img/bgplay.jpg')` }"
      class="flex
  flex-col items-center
   min-h-[750px]
  bg-gray-600 text-center py-7
  bg-fixed
  bg-repeat
  text-zinc-100
"
  >
    <div class="min-w-[100%] max-w-[1000px] mt-24 px-3">

      <h2 class="px-3 text-4xl font-extrabold sans">Demos</h2>

      <div :style="{ backgroundImage: `url('/img/plback.jpg')` }"
           class="max-w-[1000px] min-h-[450px] bg-cover bg-center bg-fixed mx-auto pt-8 mt-8">
        <div class="max-w-[500px] mx-auto">
          <ClientOnly>
            <vue-plyr ref="plyr">
              <audio ref="audio" @ended="replay" controls crossorigin playsinline>
                <source :src="currentTrack" type="audio/mp3"/>
              </audio>
            </vue-plyr>
          </ClientOnly>
        </div>

        <div>
          <ul ref="playlist" id="playlist" class="list-none text-left text-sm">
            <li :id="'track-'+i" @click="setTrack(track.path)" v-for="(track, i) in tracks"
                class="mb-1  cursor-pointer"
                :class="{ activeTrack: track.path ===  currentTrack}"
            >
              {{ track.title }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import type {ITrack} from "~/types/interfaces";

interface TheDemosProps {
  tracks: ITrack[];
}

const props = defineProps<TheDemosProps>()

const currentTrack = ref<string>(props.tracks[0].path);

//const playlist = ref<HTMLElement>();

//const plyr = ref<HTMLElement>();

const audio = ref<HTMLAudioElement>();

function replay(): void {

  const ind = props.tracks.findIndex(track => track.path === currentTrack.value);

  if (ind + 1 > props.tracks.length - 1) {
    return
  }

  if(audio.value) {
    audio.value.pause();
    currentTrack.value = props.tracks[ind + 1].path;
    audio.value.src = currentTrack.value;
    audio.value.play();
  }

}

function setTrack(path: string): void {

  currentTrack.value = path;
  if(audio.value) {
    audio.value.pause();
    audio.value.src = path;
    audio.value.play();
  }
}

</script>

<style scoped>

</style>
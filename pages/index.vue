<template>
  <div v-if="pending || !data">
    <ClientOnly>
      <TheLoading  />
    </ClientOnly>
  </div>
    <div v-else>
      <TheNews id="news" :posts="data.posts" />
      <TheAbout id="about" :bio="data.about" />
      <TheDemos id="demos"  :tracks="data.tracks"/>
      <TheRealeases id="releases" :albums="data.albums" />
      <TheHeroes id="band" :heroes="data.heroes"  />
    </div>

</template>

<script setup lang="ts">
import type {IAbout, IPost, IRelease, ITrack, IHero} from "~/types/interfaces";

/*const { auth } = useSupabaseClient();
await auth.signOut();*/

const {data, error, pending} = useLazyAsyncData('main', () => $fetch<{
  posts: IPost, about: IAbout, tracks: ITrack, heroes: IHero, albums: IRelease }>('/api/main'));

</script>

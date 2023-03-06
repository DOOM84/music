<template>
  <div
      :style="{ backgroundImage: `url('/img/teamback.jpg')` }"
      class="flex
  flex-col items-center
   min-h-[600px]
  bg-gray-600 text-center py-7
  bg-cover bg-center bg-fixed
  text-zinc-100"

  >
    <div class="max-w-[1000px] mt-24 px-3">
      <h2 class="px-3 text-4xl font-extrabold sans">Band</h2>
      <div class="flex flex-wrap justify-center gap-y-20 sm:w-[640px] md:w-[768px] lg:w-[1000px] mt-10">
        <div v-for="hero in heroes" class="person sm:w-1/2 w-full">
          <img :src="hero.img">
          <div class="person-content">
            <h4 class="text-2xl mb-2">{{hero.name}}</h4>
            <h5>{{hero.duties}}</h5>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import type {IHero} from "~/types/interfaces";

interface TheHeroesProps {
  heroes: IHero[];
}

const props = defineProps<TheHeroesProps>()

</script>

<style lang="scss" scoped>
.person {

  width: 270px;
  text-align: center;
  margin: 0 auto;

  img {
    width: 150px;
    height: 150px;
    margin: auto;
    border-radius: 5%;
    border: 2px solid #ffffff;
  }

  .person-content {
    margin-top: 20px;
  }
}


</style>
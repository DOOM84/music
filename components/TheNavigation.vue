<template>
  <div>
    <div ref="overlay" class="text-white" id="overlay">
      <div class="flex z-50 flex-col items-center justify-center mt-32">
        <nav-item v-for="navItem in navItems" :key="navItem.hash">
          <div @click="scrollToEl(navItem.hash, 0, true)" class="nav-item">
            {{navItem.name}}
          </div>
        </nav-item>
      </div>
    </div>
    <div
        class="bg-cover bg-center bg-fixed flex flex-col h-[100vh] lg:h-[70vh] xl:h-[70vh] relative"
        :style="{ backgroundImage: `url('/img/bg.jpg')` }"
    >
      <nav id="mainNav" class="fixed flex bg-transparent text-white h-36 z-50 w-full top-0">
        <div @click="scrollToEl('#mainNav', 0)" class="cursor-pointer sans flex items-center p-4 text-2xl font-bold text-white" >
          INNER SILENCE
        </div>
        <div class="md:flex hidden flex-1 flex-wrap  items-center justify-end">
          <nav-item v-for="navItem in navItems" :key="navItem.hash">
            <div @click="scrollToEl(navItem.hash, 0)" class="nav-item">
              {{navItem.name}}
            </div>
          </nav-item>
        </div>
        <div class="my-auto ml-auto pr-4 block md:hidden cursor-pointer">
          <div ref="menuBtn" @click="toggleMenu" id="mobile-menu-button" class="group">
            <div
                class="top-0 transition-all group-open:rotate-45 bg-zinc-100 rounded-full w-8 h-1 group-open:top-2 relative"></div>
            <div class="transition-all opacity-100 group-open:opacity-0 bg-zinc-100 rounded-full w-8 h-1 mt-1"></div>
            <div
                class="top-0 transition-all group-open:-rotate-45 bg-zinc-100 rounded-full w-8 h-1 mt-1 group-open:-top-2 relative"></div>
          </div>
        </div>
      </nav>
      <the-header />
    </div>
  </div>
</template>

<script setup lang="ts">
const {$scrollTo} = useNuxtApp();
const menuBtn = ref<HTMLElement>();
const overlay = ref<HTMLElement>();
const router = useRouter();

const navItems = [
  {
    name: 'HOME',
    hash: '#mainNav'
  },
  {
    name: 'NEWS',
    hash: '#news'
  },
  {
    name: 'ABOUT',
    hash: '#about'
  },
  {
    name: 'DEMOS',
    hash: '#demos'
  },
  {
    name: 'RELEASES',
    hash: '#releases'
  },
  {
    name: 'BAND',
    hash: '#band'
  }
]

onMounted(() => {

  const logo = document.querySelector('#logo') as HTMLElement;
  logo.classList.remove('scale-0');
  logo.classList.add('scale-100');

  const nav = document.querySelector("#mainNav") as HTMLElement;
  const toggleClass = "is-sticky";

  window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 15) {
      nav?.classList.add(toggleClass);
    } else {
      nav?.classList.remove(toggleClass);
    }
  });
})

function toggleMenu(): void {
  menuBtn.value?.classList.toggle("open");
  document.body.classList.toggle("noScroll");
  if (overlay.value) {
    if (overlay.value.style.visibility === 'visible') {
      overlay.value.style.visibility = 'hidden';
      overlay.value.style.opacity = '0';
    } else {
      overlay.value.style.visibility = 'visible';
      overlay.value.style.opacity = '0.7';
    }
  }
}

function scrollToEl(hash: string, offset: number = 0, fromSideMenu: boolean = false){

  if(document.querySelector(hash)){
    $scrollTo(hash, 800, {offset: offset});
    if(fromSideMenu){
      toggleMenu();
    }
  }else{
    menuBtn.value?.classList.remove("open");
    document.body.classList.remove("noScroll");
    if (overlay.value) {
      overlay.value.style.visibility = 'hidden';
      overlay.value.style.opacity = '0';
    }
    router.push({ path: '/', hash: hash})
  }
}
</script>

<style lang="css">

nav {
  transition: height .5s;
}

.is-sticky {
  color: rgb(169, 176, 190);
  background: black;
  height: 60px;
}

#overlay {
  position: fixed;
  left: 0;
  width: 100%;
  height: 100%;
  visibility: hidden;
  opacity: 0;
  transition: all 1s ease;
  background-color: rgba(0, 0, 0);
  z-index: 45;
  overflow-y: auto;
}

.noScroll {
  overflow: hidden;
}
</style>
<template>
  <div @click="closeNav" ref="overlay" id="overlay"></div>

  <header ref="mainHead" class="flex justify-between items-center gap-5 z-40 p-5 bg-zinc-700 text-zinc-200">

    <div class="block cursor-pointer ">
      <div  @click="openNav" id="mobile-menu-button" class="group">
        <div
            class="top-0 transition-all group-open:rotate-45 bg-zinc-200 rounded-full w-8 h-1 group-open:top-2 relative"></div>
        <div class="transition-all opacity-100 group-open:opacity-0 bg-zinc-200 rounded-full w-8 h-1 mt-1"></div>
        <div
            class="top-0 transition-all group-open:-rotate-45 bg-zinc-200 rounded-full w-8 h-1 mt-1 group-open:-top-2 relative"></div>
      </div>
    </div>
    <div class="overflow-hidden">
     Welcome, {{user?.user_metadata?.login}}
    </div>

  </header>

  <div ref="sideNav" class="sidenav text-zinc-300 ">
    <span title="log out"  class="cursor-pointer loginbtn mt-1" @click.prevent="logOut">
      <Icon name="grommet-icons:logout"
            size="20"/>
    </span>
    <span title="close" class="closebtn  cursor-pointer" @click.prevent="closeNav">
      <Icon name="material-symbols:close"
            size="20"/>
    </span>

    <ul class="list-items">
      <li>
        <NuxtLink to="/admin">
          Home
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/admin/posts">
          News
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/admin/about">
          About
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/admin/tracks">
          Demo tracks
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/admin/releases">
          Releases
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/admin/heroes">
          Members
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/admin/users">
          Users
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/">
          To the site
        </NuxtLink>
      </li>
    </ul>

  </div>
</template>

<script lang="ts" setup>
const user = useSupabaseUser();

const { auth } = useSupabaseClient();

const route = useRoute();

const router = useRouter();

const showOverlay = ref<boolean>(false);

const sideNav = ref<HTMLElement>();

const overlay = ref<HTMLElement>();

function openNav(): void {
  showOverlay.value = true;
  if(sideNav.value){
    sideNav.value.style.left = "0px";
  }
  if(overlay.value){
    overlay.value.style.visibility = "visible";
    overlay.value.style.opacity = "0.5";
  }
}

function closeNav(): void {
  showOverlay.value = false;
  if(sideNav.value){
    sideNav.value.style.left = "-250px";
  }
  if(overlay.value){
    overlay.value.style.opacity = "0";
    overlay.value.style.visibility = "hidden";
  }
}

async function logOut(): Promise<void> {

  closeNav();

  await auth.signOut();

  router.replace('/');
}

watch(route, () => {
  closeNav();
})

</script>


<style lang="scss" scoped>

#overlay {
  position: fixed;
  left: 0;
  width: 100%;
  height: 100%;
  visibility: hidden;
  opacity: 0;
  transition: all .5s ease;
  background-color: rgba(0, 0, 0);
  z-index: 1;
  overflow-y: auto;
}

.userData {
  color: #f8fafc;
  font-style: italic
}

.list-items {
  padding: 0;
  margin: 0;
  position: relative;
  //background: #404040;
  width: 100%;
  height: 100%;
  list-style: none;

  li {
    //padding-left: 10px;
    line-height: 50px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    border-bottom: 1px solid #333;
    transition: all 0.3s ease;


    &:first-child {
      border-top: none;
    }

    a {
      color: #f2f2f2;
      text-decoration: none;
      font-size: 18px;
      font-weight: 500;
      height: 100%;
      width: 100%;
      display: block;
    }
  }
}

.sidenav {

  li{
    &:hover {
      background: #404040;
    }
  }

  overflow: hidden;

  @media screen and (max-height: 800px) {
    overflow: scroll;
  }


  font-size: 16px;
  width: 250px;
  height: 100%;
  left: -250px;
  //width: 0;
  position: fixed;
  z-index: 1;
  top: 0;
  //left: 0;
  background-color: #111;
  overflow-x: hidden;
  transition: 0.5s;
  padding-top: 60px;

  a {
    padding: 8px 8px 8px 32px;
    text-decoration: none;
    color: #f1f1f1;
    //color: #818181;
    display: block;
    transition: 0.3s;
  }

  a:hover, .closebtn:hover, .loginbtn:hover {
    color: #818181;
    transition: 0.3s;
  }

  .closebtn {
    position: absolute;
    top: 0;
    right: 5px;
    //font-size: 36px;
   // margin-left: 50px;
  }

  .loginbtn {
    position: absolute;
    top: 0;
    left: 10px;
    //font-size: 36px;
    //margin-left: 50px;
  }

}


</style>
<template>
  <div class="flex py-3 justify-between">
    <div class="flex items-center sticky left-0">
      <div v-if="route.fullPath != '/'" class="ml-3">
        <span
          v-html="_icon('caret-left-fill', 'rgb(51 65 85)', 40)"
          class="cursor-pointer hover:brightness-125"
          :title="_local(['common', 'backHome'])"
          @click="navigateTo('/')"
        ></span>
      </div>

      <div class="flex items-center sticky left-0 ml-3" v-if="event">
        <div class="p-1 rounded-full mr-3 flex-shrink-0">
          <img
            :src="event.logo ? event.logo : '/kwarts_logo_mini.png'"
            class="w-12 rounded"
          />
        </div>
        <span class="text-xl font-semibold text-slate-700">
          {{ event.name }}
        </span>
      </div>

      <div class="flex items-center sticky left-0 ml-3" v-else>
        <div class="p-1 rounded-full mr-3 flex-shrink-0">
          <img :src="'/kwarts_logo_mini.png'" class="w-12 rounded" />
        </div>
        <span class="text-xl font-semibold text-slate-700"> Kwarts </span>
      </div>
    </div>

    <div
      class="pr-6 flex items-center sticky right-0 cursor-pointer"
      @mouseenter="toggleMenu = true"
      @mouseleave="toggleMenu = false"
    >
      <span v-html="_icon('person', 'rgb(51 65 85)', 18)" class="mr-1"></span>

      {{ email }}

      <span
        v-html="_icon('caret-down-fill', 'rgb(51 65 85)', 18)"
        class="ml-3 relative"
        style="top: 2px"
      ></span>
    </div>
  </div>

  <div
    class="absolute right-6 top-16 bg-white w-72 rounded border border-slate-300"
    v-show="toggleMenu"
    @mouseenter="toggleMenu = true"
    @mouseleave="toggleMenu = false"
  >
    <div
      class="text-slate-500 hover:opacity-70 w-full p-3 cursor-pointer flex border-b border-b-slate-300"
    >
      <span v-html="_icon('key', 'rgb(51 65 85)', 24)" class="mr-3"></span>

      {{ _local(['common', 'updatePassword']) }}
    </div>

    <div
      @click="logout()"
      class="text-slate-500 hover:opacity-70 w-full p-3 cursor-pointer flex"
    >
      <span
        v-html="_icon('box-arrow-left', 'rgb(51 65 85)', 24)"
        class="mr-3"
      ></span>

      {{ _local(['common', 'signout']) }}
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const toggleMenu = ref(false)

defineProps<{
  event?: Event
  likes?: number
}>()

const isUserLogged = String(useCookie('userLogged').value)
const email = useCookie('email').value
</script>

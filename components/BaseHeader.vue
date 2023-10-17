<template>
  <div class="flex py-3 justify-between">
    <div class="flex items-center sticky left-0">
      <div v-if="route.fullPath != '/'" class="mx-3">
        <span
          v-html="_icon('caret-left-fill', 'rgb(51 65 85)', 40)"
          class="cursor-pointer hover:brightness-125"
          :title="_local(['common', 'backHome'])"
          @click="navigateTo('/')"
        ></span>
      </div>

      <div class="flex items-center sticky left-0" v-if="event">
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

      <div class="flex items-center sticky left-0" v-else>
        <div class="p-1 rounded-full mr-3 flex-shrink-0">
          <img :src="'/kwarts_logo_mini.png'" class="w-12 rounded" />
        </div>
        <span class="text-xl font-semibold text-slate-700"> Kwarts </span>
      </div>
    </div>

    <div class="pr-6 flex items-center sticky right-0">
      <button
        @click="logout()"
        class="text-slate-500 hover:text-slate-400 ml-3"
      >
        {{ _local(['common', 'signout']) }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

defineProps<{
  event?: Event
  likes?: number
}>()

const isUserLogged = String(useCookie('userLogged').value)
</script>

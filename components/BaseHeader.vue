<template>
  <div class="flex pl-3 py-3 justify-between">
    <div class="flex items-center">
      <div v-if="isUserLogged == 'true'" class="mr-3">
        <span
          v-html="_icon('caret-left-square-fill', _color.pick('blue'), 40)"
          class="cursor-pointer hover:brightness-125"
          :title="_local(['common', 'summary'])"
          @click="navigateTo('/')"
        ></span>
      </div>

      <div class="flex items-center">
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
    </div>

    <div class="px-6 flex items-center">
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
defineProps<{
  event: Event
  likes?: number
}>()

const isUserLogged = String(useCookie('userLogged').value)
</script>

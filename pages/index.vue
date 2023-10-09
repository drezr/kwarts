<template>
  <div v-if="loading == false">
    <div v-for="userLink in requestedUserLinks">
      <NuxtLink :to="`/event/${userLink.event.slug}`">{{
        userLink.event.name
      }}</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const loading = ref(true)
useHead({
  link: [{ rel: 'icon', type: 'image/png', href: '/kwarts_logo_mini.png' }],
})

const loggedUserId = useCookie<Number>('userId')

if (!loggedUserId.value) logout()

let requestedUserLinks = await _fetch('/api/getUserLinks', {})

loading.value = false
</script>

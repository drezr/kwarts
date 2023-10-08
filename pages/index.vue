<template>
  <div v-if="loading == false">
    <div v-for="userLink in requestedUserLinks">
      {{ userLink.event.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
const loading = ref(true)
useHead({
  link: [{ rel: 'icon', type: 'image/png', href: '/kwarts_logo_mini.png' }],
})

const loggedUserId = useCookie<Number>('userId')
const loggedUserToken = useCookie<Number>('token')

let requestedUserLinks = await _fetch('/api/getUserLinks', {})

loading.value = false
</script>

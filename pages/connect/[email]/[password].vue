<template></template>

<script setup lang="ts">
useHead({
  titleTemplate: 'Tentative de connexion...',
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/kwarts_logo_mini.png',
    },
  ],
})

const route = useRoute()

const email = route.params.email
const password = route.params.password

const request = await _fetch('/api/tryConnect', {
  email: email,
  password: password,
})

if (request?.eventId) {
  useCookie('userId').value = request.user.id
  useCookie('token').value = request.token
  useCookie('eventId').value = request.eventId

  useState<User>('loggedUser', () => request.user)

  navigateTo('/event/' + request.eventSlug)
} else {
  navigateTo('/')
}
</script>

<style></style>

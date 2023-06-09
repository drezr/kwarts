<template>
  <div>
    <div v-for="(userLink, i) in event.userLinks"
      class="p-2 border-l border-r first:border-t last:border-b border-slate-200 w-96" :class="{ 'bg-slate-100': i % 2 }">
      <img v-if="userLink.nationality" :src="`https://flagcdn.com/h20/${userLink.nationality}.png`"
        class="inline mr-2 relative" style="top: -2px;">
      <span class="font-bold mr-2">{{ userLink.alias }}</span>
      <span v-if="userLink.elo">({{ userLink.elo }})</span>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

const route = useRoute()

const slug = route.params.slug

let requestedEvent = await _fetch('/api/getListingBySlug', {
  slug: slug,
})

if (!requestedEvent) logout()

const title = requestedEvent.title
  ? requestedEvent.title
  : requestedEvent.name
    ? requestedEvent.name
    : 'Kwarts'

useHead({
  titleTemplate: title,
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: requestedEvent.icon ? requestedEvent.icon : '/kwarts_logo_mini.png',
    },
  ],
})

let event = ref<Event>(requestedEvent)

event.value.userLinks.sort(
  (x: EventUser, y: EventUser) => {

    if (x.elo && !y.elo) {
      return -1
    }

    else if (!x.elo && y.elo) {
      return 1
    }

    else if (x.elo && y.elo) {
      if (!isNaN(Number(x.elo)) && !isNaN(Number(y.elo))) {
        return Number(y.elo) - Number(x.elo)
      }


      else if (!isNaN(Number(x.elo)) && isNaN(Number(y.elo))) {
        return -1
      }

      else if (isNaN(Number(x.elo)) && !isNaN(Number(y.elo))) {
        return 1
      }

      else if (isNaN(Number(x.elo)) && isNaN(Number(y.elo))) {
        if (x.elo == y.elo) {
          return x.alias.localeCompare(y.alias)
        }

        return x.elo.localeCompare(y.elo)
      }
    }

    return x.alias.localeCompare(y.alias)
  }
)

</script>

<style></style>

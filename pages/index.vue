<template>
  <BaseHeader />

  <div v-if="loading == false">
    <div class="flex justify-center">
      <div
        class="flex flex-col justify-center"
        style="width: 500px; min-height: calc(100vh - 200px)"
      >
        <div class="text-xl font-bold text-center mt-6 mb-1 text-slate-700">
          {{ _local(['common', 'ongoingEvents']) }}
        </div>

        <div v-for="userLink in ongoingEvents">
          <NuxtLink
            :to="`/event/${userLink.event.slug}`"
            class="flex items-center border border-slate-400 m-1 p-3 rounded hover:bg-slate-100 bg-slate-200"
          >
            <div class="w-16">
              <img
                :src="
                  userLink.event.logo
                    ? userLink.event.logo
                    : '/kwarts_logo_mini.png'
                "
                class="h-10"
              />
            </div>
            <span class="ml-2 text-slate-800">
              {{
                userLink.event.title
                  ? userLink.event.title
                  : userLink.event.name
              }}
            </span>
          </NuxtLink>
        </div>

        <div class="text-xl font-bold text-center mt-6 mb-1 text-slate-700">
          {{ _local(['common', 'endedEvents']) }}
        </div>

        <div v-for="userLink in endedEvents">
          <NuxtLink
            :to="`/event/${userLink.event.slug}`"
            class="flex items-center border border-slate-400 m-1 p-3 rounded hover:bg-slate-100 bg-slate-200"
          >
            <div class="w-16">
              <img
                :src="
                  userLink.event.logo
                    ? userLink.event.logo
                    : '/kwarts_logo_mini.png'
                "
                class="h-10"
              />
            </div>
            <span class="ml-2 text-slate-800">
              {{
                userLink.event.title
                  ? userLink.event.title
                  : userLink.event.name
              }}
            </span>
          </NuxtLink>
        </div>
      </div>
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

const ongoingEvents = requestedUserLinks.filter(
  (ul: EventUser) => !ul.event.hasEnded,
)
const endedEvents = requestedUserLinks.filter(
  (ul: EventUser) => ul.event.hasEnded,
)

loading.value = false
</script>

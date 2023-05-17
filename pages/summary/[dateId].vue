<template>
  <BaseHeader :event="date.event" />

  <div class="mt-4 text-xl text-center">
    <NuxtLink
      :to="`/availability/${date.event.slug}`"
      class="mr-4 bg-slate-700 hover:bg-slate-600 text-white text-sm py-1 px-2 rounded inline-flex items-center relative"
      style="top: 2px"
    >
      <span v-html="_icon('caret-left-fill', 'white', 18)" class="mr-1"></span>
      {{ _local(['common', 'backToTheEvent']) }}
    </NuxtLink>

    <b>
      {{ date.title ? `${date.title} -` : '' }}
      {{ _date.formatDatetime(String(date.date)) }}
    </b>
  </div>

  <div class="flex justify-center mt-6 pb-6">
    <div class="bg-white shadow-md rounded-lg flex w-fit overflow-hidden">
      <div class="bg-green-50">
        <div
          class="px-6 py-2 border-b bg-green-700 text-white flex items-center font-bold"
        >
          <span
            v-html="_icon('check-circle-fill', 'white', 24)"
            class="mr-3"
          ></span>

          {{ _local(['common', 'availables']) }} ({{ availables.length }})
        </div>

        <div v-for="available in availables" class="px-6 py-2 border-b">
          {{ available.alias }}
        </div>
      </div>

      <div class="border-l border-r bg-red-50">
        <div
          class="px-6 py-2 border-b bg-red-700 text-white flex items-center font-bold"
        >
          <span
            v-html="_icon('x-circle-fill', 'white', 24)"
            class="mr-3"
          ></span>

          {{ _local(['common', 'notAvailables']) }} ({{ notAvailables.length }})
        </div>

        <div v-for="notAvailable in notAvailables" class="px-6 py-2 border-b">
          {{ notAvailable.alias }}
        </div>
      </div>

      <div class="bg-slate-50">
        <div
          class="px-6 py-2 border-b bg-slate-700 text-white flex items-center font-bold"
        >
          <span
            v-html="_icon('question-circle-fill', 'white', 24)"
            class="mr-3"
          ></span>

          {{ _local(['common', 'unknowns']) }} ({{ unknowns.length }})
        </div>

        <div v-for="unknown in unknowns" class="px-6 py-2 border-b">
          {{ unknown.alias }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const loggedUserId = useCookie<Number>('userId')
const dateId: Number = Number(route.params.dateId)

const date: Date = await _fetch('/api/getDateSummary', {
  dateId: dateId,
})

if (!date) logout()

useHead({
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: date.event.icon ? date.event.icon : '/kwarts_logo_mini.png',
    },
  ],
})

let mergedData = []

for (const userLink of date.event.userLinks) {
  const availability = date.availabilities.find(
    (a: Availability) => a.userId == userLink.userId
  )

  mergedData.push({ ...userLink, ...availability })
}

let availables = mergedData.filter(
  (md) => md.isAvailable == true && !md.isHidden
)
let notAvailables = mergedData.filter(
  (md) => md.isAvailable == false && !md.isHidden
)
let unknowns = mergedData.filter(
  (md) => md.isAvailable == undefined && !md.isHidden
)

availables.sort((a, b) => a.alias.localeCompare(b.alias))
notAvailables.sort((a, b) => a.alias.localeCompare(b.alias))
unknowns.sort((a, b) => a.alias.localeCompare(b.alias))
</script>

<style></style>

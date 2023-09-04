<template>
  <BaseHeader :event="date.event" />

  <div class="mt-4 text-xl text-center">
    <NuxtLink
      :to="`/event/${date.event.slug}`"
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

  <div class="flex justify-center mt-6">
    <div
      class="bg-white shadow-md rounded-lg flex flex-wrap w-fit overflow-hidden"
    >
      <div
        v-for="group in date.groups"
        class="border-l"
        style="min-width: 300px"
      >
        <div
          class="px-6 py-2 border-b bg-blue-700 text-white flex items-center font-bold"
        >
          <span v-html="_icon('people-fill', 'white', 24)" class="mr-3"></span>

          {{ group.name }}
        </div>

        <div
          v-for="groupUser in group.groupUsers"
          class="px-6 py-2 border-b flex items-center"
        >
          {{ groupUser.userLink.alias }}

          <span
            v-if="mergedData.find((u: any) => u.userId == groupUser.userLink.user.id)?.isMotorized && date.event.showIsMotorized"
            v-html="_icon('car-front-fill', _color.pick('blue'), 20)"
            class="ml-2"
          ></span>
        </div>
      </div>
    </div>
  </div>

  <div class="flex justify-center mt-6 pb-6">
    <div class="bg-white shadow-md rounded-lg flex flex-wrap overflow-hidden">
      <div class="bg-green-50" style="min-width: 300px">
        <div
          class="px-6 py-2 border-b bg-green-700 text-white flex items-center font-bold"
        >
          <span
            v-html="_icon('check-circle-fill', 'white', 24)"
            class="mr-3"
          ></span>

          {{ _local(['common', 'availables']) }} ({{ availables.length }})
        </div>

        <div
          v-for="available in availables"
          class="px-6 py-2 border-b flex items-center"
        >
          {{ available.alias }}

          <span
            v-if="available.isMotorized && date.event.showIsMotorized"
            v-html="_icon('car-front-fill', _color.pick('blue'), 20)"
            class="ml-2"
          ></span>
        </div>
      </div>

      <div class="border-l border-r bg-red-50" style="min-width: 300px">
        <div
          class="px-6 py-2 border-b bg-red-700 text-white flex items-center font-bold"
        >
          <span
            v-html="_icon('x-circle-fill', 'white', 24)"
            class="mr-3"
          ></span>

          {{ _local(['common', 'notAvailables']) }} ({{ notAvailables.length }})
        </div>

        <div
          v-for="notAvailable in notAvailables"
          class="px-6 py-2 border-b flex items-center"
        >
          {{ notAvailable.alias }}

          <span
            v-if="notAvailable.isMotorized && date.event.showIsMotorized"
            v-html="_icon('car-front-fill', _color.pick('blue'), 20)"
            class="ml-2"
          ></span>
        </div>
      </div>

      <div class="bg-slate-50" style="min-width: 300px">
        <div
          class="px-6 py-2 border-b bg-slate-700 text-white flex items-center font-bold"
        >
          <span
            v-html="_icon('question-circle-fill', 'white', 24)"
            class="mr-3"
          ></span>

          {{ _local(['common', 'unknowns']) }} ({{ unknowns.length }})
        </div>

        <div
          v-for="unknown in unknowns"
          class="px-6 py-2 border-b flex items-center"
        >
          {{ unknown.alias }}

          <span
            v-if="unknown.isMotorized && date.event.showIsMotorized"
            v-html="_icon('car-front-fill', _color.pick('blue'), 20)"
            class="ml-2"
          ></span>
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

let mergedData = ref<any[]>([])

for (const userLink of date.event.userLinks) {
  const availability = date.availabilities.find(
    (a: Availability) => a.userId == userLink.userId
  )

  mergedData.value.push({ ...userLink, ...availability })
}

let availables = mergedData.value.filter(
  (md) => md.isAvailable == true && !md.isHidden
)
let notAvailables = mergedData.value.filter(
  (md) => md.isAvailable == false && !md.isHidden
)
let unknowns = mergedData.value.filter(
  (md) => md.isAvailable == undefined && !md.isHidden
)

availables.sort((a, b) => a.alias.localeCompare(b.alias))
notAvailables.sort((a, b) => a.alias.localeCompare(b.alias))
unknowns.sort((a, b) => a.alias.localeCompare(b.alias))

for (let group of date.groups) {
  group.groupUsers.sort((a: GroupUser, b: GroupUser) => a.position - b.position)
}
</script>

<style></style>

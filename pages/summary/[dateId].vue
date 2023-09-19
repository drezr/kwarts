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
        style="min-width: 250px"
        :class="[
          { 'bg-green-100': group.isValidated },
          { 'bg-orange-100': !group.isValidated },
        ]"
      >
        <div class="px-3 py-2 border-b bg-blue-700 text-white font-bold">
          <div class="flex items-center">
            <span
              v-html="_icon('people-fill', 'white', 24)"
              class="mr-3"
            ></span>

            {{ group.name }}
          </div>

          <div
            v-if="group.versus"
            class="text-sm text-blue-800 bg-blue-50 rounded px-1 mt-1 font-bold"
          >
            {{ group.versus }}
          </div>

          <div
            v-if="group.address"
            class="text-sm text-blue-800 bg-blue-50 rounded px-1 mt-1 font-normal cursor-pointer hover:bg-white flex items-center"
            @click="openMap(group)"
          >
            <span
              v-html="_icon('geo-alt-fill', 'rgb(30 64 175)', 24)"
              class="mr-1"
            ></span>

            <div class="whitespace-pre-line">
              {{ group.address }}
            </div>
          </div>
        </div>

        <div
          v-for="(groupUser, i) in group.groupUsers"
          class="px-6 py-1 border-b flex items-center cursor-pointer justify-between"
          :class="[
            { 'hover:bg-green-50': group.isValidated },
            { 'hover:bg-orange-50': !group.isValidated },
          ]"
          @click="
            userInfoDialog.showModal(), (selectedUserInfo = groupUser.userLink)
          "
        >
          <div class="mr-2">
            <div>{{ i + 1 }}. {{ groupUser.userLink.alias }}</div>

            <div style="margin-top: -8px">
              <small v-if="groupUser.userLink.elo">
                {{ _local(['common', 'elo']) }}: {{ groupUser.userLink.elo }}
              </small>

              <small
                v-if="groupUser.userLink.elo && groupUser.userLink.fideid"
                class="mx-1"
              >
                -
              </small>

              <small v-if="groupUser.userLink.fideid">
                {{ _local(['common', 'fideid']) }}:
                {{ groupUser.userLink.fideid }}
              </small>
            </div>
          </div>

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

  <dialog
    ref="userInfoDialog"
    @mousedown="closeDialog($event, userInfoDialog)"
    style="width: 400px"
  >
    <div v-if="selectedUserInfo" class="text-center">
      <div class="text-xl flex font-bold mb-8 justify-center">
        <span v-html="_icon('person-fill', 'black', 28)" class="mr-2"></span>

        {{ selectedUserInfo.alias }}
      </div>

      <div class="mb-6">
        <div class="flex justify-center mb-2">
          <span v-html="_icon('telephone', 'black', 20)" class="mr-2"></span>

          <b class="mr-2">{{ _local(['common', 'phone']) }} :</b>
        </div>

        <div v-if="selectedUserInfo.phone" class="flex justify-center">
          <a
            v-if="selectedUserInfo.phone"
            :href="`tel:${selectedUserInfo.phone}`"
            class="text-blue-600 text-xl hover:opacity-80"
            >{{ selectedUserInfo.phone }}</a
          >

          <span
            v-html="_icon('clipboard', 'rgba(37, 99, 235, 0.8)', 26)"
            class="ml-3 cursor-pointer hover:opacity-60"
            :title="_local(['common', 'copyToClipBoard'])"
            @click="copyToClipboard(selectedUserInfo.phone)"
          ></span>
        </div>

        <div v-else>?</div>
      </div>

      <div>
        <div class="flex justify-center mb-2">
          <span v-html="_icon('envelope-at', 'black', 20)" class="mr-2"></span>

          <b class="mr-2">{{ _local(['common', 'email']) }} :</b>
        </div>

        <div v-if="selectedUserInfo.user.email" class="flex justify-center">
          <a
            :href="`mailto:${selectedUserInfo.user.email}`"
            class="text-blue-600 text-lg hover:opacity-80"
            >{{ selectedUserInfo.user.email }}</a
          >

          <span
            v-html="_icon('clipboard', 'rgba(37, 99, 235, 0.8)', 26)"
            class="ml-3 cursor-pointer hover:opacity-60"
            :title="_local(['common', 'copyToClipBoard'])"
            @click="copyToClipboard(selectedUserInfo.user.email)"
          ></span>
        </div>

        <div v-else>?</div>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
const route = useRoute()

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

const userInfoDialog = ref()
const selectedUserInfo = ref()
let mergedData = ref<any[]>([])

for (const userLink of date.event.userLinks) {
  const availability = date.availabilities.find(
    (a: Availability) => a.userId == userLink.userId,
  )

  mergedData.value.push({ ...userLink, ...availability })
}

let availables = mergedData.value.filter(
  (md) => md.isAvailable == true && !md.isHidden,
)
let notAvailables = mergedData.value.filter(
  (md) => md.isAvailable == false && !md.isHidden,
)
let unknowns = mergedData.value.filter(
  (md) => md.isAvailable == undefined && !md.isHidden,
)

availables.sort((a, b) => a.alias.localeCompare(b.alias))
notAvailables.sort((a, b) => a.alias.localeCompare(b.alias))
unknowns.sort((a, b) => a.alias.localeCompare(b.alias))

date.groups.sort((a: Group, b: Group) => a.position - b.position)

for (let group of date.groups) {
  group.groupUsers.sort((a: GroupUser, b: GroupUser) => a.position - b.position)
}

function copyToClipboard(str: string) {
  navigator.clipboard.writeText(str)

  alert(_local(['common', 'textCopiedToClipboard']))
}

function openMap(group: Group) {
  window.open(`http://maps.google.com/?q=${group.address?.replace('\n', ' ')}`)
}
</script>

<style></style>

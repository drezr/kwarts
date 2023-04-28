<template>
  <div class="bg-gradient-to-b from-slate-200">
    <div class="flex pl-3 py-3 justify-between">
      <div class="flex items-center">
        <div class="p-1 rounded-full mr-3">
          <img src="/kwarts_logo_mini.png" class="w-12" />
        </div>
        <span class="text-xl font-semibold text-slate-700">
          {{ event.name }}
        </span>
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

    <div class="flex w-full justify-center" style="height: calc(100vh - 81px)">
      <div class="mx-auto overflow-x-auto h-full">
        <div class="flex py-6">
          <div class="flex flex-col items-center">
            <span
              v-if="isOwner"
              v-html="_icon('gear-fill', _color.pick('blue'), 24)"
              class="mb-1 cursor-pointer hover:brightness-110"
              @click="toggleModal()"
            ></span>
            <div
              v-for="userLink in event.userLinks"
              class="opacity-90 w-36 px-1 rounded-md text-slate-950 bg-slate-100 shadow-lg ring-1 ring-black ring-opacity-5 my-1 mx-2 flex items-center justify-center font-semibold text-center"
              :class="{ 'mb-4': userLink.userId == loggedUserId }"
              style="height: 81px"
            >
              {{ userLink.alias }}
            </div>
          </div>

          <div class="flex mx-auto">
            <div v-for="date in event.dates" class="flex flex-col items-center">
              <span
                v-if="isOwner"
                v-html="
                  _icon(
                    date.isLocked ? 'lock-fill' : 'unlock-fill',
                    date.isLocked
                      ? _color.pick('orange')
                      : _color.pick('green'),
                    24
                  )
                "
                class="mb-1 cursor-pointer hover:brightness-110"
                @click="lockDate(date)"
              ></span>

              <div
                v-for="userLink in event.userLinks"
                class="w-24 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 my-1 mx-2"
                :class="{
                  'mb-4': userLink.userId == loggedUserId,
                  'bg-blue-50': userLink.userId != loggedUserId && !isOwner,
                  'opacity-30': date.isLocked,
                  'pointer-events-none':
                    date.isLocked ||
                    (userLink.userId != loggedUserId && !isOwner),
                }"
              >
                <div class="divide-y">
                  <div
                    class="text-slate-900 text-sm flex items-center justify-center overflow-hidden"
                  >
                    <span
                      class="h-10 text-center inline-flex flex-col justify-center font-bold"
                    >
                      <span
                        v-if="date.title"
                        class="text-slate-600 font-semibold whitespace-nowrap"
                      >
                        <small>{{ date.title }}</small>
                      </span>

                      <span
                        class="relative"
                        :class="[{ 'bottom-1': date.title }]"
                      >
                        {{ _date.formatDatetime(String(date.date)) }}
                      </span>
                    </span>
                  </div>

                  <div
                    class="flex divide-x"
                    v-if="
                      (userLink.userId == loggedUserId || isOwner) &&
                      !date.isLocked
                    "
                  >
                    <div
                      class="grow flex items-center justify-center py-2 cursor-pointer hover:animate-pulse"
                      @click="setAivalability(date, userLink, true)"
                    >
                      <span
                        v-html="selectAvailabilityIcon('on', date, userLink)"
                      ></span>
                    </div>

                    <div
                      class="grow flex items-center justify-center py-2 cursor-pointer hover:animate-pulse"
                      @click="setAivalability(date, userLink, false)"
                    >
                      <span
                        v-html="selectAvailabilityIcon('off', date, userLink)"
                      ></span>
                    </div>
                  </div>

                  <div v-else>
                    <div class="grow flex items-center justify-center py-2">
                      <span
                        v-html="
                          selectAvailabilityIcon('unknown', date, userLink)
                        "
                      ></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <transition name="fade" v-if="isOwner">
      <div v-show="showModal" class="fixed inset-0 z-30">
        <div
          v-show="showModal"
          @click="toggleModal()"
          class="bg-filter bg-black opacity-50 fixed inset-0 w-full h-full z-20"
        ></div>

        <main class="flex flex-col items-center justify-center h-full w-full">
          <transition name="fade-up-down">
            <div
              v-show="showModal"
              class="inline-block items-center z-30 w-full"
            >
              <div
                class="modal max-w-md mx-auto xl:max-w-xl lg:max-w-xl md:max-w-xl bg-white max-h-screen shadow-lg flex-row rounded relative"
              >
                <div class="p-5 rounded-t flex justify-between">
                  <div class="text-slate-800 text-2xl flex items-center">
                    <span
                      v-html="_icon('gear-fill', _color.pick('blue'), 24)"
                      class="mr-3 relative"
                      style="top: 2px"
                    ></span>

                    {{ _local(['common', 'eventConfig']) }}
                  </div>

                  <span
                    v-html="_icon('x-lg', _color.pick('grey'), 24)"
                    class="cursor-pointer hover:brightness-110 ml-3"
                    @click="toggleModal()"
                  ></span>
                </div>

                <nav class="bg-slate-800 flex justify-center py-1 flex-wrap">
                  <span
                    class="text-white rounded-md px-3 py-2 text-sm font-medium cursor-pointer flex"
                    :class="{ 'bg-slate-900': modalTab == 'general' }"
                    @click="modalTab = 'general'"
                  >
                    <span
                      v-html="_icon('sliders', 'white', 16)"
                      class="mr-2 relative"
                      style="top: 2px"
                    ></span>

                    {{ _local(['common', 'general']) }}
                  </span>

                  <span
                    class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium cursor-pointer flex"
                    :class="{ 'bg-slate-900': modalTab == 'dates' }"
                    @click="modalTab = 'dates'"
                  >
                    <span
                      v-html="_icon('calendar3', 'white', 16)"
                      class="mr-2 relative"
                      style="top: 2px"
                    ></span>

                    {{ _local(['common', 'dates']) }}
                  </span>

                  <span
                    class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium cursor-pointer flex"
                    :class="{ 'bg-slate-900': modalTab == 'people' }"
                    @click="modalTab = 'people'"
                  >
                    <span
                      v-html="_icon('people', 'white', 16)"
                      class="mr-2 relative"
                      style="top: 2px"
                    ></span>

                    {{ _local(['common', 'people']) }}
                  </span>
                </nav>

                <div
                  class="modal-body p-5 w-full h-full overflow-y-auto"
                  v-show="modalTab == 'general'"
                >
                  <label
                    for="eventName"
                    class="block text-sm font-medium leading-6 text-gray-900"
                  >
                    {{ _local(['common', 'eventName']) }}
                  </label>

                  <div class="mt-2 flex items-center">
                    <input
                      v-model="eventName"
                      name="eventName"
                      class="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />

                    <span
                      v-html="
                        _icon(
                          'check-square-fill',
                          _color.pick(
                            eventName == event.name ? 'grey' : 'green'
                          ),
                          36
                        )
                      "
                      class="cursor-pointer hover:brightness-110 ml-3"
                      :class="{
                        'pointer-events-none': eventName == event.name,
                      }"
                      @click="updateEventName()"
                    ></span>
                  </div>
                </div>

                <div
                  class="modal-body p-5 w-full h-full overflow-y-auto"
                  v-show="modalTab == 'dates'"
                >
                  <draggable
                    v-model="event.dates"
                    @start="dragging = true"
                    @end="dragging = false"
                    handle=".handle"
                    item-key="id"
                    v-bind="{
                      animation: 200,
                      group: 'description',
                      disabled: false,
                      ghostClass: 'ghost',
                    }"
                  >
                    <template #item="{ element }">
                      <div class="mb-3 flex items-center">
                        <span
                          v-html="
                            _icon('grip-horizontal', _color.pick('pink'), 16)
                          "
                          class="cursor-grab hover:brightness-110 mr-2 handle"
                        ></span>

                        <div class="flex flex-grow flex-wrap">
                          <input
                            type="text"
                            v-model="element.title"
                            class="flex-grow mb-1 mx-1 block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            :placeholder="_local(['common', 'title'])"
                            maxlength="18"
                            style="height: 38px"
                          />

                          <VueDatePicker
                            v-model="element.date"
                            class="flex-grow mx-1"
                            :format="_date.formatDatetime(element.date)"
                            locale="fr"
                            teleport-center
                            auto-apply
                            placeholder="Select Date"
                            :enable-time-picker="false"
                            month-name-format="long"
                            style="width: 30%; min-width: 150px"
                            menu-class-name="dp-custom-menu"
                          ></VueDatePicker>
                        </div>
                      </div>
                    </template>
                  </draggable>
                </div>

                <div
                  class="modal-body p-5 w-full h-full overflow-y-auto"
                  v-show="modalTab == 'people'"
                >
                  <p class="text-justify">
                    PEOPLE cilis omnis nam illum maiores, porro velit deserunt
                    neque. Lorem ipsum dolor, sit amet consectetur adipisicing
                    elit. Esse, voluptates eveniet labore dolorum molestiae,
                    modi saepe fugiat minima repudiandae repellendus obcaecati
                    voluptatibus ab tenetur recusandae eius quos at maiores
                    atque consectetur facilis! Nisi fuga
                  </p>
                </div>
              </div>
            </div>
          </transition>
        </main>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const route = useRoute()

const loggedUserId = useCookie('userId')
const eventId = Number(route.params.eventId)

let event = await _fetch('/api/getEvent', {
  eventId: eventId,
})

if (!event) {
  logout()
}

event.userLinks.sort((a: EventUser, b: EventUser) => a.position - b.position)

const loggedUserLink = event.userLinks.find(
  (ul: any) => ul.userId == loggedUserId.value
)

event.userLinks = event.userLinks.filter((ul: any) => ul != loggedUserLink)
event.userLinks.unshift(loggedUserLink)

const isOwner = ref(event.ownerId == useCookie('userId').value)
event = ref(event)
let dragging = ref(false)
let showModal = ref(false)
let modalTab = ref('general')
let eventName = ref(event.value.name)

function selectAvailabilityIcon(
  status: string,
  date: Date,
  userLink: EventUser
) {
  const availability = date.availabilities.find(
    (a: Availability) => a.userId == userLink.userId
  )

  if (status == 'on') {
    if (availability && availability.isAvailable) {
      return _icon('check-circle-fill', 'green', 24)
    } else {
      return _icon('check-circle', 'grey', 24)
    }
  } else if (status == 'off') {
    if (availability && !availability.isAvailable) {
      return _icon('x-circle-fill', 'red', 24)
    } else {
      return _icon('x-circle', 'grey', 24)
    }
  } else if (status == 'unknown') {
    if (availability && !availability.isAvailable) {
      return _icon('x-circle-fill', 'red', 24)
    } else if (availability && availability.isAvailable) {
      return _icon('check-circle-fill', 'green', 24)
    } else {
      return _icon('question-circle', 'grey', 24)
    }
  }
}

async function setAivalability(
  date: Date,
  userLink: EventUser,
  isAvailable: boolean
) {
  const availability = date.availabilities.find(
    (a: Availability) => a.userId == userLink.userId
  )

  if (availability) {
    availability.isAvailable = isAvailable

    const newAvailability: Availability = await _fetch(
      '/api/updateAvailability',
      {
        isAvailable: isAvailable,
        availabilityId: availability.id,
        userId: userLink.userId,
      }
    )
  } else {
    // Request new availabilty

    const newAvailability: Availability = await _fetch(
      '/api/createAvailability',
      {
        isAvailable: isAvailable,
        dateId: date.id,
        userId: userLink.userId,
      }
    )

    date.availabilities.push(newAvailability)
  }
}

async function lockDate(date: Date) {
  date.isLocked = !date.isLocked

  await _fetch('/api/lockDate', {
    isLocked: date.isLocked,
    dateId: date.id,
  })
}

async function logout() {
  useCookie('userId').value = null
  useCookie('token').value = null
  useCookie('eventId').value = null

  navigateTo('/')
}

function toggleModal() {
  if (showModal.value) {
    document
      .getElementsByTagName('html')[0]
      .classList.remove('overflow-y-hidden')
  } else {
    document.getElementsByTagName('html')[0].classList.add('overflow-y-hidden')
  }

  showModal.value = !showModal.value
}

async function updateEventName() {
  await _fetch('/api/updateEventName', {
    eventId: event.value.id,
    newEventName: eventName.value,
  })

  event.value.name = eventName.value
}

async function updateDate(date: Date) {
  console.log(date)
}
</script>

<style>
.modal-body {
  height: 500px;
}

.bg-gray-800-opacity {
  background-color: #2d374850;
}

.fade-up-down-enter-active {
  transition: all 0.1s ease;
}
.fade-up-down-leave-active {
  transition: all 0.1s ease;
}
.fade-up-down-enter {
  transform: translateY(10%);
  opacity: 0;
}
.fade-up-down-leave-to {
  transform: translateY(10%);
  opacity: 0;
}

.fade-enter-active {
  -webkit-transition: opacity 2s;
  transition: opacity 0.1s;
}

.fade-leave-active {
  transition: opacity 0.1s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.dp-custom-menu {
  box-shadow: 0 0 0 10px rgb(243, 243, 243);
  border-radius: 15px;
}
</style>

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
              @click="toggleConfigModal()"
            ></span>
            <div
              v-for="userLink in userLinksLoggedUserFirst"
              class="opacity-90 w-36 px-1 rounded-md text-slate-950 bg-slate-100 shadow-lg ring-1 ring-black ring-opacity-5 my-1 mx-2 flex items-center justify-center font-semibold text-center overflow-hidden break-normal"
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
                v-for="userLink in userLinksLoggedUserFirst"
                class="w-24 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 my-1 mx-2"
                :class="{
                  'mb-4': userLink.userId == loggedUserId,
                  'bg-slate-150': userLink.userId != loggedUserId && !isOwner,
                  'bg-white': userLink.userId == loggedUserId || isOwner,
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
      <div v-show="showConfigModal" class="fixed inset-0 z-30">
        <div
          v-show="showConfigModal"
          class="bg-filter bg-black opacity-50 fixed inset-0 w-full h-full z-20"
          @click="toggleConfigModal()"
        ></div>

        <main class="flex flex-col items-center justify-center h-full w-full">
          <transition name="fade-up-down">
            <div
              v-show="showConfigModal"
              class="inline-block items-center z-30 w-full"
              style="max-width: 426px"
            >
              <div
                class="modal max-w-md mx-auto xl:max-w-xl lg:max-w-xl md:max-w-xl bg-white max-h-screen shadow-lg flex-row rounded relative"
              >
                <div class="p-5 rounded-t flex justify-between items-center">
                  <div class="text-slate-800 text-lg flex items-center">
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
                    @click="toggleConfigModal()"
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
                    class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium cursor-pointer flex mx-1"
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
                      v-model="event.name"
                      name="eventName"
                      class="flex-grow mx-1 block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
                      @input="updateEventName()"
                    />
                  </div>
                </div>

                <div
                  class="modal-body p-5 w-full h-full overflow-y-auto"
                  v-show="modalTab == 'dates'"
                  ref="modalDates"
                >
                  <draggable
                    v-model="event.dates"
                    @start="dragging = true"
                    @end="dragging = false"
                    @change="updateDatePositions()"
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
                            class="flex-grow mb-1 mx-1 block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
                            :placeholder="_local(['common', 'title'])"
                            maxlength="18"
                            style="height: 38px; width: 155px"
                            @input="updateDate(element)"
                          />

                          <VueDatePicker
                            v-model="element.date"
                            class="flex-grow mx-1"
                            :format="_date.formatDatetime(element.date)"
                            locale="fr"
                            teleport-center
                            auto-apply
                            :placeholder="_local(['common', 'date'])"
                            :enable-time-picker="false"
                            month-name-format="long"
                            style="width: 30%; min-width: 130px"
                            menu-class-name="dp-custom-menu"
                            :clearable="false"
                            @update:model-value="updateDate(element)"
                          ></VueDatePicker>
                        </div>

                        <span
                          v-html="_icon('trash-fill', _color.pick('red'), 16)"
                          class="cursor-pointer hover:brightness-110 ml-2"
                          @click="deleteDate(element)"
                        ></span>
                      </div>
                    </template>
                  </draggable>

                  <div class="mb-3 flex items-center" v-if="showAddDate">
                    <span
                      v-html="_icon('x-lg', 'black', 16)"
                      class="cursor-pointer hover:opacity-70 mr-2"
                      @click="showAddDate = false"
                    ></span>

                    <div class="flex flex-grow flex-wrap">
                      <input
                        v-model="newDateTitle"
                        type="text"
                        class="flex-grow mb-1 mx-1 block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
                        :placeholder="_local(['common', 'title'])"
                        maxlength="18"
                        style="height: 38px; width: 155px"
                      />

                      <VueDatePicker
                        v-model="newDateDate"
                        class="flex-grow mx-1"
                        locale="fr"
                        teleport-center
                        auto-apply
                        :placeholder="_local(['common', 'date'])"
                        :enable-time-picker="false"
                        month-name-format="long"
                        style="width: 30%; min-width: 130px"
                        menu-class-name="dp-custom-menu"
                        :clearable="false"
                      ></VueDatePicker>
                    </div>

                    <span
                      v-html="_icon('save-fill', 'green', 20)"
                      class="cursor-pointer hover:brightness-110 ml-1"
                      @click="createDate()"
                    ></span>
                  </div>
                </div>

                <div
                  class="modal-body p-5 w-full h-full overflow-y-auto"
                  v-show="modalTab == 'people'"
                  ref="modalPeople"
                >
                  <draggable
                    v-model="event.userLinks"
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
                    @change="updateUserLinkPositions()"
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
                            type="email"
                            v-model="element.user.email"
                            class="flex-grow mb-1 mx-1 block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-sm leading-6"
                            :placeholder="_local(['common', 'email'])"
                            style="height: 38px; width: 150px"
                            disabled
                          />

                          <input
                            type="text"
                            v-model="element.alias"
                            class="flex-grow mb-1 mx-1 block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-sm leading-6"
                            :placeholder="_local(['common', 'alias'])"
                            style="height: 38px; width: 150px"
                          />
                        </div>

                        <span
                          v-html="
                            _icon(
                              'trash-fill',
                              _color.pick(
                                element.userId == loggedUserId ? 'grey' : 'red'
                              ),
                              16
                            )
                          "
                          class="cursor-pointer hover:brightness-110 ml-2"
                          :class="{
                            'pointer-events-none':
                              element.userId == loggedUserId,
                          }"
                          @click="deleteUserLink(element)"
                        ></span>
                      </div>
                    </template>
                  </draggable>

                  <div class="mb-3 flex items-center" v-if="showAddUser">
                    <span
                      v-html="_icon('x-lg', 'black', 16)"
                      class="cursor-pointer hover:opacity-70 mr-2"
                      @click="showAddUser = false"
                    ></span>

                    <div class="flex flex-grow flex-wrap">
                      <input
                        v-model="newUserEmail"
                        type="email"
                        class="flex-grow mb-1 mx-1 block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-sm leading-6"
                        :class="[
                          {
                            'focus:ring-red-600': !isValidEmail(newUserEmail),
                          },
                        ]"
                        :placeholder="_local(['common', 'email'])"
                        style="height: 38px; width: 150px"
                      />

                      <input
                        v-model="newUserAlias"
                        type="text"
                        class="flex-grow mb-1 mx-1 block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-sm leading-6"
                        :placeholder="_local(['common', 'alias'])"
                        style="height: 38px; width: 150px"
                      />
                    </div>

                    <span
                      v-html="
                        _icon(
                          'save-fill',
                          isValidEmail(newUserEmail) ? 'green' : 'grey',
                          20
                        )
                      "
                      class="cursor-pointer hover:brightness-110 ml-1"
                      :class="[
                        { 'pointer-events-none': !isValidEmail(newUserEmail) },
                      ]"
                      @click="createUser()"
                    ></span>
                  </div>
                </div>

                <div
                  class="flex p-2 bg-slate-200 rounded"
                  :class="
                    modalTab == 'general' ? 'justify-end' : 'justify-between'
                  "
                >
                  <span
                    v-if="modalTab != 'general'"
                    v-html="_icon('plus-square-fill', 'green', 30)"
                    class="cursor-pointer hover:brightness-110"
                    @click="toggleNewElement()"
                  ></span>

                  <span
                    v-html="
                      _icon(
                        fetchIsLoading ? 'arrow-clockwise' : 'check',
                        _color.pick(fetchIsLoading ? 'blue' : 'green'),
                        30
                      )
                    "
                    class="hover:brightness-110 ml-3"
                    :class="{
                      'animate-spin': fetchIsLoading,
                    }"
                  ></span>
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

const loggedUserId = useCookie<Number>('userId')
const eventId: Number = Number(route.params.eventId)

let requestedEvent = await _fetch('/api/getEvent', {
  eventId: eventId,
})

if (!requestedEvent) {
  logout()
}

requestedEvent.dates.sort((a: Date, b: Date) => a.position - b.position)
requestedEvent.userLinks.sort(
  (a: EventUser, b: EventUser) => a.position - b.position
)

const isOwner = ref<Boolean>(
  requestedEvent.ownerId == useCookie('userId').value
)
let event = ref<Event>(requestedEvent)
let dragging = ref<Boolean>(false)
let showConfigModal = ref<Boolean>(false)
let modalTab = ref<String>('general')
let fetchThrottleTimer: any = null
let fetchIsLoading = ref<Boolean>(false)

let showAddUser = ref<Boolean>(false)
let showAddDate = ref<Boolean>(false)
let newDateTitle = ref<String>()
let newDateDate = ref<Date | null>()
let newUserEmail = ref<String>()
let newUserAlias = ref<String>()

const modalDates = ref()
const modalPeople = ref()

const userLinksLoggedUserFirst = computed<[EventUser]>(() => {
  let sortedUserLinks = JSON.parse(JSON.stringify(event.value.userLinks))

  const loggedUserLink = sortedUserLinks.find(
    (ul: any) => ul.userId == loggedUserId.value
  )

  sortedUserLinks = sortedUserLinks.filter(
    (ul: any) => ul.userId != loggedUserId.value
  )
  sortedUserLinks.unshift(loggedUserLink)

  return sortedUserLinks
})

async function logout() {
  useCookie('userId').value = null
  useCookie('token').value = null
  useCookie('eventId').value = null

  navigateTo('/')
}

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

function toggleConfigModal() {
  if (showConfigModal.value) {
    document
      .getElementsByTagName('html')[0]
      .classList.remove('overflow-y-hidden')
  } else {
    document.getElementsByTagName('html')[0].classList.add('overflow-y-hidden')
  }

  showConfigModal.value = !showConfigModal.value
}

function toggleNewElement() {
  if (modalTab.value == 'dates') {
    showAddDate.value = true

    setTimeout(() => {
      modalDates.value.scrollTo(0, 9999999)
    }, 10)
  } else if (modalTab.value == 'people') {
    showAddUser.value = true

    setTimeout(() => {
      modalPeople.value.scrollTo(0, 9999999)
    }, 10)
  }
}

/*
 CRUD METHODS
*/

// Event

async function updateEventName() {
  fetchIsLoading.value = true
  clearTimeout(fetchThrottleTimer)

  fetchThrottleTimer = setTimeout(async () => {
    await _fetch('/api/updateEventName', {
      eventId: event.value.id,
      newEventName: event.value.name,
    })

    fetchIsLoading.value = false
  }, 500)
}

// User / EventUser

async function createUser() {
  fetchIsLoading.value = true
  showAddUser.value = false

  const newUserLink = await _fetch('/api/createUser', {
    eventId: event.value.id,
    email: newUserEmail.value,
    alias: newUserAlias.value,
  })

  event.value.userLinks.push(newUserLink)

  newUserEmail.value = ''
  newUserAlias.value = ''

  setTimeout(() => {
    fetchIsLoading.value = false
  }, 500)
}

async function updateUserLinkPositions() {
  const userLinkPositionsData = []
  fetchIsLoading.value = true

  for (let index in event.value.userLinks) {
    userLinkPositionsData.push({
      userLinkId: event.value.userLinks[index].id,
      position: Number(index),
    })
  }

  await _fetch('/api/updateUserLinkPositions', {
    userLinkPositionsData: userLinkPositionsData,
  })

  setTimeout(() => {
    fetchIsLoading.value = false
  }, 500)
}

async function deleteUserLink(userLink: EventUser) {
  if (confirm(_local(['common', 'areyousure']))) {
    fetchIsLoading.value = true
    await _fetch('/api/deleteUserLink', {
      userLinkId: userLink.id,
      userId: userLink.user.id,
      eventId: event.value.id,
    })

    event.value.userLinks = event.value.userLinks.filter(
      (ul: EventUser) => userLink.id != ul.id
    )

    for (let date of event.value.dates) {
      date.availabilities = date.availabilities.filter(
        (a) => a.userId != userLink.user.id
      )
    }

    setTimeout(() => {
      fetchIsLoading.value = false
    }, 500)
  }
}

// Date

async function createDate() {
  fetchIsLoading.value = true
  showAddDate.value = false

  if (newDateDate.value) {
    const newDate = await _fetch('/api/createDate', {
      eventId: event.value.id,
      title: newDateTitle.value,
      date: newDateDate.value.toISOString(),
    })

    event.value.dates.push(newDate)

    newDateTitle.value = ''
    newDateDate.value = null
  }

  setTimeout(() => {
    fetchIsLoading.value = false
  }, 500)
}

function updateDate(date: Date) {
  fetchIsLoading.value = true
  clearTimeout(fetchThrottleTimer)

  fetchThrottleTimer = setTimeout(async () => {
    if (typeof date.date == 'string') {
      date.date = new Date(date.date)
    }

    await _fetch('/api/updateDate', {
      dateId: date.id,
      date: date.date.toISOString(),
      title: date.title,
    })

    fetchIsLoading.value = false
  }, 500)
}

async function updateDatePositions() {
  const datePositionsData = []
  fetchIsLoading.value = true

  for (let index in event.value.dates) {
    datePositionsData.push({
      dateId: event.value.dates[index].id,
      position: Number(index),
    })
  }

  await _fetch('/api/updateDatePositions', {
    datePositionsData: datePositionsData,
  })

  setTimeout(() => {
    fetchIsLoading.value = false
  }, 500)
}

async function lockDate(date: Date) {
  date.isLocked = !date.isLocked

  await _fetch('/api/lockDate', {
    isLocked: date.isLocked,
    dateId: date.id,
  })
}

async function deleteDate(date: Date) {
  if (confirm(_local(['common', 'areyousure']))) {
    fetchIsLoading.value = true

    await _fetch('/api/deleteDate', {
      dateId: date.id,
    })

    event.value.dates = event.value.dates.filter((d: Date) => date.id != d.id)

    setTimeout(() => {
      fetchIsLoading.value = false
    }, 500)
  }
}

// Aivalability

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

.dp__input {
  padding-right: 5px;
}
</style>

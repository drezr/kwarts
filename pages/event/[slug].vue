<template>
  <div v-if="loading == false">
    <BaseHeader :event="event" />

    <div class="flex py-6">
      <div class="flex flex-col mx-auto">
        <div class="flex">
          <div class="flex justify-center w-44 mx-2">
            <span
              v-if="isOwner"
              v-html="_icon('gear-fill', _color.pick('blue'), 24)"
              class="mb-1 cursor-pointer hover:brightness-110"
              @click="navigateTo(`/manage/${event.slug}`)"
            ></span>
          </div>

          <div
            v-for="date in event.dates"
            class="flex justify-center w-24 mx-2"
          >
            <span
              v-html="_icon('list', _color.pick('blue'), 28)"
              class="cursor-pointer hover:brightness-125"
              :title="_local(['common', 'summary'])"
              @click="navigateTo('/summary/' + date.id)"
            ></span>
          </div>
        </div>

        <div v-for="userLink in userLinksLoggedUserFirst" class="flex">
          <div
            class="opacity-90 w-44 px-1 rounded-md text-slate-950 bg-slate-50 shadow-lg ring-1 ring-black ring-opacity-5 my-1 mx-2 flex flex-col items-center justify-center font-semibold text-center overflow-hidden break-normal"
            :class="[{ 'mb-4': userLink.userId == loggedUserId }]"
          >
            {{ userLink.alias }}

            <div class="flex">
              <span
                v-if="event.showIsMotorized"
                v-html="
                  _icon(
                    selectOptionIcon(userLink, 'isMotorized'),
                    _color.pick(selectOptionColor(userLink, 'isMotorized')),
                    28,
                  )
                "
                class="mx-2 mt-1"
                :class="[
                  {
                    'cursor-pointer':
                      isOwner || userLink.userId == loggedUserId,
                  },
                  {
                    'hover:brightness-125':
                      isOwner || userLink.userId == loggedUserId,
                  },
                ]"
                :title="
                  _local([
                    'common',
                    selectOptionTooltip(userLink, 'isMotorized'),
                  ]) +
                  (isOwner || userLink.userId == loggedUserId
                    ? _local(['common', 'clickToUpdateTooltip'])
                    : '')
                "
                @click="
                  isOwner || userLink.userId == loggedUserId
                    ? updateIsMotorized(userLink)
                    : null
                "
              ></span>

              <span
                v-if="event.showIsReserve"
                v-html="
                  _icon(
                    selectOptionIcon(userLink, 'isReserve'),
                    _color.pick(selectOptionColor(userLink, 'isReserve')),
                    28,
                  )
                "
                class="mx-2 mt-1"
                :class="[
                  {
                    'cursor-pointer':
                      isOwner || userLink.userId == loggedUserId,
                  },
                  {
                    'hover:brightness-125':
                      isOwner || userLink.userId == loggedUserId,
                  },
                ]"
                :title="
                  _local([
                    'common',
                    selectOptionTooltip(userLink, 'isReserve'),
                  ]) +
                  (isOwner || userLink.userId == loggedUserId
                    ? _local(['common', 'clickToUpdateTooltip'])
                    : '')
                "
                @click="
                  isOwner || userLink.userId == loggedUserId
                    ? updateIsReserve(userLink)
                    : null
                "
              ></span>
            </div>
          </div>

          <div
            v-for="date in userLink.dates"
            class="w-24 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 my-1 mx-2"
            :class="{
              'mb-4': userLink.userId == loggedUserId,
              'bg-slate-150': userLink.userId != loggedUserId && !isOwner,
              'bg-white': userLink.userId == loggedUserId || isOwner,
              'opacity-30': date.isLocked,
              'pointer-events-none':
                date.isLocked || (userLink.userId != loggedUserId && !isOwner),
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

                  <span class="relative" :class="[{ 'bottom-1': date.title }]">
                    {{ _date.formatDatetime(String(date.date)) }}
                  </span>
                </span>
              </div>

              <div
                class="flex divide-x"
                v-if="
                  (userLink.userId == loggedUserId || isOwner) && !date.isLocked
                "
              >
                <div
                  class="grow flex items-center justify-center py-2 cursor-pointer hover:animate-pulse"
                  @click="setAvailability(date, userLink, true)"
                >
                  <span
                    v-html="selectAvailabilityIcon('on', date, userLink)"
                  ></span>
                </div>

                <div
                  class="grow flex items-center justify-center py-2 cursor-pointer hover:animate-pulse"
                  @click="setAvailability(date, userLink, false)"
                >
                  <span
                    v-html="selectAvailabilityIcon('off', date, userLink)"
                  ></span>
                </div>
              </div>

              <div v-else>
                <div class="grow flex items-center justify-center py-2">
                  <span
                    v-html="selectAvailabilityIcon('unknown', date, userLink)"
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const loading = ref(true)
const route = useRoute()

const loggedUserId = useCookie<Number>('userId')
const slug = route.params.slug

let requestedEvent = await _fetch('/api/getEventBySlug', {
  slug: slug,
})

if (!requestedEvent) logout()

const loggedUserLink = requestedEvent.userLinks.find(
  (ul: any) => ul.user.id == loggedUserId.value,
)

if (!loggedUserLink) logout()

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

requestedEvent.dates.sort((a: Date, b: Date) => a.position - b.position)
requestedEvent.userLinks.sort(
  (a: EventUser, b: EventUser) => a.position - b.position,
)

useState<String>('eventName', () => requestedEvent.name)

const isOwner = loggedUserLink ? ref<Boolean>(loggedUserLink.isOwner) : false
let event = ref<Event>(requestedEvent)

interface EventUserExtended extends EventUser {
  dates: [Date]
}

const userLinksLoggedUserFirst = computed<[EventUserExtended]>(() => {
  let sortedUserLinks = JSON.parse(JSON.stringify(event.value.userLinks))

  sortedUserLinks = sortedUserLinks.filter(
    (ul: any) => ul.userId != loggedUserId.value,
  )
  sortedUserLinks.unshift(loggedUserLink)

  sortedUserLinks = sortedUserLinks.filter(
    (u: EventUser) => !u.isHidden && u.isValidated,
  )

  for (let userLink of sortedUserLinks) {
    userLink.dates = event.value.dates

    for (let date of userLink.dates) {
      date.availability = date.availabilities.find(
        (a: Availability) => a.userId == userLink.user.id,
      )
    }
  }

  return sortedUserLinks
})

loading.value = false

function selectAvailabilityIcon(
  status: string,
  date: Date,
  userLink: EventUser,
) {
  const availability = date.availabilities.find(
    (a: Availability) => a.userId == userLink.userId,
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

async function updateIsMotorized(userLink: EventUser) {
  let reactiveUserLink = event.value.userLinks.find((u) => u.id == userLink.id)

  if (reactiveUserLink) {
    if (!reactiveUserLink.isMotorized) reactiveUserLink.isMotorized = true
    else reactiveUserLink.isMotorized = false

    await _fetch('/api/updateIsMotorized', {
      userId: reactiveUserLink.userId,
      userLinkId: reactiveUserLink.id,
      isMotorized: reactiveUserLink.isMotorized,
    })
  }
}

async function updateIsReserve(userLink: EventUser) {
  let reactiveUserLink = event.value.userLinks.find((u) => u.id == userLink.id)

  if (reactiveUserLink) {
    if (reactiveUserLink.isReserve == null) reactiveUserLink.isReserve = false
    else if (reactiveUserLink.isReserve == false)
      reactiveUserLink.isReserve = true
    else reactiveUserLink.isReserve = false

    await _fetch('/api/updateIsReserve', {
      userId: reactiveUserLink.userId,
      userLinkId: reactiveUserLink.id,
      isReserve: reactiveUserLink.isReserve,
    })
  }
}

// Availability

async function setAvailability(
  date: Date,
  userLink: EventUser,
  isAvailable: boolean,
) {
  const availability = date.availabilities.find(
    (a: Availability) => a.userId == userLink.userId,
  )

  if (availability) {
    availability.isAvailable = isAvailable

    const newAvailability: Availability = await _fetch(
      '/api/updateAvailability',
      {
        eventId: event.value.id,
        isAvailable: isAvailable,
        availabilityId: availability.id,
        userId: userLink.userId,
      },
    )
  } else {
    // Request new availabilty

    const newAvailability: Availability = await _fetch(
      '/api/createAvailability',
      {
        eventId: event.value.id,
        isAvailable: isAvailable,
        dateId: date.id,
        userId: userLink.userId,
      },
    )

    date.availabilities.push(newAvailability)
  }
}

function selectOptionTooltip(userLink: any, optionType: string) {
  const value = userLink[optionType]

  if (optionType == 'isMotorized') {
    if (userLink.user.id == loggedUserId.value) {
      if (value == true) return 'isMotorizedSelfTooltip'
      if (value == false) return 'isNotMotorizedSelfTooltip'
      else return 'isMotorizedUnknowSelfTooltip'
    } else {
      if (value == true) return 'isMotorizedTooltip'
      if (value == false) return 'isNotMotorizedTooltip'
      else return 'isMotorizedUnknowTooltip'
    }
  }

  if (optionType == 'isReserve') {
    if (userLink.user.id == loggedUserId.value) {
      if (value == true) return 'isReserveSelfTooltip'
      if (value == false) return 'isNotReserveSelfTooltip'
      else return 'isReserveUnknowSelfTooltip'
    } else {
      if (value == true) return 'isReserveTooltip'
      if (value == false) return 'isNotReserveTooltip'
      else return 'isReserveUnknowTooltip'
    }
  }

  return 'TooltipError'
}

function selectOptionColor(userLink: any, optionType: string) {
  const value = userLink[optionType]

  if (optionType == 'isMotorized') {
    if (value == true) return 'green'
    if (value == false) return 'red'
    else return 'grey'
  }

  if (optionType == 'isReserve') {
    if (value == true) return 'purple'
    if (value == false) return 'green'
    else return 'grey'
  }

  return 'grey'
}

function selectOptionIcon(userLink: any, optionType: string) {
  const value = userLink[optionType]

  if (optionType == 'isMotorized') {
    if (value == true) return 'car-front-fill'
    if (value == false) return 'car-front-fill'
    else return 'car-front-fill'
  }

  if (optionType == 'isReserve') {
    if (value == true) return 'person-fill-exclamation'
    if (value == false) return 'person-fill-check'
    else return 'person'
  }

  return 'person'
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

<template>
  <BaseHeader :event="event" />

  <div class="flex justify-center">
    <div class="mx-auto overflow-x-auto">
      <div class="flex py-6">
        <div class="flex flex-col items-center" :class="[{ 'mt-7': !isOwner }]">
          <NuxtLink
            v-if="isOwner"
            :to="`/manage/${event.slug}`"
            v-html="_icon('gear-fill', _color.pick('blue'), 24)"
            class="mb-1 cursor-pointer hover:brightness-110"
          ></NuxtLink>

          <div
            v-for="userLink in userLinksLoggedUserFirst"
            class="opacity-90 w-44 px-1 rounded-md text-slate-950 bg-slate-50 shadow-lg ring-1 ring-black ring-opacity-5 my-1 mx-2 flex items-center justify-center font-semibold text-center overflow-hidden break-normal"
            :class="[{ 'mb-4': userLink.userId == loggedUserId }]"
            style="height: 81px"
          >
            {{ userLink.alias }}
          </div>
        </div>

        <div class="flex mx-auto">
          <div v-for="date in event.dates" class="flex flex-col items-center">
            <span
              v-html="_icon('list', _color.pick('blue'), 28)"
              class="cursor-pointer hover:brightness-125"
              :title="_local(['common', 'summary'])"
              @click="navigateTo('/summary/' + date.id)"
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
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const route = useRoute()

const loggedUserId = useCookie<Number>('userId')
const slug = route.params.slug

let requestedEvent = await _fetch('/api/getEventBySlug', {
  slug: slug,
})

useHead({
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: requestedEvent.icon ? requestedEvent.icon : '/kwarts_logo_mini.png',
    },
  ],
})

const loggedUserLink = requestedEvent.userLinks.find(
  (ul: any) => ul.user.id == loggedUserId.value
)

if (!requestedEvent || !loggedUserLink) {
  logout()
}

requestedEvent.dates.sort((a: Date, b: Date) => a.position - b.position)
requestedEvent.userLinks.sort(
  (a: EventUser, b: EventUser) => a.position - b.position
)

useState<String>('eventName', () => requestedEvent.name)

const isOwner = loggedUserLink ? ref<Boolean>(loggedUserLink.isOwner) : false
let event = ref<Event>(requestedEvent)
let cloneEvent = JSON.parse(JSON.stringify(event.value))
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

const userLinksLoggedUserFirst = computed<[EventUser]>(() => {
  let sortedUserLinks = JSON.parse(JSON.stringify(event.value.userLinks))

  sortedUserLinks = sortedUserLinks.filter(
    (ul: any) => ul.userId != loggedUserId.value
  )
  sortedUserLinks.unshift(loggedUserLink)

  sortedUserLinks = sortedUserLinks.filter(
    (u: EventUser) => !u.isHidden && u.isValidated
  )

  return sortedUserLinks
})

function getEmail(userLink: EventUser) {
  const targetLink = cloneEvent.userLinks.find(
    (ul: EventUser) => userLink.id == ul.id
  )

  return targetLink?.user.email
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

// Availability

async function setAvailability(
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
        eventId: event.value.id,
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
        eventId: event.value.id,
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

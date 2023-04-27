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

    <div class="flex w-full overflow-x-auto" style="height: calc(100vh - 92px)">
      <div
        class="sticky left-0 flex flex-col items-center"
        :class="{ 'mt-7': isOwner }"
      >
        <div
          v-for="userLink in event.userLinks"
          class="opacity-90 w-36 px-1 rounded-md text-slate-950 bg-slate-100 shadow-lg ring-1 ring-black ring-opacity-5 my-1 mx-2 flex items-center justify-center font-semibold text-center"
          :class="{ 'mb-4': userLink.userId == loggedUserId }"
          style="height: 89px"
        >
          {{ userLink.alias }}
        </div>
      </div>

      <div class="flex">
        <div v-for="date in event.dates" class="flex flex-col items-center">
          <span
            v-if="isOwner"
            v-html="
              _icon(
                date.isLocked ? 'lock-fill' : 'unlock-fill',
                date.isLocked ? _color.pick('orange') : _color.pick('green'),
                24
              )
            "
            class="mb-1 cursor-pointer"
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
                date.isLocked || (userLink.userId != loggedUserId && !isOwner),
            }"
          >
            <div class="divide-y">
              <div
                class="text-slate-900 py-1 text-sm flex items-center justify-center"
              >
                <span
                  class="h-10 text-center inline-flex flex-col justify-center font-bold"
                >
                  <span
                    v-if="date.comment"
                    class="text-slate-600 font-semibold"
                  >
                    <small>{{ date.comment }}</small>
                  </span>

                  {{ _date.formatDatetime(String(date.date)) }}
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
</script>

<style></style>

<template>
  <div class="bg-gradient-to-b from-slate-200">
    <div class="py-3 mb-3">
      <span class="text-xl mx-6 mt-1 mb-2 font-semibold">
        {{ event.name }}
      </span>
    </div>

    <div class="flex w-full overflow-x-auto" style="height: calc(100vh - 92px)">
      <div class="sticky left-0">
        <div
          v-for="userLink in event.userLinks"
          class="opacity-90 w-36 px-1 rounded-md text-slate-950 bg-slate-100 shadow-lg ring-1 ring-black ring-opacity-5 m-2 flex items-center justify-center font-semibold text-center"
          style="height: 89px"
        >
          {{ userLink.alias }}
        </div>
      </div>

      <div class="flex">
        <div
          v-for="date in event.dates"
          :class="{
            'opacity-30': date.isLocked,
            'pointer-events-none': date.isLocked,
          }"
        >
          <div
            v-for="userLink in event.userLinks"
            class="w-24 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 m-2"
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

              <div class="flex divide-x">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const eventId = Number(route.params.eventId)

let event = await _fetch('/api/getEvent', {
  eventId: eventId,
})

event.userLinks.sort((a: EventUser, b: EventUser) => a.position - b.position)

// console.log(event)

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
  }

  if (status == 'off') {
    if (availability && !availability.isAvailable) {
      return _icon('x-circle-fill', 'red', 24)
    } else {
      return _icon('x-circle', 'grey', 24)
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

<style></style>

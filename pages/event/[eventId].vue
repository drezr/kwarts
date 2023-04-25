<template>
  <div>
    <div class="my-6 flex justify-center">
      <span
        class="text-3xl px-6 pt-1 pb-2 font-semibold rounded-md bg-slate-900 text-white"
      >
        {{ event.name }}
      </span>
    </div>

    <div class="flex justify-center">
      <div>
        <div
          v-for="userLink in event.userLinks"
          class="w-40 rounded-md text-slate-900 bg-white shadow-lg ring-1 ring-black ring-opacity-5 m-2 flex items-center justify-center"
          style="height: 89px"
        >
          <b>{{ userLink.alias }}</b>
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
                class="text-slate-900 block py-1 text-sm flex items-center justify-center"
              >
                <span
                  class="h-10 text-center inline-flex flex-col justify-center"
                >
                  <span v-if="date.comment">
                    <small>{{ date.comment }}</small>
                    <br />
                  </span>

                  <b>{{ _date.formatDatetime(String(date.date)) }}</b>
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

const request = await _fetch('/api/getEvent', {
  eventId: eventId,
})

// console.log(request)

let event: Event = ref(request)

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

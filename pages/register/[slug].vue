<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center">
      <div>
        <img
          :src="event.logo ? event.logo : '/kwarts_logo_mini.png'"
          :alt="event.name"
        />
      </div>

      <h2
        class="w-screen mt-2 text-center text-2xl font-bold leading-9 tracking-tight"
        :class="`text-slate-950`"
      >
        {{ event.title ? event.title : event.name }}
      </h2>

      <div
        class="mt-1 flex items-center hover:opacity-80"
        v-if="event.homepage"
      >
        <span
          v-html="_icon('caret-left-fill', _color.pick('grey', -4), 20)"
          class="mr-2"
        ></span>

        <a :href="event.homepage" class="text-slate-900">
          {{
            event.backlinkText ? event.backlinkText : _local(['common', 'back'])
          }}
        </a>
      </div>
    </div>

    <div
      v-if="linkExistError"
      class="flex items-center bg-red-100 rounded-lg p-4 mt-6 text-sm text-red-700 sm:mx-auto sm:w-full sm:max-w-sm"
      role="alert"
    >
      <span
        v-html="_icon('exclamation-triangle-fill', _color.pick('red', -4), 24)"
        class="mr-4"
      ></span>

      <div>
        {{ _local(['common', 'errorEmailExist']) }}
      </div>
    </div>

    <div
      v-if="creationError"
      class="flex items-center bg-red-100 rounded-lg p-4 mt-6 text-sm text-red-700 sm:mx-auto sm:w-full sm:max-w-sm"
      role="alert"
    >
      <span
        v-html="_icon('exclamation-triangle-fill', _color.pick('red', -4), 24)"
        class="mr-4"
      ></span>

      <div>
        {{ _local(['common', 'errorMessage']) }}
      </div>
    </div>

    <div
      v-if="creationSuccess"
      class="flex items-center bg-green-100 rounded-lg p-4 mt-6 text-sm text-green-700 sm:mx-auto sm:w-full sm:max-w-sm"
      role="alert"
    >
      <span
        v-html="_icon('check-circle-fill', _color.pick('green', -4), 24)"
        class="mr-4"
      ></span>

      <div>
        {{ _local(['common', 'successRegister']) }}<br />
        <b>{{ event.title }}</b> !
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-sm" v-if="!creationSuccess">
      <div class="space-y-3">
        <div>
          <label
            for="name"
            class="block text-sm font-medium leading-6"
            :class="`text-slate-950`"
          >
            {{ _local(['common', 'names']) }}

            <span class="text-red-500">*</span>
          </label>

          <div class="mt-2">
            <input
              v-model="alias"
              id="name"
              name="name"
              type="text"
              autocomplete="name"
              required
              class="block w-full rounded-md border-0 py-1.5 px-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
              :class="`text-slate-950 ring-slate-800 placeholder:text-slate-400 focus:ring-slate-800`"
            />
          </div>
        </div>

        <div>
          <label
            for="email"
            class="block text-sm font-medium leading-6"
            :class="`text-slate-950`"
          >
            {{ _local(['common', 'email']) }}
            <span class="text-red-500">*</span>
          </label>

          <div class="mt-2">
            <input
              v-model="email"
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="block w-full rounded-md border-0 py-1.5 px-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
              :class="`text-slate-950 ring-slate-800 placeholder:text-slate-400 focus:ring-slate-800`"
            />
          </div>
        </div>

        <div v-if="event.showFideid">
          <label
            for="fideid"
            class="block text-sm font-medium leading-6"
            :class="`text-slate-950`"
          >
            {{ _local(['common', 'fideid']) }}

            <span class="text-red-500">*</span>
          </label>

          <div class="mt-2">
            <input
              v-model="fideid"
              id="fideid"
              name="fideid"
              type="number"
              required
              class="block w-full rounded-md border-0 py-1.5 px-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
              :class="`text-slate-950 ring-slate-800 placeholder:text-slate-400 focus:ring-slate-800`"
            />
          </div>
        </div>

        <div class="py-6" v-if="event.registerShowDates">
          <span
            class="block font-medium leading-6 cursor-pointer mb-2 text-center"
          >
            {{ _local(['common', 'registerShowDatesTooltip']) }}:
          </span>

          <div class="w-fit mx-auto">
            <div
              v-for="(date, i) in dates"
              class="flex items-center hover:opacity-60"
            >
              <input
                v-model="date.isAvailable"
                :id="'date' + i"
                :name="'date' + i"
                type="checkbox"
                class="block rounded-md border-0 py-1.5 px-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 cursor-pointer"
                :class="`text-slate-950 ring-slate-800 placeholder:text-slate-400 focus:ring-slate-800`"
              />

              <label
                :for="'date' + i"
                class="block text-sm font-medium leading-6 ml-2 cursor-pointer"
                :class="`text-slate-950`"
              >
                {{ date.title }} <span class="mx-2 text-gray-500">–</span>
                {{ _date.formatDatetime(date.date) }}
              </label>
            </div>
          </div>
        </div>

        <div class="mt-2 flex items-center" v-if="event.showIsMotorized">
          <input
            v-model="isMotorized"
            id="isMotorized"
            name="isMotorized"
            type="checkbox"
            required
            class="block rounded-md border-0 py-1.5 px-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 cursor-pointer"
            :class="`text-slate-950 ring-slate-800 placeholder:text-slate-400 focus:ring-slate-800`"
          />

          <label
            for="isMotorized"
            class="block text-sm font-medium leading-6 ml-2 cursor-pointer"
            :class="`text-slate-950`"
          >
            {{ _local(['common', 'isMotorizedSelfTooltip']) }}
          </label>
        </div>

        <div class="mt-2 flex items-center" v-if="event.showIsReserve">
          <input
            v-model="isReserve"
            id="isReserve"
            name="isReserve"
            type="checkbox"
            required
            class="block rounded-md border-0 py-1.5 px-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 cursor-pointer"
            :class="`text-slate-950 ring-slate-800 placeholder:text-slate-400 focus:ring-slate-800`"
          />

          <label
            for="isReserve"
            class="block text-sm font-medium leading-6 ml-2 cursor-pointer"
            :class="`text-slate-950`"
          >
            {{ _local(['common', 'isReserveSelfTooltip']) }}
          </label>
        </div>

        <div v-if="event.hasGodfather">
          <label
            for="godfather"
            class="block text-sm font-medium leading-6"
            :class="`text-slate-950`"
          >
            {{ _local(['common', 'godfather']) }}

            <span class="text-gray-400 italic mr-3">
              ({{ _local(['common', 'optional']) }})
            </span>

            <a
              :href="event.godfatherInfoLink"
              class="text-blue-500"
              v-if="event.godfatherInfoLink"
              target="_blank"
            >
              {{ _local(['common', 'knowmore']) }}
            </a>
          </label>

          <div class="mt-2">
            <input
              v-model="godfather"
              id="godfather"
              name="godfather"
              type="text"
              class="block w-full rounded-md border-0 py-1.5 px-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
              :class="`text-slate-950 ring-slate-800 placeholder:text-slate-400 focus:ring-slate-800`"
            />
          </div>
        </div>

        <div>
          <label
            for="note"
            class="block text-sm font-medium leading-6"
            :class="`text-slate-950`"
          >
            {{ _local(['common', 'notes']) }}

            <span class="text-gray-400 italic mr-3">(facultatif)</span>
          </label>

          <div class="mt-2">
            <textarea
              v-model="note"
              id="note"
              name="note"
              type="text"
              class="block w-full rounded-md border-0 py-1.5 px-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
              :class="`text-slate-950 ring-slate-800 placeholder:text-slate-400 focus:ring-slate-800`"
            ></textarea>
          </div>
        </div>

        <div class="pt-3">
          <button
            class="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
            :class="
              !canCreateParticipation
                ? 'bg-gray-300'
                : `bg-slate-950 hover:bg-slate-900`
            "
            :disabled="!canCreateParticipation"
            @click="createParticipation()"
          >
            {{ _local(['common', 'registerTo']) }} {{ event.name }}
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center mt-4">
      <span
        class="cursor-pointer text-blue-500 inline-flex items-center hover:opacity-70"
        @click="creationSuccess = false"
      >
        <span
          v-html="_icon('person-fill-add', _color.pick('blue', -3), 20)"
          class="mr-2"
        ></span>

        {{ _local(['common', 'registerAnotherPerson']) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug

let email = ref<string>()
let alias = ref<string>()
let fideid = ref<string>()
let godfather = ref<string>()
let note = ref<string>()
let isMotorized = ref<boolean>(false)
let isReserve = ref<boolean>(false)
let creationError = ref<boolean>(false)
let linkExistError = ref<boolean>(false)
let creationSuccess = ref<boolean>(false)
let dates = ref()

const event = await _fetch('/api/getEventBySlugLight', {
  slug: slug,
})

if (!event.isOpen) {
  logout()
}

const title = event.title ? event.title : event.name

useHead({
  titleTemplate: _local(['common', 'registerToEvent']) + ' ' + title,
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: event.icon ? event.icon : '/kwarts_logo_mini.png',
    },
  ],
})

setDates()

const canCreateParticipation = computed<boolean>(() => {
  if (
    !isValidEmail(email.value) ||
    !email.value ||
    !alias.value ||
    (!fideid.value && event.showFideid)
  ) {
    return false
  }

  return true
})

async function createParticipation() {
  const result = await _fetch('/api/createUser', {
    email: email.value,
    alias: alias.value,
    fideid: fideid.value,
    godfather: godfather.value,
    isMotorized: isMotorized.value,
    isReserve: isReserve.value,
    dates: dates,
    eventId: event.id,
  })

  if (result && result.id) {
    creationSuccess.value = true

    alias.value = ''
    email.value = ''
    fideid.value = ''
    godfather.value = ''
    note.value = ''
    isMotorized.value = false
    isReserve.value = false

    setDates()
  } else if (result == 'linkExist') {
    linkExistError.value = true
  } else {
    creationError.value = true
  }
}

function setDates() {
  dates.value = []

  for (let date of event.dates) {
    dates.value.push({
      id: date.id,
      date: date.date,
      title: date.title,
      isAvailable: false,
    })
  }
}
</script>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>

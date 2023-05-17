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
        class="mt-2 text-center text-2xl font-bold leading-9 tracking-tight"
        :class="`text-teal-950`"
      >
        {{ event.title }}
      </h2>

      <div class="mt-1 flex items-center hover:opacity-80">
        <span
          v-html="_icon('arrow-left', _color.pick('teal', -4), 20)"
          class="mr-2"
        ></span>

        <a v-if="event.backLink" :href="event.backLink" class="text-teal-900">
          {{ event.backLinkText ? event.backLinkText : 'Retour' }}
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
        L'adresse email que vous avez introduite a déjà été utilisée pour cet
        évènement.
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

      <div>Une erreur est survenue.</div>
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
        Merci, vous avez bien été inscrit(e) au<br />
        <b>Tournoi des Trois Vallées 2023</b> !
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
      <div class="space-y-3">
        <div>
          <label
            for="email"
            class="block text-sm font-medium leading-6"
            :class="`text-teal-950`"
          >
            Adresse email <span class="text-red-500">*</span>
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
              :class="`text-teal-950 ring-teal-800 placeholder:text-teal-400 focus:ring-teal-800`"
            />
          </div>
        </div>

        <div>
          <label
            for="name"
            class="block text-sm font-medium leading-6"
            :class="`text-teal-950`"
          >
            Nom, prénom <span class="text-red-500">*</span>
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
              :class="`text-teal-950 ring-teal-800 placeholder:text-teal-400 focus:ring-teal-800`"
            />
          </div>
        </div>

        <div>
          <label
            for="fideid"
            class="block text-sm font-medium leading-6"
            :class="`text-teal-950`"
          >
            Matricule FIDE <span class="text-red-500">*</span>
          </label>

          <div class="mt-2">
            <input
              v-model="fideid"
              id="fideid"
              name="fideid"
              type="number"
              required
              class="block w-full rounded-md border-0 py-1.5 px-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
              :class="`text-teal-950 ring-teal-800 placeholder:text-teal-400 focus:ring-teal-800`"
            />
          </div>
        </div>

        <div v-if="event.hasGodfather">
          <label
            for="godfather"
            class="block text-sm font-medium leading-6"
            :class="`text-teal-950`"
          >
            Parrain

            <span class="text-gray-400 italic mr-3">(facultatif)</span>

            <a
              :href="event.godfatherInfoLink"
              class="text-blue-500"
              v-if="event.godfatherInfoLink"
            >
              En savoir plus
            </a>
          </label>

          <div class="mt-2">
            <input
              v-model="godfather"
              id="godfather"
              name="godfather"
              type="text"
              class="block w-full rounded-md border-0 py-1.5 px-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
              :class="`text-teal-950 ring-teal-800 placeholder:text-teal-400 focus:ring-teal-800`"
            />
          </div>
        </div>

        <div>
          <label
            for="note"
            class="block text-sm font-medium leading-6"
            :class="`text-teal-950`"
          >
            Remarques

            <span class="text-gray-400 italic mr-3">(facultatif)</span>
          </label>

          <div class="mt-2">
            <textarea
              v-model="note"
              id="note"
              name="note"
              type="text"
              class="block w-full rounded-md border-0 py-1.5 px-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
              :class="`text-teal-950 ring-teal-800 placeholder:text-teal-400 focus:ring-teal-800`"
            ></textarea>
          </div>
        </div>

        <div class="pt-3">
          <button
            class="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
            :class="
              !canCreateParticipation
                ? 'bg-gray-300'
                : `bg-teal-950 hover:bg-teal-900`
            "
            :disabled="!canCreateParticipation"
            @click="createParticipation()"
          >
            S'inscrire au {{ event.name }}
          </button>
        </div>
      </div>
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
let creationError = ref<boolean>(false)
let linkExistError = ref<boolean>(false)
let creationSuccess = ref<boolean>(false)

const event = await _fetch('/api/getEventBySlugLight', {
  slug: slug,
})

if (!event.isOpen) {
  logout()
}

useHead({
  titleTemplate: 'Inscription au ' + event.title,
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: event.icon ? event.icon : '/kwarts_logo_mini.png',
    },
  ],
})

const canCreateParticipation = computed<boolean>(() => {
  if (
    !isValidEmail(email.value) ||
    !email.value ||
    !alias.value ||
    !fideid.value
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
    eventId: event.id,
  })

  if (result && result.id) {
    creationSuccess.value = true

    alias.value = ''
    email.value = ''
    fideid.value = ''
    godfather.value = ''
  } else if (result == 'linkExist') {
    linkExistError.value = true
  } else {
    creationError.value = true
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

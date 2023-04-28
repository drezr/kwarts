<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto" src="/kwarts_logo_mini.png" alt="Your Company" />
      <h2
        class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
      >
        {{ _local(['common', 'loginTitle']) }}
      </h2>
    </div>

    <div
      v-if="loginError"
      class="flex items-center bg-red-100 rounded-lg p-4 mt-6 text-sm text-red-700 sm:mx-auto sm:w-full sm:max-w-sm"
      role="alert"
    >
      <span
        v-html="_icon('exclamation-triangle-fill', _color.pick('red', -4), 24)"
        class="mr-4"
      ></span>
      <div>
        {{ _local(['common', 'loginError']) }}
      </div>
    </div>

    <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
      <div class="space-y-6">
        <div>
          <label
            for="email"
            class="block text-sm font-medium leading-6 text-gray-900"
          >
            {{ _local(['common', 'email']) }}
          </label>

          <div class="mt-2">
            <input
              v-model="email"
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label
              for="password"
              class="block text-sm font-medium leading-6 text-gray-900"
            >
              {{ _local(['common', 'password']) }}
            </label>
          </div>

          <div class="mt-2">
            <input
              v-model="password"
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <button
            class="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            @click="tryConnect()"
            :class="
              !email || !password
                ? 'bg-slate-400 hover:bg-slate-400'
                : 'bg-slate-900 hover:bg-slate-800'
            "
            :disabled="!email || !password"
          >
            {{ _local(['common', 'signin']) }}
          </button>
        </div>

        <div>
          <button
            class="flex w-full justify-center rounded-md bg-green-900 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            @click="initDatabase()"
          >
            Init Database
          </button>
        </div>

        <div>
          <button
            class="flex w-full justify-center rounded-md bg-red-900 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            @click="clearDatabase()"
          >
            Clear Database
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
let email = ref()
let password = ref()
let loginError = ref(false)

async function tryConnect() {
  const request = await _fetch('/api/tryConnect', {
    email: email.value,
    password: password.value,
  })

  if (request.eventId) {
    useCookie('userId').value = request.user.id
    useCookie('token').value = request.token
    useCookie('eventId').value = request.eventId

    useState<User>('loggedUser', () => request.user)

    navigateTo('/event/' + request.eventId)
  } else {
    loginError.value = true
  }
}

async function initDatabase() {
  await _fetch('/api/initDatabase', {})
}

async function clearDatabase() {
  await _fetch('/api/clearDatabase', {})
}
</script>

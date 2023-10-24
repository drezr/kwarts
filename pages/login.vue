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

    <div v-if="tab == 'login'">
      <div
        v-if="loginError"
        class="flex items-center bg-red-100 rounded-lg p-4 mt-6 text-sm text-red-700 sm:mx-auto sm:w-full sm:max-w-sm"
        role="alert"
      >
        <span
          v-html="
            _icon('exclamation-triangle-fill', _color.pick('red', -4), 24)
          "
          class="mr-4"
        ></span>
        <div>
          {{ _local(['common', 'loginError']) }}
        </div>
      </div>

      <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
        <div class="space-y-3">
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

          <div
            class="text-center text-blue-800 cursor-pointer hover:opacity-70"
            @click="tab = 'newPassword'"
          >
            {{ _local(['common', 'forgotPassword']) }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="tab == 'newPassword'">
      <div
        v-if="forgotError"
        class="flex items-center bg-red-100 rounded-lg p-4 mt-6 text-sm text-red-700 sm:mx-auto sm:w-full sm:max-w-sm"
        role="alert"
      >
        <span
          v-html="
            _icon('exclamation-triangle-fill', _color.pick('red', -4), 24)
          "
          class="mr-4"
        ></span>
        <div>
          {{ _local(['common', 'forgotError']) }}
        </div>
      </div>

      <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
        <div class="space-y-3">
          <div>
            <label
              for="email"
              class="block text-sm font-medium leading-6 text-gray-900"
            >
              {{ _local(['common', 'email']) }}
            </label>

            <div class="mt-2">
              <input
                v-model="forgotEmail"
                id="forgotEmail"
                name="forgotEmail"
                type="email"
                autocomplete="email"
                required
                class="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              class="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              @click="sendNewPassword()"
              :class="
                !forgotEmail || sendNewPasswordLoading
                  ? 'bg-slate-400 hover:bg-slate-400'
                  : 'bg-slate-900 hover:bg-slate-800'
              "
              :disabled="!forgotEmail || sendNewPasswordLoading"
            >
              <span
                v-if="sendNewPasswordLoading"
                v-html="_icon('arrow-clockwise', 'white', 24)"
                class="mr-3 animate-spin"
              ></span>

              {{ _local(['common', 'sendNewPassword']) }}
            </button>
          </div>

          <div
            class="text-center text-blue-800 cursor-pointer hover:opacity-70 flex justify-center"
            @click="tab = 'login'"
          >
            <span
              v-html="_icon('caret-left-fill', 'rgb(30 64 175)', 16)"
              class="mr-1 relative"
              style="top: 5px"
            ></span>

            {{ _local(['common', 'back']) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  link: [{ rel: 'icon', type: 'image/png', href: '/kwarts_logo_mini.png' }],
})

const email = ref()
const password = ref()
const loginError = ref(false)
const forgotError = ref(false)
const sendNewPasswordLoading = ref(false)
const forgotEmail = ref()
const tab = ref('login')

async function tryConnect() {
  const request = await _fetch('/api/tryConnect', {
    email: email.value,
    password: password.value,
  })

  if (request?.eventId) {
    useCookie('userId').value = request.userId
    useCookie('email').value = request.email
    useCookie('token').value = request.token
    useCookie('eventId').value = request.eventId

    useState<User>('loggedUser', () => request.user)

    navigateTo('/event/' + request.eventSlug)
  } else if (request?.userLogged) {
    useCookie('userId').value = request.userId
    useCookie('email').value = request.email
    useCookie('token').value = request.token
    useCookie('userLogged').value = 'true'

    useState<User>('loggedUser', () => request.user)

    navigateTo('/')
  } else {
    loginError.value = true
  }
}

async function sendNewPassword() {
  sendNewPasswordLoading.value = true

  const request = await _fetch('/api/sendNewPassword', {
    email: forgotEmail.value,
  })

  sendNewPasswordLoading.value = false

  if (request) {
    tab.value = 'login'
    forgotEmail.value = ''
    forgotError.value = false

    alert(_local(['common', 'sendNewPasswordSuccess']))
  } else {
    forgotError.value = true
  }
}
</script>

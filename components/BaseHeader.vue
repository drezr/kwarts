<template>
  <div class="flex py-3 justify-between">
    <div class="flex items-center sticky left-0">
      <div v-if="route.fullPath != '/'" class="ml-3">
        <span
          v-html="_icon('caret-left-fill', 'rgb(51 65 85)', 40)"
          class="cursor-pointer hover:brightness-125"
          :title="_local(['common', 'backHome'])"
          @click="navigateTo('/')"
        ></span>
      </div>

      <div class="flex items-center sticky left-0 ml-3" v-if="event">
        <div class="p-1 rounded-full mr-3 flex-shrink-0">
          <img
            :src="event.logo ? event.logo : '/kwarts_logo_mini.png'"
            class="w-12 rounded"
          />
        </div>
        <span class="text-xl font-semibold text-slate-700">
          {{ event.name }}
        </span>
      </div>

      <div class="flex items-center sticky left-0 ml-3" v-else>
        <div class="p-1 rounded-full mr-3 flex-shrink-0">
          <img :src="'/kwarts_logo_mini.png'" class="w-12 rounded" />
        </div>
        <span class="text-xl font-semibold text-slate-700"> Kwarts </span>
      </div>
    </div>

    <div
      class="pr-6 flex items-center sticky right-0 cursor-pointer"
      @mouseenter="toggleMenu = true"
      @mouseleave="toggleMenu = false"
    >
      <span
        v-html="
          _icon(
            isUserLogged == 'true' ? 'person-fill' : 'person',
            'rgb(51 65 85)',
            18,
          )
        "
        class="mr-1"
      ></span>

      {{ email }}

      <span
        v-html="_icon('caret-down-fill', 'rgb(51 65 85)', 18)"
        class="ml-3 relative"
        style="top: 2px"
      ></span>
    </div>
  </div>

  <div
    class="absolute right-6 top-12 bg-white w-72 rounded border border-slate-300 z-50"
    v-show="toggleMenu"
    @mouseenter="toggleMenu = true"
    @mouseleave="toggleMenu = false"
  >
    <div
      @click="updatePasswordDialog.showModal()"
      class="text-slate-500 hover:opacity-70 w-full p-3 cursor-pointer flex border-b border-b-slate-300"
    >
      <span v-html="_icon('key', 'rgb(51 65 85)', 24)" class="mr-3"></span>

      {{ _local(['common', 'updatePassword']) }}
    </div>

    <div
      @click="logout()"
      class="text-slate-500 hover:opacity-70 w-full p-3 cursor-pointer flex"
    >
      <span
        v-html="_icon('box-arrow-left', 'rgb(51 65 85)', 24)"
        class="mr-3"
      ></span>

      {{ _local(['common', 'signout']) }}
    </div>
  </div>

  <dialog
    ref="updatePasswordDialog"
    @mousedown="closeDialog($event, updatePasswordDialog)"
    class="w-96"
  >
    <div
      v-if="passwordErrorMessage"
      class="bg-red-100 rounded p-4 mb-4 text-red-800 flex items-center"
    >
      <span
        v-html="_icon('exclamation-triangle', 'rgb(153 27 27)', 24)"
        class="mr-3"
      ></span>

      <div>
        {{ _local(['common', 'oldPasswordWrong']) }}
      </div>
    </div>

    <div
      v-if="forgotError"
      class="bg-red-100 rounded p-4 mb-4 text-red-800 flex items-center"
    >
      <span
        v-html="_icon('exclamation-triangle', 'rgb(153 27 27)', 24)"
        class="mr-3"
      ></span>

      <div>
        {{ _local(['common', 'errorMessage']) }}
      </div>
    </div>

    <label
      v-if="isUserLogged == 'true'"
      for="oldPassword"
      class="block text-sm font-medium leading-6 text-gray-900"
    >
      {{ _local(['common', 'oldPassword']) }}

      <span class="text-red-500">*</span>
    </label>

    <input
      v-if="isUserLogged == 'true'"
      v-model="oldPassword"
      type="password"
      id="oldPassword"
      class="mb-1 w-full block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
    />

    <div v-if="isUserLogged == 'true'" class="mb-3 flex justify-center">
      <button
        @click="sendNewPassword()"
        class="flex items-center text-blue-800 hover:opacity-70"
        :disabled="sendNewPasswordLoading"
        :class="{ 'opacity-30': sendNewPasswordLoading }"
      >
        <span
          v-if="sendNewPasswordLoading"
          v-html="_icon('arrow-clockwise', 'rgb(30 64 175)', 20)"
          class="mr-1 animate-spin"
        ></span>

        {{ _local(['common', 'forgotPassword']) }}
      </button>
    </div>

    <label
      for="newPassword"
      class="block text-sm font-medium leading-6 text-gray-900"
    >
      {{ _local(['common', 'newPassword']) }}

      <span class="text-red-500">*</span>
    </label>

    <input
      v-model="newPassword"
      type="password"
      id="newPassword"
      class="mb-3 w-full block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
      :class="[
        {
          'bg-red-100':
            newPassword != newPasswordRepeat ||
            ((newPassword.length < 6 || newPasswordRepeat.length < 6) &&
              newPassword != ''),
        },
        {
          'bg-green-50':
            newPassword == newPasswordRepeat &&
            newPassword != '' &&
            newPassword.length >= 6 &&
            newPasswordRepeat.length >= 6,
        },
      ]"
    />

    <label
      for="newPasswordRepeat"
      class="block text-sm font-medium leading-6 text-gray-900"
    >
      {{ _local(['common', 'newPasswordRepeat']) }}

      <span class="text-red-500">*</span>
    </label>

    <input
      v-model="newPasswordRepeat"
      type="password"
      id="newPasswordRepeat"
      class="mb-3 w-full block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
      :class="[
        {
          'bg-red-100':
            newPassword != newPasswordRepeat ||
            ((newPassword.length < 6 || newPasswordRepeat.length < 6) &&
              newPasswordRepeat != ''),
        },
        {
          'bg-green-50':
            newPassword == newPasswordRepeat &&
            newPassword != '' &&
            newPassword.length >= 6 &&
            newPasswordRepeat.length >= 6,
        },
      ]"
    />

    <button
      class="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      :class="
        !canUpdatePassword
          ? 'bg-slate-400 hover:bg-slate-400'
          : 'bg-slate-900 hover:bg-slate-800'
      "
      :disabled="!canUpdatePassword"
      @click="updatePassword()"
    >
      {{ _local(['common', 'updatePassword']) }}
    </button>
  </dialog>
</template>

<script setup lang="ts">
const route = useRoute()

const updatePasswordDialog = ref()
const oldPassword = ref('')
const newPassword = ref('')
const newPasswordRepeat = ref('')
const passwordErrorMessage = ref(false)
const sendNewPasswordLoading = ref(false)
const forgotError = ref(false)

const toggleMenu = ref(false)

defineProps<{
  event?: Event
}>()

const isUserLogged = String(useCookie('userLogged').value)
const email = useCookie('email').value
const userId = useCookie('userId').value

const canUpdatePassword = computed(() => {
  const same = newPassword.value == newPasswordRepeat.value
  const newEmpty = newPassword.value == ''
  const newRepeatEmpty = newPasswordRepeat.value == ''
  const longEnough = newPassword.value.length >= 6
  const oldEmpty = oldPassword.value == '' && isUserLogged == 'true'

  if (same && !newEmpty && !newRepeatEmpty && !oldEmpty && longEnough) {
    return true
  }

  return false
})

async function updatePassword() {
  const request = await _fetch('/api/updatePassword', {
    userId: userId,
    oldPassword: oldPassword.value,
    newPassword: newPassword.value,
  })

  if (request) {
    updatePasswordDialog.value.close()

    oldPassword.value = ''
    newPassword.value = ''
    newPasswordRepeat.value = ''
    passwordErrorMessage.value = false

    setTimeout(() => {
      alert(_local(['common', 'passwordUpdated']))
    }, 100)
  } else {
    passwordErrorMessage.value = true
  }
}

async function sendNewPassword() {
  sendNewPasswordLoading.value = true

  const request = await _fetch('/api/sendNewPassword', {
    email: email,
  })

  sendNewPasswordLoading.value = false

  if (request) {
    forgotError.value = false

    alert(_local(['common', 'sendNewPasswordSuccess']))
  } else {
    forgotError.value = true
  }
}
</script>

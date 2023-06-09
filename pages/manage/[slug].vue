<template>
  <BaseHeader :event="event" />

  <nav class="bg-slate-800 flex justify-center items-center py-1 flex-wrap">
    <NuxtLink :to="`/event/${event.slug}`"
      class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium cursor-pointer flex">
      <span v-html="_icon('caret-left-fill', 'white', 16)" class="mr-2 relative" style="top: 2px"></span>

      {{ _local(['common', 'backToTheEvent']) }}
    </NuxtLink>

    <span
      class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium cursor-pointer flex ml-1"
      :class="{ 'bg-slate-900': modalTab == 'general' }" @click="modalTab = 'general'">
      <span v-html="_icon('sliders', 'white', 16)" class="mr-2 relative" style="top: 2px"></span>

      {{ _local(['common', 'general']) }}
    </span>

    <span
      class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium cursor-pointer flex mx-1"
      :class="{ 'bg-slate-900': modalTab == 'dates' }" @click="modalTab = 'dates'">
      <span v-html="_icon('calendar3', 'white', 16)" class="mr-2 relative" style="top: 2px"></span>

      {{ _local(['common', 'dates']) }}
    </span>

    <span
      class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium cursor-pointer flex"
      :class="{ 'bg-slate-900': modalTab == 'people' }" @click="modalTab = 'people'">
      <span v-html="_icon('people', 'white', 16)" class="mr-2 relative" style="top: 2px"></span>

      {{ _local(['common', 'people']) }}
    </span>

    <span v-html="_icon(
        fetchIsLoading ? 'arrow-clockwise' : 'check',
        _color.pick(fetchIsLoading ? 'blue' : 'green'),
        30
      )
      " class="hover:brightness-110 ml-3" :class="{
    'animate-spin': fetchIsLoading,
  }"></span>
  </nav>

  <div class="p-5 mx-auto" v-show="modalTab == 'general'" style="max-width: 600px">
    <label for="eventName" class="block text-sm font-medium leading-6 text-gray-900">
      {{ _local(['common', 'eventName']) }}

      <span class="text-red-500">*</span>
    </label>

    <input v-model="event.name" id="eventName"
      class="mb-3 w-full block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
      @input="updateEvent('name', event.name)" />

    <label for="eventSlug" class="block text-sm font-medium leading-6 text-gray-900">
      {{ _local(['common', 'eventSlug']) }}

      <span class="text-red-500">*</span>
    </label>

    <div class="flex items-center mb-3">
      <input v-model="newSlug" id="eventSlug"
        class="w-full block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
        @input="checkSlugExist()" />

      <div v-if="newSlug != event.slug"
        class="cursor-pointer rounded-full relative flex items-center justify-center hover:brightness-110 ml-1 command-button"
        :class="slugExist == false
            ? 'bg-green-600'
            : 'bg-gray-500 pointer-events-none'
          " :title="_local(['common', 'save'])" @click="updateEventSlug()">
        <span v-html="_icon('save', 'white', 20)"></span>
      </div>
    </div>

    <div v-if="slugExist && newSlug != event.slug"
      class="flex items-center bg-red-100 rounded-lg p-4 mb-3 text-sm text-red-700" role="alert">
      <span v-html="_icon('exclamation-triangle-fill', _color.pick('red', -4), 24)" class="mr-4"></span>

      <div>
        {{ _local(['common', 'slugExistError']) }}
      </div>
    </div>

    <label for="eventTitle" class="block text-sm font-medium leading-6 text-gray-900">
      {{ _local(['common', 'eventTitle']) }}

      <span class="text-gray-400 italic">
        ({{ _local(['common', 'optional']) }})
      </span>
    </label>

    <input v-model="event.title" id="eventTitle"
      class="mb-3 w-full block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
      @input="updateEvent('title', event.title)" />

    <label for="eventHomepage" class="block text-sm font-medium leading-6 text-gray-900">
      {{ _local(['common', 'eventHomepage']) }}

      <span class="text-gray-400 italic">
        ({{ _local(['common', 'optional']) }})
      </span>
    </label>

    <input v-model="event.homepage" id="eventHomepage"
      class="mb-3 w-full block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
      @input="updateEvent('homepage', event.homepage)" />

    <label for="eventLogo" class="block text-sm font-medium leading-6 text-gray-900">
      {{ _local(['common', 'eventLogo']) }}

      <span class="text-gray-400 italic">
        ({{ _local(['common', 'optional']) }})
      </span>
    </label>

    <input v-model="event.logo" id="eventLogo"
      class="mb-3 w-full block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
      @input="updateEvent('logo', event.logo)" />

    <label for="eventIcon" class="block text-sm font-medium leading-6 text-gray-900">
      {{ _local(['common', 'eventIcon']) }}

      <span class="text-gray-400 italic">
        ({{ _local(['common', 'optional']) }})
      </span>
    </label>

    <input v-model="event.icon" id="eventIcon"
      class="mb-3 w-full block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
      @input="updateEvent('icon', event.icon)" />

    <label for="isFree" class="flex text-sm font-medium leading-6 text-gray-900">
      <input v-model="event.isFree" type="checkbox" id="isFree"
        class="mb-3 mr-3 block w-6 h-6 rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
        @change="updateEvent('isFree', event.isFree)" />

      {{ _local(['common', 'eventIsFree']) }}
    </label>

    <label for="showIsMotorized" class="flex text-sm font-medium leading-6 text-gray-900">
      <input v-model="event.showIsMotorized" type="checkbox" id="showIsMotorized"
        class="mb-3 mr-3 block w-6 h-6 rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
        @change="updateEvent('showIsMotorized', event.showIsMotorized)" />

      {{ _local(['common', 'showIsMotorized']) }}
    </label>

    <label for="showIsReserve" class="flex text-sm font-medium leading-6 text-gray-900">
      <input v-model="event.showIsReserve" type="checkbox" id="showIsReserve"
        class="mb-3 mr-3 block w-6 h-6 rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
        @change="updateEvent('showIsReserve', event.showIsReserve)" />

      {{ _local(['common', 'showIsReserve']) }}
    </label>

    <label for="registerPage" class="flex text-sm font-medium leading-6 text-gray-900 pt-3">
      <input v-model="event.isOpen" type="checkbox" id="registerPage"
        class="mb-3 mr-3 block w-6 h-6 rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
        @change="updateEvent('isOpen', event.isOpen)" />

      {{ _local(['common', 'registerPage']) }}
    </label>

    <div class="ring-1 ring-gray-300 p-3 rounded" :class="[
      { 'opacity-50': !event.isOpen },
      { 'pointer-events-none': !event.isOpen },
    ]">
      <label for="eventBacklinkText" class="block text-sm font-medium leading-6 text-gray-900">
        {{ _local(['common', 'eventBacklinkText']) }}

        <span class="text-gray-400 italic">
          ({{ _local(['common', 'optional']) }})
        </span>
      </label>

      <input v-model="event.backlinkText" id="eventBacklinkText"
        class="mb-3 w-full block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
        @input="updateEvent('backlinkText', event.backlinkText)" />

      <label for="hasGodfather" class="flex text-sm font-medium leading-6 text-gray-900">
        <input v-model="event.hasGodfather" type="checkbox" id="hasGodfather"
          class="mb-3 mr-3 block w-6 h-6 rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
          @change="updateEvent('hasGodfather', event.hasGodfather)" />

        {{ _local(['common', 'eventHasGodfather']) }}
      </label>

      <label for="eventGodfatherInfoLink" class="block text-sm font-medium leading-6 text-gray-900">
        {{ _local(['common', 'eventGodfatherInfoLink']) }}

        <span class="text-gray-400 italic">
          ({{ _local(['common', 'optional']) }})
        </span>
      </label>

      <input v-model="event.godfatherInfoLink" id="eventGodfatherInfoLink"
        class="mb-3 w-full block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
        @input="updateEvent('godfatherInfoLink', event.godfatherInfoLink)" />

      <div class="text-center font-bold text-blue-500 hover:opacity-80">
        <a :href="`/register/${event.slug}`" target="_blank" class="inline-flex">
          {{ _local(['common', 'checkRegisterPage']) }}
        </a>
      </div>
    </div>

    <label for="listingPage" class="flex text-sm font-medium leading-6 text-gray-900 pt-3 mt-3">
      <input v-model="event.isListingOpen" type="checkbox" id="listingPage"
        class="mb-3 mr-3 block w-6 h-6 rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
        @change="updateEvent('isListingOpen', event.isListingOpen)" />

      {{ _local(['common', 'listingPage']) }}
    </label>

    <div class="ring-1 ring-gray-300 p-3 rounded" :class="[
      { 'opacity-50': !event.isListingOpen },
      { 'pointer-events-none': !event.isListingOpen },
    ]">
      <div class="text-center font-bold text-blue-500 hover:opacity-80">
        <a :href="`/listing/${event.slug}`" target="_blank" class="inline-flex">
          {{ _local(['common', 'checkListingPage']) }}
        </a>
      </div>
    </div>
  </div>

  <div class="p-5 mx-auto" v-show="modalTab == 'dates'" ref="modalDates" style="max-width: 600px">
    <button
      class="bg-green-700 hover:bg-green-600 flex w-full justify-center rounded-md px-3 py-1.5 mb-4 text-sm font-semibold leading-6 text-white shadow-sm ml-1"
      @click="toggleNewElement()">
      <span v-html="_icon('calendar-plus', 'white', 24)" class="mr-2"></span>
      {{ _local(['common', 'createDate']) }}
    </button>

    <draggable v-model="event.dates" @start="dragging = true" @end="dragging = false" @change="updateDatePositions()"
      handle=".handle" item-key="id" v-bind="{
          animation: 200,
          group: 'description',
          disabled: false,
          ghostClass: 'ghost',
        }">
      <template #item="{ element }">
        <div class="mb-3 flex items-center">
          <span v-html="_icon('grip-horizontal', _color.pick('pink'), 16)"
            class="cursor-grab hover:brightness-110 mr-2 handle"></span>

          <div class="flex flex-grow flex-wrap">
            <VueDatePicker v-model="element.date" class="flex-grow mx-1" :format="_date.formatDatetime(element.date)"
              locale="fr" teleport-center auto-apply :placeholder="_local(['common', 'date'])" :enable-time-picker="false"
              month-name-format="long" style="width: 30%; min-width: 130px; max-width: 200px"
              menu-class-name="dp-custom-menu" :clearable="false" @update:model-value="updateDate(element)">
            </VueDatePicker>

            <input type="text" v-model="element.title"
              class="flex-grow mb-1 mx-1 block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
              :placeholder="_local(['common', 'title'])" maxlength="18" style="height: 38px; width: 155px"
              @input="updateDate(element)" />
          </div>

          <div
            class="cursor-pointer rounded-full relative flex items-center justify-center hover:brightness-110 mr-1 command-button"
            :class="[
                { 'bg-orange-500': element.isLocked },
                { 'bg-green-600': !element.isLocked },
              ]" :title="element.isLocked
      ? _local(['common', 'isLockedTooltip'])
      : _local(['common', 'isNotLockedTooltip'])
    " @click="lockDate(element)">
            <span v-html="_icon(
                element.isHidden ? 'lock-fill' : 'unlock-fill',
                'white',
                20
              )
              "></span>
          </div>

          <div
            class="cursor-pointer rounded-full relative flex items-center justify-center hover:brightness-110 command-button bg-gray-200"
            :title="_local(['common', 'delete'])" @click="deleteDate(element)">
            <span v-html="_icon('trash-fill', _color.pick('red'), 20)"></span>
          </div>
        </div>
      </template>
    </draggable>

    <div class="mb-3 flex items-center" v-if="showAddDate">
      <span v-html="_icon('x-lg', 'black', 16)" class="cursor-pointer hover:opacity-70 mr-2"
        @click="showAddDate = false"></span>

      <div class="flex flex-grow flex-wrap">
        <VueDatePicker v-model="newDateDate" class="flex-grow mx-1" locale="fr" teleport-center auto-apply
          :placeholder="_local(['common', 'date'])" :enable-time-picker="false" month-name-format="long"
          style="width: 30%; min-width: 130px; max-width: 200px" menu-class-name="dp-custom-menu" :clearable="false"
          :format="_date.formatDatetime(newDateDate?.toDateString())"></VueDatePicker>

        <input v-model="newDateTitle" type="text"
          class="flex-grow mb-1 mx-1 block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
          :placeholder="_local(['common', 'title'])" maxlength="18" style="height: 38px; width: 155px"
          ref="newDateTitleInput" @keyup.enter="newDateDate ? createDate() : null" />
      </div>

      <span v-html="_icon('save-fill', !newDateDate ? 'grey' : 'green', 26)"
        class="cursor-pointer hover:brightness-110 ml-1" :class="[{ 'pointer-events-none': !newDateDate }]"
        @click="createDate()"></span>
    </div>
  </div>

  <div class="p-5 mx-auto" v-show="modalTab == 'people'" ref="modalPeople" style="max-width: 1000px">
    <div class="flex justify-center">
      <button v-if="peopleView == 'classic'"
        class="bg-purple-900 hover:bg-purple-800 flex w-full justify-center rounded-md px-3 py-1.5 mb-4 text-sm font-semibold leading-6 text-white shadow-sm"
        @click="sortUsersByName()">
        <span v-html="_icon('sort-alpha-down', 'white', 24)" class="mr-2"></span>
        {{ _local(['common', 'sortUsersByName']) }}
      </button>

      <button v-if="peopleView == 'classic'"
        class="bg-green-700 hover:bg-green-600 flex w-full justify-center rounded-md px-3 py-1.5 mb-4 text-sm font-semibold leading-6 text-white shadow-sm ml-1"
        @click="toggleNewElement()">
        <span v-html="_icon('person-fill-add', 'white', 24)" class="mr-2"></span>
        {{ _local(['common', 'createUser']) }}
      </button>

      <button
        class="bg-blue-700 hover:bg-blue-600 flex w-96 justify-center rounded-md px-3 py-1.5 mb-4 text-sm font-semibold leading-6 text-white shadow-sm ml-1"
        @click="peopleView = peopleView == 'classic' ? 'table' : 'classic'">
        <span v-html="_icon(peopleView == 'classic' ? 'table' : 'list-ul', 'white', 24)
          " class="mr-2"></span>
        {{
          _local([
            'common',
            peopleView == 'classic' ? 'tableView' : 'classicView',
          ])
        }}
      </button>
    </div>

    <div v-if="peopleView == 'table'" class="max-w-full w-full absolute left-0 pb-3 overflow-auto"
      style="height: calc(100vh - 186px)">
      <table class="border-collapse w-full">
        <thead>
          <tr>
            <th v-for="keyword in [
              { field: '', locale: '' },
              { field: 'alias', locale: 'names' },
              { field: 'email', locale: 'email' },
              { field: 'phone', locale: 'phoneShort' },
              { field: 'nationality', locale: 'nationality' },
              { field: 'fideid', locale: 'fideid' },
              { field: 'elo', locale: 'elo' },
              { field: 'hasPaid', locale: 'paid' },
              { field: 'paymentNote', locale: 'paymentNote' },
              { field: 'isValidated', locale: 'validated' },
              { field: 'isHidden', locale: 'hidden' },
              { field: 'isMotorized', locale: 'motorized' },
              { field: 'isReserve', locale: 'reserve' },
              { field: 'note', locale: 'notes' },
              { field: 'godfather', locale: 'godfather' },
              { field: 'isOwner', locale: 'owner' },
              { field: 'isPasswordSent', locale: 'passwordSentShort' },
            ]"
              class="p-1 font-bold bg-gray-200 text-gray-600 border border-gray-300 text-sm px-3 cursor-pointer hover:brightness-105"
              @click="sortUserLinksBy(keyword.field)">
              {{ _local(['common', keyword.locale]) }}
            </th>
          </tr>
        </thead>

        <draggable v-model="event.userLinks" @start="dragging = true" @end="dragging = false" handle=".handle"
          item-key="id" v-bind="{
              animation: 200,
              group: 'description',
              disabled: false,
              ghostClass: 'ghost',
            }" @change="updateUserLinkPositions()" :tag="'tbody'" class="bg-white">
          <template #item="{ element }">
            <tr class="hover:bg-gray-100">
              <td class="text-center border p-2 handle cursor-grab">
                <span v-html="_icon('grip-horizontal', _color.pick('pink'), 16)"></span>
              </td>

              <td class="border h-6 p-0">
                <input type="text" v-model="element.alias" class="border-none text-sm h-full w-full bg-transparent"
                  style="min-width: 200px" @input="updateUserLink(element, 'alias', 300)" />
              </td>

              <td class="border h-6 p-0">
                <input type="text" v-model="element.user.email" class="border-none text-sm h-full w-full bg-gray-200"
                  style="min-width: 200px" disabled />
              </td>

              <td class="border h-6 p-0">
                <input type="text" v-model="element.phone" class="border-none text-sm h-full w-full bg-transparent"
                  style="min-width: 120px" @input="updateUserLink(element, 'phone', 300)" />
              </td>

              <td class="border h-6 p-0">
                <input type="text" v-model="element.nationality" class="border-none text-sm h-full w-full bg-transparent"
                  style="min-width: 120px" @input="updateUserLink(element, 'nationality', 300)" />
              </td>

              <td class="border h-6">
                <input type="text" v-model="element.fideid" class="border-none text-sm h-full w-full bg-transparent"
                  style="min-width: 120px" @input="updateUserLink(element, 'fideid', 300)" />
              </td>

              <td class="border h-6">
                <input type="text" v-model="element.elo" class="border-none text-sm h-full w-full bg-transparent"
                  style="min-width: 120px" @input="updateUserLink(element, 'elo', 300)" />
              </td>

              <td class="text-center border p-0">
                <input type="checkbox" v-model="element.hasPaid" @click="
                                                                                                                                    ; (element.hasPaid = !element.hasPaid),
                  updateUserLink(element, 'hasPaid', 0)
                                                                                                                                  " />
              </td>

              <td class="border h-6 p-0">
                <textarea v-model=" element.paymentNote "
                  class="border-none text-sm p-1 relative h-full w-full bg-transparent" style="top: 3px; min-width: 200px"
                  rows="1" @input=" updateUserLink(element, 'paymentNote', 300) ">
                </textarea>
              </td>

              <td class="text-center border h-6 p-0">
                <input type="checkbox" v-model=" element.isValidated " @click="
                  ; (element.isValidated = !element.isValidated),
                    updateUserLink(element, 'isValidated', 0)
                " />
              </td>

              <td class="text-center border h-6 p-0">
                <input type="checkbox" v-model=" element.isHidden " @click="
                  ; (element.isHidden = !element.isHidden),
                    updateUserLink(element, 'isHidden', 0)
                " />
              </td>

              <td class="text-center border h-6 p-0">
                <input type="checkbox" v-model=" element.isMotorized " @click="
                  ; (element.isMotorized = !element.isMotorized),
                    updateUserLink(element, 'isMotorized', 0)
                " />
              </td>

              <td class="text-center border h-6 p-0">
                <input type="checkbox" v-model=" element.isReserve " @click="
                  ; (element.isReserve = !element.isReserve),
                    updateUserLink(element, 'isReserve', 0)
                " />
              </td>

              <td class="border h-6 p-0">
                <textarea v-model=" element.note " class="border-none text-sm p-1 relative h-full w-full bg-gray-100"
                  style="top: 3px; min-width: 200px" disabled rows="1">
                </textarea>
              </td>

              <td class="border h-6 p-0">
                <input type="text" v-model=" element.godfather " class="border-none w-32 text-sm h-full bg-gray-100"
                  disabled />
              </td>

              <td class="text-center border h-6 p-0">
                <input type="checkbox" v-model=" element.isOwner " :disabled=" element.userId == loggedUserId " />
              </td>

              <td class="text-center border h-6 p-0 w-28">
                <div class="w-full h-full flex justify-center items-center">
                  <div class="cursor-pointer rounded-full relative flex items-center justify-center hover:brightness-110"
                    style="height: 26px; width: 26px" :class="
                      [
                        { 'bg-red-500': !element.isPasswordSent },
                        { 'bg-green-600': element.isPasswordSent },
                      ]
                    " :title="
  element.isPasswordSent
    ? _local(['common', 'passwordSent'])
    : _local(['common', 'passwordNotSent'])
" @click=" sendPassword(element) ">
                    <span v-html="
                      _icon(
                        element.isPasswordSent
                          ? 'envelope-check-fill'
                          : 'envelope-x-fill',
                        'white',
                        16
                      )
                    "></span>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </draggable>
      </table>
    </div>

    <draggable v-if=" peopleView == 'classic' " v-model=" event.userLinks " @start=" dragging = true "
      @end=" dragging = false " handle=".handle" item-key="id" v-bind="
        {
          animation: 200,
            group: 'description',
              disabled: false,
                ghostClass: 'ghost',
                                                }
      " @change=" updateUserLinkPositions() ">
      <template #item=" { element } ">
        <div class="mb-3 flex items-center">
          <span v-html=" _icon('grip-horizontal', _color.pick('pink'), 16) "
            class="cursor-grab hover:brightness-110 mr-2 handle"></span>

          <div class="flex flex-grow flex-wrap justify-center items-center">
            <input type="text" v-model=" element.alias "
              class="flex-grow mb-1 mx-1 block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-sm leading-6"
              :placeholder=" _local(['common', 'alias']) " style="height: 38px; min-width: 200px"
              @input=" updateUserLink(element, 'alias', 300) " />

            <input
              class="overflow-hidden flex-grow mb-1 mx-1 block rounded border-0 py-1.5 px-1.5 text-gray-900 ring-gray-300 placeholder:text-gray-400 shadow-sm ring-1 ring-inset text-sm leading-6 focus:ring-slate-600"
              :placeholder=" _local(['common', 'email']) " style="height: 38px; min-width: 200px"
              v-model=" element.user.email " />

            <div v-if=" element.user.email != getEmail(element) "
              class="cursor-pointer rounded-full relative flex items-center justify-center hover:brightness-110 mr-1 command-button"
              :class="
                isValidEmail(element.user.email) &&
                  !cloneEvent.userLinks.find(
                    (u: EventUser) => u.user.email == element.user.email
                  )
                  ? 'bg-green-600'
                  : 'bg-gray-500 pointer-events-none'
              " :title=" _local(['common', 'updateEmail']) " @click=" updateUserEmail(element) ">
              <span v-html=" _icon('save', 'white', 20) "></span>
            </div>

            <div class="flex items-center">
              <div
                class="cursor-pointer rounded-full relative flex items-center justify-center hover:brightness-110 mr-1 command-button"
                :class="
                  [
                    { 'bg-red-500': !element.isPasswordSent },
                    { 'bg-green-600': element.isPasswordSent },
                  ]
                " :title="
  element.isPasswordSent
    ? _local(['common', 'passwordSent'])
    : _local(['common', 'passwordNotSent'])
" @click=" sendPassword(element) ">
                <span v-html="
                  _icon(
                    element.isPasswordSent
                      ? 'envelope-check-fill'
                      : 'envelope-x-fill',
                    'white',
                    24
                  )
                "></span>
              </div>

              <div v-if=" !event.isFree "
                class="cursor-pointer rounded-full relative flex items-center justify-center hover:brightness-110 mr-1 command-button"
                :class="
                  [
                    { 'bg-green-600': element.hasPaid },
                    { 'bg-red-500': !element.hasPaid },
                  ]
                " :title="
  element.hasPaid
    ? _local(['common', 'hasPaidTooltip'])
    : _local(['common', 'hasNotPaidTooltip'])
" @click="
  ; (element.hasPaid = !element.hasPaid),
    updateUserLink(element, 'hasPaid', 0)
">
                <span v-html=" _icon('currency-euro', 'white', 30) " style="position: relative; left: -2px"></span>
              </div>

              <div
                class="cursor-pointer rounded-full relative flex items-center justify-center hover:brightness-110 mr-1 command-button"
                :class="
                  [
                    { 'bg-green-600': element.isValidated },
                    { 'bg-red-500': !element.isValidated },
                  ]
                " :title="
  element.isValidated
    ? _local(['common', 'isValidatedTooltip'])
    : _local(['common', 'isNotValidatedTooltip'])
" @click="
  ; (element.isValidated = !element.isValidated),
    updateUserLink(element, 'isValidated', 0)
">
                <span v-html="
                  _icon(element.isValidated ? 'check' : 'x', 'white', 30)
                "></span>
              </div>

              <div
                class="cursor-pointer rounded-full relative flex items-center justify-center hover:brightness-110 mr-1 command-button"
                :class="
                  [
                    { 'bg-orange-500': element.isHidden },
                    { 'bg-blue-500': !element.isHidden },
                  ]
                " :title="
  element.isHidden
    ? _local(['common', 'isHiddenTooltip'])
    : _local(['common', 'isVisibleTooltip'])
" @click="
  ; (element.isHidden = !element.isHidden),
    updateUserLink(element, 'isHidden', 0)
">
                <span v-html="
                  _icon(
                    !element.isHidden ? 'eye-fill' : 'eye-slash-fill',
                    'white',
                    20
                  )
                "></span>
              </div>

              <div
                class="cursor-pointer rounded-full relative flex items-center justify-center hover:brightness-110 mr-1 command-button"
                :class="
                  [
                    {
                      'bg-purple-500':
                        element.isOwner && element.userId != loggedUserId,
                    },
                    { 'bg-yellow-500': !element.isOwner },
                    { 'bg-gray-200': element.userId == loggedUserId },
                    { 'pointer-events-none': element.userId == loggedUserId },
                  ]
                " :title="
  element.isOwner
    ? _local(['common', 'isOwnerTooltip'])
    : _local(['common', 'isNotOwnerTooltip'])
" @click=" updateUserLinkIsOwner(element) ">
                <span v-html="
                  _icon(
                    element.isOwner ? 'person-fill-gear' : 'person-fill',
                    element.userId == loggedUserId ? 'grey' : 'white',
                    26
                  )
                "></span>
              </div>

              <div
                class="cursor-pointer rounded-full relative flex items-center justify-center hover:brightness-110 mr-1 command-button"
                :class="
                  [
                    { 'bg-orange-500': hasMoreInfo(element) },
                    { 'bg-gray-500': !hasMoreInfo(element) },
                  ]
                " :title=" _local(['common', 'moreInfo']) " @click="
  moreInfoDialog.showModal(),
    (moreInfoSelectedUserLink = element)
">
                <span v-html=" _icon('three-dots', 'white', 26) "></span>
              </div>

              <div
                class="cursor-pointer rounded-full relative flex items-center justify-center hover:brightness-110 command-button bg-gray-200"
                :class="
                  {
                    'pointer-events-none': element.userId == loggedUserId,
                                                                                                                                }
                " :title=" _local(['common', 'delete']) " @click=" deleteUserLink(element) ">
                <span v-html="
                  _icon(
                    'trash-fill',
                    _color.pick(
                      element.userId == loggedUserId ? 'grey' : 'red'
                    ),
                    20
                  )
                "></span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </draggable>

    <div class="mb-3 flex items-center" v-if=" showAddUser ">
      <span v-html=" _icon('x-lg', 'black', 16) " class="cursor-pointer hover:opacity-70 mr-2"
        @click=" showAddUser = false "></span>

      <div class="flex flex-grow flex-wrap">
        <input v-model=" newUserAlias " ref="newUserAliasInput" type="text"
          class="flex-grow mb-1 mx-1 block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-sm leading-6"
          :placeholder=" _local(['common', 'alias']) " style="height: 38px; width: 150px" @keyup.enter="
            newUserAlias &&
              ((newUserEmail &&
                isValidEmail(newUserEmail) &&
                !event.userLinks.find((u) => u.user.email == newUserEmail)) ||
                !newUserEmail)
              ? createUser()
              : null
          " />

        <input v-model=" newUserEmail " type="email"
          class="flex-grow mb-1 mx-1 block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset text-sm leading-6"
          :class="
            [
              {
                'focus:ring-red-600':
                  (newUserEmail && !isValidEmail(newUserEmail)) ||
                  event.userLinks.find((u) => u.user.email == newUserEmail),
                'focus:ring-green-700':
                  isValidEmail(newUserEmail) &&
                  !event.userLinks.find((u) => u.user.email == newUserEmail),
              },
            ]
          " :placeholder=" _local(['common', 'email']) " style="height: 38px; width: 150px" @keyup.enter="
  newUserAlias &&
    ((newUserEmail &&
      isValidEmail(newUserEmail) &&
      !event.userLinks.find((u) => u.user.email == newUserEmail)) ||
      !newUserEmail)
    ? createUser()
    : null
" />
      </div>

      <span v-html="
        _icon(
          'save-fill',
          newUserAlias &&
            ((newUserEmail &&
              isValidEmail(newUserEmail) &&
              !event.userLinks.find((u) => u.user.email == newUserEmail)) ||
              !newUserEmail)
            ? 'green'
            : 'grey',
          26
        )
      " class="cursor-pointer hover:brightness-110 ml-1" :class="
  [
    {
      'pointer-events-none': !(
        newUserAlias &&
        ((newUserEmail &&
          isValidEmail(newUserEmail) &&
          !event.userLinks.find((u) => u.user.email == newUserEmail)) ||
          !newUserEmail)
      ),
    },
  ]
" @click=" createUser() "></span>
    </div>
  </div>

  <dialog ref="moreInfoDialog" @mousedown=" closeDialog($event, moreInfoDialog) " class="w-96">
    <div v-if=" moreInfoSelectedUserLink ">
      <div class="font-bold text-lg mb-3 flex">
        <span v-html=" _icon('person-fill', 'grey', 26) " class="mr-2"></span>

        {{ moreInfoSelectedUserLink.alias }}
      </div>

      <div class="mb-1">
        <label for="fideid" class="text-xs">
          {{ _local(['common', 'fideid']) }}
        </label>

        <input id="fideid" v-model=" moreInfoSelectedUserLink.fideid " type="text"
          class="w-full block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-sm leading-6"
          :placeholder=" _local(['common', 'fideid']) "
          @input=" updateUserLink(moreInfoSelectedUserLink, 'fideid', 300) " />
      </div>

      <div class="mb-1">
        <label for="elo" class="text-xs">
          {{ _local(['common', 'elo']) }}
        </label>

        <input id="elo" v-model=" moreInfoSelectedUserLink.elo " type="text"
          class="w-full block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-sm leading-6"
          :placeholder=" _local(['common', 'elo']) " @input=" updateUserLink(moreInfoSelectedUserLink, 'elo', 300) " />
      </div>

      <div class="mb-1">
        <label for="phone" class="text-xs">
          {{ _local(['common', 'phone']) }}
        </label>

        <input id="phone" v-model=" moreInfoSelectedUserLink.phone " type="text"
          class="w-full block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-sm leading-6"
          :placeholder=" _local(['common', 'phone']) "
          @input=" updateUserLink(moreInfoSelectedUserLink, 'phone', 300) " />
      </div>

      <div class="mb-1">
        <label for="nationality" class="text-xs">
          {{ _local(['common', 'nationality']) }}
        </label>

        <input id="nationality" v-model=" moreInfoSelectedUserLink.nationality " type="text"
          class="w-full block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-sm leading-6"
          :placeholder=" _local(['common', 'nationality']) "
          @input=" updateUserLink(moreInfoSelectedUserLink, 'nationality', 300) " />
      </div>

      <div class="mb-1">
        <label for="paymentNote" class="text-xs">
          {{ _local(['common', 'paymentNote']) }}
        </label>

        <textarea id="paymentNote" v-model=" moreInfoSelectedUserLink.paymentNote " type="text"
          class="w-full block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-sm leading-6"
          :placeholder=" _local(['common', 'paymentNote']) "
          @input=" updateUserLink(moreInfoSelectedUserLink, 'paymentNote', 300) " rows="3"></textarea>
      </div>

      <div class="mb-1" v-if=" event.isOpen ">
        <label for="note" class="text-xs">
          {{ _local(['common', 'notesFromUser']) }}
        </label>

        <textarea id="note" v-model=" moreInfoSelectedUserLink.note " type="text"
          class="w-full block rounded border-0 py-1.5 px-1.5 bg-gray-200 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-sm leading-6"
          :placeholder=" _local(['common', 'notesFromUser']) " disabled rows="3"></textarea>
      </div>

      <div class="mb-1" v-if=" event.isOpen && event.hasGodfather ">
        <label for="godfather" class="text-xs">
          {{ _local(['common', 'godfatherFromUser']) }}
        </label>

        <input id="godfather" v-model=" moreInfoSelectedUserLink.godfather " type="text"
          class="w-full block rounded border-0 py-1.5 px-1.5 bg-gray-200 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-sm leading-6"
          :placeholder=" _local(['common', 'godfatherFromUser']) " disabled />
      </div>

      <label v-if=" event.showIsMotorized " for="isMotorized"
        class="flex items-center text-sm font-medium leading-6 text-gray-900 my-6 hover:opacity-70">
        <input v-model=" moreInfoSelectedUserLink.isMotorized " type="checkbox" id="isMotorized"
          class="mr-3 block w-6 h-6 rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
          @change=" updateUserLink(moreInfoSelectedUserLink, 'isMotorized', 0) " />

        {{ _local(['common', 'isMotorizedTooltip']) }}
      </label>

      <label v-if=" event.showIsReserve " for="isReserve"
        class="flex items-center text-sm font-medium leading-6 text-gray-900 hover:opacity-70">
        <input v-model=" moreInfoSelectedUserLink.isReserve " type="checkbox" id="isReserve"
          class="mr-3 block w-6 h-6 rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
          @change=" updateUserLink(moreInfoSelectedUserLink, 'isReserve', 0) " />

        {{ _local(['common', 'isReserveTooltip']) }}
      </label>
    </div>
  </dialog>
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

if (!requestedEvent) logout()

const loggedUserLink = requestedEvent.userLinks.find(
  (ul: any) => ul.user.id == loggedUserId.value
)

if (!loggedUserLink) logout()

const title = requestedEvent.title
  ? requestedEvent.title
  : requestedEvent.name
    ? requestedEvent.name
    : _local(['common', 'eventManagement'])

useHead({
  titleTemplate: _local(['common', 'eventManagement']) + ' - ' + title,
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
  (a: EventUser, b: EventUser) => a.position - b.position
)

useState<String>('eventName', () => requestedEvent.name)

const isOwner = loggedUserLink ? ref<boolean>(loggedUserLink.isOwner) : false

if (!isOwner) {
  navigateTo(`/event/` + requestedEvent.slug)
}

let event = ref<Event>(requestedEvent)
let cloneEvent = ref(JSON.parse(JSON.stringify(event.value)))
let dragging = ref<Boolean>(false)
let modalTab = ref<String>('general')
let peopleView = ref<String>('classic')
let fetchThrottleTimer: any = null
let fetchIsLoading = ref<Boolean>(false)
let newSlug = ref<any>(event.value.slug)
let slugExist = ref<any>(null)

let showAddUser = ref<Boolean>(false)
let showAddDate = ref<Boolean>(false)
let newDateTitle = ref<String>()
let newDateDate = ref<Date | null>()
let newUserEmail = ref<String>()
let newUserAlias = ref<String>()

const modalDates = ref()
const modalPeople = ref()
const newDateTitleInput = ref()
const newUserAliasInput = ref()
const moreInfoDialog = ref()
let moreInfoSelectedUserLink = ref()

function getEmail(userLink: EventUser) {
  const targetLink = cloneEvent.value.userLinks.find(
    (ul: EventUser) => userLink.id == ul.id
  )

  return targetLink?.user.email
}

function toggleNewElement() {
  if (modalTab.value == 'dates') {
    showAddDate.value = true

    setTimeout(() => {
      newDateTitleInput.value.focus()
      newDateTitleInput.value.scrollIntoView()
    }, 10)
  } else if (modalTab.value == 'people') {
    showAddUser.value = true

    setTimeout(() => {
      newUserAliasInput.value.focus()
      newUserAliasInput.value.scrollIntoView()
    }, 10)
  }
}

function hasMoreInfo(userLink: EventUser) {
  if (
    userLink.paymentNote ||
    userLink.note ||
    userLink.godfather ||
    userLink.phone ||
    userLink.fideid ||
    userLink.elo ||
    userLink.nationality
  )
    return true

  return false
}

function sortUserLinksBy(field: string) {
  const stringFields = [
    'alias',
    'phone',
    'nationality',
    'fideid',
    'paymentNote',
    'note',
    'godfather',
    'elo',
  ]

  const boolFields = [
    'hasPaid',
    'isValidated',
    'isHidden',
    'isMotorized',
    'isReserve',
    'isOwner',
    'isPasswordSent',
  ]

  if (stringFields.includes(field)) {
    event.value.userLinks.sort((a: EventUser, b: EventUser) => {
      let x = a[field as keyof EventUser]
      let y = b[field as keyof EventUser]

      if (x) return y ? String(x).localeCompare(String(y)) : -1
      else if (y) return x ? String(y).localeCompare(String(x)) : 1

      return 0
    })
  } else if (boolFields.includes(field)) {
    event.value.userLinks.sort((a: EventUser, b: EventUser) => {
      let x = a[field as keyof EventUser]
      let y = b[field as keyof EventUser]

      return Number(y) - Number(x)
    })
  } else if (field == 'email') {
    event.value.userLinks.sort((a: EventUser, b: EventUser) => {
      let x = a.user.email
      let y = b.user.email

      if (x) return y ? x.localeCompare(y) : -1
      else if (y) return x ? y.localeCompare(x) : 1

      return 0
    })
  }
}

/*
 CRUD METHODS
*/

// Event

async function updateEvent(key: any, value: any) {
  fetchIsLoading.value = true
  clearTimeout(fetchThrottleTimer)

  let data: any = {}
  data[key] = value

  fetchThrottleTimer = setTimeout(async () => {
    await _fetch('/api/updateEvent', {
      eventId: event.value.id,
      data: data,
    })

    fetchIsLoading.value = false
  }, 300)
}

async function updateEventSlug() {
  fetchIsLoading.value = true
  clearTimeout(fetchThrottleTimer)

  fetchThrottleTimer = setTimeout(async () => {
    await _fetch('/api/updateEventSlug', {
      eventId: event.value.id,
      slug: newSlug,
    })

    navigateTo(`/manage/${newSlug.value}`)

    fetchIsLoading.value = false
  }, 300)
}

async function checkSlugExist() {
  slugExist.value = null

  if (newSlug.value.length == 0) {
    slugExist.value = null
  } else {
    slugExist.value = await _fetch('/api/checkSlugExist', {
      slug: newSlug.value,
    })
  }
}

// User / EventUser

async function sendPassword(eventUser: EventUser) {
  if (confirm(_local(['common', 'sendPasswordConfirm']))) {
    await _fetch('/api/sendPassword', {
      eventId: event.value.id,
      userId: eventUser.user.id,
    })

    eventUser.isPasswordSent = true
  }
}

async function createUser() {
  fetchIsLoading.value = true
  showAddUser.value = false

  newUserEmail.value = newUserEmail.value?.replace(/\s/g, '')

  const newUserLink = await _fetch('/api/createUser', {
    eventId: event.value.id,
    email: newUserEmail.value,
    alias: newUserAlias.value,
  })

  event.value.userLinks.push(newUserLink)

  newUserEmail.value = ''
  newUserAlias.value = ''

  cloneEvent.value = JSON.parse(JSON.stringify(event.value))

  setTimeout(() => {
    modalPeople.value.scrollTo(0, 9999999)
  }, 10)

  setTimeout(() => {
    fetchIsLoading.value = false
  }, 500)
}

async function updateUserLink(
  userLink: EventUser,
  key: string,
  throttle: number
) {
  fetchIsLoading.value = true
  clearTimeout(fetchThrottleTimer)

  let data: any = {}
  data[key] = userLink[key as keyof EventUser]

  fetchThrottleTimer = setTimeout(async () => {
    await _fetch('/api/updateUserLink', {
      userLinkId: userLink.id,
      data: data,
    })

    fetchIsLoading.value = false
  }, throttle)
}

async function updateUserLinkPositions() {
  const userLinkPositionsData = []
  fetchIsLoading.value = true

  for (let index in event.value.userLinks) {
    userLinkPositionsData.push({
      userLinkId: event.value.userLinks[index].id,
      position: Number(index),
    })
  }

  await _fetch('/api/updateUserLinkPositions', {
    eventId: event.value.id,
    userLinkPositionsData: userLinkPositionsData,
  })

  setTimeout(() => {
    fetchIsLoading.value = false
  }, 500)
}

async function sortUsersByName() {
  event.value.userLinks.sort((a: EventUser, b: EventUser) =>
    a.alias.localeCompare(b.alias)
  )

  setTimeout(() => {
    updateUserLinkPositions()
  }, 10)
}

async function updateUserLinkIsOwner(userLink: EventUser) {
  if (confirm(_local(['common', 'areyousure']))) {
    fetchIsLoading.value = true

    userLink.isOwner = !userLink.isOwner

    await _fetch('/api/updateUserLinkIsOwner', {
      eventId: event.value.id,
      userLinkId: userLink.id,
      isOwner: userLink.isOwner,
    })

    setTimeout(() => {
      fetchIsLoading.value = false
    }, 500)
  }
}

async function updateUserEmail(userLink: EventUser) {
  fetchIsLoading.value = true
  clearTimeout(fetchThrottleTimer)

  userLink.user.email = userLink.user.email?.replace(/\s/g, '')

  fetchThrottleTimer = setTimeout(async () => {
    await _fetch('/api/updateUserEmail', {
      userLinkId: userLink.id,
      userId: userLink.user.id,
      eventId: event.value.id,
      email: userLink.user.email,
    })

    userLink.isPasswordSent = false
    cloneEvent.value = JSON.parse(JSON.stringify(event.value))

    fetchIsLoading.value = false
  }, 500)
}

async function deleteUserLink(userLink: EventUser) {
  if (confirm(_local(['common', 'areyousure']))) {
    fetchIsLoading.value = true
    await _fetch('/api/deleteUserLink', {
      userLinkId: userLink.id,
      userId: userLink.user.id,
      eventId: event.value.id,
    })

    event.value.userLinks = event.value.userLinks.filter(
      (ul: EventUser) => userLink.id != ul.id
    )

    for (let date of event.value.dates) {
      date.availabilities = date.availabilities.filter(
        (a) => a.userId != userLink.user.id
      )
    }

    setTimeout(() => {
      fetchIsLoading.value = false
    }, 500)
  }
}

// Date

async function createDate() {
  fetchIsLoading.value = true

  showAddDate.value = false

  if (newDateDate.value) {
    const newDate = await _fetch('/api/createDate', {
      eventId: event.value.id,
      title: newDateTitle.value,
      date: newDateDate.value.toISOString(),
    })

    event.value.dates.push(newDate)

    newDateTitle.value = ''
    newDateDate.value = null
  }

  setTimeout(() => {
    fetchIsLoading.value = false
  }, 500)
}

function updateDate(date: Date) {
  fetchIsLoading.value = true
  clearTimeout(fetchThrottleTimer)

  fetchThrottleTimer = setTimeout(async () => {
    if (typeof date.date == 'string') {
      date.date = new Date(date.date)
    }

    await _fetch('/api/updateDate', {
      eventId: event.value.id,
      dateId: date.id,
      date: date.date.toISOString(),
      title: date.title,
    })

    fetchIsLoading.value = false
  }, 500)
}

async function updateDatePositions() {
  const datePositionsData = []
  fetchIsLoading.value = true

  for (let index in event.value.dates) {
    datePositionsData.push({
      dateId: event.value.dates[index].id,
      position: Number(index),
    })
  }

  await _fetch('/api/updateDatePositions', {
    eventId: event.value.id,
    datePositionsData: datePositionsData,
  })

  setTimeout(() => {
    fetchIsLoading.value = false
  }, 500)
}

async function lockDate(date: Date) {
  fetchIsLoading.value = true

  date.isLocked = !date.isLocked

  await _fetch('/api/lockDate', {
    eventId: event.value.id,
    isLocked: date.isLocked,
    dateId: date.id,
  })

  setTimeout(() => {
    fetchIsLoading.value = false
  }, 500)
}

async function deleteDate(date: Date) {
  if (confirm(_local(['common', 'areyousure']))) {
    fetchIsLoading.value = true

    await _fetch('/api/deleteDate', {
      eventId: event.value.id,
      dateId: date.id,
    })

    event.value.dates = event.value.dates.filter((d: Date) => date.id != d.id)

    setTimeout(() => {
      fetchIsLoading.value = false
    }, 500)
  }
}

//let dialog1Node = ref()
</script>

<style>
dialog {
  border: none;
  box-shadow: #00000029 2px 2px 5px 0px;
  border-radius: 3px;
  padding: 20px;
}

dialog::backdrop {
  background-color: #0000005d;
}

.command-button {
  width: 36px;
  height: 36px;
  min-width: 36px;
  min-height: 36px;
  position: relative;
  top: -2px;
}
</style>

<template>
  <BaseHeader :event="event" />

  <nav class="bg-slate-800 flex justify-center items-center py-1 flex-wrap">
    <NuxtLink
      :to="`/event/${event.slug}`"
      class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium cursor-pointer flex"
    >
      <span
        v-html="_icon('caret-left-fill', 'white', 16)"
        class="mr-2 relative"
        style="top: 2px"
      ></span>

      {{ _local(['common', 'backToTheEvent']) }}
    </NuxtLink>

    <span
      class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium cursor-pointer flex ml-1"
      :class="{ 'bg-slate-900': modalTab == 'general' }"
      @click="modalTab = 'general'"
    >
      <span
        v-html="_icon('sliders', 'white', 16)"
        class="mr-2 relative"
        style="top: 2px"
      ></span>

      {{ _local(['common', 'general']) }}
    </span>

    <span
      class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium cursor-pointer flex mx-1"
      :class="{ 'bg-slate-900': modalTab == 'dates' }"
      @click="modalTab = 'dates'"
    >
      <span
        v-html="_icon('calendar3', 'white', 16)"
        class="mr-2 relative"
        style="top: 2px"
      ></span>

      {{ _local(['common', 'dates']) }} ({{ event.dates.length }})
    </span>

    <span
      class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium cursor-pointer flex mx-1"
      :class="{ 'bg-slate-900': modalTab == 'groups' }"
      @click="modalTab = 'groups'"
    >
      <span
        v-html="_icon('person-bounding-box', 'white', 16)"
        class="mr-2 relative"
        style="top: 2px"
      ></span>

      {{ _local(['common', 'groups']) }}
    </span>

    <span
      class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium cursor-pointer flex"
      :class="{ 'bg-slate-900': modalTab == 'people' }"
      @click="modalTab = 'people'"
    >
      <span
        v-html="_icon('people', 'white', 16)"
        class="mr-2 relative"
        style="top: 2px"
      ></span>

      {{ _local(['common', 'people']) }} ({{ event.userLinks.length }})
    </span>

    <span
      v-html="
        _icon(
          fetchIsLoading ? 'arrow-clockwise' : 'check',
          _color.pick(fetchIsLoading ? 'blue' : 'green'),
          30
        )
      "
      class="hover:brightness-110 ml-3"
      :class="{
        'animate-spin': fetchIsLoading,
      }"
    ></span>
  </nav>

  <div
    class="p-5 mx-auto"
    v-show="modalTab == 'general'"
    style="max-width: 600px"
  >
    <label
      for="eventName"
      class="block text-sm font-medium leading-6 text-gray-900"
    >
      {{ _local(['common', 'eventName']) }}

      <span class="text-red-500">*</span>
    </label>

    <input
      v-model="event.name"
      id="eventName"
      class="mb-3 w-full block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
      @input="updateEvent('name', event.name)"
    />

    <label
      for="eventSlug"
      class="block text-sm font-medium leading-6 text-gray-900"
    >
      {{ _local(['common', 'eventSlug']) }}

      <span class="text-red-500">*</span>
    </label>

    <div class="flex items-center mb-3">
      <input
        v-model="newSlug"
        id="eventSlug"
        class="w-full block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
        @input="checkSlugExist()"
      />

      <div
        v-if="newSlug != event.slug"
        class="cursor-pointer rounded-full relative flex items-center justify-center hover:brightness-110 ml-1 command-button"
        :class="
          slugExist == false
            ? 'bg-green-600'
            : 'bg-gray-500 pointer-events-none'
        "
        :title="_local(['common', 'save'])"
        @click="updateEventSlug()"
      >
        <span v-html="_icon('save', 'white', 20)"></span>
      </div>
    </div>

    <div
      v-if="slugExist && newSlug != event.slug"
      class="flex items-center bg-red-100 rounded-lg p-4 mb-3 text-sm text-red-700"
      role="alert"
    >
      <span
        v-html="_icon('exclamation-triangle-fill', _color.pick('red', -4), 24)"
        class="mr-4"
      ></span>

      <div>
        {{ _local(['common', 'slugExistError']) }}
      </div>
    </div>

    <label
      for="eventTitle"
      class="block text-sm font-medium leading-6 text-gray-900"
    >
      {{ _local(['common', 'eventTitle']) }}

      <span class="text-gray-400 italic">
        ({{ _local(['common', 'optional']) }})
      </span>
    </label>

    <input
      v-model="event.title"
      id="eventTitle"
      class="mb-3 w-full block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
      @input="updateEvent('title', event.title)"
    />

    <label
      for="eventHomepage"
      class="block text-sm font-medium leading-6 text-gray-900"
    >
      {{ _local(['common', 'eventHomepage']) }}

      <span class="text-gray-400 italic">
        ({{ _local(['common', 'optional']) }})
      </span>
    </label>

    <input
      v-model="event.homepage"
      id="eventHomepage"
      class="mb-3 w-full block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
      @input="updateEvent('homepage', event.homepage)"
    />

    <label
      for="eventLogo"
      class="block text-sm font-medium leading-6 text-gray-900"
    >
      {{ _local(['common', 'eventLogo']) }}

      <span class="text-gray-400 italic">
        ({{ _local(['common', 'optional']) }})
      </span>
    </label>

    <input
      v-model="event.logo"
      id="eventLogo"
      class="mb-3 w-full block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
      @input="updateEvent('logo', event.logo)"
    />

    <label
      for="eventIcon"
      class="block text-sm font-medium leading-6 text-gray-900"
    >
      {{ _local(['common', 'eventIcon']) }}

      <span class="text-gray-400 italic">
        ({{ _local(['common', 'optional']) }})
      </span>
    </label>

    <input
      v-model="event.icon"
      id="eventIcon"
      class="mb-3 w-full block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
      @input="updateEvent('icon', event.icon)"
    />

    <label
      for="isFree"
      class="flex text-sm font-medium leading-6 text-gray-900 cursor-pointer hover:opacity-90"
    >
      <input
        v-model="event.isFree"
        type="checkbox"
        id="isFree"
        class="cursor-pointer mb-3 mr-3 block w-6 h-6 rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
        @change="updateEvent('isFree', event.isFree, 0)"
      />

      {{ _local(['common', 'eventIsFree']) }}
    </label>

    <label
      for="showIsMotorized"
      class="flex text-sm font-medium leading-6 text-gray-900 cursor-pointer hover:opacity-90"
    >
      <input
        v-model="event.showIsMotorized"
        type="checkbox"
        id="showIsMotorized"
        class="cursor-pointer mb-3 mr-3 block w-6 h-6 rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
        @change="updateEvent('showIsMotorized', event.showIsMotorized, 0)"
      />

      {{ _local(['common', 'showIsMotorized']) }}
    </label>

    <label
      for="showIsReserve"
      class="flex text-sm font-medium leading-6 text-gray-900 cursor-pointer hover:opacity-90"
    >
      <input
        v-model="event.showIsReserve"
        type="checkbox"
        id="showIsReserve"
        class="cursor-pointer mb-3 mr-3 block w-6 h-6 rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
        @change="updateEvent('showIsReserve', event.showIsReserve, 0)"
      />

      {{ _local(['common', 'showIsReserve']) }}
    </label>

    <label
      for="registerPage"
      class="flex text-sm font-medium leading-6 text-gray-900 pt-3 cursor-pointer hover:opacity-90"
    >
      <input
        v-model="event.isOpen"
        type="checkbox"
        id="registerPage"
        class="cursor-pointer mb-3 mr-3 block w-6 h-6 rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
        @change="updateEvent('isOpen', event.isOpen, 0)"
      />

      {{ _local(['common', 'registerPage']) }}
    </label>

    <div
      class="ring-1 ring-gray-300 p-3 rounded"
      :class="[
        { 'opacity-50': !event.isOpen },
        { 'pointer-events-none': !event.isOpen },
      ]"
    >
      <label
        for="eventBacklinkText"
        class="block text-sm font-medium leading-6 text-gray-900"
      >
        {{ _local(['common', 'eventBacklinkText']) }}

        <span class="text-gray-400 italic">
          ({{ _local(['common', 'optional']) }})
        </span>
      </label>

      <input
        v-model="event.backlinkText"
        id="eventBacklinkText"
        class="mb-3 w-full block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
        @input="updateEvent('backlinkText', event.backlinkText)"
      />

      <label
        for="registerShowDates"
        class="flex text-sm font-medium leading-6 text-gray-900 cursor-pointer hover:opacity-90"
      >
        <input
          v-model="event.registerShowDates"
          type="checkbox"
          id="registerShowDates"
          class="cursor-pointer mb-3 mr-3 block w-6 h-6 rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
          @change="updateEvent('registerShowDates', event.registerShowDates, 0)"
        />

        {{ _local(['common', 'registerShowDates']) }}
      </label>

      <label
        for="showFideid"
        class="flex text-sm font-medium leading-6 text-gray-900 cursor-pointer hover:opacity-90"
      >
        <input
          v-model="event.showFideid"
          type="checkbox"
          id="showFideid"
          class="cursor-pointer mb-3 mr-3 block w-6 h-6 rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
          @change="updateEvent('showFideid', event.showFideid, 0)"
        />

        {{ _local(['common', 'showFideid']) }}
      </label>

      <label
        for="sendMailOnRegister"
        class="flex text-sm font-medium leading-6 text-gray-900 cursor-pointer hover:opacity-90"
      >
        <input
          v-model="event.sendMailOnRegister"
          type="checkbox"
          id="sendMailOnRegister"
          class="cursor-pointer mb-3 mr-3 block w-6 h-6 rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
          @change="
            updateEvent('sendMailOnRegister', event.sendMailOnRegister, 0)
          "
        />

        {{ _local(['common', 'eventSendMailOnRegister']) }}
      </label>

      <label
        for="hasGodfather"
        class="flex text-sm font-medium leading-6 text-gray-900 cursor-pointer hover:opacity-90"
      >
        <input
          v-model="event.hasGodfather"
          type="checkbox"
          id="hasGodfather"
          class="cursor-pointer mb-3 mr-3 block w-6 h-6 rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
          @change="updateEvent('hasGodfather', event.hasGodfather, 0)"
        />

        {{ _local(['common', 'eventHasGodfather']) }}
      </label>

      <div
        :class="[
          { 'opacity-50': !event.hasGodfather },
          { 'pointer-events-none': !event.hasGodfather },
        ]"
      >
        <label
          for="eventGodfatherInfoLink"
          class="block text-sm font-medium leading-6 text-gray-900"
        >
          {{ _local(['common', 'eventGodfatherInfoLink']) }}

          <span class="text-gray-400 italic">
            ({{ _local(['common', 'optional']) }})
          </span>
        </label>

        <input
          v-model="event.godfatherInfoLink"
          id="eventGodfatherInfoLink"
          class="mb-3 w-full block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
          @input="updateEvent('godfatherInfoLink', event.godfatherInfoLink)"
        />
      </div>

      <div class="text-center font-bold text-blue-500 hover:opacity-90">
        <a
          :href="`/register/${event.slug}`"
          target="_blank"
          class="inline-flex"
        >
          {{ _local(['common', 'checkRegisterPage']) }}
        </a>
      </div>
    </div>

    <label
      for="listingPage"
      class="flex text-sm font-medium leading-6 text-gray-900 pt-3 mt-3 cursor-pointer hover:opacity-90"
    >
      <input
        v-model="event.isListingOpen"
        type="checkbox"
        id="listingPage"
        class="cursor-pointer mb-3 mr-3 block w-6 h-6 rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
        @change="updateEvent('isListingOpen', event.isListingOpen, 0)"
      />

      {{ _local(['common', 'listingPage']) }}
    </label>

    <div
      class="ring-1 ring-gray-300 p-3 rounded"
      :class="[
        { 'opacity-50': !event.isListingOpen },
        { 'pointer-events-none': !event.isListingOpen },
      ]"
    >
      <div class="text-center font-bold text-blue-500 hover:opacity-90">
        <a :href="`/listing/${event.slug}`" target="_blank" class="inline-flex">
          {{ _local(['common', 'checkListingPage']) }}
        </a>
      </div>
    </div>
  </div>

  <div
    class="p-5 mx-auto"
    v-show="modalTab == 'dates'"
    ref="modalDates"
    style="max-width: 600px"
  >
    <button
      class="bg-green-700 hover:bg-green-600 flex w-full justify-center rounded-md px-3 py-1.5 mb-4 text-sm font-semibold leading-6 text-white shadow-sm ml-1"
      @click="toggleNewElement()"
    >
      <span v-html="_icon('calendar-plus', 'white', 24)" class="mr-2"></span>
      {{ _local(['common', 'createDate']) }}
    </button>

    <draggable
      v-model="event.dates"
      @start="dragging = true"
      @end="dragging = false"
      @change="updateDatePositions()"
      handle=".handle"
      item-key="id"
      v-bind="{
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
      }"
    >
      <template #item="{ element }">
        <div class="mb-3 flex items-center">
          <span
            v-html="_icon('grip-horizontal', _color.pick('pink'), 16)"
            class="cursor-grab hover:brightness-110 mr-2 handle"
          ></span>

          <div class="flex flex-grow flex-wrap">
            <VueDatePicker
              v-model="element.date"
              class="flex-grow mx-1"
              :format="_date.formatDatetime(element.date)"
              locale="fr"
              teleport-center
              auto-apply
              :placeholder="_local(['common', 'date'])"
              :enable-time-picker="false"
              month-name-format="long"
              style="width: 30%; min-width: 130px; max-width: 200px"
              menu-class-name="dp-custom-menu"
              :clearable="false"
              @update:model-value="updateDate(element)"
            >
            </VueDatePicker>

            <input
              type="text"
              v-model="element.title"
              class="flex-grow mb-1 mx-1 block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
              :placeholder="_local(['common', 'title'])"
              maxlength="18"
              style="height: 38px; width: 155px"
              @input="updateDate(element)"
            />
          </div>

          <div
            class="cursor-pointer rounded-full relative flex items-center justify-center hover:brightness-110 mr-1 command-button"
            :class="[
              { 'bg-orange-500': element.isLocked },
              { 'bg-green-600': !element.isLocked },
            ]"
            :title="
              element.isLocked
                ? _local(['common', 'isLockedTooltip'])
                : _local(['common', 'isNotLockedTooltip'])
            "
            @click="lockDate(element)"
          >
            <span
              v-html="
                _icon(
                  element.isHidden ? 'lock-fill' : 'unlock-fill',
                  'white',
                  20
                )
              "
            ></span>
          </div>

          <div
            class="cursor-pointer rounded-full relative flex items-center justify-center hover:brightness-110 command-button bg-gray-200"
            :title="_local(['common', 'delete'])"
            @click="deleteDate(element)"
          >
            <span v-html="_icon('trash-fill', _color.pick('red'), 20)"></span>
          </div>
        </div>
      </template>
    </draggable>

    <div class="mb-3 flex items-center" v-if="showAddDate">
      <span
        v-html="_icon('x-lg', 'black', 16)"
        class="cursor-pointer hover:opacity-70 mr-2"
        @click="showAddDate = false"
      ></span>

      <div class="flex flex-grow flex-wrap">
        <VueDatePicker
          v-model="newDateDate"
          class="flex-grow mx-1"
          locale="fr"
          teleport-center
          auto-apply
          :placeholder="_local(['common', 'date'])"
          :enable-time-picker="false"
          month-name-format="long"
          style="width: 30%; min-width: 130px; max-width: 200px"
          menu-class-name="dp-custom-menu"
          :clearable="false"
          :format="_date.formatDatetime(newDateDate?.toDateString())"
        ></VueDatePicker>

        <input
          v-model="newDateTitle"
          type="text"
          class="flex-grow mb-1 mx-1 block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
          :placeholder="_local(['common', 'title'])"
          maxlength="18"
          style="height: 38px; width: 155px"
          ref="newDateTitleInput"
          @keyup.enter="newDateDate ? createDate() : null"
        />
      </div>

      <span
        v-html="_icon('save-fill', !newDateDate ? 'grey' : 'green', 26)"
        class="cursor-pointer hover:brightness-110 ml-1"
        :class="[{ 'pointer-events-none': !newDateDate }]"
        @click="createDate()"
      ></span>
    </div>
  </div>

  <div class="mx-auto" v-show="modalTab == 'groups'">
    <div class="flex">
      <div class="w-64 flex-shrink-0">
        <div
          class="py-1 px-2 m-1 rounded bg-slate-700 text-white flex items-center"
        >
          <span v-html="_icon('calendar3', 'white', 20)" class="mr-2"></span>

          {{ _local(['common', 'dates']) }}
        </div>

        <div
          v-for="(date, i) in event.dates"
          class="cursor-pointer py-1 px-2 m-1 rounded hover:bg-slate-600 hover:text-white"
          :class="[
            { 'bg-slate-300': selectedDateIndex != i },
            { 'bg-slate-600': selectedDateIndex == i },
            { 'text-white': selectedDateIndex == i },
          ]"
          @click="selectedDateIndex = i"
        >
          <div class="font-bold">
            {{ date.title }}
            ({{ date.groups.length }})
          </div>

          <div>
            {{ _date.formatDatetime(String(date.date)) }}
          </div>
        </div>
      </div>

      <div class="w-64 flex-shrink-0 mx-1">
        <div
          class="py-1 px-2 m-1 rounded bg-slate-700 text-white flex items-center"
        >
          <span v-html="_icon('people', 'white', 20)" class="mr-2"></span>
          {{ _local(['common', 'withoutGroup']) }}
        </div>

        <draggable
          v-model="groupsUserList[selectedDateIndex]"
          item-key="id"
          class="bg-slate-200 rounded px-1 pb-1"
          style="padding-top: 1px; min-height: 400px"
          @end="updateGroupUser"
          :data-groupid="0"
          v-bind="{
            animation: 200,
            group: 'people',
            disabled: false,
            ghostClass: 'ghost',
          }"
        >
          <template #item="{ element }">
            <div
              class="cursor-grab py-1 px-2 mt-1 rounded bg-orange-300 hover:bg-orange-700 hover:text-white text-sm flex items-center z-10"
            >
              <div class="flex-grow">
                {{ element.userLink.alias }}

                <small v-if="element.userLink.elo">
                  ({{ element.userLink.elo }})
                </small>
              </div>

              <div
                v-if="
                  event.userLinks.find((u) => u.id == element.userLink.id)
                    ?.isMotorized
                "
              >
                <span
                  v-html="_icon('car-front-fill', _color.pick('blue'), 20)"
                ></span>
              </div>

              <div
                class="w-4 h-4 ml-2 rounded-full flex-shrink-0"
                :class="[
                  {
                    'bg-gray-600':
                      event.dates[selectedDateIndex].availabilities.find(
                        (a) => a.userId == element.userLink.user.id
                      )?.isAvailable == undefined,
                  },
                  {
                    'bg-red-600':
                      event.dates[selectedDateIndex].availabilities.find(
                        (a) => a.userId == element.userLink.user.id
                      )?.isAvailable == false,
                  },
                  {
                    'bg-green-600':
                      event.dates[selectedDateIndex].availabilities.find(
                        (a) => a.userId == element.userLink.user.id
                      )?.isAvailable == true,
                  },
                ]"
              ></div>
            </div>
          </template>
        </draggable>
      </div>

      <div>
        <!-- <button @click="createSingleGroup()">
          {{ _local(['common', 'addMultipleGroup']) }}
        </button> -->

        <div class="flex flex-wrap">
          <div
            v-for="group in selectedDateGroups"
            class="border border-slate-500 w-64 m-1 rounded relative"
            style="min-height: 120px"
          >
            <div class="flex items-center">
              <input
                type="text"
                v-model="group.name"
                class="border bg-transparent my-1 ml-1 rounded flex-grow"
                @input="updateGroup(group)"
                :placeholder="_local(['common', 'groupName'])"
              />

              <span
                @click="deleteGroup(group)"
                v-html="_icon('trash-fill', _color.pick('red'), 20)"
                class="m-2 cursor-pointer"
              ></span>
            </div>

            <draggable
              v-model="group.groupUsers"
              item-key="id"
              style="
                position: relative;
                top: 0px;
                min-height: 44px;
                height: calc(100% - 50px);
              "
              @end="updateGroupUser"
              :data-groupid="group.id"
              v-bind="{
                animation: 200,
                group: 'people',
                disabled: false,
                ghostClass: 'ghost',
              }"
            >
              <template #item="{ element }">
                <div
                  class="cursor-grab py-1 px-2 m-1 rounded bg-blue-300 hover:bg-blue-500 hover:text-white text-sm flex items-center z-10"
                >
                  <div class="flex flex-grow justify-between">
                    <div>
                      {{ element.userLink.alias }}

                      <small v-if="element.userLink.elo">
                        ({{ element.userLink.elo }})
                      </small>
                    </div>

                    <div
                      v-if="
                        event.userLinks.find((u) => u.id == element.userLink.id)
                          ?.isMotorized
                      "
                    >
                      <span
                        v-html="
                          _icon('car-front-fill', _color.pick('blue'), 20)
                        "
                      ></span>
                    </div>
                  </div>
                </div>
              </template>
            </draggable>

            <div
              v-if="group.groupUsers.length == 0"
              class="border-2 border-gray-300 border-dashed rounded m-2 p-2 flex justify-center items-center text-gray-400 z-0"
              style="position: absolute; top: 50px; width: calc(100% - 15px)"
            >
              {{ _local(['common', 'dropUserHere']) }}
            </div>
          </div>

          <div
            class="cursor-pointer border border-slate-500 rounded w-64 m-1 flex flex-col justify-center items-center hover:bg-slate-900"
            style="height: 120px"
            @click="createSingleGroup()"
          >
            <span v-html="_icon('plus', 'rgb(100 116 139)', 50)"></span>

            <div class="text-slate-500 text-center px-2 text-sm">
              {{ _local(['common', 'createSingleGroup']) }}
            </div>
          </div>

          <div
            class="cursor-pointer border border-slate-500 rounded w-64 m-1 flex flex-col justify-center items-center hover:bg-slate-900"
            style="height: 120px"
            @click="createMultipleGroupsDialog.showModal()"
          >
            <span v-html="_icon('database-add', 'rgb(100 116 139)', 50)"></span>

            <div class="text-slate-500 text-center px-2 text-sm">
              {{ _local(['common', 'createMultipleGroups']) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    class="mx-auto"
    v-show="modalTab == 'people'"
    ref="modalPeople"
    style="max-width: 1000px"
  >
    <div
      class="max-w-full w-full absolute left-0 overflow-auto"
      style="height: calc(100vh - 124px)"
    >
      <table class="border-collapse w-full">
        <thead class="sticky top-0 z-10">
          <tr>
            <th
              v-for="(keyword, i) in computedManagedFields"
              class="font-bold bg-gray-200 text-gray-600 border border-gray-300 text-sm cursor-pointer hover:brightness-105 last:pointer-events-none"
              :class="{ 'px-3 py-1': i != 0 }"
              @click="sortUserLinksBy(keyword.field)"
            >
              <div v-if="i == 0" class="flex justify-center">
                <span
                  v-html="_icon('save-fill', _color.pick('green', -2), 24)"
                  :title="_local(['common', 'savePeoplePosition'])"
                  @click="updateUserLinkPositions()"
                ></span>
              </div>

              {{ _local(['common', keyword.locale]) }}
            </th>
          </tr>
        </thead>

        <draggable
          v-model="event.userLinks"
          @start="dragging = true"
          @end="dragging = false"
          handle=".handle"
          item-key="id"
          v-bind="{
            animation: 200,
            group: 'description',
            disabled: false,
            ghostClass: 'ghost',
          }"
          :tag="'tbody'"
          class="bg-white"
        >
          <template #item="{ element }">
            <tr class="hover:bg-gray-100">
              <td class="text-center border p-2 handle cursor-grab">
                <span
                  v-html="_icon('grip-horizontal', _color.pick('pink'), 16)"
                ></span>
              </td>

              <td class="border h-6 p-0">
                <input
                  type="text"
                  v-model="element.alias"
                  class="border-none text-sm h-full w-full bg-transparent"
                  style="min-width: 200px"
                  @input="updateUserLink(element, 'alias', 300)"
                />
              </td>

              <td class="border h-6 p-0">
                <div class="flex">
                  <input
                    type="text"
                    v-model="element.user.email"
                    class="border-none text-sm h-full w-full"
                    style="min-width: 200px"
                  />

                  <div
                    v-if="element.user.email != getEmail(element)"
                    class="cursor-pointer flex items-center justify-center hover:brightness-110 px-2 rounded-md"
                    style="margin-left: 2px"
                    :class="
                      isValidEmail(element.user.email) &&
                      !cloneEvent.userLinks.find(
                        (u: EventUser) => u.user.email == element.user.email
                      )
                      ? 'bg-green-600'
                      : 'bg-gray-500 pointer-events-none'
                    "
                    :title="_local(['common', 'updateEmail'])"
                    @click="updateUserEmail(element)"
                  >
                    <span v-html="_icon('save', 'white', 20)"></span>
                  </div>
                </div>
              </td>

              <td class="border h-6 p-0">
                <input
                  type="text"
                  v-model="element.phone"
                  class="border-none text-sm h-full w-full bg-transparent"
                  style="min-width: 100px"
                  @input="updateUserLink(element, 'phone', 300)"
                />
              </td>

              <td class="border h-6 p-0" style="max-width: 200px">
                <div class="flex items-center h-full">
                  <img
                    v-if="element.nationality"
                    :src="`https://flagcdn.com/h20/${element.nationality}.png`"
                    class="mx-1"
                  />

                  <select
                    v-model="element.nationality"
                    class="border-none text-sm bg-transparent h-full"
                    style="min-width: 105px"
                    @change="updateUserLink(element, 'nationality', 300)"
                  >
                    <option
                      v-for="ctry in country.countries.all"
                      :value="ctry.alpha2.toLowerCase()"
                    >
                      {{ ctry.name }}
                    </option>
                  </select>
                </div>
              </td>

              <td class="border h-6">
                <input
                  type="text"
                  v-model="element.fideid"
                  class="border-none text-sm h-full w-full bg-transparent"
                  style="min-width: 120px"
                  @input="updateUserLink(element, 'fideid', 300)"
                />
              </td>

              <td class="border h-6">
                <input
                  type="text"
                  v-model="element.elo"
                  class="border-none text-sm h-full w-full bg-transparent"
                  style="min-width: 60px"
                  @input="updateUserLink(element, 'elo', 300)"
                />
              </td>

              <td class="border h-6">
                <input
                  type="text"
                  v-model="element.club"
                  class="border-none text-sm h-full w-full bg-transparent"
                  style="min-width: 125px"
                  @input="updateUserLink(element, 'club', 300)"
                />
              </td>

              <td class="border h-6 p-0">
                <ClientOnly>
                  <textarea
                    v-model="element.note"
                    class="border-none text-sm p-1 relative h-full w-full bg-gray-100"
                    style="top: 3px; min-width: 200px"
                    disabled
                    rows="1"
                  >
                  </textarea>
                </ClientOnly>
              </td>

              <td class="border h-6 p-0" v-if="event.hasGodfather">
                <input
                  type="text"
                  v-model="element.godfather"
                  class="border-none text-sm h-full w-full bg-gray-100"
                  style="min-width: 130px"
                  disabled
                />
              </td>

              <td
                class="text-center border h-6 p-0"
                v-if="event.showIsMotorized"
              >
                <input
                  type="checkbox"
                  v-model="element.isMotorized"
                  class="cursor-pointer"
                  @input="
                    ;(element.isMotorized = !element.isMotorized),
                      updateUserLink(element, 'isMotorized', 0)
                  "
                />
              </td>

              <td class="text-center border h-6 p-0" v-if="event.showIsReserve">
                <input
                  type="checkbox"
                  v-model="element.isReserve"
                  class="cursor-pointer"
                  @input="
                    ;(element.isReserve = !element.isReserve),
                      updateUserLink(element, 'isReserve', 0)
                  "
                />
              </td>

              <td class="text-center border p-0" v-if="!event.isFree">
                <input
                  type="checkbox"
                  v-model="element.hasPaid"
                  class="cursor-pointer"
                  @input="
                    ;(element.hasPaid = !element.hasPaid),
                      updateUserLink(element, 'hasPaid', 0)
                  "
                />
              </td>

              <td class="border h-6 p-0" v-if="!event.isFree">
                <ClientOnly>
                  <textarea
                    v-model="element.paymentNote"
                    class="border-none text-sm p-1 relative h-full w-full bg-transparent"
                    style="top: 3px; min-width: 170px"
                    rows="1"
                    @input="updateUserLink(element, 'paymentNote', 300)"
                  >
                  </textarea>
                </ClientOnly>
              </td>

              <td class="text-center border h-6 p-0">
                <input
                  type="checkbox"
                  v-model="element.isHidden"
                  class="cursor-pointer"
                  @input="
                    ;(element.isHidden = !element.isHidden),
                      updateUserLink(element, 'isHidden', 0)
                  "
                />
              </td>

              <td class="text-center border h-6 p-0">
                <input
                  type="checkbox"
                  v-model="element.isValidated"
                  class="cursor-pointer"
                  @input="
                    ;(element.isValidated = !element.isValidated),
                      updateUserLink(element, 'isValidated', 0)
                  "
                />
              </td>

              <td class="text-center border h-6 p-0">
                <input
                  type="checkbox"
                  v-model="element.isOwner"
                  class="cursor-pointer"
                  :disabled="element.userId == loggedUserId"
                  :class="{
                    'pointer-events-none': element.userId == loggedUserId,
                    'text-gray-400': element.userId == loggedUserId,
                  }"
                  @change="updateUserLink(element, 'isOwner', 0)"
                />
              </td>

              <td class="text-center border h-6 p-0">
                <div class="w-full h-full flex justify-center items-center">
                  <div
                    class="cursor-pointer rounded-full relative flex items-center justify-center hover:brightness-110"
                    style="height: 26px; width: 26px"
                    :class="[
                      { 'bg-red-500': !element.isPasswordSent },
                      { 'bg-green-600': element.isPasswordSent },
                    ]"
                    :title="
                      element.isPasswordSent
                        ? _local(['common', 'passwordSent'])
                        : _local(['common', 'passwordNotSent'])
                    "
                    @click="sendPassword(element)"
                  >
                    <span
                      v-html="
                        _icon(
                          element.isPasswordSent
                            ? 'envelope-check-fill'
                            : 'envelope-x-fill',
                          'white',
                          16
                        )
                      "
                    ></span>
                  </div>
                </div>
              </td>

              <td class="text-center border h-6 p-0">
                <div
                  class="cursor-pointer relative flex items-center justify-center hover:brightness-110 command-button"
                  style="top: 0"
                  :class="{
                    'pointer-events-none': element.userId == loggedUserId,
                  }"
                  :title="_local(['common', 'delete'])"
                  @click="deleteUserLink(element)"
                >
                  <span
                    v-html="
                      _icon(
                        'trash-fill',
                        _color.pick(
                          element.userId == loggedUserId ? 'grey' : 'red'
                        ),
                        20
                      )
                    "
                  ></span>
                </div>
              </td>
            </tr>
          </template>
        </draggable>
      </table>

      <div class="flex justify-center sticky left-0 bottom-0 mt-4">
        <button
          class="bg-green-700 hover:bg-green-600 flex w-96 justify-center rounded-md px-3 py-1.5 mb-4 text-sm font-semibold leading-6 text-white shadow-sm mt-1"
          @click="addUserDialog.showModal()"
        >
          <span
            v-html="_icon('person-fill-add', 'white', 24)"
            class="mr-2"
          ></span>
          {{ _local(['common', 'createUser']) }}
        </button>
      </div>
    </div>
  </div>

  <dialog
    ref="addUserDialog"
    @mousedown="closeDialog($event, addUserDialog)"
    class="w-96"
  >
    <div class="mb-2">
      <label for="newUserAlias" class="text-xs font-bold">
        {{ _local(['common', 'names']) }}
      </label>

      <input
        id="newUserAlias"
        v-model="newUserAlias"
        type="text"
        class="w-full block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-sm leading-6"
        :placeholder="_local(['common', 'names'])"
      />
    </div>

    <div class="mb-4">
      <label for="newUserEmail" class="text-xs font-bold">
        {{ _local(['common', 'email']) }}
      </label>

      <input
        id="newUserEmail"
        v-model="newUserEmail"
        type="text"
        class="w-full mb-1 block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset text-sm leading-6"
        :placeholder="_local(['common', 'email'])"
        :class="[
          {
            'focus:ring-red-600':
              (newUserEmail && !isValidEmail(newUserEmail)) ||
              event.userLinks.find((u) => u.user.email == newUserEmail),
            'focus:ring-green-700':
              isValidEmail(newUserEmail) &&
              !event.userLinks.find((u) => u.user.email == newUserEmail),
          },
        ]"
      />
    </div>

    <button
      class="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm"
      :class="
        !(
          newUserAlias &&
          ((newUserEmail &&
            isValidEmail(newUserEmail) &&
            !event.userLinks.find((u) => u.user.email == newUserEmail)) ||
            !newUserEmail)
        )
          ? 'pointer-events-none bg-gray-500'
          : 'bg-green-700 hover:bg-green-600 '
      "
      @click="createUser(), addUserDialog.close()"
    >
      <span v-html="_icon('person-fill-add', 'white', 24)" class="mr-2"></span>

      {{ _local(['common', 'createUser']) }}
    </button>
  </dialog>

  <dialog
    ref="createMultipleGroupsDialog"
    @mousedown="closeDialog($event, createMultipleGroupsDialog)"
    class="w-96"
  >
    <div class="mb-2">
      <label for="newUserAlias" class="text-xs font-bold">
        {{ _local(['common', 'groupName']) }}
      </label>

      <input
        id="createMultipleGroupsInput"
        v-model="createMultipleGroupsInput"
        type="text"
        class="w-full block rounded border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-sm leading-6"
        :placeholder="_local(['common', 'groupName'])"
      />
    </div>

    <button
      class="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm bg-green-700 hover:bg-green-600"
      @click="createMultipleGroups(), createMultipleGroupsDialog.close()"
    >
      <span v-html="_icon('database-add', 'white', 24)" class="mr-2"></span>

      {{ _local(['common', 'createMultipleGroups']) }}
    </button>
  </dialog>
</template>

<script setup lang="ts">
import country from 'country-data'
import draggable from 'vuedraggable'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const route = useRoute()

const loggedUserId = useCookie<Number>('userId')
const slug = route.params.slug

let requestedEvent = await _fetch('/api/getEventBySlug', {
  slug: slug,
})

//console.log(requestedEvent)

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
let selectedDateIndex = ref(0)
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
const addUserDialog = ref()
const createMultipleGroupsDialog = ref()
const createMultipleGroupsInput = ref()
let groupsUserList = ref<any[]>([])

let sortInfo: any = { field: null, order: 'ascent' }

let selectedDateGroups = computed(() => {
  return event.value.dates[selectedDateIndex.value].groups
})

let computedManagedFields = computed<any[]>(() => {
  let managedFields = []

  managedFields.push({ field: '', locale: '' })
  managedFields.push({ field: 'alias', locale: 'names' })
  managedFields.push({ field: 'email', locale: 'email' })
  managedFields.push({ field: 'phone', locale: 'phoneShort' })
  managedFields.push({ field: 'nationality', locale: 'nationality' })
  managedFields.push({ field: 'fideid', locale: 'fideid' })
  managedFields.push({ field: 'elo', locale: 'elo' })
  managedFields.push({ field: 'club', locale: 'club' })
  managedFields.push({ field: 'note', locale: 'notes' })

  if (event.value.hasGodfather) {
    managedFields.push({ field: 'godfather', locale: 'godfather' })
  }

  if (event.value.showIsMotorized) {
    managedFields.push({ field: 'isMotorized', locale: 'motorized' })
  }

  if (event.value.showIsReserve) {
    managedFields.push({ field: 'isReserve', locale: 'reserve' })
  }

  if (!event.value.isFree) {
    managedFields.push({ field: 'hasPaid', locale: 'paid' })
    managedFields.push({ field: 'paymentNote', locale: 'paymentNote' })
  }

  managedFields.push({ field: 'isHidden', locale: 'hidden' })
  managedFields.push({ field: 'isValidated', locale: 'validated' })
  managedFields.push({ field: 'isOwner', locale: 'owner' })
  managedFields.push({ field: 'isPasswordSent', locale: 'passwordSentShort' })
  managedFields.push({ field: '', locale: '' })

  return managedFields
})

for (const date of event.value.dates) {
  let userList = []
  let filteredList = []

  for (const group of date.groups) {
    group.groupUsers.sort(
      (a: GroupUser, b: GroupUser) => a.position - b.position
    )

    for (const groupUser of group.groupUsers) {
      userList.push(groupUser)
    }
  }

  let i = 0

  for (const user of event.value.userLinks) {
    if (!userList.find((u: GroupUser) => u.userLink.id == user.id)) {
      filteredList.push({ userLink: user, position: i })
      i += 1
    }
  }

  groupsUserList.value.push(filteredList)
}

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

function sortUserLinksBy(field: string) {
  if (sortInfo.field == field && sortInfo.order == 'ascent') {
    sortInfo.order = 'descent'
  } else if (sortInfo.field == field && sortInfo.order == 'descent') {
    sortInfo.order = 'ascent'
  } else {
    sortInfo.order = 'ascent'
  }

  sortInfo.field = field

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

      if (sortInfo.order == 'ascent') {
        if (x) return y ? String(x).localeCompare(String(y)) : -1
        else if (y) return x ? String(y).localeCompare(String(x)) : 1
      } else {
        if (x) return y ? String(y).localeCompare(String(x)) : -1
        else if (y) return x ? String(x).localeCompare(String(y)) : 1
      }

      return 0
    })
  } else if (boolFields.includes(field)) {
    event.value.userLinks.sort((a: EventUser, b: EventUser) => {
      let x = a[field as keyof EventUser]
      let y = b[field as keyof EventUser]

      if (sortInfo.order == 'ascent') {
        return Number(y) - Number(x)
      } else {
        return Number(x) - Number(y)
      }
    })
  } else if (field == 'email') {
    event.value.userLinks.sort((a: EventUser, b: EventUser) => {
      let x = a.user.email
      let y = b.user.email

      if (sortInfo.order == 'ascent') {
        if (x) return y ? x.localeCompare(y) : -1
        else if (y) return x ? y.localeCompare(x) : 1
      } else {
        if (x) return y ? x.localeCompare(y) : 1
        else if (y) return x ? y.localeCompare(x) : -1
      }

      return 0
    })
  }
}

/*
 CRUD METHODS
*/

// Event

async function updateEvent(key: any, value: any, throttle: number = 300) {
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
  }, throttle)
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

  // setTimeout(() => {
  //   modalPeople.value.scrollTo(0, 9999999)
  // }, 10)

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

// Groups

async function createSingleGroup() {
  const newGroup = await _fetch('/api/createSingleGroup', {
    dateId: event.value.dates[selectedDateIndex.value].id,
  })

  event.value.dates[selectedDateIndex.value].groups.push(newGroup)
}

async function updateGroup(group: Group) {
  fetchIsLoading.value = true
  clearTimeout(fetchThrottleTimer)

  fetchThrottleTimer = setTimeout(async () => {
    const newGroup = await _fetch('/api/updateGroup', {
      groupId: group.id,
      name: group.name,
    })

    fetchIsLoading.value = false
  }, 500)
}

async function deleteGroup(group: Group) {
  await _fetch('/api/deleteGroup', {
    groupId: group.id,
  })

  for (const groupUser of group.groupUsers) {
    groupsUserList.value[selectedDateIndex.value].push(groupUser)
  }

  const groups = event.value.dates[selectedDateIndex.value].groups.filter(
    (g: Group) => g.id != group.id
  )

  event.value.dates[selectedDateIndex.value].groups = groups
}

async function updateGroupUser(e: any) {
  const userLink = e.item._underlying_vm_.userLink
  const oldGroupId = e.from.dataset.groupid
  const newGroupId = e.to.dataset.groupid
  let groupPositionsUpdates = []
  let newGroup = null
  let oldGroup = null

  if (newGroupId != 0) {
    for (const date of event.value.dates) {
      newGroup = date.groups.find((g: Group) => g.id == newGroupId)

      if (newGroup) break
    }
  }

  if (oldGroupId != 0) {
    for (const date of event.value.dates) {
      oldGroup = date.groups.find((g: Group) => g.id == oldGroupId)

      if (oldGroup) break
    }
  }

  // console.log('oldGroup:', oldGroup)
  // console.log('newGroup:', newGroup)

  const newGroupUser = await _fetch('/api/updateGroupUser', {
    userLinkId: userLink.id,
    oldGroupId: oldGroupId,
    newGroupId: newGroupId,
  })

  if (oldGroupId == 0 && newGroupId != 0) {
    let groupUser = newGroup?.groupUsers.find(
      (gu: GroupUser) => gu.userLink.id == userLink.id
    )

    if (groupUser) {
      groupUser.id = newGroupUser.id
    }
  }

  if (newGroup) {
    for (let index in newGroup.groupUsers) {
      groupPositionsUpdates.push({
        groupUserId: newGroup.groupUsers[index].id,
        position: Number(index),
      })

      newGroup.groupUsers[index].position = Number(index)
    }
  }

  if (oldGroup) {
    for (let index in oldGroup.groupUsers) {
      groupPositionsUpdates.push({
        groupUserId: oldGroup.groupUsers[index].id,
        position: Number(index),
      })

      oldGroup.groupUsers[index].position = Number(index)
    }
  }

  await _fetch('/api/updateGroupUserPosition', {
    updates: JSON.stringify(groupPositionsUpdates),
  })
}

async function createMultipleGroups() {
  let newGroups = await _fetch('/api/createMultipleGroups', {
    eventId: event.value.id,
    name: createMultipleGroupsInput.value,
  })

  if (newGroups) {
    newGroups = JSON.parse(newGroups)

    for (let date of event.value.dates) {
      const targetGroup = newGroups.find((g: Group) => g.dateId == date.id)
      date.groups.push(targetGroup)
    }
  }

  createMultipleGroupsInput.value = ''
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

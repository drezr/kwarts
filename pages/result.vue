<template>
  <button @click="addDivision()" class="border border-gray-500 m-1 p-3">
    Add division
  </button>

  <button @click="copyHTML()" class="border border-gray-500 m-1 p-3">
    Copy HTML
  </button>

  <div
    v-for="division in divisions"
    class="m-1 p-1 border border-gray-400 w-fit flex items-center"
  >
    <div>
      <input class="block w-96 mb-1" type="text" v-model="division.title" />
      <input class="block w-96" type="text" v-model="division.results" />
    </div>

    <div class="text-3xl text-red-500 ml-1">
      <button @click="deleteDivision(division)">x</button>
    </div>
  </div>

  <div
    id="targetNode"
    style="
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
        'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif,
        'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
        'Noto Color Emoji';
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    "
  >
    <div v-for="division in divisions">
      <div
        style="
          margin: 0px 10px 0px 10px;
          font-weight: bold;
          font-size: 24px;
          text-align: center;
        "
      >
        {{ division.title }}
      </div>

      <div
        style="
          border: 1px rgb(156 163 175) solid;
          width: fit-content;
          margin: 10px;
        "
      >
        <div
          v-for="(result, i) in JSON.parse(division.results)"
          style="display: flex"
          :style="i % 2 ? 'background-color: rgb(241 245 249);' : ''"
        >
          <div style="width: 256px; padding: 4px; text-align: right">
            {{ result.fullname_home }}
            <small style="color: rgb(107 114 128)"
              >({{ result.rating_home }})</small
            >
          </div>
          <div style="width: 144px; padding: 4px; text-align: center">
            {{ result.result }}
          </div>
          <div style="width: 256px; padding: 4px">
            {{ result.fullname_visit }}
            <small style="color: rgb(107 114 128)"
              >({{ result.rating_visit }})</small
            >
          </div>
        </div>

        <div
          style="
            display: flex;
            justify-content: center;
            align-items: center;
            height: 40px;
            border-top: 1px rgb(156 163 175) solid;
          "
          v-if="JSON.parse(division.results).length > 0"
        >
          <div>{{ calcResult(division.results) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

let divisions = ref<any[]>([])

function addDivision() {
  divisions.value.push({
    id: Math.random(),
    title: '',
    results: '[]',
  })
}

function deleteDivision(division: any) {
  divisions.value = divisions.value.filter((d: any) => d.id !== division.id)
}

function calcResult(results: any) {
  let homeResult = 0
  let visitResult = 0

  for (let result of JSON.parse(results)) {
    let hr = result.result.split('-')[0]
    let vr = result.result.split('-')[1]

    if (hr == '1') {
      homeResult++
    }

    if (hr == '½') {
      homeResult += 0.5
      visitResult += 0.5
    }

    if (hr == '0') {
      visitResult++
    }
  }

  return `${homeResult} - ${visitResult}`
}

function copyHTML() {
  let node = document.getElementById('targetNode')

  if (node) {
    navigator.clipboard.writeText(node.outerHTML)
  }
}
</script>

<style></style>

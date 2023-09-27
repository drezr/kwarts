<template>
  <div class="flex justify-center items-center m-1">
    <input
      type="number"
      v-model="targetClubId"
      class="mr-2 w-24 h-12 rounded"
      placeholder="Club"
      v-on:keyup.enter="getData()"
    />

    <input
      type="number"
      v-model="targetRound"
      class="mr-2 w-24 h-12 rounded"
      placeholder="Round"
      v-on:keyup.enter="getData()"
    />

    <button
      @click="getData()"
      class="border border-gray-500 p-3 h-12 mr-2 rounded"
      :disabled="!targetClubId || !targetRound"
      :class="{ 'opacity-20': !targetClubId || !targetRound }"
    >
      GO
    </button>

    <button @click="copyHTML()" class="border border-gray-500 p-3 h-12 rounded">
      Copy HTML
    </button>
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
          margin-top: 20px;
          font-weight: bold;
          font-size: 22px;
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
          v-for="(result, i) in division.results"
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
            background-color: rgba(148, 163, 184, 0.4);
            font-weight: bold;
          "
          v-if="division.results.length > 0"
        >
          <div>{{ calcResult(division.results) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  link: [{ rel: 'icon', type: 'image/png', href: '/kwarts_logo_mini.png' }],
  title: 'ICN 2023 - 2024 FRBE-KBSK-KSB',
})

definePageMeta({
  layout: false,
})

let targetClubId = ref<Number>()
let targetRound = ref<Number>()

let divisions = ref<any[]>([])

async function getData() {
  if (!targetClubId.value || !targetRound.value) return

  divisions.value = []

  const reqDivisions = await _fetch(
    'http://152.228.175.239:3456/https://www.frbe-kbsb-ksb.be/api/v1/interclubs/anon/icseries',
    {
      idclub: targetClubId.value,
      round: targetRound.value,
    }
  )

  for (const division of reqDivisions) {
    let targetEncounter = division.rounds[0].encounters.find(
      (e: any) =>
        e.icclub_home == targetClubId || e.icclub_visit == targetClubId.value
    )

    let home = division.teams.find(
      (t: any) => t.idclub == targetEncounter.icclub_home
    )
    let visitor = division.teams.find(
      (t: any) => t.idclub == targetEncounter.icclub_visit
    )

    const results = await _fetch(
      'http://152.228.175.239:3456/https://www.frbe-kbsb-ksb.be/api/v1/interclubs/anon/icresultdetails',
      {
        division: home.division,
        index: home.index,
        round: targetRound.value,
        icclub_home: targetEncounter.icclub_home,
        icclub_visit: targetEncounter.icclub_visit,
      }
    )

    divisions.value.push({
      id: Math.random(),
      title: `Division ${home.division}${home.index}: ${home.name} - ${visitor.name}`,
      results: results,
    })
  }
}

function calcResult(results: any) {
  let homeResult = 0
  let visitResult = 0

  for (let result of results) {
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

  alert(_local(['common', 'textCopiedToClipboard']))
}
</script>

<style></style>

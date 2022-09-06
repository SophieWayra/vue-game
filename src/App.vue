<!-- eslint-disable vue/require-v-for-key -->
<script setup lang="ts">
import type { PlayCell } from "./types/play-cell";
import { Colors } from "./types/play-cell";
import { ref, onMounted } from "vue";
import type { Ref } from "vue";

const playField: Ref<PlayCell[][]> = ref([]);

onMounted(() => {
  playField.value = [];
  for (let i = 0; i < 10; i++) {
    const playRow: PlayCell[] = [];
    for (let j = 0; j < 10; j++) {
      const color = Colors[Math.floor(Math.random() * 4)] as
        | "red"
        | "blue"
        | "green"
        | "yellow";
      playRow.push({
        color,
        checked: false,
        rowIndex: i,
      });
    }

    playField.value.push(playRow);
  }
})

function select(cell: PlayCell) {
  if (!cell.checked) {
    unselectAll();
    cell.checked = !cell.checked;
    selectNeighbours(cell);
  } else {
    removeSelectedCells();
  }
}

function unselectAll() {
  playField.value.forEach(row => row.forEach(cell => cell.checked = false))
}

function selectNeighbours(cell: PlayCell) {
  const cellIndex = playField.value[cell.rowIndex].indexOf(cell);
  const neighbours = [
    (playField.value[cell.rowIndex] ?? [])[cellIndex - 1],
    (playField.value[cell.rowIndex] ?? [])[cellIndex + 1],
    (playField.value[cell.rowIndex + 1] ?? [])[cellIndex],
    (playField.value[cell.rowIndex - 1] ?? [])[cellIndex],
  ];

  const filteredNeighbours = neighbours.filter(item => item !== undefined && item?.color === cell.color && item.checked !== cell.checked);
  filteredNeighbours.forEach(item => item.checked = cell.checked);
  if (filteredNeighbours.length) {
    filteredNeighbours.forEach(item => {
      selectNeighbours(item);
    });
  }
}

function removeSelectedCells() {
  playField.value = playField.value.map(row => row.filter(cell => !cell.checked));
}

</script>

<template>
  <div class="play-field">
    <div
      v-for="(column, rowIndex) of playField"
      class="row"
    >
      <button
        v-for="(cell, cellIndex) of column"
        @click="select(cell, rowIndex, cellIndex)"
        class="cell"
        :class="[{selected: cell.checked}, cell.color]"
      >
        <!-- {{ [rowIndex, cellIndex] }} -->
      </button>
    </div>
  </div>

</template>

<style scoped>
.play-field {
  padding: 40px;
  display: flex;
}

.row {
  display: flex;
  flex-direction: column-reverse;
}

.cell {
  width: 60px;
  height: 60px;
  border: 1px solid grey;
}

.red {
  background-color: rgb(255, 75, 111);
}

.green {
  background-color: rgb(0, 202, 17);
}

.blue {
  background-color: rgb(40, 54, 255);
}

.yellow {
  background-color: rgb(223, 208, 0);
}

.selected {
  opacity: 0.7;
}
</style>

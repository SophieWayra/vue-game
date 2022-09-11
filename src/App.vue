<!-- eslint-disable vue/require-v-for-key -->
<script setup lang="ts">
import type { PlayCell, PlayRow } from "./types/play-cell";
import { Colors } from "./types/play-cell";
import { ref, onMounted } from "vue";
import type { Ref } from "vue";

const playField: Ref<PlayRow[]> = ref([]);

onMounted(() => {
  playField.value = [];
  for (let i = 0; i < 15; i++) {
    const rowId = i + 1;
    const playRow: PlayRow = {
      id: rowId,
      children: [],
    };
    for (let j = 0; j < 10; j++) {
      const color = Colors[Math.floor(Math.random() * 5)] as
        | "red"
        | "blue"
        | "green"
        | "yellow";
      playRow.children.push({
        id: j + 1,
        color,
        checked: false,
        parentId: rowId,
      });
    }

    playField.value.push(playRow);
  }
});

function select(cell: PlayCell) {
  if (!cell.checked) {
    unselectAll();
    const area = getArea(cell, new Set([cell]));
    if (area.size > 1) {
      area.forEach((cell) => (cell.checked = true));
    }
  } else {
    removeSelectedCells();
  }
}

function unselectAll() {
  playField.value.forEach((row) =>
    row.children.forEach((cell) => (cell.checked = false))
  );
}

function getArea(cell: PlayCell, area: Set<PlayCell>): Set<PlayCell> {
  const neighbours = getSameColorNeighbours(cell);

  const unchecked = difference<PlayCell>(new Set(neighbours), area);

  area = new Set([...area, ...neighbours]);

  unchecked.forEach((cell) => (area = union(area, getArea(cell, area))));

  return area;
}

function removeSelectedCells() {
  playField.value = playField.value
    .map((row) => ({
      ...row,
      children: row.children.filter((cell) => !cell.checked),
    }))
    .filter((row) => row.children.length > 0);
}

function getSameColorNeighbours(cell: PlayCell) {
  const rowIndex = playField.value.findIndex((row) => row.id === cell.parentId);
  const cellIndex = playField.value[rowIndex].children.indexOf(cell);
  const neighbours = [
    (playField.value[rowIndex]?.children ?? [])[cellIndex - 1],
    (playField.value[rowIndex]?.children ?? [])[cellIndex + 1],
    (playField.value[rowIndex + 1]?.children ?? [])[cellIndex],
    (playField.value[rowIndex - 1]?.children ?? [])[cellIndex],
  ];

  const filteredNeighbours = neighbours.filter(
    (item) => item !== undefined && item?.color === cell.color
  );

  return filteredNeighbours;
}

function difference<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  const _difference = new Set(setA);
  for (const elem of setB) {
    _difference.delete(elem);
  }
  return _difference;
}

function union<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  const _union = new Set(setA);
  for (const elem of setB) {
    _union.add(elem);
  }
  return _union;
}
</script>

<template>
  <div class="play-field">
    <div v-for="row of playField" class="row" :key="row.id">
      <transition-group name="list">
        <button
          v-for="cell of row.children"
          @click="select(cell)"
          class="cell"
          :class="[{ selected: cell.checked }, cell.color]"
          :key="cell.id"
        ></button>
      </transition-group>
    </div>
  </div>
</template>

<style scoped>
.container {
  height: 100vh;
  width: 100vw;
}
.play-field {
  display: flex;
  height: 600px;
  width: 900px;
  box-sizing: border-box;
}

.row {
  display: flex;
  flex-direction: column-reverse;
}

.cell {
  display: block;
  width: 60px;
  height: 60px;
}

.red {
  background-color: #ff4200;
  border: 1px solid #c43400;

}

.green {
  background-color: #00ff01;
  border: 1px solid #01c501;

}

.blue {
  background-color: #0031ff;
  border: 1px solid #0022ac;

}

.yellow {
  background-color: #ffff00;
  border: 1px solid #aaaa00;
}
.purple {
  background-color: #ff00fe;
  border: 1px solid #b300b3;
}

.selected {
  opacity: 0.7;
}

.list-move /* apply transition to moving elements */ {
  transition: transform 0.5s ease;
}

.list-enter-active,
.list-leave-active {
  transition: none;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>

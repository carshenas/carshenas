<script setup lang="ts">
const isOpen = defineModel<boolean>()
</script>

<template>
  <v-navigation-drawer
    v-model="isOpen"
    location="end"
    name="menu"
    tag="div"
    mobile-breakpoint="xxl"
    disable-resize-watcher
    disable-route-watcher
    touchless
    absolute
  >
    <v-list>
      <v-list-item v-for="n in 10" :key="n" append-icon="expand_more" title="Users">
        Hi bitch
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<template>
  <q-layout view="hHh Lpr lFf">
    <q-header class="my-header shadow-1" elevated>
      <q-toolbar>
        <q-toolbar-title> GBF 计数器 </q-toolbar-title>

        <q-btn flat round dense icon="minimize" @click="minimize" />
        <q-btn flat round dense icon="close" @click="close" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainLayout',

  setup() {
    return {};
  },

  methods: {
    minimize() {
      (window as any).api.minimize();
    },

    close() {
      (window as any).api.close();
    },
  },
});
</script>

<style lang="scss" scoped>
.my-header {
  -webkit-app-region: drag;
  -webkit-user-select: none;
  height: 50px;

  :deep(.q-btn) {
    -webkit-app-region: no-drag;
  }
}
</style>

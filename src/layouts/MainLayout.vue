<template>
  <q-layout view="hHh Lpr lFf">
    <q-header class="my-header shadow-1">
      <q-toolbar>
        <q-toolbar-title shrink> GBF 计数器 </q-toolbar-title>
        <q-tabs shrink inline-label indicator-color="yellow" align="justify" class="text-white">
          <q-route-tab to="/" icon="coffee" label="主页" />
          <q-route-tab to="/analysis" icon="analytics" label="统计" />
        </q-tabs>

        <q-space />

        <q-btn flat round dense icon="push_pin" @click="changeOnTop" />
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

    changeOnTop() {
      (window as any).api.changeOnTop();
    },
  },
});
</script>

<style lang="scss" scoped>
.my-header {
  -webkit-app-region: drag;
  -webkit-user-select: none;
  user-select: none;
  height: 50px;

  :deep(.q-btn) {
    -webkit-app-region: no-drag;
  }

  :deep(.q-tabs) {
    -webkit-app-region: no-drag;
  }
}
</style>
